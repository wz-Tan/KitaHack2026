import os
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google import genai

# Reuse Firebase client, helpers in db.py
from db import makedataframe

load_dotenv()

# Fetch data
def build_context_from_firebase(start_date: str = None, end_date: str = None) -> str:
    """
    Fetch ingredients, menu items, inventory, and sales records from Firestore,
    then summarise them into a concise text block for the LLM.
    """
    # Default last 30 days
    if not end_date:
        end_date = datetime.today().strftime("%Y-%m-%d")
    if not start_date:
        start_date = (datetime.today() - timedelta(days=30)).strftime("%Y-%m-%d")

    ingredients_df  = makedataframe("ingredients")
    menu_items_df   = makedataframe("menu_item")
    sales_df        = makedataframe("sales_record")
    inventory_df    = makedataframe("inventory")

    lines = []

    # Ingredient stock levels
    lines.append("=== CURRENT INGREDIENT STOCK ===")
    if not ingredients_df.empty:
        for iid, row in ingredients_df.iterrows():
            total = row.get("total", 0)
            lines.append(f"  {row.get('name', iid)} (id={iid}): {total} units in stock, "
                        f"shelf life={row.get('duration', '?')} days, "
                        f"unit cost=${row.get('price', '?')}")
    else:
        lines.append("  No ingredient data found.")

    # Menu items & their ingredients
    lines.append("\n=== MENU ITEMS ===")
    if not menu_items_df.empty:
        for mid, row in menu_items_df.iterrows():
            ingredient_detail = []
            for ing_id, qty in (row.get("ingredient") or {}).items():
                name = (ingredients_df.loc[ing_id]["name"]
                        if not ingredients_df.empty and ing_id in ingredients_df.index
                        else ing_id)
                ingredient_detail.append(f"{name}×{qty}")
            lines.append(f"  {row.get('name', mid)}: uses [{', '.join(ingredient_detail)}]")
    else:
        lines.append("  No menu item data found.")

    # Sales summary
    lines.append(f"\n=== SALES SUMMARY ({start_date} → {end_date}) ===")
    if not sales_df.empty:
        # Aggregate ingredient and menu item usage within date range
        ing_totals  = {}
        item_totals = {}
        for idx, row in sales_df.iterrows():
            if start_date <= str(idx) <= end_date:
                for iid, qty in (row.get("ingredient") or {}).items():
                    ing_totals[iid] = ing_totals.get(iid, 0) + qty
                for mid, qty in (row.get("menu_item") or {}).items():
                    item_totals[mid] = item_totals.get(mid, 0) + qty

        lines.append("  Menu item sales:")
        for mid, qty in sorted(item_totals.items(), key=lambda x: -x[1]):
            name = (menu_items_df.loc[mid]["name"]
                    if not menu_items_df.empty and mid in menu_items_df.index
                    else mid)
            lines.append(f"    {name}: {qty} sold")

        lines.append("  Ingredient consumption:")
        for iid, qty in sorted(ing_totals.items(), key=lambda x: -x[1]):
            name = (ingredients_df.loc[iid]["name"]
                    if not ingredients_df.empty and iid in ingredients_df.index
                    else iid)
            lines.append(f"    {name}: {qty} units consumed")

        # 4. Overstocking / waste
        lines.append("\n=== POTENTIAL OVERSTOCKING FLAGS ===")
        if not ingredients_df.empty:
            for iid, row in ingredients_df.iterrows():
                stock   = row.get("total", 0)
                consumed = ing_totals.get(iid, 0)
                shelf   = row.get("duration", 999)
                name    = row.get("name", iid)
                # Flag if stock > 3× consumed over the period OR large stock with zero sales
                if consumed == 0 and stock > 0:
                    lines.append(f"  ⚠ {name}: {stock} units stocked but ZERO consumption in period.")
                elif consumed > 0 and stock > 3 * consumed:
                    ratio = stock / consumed
                    lines.append(f"  ⚠ {name}: stock ({stock}) is {ratio:.1f}× consumption ({consumed}). "
                                f"Possible overstock (shelf life={shelf} days).")
    else:
        lines.append("  No sales data found for this period.")

    return "\n".join(lines)


def build_context_from_csv(sales_csv_path: str,
                            ingredients_csv_path: str = None,
                            menu_item_csv_path: str = None) -> str:
    """
    Build insight context purely from CSV files (useful when Firebase is unavailable).
    """
    lines = []
    sales_df = pd.read_csv(sales_csv_path)
    lines.append("=== SALES DATA (CSV) ===")
    lines.append(sales_df.describe(include="all").to_string())

    if ingredients_csv_path:
        ing_df = pd.read_csv(ingredients_csv_path)
        lines.append("\n=== INGREDIENTS (CSV) ===")
        lines.append(ing_df.to_string(index=False))

    if menu_item_csv_path:
        menu_df = pd.read_csv(menu_item_csv_path)
        lines.append("\n=== MENU ITEMS (CSV) ===")
        lines.append(menu_df.to_string(index=False))

    return "\n".join(lines)


# Gemini Insight Generator
SYSTEM_PROMPT = """
You are an expert restaurant operations analyst. 
You will be given structured data about a restaurant's inventory, menu items, and sales performance.
Your job is to:
1. Identify ingredients that are being overstocked relative to their sales velocity.
2. Highlight menu items with poor sales.
3. Suggest concrete, actionable purchasing or menu changes.
4. Be specific — mention ingredient names, quantities, and dollar impact where possible.
5. Keep insights concise and practical (bullet points preferred).
"""


def generate_insights(context: str, user_question: str = None) -> str:
    """Send context + optional question to Gemini and return the insight text."""
    client = genai.Client()

    question = user_question or (
        "Analyse the restaurant data and give me 5–10 prioritised, actionable insights "
        "about inventory purchasing, waste reduction, and menu performance."
    )

    prompt = f"""{SYSTEM_PROMPT}

--- RESTAURANT DATA ---
{context}

--- QUESTION ---
{question}
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt,
    )
    return response.text


# CLI Demo
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Restaurant Insight Chatbot")
    parser.add_argument("--source", choices=["firebase", "csv"], default="firebase",
                        help="Data source to use")
    parser.add_argument("--start", default=None, help="Start date YYYY-MM-DD (firebase mode)")
    parser.add_argument("--end",   default=None, help="End date   YYYY-MM-DD (firebase mode)")
    parser.add_argument("--sales-csv",       default=None)
    parser.add_argument("--ingredients-csv", default=None)
    parser.add_argument("--menu-csv",        default=None)
    parser.add_argument("--question", default=None,
                        help="Custom question to ask about the data")
    args = parser.parse_args()

    print("🔍 Gathering data...")

    if args.source == "firebase":
        context = build_context_from_firebase(args.start, args.end)
    else:
        if not args.sales_csv:
            raise ValueError("--sales-csv is required when --source=csv")
        context = build_context_from_csv(args.sales_csv, args.ingredients_csv, args.menu_csv)

    print("\n📊 Data context built. Generating insights...\n")
    insights = generate_insights(context, args.question)
    print("=" * 60)
    print(insights)
    print("=" * 60)

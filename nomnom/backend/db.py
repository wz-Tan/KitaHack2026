import csv
import ast
import os
from datetime import datetime, timezone, timedelta
from google.cloud.firestore_v1 import Increment
import pandas as pd
import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_credential"))

# Create Firebase App Object
app = firebase_admin.initialize_app(cred)

# Connect to Firestore
firestore_client = firestore.client(app)

# Writing Data into Firebase
# batch_data = [
#     {"date": datetime.now(), "items": [{"a1": 100}, {"a2": 200}]},
#     {"date": datetime.now(), "items": [{"a3": 300}, {"a4": 400}]},
#     {"date": datetime.now(), "items": [{"a5": 500}, {"a6": 600}]},
#     {"date": datetime.now(), "items": [{"a7": 700}, {"a8": 800}]},
#     {"date": datetime.now(), "items": [{"a9": 900}, {"a10": 1000}]},
#     {"date": datetime.now(), "items": [{"a1": 110}, {"a2": 220}]},
#     {"date": datetime.now(), "items": [{"a3": 330}, {"a4": 440}]},
#     {"date": datetime.now(), "items": [{"a5": 550}, {"a6": 660}]},
#     {"date": datetime.now(), "items": [{"a7": 770}, {"a8": 880}]},
#     {"date": datetime.now(), "items": [{"a9": 990}, {"a10": 1110}]},
# ]

# number = 1

# for batch in batch_data:
#     firestore_client.collection("inventory").document(f"batch_{number}").set(batch)
#     number += 1

# Retrieve All Fields from A Collection


#CREATING AND POPULATING PRE EXISTING TABLES USING CSV--------------------------------------------

#create and populate INGREDIENTS table
def create_ingredients(ingredients_input_csvpath):
    menu_input_df=pd.read_csv(ingredients_input_csvpath)
    for index,rows in menu_input_df.iterrows():
        doc=firestore_client.collection('ingredients').document(rows['ingredient_id']).get()
        if doc.exists:
            firestore_client.collection('ingredients').document(rows['ingredient_id']).update({'duration':int(rows['duration']),'name':rows['name'],'price':float(rows['price'])})
        else:
            firestore_client.collection('ingredients').document(rows['ingredient_id']).set({'duration':int(rows['duration']),'name':rows['name'],'price':float(rows['price'])})
        print(f"{rows['ingredient_id']} done in INGREDIENTS")
#create_ingredients('nomnom/backend/csv/ingredients.csv')

#create and populate MENU_ITEM table
def create_menu_item(menu_input_csvpath):
    menu_input_df=pd.read_csv(menu_input_csvpath)
    menu_input_df['ingredient']=menu_input_df['ingredient'].apply(ast.literal_eval)
    for index,rows in menu_input_df.iterrows():
        doc=firestore_client.collection('menu_item').document(rows['food_id']).get()
        if doc.exists:
            firestore_client.collection('menu_item').document(rows['food_id']).update({'ingredient':rows['ingredient'],'name':rows['name']})
        else:
            firestore_client.collection('menu_item').document(rows['food_id']).set({'ingredient':rows['ingredient'],'name':rows['name']})
        print(f"{rows['food_id']} done in MENU_ITEM")
#create_menu_item('nomnom/backend/csv/menu_item.csv')


#ADDING INVENTORY USING CSV-------------------------------------------------------------------------

#create and populate INVENTORY table and increase ingredient quantity in INGREDIENT table
def add_inventory(inventory_input_csvpath):
    inventory_input_df=pd.read_csv(inventory_input_csvpath)
    inventory_input_df['items']=inventory_input_df['items'].apply(ast.literal_eval)
    for index,rows in inventory_input_df.iterrows():
        doc=firestore_client.collection('inventory').document(rows['batch']).get()
        if doc.exists:
            firestore_client.collection('inventory').document(rows['batch']).update({'date':datetime.fromisoformat(rows['date']),'items':rows['items']})
        else:
            firestore_client.collection('inventory').document(rows['batch']).set({'date':datetime.fromisoformat(rows['date']),'items':rows['items']})
        print(f"{rows['batch']} done in INVENTORY")
        for item_id,quantity in rows['items'].items():
            firestore_client.collection('ingredients').document(item_id).update({"total":Increment(quantity), "batch":firestore.ArrayUnion([rows['batch']])})
            print(f"{item_id} done in INGREDIENTS")
#add_inventory('nomnom/backend/csv/inventory_input.csv')


#CREATING AND POPULATING PROCESSED TABLES USING FIREBASE DATAFRAME AND ORDER CSV

def makedataframe(collection):
    array=[]
    for x in firestore_client.collection(collection).get():
        dict=x.to_dict()
        dict['id']=x.id
        array.append(dict)
    df=pd.DataFrame(array)
    df=df.set_index('id')
    return df
df=pd.read_csv("nomnom/backend/csv/restaurant_order_history_mapped.csv")
menu_item = makedataframe("menu_item")
ingredients = makedataframe("ingredients")
inventory=makedataframe("inventory")


#create and populate CONSUMED_INGREDIENTS table using orderhistory csv
def ingredient_per_day(order_df,menu_item_df):
    try:
        dict=makedataframe('consumed_ingredients').fillna(0).to_dict(orient="index")
    except Exception:
        dict={}
    for index,row in order_df.iterrows():    
        foodarray=row['food_id'].split(", ")
        date=str(datetime.strptime(row['date'],"%d/%m/%Y").date())
        for foodid in foodarray:
            for ingredientid,ingredientquantity in menu_item_df.loc[foodid]['ingredient'].items():
                if dict.get(date) is None:
                    dict[date]={}
                dict[date][ingredientid]=dict[date].get(ingredientid,0)+ingredientquantity
    print(dict)
    for dict_id,dict_data in dict.items():
        firestore_client.collection('consumed_ingredients').document(str(dict_id)).set(dict_data)
        print(f"{dict_id} done")
#ingredient_per_day(df,menu_item)



#MINUS INVENTORY USING FIREBASE DATAFRAME AND ORDER CSV
def minus_inventory(dataframe,menu_item_df,ingredients_df,inventory_df):
    for index,row in dataframe.iterrows():
        foodarray=row['food_id'].split(",")
        date=datetime.strptime(row['date'],"%d/%m/%Y").date()
        time=datetime.strptime(row['time'],"%I:%M %p").time()
        orderdatetime=datetime.combine(date,time).replace(tzinfo=timezone.utc)
        for foodid in foodarray:
            #get ingredient id and quantity in MENU ITEMS
            for ingredientid,quantity in menu_item_df.loc[foodid]['ingredient'].items():
                #minus inventory in INGREDIENTS
                firestore_client.collection('ingredients').document(ingredientid).update({'total':Increment(-1*quantity)})
                print(f"minus {quantity} of {ingredientid} in INGREDIENTS")
                #get duration from INGREDIENTS
                duration=timedelta(days=int(ingredients_df.loc[ingredientid]['duration']))
                latestdate=orderdatetime-duration
                #sort accoding to date
                batcharray=ingredients_df.loc[ingredientid]['batch']
                sortedbatch=inventory_df[inventory_df['date']>=latestdate].sort_values(by="date").index.tolist()
                sortedarray=[key for key in sortedbatch if key in batcharray]
                batch=0
                length=len(sortedarray)
                quantityleft=quantity
                print(batcharray,sortedbatch,sortedarray,quantityleft,length)
                while quantityleft!=0 and batch<length:
                    batchquantity=firestore_client.collection('inventory').document(sortedarray[batch]).get().to_dict()['items'][ingredientid]
                    if batchquantity>0:
                        firestore_client.collection('inventory').document(sortedarray[batch]).update({f"items.{ingredientid}":Increment(-1*min(quantityleft,batchquantity))})
                        print(f"minus {min(quantityleft,batchquantity)} in INVENTORY {sortedarray[batch]} of {ingredientid}")
                        quantityleft=quantityleft-min(quantityleft,batchquantity)
                    batch+=1
#minus_inventory(df,menu_item,ingredients,inventory)



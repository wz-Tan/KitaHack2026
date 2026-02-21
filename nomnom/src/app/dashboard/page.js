"use client";

import { IoIosTimer } from "react-icons/io";
import { IoOptions } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CiBurger } from "react-icons/ci";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

export default function Page() {
  const [chartData, setChartData] = useState([
    {
      name: "Monday",
      uv: 0,
    },
    {
      name: "Tuesday",
      uv: 0,
    },
    {
      name: "Wednesday",
      uv: 0,
    },
    {
      name: "Thursday",
      uv: 0,
    },
    {
      name: "Friday",
      uv: 0,
    },
    {
      name: "Saturday",
      uv: 0,
    },
    {
      name: "Sunday",
      uv: 0,
    },
  ]);

  // Metrics
  const metrics = ["Ingredients", "Sales", "Menu Item"];

  // Example Food Items
  const [menuItems, setMenuItems] = useState(["Chicken Rice", "Noodles"]);
  const [ingredients, setIngredients] = useState([
    "Rice",
    "Chicken",
    "Coriander",
  ]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [timeSubcategory, setTimeSubcategory] = useState(0); // 0 for Hour, 1 for Daily
  const [showTimeSubcategory, setShowTimeSubcategory] = useState(false);

  const [metric, setMetric] = useState(metrics[0]);
  const [showMetric, setShowMetric] = useState(false);

  const [showSpecifics, setShowSpecifics] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(menuItems[0]);
  const [currentIngredient, setCurrentIngredient] = useState(ingredients[0]);

  async function retrieve_ingredient_list() {
    let res = await fetch("http://127.0.0.1:5000/dashboard/ingredients", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    res = await res.json();
    return res.ingredients;
  }

  async function retrieve_menu_items() {
    let res = await fetch("http://127.0.0.1:5000/dashboard/menu_items", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    res = await res.json();
    return res.menu_items;
  }

  // Query Analysis from Backend
  async function retrieve_data() {
    if (startDate != "" && endDate != "") {
      if (metric === "Sales") {
        let total_sales = await retrieve_sales();
        // Update Graph Data
        setChartData((prev) =>
          prev.map((item, index) => ({
            ...item,
            uv: total_sales[index].sum ?? item.uv, // fallback if undefined
          })),
        );
      } else if (metric === "Menu Item") {
        let menu_item_usage = await retrieve_menu_item_usage();
        setChartData((prev) =>
          prev.map((item, index) => ({
            ...item,
            uv: menu_item_usage[index].sum ?? item.uv, // fallback if undefined
          })),
        );
      } else if (metric === "Ingredients") {
        let ingredient_usage = await retrieve_ingredient_usage();
        setChartData((prev) =>
          prev.map((item, index) => ({
            ...item,
            uv: ingredient_usage[index].sum ?? item.uv, // fallback if undefined
          })),
        );
      }
    }
  }

  async function retrieve_ingredient_usage() {
    let res = await fetch("http://127.0.0.1:5000/dashboard/ingredients_usage", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        currentIngredient,
      }),
    });
    res = await res.json();
    return res.ingredient_usage;
  }

  async function retrieve_sales() {
    let res = await fetch("http://127.0.0.1:5000/dashboard/sales", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
      }),
    });
    res = await res.json();
    return res.sales;
  }

  async function retrieve_menu_item_usage() {
    let res = await fetch("http://127.0.0.1:5000/dashboard/menu_item_usage", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        currentMenuItem,
      }),
    });
    res = await res.json();
    return res.menu_item_usage;
  }

  // Start Up Queries
  useEffect(() => {
    async function init() {
      // Get Ingredients
      let fetchedIngredients = await retrieve_ingredient_list();
      setIngredients(fetchedIngredients);
      setCurrentIngredient(fetchedIngredients[0]);

      // Get Menu Items
      let fetchedMenuItems = await retrieve_menu_items();
      setMenuItems(fetchedMenuItems);
      setCurrentMenuItem(fetchedMenuItems[0]);
    }
    init();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col text-white w-full h-full gap-5 p-20">
        {/* Title and Selections */}

        <div className="flex flex-row flex-wrap justify-between">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Analytics Dashboard
          </h1>

          {/* Timing Selections */}
          <div className="flex flex-row gap-x-2 text-md font-medium">
            <div
              htmlFor="date-picker"
              className="flex items-center gap-2 rounded-lg border-zinc-400 border-2 bg-black text-white p-2"
            >
              <input
                id="startdate-picker"
                type="date"
                value={startDate}
                onChange={(e) => {
                  if (e.target.value <= endDate || endDate === "") {
                    setStartDate(e.target.value);
                  }
                }}
              />
              <p>-</p>
              <input
                id="enddate-picker"
                type="date"
                value={endDate}
                onChange={(e) => {
                  if (e.target.value >= startDate || startDate === "") {
                    setEndDate(e.target.value);
                  }
                }}
              />
            </div>

            {/* <div className="flex flex-col relative">
              <button
                onClick={() => {
                  setShowTimeSubcategory(!showTimeSubcategory);
                }}
                className="flex items-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2"
              >
                <IoIosTimer />
                <p>By {timeSubcategory ? "Day" : "Hour"}</p>
                {showTimeSubcategory ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {showTimeSubcategory && (
                <button
                  onClick={() => {
                    setTimeSubcategory(!timeSubcategory);
                    setShowTimeSubcategory(false);
                  }}
                  className="z-30 w-full flex items-center justify-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2 absolute top-15 hover:cursor-pointer hover:bg-zinc-300 hover:text-black transition duration-200 "
                >
                  <p>By {!timeSubcategory ? "Day" : "Hour"}</p>
                </button>
              )}
            </div>*/}

            {/* Metric Selection */}
            <div className="flex flex-col relative">
              <button
                onClick={() => {
                  setShowMetric(!showMetric);
                  setShowSpecifics(false);
                }}
                className="flex items-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2"
              >
                <IoOptions />
                <p>By {metric}</p>
                {showMetric ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              <div className="w-full absolute top-15 gap-2.5 flex flex-col">
                {showMetric
                  ? metrics.map((value, key) => {
                      if (metric != value) {
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              setMetric(value);
                              setShowMetric(false);
                            }}
                            className="z-30 w-full flex items-center justify-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2 hover:cursor-pointer hover:bg-zinc-300 hover:text-black transition duration-200 "
                          >
                            <p>By {value}</p>
                          </button>
                        );
                      }
                    })
                  : null}
              </div>
            </div>

            {/* Specific Selections */}
            {/* Menu Item */}
            {metric === "Menu Item" ? (
              <div className="flex flex-col relative">
                <button
                  onClick={() => {
                    setShowSpecifics(!showSpecifics);
                  }}
                  className="flex items-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2"
                >
                  <CiBurger />
                  <p>{currentMenuItem}</p>
                  {showSpecifics ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                <div className="w-full absolute top-15 gap-2.5 flex flex-col">
                  {showSpecifics
                    ? menuItems.map((value, key) => {
                        if (currentMenuItem != value) {
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setCurrentMenuItem(value);
                                setShowSpecifics(false);
                              }}
                              className="z-30 w-full flex items-center justify-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2 hover:cursor-pointer hover:bg-zinc-300 hover:text-black transition duration-200 "
                            >
                              <p>{value}</p>
                            </button>
                          );
                        }
                      })
                    : null}
                </div>
              </div>
            ) : null}

            {/* Ingredients */}
            {/* Menu Item */}
            {metric === "Ingredients" ? (
              <div className="flex flex-col relative">
                <button
                  onClick={() => {
                    setShowSpecifics(!showSpecifics);
                  }}
                  className="flex items-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2"
                >
                  <CiBurger />
                  <p>{currentIngredient}</p>
                  {showSpecifics ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                <div className="w-full absolute top-15 gap-2.5 flex flex-col">
                  {showSpecifics
                    ? ingredients.map((value, key) => {
                        if (currentIngredient != value) {
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setCurrentIngredient(value);
                                setShowSpecifics(false);
                              }}
                              className="z-30 w-full flex items-center justify-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2 hover:cursor-pointer hover:bg-zinc-300 hover:text-black transition duration-200 "
                            >
                              <p>{value}</p>
                            </button>
                          );
                        }
                      })
                    : null}
                </div>
              </div>
            ) : null}

            {/* Action Button */}
            <button
              onClick={async () => {
                await retrieve_data();
              }}
              className="flex items-center gap-1 rounded-lg border-black border-2 bg-white text-black p-2 px-10 hover:cursor-pointer hover:bg-green-600 hover:text-white transition-colors duration-200"
            >
              <p>Run Query</p>
            </button>
          </div>
        </div>

        {/* Dashboard Container*/}
        <div className="rounded-2xl p-2 flex flex-col w-full min-h-160">
          <ResponsiveContainer width="100%" aspect={3}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

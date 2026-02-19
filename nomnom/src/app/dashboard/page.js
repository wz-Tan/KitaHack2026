"use client";

import { IoIosTimer } from "react-icons/io";
import { IoOptions } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CiBurger } from "react-icons/ci";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

export default function Page() {
  // Metrics
  const metrics = ["Ingredients", "Sales", "Menu Item"];

  // Example Food Items
  const [menuItems, setMenuItems] = useState(["Chicken Rice", "Noodles"]);
  const [ingredients, setIngredients] = useState([
    "Rice",
    "Chicken",
    "Coriander",
  ]);

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

  const data = [
    {
      name: "Monday",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Tuesday",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Wednesday",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Thursday",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Friday",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Saturday",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Sunday",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

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
              <input id="startdate-picker" type="date" />
              <p>-</p>
              <input id="enddate-picker" type="date" />
            </div>

            <div className="flex flex-col relative">
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
            </div>

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
          </div>
        </div>

        {/* Dashboard Container*/}
        <div className="rounded-2xl p-2 flex flex-col w-full min-h-160">
          <LineChart
            style={{
              width: "100%",
              aspectRatio: 3,
              margin: "auto",
            }}
            responsive={true}
            data={data}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          </LineChart>
        </div>
      </main>
    </div>
  );
}

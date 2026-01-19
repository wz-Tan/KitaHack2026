"use client";

import { FaRegCalendar } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { IoOptions } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function Page() {
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

        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Dashboard
          </h1>

          {/* Timing Selections */}
          <div className="flex flex-row gap-x-2 text-md font-medium">
            <div className="flex items-center gap-2 rounded-lg border-zinc-400 border-2 bg-black text-white p-2">
              <FaRegCalendar />
              <p>18 - 25 November, 2026 </p>
              <FaChevronDown />
            </div>

            <div className="flex items-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2">
              <IoIosTimer />
              <p>Hourly</p>
              <FaChevronDown />
            </div>

            <div className="flex items-center gap-1 rounded-lg border-zinc-400 border-2 bg-black text-white p-2">
              <IoOptions />
              <p>Sales</p>
              <FaChevronDown />
            </div>
          </div>
        </div>

        {/* Dashboard Container*/}
        <div className="rounded-2xl p-2 flex flex-col w-full min-h-160">
          <LineChart
            style={{
              width: "100%",
              aspectRatio: 2,
              maxWidth: 1400,
              margin: "auto",
            }}
            responsive
            data={data}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          </LineChart>
        </div>
      </main>
    </div>
  );
}

import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col text-white w-full h-full gap-3 p-20">
        {/* Hero */}
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 text-center">
          Total Cost Saved
        </h1>
        <div className="bg-zinc-800 rounded-xl items-center  p-5 px-20 flex flex-col gap-2 w-fit self-center">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
            RM39000.00
          </h1>
          <p>Since 20th Februrary 2025</p>
        </div>

        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Statistics
        </h1>

        {/* Wasted Food Statistics */}
        <div className="flex flex-row flex-wrap gap-3">
          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <div className="flex w-fit p-1 px-3 rounded-xl items-center gap-2 bg-red-300 text-red-800">
              <p>10% </p>
              <FaArrowTrendDown />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              RM39000.00
            </h1>
            <p>Sales Last 30 Days</p>
          </div>

          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <div className="flex w-fit p-1 px-3 rounded-xl items-center gap-2 bg-green-300 text-green-800">
              <p>20% </p>
              <FaArrowTrendUp />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              RM10000.00
            </h1>
            <p>Sales Last 7 Days</p>
          </div>

          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <div className="flex w-fit p-1 px-3 rounded-xl items-center gap-2 bg-red-300 text-red-800">
              <p>30% </p>
              <FaArrowTrendUp />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              RM3300.00
            </h1>
            <p>Food Waste Last 30 Days</p>
          </div>

          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <div className="flex w-fit p-1 px-3 rounded-xl items-center gap-2 bg-green-300 text-green-800">
              <p>10% </p>
              <FaArrowTrendDown />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              RM100.00
            </h1>
            <p>Food Waste Last 7 Days</p>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-3">
          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <div className="flex w-fit p-1 px-3 rounded-xl items-center gap-2 bg-green-300 text-green-800">
              <p>10% </p>
              <FaArrowTrendDown />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              10%
            </h1>
            <p>Waste / Sales Last 30 Days</p>
          </div>

          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <div className="flex w-fit p-1 px-3 rounded-xl items-center gap-2 bg-green-300 text-green-800">
              <p>20% </p>
              <FaArrowTrendDown />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              1%
            </h1>
            <p>Waste / Sales Last 7 Days</p>
          </div>
        </div>

        {/* Actions - AI Generated*/}
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Suggested Actions
        </h1>

        <div className="flex flex-col gap-3 flex-wrap">
          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              Reduce Chicken Orders by 10KG Next Week
            </h1>
            <p>Saves RM500.00 in Food Waste</p>
          </div>

          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              Increase Rice Orders by 20KG For Next Month
            </h1>
            <p>Statistics Show a 50% Demand Increase in January.</p>
          </div>

          <div className="bg-zinc-800 rounded-xl items-start p-4 flex flex-col gap-2 pr-10 pl-5 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
              Increase Noodle Orders by 5KG For Next Month
            </h1>
            <p>Statistics Show a 20% Demand Increase in January.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

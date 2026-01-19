import { FaRegCalendar } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { IoOptions } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col text-white w-full h-full gap-5 p-20">
        {/* Title and Selections */}

        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Dashboard
          </h1>

          {/* Timing Selections */}
          <div className="flex flex-row gap-x-2">
            <div className="flex items-center gap-2 rounded-lg border-zinc-400 border-2 bg-black text-white p-1">
              <FaRegCalendar />
              <p>18 - 25 November, 2026 </p>
              <FaChevronDown />
            </div>

            <div className="flex items-center gap-2 rounded-lg border-zinc-400 border-2 bg-black text-white p-1">
              <IoIosTimer />
              <p>Hourly</p>
              <FaChevronDown />
            </div>
            
            <div className="flex items-center gap-2 rounded-lg border-zinc-400 border-2 bg-black text-white p-1">
              <IoOptions />
              <p>Sales</p>
              <FaChevronDown />
            </div>
          </div>
        </div>

        {/* Dashboard Container*/}
        <div className="rounded-2xl p-2 flex flex-col bg-zinc-500 w-full h-160"></div>
      </main>
    </div>
  );
}

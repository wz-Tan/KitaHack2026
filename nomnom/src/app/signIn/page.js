export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center gap-6 bg-white dark:bg-black p-8 rounded-2xl">
        <div className="flex flex-col items-center rounded-xl bg-zinc-800 p-10 min-w-3xl gap-2">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Sign In to NomNom
          </h1>
          <label
            htmlFor="emailInput"
            className="text-xl font-medium leading-8 text-start"
          >
            Email
          </label>
          <input
            id="emailInput"
            type="text"
            className="w-4/5 rounded-xl bg-white/10 p-3 text-white focus:outline-none focus:ring-0"
            placeholder="Enter Email Here"
          />
          <label
            htmlFor="passwordInput"
            className="text-xl font-medium leading-8"
          >
            Password
          </label>
          <input
            id="passwordInput"
            type="password"
            className="w-4/5 rounded-xl bg-white/10 p-3 text-white focus:outline-none focus:ring-0"
            placeholder="Enter Password Here"
          />
          <button className="p-2 px-6 rounded-xl text-xl bg-white text-black mt-5 transition duration-200 hover:cursor-pointer hover:bg-zinc-900 hover:text-white">
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
}

"use client";

export default function Home() {
  function handleFileUpload(e) {
    let uploadedFile = e.target.files[0];
    console.log("Uploaded file is ", uploadedFile);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center gap-6 bg-white dark:bg-black p-8 rounded-2xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Upload CSV File
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Upload your sales CSV and get instant insights to monitor food
            ingredient usage.
          </p>
        </div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
        />

        <label
          htmlFor="file-upload"
          className="rounded-2xl text-black p-3.5 bg-white mt-4 shadow-md hover:cursor-pointer"
        >
          Upload CSV Here
        </label>
      </main>
    </div>
  );
}

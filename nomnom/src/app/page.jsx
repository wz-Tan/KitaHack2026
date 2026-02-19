"use client";

export default function Home() {
  async function handleFileUpload(e, containerName) {
    // Package the file to be passed into backend
    let uploadedFile = e.target.files[0];
    let formData = new FormData();
    formData.append("file", uploadedFile);
    console.log("Form data is", formData);

    // Separate Function Calls
    if (containerName === "Add Inventory") {
      await fetch("http://127.0.0.1:5000/actions/add_inventory", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => console.log("response is", data));
    } else if (containerName === "Create Menu Item") {
      await fetch("http://127.0.0.1:5000/actions/create_menu_item", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => console.log("response is", data));
    } else if (containerName === "Create Ingredients") {
      await fetch("http://127.0.0.1:5000/actions/create_ingredients", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => console.log("response is", data));
    } else if (containerName === "Record Sales") {
      console.log("Recording sales");
      await fetch("http://127.0.0.1:5000/actions/record_sales", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => console.log("response is", data));
    } else {
      return;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center gap-6 bg-white dark:bg-black p-8 rounded-2xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Upload CSV File
          </h1>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            "Add Inventory",
            "Create Menu Item",
            "Create Ingredients",
            "Record Sales",
          ].map((title) => (
            <div
              key={title}
              className="flex flex-col items-center gap-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-md w-80"
            >
              <h2 className="text-xl font-medium text-black dark:text-zinc-50">
                {title}
              </h2>
              <input
                type="file"
                id={`file-upload-${title}`}
                className="hidden"
                accept=".csv"
                onChange={(e) => handleFileUpload(e, title)}
              />
              <label
                htmlFor={`file-upload-${title}`}
                className="rounded-lg text-white bg-blue-500 px-4 py-2 shadow-md hover:bg-blue-600 hover:cursor-pointer"
              >
                Upload
              </label>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

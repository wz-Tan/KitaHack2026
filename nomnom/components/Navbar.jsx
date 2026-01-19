import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full p-4 px-8 text-white flex flex-row justify-between items-center font-sans font-semibold bg-zinc-900 sticky top-0 z-50">
      <Link href="/">
        <p className="text-2xl">NomNom</p>
      </Link>
      <div className="flex flex-row gap-10">
        <Link href="/">
          <p>Home</p>
        </Link>
        <Link href="/dashboard">
          <p>Dashboard</p>
        </Link>
        <Link href="/insights">
          <p>Insights</p>
        </Link>
      </div>
      <Link href="/signIn">
        <p>Sign In</p>
      </Link>
    </div>
  );
}

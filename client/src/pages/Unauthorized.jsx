import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-5">
      <FaLock className="text-cyan-400 text-5xl" />
      <h1 className="text-3xl font-bold">Access Denied</h1>
      <p className="text-slate-400 text-center max-w-sm">
        You don't have permission to view this page. Please contact your
        administrator.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-sm font-medium hover:opacity-90 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

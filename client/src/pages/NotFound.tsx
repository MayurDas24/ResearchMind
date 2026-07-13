import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">

      <h1 className="text-7xl font-bold">
        404
      </h1>

      <p className="text-zinc-400">
        Page Not Found
      </p>

      <Link
        to="/"
        className="bg-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-500 transition"
      >
        Go Home
      </Link>

    </div>
  );
};

export default NotFound;
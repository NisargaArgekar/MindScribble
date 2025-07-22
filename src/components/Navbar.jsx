import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => (
  <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md shadow-md border-b border-gray-800">
    <div className="max-w-5xl mx-auto flex justify-between items-center px-4 py-3">
      <h1 className="text-2xl font-bold text-white tracking-wide">🧠 MindScribble</h1>
      <button
        onClick={() => signOut(auth)}
        className="bg-gradient-to-tr from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:brightness-110 transition duration-200"
      >
        Logout
      </button>
    </div>
  </header>
);

export default Navbar;

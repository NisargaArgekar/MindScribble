import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const Auth = () => {
  const [view, setView] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleLogin = async () => {
    resetMessages();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/home";
    } catch (err) {
      setErrorMsg("Invalid email or password.");
    }
  };

  const handleRegister = async () => {
    resetMessages();
    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMsg("Registration successful! You can now log in.");
      setView("login");
    } catch (err) {
      setErrorMsg("Email already in use or invalid.");
    }
  };

  const handleForgotPassword = async () => {
    resetMessages();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Reset link sent to your email.");
    } catch (err) {
      setErrorMsg("Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black text-white px-4">
      <div className="bg-black/30 border border-white/10 shadow-[0_0_30px_#8b5cf6] backdrop-blur-xl p-8 rounded-2xl w-full max-w-sm transition hover:scale-[1.01] duration-300">

        <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">
          {view === "login" && "Login"}
          {view === "register" && "Create Account"}
          {view === "forgot" && "Reset Password"}
        </h2>

        {errorMsg && (
          <div className="mb-3 text-sm text-red-400 text-center">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="mb-3 text-sm text-green-400 text-center">{successMsg}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 bg-black/40 border border-white/10 rounded-lg placeholder-purple-300 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"

          onChange={(e) => setEmail(e.target.value)}
        />

        {(view === "login" || view === "register") && (
          <input
            type="password"
            placeholder="Password"
           className="w-full mb-4 px-4 py-3 bg-black/40 border border-white/10 rounded-lg placeholder-purple-300 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"

            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {view === "login" && (
          <>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
            >
              Login
            </button>
            <div className="mt-4 text-sm text-center text-gray-400">
              <span
                className="cursor-pointer hover:underline text-purple-400"
                onClick={() => setView("forgot")}
              >
                Forgot Password?
              </span>{" "}
              |{" "}
              <span
                className="cursor-pointer hover:underline text-purple-400"
                onClick={() => setView("register")}
              >
                Register
              </span>
            </div>
          </>
        )}

        {view === "register" && (
          <>
            <button
              onClick={handleRegister}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
            >
              Register
            </button>
            <div className="mt-4 text-sm text-center text-gray-400">
              Already have an account?{" "}
              <span
                className="cursor-pointer hover:underline text-purple-400"
                onClick={() => setView("login")}
              >
                Login
              </span>
            </div>
          </>
        )}

        {view === "forgot" && (
          <>
            <button
              onClick={handleForgotPassword}
              className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white rounded-xl font-semibold shadow-md hover:shadow-purple-700 transition duration-300"

            >
              Send Reset Email
            </button>
            <div className="mt-4 text-sm text-center text-gray-400">
              Remember your password?{" "}
              <span
                className="cursor-pointer hover:underline text-purple-400"
                onClick={() => setView("login")}
              >
                Login
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;

import { useState } from "react";
import { auth } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Якщо реєструється адмін — одразу ведемо на /admin
      if (email === "admin2@boiko.com.ua") {
        navigate("/admin");
      } else {
        navigate("/test");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Якщо користувач є адміном — перенаправляємо на /admin
      if (user.email === "admin2@boiko.com.ua") {
        navigate("/admin");
      } else {
        navigate("/test");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Вхід / Реєстрація
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-between">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Увійти
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Зареєструватися
          </button>
        </div>
      </div>
    </div>
  );
}

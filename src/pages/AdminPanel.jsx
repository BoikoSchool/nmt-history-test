import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [status, setStatus] = useState("loading");
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialDuration, setInitialDuration] = useState(7200);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [lastPausedAt, setLastPausedAt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "testSession2", "current"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus(data.status);
        setInitialDuration(data.initialDuration || 7200);
        setPausedDuration(data.pausedDuration || 0);
        setStartTimestamp(data.startTimestamp?.seconds || null);
        setLastPausedAt(data.lastPausedAt || null);

        if (data.status === "waiting") {
          setTimeLeft(0);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let interval;

    if (status === "started" && startTimestamp !== null) {
      interval = setInterval(async () => {
        const now = Math.floor(Date.now() / 1000);
        const elapsed = now - startTimestamp - pausedDuration;
        const remaining = Math.max(initialDuration - elapsed, 0);

        setTimeLeft(remaining);

        if (remaining === 0) {
          // Автоматичне завершення сесії
          await updateDoc(doc(db, "testSession2", "current"), {
            status: "waiting",
            startTimestamp: null,
            pausedDuration: 0,
            lastPausedAt: null,
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, startTimestamp, pausedDuration, initialDuration]);

  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return "00:00:00";
    }
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleStart = async () => {
    const now = Math.floor(Date.now() / 1000);
    await updateDoc(doc(db, "testSession2", "current"), {
      status: "started",
      startTimestamp: { seconds: now },
      pausedDuration: 0,
      lastPausedAt: null,
    });
  };

  const handlePause = async () => {
    const now = Math.floor(Date.now() / 1000);
    await updateDoc(doc(db, "testSession2", "current"), {
      status: "paused",
      lastPausedAt: now,
    });
  };

  const handleResume = async () => {
    const now = Math.floor(Date.now() / 1000);
    const newPausedDuration = pausedDuration + (now - lastPausedAt);
    await updateDoc(doc(db, "testSession2", "current"), {
      status: "started",
      pausedDuration: newPausedDuration,
      lastPausedAt: null,
    });
    setPausedDuration(newPausedDuration);
  };

  const handleWaiting = async () => {
    await updateDoc(doc(db, "testSession2", "current"), {
      status: "waiting",
      startTimestamp: null,
      pausedDuration: 0,
      lastPausedAt: null,
    });
    setTimeLeft(0);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Панель адміністратора</h1>
        <button
          onClick={() => navigate("/results")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Результати
        </button>
      </div>
      <p className="mb-4">Статус: {status}</p>
      <p className="mb-4">Час залишився: {formatTime(timeLeft)}</p>

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Почати тест
        </button>
        <button
          onClick={handlePause}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Пауза
        </button>
        <button
          onClick={handleResume}
          className={`bg-green-600 text-white px-4 py-2 rounded ${
            status !== "paused" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={status !== "paused"}
        >
          Продовжити
        </button>
        <button
          onClick={handleWaiting}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Waiting
        </button>
      </div>
    </div>
  );
}

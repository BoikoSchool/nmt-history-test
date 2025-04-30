// ResultsPage.jsx

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { MathJaxContext } from "better-react-mathjax";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

// Шкала НМТ для англійська
const nmtMapEng = {
  5: 100,
  6: 109,
  7: 118,
  8: 125,
  9: 131,
  10: 134,
  11: 137,
  12: 140,
  13: 143,
  14: 145,
  15: 147,
  16: 148,
  17: 149,
  18: 150,
  19: 151,
  20: 152,
  21: 153,
  22: 155,
  23: 157,
  24: 159,
  25: 162,
  26: 166,
  27: 169,
  28: 173,
  29: 179,
  30: 185,
  31: 191,
  32: 200,
};

// Шкала НМТ для історії
const nmtMapHis = {
  8: 100,
  9: 105,
  10: 111,
  11: 116,
  12: 120,
  13: 124,
  14: 127,
  15: 130,
  16: 132,
  17: 134,
  18: 136,
  19: 138,
  20: 140,
  21: 141,
  22: 142,
  23: 143,
  24: 144,
  25: 145,
  26: 146,
  27: 147,
  28: 148,
  29: 149,
  30: 150,
  31: 151,
  32: 152,
  33: 154,
  34: 156,
  35: 158,
  36: 160,
  37: 163,
  38: 166,
  39: 168,
  40: 169,
  41: 170,
  42: 172,
  43: 173,
  44: 175,
  45: 177,
  46: 179,
  47: 181,
  48: 183,
  49: 185,
  50: 188,
  51: 191,
  52: 194,
  53: 197,
  54: 200,
};

// Повертає НМТ-бал для даного предмета й тестового балу
const getNmtScore = (subject, testScore) => {
  if (subject === "history") return nmtMapHis[testScore] ?? "н/д";
  if (subject === "eng") return nmtMapEng[testScore] ?? "н/д";
  return "н/д";
};

const ResultsPage = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const navigate = useNavigate();

  // Перевірка прав адміна
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email === "admin2@boiko.com.ua") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        navigate("/test");
      }
    });
    return () => unsub();
  }, [navigate]);

  // Завантажуємо всі відповіді
  useEffect(() => {
    if (!authorized) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "userAnswers2"));
        const dataByEmail = {};
        snap.docs.forEach((doc) => {
          const { userEmail: email, score = {}, results = [] } = doc.data();
          if (!dataByEmail[email]) {
            dataByEmail[email] = { score, results: [] };
          }
          dataByEmail[email].results.push(...results);
        });
        setGrouped(dataByEmail);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [authorized]);

  const toggleExpand = (email) =>
    setExpandedUsers((prev) => ({ ...prev, [email]: !prev[email] }));

  const formatAnswer = (ans) =>
    typeof ans === "object" ? Object.values(ans).join(", ") : ans;

  if (authorized === null) return <p>Перевірка доступу...</p>;
  if (!authorized) return null;
  if (loading) return <p>Завантаження результатів...</p>;

  return (
    <MathJaxContext>
      <div className="max-w-5xl mx-auto p-6">
        {/* Навігація */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Адміністрування
          </button>
          <h1 className="text-2xl font-bold">Результати тестів</h1>
          <button
            onClick={() => navigate("/test")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Пройти тест
          </button>
        </div>

        {/* Список користувачів */}
        <div className="space-y-4">
          {Object.entries(grouped).map(
            ([email, { score = {}, results = [] }]) => {
              const historyScore = score.history ?? 0;
              const engScore = score.eng ?? 0;

              return (
                <div key={email} className="bg-white shadow rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Email: {email}</p>
                      <p>
                        Історія України: {historyScore} / 54 — шкала НМТ:{" "}
                        {getNmtScore("history", historyScore)}
                      </p>
                      <p>
                        Анг. мова: {engScore} / 32 — шкала НМТ:{" "}
                        {getNmtScore("eng", engScore)}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleExpand(email)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedUsers[email] ? (
                        <Minus size={24} />
                      ) : (
                        <Plus size={24} />
                      )}
                    </button>
                  </div>

                  {expandedUsers[email] && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full bg-gray-50 rounded-lg">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 bg-gray-200">Предмет</th>
                            <th className="py-2 px-4 bg-gray-200">№ Питання</th>
                            <th className="py-2 px-4 bg-gray-200">
                              Ваша відповідь
                            </th>
                            <th className="py-2 px-4 bg-gray-200">
                              Правильна відповідь
                            </th>
                            <th className="py-2 px-4 bg-gray-200">Бали</th>
                            <th className="py-2 px-4 bg-gray-200">
                              Правильно?
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((item, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                              }
                            >
                              <td className="border px-4 py-2 text-center">
                                {item.subject === "history"
                                  ? "Історія України"
                                  : "Анг. мова"}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {item.questionId}
                              </td>
                              <td className="border px-4 py-2">
                                {formatAnswer(item.userAnswer)}
                              </td>
                              <td className="border px-4 py-2">
                                {formatAnswer(item.correctAnswer)}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {item.earnedPoints}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {item.isCorrect ? "Так" : "Ні"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </MathJaxContext>
  );
};

export default ResultsPage;

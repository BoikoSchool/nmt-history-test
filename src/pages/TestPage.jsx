// TestPage.jsx
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import QuestionRenderer from "../components/QuestionRenderer";
import { MathJaxContext } from "better-react-mathjax";

const mathJaxConfig = {
  loader: { load: ["[tex]/ams"] },
  tex: { packages: { "[+]": ["ams"] } },
};

const calculateMatchingPoints = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return 0;
  let points = 0;
  for (const key in correctAnswer) {
    if (userAnswer[key - 1] === correctAnswer[key]) {
      points++;
    }
  }
  return points;
};

const formatTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const TestPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersBySubject, setAnswersBySubject] = useState({
    history: {},
    eng: {},
  });
  const [questionsBySubject, setQuestionsBySubject] = useState({
    history: [],
    eng: [],
  });
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState("loading");
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [initialDuration, setInitialDuration] = useState(7200);
  const [timeLeft, setTimeLeft] = useState(7200);
  const [testCompleted, setTestCompleted] = useState(false);
  const [totalPoints, setTotalPoints] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [subject, setSubject] = useState("history");

  const questions = questionsBySubject[subject] || [];
  const answers = answersBySubject[subject] || {};
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const fetchQuestions = async (subjectToFetch) => {
      const collectionName =
        subjectToFetch === "history" ? "questionsHis" : "questionsEng";
      const snapshot = await getDocs(collection(db, collectionName));

      // Отримуємо дані з бази
      let data = snapshot.docs.map((doc) => {
        const docData = doc.data();

        // Перемішуємо варіанти відповіді, якщо це питання типу 'single'
        let options = docData.options;
        if (docData.type === "single" && Array.isArray(options)) {
          options = [...options].sort(() => Math.random() - 0.5);
        }

        return {
          ...docData,
          id: docData.id, // числовий id з бази
          options,
        };
      });

      // Сортуємо питання за числовим id
      data.sort((a, b) => a.id - b.id);

      setQuestionsBySubject((prev) => ({ ...prev, [subjectToFetch]: data }));
      setAnswersBySubject((prev) => ({
        ...prev,
        [subjectToFetch]: prev[subjectToFetch] || {},
      }));
      setLoading(false);
    };

    fetchQuestions("history");
    fetchQuestions("eng");
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "testSession2", "current"),
      (docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          setSessionStatus(data.status);
          setPausedDuration(data.pausedDuration || 0);
          setInitialDuration(data.initialDuration || 7200);
          setStartTimestamp(data.startTimestamp || null);
        } else {
          setSessionStatus("stopped");
        }
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (sessionStatus !== "started" || !startTimestamp) return;

    let startSeconds = null;
    if (startTimestamp?.seconds) {
      startSeconds = startTimestamp.seconds;
    } else if (typeof startTimestamp?.toMillis === "function") {
      startSeconds = Math.floor(startTimestamp.toMillis() / 1000);
    }

    if (startSeconds === null) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - startSeconds - pausedDuration;
      const remaining = Math.max(initialDuration - elapsed, 0);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStatus, startTimestamp, pausedDuration, initialDuration]);

  useEffect(() => {
    if (timeLeft === 0 && !hasSubmitted) {
      const timeout = setTimeout(() => {
        submitAnswers(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [timeLeft]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAnswer = (answer) => {
    setAnswersBySubject((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [currentQuestionIndex]: answer,
      },
    }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAnswers = async (autoSubmitted = false) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);

    const user = auth.currentUser;
    if (!user) {
      alert("Будь ласка, увійдіть у систему.");
      return;
    }

    const answerDocRef = doc(db, "userAnswers2", user.uid);
    const existing = await getDoc(answerDocRef);
    if (existing.exists()) {
      alert("Ви вже проходили тест.");
      return;
    }

    const allResults = [];
    const scores = {};

    for (const subj of ["history", "eng"]) {
      const subjQuestions = questionsBySubject[subj] || [];
      const subjAnswers = answersBySubject[subj] || {};
      let subjPoints = 0;
      const subjResults = subjQuestions
        .map((question, index) => {
          const userAnswer = subjAnswers[index];
          if (!userAnswer) return null;

          let earnedPoints = 0;
          if (question.type === "single") {
            earnedPoints = userAnswer === question.answer ? 1 : 0;
          } else if (question.type === "input") {
            earnedPoints = userAnswer === question.answer ? 2 : 0;
          } else if (question.type === "matching") {
            earnedPoints = calculateMatchingPoints(userAnswer, question.answer);
          }

          subjPoints += earnedPoints;

          return {
            subject: subj,
            questionId: question.id,
            questionType: question.type,
            userAnswer,
            correctAnswer: question.answer,
            earnedPoints,
            isCorrect:
              (question.type === "single" && earnedPoints === 1) ||
              (question.type === "input" && earnedPoints === 2) ||
              (question.type === "matching" && earnedPoints > 0),
          };
        })
        .filter(Boolean);

      allResults.push(...subjResults);
      scores[subj] = subjPoints;
    }

    await setDoc(answerDocRef, {
      uid: user.uid,
      userEmail: user.email,
      results: allResults,
      score: scores,
      submittedAt: serverTimestamp(),
      autoSubmitted,
    });

    setTotalPoints(scores);
    setTestCompleted(true);
  };

  if (loading || sessionStatus === "loading") return <p>Завантаження...</p>;

  if (testCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Дякуємо! Тест пройдено.
          </h2>
          <p className="text-lg text-gray-800">
            Історія України:{" "}
            <span className="font-semibold">{totalPoints.history ?? 0}</span>{" "}
            балів
            <br />
            Англійська мова:{" "}
            <span className="font-semibold">{totalPoints.eng ?? 0}</span> балів
          </p>
        </div>
      </div>
    );
  }

  if (sessionStatus === "paused") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-orange-500 text-xl font-semibold">
          Тест призупинено. Зачекайте на відновлення.
        </p>
      </div>
    );
  }

  if (sessionStatus !== "started") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl font-semibold">
          Тест ще не розпочато. Зачекайте, будь ласка.
        </p>
      </div>
    );
  }

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={() => {
              setSubject("history");
              setCurrentQuestionIndex(0);
            }}
            className={`px-4 py-2 rounded-lg font-semibold ${
              subject === "history" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Історія України
          </button>
          <button
            onClick={() => {
              setSubject("eng");
              setCurrentQuestionIndex(0);
            }}
            className={`px-4 py-2 rounded-lg font-semibold ${
              subject === "eng" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Англійська мова
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Питання{" "}
            <span className="text-orange-600">{currentQuestionIndex + 1}</span>{" "}
            з {questions.length}
          </h1>
          <div className="text-xl font-mono text-blue-600">
            Час залишився: {formatTime(timeLeft)}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => {
                if (window.confirm("Ви впевнені, що бажаєте завершити тест?")) {
                  submitAnswers(false);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
            >
              Завершити тест
            </button>
          </div>
        </div>

        {userEmail && (
          <div className="mb-4 text-right text-sm text-gray-600">
            Ви увійшли як: <span className="font-semibold">{userEmail}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <QuestionRenderer
            key={`${subject}-${currentQuestionIndex}`}
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={answers[currentQuestionIndex] || null}
          />
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Назад
          </button>
          <button
            onClick={goToNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Далі
          </button>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default TestPage;

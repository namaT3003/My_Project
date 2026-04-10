import { useState } from "react";

export default function Practice() {
  const [topic, setTopic] = useState("Binary Search");
  const [difficulty, setDifficulty] = useState("easy");
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setStarted(false);
    setFinished(false);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setQuestions([]);

    try {
      const response = await fetch("http://localhost:5001/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic, difficulty })
      });

      const data = await response.json();

      if (response.ok && data.questions && data.questions.length > 0) {
        const processedQuestions = data.questions.map((q) => ({
          ...q,
          answer:
            typeof q.answer === "string" ? q.options.indexOf(q.answer) : q.answer
        }));

        setQuestions(processedQuestions);
        setStarted(true);
      } else {
        alert("Quiz load nahi hua.");
      }
    } catch (error) {
      alert("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (selected === null) {
      alert("Pehle ek option select kar.");
      return;
    }

    if (selected === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setQuestions([]);
  };

  return (
    <main className="practice-page">
      <section className="practice-header">
        <p className="dashboard-tag">AI Practice Zone</p>
        <h1>Practice Quiz</h1>
        <p className="practice-subtext">
          Choose a topic and difficulty, then test yourself with smart questions.
        </p>
      </section>

      <section className="practice-panel">
        {!started ? (
          <div className="practice-setup">
            {loading ? (
              <p className="learn-placeholder">Loading quiz questions...</p>
            ) : (
              <div className="practice-controls">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter topic like Binary Search"
                />

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <button className="primary-btn" onClick={startQuiz}>
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        ) : finished ? (
          <div className="practice-result-card">
            <h2>Your Score: {score}/{questions.length}</h2>
            <p>
              Topic: <strong>{topic}</strong> | Difficulty: <strong>{difficulty}</strong>
            </p>
            <button className="primary-btn" onClick={restartQuiz}>
              Try Another Quiz
            </button>
          </div>
        ) : (
          <div className="practice-quiz-card">
            <div className="practice-meta">
              <span>Topic: <strong>{topic}</strong></span>
              <span>Difficulty: <strong>{difficulty}</strong></span>
            </div>

            <h2 className="practice-question">{questions[current]?.question}</h2>

            <div className="practice-options">
              {questions[current]?.options.map((opt, i) => (
                <button
                  key={i}
                  className={selected === i ? "practice-option selected-option" : "practice-option"}
                  onClick={() => setSelected(i)}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button className="primary-btn" onClick={handleNext}>
              {current + 1 === questions.length ? "Finish Quiz" : "Next"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
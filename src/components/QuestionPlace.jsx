import { useState, useEffect } from "react";
import "./Questions.css";
import questions from "./questions.json";

function QuestionPlace() {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      setIsAnswered(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("quizState"));
    if (savedState) {
      setQuestionNumber(savedState.questionNumber);
      setCorrectScore(savedState.correctScore);
      setIsAnswered(savedState.isAnswered);
      setSelectedOption(savedState.selectedOption);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "quizState",
      JSON.stringify({
        questionNumber,
        correctScore,
        isAnswered,
        selectedOption
      })
    );
  }, [questionNumber, correctScore, isAnswered, selectedOption]);

  const handleRestart = () => {
    localStorage.removeItem("quizState");
    setQuestionNumber(0);
    setCorrectScore(0);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleOption = (isCorrect, index) => {
    if (!isAnswered) {
      setSelectedOption(index);
      if (isCorrect) {
        setCorrectScore(correctScore + 1);
      }
      setIsAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (isAnswered) {
      setQuestionNumber(questionNumber + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTimeLeft(30);
    }
  };

  const isQuizComplete = questionNumber >= questions.length;

  return (
    <div className="container App-header">
      <div className="quiz">
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${(questionNumber / questions.length) * 100}%`
            }}
          ></div>
        </div>
        {isQuizComplete ? (
          <>
            <h1>Quiz Completed!</h1>
            <p>
              Your final score is {correctScore} out of {questions.length}
            </p>
            <button className="restart-btn" onClick={handleRestart}>
              Restart Quiz
            </button>
          </>
        ) : (
          <>
            <h1>Welcome to the Quiz App!</h1>
            <hr />
            <p className="questionText">
              {questions[questionNumber].id}. {questions[questionNumber].q}
            </p>
            <ul className="options">
              {questions[questionNumber].options.map((item, index) => (
                <li
                  key={index}
                  className={`option ${
                    isAnswered
                      ? selectedOption === index
                        ? item.isCorrect
                          ? "correct"
                          : "incorrect"
                        : item.isCorrect
                        ? "correct"
                        : ""
                      : ""
                  }`}
                  onClick={() => handleOption(item.isCorrect, index)}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleOption(item.isCorrect, index);
                  }}
                  aria-selected={selectedOption === index}
                >
                  {item.text}
                </li>
              ))}
            </ul>

            <p>
              Question {questionNumber + 1} from {questions.length}
            </p>
            <div className="timer">Time left: {timeLeft} seconds</div>

            <button
              className="next-btn"
              onClick={handleNextQuestion}
              disabled={!isAnswered}
            >
              Next Question
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default QuestionPlace;

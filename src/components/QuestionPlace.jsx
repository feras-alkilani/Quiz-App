import { useState } from "react";
import "./Questions.css";
import questions from "./questions.json";

function QuestionPlace() {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleRestart = () => {
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
    }
  };

  const isQuizComplete = questionNumber >= questions.length;

  return (
    <div className="container App-header">
      <div className="quiz">
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
                  className={
                    isAnswered && selectedOption === index && item.isCorrect
                      ? "correct"
                      : isAnswered &&
                        selectedOption === index &&
                        !item.isCorrect
                      ? "incorrect"
                      : ""
                  }
                  onClick={() => handleOption(item.isCorrect, index)}
                >
                  {item.text}
                </li>
              ))}
            </ul>
            <p>
              Question {questionNumber + 1} from {questions.length}
            </p>
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

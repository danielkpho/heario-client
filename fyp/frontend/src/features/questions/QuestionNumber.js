import React from "react";

export default function QuestionNumber({ currQuestion, numOfQuestions }) {
  if (currQuestion > numOfQuestions) {
    return <div className="question-number">Results</div>;
  }
  return (
    <div className="question-number">
      Question {currQuestion} of {numOfQuestions}
    </div>
  );
}
import React from "react";
import { currentQuestion } from "./questionsSlice";
import { useSelector } from "react-redux";

export default function SingleQuestion() {
  const question = useSelector(currentQuestion);
  if (!question) return null;
  return <div className="single-question">{question}</div>;
}
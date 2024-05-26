// src/App.jsx
import React, { useState } from "react";
import Perguntas from "./Perguntas";
import Resultados from "./Resultados";
import './App.css';

const App = () => {
  const [respostas, setRespostas] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "encanamento",
    "instalacao",
    "chaveiro",
    "eletricista"
  ];

  const handleNext = (categoria, resposta) => {
    setRespostas([...respostas, [categoria, resposta]]);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  if (currentStep < steps.length) {
    return (
      <div className="container">
        <Perguntas step={steps[currentStep]} onNext={handleNext} />
      </div>
    );
  }

  return (
    <div className="container">
      <Resultados respostas={respostas} />
    </div>
  );
};

export default App;

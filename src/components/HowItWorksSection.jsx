import React from "react";
import "./HowItWorksSection.css";

const steps = [
  {
    title: "Simule",
    description: "Em 30 segundos, sem compromisso.",
  },
  {
    title: "Autorize no SouGov",
    description: "Seguimos juntos no passo a passo ilustrado.",
  },
  {
    title: "Envie documentos",
    description: "Contracheque (PDF), extrato de consignações e RG/CPF.",
  },
  {
    title: "Dê Anuência",
    description: "Após a anuência, a liberação costuma ocorrer em D+0/D+1.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" data-section>
      <div className="section-shell how-it-works">
        <h2>Como funciona</h2>
        <div className="timeline">
          {steps.map((step, index) => (
            <div className="timeline__item" key={step.title}>
              <div className="timeline__index">{index + 1}</div>
              <div className="timeline__content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

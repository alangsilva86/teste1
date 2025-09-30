import React from "react";
import { microcopy } from "../content/microcopy";
import "./FAQSection.css";

const faqs = [
  {
    question: "Quem pode contratar?",
    answer: "PRF Ativos, aposentados e pensionistas do SIAPE.",
  },
  {
    question: "Qual a margem?",
    answer: "Até 45% (35% empréstimos + 5% cartão consignado + 5% cartão benefício).",
  },
  {
    question: "Qual a taxa?",
    answer: "A partir de 1,69% a.m. homologada por ASPRF e SinPRF-PR, sujeita a análise.",
  },
  {
    question: "Qual o prazo?",
    answer: "Até 96x, com habilitação conforme regras internas.",
  },
  {
    question: "Limite por idade?",
    answer: "Aplicamos automaticamente o teto estimado por faixa etária conforme SIAPE.",
  },
  {
    question: "Como recebo?",
    answer: "Na mesma conta do contracheque (SIAPE).",
  },
  {
    question: "É seguro?",
    answer: `${microcopy.control} ${microcopy.dataProtection}`,
  },
];

const FAQSection = () => {
  return (
    <section id="faq" data-section>
      <div className="section-shell faq">
        <h2>Perguntas frequentes</h2>
        <div className="faq__list">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

import React, { useState } from "react";

const PerguntasEncanamento = ({ onRespostasChange }) => {
  const [respostas, setRespostas] = useState({});

  const handleChange = (e) => {
    setRespostas({ ...respostas, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onRespostasChange(respostas);
  };

  return (
    <div>
      <h2>Perguntas sobre Encanamento</h2>
      <label>
        No ultimo ano você precisou ou fez você mesmo serviços hidráulicos?
        <select name="encanamento" onChange={handleChange}>
          <option value="nao">Não</option>
          <option value="sim">Sim</option>
        </select>
      </label>
      {respostas.encanamento === "sim" && (
        <label>
          Quantas vezes no ultimo ano aproximadamente?
          <select name="vezesEncanamento" onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5 ou mais">5 ou mais</option>
          </select>
        </label>
      )}
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default PerguntasEncanamento;

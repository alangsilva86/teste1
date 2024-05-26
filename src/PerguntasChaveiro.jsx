import React, { useState } from "react";

const PerguntasChaveiro = ({ onRespostasChange }) => {
  const [respostas, setRespostas] = useState({});

  const handleChange = (e) => {
    setRespostas({ ...respostas, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onRespostasChange(respostas);
  };

  return (
    <div>
      <h2>Perguntas sobre Chaveiro</h2>
      <label>
        Quantas vezes você precisou de um chaveiro para abrir portas trancadas
        no último ano?
        <select name="chaveiro" onChange={handleChange}>
          <option value="nunca">Nunca</option>
          <option value="1 vez">1 vez</option>
          <option value="2 vezes">2 vezes</option>
          <option value="mais de 2 vezes">Mais de 2 vezes</option>
        </select>
      </label>
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default PerguntasChaveiro;

import React from "react";
import { useNavigate } from "react-router-dom";

const Perguntas = ({ perguntas, passo, onResposta }) => {
  const navigate = useNavigate();

  if (passo >= perguntas.length) {
    navigate("/resultados");
    return null;
  }

  const { pergunta, opcoes, subPerguntas } = perguntas[passo];

  return (
    <div>
      <h2>{pergunta}</h2>
      {opcoes.map((opcao) => (
        <button key={opcao} onClick={() => onResposta(pergunta, opcao)}>
          {opcao}
        </button>
      ))}
    </div>
  );
};

export default Perguntas;

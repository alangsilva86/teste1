// src/Resultados.jsx
import React, { useEffect, useState } from 'react';

const custos = {
  encanamento: { 1: 50, 2: 70, 3: 390, 4: 1000 },
  instalacao: { 1: 260, 2: 260, 3: 260, 4: 260 },
  chaveiro: { 1: 150, 2: 300, 3: 100, 4: 250 },
  eletricista: { 1: 150, 2: 600, 3: 50, 4: 300 },
};

function calcularCustos(respostas) {
  let totalMin = 0;
  let totalMax = 0;

  respostas.forEach((resposta) => {
    const [categoria, vezes] = resposta;
    totalMin += custos[categoria][vezes] * vezes;
    totalMax += custos[categoria][vezes] * vezes;
  });

  return { totalMin, totalMax };
}

const Resultados = ({ respostas }) => {
  const [resultados, setResultados] = useState({ totalMin: 0, totalMax: 0 });

  useEffect(() => {
    const { totalMin, totalMax } = calcularCustos(respostas);
    setResultados({ totalMin, totalMax });
  }, [respostas]);

  return (
    <div className="resultados">
      <h2>Resultados</h2>
      <table>
        <thead>
          <tr>
            <th>Serviço</th>
            <th>Frequência Anual</th>
            <th>Custo Médio por Ocorrência (R$)</th>
            <th>Custo Anual Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          {respostas.map(([categoria, vezes], index) => (
            <tr key={index}>
              <td>{categoria}</td>
              <td>{vezes}</td>
              <td>{custos[categoria][vezes]}</td>
              <td>{custos[categoria][vezes] * vezes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Geral Sem Seguro: R$ {resultados.totalMin} a R$ {resultados.totalMax}</p>
      <p>Custo Anual do Seguro Residencial: R$ 150 a R$ 400</p>
      <p>Economia Potencial com Seguro: R$ {resultados.totalMin - 400} a R$ {resultados.totalMax - 150}</p>
    </div>
  );
};

export default Resultados;

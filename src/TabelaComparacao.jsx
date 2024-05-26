import React from "react";

const TabelaComparacao = ({ encanamento, chaveiro, eletricista }) => {
  const calcularCusto = (frequencia, custoPorOcorrencia) => {
    return frequencia * custoPorOcorrencia;
  };

  const custos = {
    encanamento: calcularCusto(encanamento.frequencia || 0, 390),
    chaveiro: calcularCusto(chaveiro.frequencia || 0, 200),
    eletricista: calcularCusto(eletricista.frequencia || 0, 300),
  };

  const total = custos.encanamento + custos.chaveiro + custos.eletricista;

  return (
    <div>
      <h2>Tabela de Comparação de Custos</h2>
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
          <tr>
            <td>Encanamento</td>
            <td>{encanamento.frequencia || 0}</td>
            <td>R$ 390</td>
            <td>R$ {custos.encanamento}</td>
          </tr>
          <tr>
            <td>Chaveiro</td>
            <td>{chaveiro.frequencia || 0}</td>
            <td>R$ 200</td>
            <td>R$ {custos.chaveiro}</td>
          </tr>
          <tr>
            <td>Eletricista</td>
            <td>{eletricista.frequencia || 0}</td>
            <td>R$ 300</td>
            <td>R$ {custos.eletricista}</td>
          </tr>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td colSpan="3">
              <strong>R$ {total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TabelaComparacao;

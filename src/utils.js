export const calcularResultados = (respostas) => {
  // Example calculations based on the responses
  const totalSemSeguro = { min: 0, max: 0 };
  const economia = { min: 0, max: 0 };

  if (respostas.encanamento === "sim") {
    const vezes = parseInt(respostas.vezesEncanamento, 10);
    totalSemSeguro.min += vezes * 50;
    totalSemSeguro.max += vezes * 70;
  }

  // Continue for other categories and responses...

  economia.min = totalSemSeguro.min - 150;
  economia.max = totalSemSeguro.max - 400;

  return { totalSemSeguro, economia };
};

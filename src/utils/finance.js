export const calculatePrincipalFromInstallment = (installment, monthlyRate, installments) => {
  if (!monthlyRate) return installment * installments;
  const i = monthlyRate;
  const n = installments;
  const numerator = 1 - Math.pow(1 + i, -n);
  return installment * (numerator / i);
};

export const calculateInstallmentFromPrincipal = (principal, monthlyRate, installments) => {
  if (!monthlyRate) return principal / installments;
  const i = monthlyRate;
  const n = installments;
  return principal * (i / (1 - Math.pow(1 + i, -n)));
};

export const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

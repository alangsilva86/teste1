export const businessRules = {
  taxa_padrao_ao_mes: 0.0169,
  prazos_habilitados: [24, 36, 48, 72, 96],
  habilitar_96x: false,
  idade_min: 21,
  idade_max_limite: {
    anos: 79,
    meses: 11,
    dias: 29,
  },
  tetos_por_idade: [
    { min: 21, max: 67, teto: 200000 },
    { min: 68, max: 69, teto: 150000 },
    { min: 70, max: 70, teto: 120000 },
    { min: 71, max: 71, teto: 100000 },
    { min: 72, max: 72, teto: 75000 },
    { min: 73, max: 73, teto: 50000 },
    { min: 74, max: 78, teto: 20000 },
  ],
  valor_min_contrato: { ativo: 600, aposentado: 800, pensionista: 800 },
  max_contratos_por_cpf: 9,
  tempo_min_emprego_meses: 12,
  renda_minima: 1.5,
};

export const getAgeBreakdown = (birthDate) => {
  if (!birthDate) {
    return null;
  }
  const birth = new Date(birthDate);
  const today = new Date();

  if (Number.isNaN(birth.getTime()) || birth > today) {
    return { years: 0, months: 0, days: 0, isOutOfRange: true };
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const minAge = businessRules.idade_min;
  const maxAge = businessRules.idade_max_limite;

  const isBelowMinimum = years < minAge;
  const exceedsMax =
    years > maxAge.anos ||
    (years === maxAge.anos && months > maxAge.meses) ||
    (years === maxAge.anos && months === maxAge.meses && days > maxAge.dias);

  return {
    years,
    months,
    days,
    isOutOfRange: isBelowMinimum || exceedsMax,
  };
};

export const getMaxPrincipalForAge = (age) => {
  if (!age && age !== 0) return null;
  const faixa = businessRules.tetos_por_idade.find((range) => age >= range.min && age <= range.max);
  return faixa ? faixa.teto : null;
};

export const isInstallmentEnabled = (installments) => {
  if (installments === 96 && businessRules.habilitar_96x === false) {
    return false;
  }
  return businessRules.prazos_habilitados.includes(installments);
};

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  businessRules,
  getAgeBreakdown,
  getMaxPrincipalForAge,
  isInstallmentEnabled,
} from "../config/businessRules";
import { calculatePrincipalFromInstallment, calculateInstallmentFromPrincipal } from "../utils/finance";
import { buildWhatsAppMessage } from "../utils/whatsapp";

const STORAGE_KEY = "prf-financas-simulation";

const defaultState = {
  personal: {
    matricula: "",
    profile: "ativo",
    birthDate: "",
    nome: "",
  },
  finance: {
    margin: 1000,
    installments: businessRules.prazos_habilitados[0],
  },
  result: null,
  alerts: [],
  documents: {
    contracheque: null,
    extrato: null,
    documento: null,
  },
  documentsSubmitted: false,
  lastUpdated: null,
};

const SimulationContext = createContext();

const loadState = () => {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored);
    return {
      ...defaultState,
      ...parsed,
      personal: { ...defaultState.personal, ...parsed.personal },
      finance: { ...defaultState.finance, ...parsed.finance },
      documents: { ...defaultState.documents, ...parsed.documents },
    };
  } catch (error) {
    console.warn("Não foi possível carregar simulação salva", error);
    return defaultState;
  }
};

export const SimulationProvider = ({ children }) => {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        personal: state.personal,
        finance: state.finance,
        result: state.result,
        alerts: state.alerts,
        documents: state.documents,
        documentsSubmitted: state.documentsSubmitted,
        lastUpdated: state.lastUpdated,
      })
    );
  }, [state]);

  const updatePersonal = useCallback((payload) => {
    setState((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...payload },
      alerts: [],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateFinance = useCallback((payload) => {
    setState((prev) => ({
      ...prev,
      finance: { ...prev.finance, ...payload },
      alerts: [],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const setDocuments = useCallback((documents) => {
    setState((prev) => ({
      ...prev,
      documents: { ...prev.documents, ...documents },
      documentsSubmitted: false,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const markDocumentsSubmitted = useCallback(() => {
    setState((prev) => ({
      ...prev,
      documentsSubmitted: true,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const resetSimulation = useCallback(() => {
    setState({ ...defaultState, lastUpdated: new Date().toISOString() });
  }, []);

  const computeResult = useCallback(() => {
    const { personal, finance } = state;
    const alerts = [];

    if (!personal.birthDate) {
      alerts.push("Precisamos da sua data de nascimento para concluir a simulação.");
    }

    const age = personal.birthDate ? getAgeBreakdown(personal.birthDate) : null;
    if (age && age.isOutOfRange) {
      alerts.push(
        "Para sua faixa etária, a simulação online não está disponível. Fale com um especialista para avançar."
      );
    }

    const margemInformada = Number(finance.margin || 0);
    if (!margemInformada || margemInformada < 100) {
      alerts.push("Informe uma margem disponível a partir de R$ 100.");
    }

    if (!isInstallmentEnabled(finance.installments)) {
      alerts.push("Prazo selecionado indisponível. Escolha outro prazo.");
    }

    if (alerts.length > 0) {
      setState((prev) => ({ ...prev, alerts, result: null }));
      return { success: false, alerts };
    }

    const mensalRate = businessRules.taxa_padrao_ao_mes;
    const parcelaMaxima = margemInformada;
    let principalEstimado = calculatePrincipalFromInstallment(
      parcelaMaxima,
      mensalRate,
      finance.installments
    );

    const tetoPorIdade = age ? getMaxPrincipalForAge(age.years) : null;
    if (tetoPorIdade && principalEstimado > tetoPorIdade) {
      principalEstimado = tetoPorIdade;
      alerts.push(
        `Para sua faixa etária, o limite estimado é R$ ${tetoPorIdade.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}. Ajustamos automaticamente.`
      );
    }

    const valorMinimo = businessRules.valor_min_contrato[personal.profile] ?? 0;
    if (valorMinimo && principalEstimado < valorMinimo) {
      alerts.push(
        `O valor mínimo estimado para ${personal.profile} é R$ ${valorMinimo.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}. Podemos ajustar durante o atendimento humano.`
      );
    }

    const installmentValue = calculateInstallmentFromPrincipal(
      principalEstimado,
      mensalRate,
      finance.installments
    );

    const totalPago = installmentValue * finance.installments;

    const result = {
      installmentValue,
      principal: principalEstimado,
      installments: finance.installments,
      rate: mensalRate,
      total: totalPago,
      whatsAppMessage: buildWhatsAppMessage({
        nome: personal.nome,
        valor: principalEstimado,
        prazo: finance.installments,
      }),
    };

    setState((prev) => ({
      ...prev,
      alerts,
      result,
      lastUpdated: new Date().toISOString(),
    }));

    return { success: true, result, alerts };
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      updatePersonal,
      updateFinance,
      setDocuments,
      markDocumentsSubmitted,
      computeResult,
      resetSimulation,
    }),
    [computeResult, markDocumentsSubmitted, resetSimulation, setDocuments, state, updateFinance, updatePersonal]
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation deve ser usado dentro de SimulationProvider");
  }
  return context;
};

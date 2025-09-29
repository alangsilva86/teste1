import React, { useEffect, useMemo, useState } from "react";
import { useSimulation } from "../../context/SimulationContext";
import { businessRules, getAgeBreakdown, isInstallmentEnabled } from "../../config/businessRules";
import { formatCurrency } from "../../utils/finance";
import useAnalytics from "../../hooks/useAnalytics";
import "./SimulatorSection.css";

const profileOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "aposentado", label: "Aposentado" },
  { value: "pensionista", label: "Pensionista" },
];

const installmentsOptions = businessRules.prazos_habilitados.filter((prazo) =>
  prazo === 96 ? businessRules.habilitar_96x : true
);

const SimulatorSection = () => {
  const { state, updatePersonal, updateFinance, computeResult } = useSimulation();
  const { trackEvent } = useAnalytics();
  const [step, setStep] = useState(1);
  const [localErrors, setLocalErrors] = useState([]);
  const [marginValue, setMarginValue] = useState(Number(state.finance.margin) || 1000);
  const [selectedInstallments, setSelectedInstallments] = useState(state.finance.installments);

  useEffect(() => {
    trackEvent("view_sim_step1");
  }, [trackEvent]);

  const ageInfo = useMemo(() => getAgeBreakdown(state.personal.birthDate), [state.personal.birthDate]);

  useEffect(() => {
    setMarginValue(Number(state.finance.margin) || 1000);
    setSelectedInstallments(state.finance.installments);
  }, [state.finance.installments, state.finance.margin]);

  const handleStep1Submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const matricula = formData.get("matricula");
    const profile = formData.get("profile");
    const nome = formData.get("nome")?.trim();
    const birthDate = formData.get("birthDate");

    const errors = [];
    if (!/^[0-9]{6,8}$/.test(matricula)) {
      errors.push("Informe uma matrícula SIAPE válida (6 a 8 dígitos).");
    }

    if (!birthDate) {
      errors.push("Informe sua data de nascimento.");
    } else {
      const breakdown = getAgeBreakdown(birthDate);
      if (breakdown.isOutOfRange) {
        errors.push(
          "Para sua faixa etária, finalize pelo atendimento humano. Toque em Falar com especialista."
        );
      }
    }

    if (errors.length > 0) {
      setLocalErrors(errors);
      return;
    }

    updatePersonal({ matricula, profile, birthDate, nome });
    setLocalErrors([]);
    setStep(2);
    trackEvent("view_sim_step2");
  };

  const handleStep2Submit = (event) => {
    event.preventDefault();
    const margin = Number(marginValue);
    const installments = Number(selectedInstallments);

    const errors = [];
    if (!margin || margin < 100 || margin > 5000) {
      errors.push("Informe uma margem entre R$ 100 e R$ 5.000.");
    }

    if (!isInstallmentEnabled(installments)) {
      errors.push("Prazo indisponível no momento.");
    }

    if (errors.length > 0) {
      setLocalErrors(errors);
      return;
    }

    updateFinance({ margin, installments });
    setLocalErrors([]);
    const result = computeResult();
    trackEvent("view_sim_step3");
    if (result.success) {
      trackEvent("sim_finish");
    }
    const resultSection = document.getElementById("resultado");
    if (resultSection) {
      resultSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="simulador" data-section>
      <div className="section-shell simulator">
        <div className="section-intro">
          <h2>Simule em até 40 segundos</h2>
          <p className="section-subtitle">
            Informe matrícula, perfil e data de nascimento. Depois, ajuste margem e prazo para ver o crédito.
          </p>
        </div>

        <div className="wizard">
          <div className="wizard__steps">
            <div className={`wizard__step ${step === 1 ? "is-active" : step > 1 ? "is-done" : ""}`}>
              <span>1</span>
              Identificação
            </div>
            <div className={`wizard__step ${step === 2 ? "is-active" : step > 2 ? "is-done" : ""}`}>
              <span>2</span>
              Margem & Prazo
            </div>
            <div className={`wizard__step ${state.result ? "is-done" : ""}`}>
              <span>3</span>
              Resultado
            </div>
          </div>

          {step === 1 && (
            <form className="wizard__panel" onSubmit={handleStep1Submit} noValidate>
              <div className="form-control">
                <label htmlFor="nome">Como podemos te chamar? (opcional)</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Ex.: Ana Souza"
                  defaultValue={state.personal.nome}
                />
              </div>

              <div className="form-control">
                <label htmlFor="matricula">Qual sua matrícula SIAPE?</label>
                <input
                  id="matricula"
                  name="matricula"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex.: 1234567"
                  defaultValue={state.personal.matricula}
                  required
                />
                <span className="help-text">Usamos para localizar sua margem com segurança.</span>
              </div>

              <div className="form-control">
                <span>Você é:</span>
                <div className="options">
                  {profileOptions.map((option) => (
                    <label key={option.value} className="chip">
                      <input
                        type="radio"
                        name="profile"
                        value={option.value}
                        defaultChecked={state.personal.profile === option.value}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="birthDate">Quando você nasceu?</label>
                <input id="birthDate" name="birthDate" type="date" defaultValue={state.personal.birthDate} required />
                <span className="help-text">Validamos idades entre 21 e 79 anos, 11 meses e 29 dias.</span>
                {ageInfo?.isOutOfRange && (
                  <p className="alert-inline">
                    Fora da faixa? <a href="https://wa.me/5541999999999">Fale com especialista</a>.
                  </p>
                )}
              </div>

              <div className="wizard__actions">
                <button type="submit" className="cta-primary">
                  Continuar
                </button>
                <a className="cta-secondary" href="https://wa.me/5541999999999" target="_blank" rel="noreferrer">
                  Falar com especialista
                </a>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="wizard__panel" onSubmit={handleStep2Submit} noValidate>
              <div className="form-control">
                <label htmlFor="margin">Qual o valor da sua margem disponível?</label>
                <input
                  id="margin"
                  name="margin"
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={marginValue}
                  onChange={(event) => setMarginValue(Number(event.target.value))}
                />
                <div className="slider-value">{formatCurrency(Number(marginValue || 0))}</div>
                <span className="help-text">SouGov → Consignações → Margem empréstimo.</span>
              </div>

              <div className="form-control">
                <span>Em quantas parcelas?</span>
                <div className="options">
                  {installmentsOptions.map((prazo) => (
                    <label key={prazo} className="chip">
                      <input
                        type="radio"
                        name="installments"
                        value={prazo}
                        checked={Number(selectedInstallments) === prazo}
                        onChange={(event) => setSelectedInstallments(Number(event.target.value))}
                      />
                      <span>{prazo}x</span>
                    </label>
                  ))}
                </div>
                <div className="help-text">
                  Tetos por idade (estimativa SIAPE): 21–67: R$ 200 mil | 68–69: R$ 150 mil | 70: R$ 120 mil |
                  71: R$ 100 mil | 72: R$ 75 mil | 73: R$ 50 mil | 74–78: R$ 20 mil.
                </div>
              </div>

              <div className="wizard__actions">
                <button type="button" className="cta-secondary" onClick={() => setStep(1)}>
                  Voltar
                </button>
                <button type="submit" className="cta-primary">
                  Ver resultado
                </button>
              </div>
            </form>
          )}
        </div>

        {localErrors.length > 0 && (
          <div className="alert-banner">
            <strong>Revise as informações:</strong>
            <ul>
              {localErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default SimulatorSection;

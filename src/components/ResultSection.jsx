import React from "react";
import { useSimulation } from "../context/SimulationContext";
import { formatCurrency } from "../utils/finance";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import { microcopy } from "../content/microcopy";
import useAnalytics from "../hooks/useAnalytics";
import "./ResultSection.css";

const WHATSAPP_NUMBER = "5541999999999";

const ResultSection = () => {
  const { state } = useSimulation();
  const { trackEvent } = useAnalytics();
  const { result, alerts } = state;

  const handleWhatsApp = () => {
    if (!result) return;
    trackEvent("sim_to_whatsapp", { prazo: result.installments });
  };

  return (
    <section id="resultado" data-section>
      <div className="section-shell result">
        <div className="section-intro">
          <h2>Resultado da sua simulação</h2>
          <p className="section-subtitle">Tudo em uma tela legível num relance.</p>
        </div>

        {alerts && alerts.length > 0 && (
          <div className="alert-banner">
            <strong>Ajustes automáticos:</strong>
            <ul>
              {alerts.map((alert) => (
                <li key={alert}>{alert}</li>
              ))}
            </ul>
          </div>
        )}

        {result ? (
          <div className="result-grid">
            <div className="result-card">
              <span className="result-label">Parcela estimada</span>
              <strong>{formatCurrency(result.installmentValue)}</strong>
              <p>Respeita sua margem informada.</p>
            </div>
            <div className="result-card">
              <span className="result-label">Valor aproximado do crédito</span>
              <strong>{formatCurrency(result.principal)}</strong>
              <p>Taxa exclusiva ASPRF e SinPRF-PR.</p>
            </div>
            <div className="result-card">
              <span className="result-label">Prazo</span>
              <strong>{result.installments}x</strong>
              <p>Sem letras miúdas: tudo explicado antes de você decidir.</p>
            </div>
            <div className="result-card">
              <span className="result-label">Taxa estimada</span>
              <strong>1,69% a.m.</strong>
              <p>{microcopy.exclusivity}</p>
            </div>
          </div>
        ) : (
          <div className="result-placeholder">
            <p>Preencha as etapas do simulador para ver seu resultado exclusivo.</p>
          </div>
        )}

        <div className="cta-stack">
          <a
            className={`cta-primary ${!result ? "is-disabled" : ""}`}
            href={result ? buildWhatsAppUrl(WHATSAPP_NUMBER, result.whatsAppMessage) : undefined}
            target="_blank"
            rel="noreferrer"
            onClick={handleWhatsApp}
          >
            Continuar pelo WhatsApp Oficial
          </a>
          <p className="microcopy">{microcopy.control}</p>
          <p className="microcopy">{microcopy.humanSupport}</p>
        </div>

        <div className="collapsibles">
          <details>
            <summary>Como funciona no SouGov?</summary>
            <ol>
              <li>
                <strong>Autorizar</strong> consignatário (SouGov → Consignação)
              </li>
              <li>
                <strong>Dar Anuência</strong> ao contrato digital (SouGov → Consignações)
              </li>
            </ol>
          </details>
          <details>
            <summary>O que é a margem 35/5/5?</summary>
            <p>35% empréstimos + 5% cartão consignado + 5% cartão benefício.</p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default ResultSection;

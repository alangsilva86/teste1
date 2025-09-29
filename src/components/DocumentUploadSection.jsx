import React, { useState } from "react";
import { useSimulation } from "../context/SimulationContext";
import { formatCurrency } from "../utils/finance";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import useAnalytics from "../hooks/useAnalytics";
import "./DocumentUploadSection.css";

const WHATSAPP_NUMBER = "5541999999999";

const DocumentUploadSection = () => {
  const { state, setDocuments, markDocumentsSubmitted } = useSimulation();
  const { trackEvent } = useAnalytics();
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileChange = (event, key) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments({ [key]: metadata });
    setStatusMessage("Arquivo pronto para envio seguro.");
    trackEvent("upload_start", { tipo: key });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    markDocumentsSubmitted();
    setStatusMessage("Documentos registrados com segurança. Continuaremos pelo WhatsApp.");
    trackEvent("upload_done");
  };

  const handleSkip = () => {
    trackEvent("sim_to_whatsapp", { origem: "upload" });
  };

  const whatsappUrl = state.result
    ? buildWhatsAppUrl(WHATSAPP_NUMBER, state.result.whatsAppMessage)
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <section data-section id="upload">
      <div className="section-shell upload">
        <h2>Envie documentos (opcional)</h2>
        <p className="section-subtitle">Antecipe a análise antes de falar com o atendimento humano.</p>

        <form className="upload__form" onSubmit={handleSubmit}>
          <div className="upload__grid">
            <label className="upload__card">
              <span>Contracheque (PDF)</span>
              <input type="file" accept="application/pdf" onChange={(event) => handleFileChange(event, "contracheque")} />
              <small>Baixe no SouGov.</small>
              {state.documents.contracheque && (
                <p className="upload__meta">{state.documents.contracheque.name}</p>
              )}
            </label>

            <label className="upload__card">
              <span>Extrato de consignações</span>
              <input type="file" onChange={(event) => handleFileChange(event, "extrato")} />
              <small>SouGov → Consignações.</small>
              {state.documents.extrato && <p className="upload__meta">{state.documents.extrato.name}</p>}
            </label>

            <label className="upload__card">
              <span>RG/CPF (foto)</span>
              <input type="file" accept="image/*" onChange={(event) => handleFileChange(event, "documento")} />
              <small>Tire uma foto nítida, sem reflexo.</small>
              {state.documents.documento && <p className="upload__meta">{state.documents.documento.name}</p>}
            </label>
          </div>

          <p className="microcopy">Arquivos criptografados; uso exclusivo nesta análise. {state.result && `Parcela estimada: ${formatCurrency(state.result.installmentValue)}.`}</p>

          <div className="upload__actions">
            <button type="submit" className="cta-primary">
              Enviar e continuar
            </button>
            <a className="cta-secondary" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={handleSkip}>
              Pular e falar por WhatsApp
            </a>
          </div>
        </form>

        {statusMessage && <div className="status-message">{statusMessage}</div>}
      </div>
    </section>
  );
};

export default DocumentUploadSection;

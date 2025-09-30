import React from "react";
import PropTypes from "prop-types";
import { microcopy } from "../content/microcopy";
import "./HomeSection.css";

const HomeSection = ({ onPrimaryCTA }) => {
  return (
    <section id="home" data-section>
      <div className="section-shell home">
        <div className="home__hero">
          <div className="badge">Exclusivo ASPRF e SinPRF-PR</div>
          <h1>
            Seu crédito com <span>taxa exclusiva ASPRF e SinPRF-PR.</span>
          </h1>
          <p className="section-subtitle">
            A partir de <strong>1,69% a.m.</strong> para associados, com contratação simples e segura.
          </p>
          <div className="home__cta-group">
            <button type="button" className="cta-primary" onClick={onPrimaryCTA}>
              Simule agora em 30s
            </button>
            <a className="cta-secondary verified" href="https://wa.me/5541999999999" target="_blank" rel="noreferrer">
              Falar no WhatsApp Oficial
              <span className="badge badge--verified">Verificado</span>
            </a>
          </div>
          <p className="microcopy">Sujeito a análise e à margem SIAPE. {microcopy.dataProtection}</p>
        </div>
        <div className="card-grid">
          <div className="info-card">
            <h3>{microcopy.exclusivity}</h3>
            <p>Taxa homologada especialmente para quem faz parte da rede PRF.</p>
          </div>
          <div className="info-card">
            <h3>{microcopy.transparency}</h3>
            <p>Você vê todo o fluxo antes de decidir: margem, prazo e SouGov em linguagem simples.</p>
          </div>
          <div className="info-card">
            <h3>Liberação rápida</h3>
            <p>Após Autorização e Anuência no SouGov, a liberação acontece em geral D+0/D+1.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

HomeSection.propTypes = {
  onPrimaryCTA: PropTypes.func,
};

export default HomeSection;

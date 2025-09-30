import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./GlobalLayout.css";

const navItems = [
  { id: "home", label: "Home" },
  { id: "simulador", label: "Simulador" },
  { id: "resultado", label: "Resultado" },
  { id: "como-funciona", label: "Como Funciona" },
  { id: "faq", label: "FAQ" },
];

const GlobalLayout = ({ children, onNavEvent }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("id");
            if (navItems.some((item) => item.id === sectionId)) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateStatus = () => {
      setIsOffline(!window.navigator.onLine);
    };
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const handleNavClick = (item) => {
    const target = document.getElementById(item.id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
    onNavEvent?.("navigate_section", { section: item.id });
  };

  return (
    <div className="global-layout">
      <a className="skip-to-content" href="#home">
        Ir para o conteúdo principal
      </a>
      <header className="global-header">
        <div className="brand-group">
          <div className="logo">
            <span className="logo__title">PRF</span>
            <span className="logo__subtitle">Finanças</span>
          </div>
          <div className="seals">
            <span className="seal">ASPRF</span>
            <span className="seal">SinPRF-PR</span>
          </div>
        </div>
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Abrir navegação</span>
          ☰
        </button>
        <nav className={`global-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={activeSection === item.id ? "is-active" : ""}
                  onClick={() => handleNavClick(item)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className="whatsapp-cta"
          href="https://wa.me/5541999999999"
          target="_blank"
          rel="noreferrer"
          onClick={() => onNavEvent?.("click_whatsapp_header")}
        >
          Atendimento (WhatsApp Oficial)
        </a>
      </header>
      {isOffline && (
        <div className="offline-banner">
          Sua simulação foi salva. Retome quando a conexão voltar.
        </div>
      )}
      <main>{children}</main>
      <footer className="global-footer">
        <div>
          <strong>Parceria institucional:</strong> ASPRF e SinPRF-PR
        </div>
        <div>Operação e tecnologia: Próspera.</div>
      </footer>
    </div>
  );
};

GlobalLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onNavEvent: PropTypes.func,
};

export default GlobalLayout;

import React from "react";
import { Link } from "react-router-dom";
import "./Navegacao.css";

function Navegacao() {
  return (
    <nav className="navegacao">
      <Link to="/encanamento" className="nav-link">
        Encanamento
      </Link>
      <Link to="/chaveiro" className="nav-link">
        Chaveiro
      </Link>
      <Link to="/eletricista" className="nav-link">
        Eletricista
      </Link>
      <Link to="/resultados" className="nav-link">
        Resultados
      </Link>
    </nav>
  );
}

export default Navegacao;

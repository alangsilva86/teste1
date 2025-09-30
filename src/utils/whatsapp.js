import { formatCurrency } from "./finance";

export const buildWhatsAppMessage = ({ nome, valor, prazo }) => {
  const saudacao = nome ? `Olá, ${nome}!` : "Olá!";
  const valorFormatado = valor ? formatCurrency(valor) : "seu crédito";
  const prazoTexto = prazo ? `${prazo}x` : "prazo disponível";

  return (
    `${saudacao} Você simulou ${valorFormatado} em ${prazoTexto} no PRF Finanças (ASPRF + SinPRF-PR).\n` +
    "Vou te ajudar a concluir em poucos minutos.\n\n" +
    "1. Envie contracheque (PDF), extrato de consignações e RG/CPF.\n" +
    "2. Em seguida, te mostro como Autorizar e Dar Anuência no SouGov.\n\n" +
    "Qualquer dúvida, estou aqui. ✅"
  );
};

export const buildWhatsAppUrl = (phoneNumber, message) => {
  const encoded = encodeURIComponent(message);
  const digits = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encoded}`;
};

import React, { useEffect } from "react";
import GlobalLayout from "./components/GlobalLayout";
import HomeSection from "./components/HomeSection";
import SimulatorSection from "./components/simulator/SimulatorSection";
import ResultSection from "./components/ResultSection";
import HowItWorksSection from "./components/HowItWorksSection";
import DocumentUploadSection from "./components/DocumentUploadSection";
import FAQSection from "./components/FAQSection";
import { SimulationProvider } from "./context/SimulationContext";
import useAnalytics from "./hooks/useAnalytics";
import "./styles/global.css";

const App = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("view_home");
  }, [trackEvent]);

  const handleNavEvent = (eventName, params) => {
    trackEvent(eventName, params);
  };

  return (
    <SimulationProvider>
      <GlobalLayout onNavEvent={handleNavEvent}>
        <HomeSection
          onPrimaryCTA={() => {
            trackEvent("click_cta_simular");
            const simulator = document.getElementById("simulador");
            if (simulator) {
              simulator.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
        <SimulatorSection />
        <ResultSection />
        <HowItWorksSection />
        <DocumentUploadSection />
        <FAQSection />
      </GlobalLayout>
    </SimulationProvider>
  );
};

export default App;

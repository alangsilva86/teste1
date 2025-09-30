import { useCallback } from "react";

const useAnalytics = () => {
  const trackEvent = useCallback((eventName, params = {}) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
    if (process.env.NODE_ENV !== "production") {
      console.info(`[Analytics] ${eventName}`, params);
    }
  }, []);

  return { trackEvent };
};

export default useAnalytics;

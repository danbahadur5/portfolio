
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/globals.css";
import { ToastContainer } from "react-toastify";
import reportWebVitals from "./utils/reportWebVitals";

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <ToastContainer />
    </>
);

// Performance monitoring (RUM)
reportWebVitals((metric) => {
  if (import.meta.env.PROD) {
    // In production, send to analytics service
    console.log('Performance Metric:', metric);
  } else {
    // In development, just log to console
    console.log(metric);
  }
});
  
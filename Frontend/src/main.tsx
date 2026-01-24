
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/globals.css";
import { ToastContainer } from "react-toastify";

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <ToastContainer />
    </>
);
  
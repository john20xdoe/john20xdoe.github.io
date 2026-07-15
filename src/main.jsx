import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "../assets/shoelace.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

setBasePath("/shoelace/");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

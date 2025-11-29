import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import NagoyaWinterTripApp from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <NagoyaWinterTripApp />
  </StrictMode>
);

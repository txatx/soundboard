import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Setup from "./setup/Setup.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Setup />
  </StrictMode>
);

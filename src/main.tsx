import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createGlobalStyle } from "styled-components";

const Style = createGlobalStyle`
  * { box-sizing: border-box; }
  body{ font-family: system-ui, sans-serif; line-height: 1.5; }
`;

const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64, 96, 128],
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  colors: {
    blue: "#07c",
    red: "#e10",
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <>
        <Style />
        <App />
      </>
    </ThemeProvider>
  </React.StrictMode>,
);

// reportWebVitals();

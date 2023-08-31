import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const Style = createGlobalStyle`
  * { box-sizing: border-box; }
  body{ margin:0; }
`;

const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64, 96, 128],
  space: [
    // margin and padding
    0, 4, 8, 16, 32, 64, 128, 256,
  ],
  colors: {
    blue: "#07c",
    red: "#e10",
  },
};

const Root = styled.div`
  font-family: system-ui, sans-serif;
  line-height: 1.5;
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Root>
        <Style />
        <App />
      </Root>
    </ThemeProvider>
  </React.StrictMode>,
);

reportWebVitals();

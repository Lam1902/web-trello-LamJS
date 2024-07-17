import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@emotion/react";
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import "./index.css";
import { CssBaseline } from "@mui/material";
import theme from "./theme.js";

// cấu hình react-toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmProvider } from "material-ui-confirm";


ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider>
      <CssBaseline></CssBaseline>
      <App />
      <ToastContainer position="bottom-left" autoClose={2000} />
      </ConfirmProvider>
    </CssVarsProvider>
  // </React.StrictMode>
);

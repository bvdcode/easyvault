import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#729200ff",
    },
    secondary: {
      main: "#fe6c00",
    },
    background: {
      default: "rgba(255, 255, 255, 0.95)",
      paper: "rgba(255, 255, 255, 0.95)",
    },
    text: {
      primary: "rgb(48, 48, 48)",
      secondary: "rgb(64, 64, 64)",
    },
  },
  typography: {
    fontFamily: '"Ubuntu", serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.95) inset !important;
        }
        
        .storageItemText {
          background-color: rgba(221, 221, 221, 0.73);
        }
      `,
    },
  },
});

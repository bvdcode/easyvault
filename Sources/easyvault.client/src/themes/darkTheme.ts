import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c6ff00",
    },
    secondary: {
      main: "#fe6c00",
    },
    background: {
      default: "rgba(32, 32, 32, 0.9)",
      paper: "rgba(16, 16, 16, 0.9)",
    },
    text: {
      primary: "rgb(210, 210, 210)",
      secondary: "rgb(200, 200, 200)",
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
          -webkit-box-shadow: 0 0 0 30px rgba(64, 64, 64, 0.9) inset !important;
        }
                  
        .storageItemText {
          background-color: rgba(75, 75, 75, 0.73);
        }
      `,
    },
  },
});

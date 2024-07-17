import { cyan, deepOrange, orange, teal } from "@mui/material/colors";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const APP_BAR_HEI = "58px";
const BOARD_BAR_HEI = "60px";
const BOARD_CONTENT_HEI = `calc(100vh - ${APP_BAR_HEI} - ${BOARD_BAR_HEI})`;

const theme = extendTheme({
  trelloCustom: {
    appBarHei: APP_BAR_HEI,
    boardBarHei: BOARD_BAR_HEI,
    BoardContentHei: BOARD_CONTENT_HEI,
    columnHeaderHei: '50px',
    columnFooterHei:'56px',

  },
  colorSchemes: {
    light: {},
    dark: {},
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdc3c7",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#ecf0f1",
          },
          "&::-webkit-scrollbar-track": {
       m: 2,
      },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-body1": { fontSize: "0.875rem" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: "0.875rem",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.light,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
  },
});

export default theme;

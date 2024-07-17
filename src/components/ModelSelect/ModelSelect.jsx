import React from "react";
import { useColorScheme } from "@mui/material/styles";
import { Button, Container, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120, color: "white" }} size="small">
      <InputLabel
        id=" label-select-dark-light-mode"
        sx={{
          color: "white", // Default color
          "&.Mui-focused": { color: "white" }, // Focused state color
        }}
      >
        Mode
      </InputLabel>
      <Select
        labelId=" label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="mode"
        onChange={handleChange}
        sx={{
          color: "white",
          ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          ".MuiSvgIcon-root": { color: "white" },
        }}
      >
        <MenuItem value="light">
          {" "}
          <Box style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <WbSunnyIcon fontSize="small" />
            Light
          </Box>{" "}
        </MenuItem>
        <MenuItem value="dark">
          {" "}
          <Box style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <DarkModeIcon fontSize="small" />
            Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          {" "}
          <Box style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {" "}
            <SettingsSuggestIcon fontSize="small" />
            System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default ModeSelect;

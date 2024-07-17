import React from "react";
import theme from "../../theme";
import {
  Box,
  Badge,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import ModeSelect from "../ModelSelect/ModelSelect";
import AppsIcon from "@mui/icons-material/Apps";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Workspace from "./Menus/Workspace";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Profile from "./Menus/Profile";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";

function AppBar() {

  const [value, setValue] = useState('');

  const handleClear = () => {
    setValue('');
  };
  
  return (
    <div>
      <Box
        px={2}
        sx={{
          width: "100%",
          height: theme.trelloCustom.appBarHei,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflowX: "auto",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AppsIcon></AppsIcon>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AutoAwesomeIcon></AutoAwesomeIcon>
            <Typography
              variant="span"
              sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}
            >
              Trello
            </Typography>
          </Box>

          <Box
            sx={{ display: { xs: "none", md: "flex" }, gap: 1, color: "white" }}
          >
            <Workspace></Workspace>
            <Recent></Recent>
            <Starred></Starred>
            <Templates></Templates>
            <Button
              startIcon={<LibraryAddIcon />}
              variant="outlined"
              sx={{ color: "white", border: "none" , '&:hover' : {border:"none"}}}
            >
              Create
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
      size="small"
      id="outlined-search"
      label="Search field"
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      sx={{
        minWidth: '120px',
        '& .MuiInputBase-input': {
          color: 'white',
        },
        '& .MuiInputLabel-root': {
          color: 'white',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'white',
        },
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{ color: 'white' }} />
          </InputAdornment>
        ),
       
      }}
    />
          <ModeSelect></ModeSelect>

          <Tooltip title="Notification">
            <Badge color="warning" variant="dot" sx={{ cursor: "pointer" }}>
              <NotificationsNoneIcon />
            </Badge>
          </Tooltip>

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ cursor: "pointer" }}></HelpOutlineIcon>
          </Tooltip>

          <Profile></Profile>
        </Box>
      </Box>
    </div>
  );
}

export default AppBar;

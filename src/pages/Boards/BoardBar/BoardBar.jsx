import React from "react";
import theme from "~/theme";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatters";

const MENU_STYLE = {
  backgroundColor: "transparent",
  color: "white",
  paddingX: "10px",
  borderRadius: "4px",
  border: "none",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:Hover": {
    bgcolor: "primary.50",
  },
};

function BoardBar({ board }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#3498db",
          width: "100%",
          width: "100%",
          height: theme.trelloCustom.boardBarHei,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          overflowX: "auto",
          alignItems: "center",
          padding: 2,
          borderBottom: " 1px solid white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title={board?.description}>
            <Chip
              icon={<FaceIcon />}
              label={board?.title}
              onClick={() => {}}
              sx={MENU_STYLE}
            />
          </Tooltip>

          <Chip
            icon={<VpnLockIcon />}
            label={capitalizeFirstLetter(board?.type)}
            onClick={() => {}}
            sx={MENU_STYLE}
          />

          <Chip
            icon={<AddToDriveIcon />}
            label="Add to google drive"
            onClick={() => {}}
            sx={MENU_STYLE}
          />

          <Chip
            icon={<BoltIcon />}
            label="Automation"
            onClick={() => {}}
            sx={MENU_STYLE}
          />

          <Chip
            icon={<FilterListIcon />}
            label="Filters"
            onClick={() => {}}
            sx={MENU_STYLE}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            sx={{ ...MENU_STYLE, border: "1px solid white" }}
            startIcon={<PersonAddIcon />}
            variant="outlined"
          >
            Invite
          </Button>
          <AvatarGroup
            max={4}
            total={24}
            sx={{
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                fontSize: 12,
              },
            }}
          >
            <Tooltip title="LamJS">
              <Avatar
                alt="Remy Sharp"
                src="https://static-images.vnncdn.net/files/publish/2022/12/25/2022-12-14t000000z-170963964-up1eice1h8c86-rtrmadp-3-soccer-worldcup-fra-mar-report-229.jpg"
              />
            </Tooltip>
            <Tooltip title="LamJS">
              <Avatar
                alt="Remy Sharp"
                src="https://static-images.vnncdn.net/files/publish/2022/12/25/manchester-city-v-crystal-palace-premier-league-scaled-228.jpg"
              />
            </Tooltip>
            <Tooltip title="LamJS">
              <Avatar
                alt="Remy Sharp"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS17bgfOkDO0aJ42vxn4asbPM8XoxqJ7Li81g&s"
              />
            </Tooltip>
            <Tooltip title="LamJS">
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title="LamJS">
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </Box>
  );
}

export default BoardBar;

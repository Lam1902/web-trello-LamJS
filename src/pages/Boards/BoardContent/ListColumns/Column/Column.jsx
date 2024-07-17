import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  ContentCut,
  Cloud,
  ContentCopy,
  ContentPaste,
  Opacity,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCardIcon from "@mui/icons-material/AddCard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ListCards from "./ListCards/ListCards";
import theme from "~/theme";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";


function Column({ column, createNewCard , deleteColumn }) {
  
  const orderedCards = column.cards;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column },
  });

  const dndKitColumnStyles = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    //Chiều cao phải max 100 tránh lỗi khi kéo cột ngắn và cột dài .
    // Còn {...listieners} phải nằm ở box chứ k phải div tránh kéo vào vùng xanh
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleSetOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const [newCardTitle, setNewCardTitle] = useState("");

  // hàm thêm mới card
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error("Miss Card Title", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }

    const cardData = {
      title: newCardTitle,
      columnId: column._id,
    };

    createNewCard(cardData);

    toggleSetOpenNewCardForm();
    setNewCardTitle("");
  };

  //hàm xóa column
  const confirm = useConfirm();
  const handleDeleteColumn = () => {
    confirm({ 
      title: 'Delete this column',
      description: "This action is permanent!" })
      .then(() => {
        deleteColumn(column._id)
      })
      .catch(() => {
        console.log("Action was cancelled.");
      });
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: "300px",
          maxWidth: "300px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          ml: 2,
          borderRadius: "6px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc( ${theme.trelloCustom.BoardContentHei} - ${theme.spacing(
              5
            )} )`,
        }}
      >
        {/* Column header */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columnHeaderHei,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {column?.title}
          </Typography>

          <Box>
            <Tooltip title="More option">
              <ExpandMoreIcon
                sx={{ color: "text.primary", cursor: "pointer" }}
                id="basic-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button-column-dropdown",
              }}
            >
              <MenuItem
                sx={{
                  "&:hover": {
                    color: "success.light",
                    "& .icon-add": {
                      color: "success.light",
                    },
                  },
                }}
                onClick={toggleSetOpenNewCardForm}
              >
                <ListItemIcon>
                  <AddCardIcon className="icon-add" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentPasteGoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem
                sx={{
                  "&:hover": {
                    color: "warning.dark",
                    "& .icon-archive": {
                      color: "warning.dark",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Cloud className="icon-archive" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem
                sx={{
                  "&:hover": {
                    color: "warning.dark",
                    "& .icon-delete": {
                      color: "warning.dark",
                    },
                  },
                }}
                onClick={handleDeleteColumn}
              >
                <ListItemIcon>
                  <DeleteOutlineIcon className="icon-delete" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/*Column List card */}
        <ListCards cards={orderedCards} />

        {/* Column footer */}
        {!openNewCardForm ? (
          <Box
            onClick={toggleSetOpenNewCardForm}
            sx={{
              height: (theme) => theme.trelloCustom.columnFooterHei,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: "0 8px 12px 8px",
              marginTop: "12px",
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: "pointer" }}></DragHandleIcon>
            </Tooltip>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              size="small"
              label="Enter column title"
              type="text"
              variant="outlined"
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              sx={{
                p: "0 8px 12px 8px",
                marginTop: "12px",
                "& label": {
                  color: "text.primary",
                },
                "& .MuiInputBase-input": {
                  color: (theme) => theme.palette.primary.main,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#333643" : "white",
                },
                "& .MuiInputLabel-root": {
                  color: (theme) => theme.palette.primary.main,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: (theme) => theme.palette.primary.main,
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  color: (theme) => theme.palette.primary.main,
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    color: (theme) => theme.palette.primary.main,
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    color: (theme) => theme.palette.primary.main,
                  },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <SearchIcon style={{ color: 'white' }} /> */}
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: (theme) => theme.palette.success.main,
                  "&:hover": { bgcolor: (theme) => theme.palette.success.main },
                }}
                onClick={() => addNewCard()}
              >
                Add
              </Button>
              <CloseIcon
                onClick={toggleSetOpenNewCardForm}
                fontSize="small"
                sx={{
                  color: "white",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.warning.light,
                  },
                }}
              ></CloseIcon>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default Column;

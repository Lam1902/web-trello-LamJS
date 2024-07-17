import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "./Column/Column";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";

export default function ListColumns({ columns , createNewCard, createNewColumn, deleteColumn }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleSetOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState('')

  // Hàm thêm mới cột
  const addNewColumn =  () => {
    if (!newColumnTitle) {
      toast.error('miss column title');
      return; // Thêm return để ngăn không chạy tiếp khi thiếu tiêu đề cột
    }

    const columnData = {
      title: newColumnTitle
    }

     createNewColumn(columnData);

    toggleSetOpenNewColumnForm();
    setNewColumnTitle('');
  }

  return (
    <SortableContext
      items={columns?.map( c => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": {
            m: 2,
          },
        }}
      >
        {/* Cột 1 */}
        {columns?.map((c) => (
          <Column createNewCard={createNewCard} 
          deleteColumn = {deleteColumn} 
          key={c._id} column={c} />
        ))}

        {/* Nút thêm cột mới */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleSetOpenNewColumnForm}
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              height: "fit-content",
              mx: 2,
              borderRadius: "6px",
              bgcolor: "#ffffff3d",
            }}
          >
            <Button
              sx={{
                width: "100%",
                color: "white",
                justifyContent: "flex-start",
                pl: 2.5,
                py: 1,
              }}
              startIcon={<PostAddIcon />}
            >
              Thêm cột mới
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              size="small"
              label="Nhập tiêu đề cột"
              type="text"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
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
                    {/* <SearchIcon style={{ color: 'white' }} /> */}
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: "none",
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main },
                }}
                onClick={addNewColumn}
              >
                Thêm cột
              </Button>
              <CloseIcon
                onClick={toggleSetOpenNewColumnForm}
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: (theme) => theme.palette.warning.light },
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
}

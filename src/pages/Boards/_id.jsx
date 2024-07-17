import React, { useEffect } from "react";
import { useState } from "react";
import { useColorScheme } from "@mui/material/styles";
import { Button, Container, Box } from "@mui/material";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import AppBar from "~/components/AppBar/AppBar";
import { mockData } from "~/apis/mock-data";
import {
  fetchBoardDetails_API,
  createNewCard_API,
  createNewColumn_API,
  updateBoard_API,
  updateColumn_API,
  moveCardToDifferentColumn_API,
  deleteColumn_API,
} from "~/apis/index";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatters";
import { mapOrder } from "~/utils/sorts";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { toast } from "react-toastify";


function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "6696a107c9c4133582b457db";

    const updateBoard = async () => {
      try {
        const board = await fetchBoardDetails_API(boardId);

        // Sắp xếp các cột theo thứ tự của columnOrderIds
        board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

        board.columns.forEach((column) => {
          if (isEmpty(column.cards)) {
            const placeholderCard = generatePlaceholderCard(column);
            column.cards = [placeholderCard];
            column.cardOrderIds = [placeholderCard._id];
          } else {
            // Sắp xếp các thẻ theo thứ tự của cardOrderIds
            column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
          }
        });

        console.log("check board: ", board);

        setBoard(board);
      } catch (error) {
        console.error("Error fetching board details:", error);
      }
    };

    updateBoard();
  }, []);

  const createNewColumn = async (columnData) => {
    const newColumn = await createNewColumn_API({
      ...columnData,
      boardId: board._id,
    });

    newColumn.cards = [generatePlaceholderCard(createNewColumn) ]  
    newColumn.cardOrderIds = [
      generatePlaceholderCard(createNewColumn)._id,
    ];

    const newBoard = { ...board };
    newBoard.columns.push(newColumn);
    newBoard.columnOrderIds.push(newColumn._id);
    //  console.log('check columns:', newBoard.columns)
    setBoard(newBoard);
  };

  const createNewCard = async (cardData) => {
    const newCard = await createNewCard_API({
      ...cardData,
      boardId: board._id,
    });

    const newBoard = { ...board };
    const columnToUpDate = newBoard.columns.find(
      (column) => column._id === newCard.columnId
    );
    // console.log("check:", columnToUpDate)
    if (columnToUpDate) {
      if(columnToUpDate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpDate.cards = [newCard]
        columnToUpDate.cardOrderIds = [newCard._id]
      }else {
        columnToUpDate.cards.push(newCard);
        columnToUpDate.cardOrderIds.push(newCard._id);
      }
      setBoard(newBoard);
    }
  };

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    // console.log('check columns:', newBoard.columns)
    setBoard(newBoard);

    updateBoard_API(newBoard._id, { columnOrderIds: dndOrderedColumnsIds });
  };

  const moveCardInSameColumn = (
    dndOrderedCardIds,
    dndOrderedCards,
    columnId
  ) => {
    const newBoard = { ...board };
    const columnToUpDate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    // console.log("check:", columnToUpDate)
    if (columnToUpDate) {
      columnToUpDate.cards = dndOrderedCards;
      columnToUpDate.cardOrderIds = dndOrderedCardIds;
      setBoard(newBoard);
    }

    updateColumn_API(columnToUpDate._id, {
      cardOrderIds: dndOrderedCardIds,
    });
  };

  const moveCardToDifferentColumn = (
    cardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    // console.log('check columns:', newBoard.columns)
    setBoard(newBoard);

    const data = {
      cardId: cardId,
      prevColumnId: prevColumnId,
      nextColumnId: nextColumnId,
      prevCardOrderIds: dndOrderedColumns.find((c) => c._id === prevColumnId)
        ?.cardOrderIds,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    };
    data.prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)
    ?.cardOrderIds
    if (data.prevCardOrderIds[0].includes("placeholder-card")) {
      data.prevCardOrderIds = [];
    }

    console.log("prevCardOrderIds: ", data.prevCardOrderIds);
    console.log("nextCardOrderIds: ", data.nextCardOrderIds);

    moveCardToDifferentColumn_API(data);
  };

  const deleteColumn = (columnId) => {
    // console.log("🚀 ~ deleteColumn ~ columnId:", columnId)
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(id => id !==columnId ) ;
    // console.log('check columns:', newBoard.columns)
    setBoard(newBoard);
    console.log("🚀 ~ deleteColumn_API ~ columnId:", columnId)
    
    deleteColumn_API(columnId).then(res => {
      toast.success(res.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          height: "100vh",
        }}
      >
        <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
          <CircularProgress color="secondary" />
          <CircularProgress color="success" />
          <CircularProgress color="inherit" />
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <AppBar></AppBar>
        <BoardBar board={board}></BoardBar>
        <BoardContent
          board={board}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          moveColumns={moveColumns}
          moveCardInSameColumn={moveCardInSameColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
          deleteColumn = {deleteColumn}
        ></BoardContent>
      </Container>
    </>
  );
}

export default Board;

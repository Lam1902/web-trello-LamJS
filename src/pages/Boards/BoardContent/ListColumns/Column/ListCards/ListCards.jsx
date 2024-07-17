import React from "react";
import Box from "@mui/material/Box";
import CardCustom from "./Card/CardCustom";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListCards({ cards }) {
  return (
    <SortableContext
      items={cards?.map((card) => card._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: "0 5px 5px 5px",
          m: "0 5px",
          gap: 1,
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: (theme) => `calc(
     ${theme.trelloCustom.BoardContentHei} -
      ${theme.spacing(5)} - 
      ${(theme) => theme.trelloCustom.columnFooterHei} - 
      ${(theme) => theme.trelloCustom.columnHeaderHei}  )`,
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ced0da",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "	#bfc2cf",
          },
          "&::-webkit-scrollbar": {
            with: "8px",
            height: "8px",
          },
        }}
      >
        {cards?.map((card) => (
          <CardCustom key={card._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;

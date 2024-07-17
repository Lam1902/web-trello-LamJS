import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import CardCustom from "./ListColumns/Column/ListCards/Card/CardCustom";
import { cloneDeep, isEmpty, over } from "lodash";
import {generatePlaceholderCard} from "~/utils/formatters";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board , createNewCard, createNewColumn,
   moveColumns ,moveCardInSameColumn, moveCardToDifferentColumn , deleteColumn}) {
  const [orderedColumn, setOrderedColumn] = useState([]);
  // console.log('check orderedColumn:', orderedColumn)

  //cùng 1 thời điểm chỉ có card hoặc column đc kéo
  const [activeDragItemId, setActiveDragItemId] = useState([null]);
  const [activeDragItemType, setActiveDragItemType] = useState([null]);
  const [activeDragItemData, setActiveDragItemData] = useState([null]);
  const [oldColumn, setOldColumn] = useState([null]);

  // điểm va chạm cuối cùng xử lí thuật toán phát hiện va chạm
  const lastOverId = useRef(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  //yêu cầu di chuyển chuột 10px thì mới kích hoạt event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  //yêu cầu giữ 250ms và dung sai 5px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });

  //ưu tiên sử dụng 2 cái này để k bị bug, nếu dùng pointerSensor thì bị bug ở mobile
  const sensors = useSensors(mouseSensor, touchSensor);

  // hàm này cập nhật giá trị cho state như mount, did-mount
  useEffect(() => {
    // const orderedColumns = mapOrder(
    //   board?.columns,
    //   board?.columnOrderIds,
    //   "_id"
    // );
    setOrderedColumn(board.columns);
  }, [board]);

  // tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumn.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  // hàm xử lí dữ liệu của việc kéo thả card giữa 2 column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumn((preColumns) => {
      //Tìm vị trí của overCard trong column đích
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );

      // console.log('vị trí mới: ', overCardIndex)
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      const nextColumns = cloneDeep(preColumns);
      // console.log("vị columns mới: ", nextColumns);

      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        //xóa card ra khỏi column cũ
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        //thêm placeholder card nếu column rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        //cập nhật lại cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }

      if (nextOverColumn) {
        //kiểm tra xem card cbi thả có ở column mới chưa , nếu có thì xóa
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // cập nhật lại dữ liệu của card trước khi cho vào trong column
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        //thêm card đang kéo vào column mới theo vị trí mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );

        nextOverColumn.cards = nextOverColumn.cards.filter(
          (c) => !c.FE_PlaceholderCard
        );

        //cập nhật lại cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      if(triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(activeDraggingCardId , oldColumn._id, nextOverColumn._id, nextColumns)
      }

      return nextColumns;
    });
  };

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id));
    }
  };

  const handleDragOver = (event) => {
    //không làm gì thêm khi đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    //khi kéo ra khỏi phạm vi trang thì sẽ không làm gì cả
    const { active, over } = event;
    if (!over || !active) return;

    //activeDraggingCardId: card đang đc kéo

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    //overCardId là card đang tương tác với card đang được kéo
    const { id: overCardId } = over;

    // tìm 2 column của 2 card đang đổi chỗ với nhau

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      );
    }

    // console.log("check column: ", activeColumn, overColumn);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // console.log('active : ',active)
    // console.log('over : ',over)

    // Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      if (!over || !active) return;
  
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
  
      const { id: overCardId } = over;
  
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      // console.log('the : ',activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId);
      // console.log('the 2: ', overCardId)
  
      if (!activeColumn || !overColumn) return;
      // console.log('2 column: ',activeColumn, overColumn)
  
      // kéo card 2 column khác nhau
      if (activeColumn._id === overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        );
        console.log('kéo thả card 2 column khác nhau')
      } else {
        const oldCardIndex = activeColumn?.cards?.findIndex(
          (c) => c._id === activeDraggingCardId
        );
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );
  
        const dndOrderedCards = arrayMove(
          activeColumn?.cards,
          oldCardIndex,
          newCardIndex
        );

        const dndOrderedCardIds = dndOrderedCards?.map((c) => c._id);
  
        setOrderedColumn((preColumns) => {
          const nextColumns = cloneDeep(preColumns);
  
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
  
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCardIds;
  
          return nextColumns;
        });

        moveCardInSameColumn(dndOrderedCardIds,dndOrderedCards, oldColumn._id )
      }

    }
  
    // Xử lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (!over || !active) return;
  
      console.log("kéo thả column");
  
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumn.findIndex(
          (c) => c._id === active.id
        );
        const newColumnIndex = orderedColumn.findIndex(
          (c) => c._id === over.id
        );
  
        const dndOrderedColumns = arrayMove(
          orderedColumn,
          oldColumnIndex,
          newColumnIndex
        );

  
        setOrderedColumn(dndOrderedColumns);
        
        moveColumns(dndOrderedColumns)
      }
    }
  
    // Reset các biến trạng thái sau khi kéo thả
    setActiveDragItemData(null);
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setOldColumn(null);
  };
  
  // Hàm arrayMove để di chuyển phần tử trong mảng
  const arrayMove = (arr, fromIndex, toIndex) => {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
  };
  

  //hàm này để cho kéo thả cái bóng của column và card không bị mất
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0,5",
        },
      },
    }),
  };

  //custom lại thuật toán phát hiện va chạm
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      // tìm các điểm giao nhau , va chạm với con trỏ
      const pointerIntersections = pointerWithin(args);

      if (!pointerIntersections?.length) return;

      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args);

      //tìm overId đầu tiên trong trong intersections
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        const checkColumn = orderedColumn.find((c) => c._id === overId);
        if (checkColumn) {
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumn]
  );

  return (
    <DndContext
      //cảm biến
      sensors={sensors}
      // thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#3498db",
          width: "100%",
          height: (theme) => theme.trelloCustom.BoardContentHei,
          p: "10px 0",
        }}
      >
        <ListColumns 
        columns={orderedColumn} 
        createNewColumn = {createNewColumn}
        createNewCard = {createNewCard}
        deleteColumn = {deleteColumn}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
              <Column column={activeDragItemData} />
            )}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
              <CardCustom card={activeDragItemData} />
            )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;

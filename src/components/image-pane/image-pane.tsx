import { MouseEvent, RefObject, useEffect, useRef } from "react";
import { ECursor } from "../../enums/css.enum.";
import { useImagePaneStore } from "../../stores/image-pane-store";
import {
  StyledContainer,
  StyledDeleteButton,
  StyledDeleteIcon,
  StyledDragPointer,
  StyledHeader,
} from "./image-pane.style";
// import { useDragArea } from "../../hooks/useDragArea";
import {
  useReviseArea,
  EReviseType,
  EDirection,
} from "../../hooks/useReviseArea";

type Props = {
  parentRef: RefObject<HTMLElement>;
  id: string;
  x: number;
  y: number;
  index?: number;
  width: number;
  height: number;
  isOverlapping?: boolean;
  openDeleteButton?: boolean;
};

const dragPointerStyleConfigs: {
  left: string;
  top: string;
  cursor: ECursor;
  scaleDirection: EDirection;
}[] = [
  {
    left: "0",
    top: "0",
    cursor: ECursor.NWSE_RESIZE,
    scaleDirection: EDirection.TOP_LEFT,
  },
  {
    left: "50%",
    top: "0",
    cursor: ECursor.NS_RESIZE,
    scaleDirection: EDirection.TOP,
  },
  {
    left: "100%",
    top: "0",
    cursor: ECursor.NESW_RESIZE,
    scaleDirection: EDirection.TOP_RIGHT,
  },
  {
    left: "0",
    top: "50%",
    cursor: ECursor.EW_RESIZE,
    scaleDirection: EDirection.LEFT,
  },
  {
    left: "100%",
    top: "50%",
    cursor: ECursor.EW_RESIZE,
    scaleDirection: EDirection.RIGHT,
  },
  {
    left: "0",
    top: "100%",
    cursor: ECursor.NESW_RESIZE,
    scaleDirection: EDirection.BOTTOM_LEFT,
  },
  {
    left: "50%",
    top: "100%",
    cursor: ECursor.NS_RESIZE,
    scaleDirection: EDirection.BOTTOM,
  },
  {
    left: "100%",
    top: "100%",
    cursor: ECursor.NWSE_RESIZE,
    scaleDirection: EDirection.BOTTOM_RIGHT,
  },
];

export const ImagePane = ({
  parentRef,
  id,
  x,
  y,
  index,
  width,
  height,
  isOverlapping,
  openDeleteButton = false,
}: Props) => {
  const elRef = useRef<HTMLDivElement>(null);
  const { deleteImagePane, getImagePanes, setImagePaneMap } =
    useImagePaneStore();
  // const { dragingArea, completedDragArea, handleDragStart } = useDragArea(
  //   elRef,
  //   parentRef,
  //   getImagePanes(),
  // );

  const { revisingArea, completedReviseArea, handleReviseStart } =
    useReviseArea(elRef, parentRef, getImagePanes());

  const handleMouseStopPropagation = (e: MouseEvent<Element>) => {
    e.stopPropagation();
  };

  const handleDelete = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteImagePane(id);
  };

  useEffect(() => {
    if (completedReviseArea) {
      setImagePaneMap(completedReviseArea.id, completedReviseArea);
    }
  }, [completedReviseArea, setImagePaneMap]);

  return (
    <>
      <StyledContainer
        ref={elRef}
        x={x}
        y={y}
        width={width}
        height={height}
        isOverlapping={isOverlapping}
        isDragging={revisingArea?.id === id}
        onMouseDown={handleReviseStart(EReviseType.DRAG, id)}
      >
        {index !== undefined && index >= 0 && (
          <StyledHeader>{index}</StyledHeader>
        )}
        {dragPointerStyleConfigs.map((config) => (
          <StyledDragPointer
            key={config.cursor + config.left + config.top}
            left={config.left}
            top={config.top}
            isOverlapping={isOverlapping}
            cursor={config.cursor}
            onMouseDown={handleReviseStart(
              EReviseType.SCALE,
              id,
              config.scaleDirection as EDirection,
            )}
          />
        ))}
        {openDeleteButton && (
          <StyledDeleteButton
            onClick={handleDelete(id)}
            onMouseDown={handleMouseStopPropagation}
            onMouseMove={handleMouseStopPropagation}
            onMouseUp={handleMouseStopPropagation}
            onMouseLeave={handleMouseStopPropagation}
          >
            <StyledDeleteIcon />
          </StyledDeleteButton>
        )}
      </StyledContainer>
      {revisingArea && (
        <StyledContainer
          id={revisingArea.id}
          x={revisingArea.x}
          y={revisingArea.y}
          width={revisingArea.width}
          height={revisingArea.height}
          isOverlapping={revisingArea.isOverlapping}
        >
          {dragPointerStyleConfigs.map((config) => (
            <StyledDragPointer
              key={config.cursor + config.left + config.top}
              left={config.left}
              top={config.top}
              isOverlapping={revisingArea.isOverlapping}
              cursor={config.cursor}
            />
          ))}
        </StyledContainer>
      )}
    </>
  );
};

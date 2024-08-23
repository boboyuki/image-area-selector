import styled from "@emotion/styled";
import { ECursor } from "../../enums/css.enum.";
import { FaRegTrashAlt } from "react-icons/fa";

type StyledContainerProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isOverlapping?: boolean;
  isDragging?: boolean;
};

export const StyledContainer = styled("div")<StyledContainerProps>(
  ({ x, y, width, height, isOverlapping, isDragging }) => ({
    position: "absolute",
    top: y,
    left: x,
    cursor: ECursor.GRAB,
    width,
    height,
    border: isOverlapping ? "1px solid red" : "1px solid #0C68E3",
    opacity: isDragging ? 0 : 1,
  }),
);

export const StyledHeader = styled.div({
  position: "absolute",
  top: "0.2rem",
  left: "0.4rem",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1rem",
  height: "1rem",
  backgroundColor: "rgba(256, 256, 256, 0.7)",
  color: "#000",
});

type StyledDragPointerProps = {
  left: string;
  top: string;
  cursor: ECursor;
  isOverlapping?: boolean;
};

export const StyledDragPointer = styled.button<StyledDragPointerProps>(
  ({ left, top, cursor, isOverlapping }) => ({
    display: "block",
    border: "none",
    position: "absolute",
    top,
    left,
    transform: "translate(-50%, -50%)",
    width: "0.5rem",
    height: "0.5rem",
    padding: "0",
    cursor,
    zIndex: 1000,
    backgroundColor: isOverlapping ? "red" : "#0C68E3",
  }),
);

export const StyledDeleteButton = styled.button({
  position: "absolute",
  top: "0",
  right: "-2rem",
  border: "none",
  backgroundColor: "#fff",
  width: "1.5rem",
  height: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0.1rem",
  boxShadow: "0 0 0.2rem 0 rgba(0, 0, 0, 0.1)",
  pointerEvents: "auto",
  cursor: ECursor.POINTER,
});

export const StyledDeleteIcon = styled(FaRegTrashAlt)({
  fontSize: "1.5rem",
  backgroundColor: "white",
});

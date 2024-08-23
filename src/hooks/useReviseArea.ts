import { RefObject, useCallback, useEffect, useRef, useState } from "react";
export enum EReviseType {
  SCALE = "scale",
  DRAG = "drag",
}

export enum EDirection {
  TOP = "top",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
}

type Point = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type SelectArea = Point &
  Size & {
    id: string;
    isOverlapping: boolean;
  };

type Boundary = {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
};

const getBoundary = (parentEl: HTMLElement): Boundary => {
  const rect = parentEl.getBoundingClientRect();
  const minX = 0;
  const minY = 0;
  const maxX = minX + rect.width;
  const maxY = minY + rect.height;
  return { maxX, maxY, minX, minY };
};

const getDragArea = (
  e: globalThis.MouseEvent,
  el: HTMLElement,
  startPoint: Point,
  startMousePosition: Point,
  parentRect: DOMRect,
) => {
  // 計算移動後的位置，計算偏移量後設定位置
  const newX = startPoint.x + (e.clientX - startMousePosition.x);
  const newY = startPoint.y + (e.clientY - startMousePosition.y);

  // 獲取當前元素的尺寸
  const { width, height } = el.getBoundingClientRect();

  // 確保元素不會超出父容器邊界
  const maxX = parentRect.width - width;
  const maxY = parentRect.height - height;

  return {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY)),
    width,
    height,
  };
};

const getScaleArea = (
  scaleDirection: EDirection,
  e: globalThis.MouseEvent,
  parentRect: DOMRect,
  initialArea: SelectArea,
) => {
  // 計算鼠標相對於父容器的位置
  const mouseX = e.clientX - parentRect.left;
  const mouseY = e.clientY - parentRect.top;

  let newX = initialArea.x;
  let newY = initialArea.y;
  let newWidth = initialArea.width;
  let newHeight = initialArea.height;

  // 根據縮放方向調整尺寸和位置
  switch (scaleDirection) {
    case EDirection.TOP:
      newY = mouseY;
      newHeight = initialArea.y - mouseY + initialArea.height;
      break;
    case EDirection.BOTTOM:
      newHeight = mouseY - initialArea.y;
      break;
    case EDirection.LEFT:
      newX = mouseX;
      newWidth = initialArea.x - mouseX + initialArea.width;
      break;
    case EDirection.RIGHT:
      newWidth = mouseX - initialArea.x;
      break;
    case EDirection.TOP_LEFT:
      newX = mouseX;
      newY = mouseY;
      newWidth = initialArea.x - mouseX + initialArea.width;
      newHeight = initialArea.y - mouseY + initialArea.height;
      break;
    case EDirection.TOP_RIGHT:
      newY = mouseY;
      newWidth = mouseX - initialArea.x;
      newHeight = initialArea.y - mouseY + initialArea.height;
      break;
    case EDirection.BOTTOM_LEFT:
      newX = mouseX;
      newWidth = initialArea.x - mouseX + initialArea.width;
      newHeight = mouseY - initialArea.y;
      break;
    case EDirection.BOTTOM_RIGHT:
      newWidth = mouseX - initialArea.x;
      newHeight = mouseY - initialArea.y;
      break;
  }

  // 確保新的尺寸不為負
  newWidth = Math.max(newWidth, 1);
  newHeight = Math.max(newHeight, 1);

  // 確保新的區域不會超出父容器邊界
  newX = Math.max(0, Math.min(newX, parentRect.width - newWidth));
  newY = Math.max(0, Math.min(newY, parentRect.height - newHeight));
  newWidth = Math.min(newWidth, parentRect.width - newX);
  newHeight = Math.min(newHeight, parentRect.height - newY);

  return {
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight,
  };
};

const checkOverBoundary = (area: Point & Size, boundary: Boundary) => {
  return (
    area.x < boundary.minX ||
    area.x + area.width > boundary.maxX ||
    area.y < boundary.minY ||
    area.y + area.height > boundary.maxY
  );
};

const checkOverlapping = (
  area: Size & Point,
  selectedAreas: Omit<SelectArea, "isOverlapping">[],
) => {
  return selectedAreas.some((selectedArea) => {
    return (
      area.x < selectedArea.x + selectedArea.width &&
      area.x + area.width > selectedArea.x &&
      area.y < selectedArea.y + selectedArea.height &&
      area.y + area.height > selectedArea.y
    );
  });
};

const getInitialArea = (
  id: string,
  el: HTMLElement,
  parentEl: HTMLElement,
): SelectArea => {
  const elRect = el.getBoundingClientRect();
  const parentRect = parentEl.getBoundingClientRect();
  return {
    x: elRect.left - parentRect.left,
    y: elRect.top - parentRect.top,
    width: elRect.width,
    height: elRect.height,
    id,
    isOverlapping: false,
  };
};

type UseScaleArea = {
  revisingArea: SelectArea | null;
  completedReviseArea: SelectArea | null;
  handleReviseStart: (
    type: EReviseType,
    selectingId: string,
    scaleDirection?: EDirection,
  ) => (e: React.MouseEvent<HTMLElement>) => void;
};

export const useReviseArea = (
  elRef: RefObject<HTMLElement>,
  parentRef: RefObject<HTMLElement>,
  selectedAreas: Omit<SelectArea, "isOverlapping">[],
): UseScaleArea => {
  const typeRef = useRef<EReviseType>(EReviseType.SCALE);
  const isDraggingRef = useRef(false);
  const initialAreaRef = useRef<SelectArea | null>(null);
  const scaleDirectionRef = useRef<EDirection>(EDirection.TOP);
  const selectingIdRef = useRef<string | null>(null);
  const startMousePositionRef = useRef<Point>({ x: 0, y: 0 });
  const [revisingArea, setRevisingArea] = useState<SelectArea | null>(null);
  const [completedReviseArea, setCompletedReviseArea] =
    useState<SelectArea | null>(null);

  const handleReviseStart =
    (type: EReviseType, selectingId: string, scaleDirection?: EDirection) =>
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const el = elRef.current;
      const parentEl = parentRef.current;
      if (!el || !parentEl) return;
      const initialArea = getInitialArea(selectingId, el, parentEl);
      isDraggingRef.current = true;
      typeRef.current = type;
      selectingIdRef.current = selectingId;
      startMousePositionRef.current = { x: e.clientX, y: e.clientY };
      initialAreaRef.current = initialArea;
      scaleDirectionRef.current = scaleDirection || EDirection.TOP;
      setRevisingArea(initialArea);
    };

  const handleReviseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = elRef.current;
      const parentEl = parentRef.current;
      const isScaling = isDraggingRef.current;
      const selectingId = selectingIdRef.current;
      const initialArea = initialAreaRef.current;
      const startMousePosition = startMousePositionRef.current;
      if (
        !el ||
        !parentEl ||
        !revisingArea ||
        !isScaling ||
        !initialArea ||
        !selectingId
      )
        return;
      const boundary = getBoundary(parentEl);
      const newArea =
        typeRef.current === EReviseType.SCALE
          ? getScaleArea(
              scaleDirectionRef.current,
              e,
              parentEl.getBoundingClientRect(),
              initialArea,
            )
          : getDragArea(
              e,
              el,
              initialArea,
              startMousePosition,
              parentEl.getBoundingClientRect(),
            );

      const isOverBoundary = checkOverBoundary(newArea, boundary);
      if (isOverBoundary) return;
      const isOverlapping = checkOverlapping(
        newArea,
        selectedAreas.filter((area) => area.id !== selectingId),
      );
      setRevisingArea((prev) => {
        if (!prev) return null;
        return { ...prev, ...newArea, isOverlapping, selectingId };
      });
    },
    [
      elRef,
      initialAreaRef,
      parentRef,
      revisingArea,
      selectedAreas,
      startMousePositionRef,
      selectingIdRef,
    ],
  );

  const handleReviseEnd = useCallback(
    (e: globalThis.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!revisingArea) return;
      if (!revisingArea.isOverlapping) {
        setCompletedReviseArea(revisingArea);
      }
      initialAreaRef.current = null;
      isDraggingRef.current = false;
      startMousePositionRef.current = { x: 0, y: 0 };
      setRevisingArea(null);
    },
    [revisingArea],
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleReviseMove);
    document.addEventListener("mouseup", handleReviseEnd);
    return () => {
      document.removeEventListener("mousemove", handleReviseMove);
      document.removeEventListener("mouseup", handleReviseEnd);
    };
  }, [handleReviseEnd, handleReviseMove]);

  return {
    revisingArea,
    completedReviseArea,
    handleReviseStart,
  };
};

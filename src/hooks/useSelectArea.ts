import {
  RefObject,
  useCallback,
  MouseEvent,
  useRef,
  useState,
  useEffect,
} from "react";

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

type UseSelectArea = {
  selectingArea: SelectArea | null;
  completedSelectedArea: SelectArea | null;
  handleStartSelect: (e: MouseEvent) => void;
  // handelSelectRange: (e: MouseEvent) => void;
  // handelEndSelect: (e: MouseEvent) => void;
  handelSelectOutBoundary: (e: MouseEvent) => void;
};

const getPointCoordinates = (
  e: globalThis.MouseEvent | MouseEvent,
  el: HTMLElement,
) => {
  // const target = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y };
};

const getBoundary = (el: HTMLElement): Boundary => {
  const rect = el.getBoundingClientRect();
  const minX = 0;
  const minY = 0;
  const maxX = minX + rect.width;
  const maxY = minY + rect.height;
  return { maxX, maxY, minX, minY };
};

const checkOverBoundary = (area: Point & Size, boundary: Boundary) => {
  return (
    area.x < boundary.minX ||
    area.x + area.width > boundary.maxX ||
    area.y < boundary.minY ||
    area.y + area.height > boundary.maxY
  );
};

const calculateSelectArea = (startPoint: Point, currentPoint: Point) => {
  const x = Math.min(startPoint.x, currentPoint.x);
  const y = Math.min(startPoint.y, currentPoint.y);
  const width = Math.abs(currentPoint.x - startPoint.x);
  const height = Math.abs(currentPoint.y - startPoint.y);
  return { x, y, width, height };
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

export const useSelectArea = (
  elRef: RefObject<HTMLDivElement | null>,
  selectedAreas: Omit<SelectArea, "isOverlapping">[],
): UseSelectArea => {
  const startPointRef = useRef<Point | null>(null);
  const isSelectingRef = useRef<boolean>(false);
  const [selectingArea, setSelectingArea] = useState<SelectArea | null>(null);
  const [completedSelectedArea, setCompletedSelectedArea] =
    useState<SelectArea | null>(null);

  const handleStartSelect = useCallback(
    (e: MouseEvent) => {
      if (!elRef.current) return;
      const { x, y } = getPointCoordinates(e, elRef.current);
      startPointRef.current = { x, y };
      const selectedArea = {
        id: crypto.randomUUID(),
        x,
        y,
        width: 0,
        height: 0,
        isOverlapping: false,
      };
      const isOverlapping = checkOverlapping(selectedArea, selectedAreas);
      if (isOverlapping) return;
      isSelectingRef.current = true;
      setSelectingArea(selectedArea);
    },
    [elRef, selectedAreas, startPointRef, isSelectingRef],
  );

  const handelSelectRange = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!elRef.current || !startPointRef.current) return;
      const element = elRef.current;
      const startPoint = startPointRef.current;
      const isSelecting = isSelectingRef.current;
      if (
        selectingArea &&
        isSelecting &&
        element &&
        startPoint?.x &&
        startPoint?.y
      ) {
        const { x, y } = getPointCoordinates(e, element);
        const area = calculateSelectArea(
          { x: startPoint.x, y: startPoint.y },
          { x, y },
        );
        const isOverlapping = checkOverlapping(area, selectedAreas);
        const boundary = getBoundary(element);
        const isOverBoundary = checkOverBoundary(area, boundary);
        if (isOverBoundary) return null;

        setSelectingArea((prev) => {
          if (!prev) return null;
          return { ...prev, ...area, isOverlapping };
        });
      }
    },
    [selectingArea, selectedAreas, elRef, startPointRef, isSelectingRef],
  );

  const handelSelectOutBoundary = useCallback(() => {
    setSelectingArea(null);
    if (selectingArea) {
      setCompletedSelectedArea(selectingArea);
    }
    setSelectingArea(null);
    isSelectingRef.current = false;
    startPointRef.current = null;
  }, [selectingArea, isSelectingRef, startPointRef]);

  const handelEndSelect = useCallback(() => {
    if (!elRef.current) return;
    if (isSelectingRef.current && selectingArea) {
      if (!selectingArea.isOverlapping) {
        setCompletedSelectedArea(selectingArea);
      }
      setSelectingArea(null);
      isSelectingRef.current = false;
      startPointRef.current = null;
    }
  }, [selectingArea, isSelectingRef, elRef]);

  useEffect(() => {
    document.addEventListener("mousemove", handelSelectRange);
    document.addEventListener("mouseup", handelEndSelect);
    return () => {
      document.removeEventListener("mousemove", handelSelectRange);
      document.removeEventListener("mouseup", handelEndSelect);
    };
  }, [handelSelectRange, handelEndSelect]);

  return {
    selectingArea,
    completedSelectedArea,
    handleStartSelect,
    // handelSelectRange,
    // handelEndSelect,
    handelSelectOutBoundary,
  };
};

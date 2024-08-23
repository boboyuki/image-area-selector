import { useEffect, useRef } from "react";
import { StyledImage, StyledImageContainer } from "./image-area-selector.style";
import { useSelectArea } from "../../hooks/useSelectArea";
import { useImagePaneStore } from "../../stores/image-pane-store";
import { ImagePane } from "../image-pane";

type Props = {
  imageBase64String: string;
};

export const ImageAreaSelector = ({ imageBase64String }: Props) => {
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const { setImagePaneMap, getImagePanes } = useImagePaneStore();
  const {
    selectingArea,
    completedSelectedArea,
    handleStartSelect,
    // handelSelectRange,
    // handelEndSelect,
    handelSelectOutBoundary,
  } = useSelectArea(imageContainerRef, getImagePanes());
  useEffect(() => {
    if (!completedSelectedArea) return;
    setImagePaneMap(completedSelectedArea.id, completedSelectedArea);
  }, [completedSelectedArea, setImagePaneMap]);

  return (
    <StyledImageContainer
      ref={imageContainerRef}
      onMouseDown={handleStartSelect}
      // onMouseMove={handelSsSelect}
      onMouseLeave={handelSelectOutBoundary}
    >
      <StyledImage src={imageBase64String} />
      {getImagePanes().map((pane, index) => (
        <ImagePane
          key={pane.id}
          index={index + 1}
          openDeleteButton
          parentRef={imageContainerRef}
          {...pane}
        />
      ))}
      {selectingArea && (
        <ImagePane {...selectingArea} parentRef={imageContainerRef} />
      )}
    </StyledImageContainer>
  );
};

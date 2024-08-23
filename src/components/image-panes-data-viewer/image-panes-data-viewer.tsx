import { useImagePaneStore } from "../../stores/image-pane-store";
import { StyledContainer } from "./image-panes-data-viewer.style";

export const ImagePanesDataViewer = () => {
  const { getImagePanesData } = useImagePaneStore();

  return (
    <StyledContainer>
      {getImagePanesData().length > 0 &&
        JSON.stringify(getImagePanesData(), null, 2)}
    </StyledContainer>
  );
};

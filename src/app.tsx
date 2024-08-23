import { ImagePanesDataViewer } from "./components/image-panes-data-viewer";
import { ImageViewer } from "./components/image-viewer";
import { GlobalStyles } from "./global-styles";
import { ImageSelectorLayout } from "./layouts/image-selector-layout";

export function App() {
  return (
    <>
      <GlobalStyles />
      <ImageSelectorLayout>
        <ImageViewer />
        <ImagePanesDataViewer />
      </ImageSelectorLayout>
    </>
  );
}

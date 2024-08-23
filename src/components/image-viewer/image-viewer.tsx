import { useState } from "react";
import { ImageUploader } from "../image-uploader";
import {
  StyledButton,
  StyledContainer,
  StyledHeader,
  StyledSection,
} from "./image-viewer.style";
import { ImageAreaSelector } from "../image-area-selector/image-area-selector";

export const ImageViewer = () => {
  const [imageBase64String, setImageBase64String] = useState<string>("");
  const handleImageBase64String = (base64String: string) => {
    setImageBase64String(base64String);
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledButton />
      </StyledHeader>
      <StyledSection>
        {!imageBase64String && (
          <ImageUploader handleImageBase64String={handleImageBase64String} />
        )}
        {imageBase64String && (
          <ImageAreaSelector imageBase64String={imageBase64String} />
        )}
      </StyledSection>
    </StyledContainer>
  );
};

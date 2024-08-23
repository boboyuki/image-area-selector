import { useId } from "react";
import {
  StyledContainer,
  StyledImageUploadLabel,
  StyledImageUploadIcon,
  StyledImageUploadText,
} from "./image-uploader.style";

type Props = {
  handleImageBase64String: (image: string) => void;
};

export const ImageUploader = ({ handleImageBase64String }: Props) => {
  const id = useId();
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          handleImageBase64String(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <StyledContainer>
      <StyledImageUploadLabel htmlFor={`image-upload-${id}`}>
        <StyledImageUploadIcon />
        <StyledImageUploadText>Upload Image</StyledImageUploadText>
        <input
          id={`image-upload-${id}`}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </StyledImageUploadLabel>
    </StyledContainer>
  );
};

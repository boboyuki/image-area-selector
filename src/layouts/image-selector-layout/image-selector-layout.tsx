import {
  StyledContainer,
  StyledMainSection,
} from "./image-selector-layout.style";

type ImageSelectorLayoutProps = {
  children: React.ReactNode;
};

export const ImageSelectorLayout = ({ children }: ImageSelectorLayoutProps) => {
  return (
    <StyledContainer>
      <StyledMainSection>{children}</StyledMainSection>
    </StyledContainer>
  );
};

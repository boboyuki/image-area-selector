import styled from "@emotion/styled";

export const StyledImageContainer = styled.div({
  width: "100%",
  height: "auto",
  position: "relative",
  cursor: "crosshair",
});

export const StyledImage = styled.img({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  userSelect: "none",
});

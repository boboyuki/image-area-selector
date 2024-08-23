import styled from "@emotion/styled";
import { CiImageOn } from "react-icons/ci";

export const StyledContainer = styled.div({
  width: "100%",
  minHeight: "156px",
});

export const StyledImageUploadLabel = styled.label({
  position: "relative",
  width: "100%",
  height: "100%",
  border: `1px solid #C4C4C4`,
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  color: "#C4C4C4",
  cursor: "pointer",
});

export const StyledImageUploadText = styled.p({
  fontSize: "1rem",
  margin: "0.5rem 0 0 0",
  color: "#C4C4C4",
});

export const StyledImageUploadIcon = styled(CiImageOn)({
  width: "36px",
  height: "24px",
  color: "#C4C4C4",
});

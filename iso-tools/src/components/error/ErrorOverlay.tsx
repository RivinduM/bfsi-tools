import React from "react";
import { Box, Grid, Typography, Button, IconButton, Link } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorOverlayProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

export default function ErrorOverlay({ message, onClose, isVisible }: ErrorOverlayProps) {
  if (!isVisible) return null;

  // Function to render message with "Contact us" as a link
  const renderMessage = (text: string) => {
    const parts = text.split('Contact Us');
    if (parts.length === 2) {
      // Handle line breaks in the first part
      const beforeContactUs = parts[0].split('\n').map((line, index, array) => (
        <React.Fragment key={index}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ));
      
      return (
        <>
          {beforeContactUs}
           Contact Us
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <Box
      id="box-error-overlay"
      sx={{
        position: "absolute",
        bgcolor: "rgba(0, 0, 0, 0.70)",
        height: "calc(100vh - 195px)",
        width: "calc(100% - 48px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "default",
      }}
      marginTop={{ md: 4.9 }}
      onClick={(e) => {
        // Close overlay when clicking on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Box
        id="box-error-overlay-inner"
        sx={{
          bgcolor: "background.paper",
          minWidth: "400px",
          maxWidth: "600px",
          padding: 4,
          borderRadius: 2,
          margin: 2,
          position: "relative",
          boxShadow: 24,
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            cursor: "pointer !important",
            "& *": {
              cursor: "pointer !important",
            },
            "&:hover": {
              cursor: "pointer !important",
              "& *": {
                cursor: "pointer !important",
              }
            }
          }}
          onClick={onClose}
          aria-label="close error overlay"
        >
          <CloseIcon />
        </IconButton>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 60,
              color: "info.main",
              mb: 2,
            }}
          />
          
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: "info.main",
              fontWeight: "bold",
            }}
          >
            Full acces required
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "text.primary",
              lineHeight: 1.6,
            }}
          >
            {renderMessage(message)}
          </Typography>
          <Button
            variant="contained"
            color="info"
            href="https://wso2.com/contact/?ref=financial-services" // todo: update link
            target="_blank"
            size="large"
            sx={{
                padding: { xs: "5px 28px", sm: "6px, 32px", md: "8px 36px" },
                color: "#fff",
                fontWeight: { xs: 550, sm: 600 },
                fontSize: { xs: "1rem", small: "1.1rem", md: "1.2rem" },
                alignSelf: "center",
            }}
            >
            Contact Us
            </Button>
        </Box>
      </Box>
    </Box>
  );
}

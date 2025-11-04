import React from "react";
import { Box, Typography, Link } from "@mui/material";

const NARBanner = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 80,
        right: 20,
        bgcolor: "background.paper",
        color: "text.primary",
        px: 2,
        py: 1,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: {
            xs: "0.75rem", // small screens
            sm: "0.875rem", // tablets
            md: "1rem",     // desktops
            lg: "1.2rem",     // desktops
          },
          fontWeight: 400,
        }}
      >
        Now published in{" "}
        <Link
          href="https://doi.org/10.1093/nar/gkaf1074"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="primary"
          sx={{ ml: 0.5 }}
        >
          <i>Nucleic Acids Research</i>
        </Link>
      </Typography>
    </Box>
  );
};

export default NARBanner;

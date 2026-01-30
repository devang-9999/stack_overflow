"use client";

import { Box, Button, Typography, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AskQuestionModal from "./components/askQuestion";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
 
      <Box
        sx={{
          backgroundColor: "white",
          height: 64,
          display: "flex",
          flexDirection:"row",justifyContent:"space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
        }}

         >
        <Box sx={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <Typography
            sx={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              fontStyle: "italic",
              lineHeight: 1,
            }}
          >
                 <img src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg" alt="Stack Overflow" width={300} height={70}/>
          </Typography>
        </Box>
              <Typography sx={{ color: "black", fontWeight: 500, cursor: "pointer" }}>
         About
          </Typography>
                <Typography sx={{ color: "black", fontWeight: 500, cursor: "pointer" }}>
            Products
          </Typography>
                <Typography sx={{ color: "black", fontWeight: 500, cursor: "pointer" }}>
          For Teams
          </Typography>
        <Box
          sx={{
            ml: 4,
            flexGrow: 1,
            maxWidth: 600,
            display: "flex",
            backgroundColor: "white",
            border:"2px solid black",
            borderRadius: 1,
            px: 1,
          }}
        >
          <InputBase
            placeholder="Search here"
            sx={{ flex: 1, px: 1 }}
          />
          <IconButton>
            <SearchIcon sx={{ color: "#2874f0" }} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: 4, gap: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#2874f0",
              fontWeight: "bold",
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
                    <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#2874f0",
              fontWeight: "bold",
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
            onClick={() => router.push("/login")}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

  <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        <Box
          sx={{
            width: 200,
            borderRight: "1px solid #ddd",
            p: 2,
          }}
        >
          <Typography sx={{ mb: 2, cursor: "pointer",fontWeight: "bold" }}>Home</Typography>
          <Typography sx={{ mb: 2, cursor: "pointer", fontWeight: "bold" }}>
            Questions
          </Typography>
        </Box>

        <Box sx={{ flex: 1, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5">Newest Questions</Typography>

            <Button
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Ask Question
            </Button>
          </Box>

        Questions List
        </Box>
      </Box>

      <AskQuestionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
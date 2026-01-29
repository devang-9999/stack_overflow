"use client";

import { Box, Button, Typography, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
 
    </>
  );
}
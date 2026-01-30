"use client";

import { Box, Button, Typography, InputBase, IconButton, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AskQuestionModal from "./components/askQuestion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/authSlice";
import { fetchQuestionsThunk } from "@/redux/questionsSlice";
import Link from "next/link";

export default function Home() {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state: any) => state.auth.user)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {questions} = useAppSelector(state => state.question);
  console.log("ui",questions);

  // const handleLogout = () => {
  //   logout();
  //   redirect("/login")
  // }

  // const [currentPage, setCurrentPage] = useState(1);
  // const questionsPerPage = 5;

  useEffect(() => {
    dispatch(fetchQuestionsThunk());
  }, [dispatch]);

  // const publicQuestions = questions?.filter(q => q.type.toLowerCase() === 'public');
  // const indexOfLastQuestion = currentPage * questionsPerPage;
  // const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  // const currentQuestions = publicQuestions?.slice(indexOfFirstQuestion, indexOfLastQuestion);
  // const totalPages = Math.ceil((publicQuestions?.length || 0) / questionsPerPage);

  // const handleNext = () => {
  //   if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  // }

  // const handlePrev = () => {
  //   if (currentPage > 1) setCurrentPage(prev => prev - 1);
  // }

  return (
    <>

      <Box
        sx={{
          backgroundColor: "white",
          height: 64,
          display: "flex",
          flexDirection: "row", justifyContent: "space-between",
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
            <img src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg" alt="Stack Overflow" width={300} height={70} />
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
            border: "2px solid black",
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
          {/* {user ?  */}
          
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
          {/* : <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#2874f0",
              fontWeight: "bold",
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
            onClick={() => handleLogout()}
          >
            Logout
          </Button>} */}
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


         <Typography sx={{ mb: 2, cursor: "pointer", fontWeight: "bold" }}></Typography>
          <div className='question-list'>
            {questions.length ? (
              questions.map((question) => (
                <Box key={question.user.id} className='question-item' sx={{ p: 2, mb: 1, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Link href={`/questions/${question.id}`}><h3 style={{color:"blue" , fontWeight:"400"}}>{question.title}</h3></Link>
                  <p>{question.description}</p>
                  <p>
                    <strong>Author:</strong> {question.user.name || question.user.id}
                  </p>
                </Box>  
              ))
            ) : (
              <p>No public questions available</p>
            )}
          </div>
{/* 
          {questions.length&& (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handlePrev} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button variant="outlined" onClick={handleNext} disabled={currentPage === totalPages}>
                Next
              </Button>
            </Stack>
          )} */}
        </Box>
      </Box>

      <AskQuestionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
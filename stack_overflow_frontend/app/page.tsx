/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Button,
  Typography,
  InputBase,
  IconButton,
  Stack,
  Autocomplete,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AskQuestionModal from "./components/askQuestion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/authSlice";
import { fetchQuestionsThunk } from "@/redux/questionsSlice";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import AnswerList from "./components/answerList";
import { FaHome, FaQuestionCircle } from "react-icons/fa";
import { MdPublishedWithChanges, MdDrafts } from "react-icons/md";
import axios from "axios";
import "./home.css";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = useAppSelector((state: any) => state.auth.user);
  const { questions } = useAppSelector((state: any) => state.question);

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/tags").then((res: any) => {
      setTagOptions(res.data.map((t: any) => t.name));
    });
  }, []);

  useEffect(() => {
    dispatch(fetchQuestionsThunk());
  }, [dispatch]);

  const handleLogout = async () => {
    if (user?.authType !== "custom") {
      await signOut(auth);
    }
    dispatch(logout());
    router.push("/login");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );



  return (
    <>
      <Box className="navbar">
        <Box className="logo" onClick={() => router.push("/")}>
          <img
            src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg"
            alt="Stack Overflow"
          />
        </Box>

        <Box className="nav-links">
          <Typography>About</Typography>
          <Typography>Products</Typography>
          <Typography>For Teams</Typography>
        </Box>

        <Box className="search-box">
          <InputBase
            placeholder="Search by title..."
            sx={{ flex: 1 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton
            onClick={() => {
              setCurrentPage(1);
              dispatch(
                fetchQuestionsThunk({
                  search,
                  tags: selectedTags,
                })
              );
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        <Autocomplete
          multiple
          options={tagOptions}
          value={selectedTags}
          onChange={(_, value) => {
            setSelectedTags(value);
            setCurrentPage(1);
            dispatch(
              fetchQuestionsThunk({
                search,
                tags: value,
              })
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by tags" size="small" />
          )}
          sx={{ width: 250 }}
        />

        <Box className="auth-box">
          {user ? (
            <>
              <Typography>Welcome {user.email}</Typography>
              <Button
                color="error"
                variant="contained"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}

          <Button
            variant="outlined"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

      <Box className="main-layout">
        <Box className="sidebar">
          <Typography className="sidebar-item" sx={{ my: 2 }}>
            <FaHome /> Home
          </Typography>

          <Typography className="sidebar-item" sx={{ mb: 2 }}>
            <FaQuestionCircle /> Questions
          </Typography>

          <Typography
            className="sidebar-item"
            sx={{ mb: 2 }}
            onClick={() => router.push("/my-questions")}
          >
            <MdPublishedWithChanges /> Published
          </Typography>

          <Typography
            className="sidebar-item"
            sx={{ mb: 2 }}
            onClick={() => router.push("/my-drafts")}
          >
            <MdDrafts /> Draft
          </Typography>
        </Box>

        <Box className="content">
          <Box className="content-header">
            <Typography variant="h5">Latest Questions</Typography>

            <Button
              variant="contained"
              onClick={() => {
                if (user) setOpen(true);
                else router.push("/login");
              }}
            >
              Ask Question
            </Button>
          </Box>

          {currentQuestions.length ? (
            currentQuestions.map((question: any) => (
              <Box key={question.id} className="question-card">
                <Link
                  style={{ textDecoration: "none" }}
                  href={`/questions/${question.id}`}
                >
                  <h3>{question.title}</h3>
                </Link>

                {question.acceptedAnswer && (
                  <Typography sx={{ color: "green", fontWeight: "bold" }}>
                    ✔ Verified
                  </Typography>
                )}


                <div
                  dangerouslySetInnerHTML={{
                    __html: question.description,
                  }}
                />

                <p>
                  <strong>Author:</strong>{" "}
                  {question.user?.email || question.user?.id}
                  <br />
                  <strong>Tags:</strong>{" "}
                  {question.tags.map((tag: any, index: number) => (
                    <span key={tag.id}>
                      {tag.name}
                      {index < question.tags.length - 1 && ", "}
                    </span>
                  ))}
                </p>

          <AnswerList
  questionId={question.id}
  userId={user?.id}
   questionOwnerId={question.user?.id} 
/>



              </Box>
            ))
          ) : (
            <Typography>No public questions</Typography>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>

            <Typography>
              Page {currentPage} / {totalPages}
            </Typography>

            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </Stack>
        </Box>
      </Box>

      <AskQuestionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

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
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { fetchQuestionsThunk } from "@/redux/questionsSlice";
import { useRouter } from "next/navigation";
import "./admin.css";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { questions } = useAppSelector((state: any) => state.question);
  const currentUser = useAppSelector((state: any) => state.auth.user);
  console.log(currentUser)

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answersMap, setAnswersMap] = useState<Record<number, any[]>>({});

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  useEffect(() => {
    if (currentUser.email === "admin@gmail.com") {
      router.replace("/admin");
    }
  }, [currentUser, router]);

  useEffect(() => {
    axios.get("http://localhost:5000/tags").then((res) => {
      setTagOptions(res.data.map((t: any) => t.name));
    });
  }, []);

  useEffect(() => {
    dispatch(fetchQuestionsThunk());
  }, [dispatch]);

  const loadAnswers = async (questionId: number) => {
    const res = await axios.get(
      `http://localhost:5000/answers/admin/question/${questionId}`
    );

    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: res.data,
    }));
  };

  const toggleBanUser = async (user: any) => {
    if (user.isBanned) {
      await axios.patch(`http://localhost:5000/users/unban/${user.id}`);
      alert("User unbanned");
    } else {
      await axios.patch(`http://localhost:5000/users/ban/${user.id}`);
      alert("User banned");
    }

    dispatch(fetchQuestionsThunk());
  };

  if (currentUser.email !== "admin@gmail.com")
     return  <h1>You are not a admin</h1>;
 
  

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          px: 3,
          py: 1.5,
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <img
          src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg"
          alt="Stack Overflow"
          width={180}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: 2,
            px: 1,
            flexGrow: 1,
            maxWidth: 400,
          }}
        >
          <InputBase
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
          />
          <IconButton
            onClick={() => {
              setCurrentPage(1);
              dispatch(fetchQuestionsThunk({ search, tags: selectedTags }));
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
            dispatch(fetchQuestionsThunk({ search, tags: value }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by tags" size="small" />
          )}
          sx={{ width: 260 }}
        />
      </Box>

      <Box sx={{ p: 3 }}>
        {currentQuestions.length ? (
          currentQuestions.map((question: any) => (
            <Box
              key={question.id}
              sx={{
                background: "#fff",
                borderRadius: 2,
                p: 3,
                mb: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {question.title}
              </Typography>

              <Box sx={{ mt: 1, color: "#444" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: question.description,
                  }}
                />
              </Box>

              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => loadAnswers(question.id)}
              >
                Load Answers
              </Button>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Answers
                </Typography>

                {!answersMap[question.id] && (
                  <Typography variant="body2" color="text.secondary">
                    Click “Load Answers” to view answers
                  </Typography>
                )}

                {answersMap[question.id]?.length === 0 && (
                  <Typography>No answers</Typography>
                )}

                {answersMap[question.id]?.map((answer: any) => (
                  <Box
                    key={answer.id}
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 1.5,
                      background: answer.isDeleted ? "#fff1f1" : "#fff",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: answer.answer,
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      User ID: {answer.userId}
                    </Typography>

                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      color={answer.isDeleted ? "success" : "error"}
                      variant="contained"
                      onClick={async () => {
                        await axios.patch(
                          `http://localhost:5000/answers/${answer.id}/admin-toggle-delete`
                        );
                        loadAnswers(question.id);
                      }}
                    >
                      {answer.isDeleted ? "Restore Answer" : "Delete Answer"}
                    </Button>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #eee" }}>
                <Typography variant="body2">
                  <strong>Author:</strong> {question.user?.email}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Tags:</strong>{" "}
                  {question.tags.map((tag: any, i: number) => (
                    <span key={tag.id}>
                      {tag.name}
                      {i < question.tags.length - 1 && ", "}
                    </span>
                  ))}
                </Typography>

                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  color={question.user.isBanned ? "success" : "error"}
                  onClick={() => toggleBanUser(question.user)}
                >
                  {question.user.isBanned ? "Unban User" : "Ban User"}
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No questions found</Typography>
        )}

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 4 }}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Typography sx={{ pt: 1 }}>
            Page {currentPage} / {totalPages}
          </Typography>

          <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </>
  );
}

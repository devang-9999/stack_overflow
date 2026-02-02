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
import "./admin.css";

export default function AdminDashboard() {
    const dispatch = useAppDispatch();
    const { questions } = useAppSelector((state: any) => state.question);
    const currentUser = useAppSelector((state: any) => state.auth.user);

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

    /* ---------------- LOAD TAGS ---------------- */
    useEffect(() => {
        axios.get("http://localhost:5000/tags").then((res) => {
            setTagOptions(res.data.map((t: any) => t.name));
        });
    }, []);

    /* ---------------- LOAD QUESTIONS ---------------- */
    useEffect(() => {
        dispatch(fetchQuestionsThunk());
    }, [dispatch]);

    /* ---------------- LOAD ANSWERS ---------------- */
    const loadAnswers = async (questionId: number) => {
        const res = await axios.get(
            `http://localhost:5000/answers/admin/question/${questionId}`
        );

        setAnswersMap((prev) => ({
            ...prev,
            [questionId]: res.data,
        }));
    };

    /* ---------------- BAN / UNBAN USER ---------------- */
    const toggleBanUser = async (user: any) => {
        if (user.isBanned) {
            await axios.patch(
                `http://localhost:5000/users/unban/${user.id}`
            );
            alert("User unbanned");
        } else {
            await axios.patch(
                `http://localhost:5000/users/ban/${user.id}`
            );
            alert("User banned");
        }

        dispatch(fetchQuestionsThunk());
    };

    return (
        <>
            {/* ---------------- NAVBAR ---------------- */}
            <Box className="navbar">
                <img
                    src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg"
                    alt="Stack Overflow"
                    width={200}
                    height={50}
                />

                <Box className="search-box">
                    <InputBase
                        placeholder="Search by title..."
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
            </Box>

            {/* ---------------- QUESTIONS ---------------- */}
            {currentQuestions.length ? (
                currentQuestions.map((question: any) => (
                    <Box key={question.id} className="question-card">
                        <h3>{question.title}</h3>

                        <div
                            dangerouslySetInnerHTML={{
                                __html: question.description,
                            }}
                        />

                        <Button
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1 }}
                            onClick={() => loadAnswers(question.id)}
                        >
                            Load Answers
                        </Button>

                        {/* ---------------- ANSWERS ---------------- */}
                        <Box sx={{ mt: 2, pl: 2, borderLeft: "3px solid #ddd" }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Answers
                            </Typography>

                            {!answersMap[question.id] && (
                                <Typography variant="body2" color="text.secondary">
                                    Click Load Answers to view answers
                                </Typography>
                            )}

                            {answersMap[question.id]?.length === 0 && (
                                <Typography>No answers</Typography>
                            )}

                            {answersMap[question.id]?.map((answer: any) => (
                                <Box
                                    key={answer.id}
                                    sx={{
                                        mt: 1,
                                        p: 1,
                                        background: answer.isDeleted
                                            ? "#ffe6e6"
                                            : "#f9f9f9",
                                        borderRadius: 1,
                                    }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: answer.answer,
                                        }}
                                    />

                                    <Typography variant="caption">
                                        User ID: {answer.userId}
                                    </Typography>

                                    {/* SOFT DELETE / RESTORE */}
                                    <Button
                                        size="small"
                                        sx={{ mt: 1 }}
                                        color={answer.isDeleted ? "success" : "error"}
                                        variant="contained"
                                        onClick={async () => {
                                            await axios.patch(
                                                `http://localhost:5000/answers/${answer.id}/admin-toggle-delete`
                                            );
                                            loadAnswers(question.id); // reload admin answers
                                        }}
                                    >
                                        {answer.isDeleted ? "Restore Answer" : "Delete Answer"}
                                    </Button>

                                </Box>
                            ))}
                        </Box>

                        {/* ---------------- AUTHOR + TAGS ---------------- */}
                        <Box sx={{ mt: 2 }}>
                            <Typography>
                                <strong>Author:</strong>{" "}
                                {question.user?.email}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <strong>Tags:</strong>{" "}
                                {question.tags.map((tag: any, i: number) => (
                                    <span key={tag.id}>
                                        {tag.name}
                                        {i < question.tags.length - 1 && ", "}
                                    </span>
                                ))}
                            </Typography>

                            {/* ---------------- BAN / UNBAN ---------------- */}
                            <Button
                                sx={{ mt: 2 }}
                                variant="contained"
                                color={
                                    question.user.isBanned ? "success" : "error"
                                }
                                onClick={() => toggleBanUser(question.user)}
                            >
                                {question.user.isBanned
                                    ? "Unban User"
                                    : "Ban User"}
                            </Button>
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography>No questions found</Typography>
            )}

            {/* ---------------- PAGINATION ---------------- */}
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
        </>
    );
}

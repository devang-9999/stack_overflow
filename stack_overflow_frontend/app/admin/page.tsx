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
import "./admin.css"
import { fetchQuestionsThunk } from "@/redux/questionsSlice";

export default function Home() {
    const dispatch = useAppDispatch();

    const { questions } = useAppSelector((state: any) => state.question);
    const [search, setSearch] = useState("");
    const CurrentUser = useAppSelector((state: any) => state.auth.user);
    console.log(CurrentUser,"ljsjssk")
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagOptions, setTagOptions] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const currentQuestions = questions.slice(
        startIndex,
        startIndex + questionsPerPage
    );
    useEffect(() => {
        axios.get("http://localhost:5000/tags").then((res: any) => {
            setTagOptions(res.data.map((t: any) => t.name));
        });
    }, []);

    useEffect(() => {
        dispatch(fetchQuestionsThunk());
    }, [dispatch]);

    // useEffect(() => {
    //       const fetchUsers = async () => {
    //     const res = await axios.get("http://localhost:5000/users");
    //     setUsers(res.data);
    //     console.log("Users:", Users);
    // }
    // fetchUsers();
    // }, [dispatch]);


    return (
        <>
            {/* {Users.map((user: any)=>(
            <Box key={user.id} sx={{border:"1px solid black", margin:"10px", padding:"10px", borderRadius:"5px", backgroundColor:"#f9f9f9"}}>
                <Typography variant="h6">User ID: {user.id}</Typography>
                <Typography variant="body1">Email: {user.email}</Typography>
            </Box>
        ))} */}
            <Box className="navbar" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <img
                    src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg"
                    alt="Stack Overflow"
                    width={200}
                    height={50}
                />


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
            </Box>

            {currentQuestions.length ? (
                currentQuestions.map((question: any) => (
                    <Box
                        key={question.id}
                        className="question-card"
                    >
                        <h3>{question.title}</h3>

                        <div
                            dangerouslySetInnerHTML={{
                                __html: question.description,
                            }}
                        />

                        <div style={{ display: 'flex', gap: '10px', flexDirection: "column" }}>
                            <div>
                                <strong>Author:</strong>{" "}
                                {question.user?.email || question.user?.id}
                            </div>
                            <br />

                            <div>
                                <strong>Tags:</strong>{" "}
                                {question.tags.map((tag: any, index: number) => (
                                    <span key={tag.id}>
                                        {tag.name}
                                        {index < question.tags.length - 1 && ", "}
                                    </span>
                                ))}
                            </div>


                            {CurrentUser.isBanned ? (<Button variant="contained" onClick={async () => {
                                await axios.patch(`http://localhost:5000/users/ban/${question.user.id}`);
                                alert("User Banned Successfully");
                            }}>
                                Ban User
                            </Button>) : (<Button variant="contained" onClick={async () => {
                                await axios.patch(`http://localhost:5000/users/unban/${question.user.id}`);
                                alert("User Unbanned Successfully");
                            }}>
                                Unban User
                            </Button>)
                            }
                        </div>
                    </Box>
                ))
            ) : (
                <Typography>No public questions</Typography>
            )}

            <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: 3 }}
            >
                <Button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage((p) => p - 1)
                    }
                >
                    Previous
                </Button>

                <Typography>
                    Page {currentPage} / {totalPages}
                </Typography>

                <Button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                        setCurrentPage((p) => p + 1)
                    }
                >
                    Next
                </Button>
            </Stack>



        </>
    );
}

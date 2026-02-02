/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUserPublishedThunk,
  updateQuestionStatusThunk,
} from "@/redux/questionsSlice";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function MyQuestionsPage() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s: any) => s.auth.user);
  const { userPublished } = useAppSelector((s: any) => s.question);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPublishedThunk(user.id));
    }
  }, [user, dispatch]);

  if (!user) {
    return <Typography>Please login first</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Published Questions
      </Typography>

      {userPublished.length === 0 ? (
        <Typography>No published questions</Typography>
      ) : (
        userPublished.map((q: any) => (
          <Box
            key={q.id}
            sx={{ border: "1px solid #ccc", p: 2, mb: 2 }}
          >
            <Link href={`/questions/${q.id}`}>
              <h3 style={{ color: "blue", cursor: "pointer" }}>
                {q.title}
              </h3>
            </Link>

            <p>{q.description}</p>

            <Button
              variant="outlined"
              color="warning"
              size="small"
              sx={{ mt: 1 }}
              onClick={() =>
                dispatch(
                  updateQuestionStatusThunk({
                    questionId: q.id,
                    userId: user.id,
                    status: "draft",
                  })
                )
              }
            >
              Move to Draft
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
}

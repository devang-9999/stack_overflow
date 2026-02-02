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
  }, [user?.id, dispatch]);

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
            sx={{
              border: "1px solid #ccc",
              p: 2,
              mb: 2,
              borderRadius: 1,
            }}
          >
            <Link href={`/questions/${q.id}`} style={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                sx={{ color: "blue", cursor: "pointer" }}
              >
                {q.title}
              </Typography>
            </Link>

            {q.acceptedAnswer && (
              <Typography
                sx={{
                  color: "green",
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                ✔ Verified (Accepted Answer)
              </Typography>
            )}

            <Box sx={{ mt: 1 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: q.description,
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="warning"
                size="small"
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
          </Box>
        ))
      )}
    </Box>
  );
}

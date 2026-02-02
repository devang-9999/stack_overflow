/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUserDraftsThunk,
  updateQuestionStatusThunk,
} from "@/redux/questionsSlice";

import { Box, Button, Typography } from "@mui/material";

export default function MyDraftsPage() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s: any) => s.auth.user);
  const { userDrafts } = useAppSelector((s: any) => s.question);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserDraftsThunk(user.id));
    }
  }, [user, dispatch]);

  if (!user) {
    return <Typography>Please login first</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Draft Questions
      </Typography>

      {userDrafts.length === 0 ? (
        <Typography>No draft questions</Typography>
      ) : (
        userDrafts.map((q: any) => (
          <Box
            key={q.id}
            sx={{ border: "1px solid #aaa", p: 2, mb: 2 }}
          >
            <h3>{q.title}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: q.description,
              }}
            />

            <Button
              variant="contained"
              size="small"
              sx={{ mt: 1 }}
              onClick={() =>
                dispatch(
                  updateQuestionStatusThunk({
                    questionId: q.id,
                    userId: user.id,
                    status: "published",
                  })
                )
              }
            >
              Publish
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
}

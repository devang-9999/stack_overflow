/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/redux/hooks';

export default function AnswerList({   questionId,
  userId, }: {  questionId: number;
  userId: number; }) {
  const { user } = useAppSelector((s: any) => s.auth);

  const [answers, setAnswers] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  const refreshAnswers = async () => {
    const res = await axios.get(
      `http://localhost:5000/answers/question/${questionId}?userId=${userId}`
    );
    setAnswers(res.data);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!questionId) return;
      const res = await axios.get(
        `http://localhost:5000/answers/question/${questionId}?userId=${userId}`
      );
      if (!cancelled) setAnswers(res.data);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [questionId, user?.id]);

  const handleVote = async (answerId: number, value: number) => {
    if (!user) {
      alert('Login required');
      return;
    }

    await axios.post('http://localhost:5000/votes', {
      answerId,
      userId: user.id,
      value,
    });

    refreshAnswers(); 
  };

  const submitReply = async (parentAnswerId: number) => {
    if (!user) {
      alert('Login required');
      return;
    }

    await axios.post('http://localhost:5000/answers', {
      text: replyTexts[parentAnswerId],
      questionId,
      userId: user.id,
      parentAnswerId,
    });

    setReplyTexts((prev) => ({ ...prev, [parentAnswerId]: '' }));
    setReplyingTo(null);
    refreshAnswers(); 
  };

  return (
    <Box sx={{ mt: 2 }}>
      {answers.length === 0 && <Typography>No answers yet</Typography>}

      {answers.map((answer) => (
        <Box
          key={answer.id}
          sx={{
            p: 2,
            mb: 2,
            borderLeft: '4px solid #1976d2',
            background: '#fafafa',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: answer.answer }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={() => handleVote(answer.id, 1)}
              color={answer.myVote === 1 ? 'primary' : 'default'}
            >
              <ThumbUpIcon />
            </IconButton>

            <IconButton
              onClick={() => handleVote(answer.id, -1)}
              color={answer.myVote === -1 ? 'error' : 'default'}
            >
              <ThumbDownIcon />
            </IconButton>

            <Button
              size="small"
              onClick={() =>
                setReplyingTo(replyingTo === answer.id ? null : answer.id)
              }
            >
              Reply
            </Button>
          </Stack>

          {replyingTo === answer.id && (
            <Box sx={{ mt: 1, ml: 3 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                value={replyTexts[answer.id] ?? ''}
                onChange={(e) =>
                  setReplyTexts((prev) => ({
                    ...prev,
                    [answer.id]: e.target.value,
                  }))
                }
                placeholder="Write a reply..."
              />

              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={() => submitReply(answer.id)}
                disabled={!replyTexts[answer.id]?.trim()}
              >
                Submit Reply
              </Button>
            </Box>
          )}


          {(answer.replies ?? []).map((reply: any) => (
            <Box
              key={reply.id}
              sx={{
                mt: 1,
                ml: 4,
                p: 1,
                borderLeft: '2px solid #ccc',
                background: '#fff',
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: reply.answer }} />

              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => handleVote(reply.id, 1)}
                  color={reply.myVote === 1 ? 'primary' : 'default'}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => handleVote(reply.id, -1)}
                  color={reply.myVote === -1 ? 'error' : 'default'}
                >
                  <ThumbDownIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

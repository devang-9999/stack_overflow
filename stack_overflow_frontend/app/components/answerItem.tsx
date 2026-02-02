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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useState } from 'react';

interface Props {
  answer: any;
  questionId: number;
  questionOwnerId: number;
  currentUser: any;
  refresh: () => void;
  level: number;
}

export default function AnswerItem({
  answer,
  questionId,
  questionOwnerId,
  currentUser,
  refresh,
  level,
}: Props) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState('');

  const isOwner = currentUser?.id === questionOwnerId;

  const handleVote = async (value: number) => {
    if (!currentUser) {
      alert('Login required');
      return;
    }

    await axios.post('http://localhost:5000/votes', {
      answerId: answer.id,
      userId: currentUser.id,
      value,
    });

    refresh(); // 🔥 reload answers so color updates
  };

  const toggleVerify = async () => {
    await axios.patch(
      `http://localhost:5000/answers/${answer.id}/toggle-verify`,
      { userId: currentUser.id }
    );
    refresh();
  };

  const submitReply = async () => {
    if (!currentUser) {
      alert('Login required');
      return;
    }

    await axios.post('http://localhost:5000/answers', {
      text,
      questionId,
      userId: currentUser.id,
      parentAnswerId: answer.id,
    });

    setText('');
    setReplying(false);
    refresh();
  };

  return (
    <Box
      sx={{
        mt: 2,
        ml: level * 4,
        p: 2,
        borderLeft: answer.isValid
          ? '4px solid green'
          : '4px solid #1976d2',
        background: answer.isValid ? '#e8f5e9' : '#fafafa',
        borderRadius: 1,
      }}
    >
      {answer.isValid && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CheckCircleIcon color="success" />
          <Typography color="green" fontWeight="bold">
            Verified Answer
          </Typography>
        </Stack>
      )}

      <Box sx={{ mt: 1 }}>
        <div dangerouslySetInnerHTML={{ __html: answer.answer }} />
      </Box>

      {isOwner && (
        <Button
          size="small"
          sx={{ mt: 1 }}
          color={answer.isValid ? 'error' : 'success'}
          onClick={toggleVerify}
        >
          {answer.isValid ? '✖ Unverify' : '✔ Verify'}
        </Button>
      )}

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={() => handleVote(1)}
          color={answer.myVote === 1 ? 'primary' : 'default'}
        >
          <ThumbUpIcon />
        </IconButton>
        <Typography fontWeight="bold">👍 {answer.upVotes}</Typography>

        <IconButton
          onClick={() => handleVote(-1)}
          color={answer.myVote === -1 ? 'error' : 'default'}
        >
          <ThumbDownIcon />
        </IconButton>
        <Typography fontWeight="bold">👎 {answer.downVotes}</Typography>


        <Button size="small" onClick={() => setReplying(!replying)}>
          Reply
        </Button>

        <Typography sx={{ ml: 1 }}>
  Score: {answer.score}
</Typography>
      </Stack>

      {replying && (
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button
            size="small"
            sx={{ mt: 1 }}
            disabled={!text.trim()}
            onClick={submitReply}
          >
            Submit Reply
          </Button>
        </Box>
      )}

      {(answer.replies ?? []).map((child: any) => (
        <AnswerItem
          key={child.id}
          answer={child}
          questionId={questionId}
          questionOwnerId={questionOwnerId}
          currentUser={currentUser}
          refresh={refresh}
          level={level + 1}
        />
      ))}
    </Box>
  );
}

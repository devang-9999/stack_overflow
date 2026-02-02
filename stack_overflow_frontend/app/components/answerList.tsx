/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/redux/hooks';
import AnswerItem from './answerItem';

interface Props {
  questionId: number;
  userId: number;
  questionOwnerId: number;
}

export default function AnswerList({
  questionId,
  userId,
  questionOwnerId,
}: Props) {
  const { user } = useAppSelector((s: any) => s.auth);
  const [answers, setAnswers] = useState<any[]>([]);

  const fetchAnswers = async () => {
    const res = await axios.get(
      `http://localhost:5000/answers/question/${questionId}?userId=${userId}`
    );
    setAnswers(res.data);
  };

  useEffect(() => {
    if (questionId) fetchAnswers();
  }, [questionId]);

  return (
    <Box sx={{ mt: 2 }}>
      {answers.length === 0 && (
        <Typography>No answers yet</Typography>
      )}

      {answers.map((answer) => (
        <AnswerItem
          key={answer.id}
          answer={answer}
          questionId={questionId}
          questionOwnerId={questionOwnerId}
          currentUser={user}
          refresh={fetchAnswers}
          level={0}
        />
      ))}
    </Box>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Box, Button, Snackbar, Alert } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchQuestionsThunkById } from '@/redux/questionsSlice';

import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {
  RichTextEditor,
  MenuControlsContainer,
  MenuSelectHeading,
  MenuDivider,
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonUnderline,
  MenuButtonStrikethrough,
  MenuButtonOrderedList,
  MenuSelectTextAlign,
} from 'mui-tiptap';
import { useRouter } from 'next/navigation';
import AnswerList from '@/app/components/answerList';

export default function QuestionsForId() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { question } = useAppSelector(
    (state: any) => state.question
  );

  const{user} = useAppSelector((state)=>state.auth)

  const [answerContent, setAnswerContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
const [myAnswerId, setMyAnswerId] = useState<number | null>(null);

const fetchMyAnswer = async () => {
  if (!user?.id || !id) return;

  const res = await axios.get(
         `http://localhost:5000/answers/question/${id}?userId=${user.id}`

  );
  const myAnswer = res.data.find(
    (a: any) => a.userId === user.id
  );

  if (myAnswer) {
    setHasAnswered(true);
    setMyAnswerId(myAnswer.id);
    setAnswerContent(myAnswer.answer); 
  }
};

useEffect(() => {
  if (!id) return;

  dispatch(fetchQuestionsThunkById(Number(id)));

  if (user?.id) {
    fetchMyAnswer();
  }
}, [dispatch, id, user?.id]);


  const submitAnswer = async () => {
    if (!answerContent.trim()) return;

    try {
      setLoading(true);
      
      await axios.post('http://localhost:5000/answers', {
        text: answerContent,
        questionId: Number(id),
        userId: user?.id,
      });
      setHasAnswered(true);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to post answer:', error);
    } finally {
      setLoading(false);
    }
  };


  if (!question) {
    return <p>Loading question...</p>;
  }

  return (

    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>

      <Box sx={{ p: 2, mb: 3, border: '1px solid #ccc', borderRadius: 2 }}>
        <h2>{question.title}</h2>
        <p>
          <strong>Author:</strong> {question.user?.email}
        </p>
      </Box>
     {hasAnswered && (
  <Box sx={{ mb: 1 }}>
    <Alert severity="info">
      You already answered this question. You can edit your answer below.
    </Alert>
  </Box>
)}

      <RichTextEditor
        immediatelyRender={false}
        extensions={[
          StarterKit,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
        ]}
        content={answerContent}
        onUpdate={({ editor }) => {
          setAnswerContent(editor.getHTML());
        }}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonUnderline />
            <MenuButtonStrikethrough />
            <MenuDivider />
            <MenuButtonOrderedList />
            <MenuDivider />
            <MenuSelectTextAlign />
          </MenuControlsContainer>
        )}
      />

{user ? (
  <Button
    variant="contained"
    sx={{ mt: 2 }}
    onClick={submitAnswer}
    disabled={loading}
  >
    {loading
      ? 'Saving...'
      : hasAnswered
      ? 'Update your answer'
      : 'Post your answer'}
  </Button>
) : (
  <Button
    variant="contained"
    sx={{ mt: 2 }}
    onClick={() => router.push("/login")}
  >
    Login to post an answer
  </Button>
)}


  
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Answer posted successfully 🎉
        </Alert>
      </Snackbar>
    </Box>
  );
}

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchQuestionsThunkById } from "@/redux/questionsSlice";
import Button from "@mui/material/Button";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonUnderline,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuButtonAlignLeft,
  MenuButtonAlignCenter,
  MenuButtonAlignRight,
  MenuButtonOrderedList,
  RichTextEditor,
  type RichTextEditorRef,
  MenuSelectTextAlign
} from "mui-tiptap";
import { useRef } from "react";
import TextAlign from '@tiptap/extension-text-align';



export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch()
  const rteRef = useRef<RichTextEditorRef>(null);
  const { question } = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.question
  );
  console.log("question detail", question);


  useEffect(() => {

    const fetchQuestion = async () => {
      if (id) {

        await dispatch(fetchQuestionsThunkById(Number(id)));
      }
    };

    fetchQuestion();
  }, [dispatch, id]);

  return (
    <div>
      {/* <Box key={question.id} className='question-item' sx={{ p: 2, mb: 1, border: '1px solid #ccc', borderRadius: 2 }}>

                  <p>{question.title}</p>
                <p>
                     <strong>Author:</strong> {question.user.email || question.id}
                 </p>
               </Box>   */}
      <div>
        <RichTextEditor
          ref={rteRef}
          immediatelyRender={false}
          extensions={[
            StarterKit, 
            TextAlign.configure({
            types: ["heading", "paragraph", "image"],
          }),]}
          content="<p>Hello world</p>"
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

        <Button onClick={() => console.log(rteRef.current?.editor?.getHTML())}>
          Log HTML
        </Button>
      </div>


    </div>
  );

}



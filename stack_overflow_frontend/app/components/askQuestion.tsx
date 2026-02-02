/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addQuestionThunk } from "../../redux/questionsSlice";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";
import { useEffect, useState } from "react";
import axios from "axios";

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, "").trim();


const questionSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(55, "Title cannot exceed 55 characters"),

  description: z
  .string()
  .refine(
    (val) => stripHtml(val).length <= 2000,
    "Description can have max 2000 characters"
  )
  .refine(
    (val) => stripHtml(val).length > 0,
    "Description cannot be empty"
  ),


  type: z.string().min(1, "Type is required"),

  tags: z.array(z.string()).min(1, "Add at least one tag"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function AskQuestionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.auth.user);

  const [tagOptions, setTagOptions] = useState<string[]>([]);

  useEffect(() => {

const fetchTags = async () => {
  try {
    const res = await axios.get("http://localhost:5000/tags");

    const names = res.data.map((tag: any) => tag.name);

    setTagOptions(names);
  } catch (err) {
    console.error("Failed to load tags", err);
  }
};

    fetchTags();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      tags: [],
      description: "",
    },
  });

  const onSubmit = (data: QuestionFormData) => {
    if (!user) return;

    dispatch(
      addQuestionThunk({
        title: data.title,
        description: data.description,
        type: data.type,
        tags: data.tags,
        userId: user.id,
      })
    );

    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" mb={2}>
          Ask a Question
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
      
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <RichTextEditor
                sx={{
                  mt: 2,
                  mb: 2,
                  border: fieldState.error
                    ? "1px solid red"
                    : "1px solid #ddd",
                }}
                immediatelyRender={false}
                extensions={[StarterKit]}
                content={value || "<p></p>"}
                onUpdate={({ editor }) =>
                  onChange(editor.getHTML())
                }
                renderControls={() => (
                  <MenuControlsContainer>
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                  </MenuControlsContainer>
                )}
              />
            )}
          />

  
          <TextField
            fullWidth
            label="Type (e.g. backend, frontend)"
            margin="normal"
            {...register("type")}
            error={!!errors.type}
            helperText={errors.type?.message}
          />

   
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                freeSolo
                options={tagOptions}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Type or select tags"
                    margin="normal"
                    error={!!errors.tags}
                    helperText={errors.tags?.message}
                  />
                )}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Post Question
          </Button>
        </form>
      </Box>
    </Modal>
  );
}



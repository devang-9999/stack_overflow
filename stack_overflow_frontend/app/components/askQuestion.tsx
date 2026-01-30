"use client";

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
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

const questionSchema = z.object({
  title: z.string().max(55, "Title must be at least 10 characters"),
  description: z.string().max(2000, "Description can have 2000 characters"),
  type: z.string().min(1, "Type is required"),
  tags: z.string().min(1, "Add at least one tag"),

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user= useAppSelector((state:any) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = (data: QuestionFormData) => {
    console.log(user)
    dispatch(
      addQuestionThunk({
        title: data.title,
        description: data.description,
        type: data.type,
        tags: data.tags.split(",").map((t) => t.trim()),
        userId:user.id
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

{/* <TextField
  fullWidth
  multiline
  rows={4}
  label="Description"
  margin="normal"
  {...register("description")}
  error={!!errors.description}
  helperText={errors.description?.message}
/> */}
<Controller
  name="description"
  control={control}
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <RichTextEditor
      sx={{ 
        mt: 2, 
        mb: 2,
        border: error ? "1px solid red" : "inherit"
      }}
      immediatelyRender={false}
      extensions={[StarterKit]}
      content={value || "<p></p>"}
      onUpdate={({ editor }) => onChange(editor.getHTML())}
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

<TextField
  fullWidth
  label="Tags (comma separated)"
  margin="normal"
  {...register("tags")}
  error={!!errors.tags}
  helperText={errors.tags?.message}
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

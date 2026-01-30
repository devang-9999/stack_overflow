"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from "firebase/auth";
import { auth, gitProvider, provider } from "../../firebase/firebase";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginThunk } from "../../redux/authSlice";

import "./login.css";


const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;


export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginThunk({
       email: data.email,
       password: data.password,
    }));
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/"), 500)

    }
    catch {
      alert("Google sign in failed")
    }
  };

  const handleGithubSignUp = async () => {
    try {
      await signInWithPopup(auth, gitProvider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/"), 500)

    }
    catch {
      alert("Github sign up failed")
    }
  };


  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnackbarOpen(true);
    }

    if (user) {
      setSnackbarOpen(true);
      reset();
      setTimeout(() => {
        redirect("/");
      }, 300);
    }
  }, [error, user, reset, router]);

  return (
    <div className="cont">
      <img
        src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg"
        alt="Stack Overflow"
        width={300}
      />


      <div className="btn">
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: "white", color: "black" }}
          onClick={handleGoogleSignUp}
        >
          <FcGoogle style={{ fontSize: 24, marginRight: 10 }} />
          Sign in with Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2, backgroundColor: "black" }}
          onClick={handleGithubSignUp}
        >
          <FaGithub style={{ fontSize: 24, marginRight: 10 }} />
          Sign in with GitHub
        </Button>
      </div>

      {/* Login form */}
      <div className="DesignLogin">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Link href="/signup" style={{ color: "#1976d2" , textDecoration:"none"}}>
              Sign up
            </Link>
          </Typography>
        </form>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={error ? "error" : "success"}
          onClose={() => setSnackbarOpen(false)}
        >
          {error ? error : "Login successful"}
        </Alert>
      </Snackbar>
    </div>
  );
}

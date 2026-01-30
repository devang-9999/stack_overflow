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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { signInWithPopup } from "firebase/auth";
import { auth, provider, gitProvider } from "../../firebase/firebase";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { signupThunk } from "../../redux/authSlice";

import "./signup.css";


const RegisterSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;



export default function Register() {
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    dispatch(signupThunk({
      email:data.email,
      password:data.password
    }));
  };
  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/login"), 500)

    }
    catch {
      alert("Google sign in failed")
    }
  };

  const handleGithubSignUp = async () => {
    try {
      await signInWithPopup(auth, gitProvider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/login"), 500)

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
        router.push("/login");
      }, 800);
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
          Sign up with Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2, backgroundColor: "black" }}
          onClick={handleGithubSignUp}
        >
          <FaGithub style={{ fontSize: 24, marginRight: 10 }} />
          Sign up with GitHub
        </Button>
      </div>

      <div className="Design">
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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#1976d2" }}>
              Login
            </Link>
          </Typography>
        </form>
      </div>

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
          {error ? error : "Registration successful"}
        </Alert>
      </Snackbar>
    </div>
  );
}

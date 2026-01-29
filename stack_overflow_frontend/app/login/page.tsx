"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./login.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, gitProvider, provider } from "../../firebase/firebase";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginUserThunk, resetAuthState } from "../../redux/authSlice";

const LoginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, success, error, message, user } = useAppSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

   const handleLogin = async (data: LoginFormData) => {

    dispatch(loginUserThunk(data));
    try {
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password);
      alert("User Logged in successfully");
      // showSnackbar("User Logged In Successfully")
      setTimeout(() => redirect("/"), 500)

    }
    catch (error) {
      alert("Invalid username or password")
      // showSnackbar("Invalid Username Or Password")
      setTimeout(() => redirect("/"), 500)

    }
  };
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/"), 500)

    }
    catch (error) {
      alert("Google sign in failed")
      setTimeout(() => redirect("/signup"), 500)
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, gitProvider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/login"), 500)

    }
    catch (error) {
      alert("Github sign up failed")
    }
  }


  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }

    if (success && user) {
      setSnackbarMessage(message || "Login successful");
      setSnackbarOpen(true);
      reset();
    }
    return () => {
      dispatch(resetAuthState());
    };
  }, [success, error, message, user, router, reset, dispatch]);

  return (
    <>
<div className="cont">
 <img src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg" alt="Stack Overflow" width={300} height={70}/>
 <div className="btn">
                      <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 ,backgroundColor:"white",color:"black"}}
            onClick={handleGoogleLogin}
          >
            <FcGoogle style={{ fontSize: '25px',marginRight:"10px" }}/>Sign in with Google
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 ,backgroundColor:"black"}}
            onClick={handleGithubSignIn}
          >
            <FaGithub style={{ fontSize: '25px',marginRight:"10px" }}/>  Sign in with Github
          </Button>
              </div>

        <div className="DesignLogin">
             
          <form onSubmit={handleSubmit(handleLogin)}>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <FormControl fullWidth error={!!errors.password}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                sx={{ mb: 2 }}
                type={showPassword ? "text" : "password"}
                {...register("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
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

            <Typography
              align="center"
              sx={{
                mt: 2,
                color: "rgba(40, 116, 240)",
                fontWeight: "bold",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/authentication/register"
                style={{
                  textDecoration: "none",
                  color: "rgba(40, 116, 240)",
                }}
              >
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
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
</div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./signup.css";
import { FaGithub, FaGoogle } from "react-icons/fa";
// import StackOverflow from "../../public/Icon.png"

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

import { signInWithPopup } from "firebase/auth";
import { auth, gitProvider, provider } from "../../firebase/firebase";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { registerUserThunk, resetAuthState } from "../../redux/authSlice";
import { FcGoogle } from "react-icons/fc";

const RegisterUserSchema = z.object({
  useremail: z.string().email("Invalid email"),
  userPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => !val.includes(" "), {
      message: "Password must not contain spaces",
    }),
});

type RegisterFormData = z.infer<typeof RegisterUserSchema>;

export default function Register() {
  const dispatch = useAppDispatch();
  const { loading, success, error, message } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
    },
  });

  const handleRegister = (data: RegisterFormData) => {
    dispatch(
      registerUserThunk({
        useremail: data.useremail,
        userPassword: data.userPassword,
      })
    );
  };


  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/login"), 500)

    }
    catch (error) {
      alert("Google sign in failed")
    }
  };

  const handleGithubSignUp = async () => {
    try {
      await signInWithPopup(auth, gitProvider);
      alert("User Logged in successfully");
      setTimeout(() => redirect("/login"), 500)

    }
    catch (error) {
      alert("Github sign up failed")
    }
  };
  // const handleGoogleSignup = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);

  //     const email = result.user.email;

  //     if (!email) {
  //       setSnackbarMessage("Google sign up failed");
  //       setSnackbarSeverity("error");
  //       setSnackbarOpen(true);
  //       return;
  //     }

  //     dispatch(
  //       registerUserThunk({
  //         useremail: email,
  //         userPassword: "12345678",
  //       })
  //     );
  //   } catch {
  //     setSnackbarMessage("Google sign up failed");
  //     setSnackbarSeverity("error");
  //     setSnackbarOpen(true);
  //   }
  // };

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    if (success) {
      setSnackbarMessage(message || "Registration successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      reset();
      setTimeout(() => {
        router.push("/authentication/login");
      }, 800);
    }

    return () => {
      dispatch(resetAuthState());
    };
  }, [success, error, message, dispatch, reset, router]);

  return (
    <>
      <div className="cont">
        <img src="https://www.logo.wine/a/logo/Stack_Overflow/Stack_Overflow-Logo.wine.svg" alt="Stack Overflow" width={300} height={70} />
        <div className="btn">
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: "black", backgroundColor: "white" }}
            onClick={handleGoogleSignUp}
          >
           <FcGoogle style={{ fontSize: '25px',marginRight:"10px" }}/>
            Sign up with Google
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "black" }}
            onClick={handleGithubSignUp}
          >
            <FaGithub style={{ fontSize: '25px',marginRight:"10px" }}/>Sign Up with Github
          </Button>
        </div>

        <div className="Design">
          <form onSubmit={handleSubmit(handleRegister)}>


            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Email Address"
              {...register("useremail")}
              error={!!errors.useremail}
              helperText={errors.useremail?.message}
            />

            <FormControl fullWidth error={!!errors.userPassword}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                sx={{ mb: 2 }}
                type={showPassword ? "text" : "password"}
                {...register("userPassword")}
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
              <FormHelperText>{errors.userPassword?.message}</FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Sign Up"}
            </Button>

            <Typography
              align="center"
              sx={{
                mt: 2,
                color: "rgba(40, 116, 240)",
                fontWeight: "bold",
              }}
            >
              Dont have an account ?{" "}
              <Link
                href="/authentication/login"
                style={{
                  textDecoration: "none",
                  color: "rgba(40, 116, 240)",
                }}
              >
                SignUp
              </Link>
            </Typography>

          </form>



        </div>



        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
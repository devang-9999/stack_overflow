/* eslint-disable @typescript-eslint/no-explicit-any */

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { setUser, clearUser } from "./authSlice";

export const startAuthListener = (dispatch: any, getState: any) => {
  onAuthStateChanged(auth, (firebaseUser) => {
    const state = getState();
    const existingUser = state.auth.user;

    if (existingUser?.authType === "custom") {
      return;
    }

    if (firebaseUser) {
      dispatch(setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        authType: "firebase",
      }));
    } 

    else {
      dispatch(clearUser());
    }
  });
};


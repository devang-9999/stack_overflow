"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { startAuthListener } from "@/redux/authListener";
import { store } from "./store";

export default function AuthInit() {
  const dispatch = useAppDispatch();


useEffect(() => {
  startAuthListener(dispatch, store.getState);
}, [dispatch]);


  return null;
}

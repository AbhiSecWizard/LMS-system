import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../features/authSlice.js";
import { authApi } from "../features/api/authApi.js";
import { courseApi } from "@/features/courseApi";
import { purchaseApi } from "../features/purchaseApi.js"; // ✅ NEW
import {courseProgressApi} from "../features/courseProgressApi.js"
const rootReducer = combineReducers({
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer, // ✅ NEW
  [courseProgressApi.reducerPath]: courseProgressApi.reducer
});

export default rootReducer;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import authApi from "../features/api/authApi";
import { courseApi } from "@/features/courseApi"; // ✅ imported successfully

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,   // ✅ RTK Query reducer for Auth
    [courseApi.reducerPath]: courseApi.reducer, // 🚀 ADD THIS LINE HERE!
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware), // ✅ Middlewares are good!
});

const initializeApp = async () => {
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};
initializeApp();

export default appStore;
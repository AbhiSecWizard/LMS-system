import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import authApi from "../features/api/authApi";
import { courseApi } from "@/features/courseApi"; 
import { purchaseApi } from "@/features/purchaseApi";
import { courseProgressApi } from "@/features/courseProgressApi"; // Sahi imported default/named

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,   
    [courseApi.reducerPath]: courseApi.reducer, 
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    
    // 🌟 FIX IS HERE: .reducer ki jagah .reducerPath likhein
    [courseProgressApi.reducerPath]: courseProgressApi.reducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      courseApi.middleware,
      purchaseApi.middleware, 
      courseProgressApi.middleware // Middleware bilkul sahi laga hai!
    ), 
});

const initializeApp = async () => {
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};

initializeApp();

export default appStore;
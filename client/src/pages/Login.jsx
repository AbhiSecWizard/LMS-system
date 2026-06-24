import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";



const Login = () => {
  const [inputSignup, setInputSignup] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [inputLogin, setInputLogin] = useState({
    email: "",
    password: "",
  });

  // Clean, proper handler using the 'type' argument you provided
  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setInputSignup((prev) => ({ ...prev, [name]: value }));
    } else if (type === "login") {
      setInputLogin((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
const navigate = useNavigate()
const handleRegistration = async (type) => {
  const inputData = type === "signup" ? inputSignup : inputLogin;
  const action = type === "signup" ? registerUser : loginUser;
  
  // Await the response here
  const result = await action(inputData);
  
  // Only clear if successful (optional, but better UX)
  if (result.data) {
    if (type === "signup") setInputSignup({ name: "", email: "", password: "" });
    else setInputLogin({ email: "", password: "" });
  }
};

useEffect(() => {
  // 1. Handle Successful Registration
  if (registerIsSuccess && registerData) {
    toast.success(registerData.message || "Signed up successfully!");
    console.log(registerData)
    navigate("/");
  }

  // 2. Handle Successful Login
  if (loginIsSuccess && loginData) {
    toast.success(loginData.message || "Logged in successfully!");
    navigate("/");
  }

  // 3. Handle Registration Error
  if (registerError) {
    // IMPORTANT: Access the data.message sent from your Express backend
    // Use toast.error (red) instead of toast.success (green) for errors
    const errorMsg = registerError.data?.message || "Registration failed";
    toast.error(errorMsg); 
  }

  // 4. Handle Login Error
  if (loginError) {
    const errorMsg = loginError.data?.message || "Login failed";
    toast.error(errorMsg);
  }

  // NOTE: We do NOT use "return toast..." because it causes the "destroy" error.
}, [
  registerIsSuccess,
  loginIsSuccess,
  registerData,
  loginData,
  registerError,
  loginError,
  navigate
]);

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
      
      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 to-purple-700 text-white p-10">
        <h1 className="text-5xl font-bold mb-4">
          Learn Without Limits
        </h1>

        <p className="text-lg text-center text-gray-200 max-w-md">
          Join thousands of students and start mastering modern web
          development today.
        </p>

        <img
          src="https://illustrations.popsy.co/white/web-design.svg"
          alt="learning"
          className="w-[400px] mt-8"
        />
      </div>

      {/* Right Section */}
      <div className="p-8 lg:p-12 flex items-center justify-center dark:bg-black dark:text-white text-black bg-white">
        <Tabs defaultValue="signup" className="w-full max-w-md">
          <TabsList className="grid grid-cols-2 w-full h-12">
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          {/* Signup */}
          <TabsContent value="signup">
            <div className="space-y-5 mt-6">
              <div>
                <h2 className="text-3xl font-bold">
                  Create Account
                </h2>
                <p className="text-gray-500">
                  Start your learning journey today.
                </p>
              </div>

              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={inputSignup.name}
                  onChange={(e) => handleChange(e, "signup")}
                  className="mt-2 h-11 text-black bg-gray-400/10 dark:text-white"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={inputSignup.email}
                  onChange={(e) => handleChange(e, "signup")}
                  className="mt-2 h-11 text-black bg-gray-400/10 dark:text-white"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={inputSignup.password}
                  onChange={(e) => handleChange(e, "signup")}
                  className="mt-2 h-11 text-black bg-gray-400/10 dark:text-white"
                />
              </div>

              <Button
                onClick={() => handleRegistration("signup")}
                disabled={registerIsLoading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700"
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Login */}
          <TabsContent value="login">
            <div className="space-y-5 mt-6">
              <div>
                <h2 className="text-3xl font-bold">
                  Welcome Back
                </h2>
                <p className="text-gray-500">
                  Login to continue learning.
                </p>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={inputLogin.email}
                  onChange={(e) => handleChange(e, "login")}
                  className="mt-2 h-11 text-black bg-gray-400/10 dark:text-white"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={inputLogin.password}
                  onChange={(e) => handleChange(e, "login")}
                  className="mt-2 h-11 text-black bg-gray-400/10 dark:text-white"
                />
              </div>

              <Button
                onClick={() => handleRegistration("login")}
                disabled={loginIsLoading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700"
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
);
};

export default Login;

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
    <div className="flex h-screen overflow-x-hidden bg-gray-100 items-center justify-center">
      <Tabs defaultValue="signup" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* Signup Tab */}
        <TabsContent value="signup">
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium">Sign up</h3>
            <p className="text-sm text-muted-foreground">
              Create a new account and click signup when you're done.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="s-name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="s-name"
                  placeholder="Eg. abhishek"
                  value={inputSignup.name}
                  onChange={(e) => handleChange(e, "signup")}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="s-email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="s-email"
                  placeholder="example@gmail.com"
                  value={inputSignup.email}
                  onChange={(e) => handleChange(e, "signup")}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="s-password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="s-password"
                  value={inputSignup.password}
                  onChange={(e) => handleChange(e, "signup")}
                  className="mt-2"
                />
              </div>
              <Button
                disabled={registerIsLoading}
                onClick={() =>handleRegistration("signup")}
                className="w-full mt-2"
              >
                {
                  registerIsLoading ? (
                   <> 
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait                    </>
                  ) :"Signup"  
                }
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Login Tab */}
        <TabsContent value="login">
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium">Login</h3>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="l-email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="l-email"
                  placeholder="example@gmail.com"
                  value={inputLogin.email}
                  onChange={(e) => handleChange(e, "login")}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="l-password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="l-password"
                  value={inputLogin.password}
                  onChange={(e) => handleChange(e, "login")}
                  className="mt-2"
                />
              </div>
              <Button
               
                disabled={loginIsLoading}
                onClick={() =>handleRegistration("login")}
                className="w-full mt-2"
              >
                {
                    loginIsLoading?(
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait 
                        </>
                    ) :"Login"
                }
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;

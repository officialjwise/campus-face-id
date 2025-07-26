import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";
import { useRequestLoginOTP, useVerifyLoginOTP, useLogin } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [useDirectLogin, setUseDirectLogin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // API hooks
  const requestLoginOTP = useRequestLoginOTP();
  const verifyLoginOTP = useVerifyLoginOTP();
  const directLogin = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const handleLogin = async (data: LoginFormData) => {
    setUserEmail(data.email);
    
    if (useDirectLogin) {
      // Use direct login (legacy method)
      directLogin.mutate({
        email: data.email,
        password: data.password
      }, {
        onSuccess: () => {
          toast({
            title: "Login Successful",
            description: "Welcome to the Admin Panel!",
          });
          navigate("/admin");
        },
        onError: (error) => {
          console.error('Direct login error details:', error);
          toast({
            title: "Login Failed",
            description: error.message || "Invalid credentials",
            variant: "destructive",
          });
        },
      });
    } else {
      // Use OTP-based login (recommended)
      requestLoginOTP.mutate({ email: data.email }, {
        onSuccess: (response) => {
          setShowOTP(true);
          toast({
            title: "OTP Sent",
            description: `${response.message} Code expires in ${Math.floor(response.otp_expires_in / 60)} minutes.`,
          });
        },
        onError: (error) => {
          console.error('OTP request error details:', error);
          
          // More specific error handling
          let errorMessage = "Please try again";
          if (error.message.includes('422')) {
            errorMessage = "Invalid email format or user not found. Please check your email address.";
          } else if (error.message.includes('429')) {
            errorMessage = "Too many requests. Please wait a moment before trying again.";
          } else if (error.message.includes('500')) {
            errorMessage = "Server error. Please try again later or contact support.";
          }
          
          toast({
            title: "Failed to Send OTP",
            description: errorMessage,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleOTPVerification = () => {
    if (!userEmail || !otpCode) {
      toast({
        title: "Missing Information",
        description: "Please enter the OTP code.",
        variant: "destructive",
      });
      return;
    }

    verifyLoginOTP.mutate({ email: userEmail, otp: otpCode }, {
      onSuccess: () => {
        toast({
          title: "Login Successful",
          description: "Welcome to the Admin Panel!",
        });
        navigate("/admin");
      },
      onError: (error) => {
        toast({
          title: "Invalid OTP",
          description: error.message || "Please enter the correct verification code.",
          variant: "destructive",
        });
      },
    });
  };

  const handleForgotPassword = () => {
    const email = form.getValues("email");
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    // For now, just show a message since password reset isn't implemented in the API
    toast({
      title: "Feature Not Available",
      description: "Password reset feature will be available soon. Please contact your administrator.",
    });
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-admin flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button
              onClick={handleOTPVerification}
              disabled={verifyLoginOTP.isPending || otpCode.length !== 6}
              className="w-full"
            >
              {verifyLoginOTP.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Verify & Login
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowOTP(false);
                setOtpCode("");
              }}
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-admin flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={requestLoginOTP.isPending || directLogin.isPending} 
                className="w-full"
              >
                {(requestLoginOTP.isPending || directLogin.isPending) && 
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {useDirectLogin ? "Login" : "Send OTP"}
              </Button>

              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  id="directLogin"
                  checked={useDirectLogin}
                  onChange={(e) => setUseDirectLogin(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="directLogin" className="text-muted-foreground">
                  Use direct login (legacy)
                </label>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={handleForgotPassword}
                className="w-full"
              >
                Forgot Password?
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>🔗 API Integration Active</p>
            <p>Backend URL: http://localhost:8000</p>
            <p>Recommended: Use OTP-based login for better security</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
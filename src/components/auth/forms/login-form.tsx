import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { FirebaseError } from "firebase/app";
import { AlertCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginWithEmail = async () => {
    setLoading(true);
    if (!formData.email) {
      setError("Email cannot be empty");
      return;
    }
    if (!formData.password) {
      setError("Password cannot be empty");
      return;
    }
    try {
      await login(formData);
      void navigate("/");
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (error instanceof FirebaseError) {
        if (error.code === "auth/user-not-found") {
          setError("No user found with this email.");
        } else if (error.code === "auth/wrong-password") {
          setError("Incorrect password.");
        } else if (error.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many login attempts. Please try again later.");
        } else {
          setError("Failed to log in. Please check your credentials.");
        }
      } else {
        setError("Failed to log in. Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await loginWithGoogle();
      void navigate("/");
    } catch (error) {
      console.error("Google login error", error);
      setError("Failed to login with Google. Please try again.");
    }
  };

  return (
    <form>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          {error && (
            <div className="text-destructive flex gap-2 items-center mx-2 text-sm">
              <AlertCircleIcon size={16} />
              <span>{error} </span>
            </div>
          )}
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="m@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="off"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              void handleLoginWithEmail();
            }}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              void handleLoginWithGoogle();
            }}
          >
            Login with Google
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

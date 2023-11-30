"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { BsGithub } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiOutlineCheck } from "react-icons/ai";
import { cn } from "@/lib/utils";
import useCountDown from "@/hook/useCountDown";
import { http } from "@/lib/http";

const signupInputSchema = z
  .object({
    email: z.string().email("invaid_email"),
    password: z
      .string()
      .min(8, "too_small")
      .max(40, "too_big")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
        "format_error"
      ),
    code: z.string().length(6, "length_error"),
  })
  .strict();

type SignupInput = z.infer<typeof signupInputSchema>;

const SignupPage = () => {
  const [isHiddenPassword, setIsHiddenPassword] = React.useState<boolean>(true);
  const [onfocusAt, setOnFocusAt] = useState<string | null>(null);
  const [form, setForm] = useState<SignupInput>({
    email: "",
    password: "",
    code: "",
  });
  const [count, setCount] = useCountDown("sms-send", form.email);
  const handleErrorValidateForm = React.useCallback(
    (
      keys: (
        | "invaid_email"
        | "too_small"
        | "too_big"
        | "format_error"
        | "length_error"
      )[]
    ): boolean => {
      const val = signupInputSchema.safeParse(form);
      if (val.success) return false;
      const errors = val.error.issues.map((i) => i.message);
      return keys.filter((val) => errors.includes(val)).length > 0;
    },
    [form]
  );

  const [isExistEmail, setisExistEmail] = useState(false);

  useEffect(() => {
    setisExistEmail(false);
  }, [form.email]);

  const otpMutation = useMutation({
    mutationFn: async () => {
      await http.post("/otps/send", {
        email: form.email,
        type: "SIGNINUP",
      });
    },
    onError: () => {
      setisExistEmail(true);
    },
    onSuccess: (data) => {
      setCount();
    },
  });

  const handleSendEmail = () => {
    otpMutation.mutate();
  };

  const userMutation = useMutation({
    mutationFn: async () => {
      await http.post("/signup", form);
    },
    onSettled: () => {
      setForm({ email: "", password: "", code: "" });
    },
  });

  useEffect(() => {
    if (
      (form.email !== "" || form.password !== "" || form.code !== "") &&
      ["error", "success"].includes(userMutation.status)
    ) {
      userMutation.reset();
    }
  }, [form]);

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !handleErrorValidateForm([
        "invaid_email",
        "too_small",
        "too_big",
        "format_error",
        "length_error",
      ])
    ) {
      userMutation.mutate();
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh_-_73px)] -translate-y-[40px]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email and password below to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlerSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="grid grid-cols-2 gap-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => signIn("github")}
                >
                  <BsGithub className="mr-2 h-5 w-5" /> Github
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => signIn("google")}
                >
                  <SiGoogle className="mr-2 h-5 w-5" />
                  Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  onFocus={() => setOnFocusAt("email")}
                  onBlur={() => setOnFocusAt(null)}
                  id="email"
                  placeholder="example@gmail.com"
                />
                {onfocusAt !== "email" &&
                  handleErrorValidateForm(["invaid_email"]) &&
                  form.email.length > 0 && (
                    <p className="text-red-500 font-medium text-xs">
                      Enter a valid email address
                    </p>
                  )}
                {isExistEmail && (
                  <p className="font-medium text-xs">
                    You have registered,
                    <Link className="text-primary text-sm" href="/auth/signin">
                      Sign in
                    </Link>
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <input
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    onFocus={() => setOnFocusAt("password")}
                    onBlur={() => setOnFocusAt(null)}
                    type={isHiddenPassword ? "password" : "text"}
                    className="flex-grow outline-none bg-transparent placeholder:text-muted-foreground"
                    id="password"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setIsHiddenPassword((prev) => !prev)}
                  >
                    {isHiddenPassword ? (
                      <PiEyeClosedBold size={20} />
                    ) : (
                      <PiEyeBold size={20} />
                    )}
                  </button>
                </div>
                <div
                  className={cn(
                    onfocusAt === "password" || form.password.length > 0
                      ? "flex flex-col"
                      : "hidden"
                  )}
                >
                  <p className="font-medium text-sm">
                    Your password must include:
                  </p>
                  <p
                    className={cn(
                      "inline-flex space-x-2 items-center text-gray-500",
                      handleErrorValidateForm(["too_small", "too_big"])
                        ? ""
                        : "text-green-400"
                    )}
                  >
                    <AiOutlineCheck size={16} />
                    <span className="font-medium text-xs">
                      8 to 40 characters
                    </span>
                  </p>
                  <p
                    className={cn(
                      "inline-flex space-x-2 items-center text-gray-500",
                      handleErrorValidateForm(["format_error"])
                        ? ""
                        : "text-green-400"
                    )}
                  >
                    <AiOutlineCheck size={16} />
                    <span className="font-medium text-xs">
                      Letters, numbers and special characters
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <div className="border rounded-md overflow-hidden flex items-center mt-1.5">
                  <input
                    value={form.code}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, code: e.target.value }))
                    }
                    onFocus={() => setOnFocusAt("code")}
                    onBlur={() => setOnFocusAt(null)}
                    className="flex-grow pl-3 py-[7px] outline-none bg-transparent placeholder:text-sm placeholder:text-muted-foreground"
                    type="text"
                    name="code"
                    id="code"
                    placeholder="Code"
                  />
                  {count ? (
                    <p className="flex items-center justify-center border-l py-[7px] px-3 min-w-[46px] text-center text-muted-foreground text-sm">
                      <span>{count}s</span>
                    </p>
                  ) : otpMutation.isPending ? (
                    <p className="flex items-center justify-center border-l py-[7px] px-3 min-w-[46px] text-center text-muted-foreground text-sm">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Send</span>
                    </p>
                  ) : onfocusAt === "email" ||
                    !handleErrorValidateForm(["invaid_email"]) ? (
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      className="flex items-center justify-center border-l py-[7px] px-3 min-w-[46px] text-center text-muted-foreground text-sm"
                    >
                      <span>Send</span>
                    </button>
                  ) : (
                    <p className="flex items-center justify-center border-l py-[7px] px-3 min-w-[46px] text-center text-muted-foreground text-sm">
                      <span>Send</span>
                    </p>
                  )}
                </div>
                {onfocusAt !== "code" &&
                  form.code.length > 0 &&
                  handleErrorValidateForm(["length_error"]) && (
                    <p className="text-red-500 font-medium text-xs">
                      Enter the 6-digit code
                    </p>
                  )}
                {["error", "success"].includes(userMutation.status) && (
                  <p
                    className={`${
                      !userMutation.isError ? "text-green-400" : "text-red-500"
                    } font-medium text-xs `}
                  >
                    {!userMutation.isError
                      ? "Successful account registration"
                      : "Email verification code has expired"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="block">
            <Button
              disabled={
                isExistEmail ||
                userMutation.isPending ||
                handleErrorValidateForm([
                  "invaid_email",
                  "too_small",
                  "too_big",
                  "format_error",
                  "length_error",
                ])
              }
              className="w-full"
            >
              {userMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
            <div className="flex items-center justify-center space-x-1 mt-6">
              <Label htmlFor="signin" className="font-normal text-sm">
                Already have an Account?
              </Label>
              <Link
                tabIndex={-1}
                href="/auth/signin"
                className="text-sm text-primary font-bold"
              >
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;

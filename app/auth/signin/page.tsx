"use client";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsGithub } from "react-icons/bs";
import { SiGoogle } from "react-icons/si";

const signinInputSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

type SigninInput = z.infer<typeof signinInputSchema>;

const SignInPage = () => {
  const router = useRouter();
  const [isHiddenPassword, setIsHiddenPassword] = React.useState<boolean>(true);
  const [form, setForm] = useState<SigninInput>({
    email: "",
    password: "",
  });
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.email !== "" && form.password !== "") {
      setIsLoadingSubmit(true);

      signIn("credentials", {
        ...form,
        redirect: false,
      }).then((res) => {
        if (!res?.error) {
          router.push("/manager");
        } else {
          setIsLoadingSubmit(false);
          setForm({
            email: "",
            password: "",
          });
          setIsError(true);
        }
      });
    }
  };
  return (
    <div className="flex items-center justify-center h-[calc(100vh_-_73px)] -translate-y-[73px]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password below to sign in your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
                  className="focus-visible:ring-transparent"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    setIsError(false);
                  }}
                  id="email"
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="flex p-2 border rounded-md overflow-hidden space-x-2">
                  <input
                    value={form.password}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      setIsError(false);
                    }}
                    type={isHiddenPassword ? "password" : "text"}
                    className="flex-grow outline-none bg-transparent"
                    id="password"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setIsHiddenPassword((prev) => !prev)}
                  >
                    {isHiddenPassword ? (
                      <PiEyeClosedBold size={20} />
                    ) : (
                      <PiEyeBold size={20} />
                    )}
                  </button>
                </div>
                {isError && (
                  <p className="text-red-500 font-medium text-xs">
                    Invalid email or password
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="block">
            <Button
              type="submit"
              disabled={
                form.email === "" || form.password === "" || isLoadingSubmit
              }
              className="w-full"
            >
              {isLoadingSubmit && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
            <div className="flex items-center justify-center space-x-1 mt-6">
              <Label htmlFor="signin" className="font-normal text-sm">
                You don't have an account?
              </Label>
              <Link
                tabIndex={-1}
                href="/auth/signup"
                className="text-sm text-primary font-bold"
              >
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;

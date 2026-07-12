"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signIn, signUp, checkRateLimit, recordLoginAttempt, checkEmailExists } from "@/lib/actions/auth.action";
import { hasUploadedResume } from "@/lib/actions/resume.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle state

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // 1. Check Rate Limit first
      const rateLimit = await checkRateLimit();
      if (rateLimit.isBanned) {
        toast.error((rateLimit as any).message);
        return;
      }

      if (type === "sign-up") {
        const { name, email, password } = data;

        // 2. Check if email exists
        const emailCheck = await checkEmailExists(email);
        if (emailCheck.exists) {
          toast.error("Account already exists with this email. Please sign in.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Sign out immediately so they have to manually log in
        await auth.signOut();

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error((result as any).message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          // 3. Success -> Clear rate limit
          await recordLoginAttempt(true);
        } catch (err: any) {
          // 3. Failure -> Record attempt
          await recordLoginAttempt(false);

          if (err.code === "auth/user-not-found") {
            toast.error("User not found. Please sign up first.");
          } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
            toast.error("Incorrect email or password.");
          } else if (err.code === "auth/invalid-email") {
            toast.error("Invalid email format.");
          } else {
            toast.error(`Login failed: ${err.message}`);
          }
          return;
        }

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        const signInResult = await signIn({
          email,
          idToken,
          uid: userCredential.user.uid,
          displayName: userCredential.user.displayName || undefined,
        });

        if (!signInResult || !signInResult.success) {
          toast.error((signInResult as any)?.message || "Failed to establish a secure session. Please try again.");
          return;
        }

        toast.success("Signed in successfully.");

        const isAdmin = (signInResult as any).role === "Admin";
        if (isAdmin) {
          localStorage.setItem("isAdmin", "true");
          router.replace("/admin");
        } else {
          localStorage.removeItem("isAdmin");
          router.replace("/dashboard");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(`There was an error: ${error}`);
    }
  };


  const isSignIn = type === "sign-in";

  return (
    <div className="border-b border-gray-600 p-0.5 rounded-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:min-w-[500px] lg:max-h-[550px] mx-auto shadow-2xl relative overflow-hidden bg-white/[0.015] backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-600" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-600 z-20" />
      <div className="flex flex-col gap-6 py-4 px-6 sm:px-8 md:px-10 bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white/5 p-2.5 rounded-md border border-white/10 shadow-lg">
            <Image src="/logo.svg" alt="logo" width={36} height={36} className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase">Mockrithm</h2>
        </div>

        <h3 className="text-center text-sm font-semibold text-gray-300">Practice job interviews with conversational AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
            />
            {isSignIn && (
              <div className="text-sm text-right">
                <Link
                  href="/forgot-password"
                  className="text-gray-400 hover:text-gray-600 font-bold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
            <Button className="btn" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  {isSignIn ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isSignIn ? "Sign In" : "Create an Account"
              )}
            </Button>
          </form>
        </Form>

<p className="text-center text-sm text-gray-200">
  {isSignIn ? "No account yet?" : "Have an account already?"}
  <Link
    href={!isSignIn ? "/sign-in" : "/sign-up"}
    className="text-gray-100 hover:text-white font-bold ml-1 transition-colors"
  >
    {!isSignIn ? "Sign In" : "Sign Up"}
  </Link>
</p>
      </div>
    </div>
  );
};

export default AuthForm;
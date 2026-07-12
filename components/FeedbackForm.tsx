"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { db } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Mail, MessageSquare } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  type: z.enum(["Bug Report", "Feature Request", "General Feedback"], {
    required_error: "Please select a feedback type",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1000),
});

export default function FeedbackForm() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      type: undefined,
      message: "",
    },
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      const name = user.fullName || user.firstName || "User";
      form.setValue("name", name);
      form.setValue("email", user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, isSignedIn, user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "feedback"), {
        ...values,
        createdAt: new Date(),
      });
      toast.success("Thanks for your feedback!");
      form.reset({ ...values, message: "" });
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <User className="w-3.5 h-3.5" /> Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-zinc-950/60 border-zinc-800 text-white placeholder:text-zinc-700 h-12 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <Mail className="w-3.5 h-3.5" /> Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-zinc-950/60 border-zinc-800 text-white placeholder:text-zinc-700 h-12 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                  Feedback Type
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-950/60 border-zinc-800 text-white h-12 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200">
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                    <SelectItem value="Bug Report" className="text-xs font-bold hover:bg-white/5 cursor-pointer">
                      Bug Report
                    </SelectItem>
                    <SelectItem value="Feature Request" className="text-xs font-bold hover:bg-white/5 cursor-pointer">
                      Feature Request
                    </SelectItem>
                    <SelectItem value="General Feedback" className="text-xs font-bold hover:bg-white/5 cursor-pointer">
                      General Feedback
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us what's on your mind..."
                    className="bg-zinc-950/60 border-zinc-800 text-white placeholder:text-zinc-700 min-h-[140px] resize-none rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-white text-black font-black rounded-lg border border-white/80 hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider">
                <div className="w-4 h-4 border-2 border-zinc-600 border-t-black rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider">
                <Send className="w-4 h-4" />
                Submit Feedback
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

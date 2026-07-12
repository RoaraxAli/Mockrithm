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
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
      toast.success("Message received. We'll be in touch.");
      form.reset({ ...values, message: "" });
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Transmission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 h-auto text-lg text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-white transition-all duration-300";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your Name *"
                    className={inputClasses}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email Address *"
                    className={inputClasses}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-2" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 h-auto text-lg text-white focus:ring-0 focus:border-white transition-all duration-300">
                      <SelectValue placeholder="Topic of Discussion *" className="text-zinc-500" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-white rounded-xl">
                    <SelectItem value="Bug Report" className="text-sm py-3 focus:bg-white/10 cursor-pointer">
                      Bug Report
                    </SelectItem>
                    <SelectItem value="Feature Request" className="text-sm py-3 focus:bg-white/10 cursor-pointer">
                      Feature Request
                    </SelectItem>
                    <SelectItem value="General Feedback" className="text-sm py-3 focus:bg-white/10 cursor-pointer">
                      General Inquiry
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400 text-xs mt-2" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us everything..."
                    className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 min-h-[160px] text-lg text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-white transition-all duration-300 resize-none"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-2" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-4"
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full h-16 bg-white text-black font-semibold text-lg overflow-hidden rounded-full hover:scale-[1.02] transition-all duration-500 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <span className="relative flex items-center justify-center gap-3 w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transmitting...
                </>
              ) : (
                <>
                  Send Message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}

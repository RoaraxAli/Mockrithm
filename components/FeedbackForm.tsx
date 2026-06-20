"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
import Link from "next/link";
import { Send, User, Mail, MessageSquare, Phone, Clock, Github, ArrowLeft } from "lucide-react";

// Schema
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

export default function ContactPage() {
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

  // Load Clerk user info
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mona-sans pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute inset-0 premium-grid-dot" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-14 pb-16 px-6 overflow-hidden border-b border-zinc-900 bg-zinc-950/10"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block mb-6"
          >
            <div className="relative bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-full px-5 py-2 flex items-center gap-2.5 shadow-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Support active • We're online
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-none text-white tracking-tight">
            Get in touch.
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-zinc-400 font-semibold uppercase tracking-wider max-w-xl mx-auto mb-16 leading-relaxed">
            Ready to transform your interview skills? Send feedback, report bugs, or request features below.
          </p>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
              {
                icon: Phone,
                title: "Call Us",
                primary: "+03001477141714",
                secondary: "Mon-Fri 9AM-6PM",
                href: "tel:+03001477141714",
              },
              {
                icon: Mail,
                title: "Email Us",
                primary: "mockrithm@gmail.com",
                secondary: "We reply within 24 hours",
                href: "mailto:mockrithm@gmail.com",
              },
              {
                icon: Clock,
                title: "Support Hours",
                primary: "24/7 Available",
                secondary: "Open for tickets",
                href: "#",
              }
            ].map((contact, index) => (
              <motion.a
                key={contact.title}
                href={contact.href}
                whileHover={{ 
                  y: -4,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group block relative overflow-hidden bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 text-center shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors duration-300">
                    <contact.icon className="w-5 h-5 text-white group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
                
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2">
                  {contact.title}
                </h3>
                
                <p className="text-xs font-bold text-zinc-300 mb-1">
                  {contact.primary}
                </p>
                
                <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                  {contact.secondary}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-20 bg-zinc-950/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Feedback Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="bg-zinc-900/30 p-8 rounded-xl border border-zinc-900 shadow-2xl relative overflow-hidden backdrop-blur-md"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20" />
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-black mb-3 flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/5 border border-white/10 text-white rounded-lg">
                    <Send className="w-5 h-5" />
                  </div>
                  Send Feedback
                </h2>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Your thoughts help us improve. We read every message.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                          Feedback Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-950/60 border-zinc-800 text-white h-12 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all duration-200">
                              <SelectValue placeholder="Select feedback type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                            <SelectItem
                              value="Bug Report"
                              className="text-xs font-bold hover:bg-white/5 cursor-pointer"
                            >
                              Bug Report
                            </SelectItem>

                            <SelectItem
                              value="Feature Request"
                              className="text-xs font-bold hover:bg-white/5 cursor-pointer"
                            >
                              Feature Request
                            </SelectItem>

                            <SelectItem
                              value="General Feedback"
                              className="text-xs font-bold hover:bg-white/5 cursor-pointer"
                            >
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
                </form>
              </Form>
            </motion.div>

            {/* Map & Social Links Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Location Info */}
              <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-900 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20" />
                <h3 className="text-lg font-black mb-3 flex items-center gap-3 text-white uppercase tracking-wider">
                  <div className="p-2 bg-white/5 border border-white/10 text-white rounded-lg">
                    <Github className="w-4 h-4" />
                  </div>
                  Contribute on GitHub
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed font-semibold uppercase tracking-wider mb-6">
                  Help us improve by contributing to our open-source repository. Your ideas and fixes are welcome!
                </p>

                <Button asChild className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer h-10 transition-all duration-300">
                  <a
                    href="https://github.com/RoaraxAli/Mockrithm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to GitHub Repo
                  </a>
                </Button>
              </div>
              
              {/* Map Container */}
              <div className="rounded-xl overflow-hidden shadow-2xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-xl">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019288187034!2d-122.41941568468195!3d37.77492977975914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c5ae4c0b3%3A0x9a6c6c6a56cb510!2sSan+Francisco!5e0!3m2!1sen!2sus!4v1719999999999"
                  width="100%"
                  height="340"
                  className="w-full filter grayscale contrast-125 opacity-70"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

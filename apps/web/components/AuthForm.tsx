"use client";
import { FormSchema } from "@repo/common/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthForm = ({ type }: { type: "signup" | "signin" }) => {
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const onSubmitSignup = async (data: z.infer<typeof FormSchema>) => {
    await axios
      .post(
        `${apiUrl}/api/v1/${type}`,
        {
          ...data,
        },
        { withCredentials: true }
      )
      .then((response: any) => {
        router.push("/dashboard");
      })
      .catch((e) => {
        // console.error(e);
        const errorMsg = e.response.data.message || "An unknown error occured";
        setError(errorMsg);
      });
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitSignup)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {form.formState.errors.username && <FormMessage />}
              {error && <p className="text-red-700">{error}</p>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem id="password">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} type="password" />
              </FormControl>
              {form.formState.errors.password && <FormMessage />}
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-gray-950">
          Submit
        </Button>
      </form>
      <p className="text-foreground/60 mt-[24px]">
        {type === "signup"
          ? "Already have an account? "
          : "Dont have an account?"}
        <span
          className="cursor-pointer"
          onClick={() =>
            router.push(type === "signup" ? "/sign-in" : "/sign-up")
          }
        >
          {type === "signup" ? "SignIn" : "SignUp"}
        </span>
      </p>
    </Form>
  );
};

export default AuthForm;

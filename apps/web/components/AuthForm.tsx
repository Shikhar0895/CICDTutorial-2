"use client";
import { FormSchema } from "@repo/common/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(apiUrl);
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("submit clicked");
    await axios
      .post(
        `${apiUrl}/api/v1/${type}`,
        {
          ...data,
        },
        { withCredentials: true }
      )
      .then((response: any) => {
        if (response.data.statusCode === 200 && response.data.success === true)
          router.push("/dashboard");
      })
      .catch((e) => {
        console.error(e);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {form.formState.errors.username && (
                <FormMessage color="#23ffe1" />
              )}
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
              {form.formState.errors.password && (
                <FormMessage color="#23ffe1" />
              )}
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

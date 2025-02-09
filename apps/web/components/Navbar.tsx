"use client";
import React from "react";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="my-3.5 w-full border-2 rounded p-4 h-[88px] border-foreground flex justify-between">
      <div></div>
      <div className="flex gap-3 items-center">
        <Button
          variant={"default"}
          className="bg-foreground text-background hover:bg-background/10 hover:text-foreground cursor-pointer"
          onClick={() => router.push("/sign-up")}
        >
          Get Started
        </Button>
        <Button
          variant={"outline"}
          className="font-(var(--font-geist-sans)) text-[16px] hover:bg-background hover:text-foreground cursor-pointer"
          onClick={() => router.push("/sign-in")}
        >
          SignIn
        </Button>
        <div className="cursor-pointer hover:bg-foreground hover:text-background hover:scale-125 transition-all duration-200 hover:mx-2.5 hover:p-3.5 rounded-full">
          <Sun />
        </div>
        <div className="cursor-pointer hover:bg-foreground hover:text-background hover:scale-125 transition-all duration-200 hover:mx-2.5 hover:p-3.5 rounded-full">
          <Moon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

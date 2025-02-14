import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <h1 className="font-bold text-center">Welcome to Brainstorm</h1>
      <p className="text-center text-foreground/50">
        Your very own whiteboard solution with 100x efficiency collaboration.
      </p>
    </div>
  );
}

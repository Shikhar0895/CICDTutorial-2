"use client";
export default function MyApp() {
  return (
    <div className="flex flex-col gap-9">
      <HeroSection />
    </div>
  );
}

const HeroSection = () => {
  return (
    <div className="border-2 border-amber-100 rounded h-[200px]">
      Hero Section
    </div>
  );
};

import { Github, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-grow flex-col lg:flex-row gap-4 px-4 font-mono">
      <div className="w-full rounded-lg flex items-center justify-center">
        <div className="flex flex-col px-4 py-10 lg:py-0 lg:px-20 gap-4 text-white">
          <h1 className="text-4xl font-semibold">Welcome to GitVatar!</h1>
          <p>
            GitVatar is a{" "}
            <strong className="italic">Github profile generator</strong> that
            reads your github reposioties and generates a unique image for you.
          </p>
          <Link
            className="bg-white text-green-500 px-4 py-2 text-nowrap inline-flex items-center justify-center h-12 rounded-md font-semibold"
            href="/generate"
          >
            Get Started
            <ArrowRight size={18} strokeWidth={3} className="ml-2" />
          </Link>
        </div>
      </div>
      <div className="w-full rounded-lg flex items-center justify-center">
        <Github size={450} color="white" className="" />
      </div>
    </main>
  );
}

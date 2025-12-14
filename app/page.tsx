import { KennedyAnyidoho } from "@/components/kennedy-anyidoho";
import Link from "next/link";
import { Sticker } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-200 font-serif">
      <main className="flex min-h-screen gap-5 w-full max-w-3xl flex-col py-32 px-5 lg:px-16">
        <div className="flex flex-row justify-between gap-5">
          <KennedyAnyidoho />
          <Sticker className="text-[#c56d50] size-10" />
        </div>
        {/* Introducing myself*/}
        <p className="text-black">Welcome to my portfolio!</p>
        <p className="text-black">
          I am the creator of{" "}
          <Link href="" className="link_">
            Better Ascii React
          </Link>
          , creator of{" "}
          <Link href="https://dup.it.com" className="link_">
            Dup Pastebin Service
          </Link>
          , co-founder of{" "}
          <Link href="https://www.example.com" className="link_">
            Minimalist{" "}
          </Link>
          , volunteer at{" "}
          <Link href="https://www.example.com" className="link_">
            Wislaw
          </Link>{" "}
          and currently a Software Engineering Intern at{" "}
          <Link href="https://www.example.com" className="link_">
            Coziza Engineering.
          </Link>
        </p>
        {/*Where to find me*/}
        <p className="text-black">
          I mostly work from home, programming in TypeScript and building
          full-stack applications with Next.js. I started as a frontend-leaning
          developer, but after getting tired of fighting with “centered divs,” I
          shifted toward backend engineering and now work with Golang as well.
          If you want a quick overview of my skills and experience, you can
          check out my resume{" "}
          <Link href="https://www.example.com" className="link_">
            here
          </Link>{" "}
        </p>

        <p className="text-black">
          I am also active on social media platforms such as Twitter and
          LinkedIn. You can find me on Twitter at{" "}
          <Link href="https://twitter.com/username" className="link_">
            @username
          </Link>{" "}
          and on LinkedIn at{" "}
          <Link href="https://www.linkedin.com/in/username" className="link_">
            LinkedIn
          </Link>
        </p>

        <p className="text-black">
          If you want to get in touch with me, you can reach me via email at{" "}
          <Link href="mailto:username@example.com" className="link_">
            username@example.com
          </Link>
        </p>
      </main>
    </div>
  );
}

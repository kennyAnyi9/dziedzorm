import { KennedyAnyidoho } from "@/components/kennedy-anyidoho";
import { Links } from "@/components/links";

export default function Home() {
  return (
    <main className="h-screen max-w-lg mx-auto w-full flex flex-col justify-center">
      <KennedyAnyidoho />
      <Links />
    </main>
  );
}

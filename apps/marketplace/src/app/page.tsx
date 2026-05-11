import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DispatchChainShowcase } from "@/components/DispatchChainShowcase";
import { TaskGrid } from "@/components/TaskGrid";
import { Pillars } from "@/components/Pillars";
import { Comparison } from "@/components/Comparison";
import { FAQ } from "@/components/FAQ";
import { CallToWorkbench } from "@/components/CallToWorkbench";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <DispatchChainShowcase />
        <TaskGrid />
        <Pillars />
        <Comparison />
        <FAQ />
        <CallToWorkbench />
      </main>
      <Footer />
    </>
  );
}

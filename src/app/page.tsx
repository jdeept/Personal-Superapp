import { PreMarketGuard } from "@/components/core/PreMarketGuard";
import { AppShell } from "@/components/core/AppShell";

export default function Home() {
  return (
    <>
      <PreMarketGuard />
      <AppShell />
    </>
  );
}

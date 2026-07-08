"use client";

import { useAppStore } from "@/store/appStore";
import { AppShell } from "@/components/core/AppShell";
import { JarvisCore } from "@/components/core/JarvisCore";
import { PreMarketGuard } from "@/components/core/PreMarketGuard";

export function RootView() {
  const { isJarvisMode } = useAppStore();

  if (isJarvisMode) {
    return <JarvisCore />;
  }

  return (
    <>
      <PreMarketGuard />
      <AppShell />
    </>
  );
}

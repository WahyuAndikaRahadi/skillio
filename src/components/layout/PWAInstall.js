"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function PWAInstall() {
  const { setDeferredPrompt, setIsInstalled } = useAppStore();

  useEffect(() => {

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("SW registered: ", registration);
          },
          (registrationError) => {
            console.log("SW registration failed: ", registrationError);
          }
        );
      });
    }

    const checkInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator.standalone) ||
        document.referrer.includes('android-app://')
      );
    };

    if (checkInstalled()) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [setDeferredPrompt, setIsInstalled]);

  return null;
}

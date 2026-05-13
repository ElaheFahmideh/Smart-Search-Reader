import type { BeforeInstallPromptEvent } from "@custom-types/installBanner";
import { isInStandaloneMode, isIOS } from "@utils";
import { useEffect, useRef, useState } from "react";
import "./installBanner.css";

export default function InstallBanner() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const installPromptHandler = (e: BeforeInstallPromptEvent) => {
    e.preventDefault();
    setPromptEvent(e);
    showBannerHandler();
  };

  const showBannerHandler = () => {
    timerRef.current = window.setTimeout(() => {
      setShowBanner(true);
    }, 5000);
  };

  useEffect(() => {
    if (isIOS() && !isInStandaloneMode) {
      showBannerHandler();
    }

    window.addEventListener("beforeinstallprompt", installPromptHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", installPromptHandler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const installApp = () => {
    if (!promptEvent) return;

    promptEvent.prompt();
    setPromptEvent(null);
    setShowBanner(false);
  };

  if (!showBanner) return;

  return (
    <div className="install__banner">
      <div className="install__banner-content">
        <span>Install app for a better experience</span>
      </div>

      <div className="install__banner-actions">
        <button onClick={() => setShowBanner(false)}>Later</button>
        <button onClick={installApp}>Install</button>
      </div>
    </div>
  );
}

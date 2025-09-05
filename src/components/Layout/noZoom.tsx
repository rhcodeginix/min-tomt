import { useEffect } from "react";

export const usePreventZoom = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const preventZoom = (e: TouchEvent) => {
      // Check if the event has scale property (pinch zoom)
      if ("scale" in e && (e as any).scale !== 1) {
        e.preventDefault();
      }
    };

    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    const handleInputFocus = () => {
      const inputs = document.querySelectorAll("input, select, textarea");
      inputs.forEach((input: any) => {
        const computedStyle = window.getComputedStyle(input);
        const fontSize = parseInt(computedStyle.fontSize);
        if (fontSize < 16) {
          (input as HTMLInputElement).style.fontSize = "16px";
        }
      });
    };

    // Prevent zoom on wheel events (desktop)
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Add event listeners with proper options
    document.addEventListener("touchmove", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventPinchZoom, {
      passive: false,
    });
    document.addEventListener("touchend", preventDoubleTapZoom, {
      passive: false,
    });
    document.addEventListener("focusin", handleInputFocus);
    document.addEventListener("wheel", preventWheelZoom, { passive: false });

    // Cleanup function
    return () => {
      document.removeEventListener("touchmove", preventZoom);
      document.removeEventListener("touchmove", preventPinchZoom);
      document.removeEventListener("touchend", preventDoubleTapZoom);
      document.removeEventListener("focusin", handleInputFocus);
      document.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);
};

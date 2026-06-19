export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  if (navigatorWithStandalone.standalone === true) return true;

  return ["standalone", "fullscreen", "minimal-ui"].some((mode) =>
    window.matchMedia(`(display-mode: ${mode})`).matches,
  );
}

export function isPwaGateEnabled(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isMobileOrTabletDevice(): boolean {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIosPhone = /iPhone|iPod/i.test(ua);
  const isIpad =
    /iPad/i.test(ua) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1);
  const isOtherMobile =
    /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // UA first — Chrome on Android tablets often reports fine pointer + hover.
  if (isAndroid || isIosPhone || isIpad || isOtherMobile) return true;

  const isDesktopLike = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
  ).matches;

  if (isDesktopLike) return false;

  return (
    window.matchMedia("(max-width: 1024px)").matches &&
    (window.matchMedia("(pointer: coarse)").matches ||
      window.navigator.maxTouchPoints > 0)
  );
}

export function shouldRequirePwaInstall(): boolean {
  return isPwaGateEnabled() && isMobileOrTabletDevice();
}

export function isIosDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1)
  );
}

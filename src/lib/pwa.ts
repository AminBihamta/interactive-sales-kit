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

function isDesktopOperatingSystem(): boolean {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  return /Windows NT|Macintosh|CrOS/i.test(ua) && !/Android/i.test(ua);
}

function hasMobileUserAgentHint(): boolean {
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

  if (isAndroid || isIosPhone || isIpad || isOtherMobile) return true;

  const uaData = (
    window.navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  ).userAgentData;

  return uaData?.mobile === true;
}

function isTouchTabletFormFactor(): boolean {
  if (typeof window === "undefined") return false;

  if (window.navigator.maxTouchPoints <= 0) return false;
  if (isDesktopOperatingSystem()) return false;

  const shortSide = Math.min(window.screen.width, window.screen.height);
  return shortSide <= 1024;
}

export function isMobileOrTabletDevice(): boolean {
  if (typeof window === "undefined") return false;

  // UA / client hints first — catches most phones and tablets.
  if (hasMobileUserAgentHint()) return true;

  // Android "Desktop site" drops Android from UA but keeps touch + tablet size.
  if (isTouchTabletFormFactor()) return true;

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

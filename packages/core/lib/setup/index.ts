export function setup() {
  let cancelled = false;
  (async () => {
    try {
      const mod = await import("dialog-closedby-polyfill");
      const apply = mod.apply;
      const isPolyfilled = mod.isPolyfilled;
      const isSupported = mod.isSupported;
      if (!(cancelled || isPolyfilled() || isSupported())) {
        apply();
      }
    } catch {
      //
    }
  })();
  return () => {
    cancelled = true;
  };
}

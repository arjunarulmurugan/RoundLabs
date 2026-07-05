import { useSyncExternalStore } from "react";

// Minimal hash router — no dependency, no framework. Hash routing is chosen
// deliberately: on GitHub Pages a hash URL is refresh-safe and direct-linkable
// with no server rewrite or 404.html trick. Back/forward work via the browser's
// native history of hash changes.

export type Route =
  | { name: "home" }
  | { name: "lab"; id: string }
  | { name: "valorant-config" }
  | { name: "lessons" }
  | { name: "not-found"; path: string };

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, "");
  const path = h === "" ? "/" : h;
  if (path === "/" || path === "") return { name: "home" };
  if (path === "/lessons") return { name: "lessons" };
  if (path === "/valorant/config") return { name: "valorant-config" };
  const lab = path.match(/^\/lab\/([^/]+)$/);
  if (lab) return { name: "lab", id: decodeURIComponent(lab[1]) };
  return { name: "not-found", path };
}

export function navigate(path: string): void {
  const target = path.startsWith("#") ? path : `#${path}`;
  if (window.location.hash === target) return;
  window.location.hash = target;
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  return parseHash(hash);
}

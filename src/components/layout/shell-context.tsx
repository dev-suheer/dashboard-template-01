import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyTheme, readTheme, type ResolvedTheme } from "@/lib/theme";

type ShellContextValue = {
  theme: ResolvedTheme;
  toggleTheme: (origin?: HTMLElement) => void;
  rail: boolean;
  setRail: (next: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (next: boolean) => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ResolvedTheme>(() => readTheme());
  const [rail, setRailState] = useState(() => {
    const stored = localStorage.getItem("temp01-rail") ?? localStorage.getItem("tidra-rail");
    return stored !== "0";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const setRail = useCallback((next: boolean) => {
    setRailState(next);
    localStorage.setItem("temp01-rail", next ? "1" : "0");
    document.documentElement.classList.toggle("is-rail", next);
  }, []);

  const toggleTheme = useCallback(
    (origin?: HTMLElement) => {
      const next = theme === "light" ? "dark" : "light";
      setTheme(next);
      applyTheme(next, origin);
    },
    [theme],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "[" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (window.innerWidth < 1280) return;
      event.preventDefault();
      setRail(!rail);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rail, setRail]);

  const value = useMemo(
    () => ({ theme, toggleTheme, rail, setRail, mobileOpen, setMobileOpen }),
    [theme, toggleTheme, rail, setRail, mobileOpen],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) throw new Error("useShell must be used inside ShellProvider");
  return context;
}

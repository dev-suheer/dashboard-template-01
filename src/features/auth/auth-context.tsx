import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ACCOUNTS_KEY = "temp01-accounts";
const SESSION_KEY = "temp01-session";
const CHALLENGE_KEY = "temp01-challenge";

export type PublicUser = {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
};

type Account = PublicUser & { password: string };

export type Challenge = {
  purpose: "signup" | "reset";
  email: string;
  code: string;
  draft?: Account;
  verified: boolean;
};

export const defaultAvatar = "/avatar.svg";

const demoAccount: Account = {
  name: "User",
  email: "user@gmail.com",
  phone: "+44 7700 900418",
  password: "112233",
  avatar: defaultAvatar,
};

function sameEmail(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Account[]) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    const index = list.findIndex((account) => sameEmail(account.email, demoAccount.email));
    if (index < 0) {
      const next = [demoAccount, ...list];
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
      return next;
    }
    const current = list[index];
    const name = current.name === "Isla Macrae" ? demoAccount.name : current.name;
    const avatar = current.avatar || demoAccount.avatar;
    if (name === current.name && avatar === current.avatar) return list;
    const next = list.slice();
    next[index] = { ...current, name, avatar };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [demoAccount];
  }
}

function readChallenge(): Challenge | null {
  try {
    const raw = sessionStorage.getItem(CHALLENGE_KEY);
    return raw ? (JSON.parse(raw) as Challenge) : null;
  } catch {
    return null;
  }
}

function toPublic(account: Account): PublicUser {
  return {
    name: account.name,
    email: account.email,
    phone: account.phone,
    avatar: account.avatar,
  };
}

type AuthValue = {
  user: PublicUser | null;
  challenge: Challenge | null;
  signIn: (email: string, password: string) => string | null;
  signOut: () => void;
  beginSignup: (draft: Account) => string | null;
  beginReset: (email: string) => string | null;
  verifyCode: (code: string) => string | null;
  resendCode: () => string | null;
  resetPassword: (password: string) => string | null;
  updateProfile: (patch: Pick<PublicUser, "name" | "phone" | "avatar">) => string | null;
  changePassword: (current: string, next: string) => string | null;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(readAccounts);
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [challenge, setChallenge] = useState<Challenge | null>(readChallenge);

  const user = useMemo(() => {
    const account = accounts.find((item) => sameEmail(item.email, sessionEmail ?? ""));
    return account ? toPublic(account) : null;
  }, [accounts, sessionEmail]);

  const persist = (next: Account[]) => {
    setAccounts(next);
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
      return null;
    } catch {
      return "Couldn't save that. Try a smaller photo.";
    }
  };

  const openSession = (email: string) => {
    localStorage.setItem(SESSION_KEY, email);
    setSessionEmail(email);
  };

  const storeChallenge = (next: Challenge | null) => {
    setChallenge(next);
    if (next) sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(next));
    else sessionStorage.removeItem(CHALLENGE_KEY);
  };

  const value = useMemo<AuthValue>(() => {
    return {
      user,
      challenge,
      signIn: (email, password) => {
        const account = accounts.find((item) => sameEmail(item.email, email));
        if (!account || account.password !== password) return "Email or password is incorrect.";
        openSession(account.email);
        return null;
      },
      signOut: () => {
        localStorage.removeItem(SESSION_KEY);
        setSessionEmail(null);
      },
      beginSignup: (draft) => {
        if (accounts.some((item) => sameEmail(item.email, draft.email))) {
          return "An account with this email already exists.";
        }
        storeChallenge({
          purpose: "signup",
          email: draft.email.trim(),
          code: createCode(),
          draft: { ...draft, email: draft.email.trim(), name: draft.name.trim() },
          verified: false,
        });
        return null;
      },
      beginReset: (email) => {
        const account = accounts.find((item) => sameEmail(item.email, email));
        if (!account) return "We couldn't find an account with that email.";
        storeChallenge({
          purpose: "reset",
          email: account.email,
          code: createCode(),
          verified: false,
        });
        return null;
      },
      verifyCode: (code) => {
        if (!challenge) return "Request a new code to continue.";
        if (code !== challenge.code) return "That code doesn't match. Try again.";
        if (challenge.purpose === "signup" && challenge.draft) {
          const saved = persist([challenge.draft, ...accounts.filter((item) => !sameEmail(item.email, challenge.draft!.email))]);
          if (saved) return saved;
          openSession(challenge.draft.email);
          storeChallenge(null);
          return null;
        }
        storeChallenge({ ...challenge, verified: true });
        return null;
      },
      resendCode: () => {
        if (!challenge) return "Request a new code to continue.";
        storeChallenge({ ...challenge, code: createCode(), verified: false });
        return null;
      },
      resetPassword: (password) => {
        if (!challenge || challenge.purpose !== "reset" || !challenge.verified) {
          return "Verify the code before choosing a new password.";
        }
        const next = accounts.map((item) => (sameEmail(item.email, challenge.email) ? { ...item, password } : item));
        const saved = persist(next);
        if (saved) return saved;
        openSession(challenge.email);
        storeChallenge(null);
        return null;
      },
      updateProfile: (patch) => {
        if (!sessionEmail) return "Sign in again to update your profile.";
        const next = accounts.map((item) => (sameEmail(item.email, sessionEmail) ? { ...item, ...patch, name: patch.name.trim() } : item));
        return persist(next);
      },
      changePassword: (current, nextPassword) => {
        const account = accounts.find((item) => sameEmail(item.email, sessionEmail ?? ""));
        if (!account) return "Sign in again to change your password.";
        if (account.password !== current) return "Current password is incorrect.";
        return persist(accounts.map((item) => (sameEmail(item.email, account.email) ? { ...item, password: nextPassword } : item)));
      },
    };
    // openSession and persist close over the latest setters; accounts and challenge are the state that matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, challenge, sessionEmail, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function GuestOnly() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

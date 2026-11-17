import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { useAuth } from "@/features/auth/auth-context";
import { hasErrors, validateProfile } from "@/features/auth/validation";
import { useToast } from "@/lib/toast";

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function PhotoField({
  name,
  avatar,
  error,
  onChange,
}: {
  name: string;
  avatar?: string;
  error: string;
  onChange: (avatar: string | undefined, error: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onChange(avatar, "Upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      onChange(avatar, "Image must be under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result), "");
    reader.readAsDataURL(file);
  };

  return (
    <div ref={rootRef} className="relative w-fit">
      <div className="relative size-16">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-full rounded-full object-cover"
          />
        ) : (
          <span className="grid size-full place-items-center rounded-full bg-h4 text-lg font-bold text-ink">
            {initials(name)}
          </span>
        )}
        <button
          type="button"
          aria-label="Edit photo"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
          className="absolute -top-1 -right-1 z-10 grid size-7 cursor-pointer place-items-center rounded-full bg-card text-ink shadow-raise ring-1 ring-line"
        >
          <Icon name="pencil" className="size-3.5" />
        </button>
      </div>
      {open ? (
        <div
          role="menu"
          aria-label="Profile photo"
          className="absolute top-[calc(100%+8px)] left-0 z-30 w-52 rounded-[16px] bg-card p-1.5 text-ink shadow-pop ring-1 ring-line"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer items-center rounded-[10px] px-2.5 py-2 text-left text-sm font-semibold hover:bg-side-hover"
            onClick={() => {
              setOpen(false);
              fileRef.current?.click();
            }}
          >
            Upload image
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={!avatar}
            className="flex w-full cursor-pointer items-center rounded-[10px] px-2.5 py-2 text-left text-sm font-semibold text-bad hover:bg-bad-soft disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => {
              onChange(undefined, "");
              if (fileRef.current) fileRef.current.value = "";
              setOpen(false);
            }}
          >
            Remove
          </button>
          <p className="mx-1 mt-1 border-t border-line px-1.5 pt-2 pb-1 text-xs text-muted">
            PNG, JPG, or WebP. Up to 1.5 MB.
          </p>
        </div>
      ) : null}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      {error ? (
        <p
          role="alert"
          className="mt-2 max-w-52 text-xs font-semibold text-bad"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function GeneralPage() {
  const { user, updateProfile } = useAuth();
  const { push } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [errors, setErrors] = useState<ReturnType<typeof validateProfile>>({});
  const [photoError, setPhotoError] = useState("");

  if (!user) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validateProfile({ name, phone });
    setErrors(next);
    if (hasErrors(next) || photoError) return;
    const message = updateProfile({ name, phone, avatar });
    if (message) {
      setPhotoError(message);
      return;
    }
    push("Profile saved.");
  };

  return (
    <form
      className="card grid max-w-[640px] gap-5 p-5 sm:p-6"
      onSubmit={submit}
      noValidate
    >
      <PhotoField
        name={name || user.name}
        avatar={avatar}
        error={photoError}
        onChange={(next, error) => {
          setAvatar(next);
          setPhotoError(error);
        }}
      />
      <TextField
        label="Name"
        name="name"
        autoComplete="name"
        placeholder="User"
        value={name}
        error={errors.name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={user.email}
        readOnly
        hint="Email can't be changed."
        className="cursor-default text-muted"
      />
      <TextField
        label="Phone number"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+44 7700 900418"
        value={phone}
        error={errors.phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <div>
        <Button type="submit" variant="primary">
          Save changes
        </Button>
      </div>
    </form>
  );
}

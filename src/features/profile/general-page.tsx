import { useRef, useState, type FormEvent } from "react";
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

export function GeneralPage() {
  const { user, updateProfile } = useAuth();
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [errors, setErrors] = useState<ReturnType<typeof validateProfile>>({});
  const [photoError, setPhotoError] = useState("");

  if (!user) return null;

  const onFile = (file: File | undefined) => {
    setPhotoError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setPhotoError("Image must be under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

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
    <form className="card grid max-w-[640px] gap-5 p-5 sm:p-6" onSubmit={submit} noValidate>
      <div className="flex items-center gap-4">
        {avatar ? (
          <img src={avatar} alt="" className="size-16 rounded-full object-cover" />
        ) : (
          <span className="grid size-16 place-items-center rounded-full bg-h4 text-lg font-bold text-ink">{initials(name || user.name)}</span>
        )}
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => fileRef.current?.click()}>
              Upload photo
            </Button>
            {avatar ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAvatar(undefined);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted">PNG, JPG, or WebP. Up to 1.5 MB.</p>
          {photoError ? (
            <p role="alert" className="text-xs font-semibold text-bad">
              {photoError}
            </p>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
        </div>
      </div>
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

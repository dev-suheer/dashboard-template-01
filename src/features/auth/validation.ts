export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function validateSignIn(values: { email: string; password: string }) {
  const errors: FieldErrors<"email" | "password"> = {};
  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!isEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}

export function validateSignUp(values: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}) {
  const errors: FieldErrors<"name" | "email" | "phone" | "password" | "confirm"> = {};
  const name = values.name.trim();
  if (name.length < 2) errors.name = "Enter your name.";
  else if (!/[a-z]/i.test(name)) errors.name = "Name needs at least one letter.";

  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!isEmail(values.email)) errors.email = "Enter a valid email address.";

  const digits = phoneDigits(values.phone);
  if (!values.phone.trim()) errors.phone = "Enter your phone number.";
  else if (digits.length < 7 || digits.length > 15) errors.phone = "Enter a phone number with 7 to 15 digits.";

  if (!values.password) errors.password = "Create a password.";
  else if (values.password.length < 6) errors.password = "Use at least 6 characters.";

  if (!values.confirm) errors.confirm = "Confirm your password.";
  else if (values.confirm !== values.password) errors.confirm = "Passwords don't match.";

  return errors;
}

export function validateEmailOnly(email: string) {
  const errors: FieldErrors<"email"> = {};
  if (!email.trim()) errors.email = "Enter your email.";
  else if (!isEmail(email)) errors.email = "Enter a valid email address.";
  return errors;
}

export function validateOtp(code: string) {
  if (!code) return "Enter the 6-digit code.";
  if (!/^\d{6}$/.test(code)) return "The code is 6 digits.";
  return "";
}

export function validateReset(values: { password: string; confirm: string }) {
  const errors: FieldErrors<"password" | "confirm"> = {};
  if (!values.password) errors.password = "Create a new password.";
  else if (values.password.length < 6) errors.password = "Use at least 6 characters.";
  if (!values.confirm) errors.confirm = "Confirm your new password.";
  else if (values.confirm !== values.password) errors.confirm = "Passwords don't match.";
  return errors;
}

export function validateProfile(values: { name: string; phone: string }) {
  const errors: FieldErrors<"name" | "phone"> = {};
  const name = values.name.trim();
  if (name.length < 2) errors.name = "Enter your name.";
  else if (!/[a-z]/i.test(name)) errors.name = "Name needs at least one letter.";
  const digits = phoneDigits(values.phone);
  if (!values.phone.trim()) errors.phone = "Enter your phone number.";
  else if (digits.length < 7 || digits.length > 15) errors.phone = "Enter a phone number with 7 to 15 digits.";
  return errors;
}

export function validatePasswordChange(values: { current: string; next: string; confirm: string }) {
  const errors: FieldErrors<"current" | "next" | "confirm"> = {};
  if (!values.current) errors.current = "Enter your current password.";
  if (!values.next) errors.next = "Create a new password.";
  else if (values.next.length < 6) errors.next = "Use at least 6 characters.";
  else if (values.current && values.next === values.current) errors.next = "Choose a different password.";
  if (!values.confirm) errors.confirm = "Confirm your new password.";
  else if (values.next && values.confirm !== values.next) errors.confirm = "Passwords don't match.";
  return errors;
}

export function hasErrors(errors: object) {
  return Object.keys(errors).length > 0;
}

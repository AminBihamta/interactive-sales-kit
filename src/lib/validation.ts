const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function getEmailError(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return "Required";
  if (!isValidEmail(trimmed)) return "Enter a valid email address";
  return undefined;
}

export function isValidMalaysianPhone(phone: string): boolean {
  return getMobileNumberError(phone) === undefined;
}

export function getMobileNumberError(phone: string): string | undefined {
  const trimmed = phone.trim();
  if (!trimmed) return "Required";

  if (!/^[\d\s\-()+.]+$/.test(trimmed)) {
    return "Enter a valid contact number";
  }

  const digits = trimmed.replace(/\D/g, "");

  if (digits.length < 9) {
    return "Contact number is too short";
  }
  if (digits.length > 13) {
    return "Contact number is too long";
  }

  let national: string;
  if (digits.startsWith("60")) {
    national = digits.slice(2);
    if (national.startsWith("0")) national = national.slice(1);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else {
    national = digits;
  }

  if (national.length < 9 || national.length > 10) {
    return "Enter a valid Malaysian contact number";
  }

  if (!/^[1-9]/.test(national)) {
    return "Enter a valid Malaysian contact number";
  }

  return undefined;
}

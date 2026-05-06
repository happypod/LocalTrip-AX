export function maskPhone(phone: string | null): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9]/g, "");
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-****-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // 02-1234-5678 or 031-123-4567
    if (cleaned.startsWith("02")) {
      return `${cleaned.slice(0, 2)}-****-${cleaned.slice(6)}`;
    }
    return `${cleaned.slice(0, 3)}-***-${cleaned.slice(6)}`;
  }
  
  // fallback for arbitrary lengths
  if (cleaned.length > 7) {
    const start = Math.floor((cleaned.length - 4) / 2);
    return cleaned.slice(0, start) + "****" + cleaned.slice(start + 4);
  }
  
  return "****";
}

export function maskName(name: string | null): string {
  if (!name) return "";
  if (name.length <= 2) {
    return name.charAt(0) + "*";
  }
  return name.charAt(0) + "*".repeat(name.length - 2) + name.charAt(name.length - 1);
}

export function maskEmail(email: string | null): string {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [username, domain] = parts;
  if (username.length <= 2) {
    return username.charAt(0) + "*@" + domain;
  }
  return username.charAt(0) + "*".repeat(username.length - 2) + username.charAt(username.length - 1) + "@" + domain;
}

export function maskSensitiveText(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .replace(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
      (email) => maskEmail(email)
    )
    .replace(
      /(?:\+?82[-.\s]?)?0?1[016789][-\s.]?\d{3,4}[-.\s]?\d{4}/g,
      (phone) => maskPhone(phone)
    )
    .replace(
      /\b\d{2,3}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g,
      (phone) => maskPhone(phone)
    );
}

export function createMessagePreview(message: string | null | undefined, maxLength = 80): string {
  const normalized = maskSensitiveText(message).replace(/\s+/g, " ").trim();
  if (!normalized) return "-";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}...`;
}

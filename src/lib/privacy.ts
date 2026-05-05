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

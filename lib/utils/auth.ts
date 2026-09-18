export function getAuthRedirectUrl(type: "sign-in" | "sign-up"): string {
  if (process.env.NODE_ENV === "production") {
    return `https://accounts.mockrithm.me/${type}`;
  }
  return `/${type}`;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUrlFriendly(username: string): string {
  return username.replace(/\s+/g, "-").toLowerCase();
}

export function fromUrlFriendly(urlUsername: string): string {
  return urlUsername.replace(/-+/g, " ");
}

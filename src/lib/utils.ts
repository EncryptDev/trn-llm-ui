import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFilePreviewUrl(path: string) {
  if (path.startsWith('http')) return path // Sudah full URL
  return `${process.env.NEXT_PUBLIC_BASE_URL}/${path}`
}

export function getImageUrl(path: string): string {
  return `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_FILE_URL : ''}/${path}`;
}

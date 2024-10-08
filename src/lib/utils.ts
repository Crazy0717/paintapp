import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadURI = (uri: string | undefined, name: string) => {
  const link = document.createElement("a")
  link.download = name
  link.href = uri || ""
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

 
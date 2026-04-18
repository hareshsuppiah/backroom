import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Tailwind-merge config aware of Backroom's custom font-size tokens.
 *
 * Without this, twMerge groups any `text-*` class as either a font-size or a
 * text-colour and drops one when the two appear together. Example:
 * `cn("text-body-sm", "text-secondary")` would collapse to one of them.
 * Registering the size tokens explicitly keeps both.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "display-md",
            "display-sm",
            "heading-lg",
            "heading-md",
            "heading-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "caption",
            "mono-md",
            "mono-sm",
          ],
        },
      ],
    },
  },
});

/**
 * Compose Tailwind class strings with sensible conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

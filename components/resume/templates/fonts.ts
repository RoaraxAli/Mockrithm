// Curated set of professional fonts available in the resume builder.
// Each `id` is stored on `parsedData.customStyles.fontFamily`.
// CSS variables are loaded in app/layout.tsx and registered in app/globals.css.
export interface FontOption {
  id: string;
  label: string;
  className: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "inter", label: "Inter", className: "font-inter" },
  { id: "source-sans", label: "Source Sans", className: "font-source-sans" },
  { id: "poppins", label: "Poppins", className: "font-poppins" },
  { id: "merriweather", label: "Merriweather", className: "font-merriweather" },
  { id: "lora", label: "Lora", className: "font-lora" },
  { id: "playfair", label: "Playfair Display", className: "font-playfair" },
  { id: "roboto-slab", label: "Roboto Slab", className: "font-roboto-slab" },
  { id: "jetbrains-mono", label: "JetBrains Mono", className: "font-jetbrains-mono" },
];

// Returns the Tailwind font class for a given font id, falling back to Inter.
export function getFontClass(fontId?: string): string {
  return FONT_OPTIONS.find((f) => f.id === fontId)?.className || "font-inter";
}

export function getFontLabel(fontId?: string): string {
  return FONT_OPTIONS.find((f) => f.id === fontId)?.label || "Inter";
}

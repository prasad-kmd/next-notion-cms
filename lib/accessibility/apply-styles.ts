import { AccessibilitySettings, AVAILABLE_FONTS } from "@/contexts/AccessibilityContext";

export const applyAccessibilityStyles = (
  container: HTMLElement,
  settings: AccessibilitySettings
) => {
  const selectedFont = AVAILABLE_FONTS.find((f) => f.name === settings.fontFamily) || AVAILABLE_FONTS[0];

  container.style.setProperty("--a11y-font-size", `${settings.fontSize}em`);
  container.style.setProperty("--a11y-font-family", selectedFont.variable);
  container.style.setProperty("--a11y-line-height", `${settings.lineHeight}`);
  container.style.setProperty("--a11y-word-spacing", `${(settings.wordSpacing - 1) * 0.5}em`);
  container.style.setProperty("--a11y-letter-spacing", `${(settings.letterSpacing - 1) * 0.1}em`);

  if (settings.isHighContrast) {
    container.classList.add("a11y-high-contrast");
  } else {
    container.classList.remove("a11y-high-contrast");
  }
};

export const clearAccessibilityStyles = (container: HTMLElement) => {
  container.style.removeProperty("--a11y-font-size");
  container.style.removeProperty("--a11y-font-family");
  container.style.removeProperty("--a11y-line-height");
  container.style.removeProperty("--a11y-word-spacing");
  container.style.removeProperty("--a11y-letter-spacing");
  container.classList.remove("a11y-high-contrast");
};

/**
 * Get a CSS custom property (variable) value from the document root
 * @param {string} variableName - The CSS variable name (with or without --)
 * @returns {string} The value of the CSS variable
 */
export function getCssVariable(variableName) {
  const name = variableName.startsWith("--") ? variableName : `--${variableName}`;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function getCssColor(colorName) {
  return getCssVariable(`--bs-${colorName}`);
}

export function getHexToRgb(hex) {
  const sanitizedHex = hex.replace("#", "");
  const bigint = parseInt(sanitizedHex, 16);
  const r = bigint >> 16 & 255;
  const g = bigint >> 8 & 255;
  const b = bigint & 255;

  return `${r} ${g} ${b}`;
}

export function lightenColor(hex, percent) {
  const sanitizedHex = hex.replace("#", "");
  const num = parseInt(sanitizedHex, 16);
  const r = (num >> 16) + Math.round(2.55 * percent);
  const g = (num >> 8 & 255) + Math.round(2.55 * percent);
  const b = (num & 255) + Math.round(2.55 * percent);

  const newR = r < 255 ? r < 0 ? 0 : r : 255;
  const newG = g < 255 ? g < 0 ? 0 : g : 255;
  const newB = b < 255 ? b < 0 ? 0 : b : 255;

  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB
    .toString(16)
    .padStart(2, "0")}`;
}

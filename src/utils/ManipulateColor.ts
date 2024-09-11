/**
 * Represents a color in various formats.
 */
type ColorInput = string | [number, number, number] | [number, number, number, number] | {
    r: number;
    g: number;
    b: number;
    a?: number
};

/**
 * Options for color manipulation.
 */
interface ColorOptions {
    alpha?: number;
    format?: 'hex' | 'rgb' | 'hsl';
    adjustments?: {
        lightness?: number;
        saturation?: number;
        hue?: number;
    };
}

/**
 * Manipulates and converts a color based on specified options and opacity.
 *
 * @param color - The input color (hex string, RGB/RGBA array, or RGB/RGBA object).
 * @param opacity - The opacity to apply to the color (0 to 1). If provided, overrides the alpha in ColorOptions.
 * @param options - Options for color manipulation.
 * @returns The color in the specified format with applied adjustments and opacity.
 * @throws {Error} If the input color is invalid or any option is out of range.
 *
 * @example
 * // Returns "rgb(255 0 0 / 0.5)" (red with 50% opacity)
 * manipulateColor("#FF0000", 0.5);
 *
 * @example
 * // Returns "hsl(120deg 100% 50% / 0.75)" (green with 75% opacity in HSL)
 * manipulateColor([0, 255, 0], 0.75, { format: 'hsl' });
 *
 * @example
 * // Returns "rgb(128 0 255)" (blue-violet, lightened and hue-shifted)
 * manipulateColor({ r: 0, g: 0, b: 255 }, 1, {
 *   format: 'rgb',
 *   adjustments: { lightness: 0.25, hue: 60 }
 * });
 */
export function manipulateColor(color: ColorInput, opacity?: number, options: ColorOptions = {}): string {
    const {alpha = 1, format = 'rgb', adjustments = {}} = options;

    // Use provided opacity if available, otherwise use alpha from options
    const finalAlpha = opacity !== undefined ? opacity : alpha;

    // Validate alpha
    if (finalAlpha < 0 || finalAlpha > 1) {
        throw new Error('Alpha/Opacity must be between 0 and 1');
    }

    // Convert input to RGBA values
    let r: number, g: number, b: number, a: number = finalAlpha;

    if (typeof color === 'string') {
        const hex = color.replace(/^#/, '');
        if (!/^([0-9A-Fa-f]{3}){1,2}([0-9A-Fa-f]{2})?$/.test(hex)) {
            throw new Error('Invalid hexadecimal color string');
        }
        const fullHex = hex.length === 3 ? hex.split('').map(char => char + char).join('') : hex;
        r = parseInt(fullHex.substr(0, 2), 16);
        g = parseInt(fullHex.substr(2, 2), 16);
        b = parseInt(fullHex.substr(4, 2), 16);
        if (fullHex.length === 8 && opacity === undefined) {
            a = parseInt(fullHex.substr(6, 2), 16) / 255;
        }
    } else if (Array.isArray(color)) {
        [r, g, b, a = finalAlpha] = color;
    } else {
        ({r, g, b, a = finalAlpha} = color);
    }

    // Validate RGB values
    r = clamp(Math.round(r), 0, 255);
    g = clamp(Math.round(g), 0, 255);
    b = clamp(Math.round(b), 0, 255);
    a = clamp(a, 0, 1);

    // Convert to HSL for adjustments
    let [h, s, l] = rgbToHsl(r, g, b);

    // Apply adjustments
    if (adjustments.hue) {
        h = (h + adjustments.hue) % 360;
        if (h < 0) h += 360; // Ensure positive hue
    }
    if (adjustments.saturation) {
        s = clamp(s + adjustments.saturation, 0, 1);
    }
    if (adjustments.lightness) {
        l = clamp(l + adjustments.lightness, 0, 1);
    }

    // Convert back to RGB
    [r, g, b] = hslToRgb(h, s, l);

    // Convert to the specified format
    switch (format) {
        case 'hex':
            return rgbToHex(r, g, b, a);
        case 'rgb':
            return a < 1
                ? `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${a.toFixed(2)})`
                : `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
        case 'hsl':
            return a < 1
                ? `hsl(${Math.round(h)}deg ${Math.round(s * 100)}% ${Math.round(l * 100)}% / ${a.toFixed(2)})`
                : `hsl(${Math.round(h)}deg ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
        default:
            throw new Error('Invalid format specified');
    }
}

// Helper functions

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s: number
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    } else {
        s = 0;
    }

    return [h * 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

function rgbToHex(r: number, g: number, b: number, a: number = 1): string {
    const toHex = (x: number) => Math.round(x).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(Math.round(a * 255)) : ''}`;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

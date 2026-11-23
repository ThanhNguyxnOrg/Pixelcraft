#!/usr/bin/env node

export function parseColorComponents(value) {
  if (typeof value !== 'string') return null;
  const text = value.trim().toLowerCase();
  if (!text) return null;
  if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

  const hex = /^#([0-9a-f]{3,8})$/.exec(text);
  if (hex) {
    const digits = hex[1];
    const expand = (part) => Number.parseInt(part.length === 1 ? part + part : part, 16);
    if (digits.length === 3 || digits.length === 4) {
      return { r: expand(digits[0]), g: expand(digits[1]), b: expand(digits[2]), a: digits.length === 4 ? expand(digits[3]) / 255 : 1 };
    }
    if (digits.length === 6 || digits.length === 8) {
      return {
        r: expand(digits.slice(0, 2)),
        g: expand(digits.slice(2, 4)),
        b: expand(digits.slice(4, 6)),
        a: digits.length === 8 ? expand(digits.slice(6, 8)) / 255 : 1,
      };
    }
    return null;
  }

  const functional = /^rgba?\((.*)\)$/.exec(text);
  if (!functional) return null;
  const body = functional[1].trim();
  const readChannel = (part) => {
    const number = Number.parseFloat(part);
    if (Number.isNaN(number)) return null;
    return part.trim().endsWith('%') ? number * 2.55 : number;
  };
  const readAlpha = (part) => {
    if (part === undefined) return 1;
    const number = Number.parseFloat(part);
    if (Number.isNaN(number)) return null;
    return part.trim().endsWith('%') ? number / 100 : number;
  };
  let parts;
  let alpha;
  if (body.includes(',')) {
    parts = body.split(',').map((part) => part.trim());
    alpha = readAlpha(parts[3]);
    parts = parts.slice(0, 3);
  } else {
    const [channels, alphaText] = body.split('/').map((part) => part.trim());
    parts = channels.split(/\s+/).filter(Boolean).slice(0, 3);
    alpha = readAlpha(alphaText);
  }
  if (parts.length !== 3 || alpha === null) return null;
  const channels = parts.map(readChannel);
  if (channels.some((channel) => channel === null)) return null;
  return {
    r: Math.max(0, Math.min(255, channels[0])),
    g: Math.max(0, Math.min(255, channels[1])),
    b: Math.max(0, Math.min(255, channels[2])),
    a: Math.max(0, Math.min(1, alpha)),
  };
}

export function alphaBlend(source, destination) {
  const alpha = source.a + destination.a * (1 - source.a);
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (source.r * source.a + destination.r * destination.a * (1 - source.a)) / alpha,
    g: (source.g * source.a + destination.g * destination.a * (1 - source.a)) / alpha,
    b: (source.b * source.a + destination.b * destination.a * (1 - source.a)) / alpha,
    a: alpha,
  };
}

export function contrastRatio(first, second) {
  const luminance = (color) => {
    const convert = (channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * convert(color.r) + 0.7152 * convert(color.g) + 0.0722 * convert(color.b);
  };
  const one = luminance(first);
  const two = luminance(second);
  return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node color-utils.mjs --help\n\nPure color parsing, alpha compositing, and contrast helpers used by shoot.mjs tests.');
}

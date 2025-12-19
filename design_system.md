# Design System & Style Guide

## 1. Design Voice & Philosophy

**"Cozy, Warm, Gentle, Approachable"**

Our design should feel like curling up with a good book in a comfortable chair. We aim for:

- **Show, Don't Tell**: Use visual cues, icons, and layout to guide the user rather than lengthy instructions.
- **Warmth**: Avoid sterile whites and cold blues. Embrace paper textures, warm greys, and amber tones.
- **Simplicity**: reduce visual noise. Content (the books) should be the hero.

## 2. Typography

Fonts are automatically configured via Tailwind.

- **Headings (Serif)**: `Crimson Text`
  - Usage: Automatically applied to all `h1` through `h6` elements.
  - Class: `font-serif` (if needed manually)
- **Body & UI (Sans)**: `Inter`
  - Usage: Default for all other text.
  - Class: `font-sans`

## 3. Color Palette

We use a semantic color system based on a warm "Book & Leather" theme.

| Token             | Scoped Color        | CSS Variable   |
| ----------------- | ------------------- | -------------- |
| `bg-background`   | Parchment White     | `--background` |
| `text-foreground` | Ink Black           | `--foreground` |
| `text-primary`    | Leather/Amber Brown | `--primary`    |
| `bg-primary`      | Leather/Amber Brown | `--primary`    |
| `bg-secondary`    | Light Beige         | `--secondary`  |

## 4. Components

### Global Inheritance

- **Headings**: All headings inherit `font-serif` and `text-primary` by default. You do not need to add these classes manually unless overriding.
- **Body**: Inherits `font-sans` and `text-foreground`.

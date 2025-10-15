// Design tokens (skeleton) using CSS variables
export const tokens = {
  color: {
    primary: 'var(--oa-color-primary, #2f6feb)',
    surface: 'var(--oa-color-surface, #ffffff)',
    text: 'var(--oa-color-text, #0f172a)',
  },
  spacing: (n: number) => `calc(var(--oa-space, 4px) * ${n})`,
  radius: {
    sm: 'var(--oa-radius-sm, 4px)',
    md: 'var(--oa-radius-md, 8px)',
  },
} as const;

export type Tokens = typeof tokens;


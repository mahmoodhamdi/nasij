export declare const palette: {
  stone: Record<string, string>;
  terracotta: Record<string, string>;
  sage: Record<string, string>;
  amber: Record<string, string>;
  danger: Record<string, string>;
  success: Record<string, string>;
  warning: Record<string, string>;
};

export declare const semanticLight: Record<string, string>;
export declare const semanticDark: Record<string, string>;

export declare const typography: {
  fontFamily: Record<string, string[]>;
  fontSize: Record<string, [string, { lineHeight: string; letterSpacing?: string }] | string>;
};

export declare const radius: Record<string, string>;

export declare const motion: {
  duration: Record<string, string>;
  ease: Record<string, string>;
};

export declare const tokens: {
  palette: typeof palette;
  semanticLight: typeof semanticLight;
  semanticDark: typeof semanticDark;
  typography: typeof typography;
  radius: typeof radius;
  motion: typeof motion;
};

export interface SearchTheme {palette?: {themePrimary?: string; themeLighterAlt?: string}; semanticColors?: {bodyText?: string;bodySubtext?: string;bodyBackground?: string;variantBorder?: string};}
export declare const brand: Readonly<{primary:string;ink:string;muted:string;surface:string;soft:string;border:string;font:string;radius:string;focus:string}>;
export declare function brandStyle(theme?: SearchTheme): Record<string,string>;

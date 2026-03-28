export type ExpiryMode = "none" | "15m" | "30m" | "1h" | "custom";

export type AutoSaveExpiry = (mode?: ExpiryMode) => Promise<boolean>;

export type Provider = "OpenAI" | "DeepSeek" | "Anthropic";

export type FeatureFlags = {
  aiAssist: boolean;
  smartHints: boolean;
  maintenanceMode: boolean;
  publicSignup: boolean;
};

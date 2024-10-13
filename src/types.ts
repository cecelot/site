export interface RobotsTxtRules {
  [key: string]: Rule;
}

export interface Rule {
  reasoning: string;
  bots: string[];
}

export interface Transform {
  width: number;
  height: number;
  quality: 50 | 75 | 100;
  format?: "auto" | "jpeg";
}

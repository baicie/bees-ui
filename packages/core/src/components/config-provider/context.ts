import { AliasToken, OverrideToken } from "../theme/interface";

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export interface ThemeConfig {
  token?: Partial<AliasToken>;
  components?: OverrideToken;
  hashed?: boolean;
  inherit?: boolean;
}

import warning from '@utils/warning';
import { DerivativeFunc, TokenType } from './interface';

let uuid = 0;

export default class Theme<DesignToken extends TokenType, DerivativeToken extends TokenType> {
  private derivatives: DerivativeFunc<DesignToken, DerivativeToken>[];
  public readonly id: number;

  constructor(
    derivatives: DerivativeFunc<DesignToken, DerivativeToken> | DerivativeFunc<DesignToken, DerivativeToken>[],
  ) {
    this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
    this.id = uuid;

    if (derivatives.length === 0) {
      warning(derivatives.length > 0, '[Bees ui CSS-in-JS] Theme should have at least one derivative function.');
    }

    uuid += 1;
  }

  getDerivativeToken(token: DesignToken): DerivativeToken {
    return this.derivatives.reduce<DerivativeToken>(
      (result, derivative) => derivative(token, result),
      undefined as any,
    );
  }
}

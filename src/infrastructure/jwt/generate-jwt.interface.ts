interface JWTPayload {
  exp: number;
  nbf: number;
  iat: number;
}

export type DurationType =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years";

export interface IPayload extends Partial<JWTPayload> {
  token_id: string;
  sub: string;
  roles?: string[];
  permissions?: string[];
}

export abstract class IGenerateJwt {
  abstract sign(
    payload: IPayload,
    expired?: {
      value: number;
      duration: DurationType;
    }
  ): Promise<string>;

  abstract verify(token: string): Promise<IPayload>;

  abstract decode(token: string): IPayload;

  protected convertDurationToExpTimestamp(
    value: number,
    duration: DurationType
  ): number {
    let milliseconds = value;
    switch (duration) {
      case "seconds":
        milliseconds *= 1000;
        break;
      case "minutes":
        milliseconds *= 60 * 1000;
        break;
      case "hours":
        milliseconds *= 60 * 60 * 1000;
        break;
      case "days":
        milliseconds *= 24 * 60 * 60 * 1000;
        break;
      case "weeks":
        milliseconds *= 7 * 24 * 60 * 60 * 1000;
        break;
      case "months":
        milliseconds *= 30 * 24 * 60 * 60 * 1000;
        break;
      case "years":
        milliseconds *= 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        throw new Error(
          'Invalid format. Supported formats are: "s", "m", "h", "day", "week", "month", "year"'
        );
    }

    const currentDate = new Date();

    const expirationDate = new Date(currentDate.getTime() + milliseconds);

    const expTimestamp = Math.floor(expirationDate.getTime() / 1000);

    return expTimestamp;
  }
}

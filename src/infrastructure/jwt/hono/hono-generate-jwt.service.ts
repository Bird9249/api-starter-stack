import { decode, sign, verify } from "hono/jwt";
import {
  DurationType,
  IGenerateJwt,
  IPayload,
} from "../generate-jwt.interface";
import { JWT_SECRET } from "../secret";

export class HonoGenerateJwtService extends IGenerateJwt {
  async sign(
    payload: IPayload,
    expired?: {
      value: number;
      duration: DurationType;
    }
  ): Promise<string> {
    if (expired)
      payload.exp = this.convertDurationToExpTimestamp(
        expired.value,
        expired.duration
      );

    return await sign(payload, JWT_SECRET);
  }

  async verify(token: string): Promise<IPayload> {
    return await verify(token, JWT_SECRET);
  }

  decode(token: string): IPayload {
    return decode(token).payload;
  }

  private static instance: HonoGenerateJwtService;
  public static getInstance(): HonoGenerateJwtService {
    if (!HonoGenerateJwtService.instance) {
      HonoGenerateJwtService.instance = new HonoGenerateJwtService();
    }

    return HonoGenerateJwtService.instance;
  }
}

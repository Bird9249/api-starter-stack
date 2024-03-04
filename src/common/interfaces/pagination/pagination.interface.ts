import { IOrderBy } from "./order-by.interface";

export interface IOffsetBasePaginate<Entity> extends IOrderBy<Entity> {
  offset?: number;
  limit?: number;
}

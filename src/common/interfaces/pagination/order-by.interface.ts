export interface IOrderBy<Entity> {
  column?: keyof Entity | null;
  sort_order?: "ASC" | "DESC" | string | null;
}

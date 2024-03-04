export interface IPaginated<Entity> {
  data: Entity[];
  total: number;
}

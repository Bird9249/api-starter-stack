export default interface IQueryHandler<Query, Response> {
  execute(query: Query): Promise<Response>;
}

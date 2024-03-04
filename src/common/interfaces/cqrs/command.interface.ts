export default interface ICommandHandler<Command, Response> {
  execute(command: Command): Promise<Response>
}

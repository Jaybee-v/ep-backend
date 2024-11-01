export class PatchUserCommand {
  constructor(
    public readonly key: string,
    public readonly value: string | boolean,
    public readonly id: string,
  ) {}
}

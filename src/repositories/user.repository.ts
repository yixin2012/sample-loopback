import { DefaultCrudRepository } from "@loopback/repository";
import { User } from "../models";
import { SqliteDataSource } from "../datasources";
import { inject } from "@loopback/core";

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(@inject("datasources.sqlite") dataSource: SqliteDataSource) {
    super(User, dataSource);
  }
}

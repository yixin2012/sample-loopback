import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SqliteDataSource} from '../datasources';
import {KqClockRepot, KqClockRepotRelations} from '../models';

export class KqClockRepotRepository extends DefaultCrudRepository<
  KqClockRepot,
  typeof KqClockRepot.prototype.id,
  KqClockRepotRelations
> {
  constructor(
    @inject('datasources.sqlite') dataSource: SqliteDataSource,
  ) {
    super(KqClockRepot, dataSource);
  }
}

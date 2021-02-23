import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SqliteDataSource} from '../datasources';
import {KqClockReportRelations, kq_clock_report} from '../models';

export class KqClockReportRepository extends DefaultCrudRepository<
  kq_clock_report,
  typeof kq_clock_report.prototype.id,
  KqClockReportRelations
> {
  constructor(@inject('datasources.sqlite') dataSource: SqliteDataSource) {
    super(kq_clock_report, dataSource);
  }
}

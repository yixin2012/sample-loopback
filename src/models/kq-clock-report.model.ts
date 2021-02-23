import {Entity, model, property} from '@loopback/repository';

@model()
export class kq_clock_report extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: false,
  })
  batchid: string;

  @property({
    type: 'string',
    required: false,
  })
  department: string;

  @property({
    type: 'string',
    required: true,
  })
  employee_id?: string;

  @property({
    type: 'string',
    required: true,
  })
  employee_name?: string;

  @property({
    type: 'string',
    required: true,
  })
  clock_date?: string;

  @property({
    type: 'string',
    required: true,
  })
  day_of_week?: string;

  @property({
    type: 'string',
    required: false,
  })
  clock_in_t?: string;

  @property({
    type: 'string',
    required: false,
  })
  clock_out_t?: string;

  @property({
    type: 'number',
    required: false,
  })
  work_hour?: number;

  @property({
    type: 'string',
    required: false,
  })
  status?: string;

  @property({
    type: 'string',
    required: true,
  })
  stipulate_in_t?: string;

  @property({
    type: 'string',
    required: true,
  })
  stipulate_out_t?: string;

  @property({
    type: 'string',
    required: true,
  })
  create_t?: string;

  constructor(data?: Partial<kq_clock_report>) {
    super(data);
  }
}

export interface KqClockReportRelations {
  // describe navigational properties here
}

export type KqClockReportWithRelations = kq_clock_report &
  KqClockReportRelations;

import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {kq_clock_report} from '../models';
import {KqClockReportRepository} from '../repositories';

export class CrawlerController {
  constructor(
    @repository(KqClockReportRepository)
    public kqClockReportRepository: KqClockReportRepository,
  ) {}

  @post('/kq-clock-reports')
  @response(200, {
    description: 'kq_clock_report model instance',
    content: {'application/json': {schema: getModelSchemaRef(kq_clock_report)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(kq_clock_report, {
            title: 'NewKqClockReport',
            exclude: ['id'],
          }),
        },
      },
    })
    kqClockReport: Omit<kq_clock_report, 'id'>,
  ): Promise<kq_clock_report> {
    return this.kqClockReportRepository.create(kqClockReport);
  }

  @get('/kq-clock-reports/count')
  @response(200, {
    description: 'kq_clock_report model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(kq_clock_report) where?: Where<kq_clock_report>,
  ): Promise<Count> {
    return this.kqClockReportRepository.count(where);
  }

  @get('/kq-clock-reports')
  @response(200, {
    description: 'Array of kq_clock_report model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(kq_clock_report, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(kq_clock_report) filter?: Filter<kq_clock_report>,
  ): Promise<kq_clock_report[]> {
    return this.kqClockReportRepository.find(filter);
  }

  @patch('/kq-clock-reports')
  @response(200, {
    description: 'kq_clock_report PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(kq_clock_report, {partial: true}),
        },
      },
    })
    kqClockReport: kq_clock_report,
    @param.where(kq_clock_report) where?: Where<kq_clock_report>,
  ): Promise<Count> {
    return this.kqClockReportRepository.updateAll(kqClockReport, where);
  }

  @get('/kq-clock-reports/{id}')
  @response(200, {
    description: 'kq_clock_report model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(kq_clock_report, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(kq_clock_report, {exclude: 'where'})
    filter?: FilterExcludingWhere<kq_clock_report>,
  ): Promise<kq_clock_report> {
    return this.kqClockReportRepository.findById(id, filter);
  }

  @patch('/kq-clock-reports/{id}')
  @response(204, {
    description: 'kq_clock_report PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(kq_clock_report, {partial: true}),
        },
      },
    })
    kqClockReport: kq_clock_report,
  ): Promise<void> {
    await this.kqClockReportRepository.updateById(id, kqClockReport);
  }

  @put('/kq-clock-reports/{id}')
  @response(204, {
    description: 'kq_clock_report PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() kqClockReport: kq_clock_report,
  ): Promise<void> {
    await this.kqClockReportRepository.replaceById(id, kqClockReport);
  }

  @del('/kq-clock-reports/{id}')
  @response(204, {
    description: 'kq_clock_report DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.kqClockReportRepository.deleteById(id);
  }
}

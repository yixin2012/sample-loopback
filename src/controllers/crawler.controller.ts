import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {KqClockRepot} from '../models';
import {KqClockRepotRepository} from '../repositories';

export class CrawlerController {
  constructor(
    @repository(KqClockRepotRepository)
    public kqClockRepotRepository : KqClockRepotRepository,
  ) {}

  @post('/kq-clock-repots')
  @response(200, {
    description: 'KqClockRepot model instance',
    content: {'application/json': {schema: getModelSchemaRef(KqClockRepot)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KqClockRepot, {
            title: 'NewKqClockRepot',
            exclude: ['id'],
          }),
        },
      },
    })
    kqClockRepot: Omit<KqClockRepot, 'id'>,
  ): Promise<KqClockRepot> {
    return this.kqClockRepotRepository.create(kqClockRepot);
  }

  @get('/kq-clock-repots/count')
  @response(200, {
    description: 'KqClockRepot model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(KqClockRepot) where?: Where<KqClockRepot>,
  ): Promise<Count> {
    return this.kqClockRepotRepository.count(where);
  }

  @get('/kq-clock-repots')
  @response(200, {
    description: 'Array of KqClockRepot model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(KqClockRepot, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(KqClockRepot) filter?: Filter<KqClockRepot>,
  ): Promise<KqClockRepot[]> {
    return this.kqClockRepotRepository.find(filter);
  }

  @patch('/kq-clock-repots')
  @response(200, {
    description: 'KqClockRepot PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KqClockRepot, {partial: true}),
        },
      },
    })
    kqClockRepot: KqClockRepot,
    @param.where(KqClockRepot) where?: Where<KqClockRepot>,
  ): Promise<Count> {
    return this.kqClockRepotRepository.updateAll(kqClockRepot, where);
  }

  @get('/kq-clock-repots/{id}')
  @response(200, {
    description: 'KqClockRepot model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(KqClockRepot, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(KqClockRepot, {exclude: 'where'}) filter?: FilterExcludingWhere<KqClockRepot>
  ): Promise<KqClockRepot> {
    return this.kqClockRepotRepository.findById(id, filter);
  }

  @patch('/kq-clock-repots/{id}')
  @response(204, {
    description: 'KqClockRepot PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KqClockRepot, {partial: true}),
        },
      },
    })
    kqClockRepot: KqClockRepot,
  ): Promise<void> {
    await this.kqClockRepotRepository.updateById(id, kqClockRepot);
  }

  @put('/kq-clock-repots/{id}')
  @response(204, {
    description: 'KqClockRepot PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() kqClockRepot: KqClockRepot,
  ): Promise<void> {
    await this.kqClockRepotRepository.replaceById(id, kqClockRepot);
  }

  @del('/kq-clock-repots/{id}')
  @response(204, {
    description: 'KqClockRepot DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.kqClockRepotRepository.deleteById(id);
  }
}

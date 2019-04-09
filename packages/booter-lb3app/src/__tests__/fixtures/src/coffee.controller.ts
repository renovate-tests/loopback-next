import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {Coffee} from './coffee.model';
import {CoffeeRepository} from './coffee.repository';

export class CoffeeController {
  constructor(
    @repository(CoffeeRepository)
    public coffeeRepository: CoffeeRepository,
  ) {}

  @post('/coffees', {
    responses: {
      '200': {
        description: 'Coffee model instance',
        content: {'application/json': {schema: {'x-ts-type': Coffee}}},
      },
    },
  })
  async create(@requestBody() coffee: Coffee): Promise<Coffee> {
    return await this.coffeeRepository.create(coffee);
  }

  @get('/coffees/count', {
    responses: {
      '200': {
        description: 'Coffee model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Coffee)) where?: Where,
  ): Promise<Count> {
    return await this.coffeeRepository.count(where);
  }

  @get('/coffees', {
    responses: {
      '200': {
        description: 'Array of Coffee model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Coffee}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Coffee)) filter?: Filter,
  ): Promise<Coffee[]> {
    return await this.coffeeRepository.find(filter);
  }

  @patch('/coffees', {
    responses: {
      '200': {
        description: 'Coffee PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() coffee: Coffee,
    @param.query.object('where', getWhereSchemaFor(Coffee)) where?: Where,
  ): Promise<Count> {
    return await this.coffeeRepository.updateAll(coffee, where);
  }

  @get('/coffees/{id}', {
    responses: {
      '200': {
        description: 'Coffee model instance',
        content: {'application/json': {schema: {'x-ts-type': Coffee}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Coffee> {
    return await this.coffeeRepository.findById(id);
  }

  @patch('/coffees/{id}', {
    responses: {
      '204': {
        description: 'Coffee PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() coffee: Coffee,
  ): Promise<void> {
    await this.coffeeRepository.updateById(id, coffee);
  }

  @put('/coffees/{id}', {
    responses: {
      '204': {
        description: 'Coffee PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() coffee: Coffee,
  ): Promise<void> {
    await this.coffeeRepository.replaceById(id, coffee);
  }

  @del('/coffees/{id}', {
    responses: {
      '204': {
        description: 'Coffee DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.coffeeRepository.deleteById(id);
  }
}

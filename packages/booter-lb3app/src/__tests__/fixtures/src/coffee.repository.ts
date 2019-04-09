import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {Coffee} from './coffee.model';
import {DsDataSource} from './datasources';

export class CoffeeRepository extends DefaultCrudRepository<
  Coffee,
  typeof Coffee.prototype.id
> {
  constructor(@inject('datasources.ds') dataSource: DsDataSource) {
    super(Coffee, dataSource);
  }
}

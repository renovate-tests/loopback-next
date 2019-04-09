import {Entity, model, property} from '@loopback/repository';

@model()
export class Coffee extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  flavour: string;

  @property({
    type: 'string',
    required: true,
  })
  size: string;

  constructor(data?: Partial<Coffee>) {
    super(data);
  }
}

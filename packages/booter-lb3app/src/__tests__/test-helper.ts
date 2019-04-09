// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/booter-lb3app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {CoffeeApplication} from './fixtures/src/application';
import {Coffee} from './fixtures/src/coffee.model';
const lb3app = require('./fixtures/legacy/server/server');

export async function setupApplication(): Promise<AppWithClient> {
  const app = new CoffeeApplication({rest: givenHttpServerConfig()});

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: CoffeeApplication;
  client: Client;
}

/**
 * Generate a complete Coffee object for use with tests.
 * @param  A partial (or complete) Coffee object.
 */
export function givenCoffee(coffee?: Partial<Coffee>) {
  const data = Object.assign(
    {
      flavour: 'hazelnut',
      size: 'small',
    },
    coffee,
  );
  return new Coffee(data);
}

/**
 * Generate a complete Coffee object for use with tests.
 */
export function givenCoffeeShop() {
  const CoffeeShop = lb3app.models.CoffeeShop;

  const data = {
    name: 'great coffee shop',
    city: 'Toronto',
  };

  return new CoffeeShop(data);
}

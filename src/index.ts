import {SampleLoopbackApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {SampleLoopbackApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new SampleLoopbackApplication(options);
  await app.boot();
  await app.migrateSchema();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

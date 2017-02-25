import * as Path from 'path';

import {
  command,
  metadata,
  Command,
  ExpectedError
} from 'clime';

import { Service } from 'node-windows';
import * as v from 'villa';

import { SERVICE_DEFINITION } from '../core';

@command({
  description: 'Uninstall Lucky DNS Windows Service'
})
export default class extends Command {
  @metadata
  async execute() {
    if (process.platform !== 'win32') {
      throw new ExpectedError('This feature is only available on Windows');
    }

    let service = new Service(SERVICE_DEFINITION);

    service.uninstall();
    console.log('Uninstalling...');

    await v.awaitable(service, 'uninstall');
    console.log('Service uninstalled.');
  }
}

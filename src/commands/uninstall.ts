import * as Path from 'path';

import {
  command,
  metadata,
  Command,
  ExpectedError
} from 'clime';

import * as v from 'villa';

import { SERVICE_DEFINITION } from '../core';
import { createWindowsService } from '../util';

@command({
  description: 'Uninstall Lucky DNS Windows Service'
})
export default class extends Command {
  @metadata
  async execute() {
    if (process.platform !== 'win32') {
      throw new ExpectedError('This feature is only available on Windows');
    }

    let service = createWindowsService(SERVICE_DEFINITION);

    service.uninstall();
    console.log('Uninstalling...');

    await v.awaitable(service, 'uninstall');
    console.log('Service uninstalled.');
  }
}

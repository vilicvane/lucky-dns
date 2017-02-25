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
    let service = createWindowsService(SERVICE_DEFINITION);

    let uninstallAwaitable = v.awaitable(service, 'uninstall');

    console.log('Uninstalling...');
    service.uninstall();

    await uninstallAwaitable;

    console.log('Service uninstalled.');
  }
}

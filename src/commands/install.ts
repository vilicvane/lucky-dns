import * as Path from 'path';

import {
  command,
  param,
  Command,
  ExpectedError
} from 'clime';

import { Service } from 'node-windows';
import * as v from 'villa';

import {
  DEFAULT_DNS_ADDRESS,
  DEFAULT_DNS_PORT,
  DEFAULT_DNS_INTERNAL,
  DEFAULT_DNS_EXTERNAL,
  DEFAULT_DNS_INTERNAL_ROUTES,
  SERVICE_DEFINITION,
  DNSOptions,
  Nameserver,
  NameserverResolveEvent
} from '../core';

import { IPv4 } from '../util';

@command({
  description: 'Install Lucky DNS as Windows Service'
})
export default class extends Command {
  async execute(
    @param({
      description: 'Address to bind',
      default: DEFAULT_DNS_ADDRESS
    })
    address: IPv4,

    @param({
      description: 'Port to listen',
      default: DEFAULT_DNS_PORT
    })
    port: number,

    options: DNSOptions
  ) {
    if (process.platform !== 'win32') {
      throw new ExpectedError('This feature is only available on Windows');
    }

    let service = new Service(Object.assign(SERVICE_DEFINITION, {
      env: [
        {
          name: 'LUCKY_DNS_ADDRESS',
          value: address.text
        },
        {
          name: 'LUCKY_DNS_PORT',
          value: port.toString()
        },
        {
          name: 'LUCKY_DNS_INTERNAL',
          value: options.internal.text
        },
        {
          name: 'LUCKY_DNS_EXTERNAL',
          value: options.external.text
        },
        {
          name: 'LUCKY_DNS_INTERNAL_ROUTES',
          value: options.internalRoutes.fullName
        }
      ]
    }));

    service.install();
    console.log('Installing...');

    await v.awaitable(service, 'install');

    service.start();
    console.log('Starting service...');

    await v.awaitable(service, 'start');
    console.log('Service should have been started. If not, try to start it manually.');
  }
}

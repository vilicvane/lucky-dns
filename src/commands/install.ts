import * as Path from 'path';

import {
  command,
  option,
  param,
  Command,
  ExpectedError,
  Object,
  Options
} from 'clime';

import { Service } from 'node-windows';
import * as v from 'villa';

import { IP } from '../util';

// TODO: merge duplicates

export class DNSOptions extends Options {
  @option({
    flag: 'i',
    description: 'Internal (China) DNS server',
    default: '180.76.76.76'
  })
  internal: IP.IPv4;

  @option({
    flag: 'e',
    description: 'External DNS server',
    default: '8.8.8.8'
  })
  external: IP.IPv4;

  @option({
    flag: 'r',
    description: 'Internal (China) routes file',
    default: Path.join(__dirname, '../../china-routes.txt')
  })
  internalRoutes: Object.File;
}

@command({
  description: 'Install Lucky DNS as Windows Service'
})
export default class extends Command {
  async execute(
    @param({
      description: 'Address to bind',
      default: '127.0.0.1'
    })
    address: IP.IPv4,

    @param({
      description: 'Port to listen',
      default: 53
    })
    port: number,

    options: DNSOptions
  ) {
    if (process.platform !== 'win32') {
      throw new ExpectedError('This feature is only available on Windows');
    }

    let service = new Service({
      name: 'Lucky-DNS',
      script: Path.join(__dirname, '../cli.js'),
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
    });

    service.install();
    console.log('Installing...');

    await v.awaitable(service, 'install');

    service.start();
    console.log('Starting service...');

    await v.awaitable(service, 'start');
    console.log('Service should have been started. If not, try to start it manually.');
  }
}

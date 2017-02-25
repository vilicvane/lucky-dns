import {
  command,
  param,
  Command
} from 'clime';

import {
  DEFAULT_DNS_ADDRESS,
  DEFAULT_DNS_PORT,
  DEFAULT_DNS_INTERNAL,
  DEFAULT_DNS_EXTERNAL,
  DEFAULT_DNS_INTERNAL_ROUTES,
  DNSOptions,
  Nameserver,
  NameserverResolveEvent
} from '../core';

import { IPv4 } from '../util';

@command({
  description: 'Lucky DNS'
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
    let nameserver = new Nameserver({
      address: address.text,
      port: port,
      internal: options.internal.text,
      external: options.external.text,
      internalRoutesContent: await options.internalRoutes.text('ascii')
    });

    nameserver.on('ready', () => {
      console.log(`Nameserver (${address.text}:${port}) is ready.`);
    });

    nameserver.on('resolve', (event: NameserverResolveEvent) => {
      console.log(`Relayed a request using ${event.internal ? 'internal' : 'external'} DNS (${event.address}).`);
    });
  }
}

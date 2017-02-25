import {
  option,
  Object as ClimeObject,
  Options
} from 'clime';

import {
  DEFAULT_DNS_INTERNAL,
  DEFAULT_DNS_EXTERNAL,
  DEFAULT_DNS_INTERNAL_ROUTES
} from './variables';

import { IPv4 } from '../util';

export class DNSOptions extends Options {
  @option({
    flag: 'i',
    description: 'Internal (China) DNS server',
    default: DEFAULT_DNS_INTERNAL
  })
  internal: IPv4;

  @option({
    flag: 'e',
    description: 'External DNS server',
    default: DEFAULT_DNS_EXTERNAL
  })
  external: IPv4;

  @option({
    flag: 'r',
    description: 'Internal (China) routes file',
    default: DEFAULT_DNS_INTERNAL_ROUTES
  })
  internalRoutes: ClimeObject.File;
}

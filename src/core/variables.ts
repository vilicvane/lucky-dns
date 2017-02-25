import * as Path from 'path';

export const DEFAULT_DNS_ADDRESS = process.env.LUCKY_DNS_ADDRESS || '127.0.0.1';
export const DEFAULT_DNS_PORT = process.env.LUCKY_DNS_PORT || 53;
export const DEFAULT_DNS_INTERNAL = process.env.LUCKY_DNS_INTERNAL || '180.76.76.76';
export const DEFAULT_DNS_EXTERNAL = process.env.LUCKY_DNS_EXTERNAL || '8.8.8.8';
export const DEFAULT_DNS_INTERNAL_ROUTES = process.env.LUCKY_DNS_INTERNAL_ROUTES || Path.join(__dirname, '../../china-routes.txt');

export const SERVICE_DEFINITION = {
  name: 'Lucky DNS',
  script: Path.join(__dirname, '../cli.js')
};

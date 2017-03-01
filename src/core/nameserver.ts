import * as Dgram from 'dgram';
import * as EventEmitter from 'events';

import * as Packet from 'native-dns-packet';

import {
  MessageCache,
  compareNet,
  convertAddressToInteger,
  convertStringToNet,
  matchAddressWithSortedNets
} from '../util';

const DNS_PORT = 53;
const DNS_TIMEOUT = 5000;

export interface NameserverOptions {
  /** Local address to bind. */
  address: string;
  /** Local port to listen. */
  port: number;
  /** Cache timeout. */
  timeout: number;
  /** Internal (China) DNS. */
  internal: string;
  /** External DNS. */
  external: string;
  /** Internal (China) routes content. */
  internalRoutesContent: string;
}

export interface NameserverResolveEvent {
  internal: boolean;
  address: string;
}

export class Nameserver extends EventEmitter {
  constructor({
    address,
    port,
    timeout,
    internal: internalDNS,
    external: externalDNS,
    internalRoutesContent
  }: NameserverOptions) {
    super();

    let that = this;

    let chinaNets = (internalRoutesContent.match(/.+/g) || [])
      .map(str => convertStringToNet(str))
      .sort(compareNet);

    let cache = new MessageCache(timeout);
    let server = Dgram.createSocket('udp4');

    server.on('message', (serverMessage, serverRemote) => {
      let cachedMessage = cache.get(serverMessage);

      if (cachedMessage) {
        server.send(cachedMessage, serverRemote.port, serverRemote.address);
        return;
      }

      let client = Dgram.createSocket('udp4');

      let timer = setTimeout(closeClient, DNS_TIMEOUT);

      let internalDNSAbstained = false;
      let externalCandidateMessage: Buffer | undefined;

      client.on('message', (clientMessage, clientRemote) => {
        let internal = clientRemote.address === internalDNS;
        let answer: any[];

        try {
          answer = Packet.parse(clientMessage).answer;
        } catch (e) {
          return;
        }

        if (internal) {
          if (!answer.length) {
            relay(clientMessage, internal);
            return;
          }

          let aRecords = answer.filter(record => record.type === 1);

          if (!aRecords.length) {
            relay(clientMessage, internal);
            return;
          }

          let inChina = aRecords.some(record => {
            let address = convertAddressToInteger(record.address);
            return !!matchAddressWithSortedNets(address, chinaNets);
          });

          if (inChina) {
            relay(clientMessage, internal);
            return;
          }

          if (externalCandidateMessage) {
            relay(externalCandidateMessage, false);
          } else {
            internalDNSAbstained = true;
          }
        } else {
          if (internalDNSAbstained) {
            relay(clientMessage, false);
          } else {
            externalCandidateMessage = clientMessage;
          }
        }
      });

      function relay(message: Buffer, internal: boolean): void {
        clearTimeout(timer);
        closeClient();

        server.send(message, serverRemote.port, serverRemote.address);
        cache.set(serverMessage, message);

        that.emit('resolve', {
          internal,
          address: internal ? internalDNS : externalDNS
        } as NameserverResolveEvent);
      }

      function closeClient(): void {
        try {
          client.close();
        } catch (error) { }
      }

      client.send(serverMessage, DNS_PORT, internalDNS);
      client.send(serverMessage, DNS_PORT, externalDNS);
    });

    server.bind(port, address, () => {
      this.emit('ready');
    });
  }
}

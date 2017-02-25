import * as Net from 'net';

import { ExpectedError } from 'clime';

export class IPv4 {
  private constructor(
    public text: string
  ) {
    if (!Net.isIPv4(text)) {
      throw new ExpectedError(`Invalid address "${text}"`);
    }
  }

  get value(): number {
    return convertAddressToInteger(this.text);
  }

  valueOf(): number {
    return this.value;
  }

  toString(): string {
    return this.text;
  }

  static cast(text: string): IPv4 {
    return new IPv4(text);
  }
}

export function convertAddressToInteger(address: string): number {
  return address.split('.')
    .map((part, index) => Number(part) << 24 - index * 8 >>> 0)
    .reduce((sum, value) => sum + value);
}

export function convertCIDRToNetmask(cidr: number): number {
  return cidr ? -1 << (32 - cidr) >>> 0 : 0;
}

export type Net = [number, number];

export function convertStringToNet(netStr: string): Net {
  let parts = netStr.split('/');
  return [
    convertAddressToInteger(parts[0]),
    convertCIDRToNetmask(Number(parts[1]))
  ];
}

export function compareAddressWithNet(address: number, [network, netmask]: Net): number {
  return address < network ? -1 : address > network + ~netmask ? 1 : 0;
}

export function compareNet(a: Net, b: Net): number {
  return a[0] - b[0];
}

export function matchAddressWithSortedNets(address: number, sortedNets: Net[]): Net | undefined {
  return _match(0, sortedNets.length);

  function _match(start: number, end: number): Net | undefined {
    if (start >= end) {
      return undefined;
    }

    let middle = Math.floor((start + end - 1) / 2);
    let candidate = sortedNets[middle];
    let result = compareAddressWithNet(address, candidate);

    return result < 0 ? _match(start, middle) :
      result > 0 ? _match(middle + 1, end) :
      candidate;
  }
}

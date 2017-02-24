declare module 'native-dns-packet' {
  interface Header {
    id: number;
    qr: number;
    opcode: number;
    aa: number;
    tc: number;
    rd: number;
    ra: number;
    res1: number;
    res2: number;
    res3: number;
    rcode: number;
  }

  class Packet {
    header: Header;
    questions: any[];
    answer: any[];
    authority: any[];
    additional: any[];
    edns_options: any[];
    payload: any;

    static parse(buffer: Buffer): Packet;
    static write(buffer: Buffer, packet: Packet): void;
  }

  namespace Packet { }

  export = Packet;
}

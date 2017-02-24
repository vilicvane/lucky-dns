# Lucky DNS

Heavily inspired by [SinoDNS](https://github.com/isofew/sinodns) and [ChinaDNS](https://github.com/shadowsocks/ChinaDNS).

## Installation

```sh
npm install -g lucky-dns
```

## Usage

Just execute `ldns` in command line after installation, see below or `ldns --help` for more details.

```text
USAGE

  ldns [address=127.0.0.1] [port=53] [...options]

PARAMETERS

  address - Address to bind
  port    - Port to listen

OPTIONS

  -i, --internal <internal>              - Internal (China) DNS server
  -e, --external <external>              - External DNS server
  -r, --internal-routes <internalRoutes> - Internal (China) routes file
```

## Build

```sh
npm run build
```

## License

MIT License.

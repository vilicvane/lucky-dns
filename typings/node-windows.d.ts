declare module 'node-windows' {
  import * as EventEmitter from 'events';

  export interface EnvironmentVariable {
    name: string;
    value: string;
  }

  export interface ServiceOptions {
    name: string;
    script: string;
    description?: string;
    env?: EnvironmentVariable | EnvironmentVariable[];
    wait?: number;
    grow?: number;
  }

  export interface User {
    domain: string;
    account: string;
    password: string;
  }

  export interface Sudo {
    password: string;
  }

  export class Service extends EventEmitter {
    user: User;
    sudo: Sudo;

    constructor(options: ServiceOptions);

    install(): void;
    uninstall(): void;
    start(): void;
  }
}

import { ExpectedError } from 'clime';
import { Service, ServiceOptions } from 'node-windows';

const ServiceClass = (() => {
  try {
    return require('node-windows').Service as typeof Service;
  } catch (error) {
    return undefined;
  }
})();;

export function createWindowsService(options: ServiceOptions): Service {
  if (!ServiceClass) {
    throw new ExpectedError('This feature is only available on Windows');
  }

  return new ServiceClass(options);
}

import { CONSTANTS } from './constants';

export class Context {
  constructor() {}

  getFullName(name: string) {
    return `${CONSTANTS.name}-${name}`;
  }
}
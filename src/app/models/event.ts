import { Events } from './events';

export interface Event<T> {
  payload?: T | undefined;
  type: Events;
}

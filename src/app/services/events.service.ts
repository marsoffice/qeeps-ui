import { Injectable } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { Event } from '../models/event';
import { Events } from '../models/events';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private subject = new Subject<Event<any>>();
  constructor() { }

  publish<T>(event: Events, payload: T | undefined = undefined) {
    this.subject.next({
      type: event,
      payload: payload as T
    });
  }

  subscribe<T>(event: Events) {
    return this.subject.asObservable().pipe(
      filter(x => x.type === event)
    );
  }
}

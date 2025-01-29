import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FilterService {
  filterCriteria = new Subject<any>();
  constructor() { }
}

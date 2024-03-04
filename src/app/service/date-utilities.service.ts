import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtilitiesService {
  constructor() {}

  convertDate(date: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = `${dateObj.getMonth() + 1}`.padStart(2, '0');
    const day = `${dateObj.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toISOString(date: string): string {
    return new Date(date).toISOString();
  }
}

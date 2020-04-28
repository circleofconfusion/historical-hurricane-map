import { BACKEND_HOST } from '../environments/environment.dev.js';
import { hurricanes } from './eventSvc.js';
import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';

function search(searchData) {
  // TODO: escape ampersands?
  const queryString = searchData.map(d => d.join('=')).join('&');
  fromFetch(`${BACKEND_HOST}/search?${queryString}`)
    .pipe(
      switchMap(response => {
        if (response.ok) return response.json();
        else return of({ error: true, message: `Error ${response.status}`});
      }),
      catchError(error => {
        console.error(error);
        return of({ error: true, message: error.message });
      })
    )
    .subscribe({
      next: response => hurricanes.next(response),
      complete: () => console.log('done')
    });
}

export { search };
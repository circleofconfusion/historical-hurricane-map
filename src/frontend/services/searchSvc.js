import { BACKEND_HOST } from '../environments/environment.dev.js';
import { hurricanes } from './eventSvc.js';
import { fromFetch } from 'rxjs/fetch';

function search(searchData) {
  // TODO: escape ampersands?
  const queryString = searchData.map(d => d.join('=')).join('&');
  fromFetch(`${BACKEND_HOST}/search?${queryString}`).subscribe(result => {
    hurricanes.next(result);
  });
}

export { search };
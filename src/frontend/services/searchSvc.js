import { BACKEND_HOST } from '../environments/environment.dev.js';
import { hurricanes } from './eventSvc.js';

function search(searchData) {
  // const result = fetch(`${BACKEND_HOST}/query/search`, searchData);
  // hurricanes.next(result);
  console.log(searchData);
}

export { search };
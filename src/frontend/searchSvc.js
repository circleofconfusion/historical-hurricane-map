import { BACKEND_HOST } from '/environments/environments.dev.js';
import { hurricanes } from '/eventSvc.js';

function search(searchObj) {
  const result = fetch(`${BACKEND_HOST}/query/search`, searchObj);
  hurricanes.next(result);
}

export { search };
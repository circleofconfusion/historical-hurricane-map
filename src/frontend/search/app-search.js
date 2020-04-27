import { ZephComponents, html, css, onCreate } from 'zephjs';
import { search } from '../services/searchSvc.js';

ZephComponents.define('app-search', () => {
  html('./app-search.html');
  css('./app-search.css');

  onCreate((element, content) => {
    const form = content.querySelector('form');
    form.addEventListener('submit', evt => {
      evt.preventDefault();
      search(getFormData(form));
    });

  });
});

function getFormData(form) {
  const formValues = {};

  Array.from(new FormData(form))
    .filter(formControl => formControl[1])
    .forEach(formControl => {
      let key = formControl[0],
        value = formControl[1];

      // clean up value a bit
      if (isNaN(value)) {
        value = value.toUpperCase();
      } else {
        value = +value;
      }

      // Check if key is an array name
      if (key.charAt(key.length - 1) == ']') {
        // strip the [] characters from the key
        key = key.substr(0, key.length - 2);
        if (formValues[key]) {
          formValues[key].push(value);
        } else {
          formValues[key] = [ value ];
        }
      } else {
        formValues[key] = value;
      }
    });

  return formValues;
}
import {ZephComponents, html, css, onCreate} from '/node_modules/zephjs/zeph.full.js';
import {search} from '../eventSvc.js';

ZephComponents.define('app-search', () => {
  html('./app-search.html');
  css('./app-search.css');

  onCreate((element, content) => {
    const form = content.querySelector('form');
    const intensityFieldset = content.querySelector('#intensity-fieldset');
    intensityFieldset.addEventListener('click', () => {
      search.next(getFormValue());
    });

    function getFormValue() {
      const intensityValues = Array.from(form.querySelectorAll('#intensity-fieldset input[type="checkbox"]'))
        .filter(e => e.checked)
        .map(e => e.value);
      
      const specialValues = Array.from(form.querySelectorAll('#special-fieldset input[type="checkbox"]'))
        .filter(e => e.checked)
        .map(e => e.value);

      return {
        intensity: intensityValues,
        specialConditions: specialValues
      };
    }
  });
});

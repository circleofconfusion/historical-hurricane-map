import { ZephComponents, html, css, property, onProperty } from 'zephjs';
import { hurricanes } from '../services/eventSvc';

const hurricaneIntensities = {
  WV: 'Tropical Wave',
  DB: 'Tropical Disturbance',
  TD: 'Tropical Depression',
  TS: 'Tropical Storm',
  C1: 'Category 1 Hurricane',
  C2: 'Category 2 Hurricane',
  C3: 'Category 3 Hurricane',
  C4: 'Category 4 Hurricane',
  C5: 'Category 5 Hurricane',
};

ZephComponents.define('app-text-search-result', () => {
  html('./text-search-result.html');
  css('../colors.css');
  css('./text-search-result.css');

  property('data', {});

  onProperty('data', (data, hurricane, element, content) => {
    content.getElementById('name-year').innerHTML = `${hurricane.properties.name} ${hurricane.properties.year}`;
    const maxIntensityIndex = Math.max(
      ...hurricane.properties.measurements.map(m => Object.keys(hurricaneIntensities).indexOf(m.systemStatus))
    );
    const maxIntensityCode = Object.keys(hurricaneIntensities)[maxIntensityIndex];
    const maxIntensityDescription = hurricaneIntensities[maxIntensityCode];
    element.classList.add(maxIntensityCode);
    content.getElementById('intensity').innerHTML = maxIntensityDescription;
  });
});
import { ZephComponents, html, css, onCreate } from 'zephjs';
import { json } from 'd3-fetch';
import { geoGraticule, geoPath, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';
import { select } from 'd3-selection';
import { hurricanes } from '../services/eventSvc.js';

ZephComponents.define('app-map', () => {
  html('./app-map.html');
  css('./app-map.css');

  onCreate(async (element, content) => {

    
    const width = 1000;
    const height = 540;
		
    const svg = select(content.querySelector('svg'))
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMin meet');
		
    const projection = geoMercator()
      .scale(350)
      .center([-50, 45])
      .translate([ width / 2, height / 2])
      .precision(0.1);
		
    const graticule = geoGraticule();
		
    const geoPathGenerator = geoPath()
      .projection(projection);
		
    svg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', geoPathGenerator);
		
    const world = await json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
		
    const countries = feature(world, world.objects.countries).features;
		
    svg.selectAll('path.country')
      .data(countries)
      .enter()
      .insert('path')
      .attr('class', 'country')
      .attr('d', geoPathGenerator)
      .append('title')
      .text(d => d.properties.name);

    hurricanes.subscribe(hurricaneFeatures => {
      svg.selectAll('g')
        .data(hurricaneFeatures)
        .join(
          enter => {
            const group = enter.append('g').classed('hurricane-path', true);
            group.append('path').attr('d', geoPathGenerator);
            group.selectAll('circle')
              .data(d => d.geometry.coordinates)
              .join('circle')
              .style('fill', '#f00')
              .attr('r', 5)
              .attr('cx', d => projection(d)[0])
              .attr('cy', d => projection(d)[1]);
          },
          update => {
            update.select('path').attr('d', geoPathGenerator);
            update.selectAll('circle')
              .data(d => d.geometry.coordinates)
              .join('circle')
              .style('fill', '#f00')
              .attr('r', 5)
              .attr('cx', d => projection(d)[0])
              .attr('cy', d => projection(d)[1]);
          },
          exit => exit.remove()
        );
    });
  });
});

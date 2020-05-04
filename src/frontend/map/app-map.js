import { ZephComponents, html, css, onCreate } from 'zephjs';
import { json } from 'd3-fetch';
import { scaleOrdinal } from 'd3-scale';
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

    const colorScale = scaleOrdinal()
      .domain([
        'TW',
        'LO',
        'DS',
        'TD',
        'TS',
        'C1',
        'C2',
        'C3',
        'C4',
        'C5',
        'EX'
      ])
      .range([
        '#ffffcc',
        '#a1dab4',
        '#e5f5e0',
        '#a1d99b',
        '#31a354',
        '#fee5d9',
        '#fcae91',
        '#fb6a4a',
        '#de2d26',
        '#a50f15',
        '#253494'
      ]);
		
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
            const group = enter
              .append('g')
              .classed('hurricane-path', true);

            group
              .append('path')
              .attr('d', geoPathGenerator);

            group.selectAll('line')
              .data(d =>
                d.geometry.coordinates.map((c, i) => {
                  if (i + 1 < d.geometry.coordinates.length) {
                    return {
                      coordinate: c,
                      nextCoordinate: d.geometry.coordinates[i+1],
                      measurement: d.properties.measurements[i]
                    };
                  } else {
                    return {
                      coordinate: c,
                      nextCoordinate: c,
                      measurement: d.properties.measurements[i]
                    };
                  }
                })
              )
              .join('line')
              .attr('x1', d => projection(d.coordinate)[0])
              .attr('y1', d => projection(d.coordinate)[1])
              .attr('x2', d => projection(d.nextCoordinate)[0])
              .attr('y2', d => projection(d.nextCoordinate)[1])
              .style('stroke', d => colorScale(d.measurement.systemStatus));

            group.selectAll('circle')
              .data(d => d.geometry.coordinates.map((c, i) => {
                return {
                  coordinate: c,
                  measurement: d.properties.measurements[i]
                };
              }))
              .join('circle')
              .attr('r', 3)
              .attr('cx', d => projection(d.coordinate)[0])
              .attr('cy', d => projection(d.coordinate)[1])
              .style('fill', d => colorScale(d.measurement.systemStatus));
          },
          update => {
            update
              .select('path')
              .attr('d', geoPathGenerator);

            update.selectAll('line')
              .data(d =>
                d.geometry.coordinates.map((c, i) => {
                  if (i + 1 < d.geometry.coordinates.length) {
                    return {
                      coordinate: c,
                      nextCoordinate: d.geometry.coordinates[i+1],
                      measurement: d.properties.measurements[i]
                    };
                  } else {
                    return {
                      coordinate: c,
                      nextCoordinate: c,
                      measurement: d.properties.measurements[i]
                    };
                  }
                })
              )
              .join('line')
              .attr('x1', d => projection(d.coordinate)[0])
              .attr('y1', d => projection(d.coordinate)[1])
              .attr('x2', d => projection(d.nextCoordinate)[0])
              .attr('y2', d => projection(d.nextCoordinate)[1])
              .style('stroke', d => colorScale(d.measurement.systemStatus));

            update.selectAll('circle')
              .data(d => d.geometry.coordinates.map((c, i) => {
                return {
                  coordinate: c,
                  measurement: d.properties.measurements[i]
                };
              }))
              .join('circle')
              .attr('r', 3)
              .attr('cx', d => projection(d.coordinate)[0])
              .attr('cy', d => projection(d.coordinate)[1])
              .style('fill', d => colorScale(d.measurement.systemStatus));
          },
          exit => exit.remove()
        );
    });
  });
});

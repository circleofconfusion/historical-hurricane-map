import { ZephComponents, html, css, onCreate } from 'zephjs';
import { json } from 'd3-fetch';
import { scaleOrdinal } from 'd3-scale';
import { geoGraticule, geoPath, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';
import { select } from 'd3-selection';
import { format, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { hurricanes } from '../services/eventSvc.js';

const hurricaneTypes = {
  LO: 'Non-Cyclone Low',
  WV: 'Tropical Wave',
  DB: 'Tropical Disturbance',
  TD: 'Tropical Depression',
  TS: 'Tropical Storm',
  C1: 'Category 1 Hurricane',
  C2: 'Category 2 Hurricane',
  C3: 'Category 3 Hurricane',
  C4: 'Category 4 Hurricane',
  C5: 'Category 5 Hurricane',
  EX: 'Extra-Tropical Cyclone'
};

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
        '#ffffaa',
        '#a1dab4',
        '#74c476',
        '#31a354',
        '#006d2c',
        '#fee5d9',
        '#fcae91',
        '#fb6a4a',
        '#de2d26',
        '#a50f15',
        '#bd82ff'
      ]);
		
    const projection = geoMercator()
      .scale(350)
      .center([-50, 45])
      .translate([ width / 2, height / 2])
      .precision(0.1);
		
    const graticule = geoGraticule();
		
    const geoPathGenerator = geoPath()
      .projection(projection);
      
    const world = await json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
    
    const land = feature(world, world.objects.land);
    
    const countries = feature(world, world.objects.countries).features;
    
    svg.append('path')
      .datum(land)
      .attr('class', 'land')
      .attr('d', geoPathGenerator)
      .attr('fill', '#fff');
      
    svg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', geoPathGenerator);

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
                      name: `${d.properties.name.charAt(0)}${d.properties.name.substring(1).toLowerCase()}`,
                      coordinate: c,
                      nextCoordinate: d.geometry.coordinates[i+1],
                      measurement: d.properties.measurements[i]
                    };
                  } else {
                    return {
                      name: `${d.properties.name.charAt(0)}${d.properties.name.substring(1).toLowerCase()}`,
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
              .style('stroke', d => colorScale(d.measurement.systemStatus))
              .append('title')
              .text(d => `${d.name}\n${hurricaneTypes[d.measurement.systemStatus]}\n${format(utcToZonedTime(new Date(d.measurement.dateTime), 'UTC'), 'MM/dd/yyyy HH:mm', { timeZone: 'UTC'})}\n${d.measurement.maxWind} kn\n${d.measurement.minPressure > 0 ? d.measurement.minPressure : '---'} ㏔`);;

            group.selectAll('circle')
              .data(d => d.geometry.coordinates.map((c, i) => {
                return {
                  name: `${d.properties.name.charAt(0)}${d.properties.name.substring(1).toLowerCase()}`,
                  coordinate: c,
                  measurement: d.properties.measurements[i]
                };
              }))
              .join('circle')
              .attr('class', 'measurement')
              .attr('r', 3)
              .attr('cx', d => projection(d.coordinate)[0])
              .attr('cy', d => projection(d.coordinate)[1])
              .style('fill', d => colorScale(d.measurement.systemStatus))
              .append('title')
              .text(d => `${d.name}\n${hurricaneTypes[d.measurement.systemStatus]}\n${format(utcToZonedTime(new Date(d.measurement.dateTime), 'UTC'), 'MM/dd/yyyy HH:mm', { timeZone: 'UTC'})}\n${d.measurement.maxWind} kn\n${d.measurement.minPressure > 0 ? d.measurement.minPressure : '---'} ㏔`);
          },
          update => {
            update
              .select('path')
              .attr('d', geoPathGenerator);

            const lines = update.selectAll('line')
              .data(d =>
                d.geometry.coordinates.map((c, i) => {
                  if (i + 1 < d.geometry.coordinates.length) {
                    return {
                      name: `${d.properties.name.charAt(0)}${d.properties.name.substring(1).toLowerCase()}`,
                      coordinate: c,
                      nextCoordinate: d.geometry.coordinates[i+1],
                      measurement: d.properties.measurements[i]
                    };
                  } else {
                    return {
                      name: `${d.properties.name.charAt(0)}${d.properties.name.substring(1).toLowerCase()}`,
                      coordinate: c,
                      nextCoordinate: c,
                      measurement: d.properties.measurements[i]
                    };
                  }
                })
              );
              
            lines.enter()
              .append('line')
              .attr('x1', d => projection(d.coordinate)[0])
              .attr('y1', d => projection(d.coordinate)[1])
              .attr('x2', d => projection(d.nextCoordinate)[0])
              .attr('y2', d => projection(d.nextCoordinate)[1])
              .style('stroke', d => colorScale(d.measurement.systemStatus))
              .append('title')
              .text(d => `${d.name}\n${hurricaneTypes[d.measurement.systemStatus]}\n${format(utcToZonedTime(new Date(d.measurement.dateTime), 'UTC'), 'MM/dd/yyyy HH:mm', { timeZone: 'UTC'})}\n${d.measurement.maxWind} kn\n${d.measurement.minPressure > 0 ? d.measurement.minPressure : '---'} ㏔`);

            lines.exit().remove();
            
            lines
              .attr('x1', d => projection(d.coordinate)[0])
              .attr('y1', d => projection(d.coordinate)[1])
              .attr('x2', d => projection(d.nextCoordinate)[0])
              .attr('y2', d => projection(d.nextCoordinate)[1])
              .style('stroke', d => colorScale(d.measurement.systemStatus))
              .select('title')
              .text(d => `${d.name}\n${hurricaneTypes[d.measurement.systemStatus]}\n${format(utcToZonedTime(new Date(d.measurement.dateTime), 'UTC'), 'MM/dd/yyyy HH:mm', { timeZone: 'UTC'})}\n${d.measurement.maxWind} kn\n${d.measurement.minPressure > 0 ? d.measurement.minPressure : '---'} ㏔`);

            const circles = update.selectAll('circle')
              .data(d => d.geometry.coordinates.map((c, i) => {
                return {
                  name: `${d.properties.name.charAt(0)}${d.properties.name.substring(1).toLowerCase()}`,
                  coordinate: c,
                  measurement: d.properties.measurements[i]
                };
              }));

            circles.enter()
              .append('circle')
              .attr('class', 'measurement')
              .attr('r', 3)
              .attr('cx', d => projection(d.coordinate)[0])
              .attr('cy', d => projection(d.coordinate)[1])
              .style('fill', d => colorScale(d.measurement.systemStatus))
              .append('title')
              .text(d => { console.log('d', d); return `${d.name}\n${hurricaneTypes[d.measurement.systemStatus]}\n${format(utcToZonedTime(new Date(d.measurement.dateTime), 'UTC'), 'MM/dd/yyyy HH:mm', { timeZone: 'UTC'})}\n${d.measurement.maxWind} kn\n${d.measurement.minPressure > 0 ? d.measurement.minPressure : '---'} ㏔` });

            circles
              .attr('class', 'measurement')
              .attr('r', 3)
              .attr('cx', d => projection(d.coordinate)[0])
              .attr('cy', d => projection(d.coordinate)[1])
              .style('fill', d => colorScale(d.measurement.systemStatus))
              .select('title')
              .text(d => { console.log('d', d); return `${d.name}\n${hurricaneTypes[d.measurement.systemStatus]}\n${format(utcToZonedTime(new Date(d.measurement.dateTime), 'UTC'), 'MM/dd/yyyy HH:mm', { timeZone: 'UTC'})}\n${d.measurement.maxWind} kn\n${d.measurement.minPressure > 0 ? d.measurement.minPressure : '---'} ㏔` });
            
            circles.exit().remove();
          },
          exit => exit.remove()
        );
    });
  });
});

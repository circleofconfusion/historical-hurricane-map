#!/usr/bin/env python3

import sys
from geojson import FeatureCollection, Feature, LineString, dumps
from datetime import datetime
import pytz

def main():
  infileName = sys.argv[1]
  outfileName = sys.argv[2]
  infile = open(infileName)
  outfile = open(outfileName, 'w')

  features = []
  hurricaneProps = None
  coordinatesList = None
  
  for line in infile:
    if line[0].isnumeric():
      # hurricane measurement

      data = createMeasurementDict(line)
      hurricaneProps['measurements'].append(data['props'])
      coordinatesList.append(data['coordinates'])

    else:
      # hurricane heading

      # If there was a previous working hurricane, turn it into a feature and append to features
      if hurricaneProps is not None:
        features.append(Feature(properties=hurricaneProps, geometry=LineString(coordinatesList)))

      # Start a new 
      hurricaneProps = createPropsDict(line)
      coordinatesList = []

  outfile.write(dumps(FeatureCollection(features)))

def createPropsDict(line):
  info, name, count, unused = line.strip().split(",")
  basin = info[0:2]
  cycloneNumber = int(info[2:4])
  year = int(info[4:8])
  name = name.strip()
  count = int(count.strip())
  return {
    'basin': basin,
    'cycloneNumber': cycloneNumber,
    'year': year,
    'name': name,
    'measurementCount': count,
    'measurements': []
  }

def createMeasurementDict(line):
  dateString, timeString, recordIdentifier, systemStatus, latitude, longitude, maxWind, minPressure, radii = line.strip().split(",", 8)
  year = int(dateString[0:4])
  month = int(dateString[4:6])
  day = int(dateString[6:8])
  hour = int(timeString.strip()[0:2])
  minute = int(timeString.strip()[2:4])
  dateTime = datetime(year, month, day, hour, minute, tzinfo=pytz.utc)
  lat = float(latitude.strip()[0:-1])
  if latitude[-1] == 'S':
    lat *= -1
  lon = float(longitude.strip()[0:-1])
  if longitude[-1] == 'W':
    lon *= -1
  return {
    'props': {
      'recordIdentifier': recordIdentifier.strip(),
      'systemStatus': systemStatus.strip(),
      'dateTime': dateTime.isoformat(),
      'maxWind': int(maxWind.strip()),
      'minPressure': int(minPressure.strip())
    },
    'coordinates': (lon,lat)
  }

if __name__ == '__main__':
  main()
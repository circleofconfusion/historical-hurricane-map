#!/usr/bin/env python3

import sys
import argparse
from geojson import FeatureCollection, Feature, LineString, dumps
from datetime import datetime
import pytz

def main():
  parser = argparse.ArgumentParser(description='Convert HurDat database to geojson')
  parser.add_argument('-i', required=True, help='HurDat input file')
  parser.add_argument('-o', required=True, help='GeoJSON output file')
  args = parser.parse_args()
  
  infileName = args.i
  outfileName = args.o

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

  # We know it's a hurricane, be more specific
  systemStatus = systemStatus.strip()
  maxWind = int(maxWind.strip())
  if systemStatus == 'HU':
    if maxWind <= 82:
      systemStatus = 'C1'
    elif maxWind <= 95:
      systemStatus = 'C2'
    elif maxWind <= 112:
      systemStatus = 'C3'
    elif maxWind <= 136:
      systemStatus = 'C4'
    elif maxWind > 136:
      systemStatus = 'C5'
  
  # We don't really care about subtropical vs tropical storm
  if systemStatus == 'SS':
    systemStatus = 'TS'
  if systemStatus == 'SD':
    systemStatus = 'TD'

  return {
    'props': {
      'recordIdentifier': recordIdentifier.strip(),
      'systemStatus': systemStatus,
      'dateTime': dateTime.isoformat(),
      'maxWind': maxWind,
      'minPressure': int(minPressure.strip())
    },
    'coordinates': (lon,lat)
  }

if __name__ == '__main__':
  main()
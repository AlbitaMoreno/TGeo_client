import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import geoLocation from '../../../data/locationCoord.json';

/**
 * GeocodingService class.
 * https://developers.google.com/maps/documentation/javascript/
 */
@Injectable()
export class GeocodingService {
  constructor(private http: HttpClient) {}
  /**
   * @description Servicio encargado de buscar las
   * coordenadas asociadas a una localizacion (string)
   * @param location string, localización
   * @returns coordenadas asociadas según la
   * API de google
   */
  getLocation = async (location: string) => {
    console.log(location);
    return await this.http
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=`
      )
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch((error) => Promise.resolve(error));
  };

  saveLocations(locationList) {
    const blob = new Blob([JSON.stringify(locationList)], {
      type: 'application/json',
    });
    saveAs(blob, '../../../data/locationCoord.json');
  }

  getGeolocationFromFile() {
    return geoLocation;
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Geolocation from '../../../data/geolocation.json';
import GeolocationScores from '../../../data/geolocation_scores.json';

@Injectable({
  providedIn: 'root',
})
export class TwitterServiceService {
  api_url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMeanAndColor(list) {
    let mean = 0,
      max = 0;
    for (const item of list) {
      if (item.score.score > max) max = item.score.score;
      mean += item.score.score;
    }
    mean = mean ? (mean = mean / list.length) : mean;
    let result = [];
    for (const item of list) {
      item.score.color = this._getSentimentColor(item.score.comparative);
      result.push(item);
    }
    return result;
  }

  async getTweets(key_word) {
    let params = new HttpParams();
    params.append('key_word', key_word);
    return await this.http
      .get<any[]>(this.api_url + '/tweets', {
        params: params,
      })
      .toPromise();
  }
  _getSentimentColor(comparative) {
    switch (true) {
      case comparative >= 0 && comparative <= 1:
        return 'green-dot';
      case comparative === 0:
        return 'yellow-dot';
      case comparative <= 0 && comparative >= -1:
        return 'red-dot';
      default:
        return 'yellow-dot'; //_--> return default neutral value
    }
  }

  getSentimentMeanFromFile() {
    let object: any = [],
      mean = 0,
      max = 0;
    object = GeolocationScores;
    for (const item of object) {
      if (item.sentiment.score > max) max = item.sentiment.score;
      mean += item.sentiment.score;
    }
    mean = mean ? (mean = mean / object.length) : mean;

    return mean / max;
  }

  getTweetsFromFile() {
    let object: any = [];
    object = GeolocationScores;
    return object;
  }
}

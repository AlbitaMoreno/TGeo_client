import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {} from 'googlemaps';

import { GeocodingService } from './geocode.service';
import { TwitterServiceService } from './twitter-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;

  /**
   * @type Boolean
   * Variable de control para mostrar o no componentes dependiendo del
   * estado de la búsqueda
   */
  searched: Boolean = false;
  /**
   * @type FormControl
   * Palabra/s por las que se realizará la búsqueda en Twitter
   */
  key_word: FormControl;
  /**
   * @type Array<any>
   * Array de tweets
   */
  tweets: any;
  /**
   * @type Array<any>
   * Array de usuarios
   */
  userList: any;
  /**
   * @type Array<any>
   * Array de usuarios
   */
  langMap = new Map();
  /**
   * @type Boolean
   * Variable de control para mostrar o no el icono loading
   */
  loading: Boolean = false;
  /**
   * @type Array<any>
   * Array de usuarios con las coordenadas de geolocalización
   * para los markers del mapa
   */
  geoApiResponseList: Array<any> = [];

  markerList: Array<google.maps.Marker> = [];

  constructor(
    private twitterService: TwitterServiceService,
    private geocoding: GeocodingService
  ) {}

  async ngOnInit() {
    this.key_word = new FormControl();
    await this.handleClickWithFile();
    this.renderMap();
  }

  /**
   * Carga el mapa de google
   */
  loadMap = () => {
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: { lat: 40.4381311, lng: -3.8196196 },
      zoom: 4,
    });

    for (const [index, iterator] of this.geoApiResponseList.entries()) {
      const marker = new window['google'].maps.Marker({
        position: iterator.location,
        map: map,
        title: this.tweets[index].tweet.text,
        animation: window['google'].maps.Animation.DROP,
      });
      marker.setIcon(
        `http://maps.google.com/mapfiles/ms/icons/${this.tweets[index].score.color}.png`
      );

      this.markerList.push(marker);
    }

    this.markerList.map((element, index) => {
      const contentString = `<div id="content">
        <div>
        </div>
        <h5>${element.getTitle()}</h5>
        </div>`;
      const infowindow = new window['google'].maps.InfoWindow({
        content: contentString,
      });
      element.addListener('click', function () {
        infowindow.open(map, element);
      });
    });
  };

  /**
   * @description Función usada para renderizar un mapa de Google
   */
  renderMap = () => {
    window['initMap'] = () => {
      this.loadMap();
    };
    if (!window.document.getElementById('google-map-script')) {
      var s = window.document.createElement('script');
      s.id = 'google-map-script';
      s.type = 'text/javascript';
      s.src =
        'https://maps.googleapis.com/maps/api/js?key=&callback=initMap';

      window.document.body.appendChild(s);
    } else {
      this.loadMap();
    }
  };

  /**
   * Una vez clickamos en buscar este método es el encargado de llamar al servicio
   * que traerá de Twitter los resultados pertinentes
   */
  async handleClickWithFile() {
    this.loading = true;
    this.searched = false;

    const twitterInfo = this.twitterService.getTweetsFromFile();
    this.userList = twitterInfo.includes.users;
    this.tweets = this.twitterService.getMeanAndColor(twitterInfo);
    this.geoApiResponseList = this.geocoding.getGeolocationFromFile();

    this.tweets.forEach((element) => {
      let item = this.langMap.has(element.tweet.lang.toUpperCase());
      if (item) {
        let value = this.langMap.get(element.tweet.lang.toUpperCase()) + 1;
        this.langMap.set(element.tweet.lang.toUpperCase(), value);
      } else {
        const language = element.tweet.lang.toUpperCase();
        this.langMap.set(language, 1);
      }
    });
    this.loading = false;
    this.searched = true;
  }

  /**
   * @description Método encargado de gestion el evento click
   * en el botón de búsqueda
   */
  handleClick = async () => {
    this.loading = true;
    this.searched = false;
    const twitterInfo = await this.twitterService.getTweets(this.key_word);
    //@ts-ignore
    this.userList = twitterInfo.includes.users;
    this.tweets = this.twitterService.getMeanAndColor(twitterInfo);

    await this.generateLocations();
    this.generateLanguageMap();

    this.loading = false;
    this.searched = true;
  };

  generateLocations = async () => {
    for (const user of this.userList) {
      if (user.location) {
        let location = user.location.replace(/\s+/g, '+');
        await this.geocoding.getLocation(location).then((result) => {
          if (result.status !== 'ZERO_RESULTS') {
            if (result.results) {
              console.log(result.results[0].geometry);
              if (result.results[0].geometry) {
                this.geoApiResponseList.push(result.results[0].geometry);
              }
            }
          }
        });
      }
    }
  };

  generateLanguageMap = () => {
    this.tweets.forEach((element) => {
      let item = this.langMap.has(element.tweet.lang.toUpperCase());
      if (item) {
        let value = this.langMap.get(element.tweet.lang.toUpperCase()) + 1;
        this.langMap.set(element.tweet.lang.toUpperCase(), value);
      } else {
        const language = element.tweet.lang.toUpperCase();
        this.langMap.set(language, 1);
      }
    });
  };
}

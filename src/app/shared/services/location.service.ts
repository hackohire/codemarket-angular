import { Injectable, NgZone, ElementRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private geoCoder;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  setLocaionSearhAutoComplete(searchElement: ElementRef, locationFormGroup: AbstractControl) {
    /** load Places Autocomplete */
    this.mapsAPILoader.load().then(() => {

      if (!locationFormGroup.get('latitude').value && !locationFormGroup.get('longitude').value) {
        this.setCurrentLocation(locationFormGroup);
      }
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(searchElement.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          /** get the place result */
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          /** verify result */
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          /** set latitude, longitude and zoom */
          locationFormGroup.get('latitude').setValue(place.geometry.location.lat(), {emitEvent: true});
          locationFormGroup.get('longitude').setValue(place.geometry.location.lng(), {emitEvent: true})
          // this.zoom = 12;
          this.getAddress(locationFormGroup);
        });
      });
    });
  }

  /** Get Current Location Coordinates */
  setCurrentLocation(locationFormGroup: AbstractControl) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        locationFormGroup.get('latitude').setValue(position.coords.latitude);
        locationFormGroup.get('longitude').setValue(position.coords.longitude)
        // this.latitude = position.coords.latitude;
        // this.longitude = position.coords.longitude;
        // this.zoom = 15;
        this.getAddress(locationFormGroup);
      });
    }
  }

  markerDragEnd($event, locationFormGroup: AbstractControl) {
    console.log($event);
    locationFormGroup.get('latitude').setValue($event.coords.lat);
    locationFormGroup.get('longitude').setValue($event.coords.lng)
    // this.latitude = $event.coords.lat;
    // this.longitude = $event.coords.lng;
    this.getAddress(locationFormGroup);
  }

  getAddress(locationFormGroup: AbstractControl) {
    this.geoCoder.geocode({ 'location': { lat: locationFormGroup.get('latitude').value, lng: locationFormGroup.get('longitude').value } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          // this.zoom = 12;
          locationFormGroup.get('address').setValue(results[0].formatted_address);
          // this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
}

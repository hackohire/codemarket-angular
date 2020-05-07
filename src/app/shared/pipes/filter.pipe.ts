import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode } from '../../auth/sign-up/country-code';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: CountryCode[], searchText: string): CountryCode[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( code => {
      return code.name.toLowerCase().includes(searchText);
    });
   }
}
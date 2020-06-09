import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getName'
})
export class GetNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const name = value.split("_");
    return name[0];
  }

}

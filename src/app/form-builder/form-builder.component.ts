import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {

  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  public form: Object = {components: []};
  onChange(event) {
    this.jsonElement.nativeElement.innerHTML = '';
    this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
  }

  constructor() { }

  ngOnInit() {
  }

}

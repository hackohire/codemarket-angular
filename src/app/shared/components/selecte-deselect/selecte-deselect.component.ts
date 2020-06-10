import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { FormioCustomComponent } from 'angular-formio';

@Component({
  selector: 'app-selecte-deselect',
  templateUrl: './selecte-deselect.component.html',
  styleUrls: ['./selecte-deselect.component.scss']
})
export class SelecteDeselectComponent implements FormioCustomComponent<any[]>, OnInit {

  _businessAreas: any[];
  set businessAreas(v: any[]) {
    this._businessAreas = v;
  }

  get businessAreas() {
    return this._businessAreas;
  }
  selectedBusinessAreas = [];
  addBusinessAreaString = '';
  @Input() formControl: FormControl;

  @Input()
  value: any[];

  @Output()
  valueChange = new EventEmitter<any[]>();

  @Input()
  disabled: boolean;

  constructor(
    private formService: FormService,
  ) {
    this.formService.findFromCollection('', 'tags', 'business-area').subscribe((b) => {
      if (b && b.length) {
        this.businessAreas = b;
      }
    });
  }

  ngOnInit() {
  }

  updateValue(payload) {
    this.value = payload; // Should be updated first
    this.valueChange.emit(payload); // Should be called after this.value update
  }

  addSelectedBusinessAreas(ba) {
    const i = this.businessAreas && this.businessAreas.length ?
      this.businessAreas.findIndex(b => b._id === ba._id) : -1;
    if (i > -1) {
      this.businessAreas.splice(i, 1);
      this.selectedBusinessAreas.push(ba);
    }

    this.value = this.selectedBusinessAreas;
    this.valueChange.emit(this.selectedBusinessAreas);

    // this.postForm.get('businessAreas').setValue(this.selectedBusinessAreas);
    console.log(this.selectedBusinessAreas);
    console.log(this.businessAreas);
  }

  removeSelectedBusinessAreas(ba) {
    const i = this.selectedBusinessAreas && this.selectedBusinessAreas.length ?
      this.selectedBusinessAreas.findIndex(b => b._id === ba._id) : -1;
    if (i > -1) {
      this.selectedBusinessAreas.splice(i, 1);
      this.businessAreas.push(ba);
    }
    this.value = this.selectedBusinessAreas;
    this.valueChange.emit(this.selectedBusinessAreas);

    // this.postForm.get('businessAreas').setValue(this.selectedBusinessAreas);
    console.log(this.selectedBusinessAreas);
    console.log(this.businessAreas);
  }

}

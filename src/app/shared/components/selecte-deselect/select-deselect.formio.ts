import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import { SelecteDeselectComponent } from './selecte-deselect.component';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'selectdeselect', // custom type. Formio will identify the field with this type.
  selector: 'app-select-deselect', // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Select Deselect', // Title of the component
  group: 'basic', // Build Group
  icon: 'fa fa-star', // Icon
  // fieldOptions: ['label', 'values', 'key'],
//  template: 'input', // Optional: define a template for the element. Default: input
//  changeEvent: 'valueChange', // Optional: define the changeEvent when the formio updates the value in the state. Default: 'valueChange',
//  editForm: Components.components.textfield.editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
//  documentation: '', // Optional: define the documentation of the field
//  weight: 0, // Optional: define the weight in the builder group
//  schema: {}, // Optional: define extra default schema for the field
//  extraValidators: [], // Optional: define extra validators  for the field
//  emptyValue: null, // Optional: the emptyValue of the field
//  fieldOptions: ['values'], // Optional: explicit field options to get as `Input` from the schema (may edited by the editForm)
};

export function registerSelecteDeselectComponent(injector: Injector) {
  registerCustomFormioComponent(COMPONENT_OPTIONS, SelecteDeselectComponent, injector);
}

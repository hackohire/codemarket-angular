import { Component, OnInit } from '@angular/core';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-programlist',
  templateUrl: './programlist.component.html',
  styleUrls: ['./programlist.component.scss']
})
export class ProgramlistComponent implements OnInit {

  formData: any;
  formId: string;

  constructor(
    private formBuilderService: FormBuilderService,
    private activatedRoute: ActivatedRoute
  ) {
    this.formId = this.activatedRoute.snapshot.params['formId'];
  }

  ngOnInit() {
    this.formBuilderService.fetchFormDataByFormId(this.formId, true).subscribe(f => {
      if (f) {
        this.formData = f;
      }
    });
  }

}

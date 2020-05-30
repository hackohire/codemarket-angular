import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { AuthService } from '../../core/services/auth.service';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { Email } from '../../shared/models/email.model';
import { EmailService } from '../email.service';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import Swal from 'sweetalert2';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  breadcumb: BreadCumb;
  emailForm: FormGroup;
  sendEmailForm: FormGroup;
  saveEmailForm: FormGroup;

  file;
  onlySaveFile;
  public formdata = new FormData();

  get createdBy() {
    return this.emailForm.get('createdBy');
  }

  get descriptionFormControl() {
    return this.emailForm.get('description');
  }

  get descriptionHTMLFormControl() {
    return this.emailForm.get('descriptionHTML');
  }

  get companyFormControl() {
    return this.emailForm.get('company');
  }

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  subscription$: Subscription;

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private changeDetector: ChangeDetectorRef,
    private postService: PostService
  ) {

    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: 'Send Email',
      path: [
        {
          name: 'send email'
        }
      ]
    };
  }

  ngOnInit() {
    this.emailFormInitialization(null);

    this.emailService.getPostsByType("contact").subscribe(e => {
      console.log(e)
    });

  }

  emailFormInitialization(i: Email) {
    this.saveEmailForm = new FormGroup({
      csvfile: new FormControl('', Validators.required),
      label: new FormControl('', Validators.required),
      companies: new FormControl('', Validators.required),
    });

    this.emailForm = new FormGroup({
      csvfile: new FormControl('', Validators.required),
      label: new FormControl('', Validators.required),
      companies: new FormControl('', Validators.required),
    });

    this.sendEmailForm = new FormGroup({
      batches: new FormControl('', Validators.required),
      companies: new FormControl('', Validators.required),
      emailTemplate: new FormControl(''),
      subject: new FormControl('', Validators.required),
      from: new FormControl('', Validators.required)
    })
  }

  saveFile() {
    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }
    
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      this.csvToJSON(fileReader.result, 'save', (result) => {
        console.log("This is result", result);
        this.emailService.saveCsvFileData(result, this.authService.loggedInUser._id, this.onlySaveFile.name, this.saveEmailForm.value.label, this.saveEmailForm.value.companies).subscribe((data) => {
         console.log("Response of the file read ==> " , data);
        });
      })
    }
    fileReader.readAsText(this.onlySaveFile);
  }

  cleanFile() {
    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }
    
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      this.csvToJSON(fileReader.result, 'saveClean', (result) => {
        console.log("This is result", result);
        this.emailService.getCsvFileData(result, this.authService.loggedInUser._id, this.file.name, this.emailForm.value.label, this.emailForm.value.companies).subscribe((data) => {
         console.log("Response of the file read ==> " , data);
        });
      })
    }
    fileReader.readAsText(this.file);
  }

  uploadFile(event, action) {
    if (action === 'save') {
      this.onlySaveFile = event.target.files[0];
      console.log(this.onlySaveFile);
      if (this.onlySaveFile.name.split(".")[1] !== 'csv') {
        Swal.fire(`Invalid File Type`, '', 'error').then(() => {
          this.emailForm.get('csvfile').setValue('');
          this.file = '';
        });
       }
    } else {
      this.file = event.target.files[0];
      console.log(this.file);
      if (this.file.name.split(".")[1] !== 'csv') {
       Swal.fire(`Invalid File Type`, '', 'error').then(() => {
         this.emailForm.get('csvfile').setValue('');
         this.file = '';
       });
      }
    }
  }

  csvToJSON(csv, action, callback) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j <= headers.length; j++) {
            obj[headers[j]] = currentline[j];
            if (action === 'saveClean') {
              obj['email'] = JSON.parse(currentline[headers.indexOf('email')])
            }
        }
        result.push(obj);
    }
    if (callback && (typeof callback === 'function')) {
        return callback(result);
    }
    return result;
}

  async submit() {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.changeDetector.detectChanges();

    this.sendEmailForm.get('emailTemplate').setValue(this.descriptionEditor.html);
   
    console.log(this.sendEmailForm.value);
    this.emailService.getEmailData(this.sendEmailForm.value.batches, this.sendEmailForm.value.emailTemplate, this.sendEmailForm.value.subject, this.authService.loggedInUser._id, this.sendEmailForm.value.from, this.sendEmailForm.value.companies).subscribe((data) => {
      console.log("Response of the email Data ==> " , data);
     }, (err) => {
      Swal.fire(`Invalid Data`, '', 'error').then(() => {
      });
     });
  }

}

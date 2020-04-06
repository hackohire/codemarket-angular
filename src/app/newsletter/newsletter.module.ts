import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsletterComponent } from './newsletter.component';

@NgModule({
  declarations: [NewsletterComponent],
  imports: [
    CommonModule
  ]
})
export class NewsletterModule { }

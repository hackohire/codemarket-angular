import { NgModule } from '@angular/core';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatCardModule,
  MatDialogModule,
  MatToolbarModule,
  MatChipsModule,
  MatDatepickerModule,
  MatSidenavModule,
  MatTabsModule,
} from '@angular/material';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [],
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatTableModule,
    MatSidenavModule,
    MatTabsModule
  ],
  exports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatTableModule,
    MatSidenavModule,
    MatTabsModule
  ]
})
export class MaterialModule {}
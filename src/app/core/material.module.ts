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
  MatSortModule,
  MatProgressBarModule,
  MatMenuModule,
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
    MatTabsModule,
    MatSortModule,
    MatProgressBarModule,
    MatMenuModule

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
    MatTabsModule,
    MatSortModule,
    MatProgressBarModule,
    MatMenuModule
  ]
})
export class MaterialModule {}
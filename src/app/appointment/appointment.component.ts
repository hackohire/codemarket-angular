import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PostService } from '../shared/services/post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  public appointmentList = [];
  public anonymousAvatar = '../../assets/images/anonymous-avatar.jpg';
  public s3FilesBucketURL = environment.s3FilesBucketURL;
  displayedColumns: string[] = ['profileImg', 'fullName', 'name', 'descriptionHTML', 'appointment_date', 'status', 'edit'];
  dataSource = new MatTableDataSource();
  totalAppointmentCount = 0;
  paginator: MatPaginator;

  constructor(
    private _postService: PostService
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getPostByPostType();
  }

  getPostByPostType() {
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: {order: ''}};
    this._postService.getPostByPostType('appointment', '', paginationObj).subscribe((data) => {
      this.dataSource.data = data.posts;
      this.totalAppointmentCount = data.total;
    });
  }
}
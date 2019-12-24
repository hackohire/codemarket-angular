import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { MatButton, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})

export class VideoChatComponent {
  // @ViewChild('localVideo', { static: false }) localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('callButton', { static: false }) callButton: MatButton;
  @ViewChild('answerButton', { static: false }) answerButton: MatButton;
  @ViewChild('rejectButton', { static: false }) rejectButton: MatButton;

  breadcumb: BreadCumb;
  navLinks = [];
  anonymousAvatar = '../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  constraints;
  stream: MediaStream;
  ongoingCallObj: any;

  offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<VideoChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

    console.log(this.data);

    if (this.data.call) {
      // this.remoteVideo.nativeElement.srcObject = this.data.call.stream;
    }

    if (this.data.authorId) {
    }

    if (this.data.peer) {
      this.data.peer.on('disconnected', () => {
        this.removeAllMediaStreams();
      });
      // this.remoteVideo.nativeElement.srcObject = this.data.mediaStream;
    }

    this.breadcumb = {
      title: 'Profile',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile'
        }
      ]
    };


    this.constraints = { audio: true, video: true };
  }

  async call() {

    if (isPlatformBrowser(this.platformId)) {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      // this.remoteVideo.nativeElement.srcObject = this.stream;
      this.ongoingCallObj = this.data.peer.call(this.data.authorId, this.stream);

      this.ongoingCallObj.on('stream', (stream) => {
        // this.stream = stream;
        this.remoteVideo.nativeElement.srcObject = stream;
        console.log(stream);
      });

      this.ongoingCallObj.on('close', () => {
        this.hangUp();
      });
    }
  }

  async answer() {

    if (isPlatformBrowser(this.platformId)) {

      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);

      this.data.call.answer(this.stream);

      this.data.call.on('stream', (stream) => {
        // Display the stream of the other user in the peer-camera video element !
        // this.stream = stream;
        this.remoteVideo.nativeElement.srcObject = stream;
      });

      // Handle when the call finishes
      this.data.call.on('close', () => {
        alert('The videocall has finished');
        this.hangUp();
        // this.hangUp();
      });

    }

  }

  async hangUp() {
    console.log('Ending call');
    // if (this.pc) {
    //   this.pc.close();
    //   this.pc = null;
    // }

    if (this.data.call) {
      this.data.call.close();
    }

    if (this.ongoingCallObj) {
      this.ongoingCallObj.close();
    }

    this.removeAllMediaStreams();
  }


  removeAllMediaStreams() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
        console.log(track);
      });
    }

    this.stream = null;

    if (this.remoteVideo && this.remoteVideo.nativeElement.srcObject) {
      this.remoteVideo.nativeElement.srcObject = null;
    }

    this.dialogRef.close();
  }

  async screenShare() {

    if (isPlatformBrowser(this.platformId)) {
      const videoTrack = this.stream.getVideoTracks()[0];

      // @ts-ignore
      navigator.mediaDevices.getDisplayMedia({ video: true }).then((screenStream: MediaStream) => {

        const screen = screenStream.getVideoTracks()[0];
        // this.remoteVideo.nativeElement.srcObject = a;

        if (this.data.call) {
          console.log(this.data.call.peerConnection.getSenders());
          const sender = this.data.call.peerConnection.getSenders().find((s) => {
            return s.track.kind === videoTrack.kind;
          });
          sender.replaceTrack(screen);
        } else {
          console.log(this.data.peer.connections[this.data.authorId][0].peerConnection.getSenders());
          const sender = this.data.peer.connections[this.data.authorId][0].peerConnection.getSenders().find((s) => {
            return s.track.kind === videoTrack.kind;
          });
          sender.replaceTrack(screen);
        }
      });
    }
    // this.stream = a;
    // this.data.call.answer(this.stream);
    // console.log(a);
    // adapter.browserShim.shimGetDisplayMedia(this.constraints).then((d) => {
    //   console.log(d);
    // });
  }




}

import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { MatButton, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core/services/auth.service';
import { WebsocketService } from '../shared/services/websocket.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss'],
  // providers: [MatDialogRef]
})

export class VideoChatComponent implements OnInit {
  @ViewChild('localVideo', { static: false }) localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('startButton', { static: false }) startButton: MatButton;
  @ViewChild('callButton', { static: false }) callButton: MatButton;
  @ViewChild('answerButton', { static: false }) answerButton: MatButton;
  @ViewChild('rejectButton', { static: false }) rejectButton: MatButton;

  breadcumb: BreadCumb;
  navLinks = [];
  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;

  constraints;
  stream: MediaStream;
  pc: RTCPeerConnection;
  candidate: RTCIceCandidate;

  offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };

  constructor(
    public authService: AuthService,
    private webSocketService: WebsocketService,
    public dialogRef: MatDialogRef<VideoChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    console.log(this.data);
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

    this.webSocketService.subject.subscribe(async (d: any) => {
      // console.log(d);
    });

    this.constraints = { audio: true, video: true };
    // const configuration = { iceServers: [{ urls: 'stuns:stun.example.org' }] };

    this.webSocketService.subject.subscribe(async (d: any) => {
      try {
        if (d.channel) {
          if (!this.pc) {
            this.pc = new RTCPeerConnection();
            this.onicecandidate();
            // this.onnegotiationneeded();
            this.ontrack();
          }
          // if we get an offer, we need to reply with an answer
          if (d.channel.type === 'offer') {

            this.answerButton.disabled = false;
            fromEvent(this.answerButton._elementRef.nativeElement, 'click').subscribe(async () => {
              await this.pc.setRemoteDescription(d.channel);
              this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);

              this.stream.getTracks().forEach((track) => this.pc.addTrack(track, this.stream));

              await this.pc.setLocalDescription(await this.pc.createAnswer());
              await this.pc.addIceCandidate(this.candidate);

              this.webSocketService.update({
                sender: this.authService.loggedInUser._id,
                // receiver: this.authorId,
                channel: this.pc.localDescription
              });
            });
          } else if (d.channel.type === 'answer') {

            await this.pc.setRemoteDescription(d.channel);

          } else {
            console.log('Unsupported SDP type.');
          }
        } else if (d.candidate) {
          if (!this.pc) {
            this.pc = new RTCPeerConnection();
          }
          this.candidate = d.candidate;
          // await this.pc.addIceCandidate(d.candidate);

        } else if (d.message === 'hangUp' && d.sender !== this.authService.loggedInUser._id) {
          this.hangUp();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  async call() {

    this.webSocketService.subject.next({ action: 'calling', userId: this.data.authorId, sender: this.authService.loggedInUser._id });

    this.pc = new RTCPeerConnection();
    this.onicecandidate();
    // this.onnegotiationneeded();
    this.ontrack();


    this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    this.stream.getTracks().forEach((track) => this.pc.addTrack(track, this.stream));
    // this.localVideo.nativeElement.srcObject = this.stream;
    this.remoteVideo.nativeElement.srcObject = this.stream;

    this.onnegotiationneeded();
  }

  async hangUp() {
    console.log('Ending call');
    if (this.pc) {
      this.pc.close();
      this.pc = null;

      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }

      this.rejectButton.disabled = true;
      this.webSocketService.update({
        sender: this.authService.loggedInUser._id,
        // receiver: this.authorId,
        message: 'hangUp'
      });

      this.dialogRef.close();
    }
    // this.callButton.nativeElement.disabled = false;
  }

  // call start() to initiate
  async start() {
    try {

      // get local stream, show it in self-view and add it to be sent
      this.pc = new RTCPeerConnection();
      this.onicecandidate();
      // this.onnegotiationneeded();
      this.ontrack();

      const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      stream.getTracks().forEach((track) => this.pc.addTrack(track, stream));
      // this.localVideo.nativeElement.srcObject = stream;
      this.remoteVideo.nativeElement.srcObject = stream;

    } catch (err) {
      console.error(err);
    }
  }

  onicecandidate() {
    // send any ice candidates to the other peer
    this.pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        this.webSocketService.update({
          sender: this.authService.loggedInUser._id,
          // receiver: this.authorId,
          candidate
        });
      }
    };
  }

  async onnegotiationneeded() {
    // let the "negotiationneeded" event trigger offer generation
    // this.pc.onnegotiationneeded = async (e) => {
    try {

      // console.log(e);
      /* Your async/await-using code goes here */
      await this.pc.setLocalDescription(await this.pc.createOffer());

      // send the offer to the other peer
      this.webSocketService.update({
        sender: this.authService.loggedInUser._id,
        // receiver: this.authorId,
        channel: this.pc.localDescription
      });

    } catch (err) {
      console.error(err);
    }
    // };
  }

  ontrack() {
    // once remote track media arrives, show it in remote video element
    this.pc.ontrack = (event) => {
      // don't set srcObject again if it is already set.
      if (this.remoteVideo.nativeElement.srcObject) {

      } else {
        this.remoteVideo.nativeElement.srcObject = event.streams[0];
      }
    };
  }

  ngOnInit() {

  }




}

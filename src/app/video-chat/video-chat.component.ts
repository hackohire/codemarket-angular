import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatButton } from '@angular/material';
import { AuthService } from '../core/services/auth.service';
import { ChatService } from '../shared/services/chat.service';
import * as Video from 'twilio-video';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})

export class VideoChatComponent implements OnInit {

    // @ViewChild('localVideo', { static: false }) localVideo: ElementRef<HTMLVideoElement>;
    // @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef<HTMLVideoElement>;
    // @ViewChild('callButton', { static: false }) callButton: MatButton;
    // @ViewChild('answerButton', { static: false }) answerButton: MatButton;
    // @ViewChild('rejectButton', { static: false }) rejectButton: MatButton;
  

  public videoToken: string = "";
  public identity: string = "";
  public activeRoom: any;
  public roomId: string = "";
  public reconnect: number = 0;
  public joinCall: string = "";
  public connectOptions: any;
  public previewTracks: any;
  public roomSID: any;
  public previewContainer: any;
  public tracks: any;
  public start: any = 0;
  public interval: any;
  public endCall: any = false;

  constructor(
    public _authService: AuthService,
    public dialogRef: MatDialogRef<VideoChatComponent>,
    private _chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(this.data);
  }

  ngOnInit() {
    this.identity = this.data.identity;
    this.roomId = this.data.room;
    this.videoCallToken(this.identity);
  }

  videoCallToken(identity: string) {
    this._chatService.createVideoToken(identity).subscribe(data => {
      this.videoToken = data['token'];
      this.identity = data['identity'];
      this.videoCall(this.roomId);
    });
  }

  videoCall(roomId: string) {
    ++this.reconnect;
    this.roomId = roomId;
    if (roomId) {
      this.connectOptions = { name: roomId, logLevel: 'debug' };
      if (this.previewTracks) {
        this.connectOptions.tracks = this.previewTracks;
      }
      Video.connect(this.videoToken, this.connectOptions).then(res => {
        res.localParticipant.audioTracks.forEach(track => {
          track.enable(true);
        });
        this.roomSID = res.sid;
        this.roomJoined(res);
      }, error => {
        if (this.reconnect === 1) {
          this.videoCall(this.roomId);
        } else {
          console.log('Could not connect to Twilio: ' + error.message);
        }
      });
    } else {
      alert('Please enter a room name.');
    }
  }

  roomJoined(room) {
    this.activeRoom = room;
    console.log('Joined as "' + this.identity + '"');
    // Draw local video, if not already previewing
    this.previewContainer = document.getElementById('local-media');
    if (!this.previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, this.previewContainer);
      this.startCountDown(0);
    }

    room.participants.forEach(participant => {
      this.previewContainer = document.getElementById('remote-media');
      this.attachParticipantTracks(participant, this.previewContainer);
    });

    // When a participant joins, draw their video on screen
    room.on('participantConnected', participant => {
      const participantArray = participant.identity.split('_');
    });

    room.on('trackAdded', (track, participant) => {
      if (this.identity !== '' && participant.identity === this.identity) {
        this.previewContainer = document.getElementById('remote-media');
      } else {
        this.previewContainer = document.getElementById('local-media');
      }
      this.attachTracks([track], this.previewContainer);
    });

    room.on('trackRemoved', (track, participant) => {
      this.detachTracks([track]);
    });

    // When a participant disconnects, note in log
    room.on('participantDisconnected', participant => {
      if (this.identity !== '' && participant.identity === this.identity) {
        this.detachParticipantTracks(participant);
        this.activeRoom.disconnect();
      }
    });

    // When we are disconnected, stop capturing local video
    // Also remove media for all remote participants
    room.on('disconnected', () => {
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(participant => this.detachParticipantTracks(participant));
      if (this.endCall === true) {
        this.activeRoom = null;
        this.closeVideocall();
      }
      this.closeVideocall();
    });
  }

  attachParticipantTracks(participant, container) {
    this.tracks = Array.from(participant.tracks.values());
    this.attachTracks(this.tracks, container);
  }

  // An asynchronous timer
  startCountDown(seconds) {
    this.start = seconds;
    this.interval = setInterval(() => {
      this.start++;
      if (this.start < 0) {
        // code here will run when the counter reaches zero.
        clearInterval(this.interval);
      }
    }, 1000);
  }

  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  }

  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }

  detachParticipantTracks(participant) {
    this.tracks = Array.from(participant.tracks.values());
    this.detachTracks(this.tracks);
  }

  closeVideocall() {
    this.dialogRef.close();
  }
}

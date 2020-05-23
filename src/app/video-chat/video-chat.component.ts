import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private cd: ChangeDetectorRef
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
          track.track.enable(true);
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
    // Draw local video, if not already previewing
    this.previewContainer = document.getElementById('local-media');
    if (!this.previewContainer.querySelector('video')) {
      // this.attachParticipantTracks(room.localParticipant, this.previewContainer); old line
      this.attachTracks(this.getTracks(room.localParticipant), this.previewContainer);
      this.startCountDown(0);
    }

    room.participants.forEach(participant => {
      // console.log('Already in Room: "' + participant.identity + '"');
      const participantArray = participant.identity.split('_');

      if (!this.identity || this.identity !== participant.identity) {
        this.previewContainer = document.getElementById('remote-media');
      } else {
        this.previewContainer = document.getElementById('local-media');
      }
      // this.attachParticipantTracks(participant, this.previewContainer); old line
      this.participantConnected(participant, this.previewContainer);
    });

    // When a participant joins, draw their video on screen
    room.on('participantConnected', participant => {
      if (this.identity !== '' && participant.identity === this.identity) {
        this.previewContainer = document.getElementById('remote-media');
      } else {
        this.previewContainer = document.getElementById('local-media');
      }
      // this.attachTracks(this.getTracks(room.localParticipant), this.previewContainer);
      this.participantConnected(participant, this.previewContainer);
    });

    // When a participant disconnects, note in log
    room.on('participantDisconnected', participant => {
      if (this.identity !== '' && this.identity === participant.identity) {
        // console.log('Participant "' + participant.identity + '" left the room');
        this.detachParticipantTracks(participant);
        this.closeVideocall();
        this.activeRoom.disconnect();
      }
      this.detachParticipantTracks(participant);
    });

    // When we are disconnected, stop capturing local video
    // Also remove media for all remote participants
    room.on('disconnected', () => {
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(participant => this.detachParticipantTracks(participant));
      this.activeRoom = null;
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

  // Attach the Track to the DOM.
  attachTrack(track, container) {
    container.appendChild(track.attach());
  }

  // Attach array of Tracks to the DOM.
  attachTracks(tracks, container) {
    tracks.forEach((track) => {
      this.attachTrack(track, container);
    });
  }

  // A new RemoteParticipant joined the Room
  participantConnected(participant, container) {
    let selfContainer = document.createElement('div');
    selfContainer.id = `participantContainer-${participant.identity}`;
    container.appendChild(selfContainer);

    participant.tracks.forEach((publication) => {
      this.trackPublished(publication, selfContainer);
    });
    participant.on('trackPublished', (publication) => {
      this.trackPublished(publication, selfContainer);
    });
    participant.on('trackUnpublished', this.trackUnpublished);
  }

  // A new RemoteTrack was published to the Room.
  trackPublished(publication, container) {
    if (publication.isSubscribed) {
      this.attachTrack(publication.track, container);
    }
    publication.on('subscribed', (track) => {
      // log('Subscribed to ' + publication.kind + ' track');
      this.attachTrack(track, container);
    });
    publication.on('unsubscribed', this.detachTrack);
  }

  // A RemoteTrack was unpublished from the Room.
  trackUnpublished(publication) {
    console.log(publication.kind + ' track was unpublished.');
  }

  // Get the Participant's Tracks.
  getTracks(participant) {
    return Array.from(participant.tracks.values()).filter((publication: any) => {
      return publication.track;
    }).map((publication: any) => {
      return publication.track;
    });
  }

  // Detach given track from the DOM.
  detachTrack(track) {
    track.detach().forEach((element) => {
      element.remove();
    });
  }

  // Detach the Participant's Tracks from the DOM.
  detachParticipantTracks(participant) {
    var tracks = this.getTracks(participant);
    tracks.forEach(this.detachTrack);
  }

  hangUp() {
    this.activeRoom.disconnect();
    this.closeVideocall();
  }

  closeVideocall() {
    this.dialogRef.close();
  }
}

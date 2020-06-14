import { Component, ViewChild, ElementRef, Output, Input, EventEmitter, Renderer2 } from '@angular/core';
import { Participant, RemoteTrack, RemoteAudioTrack, RemoteVideoTrack, RemoteParticipant, RemoteTrackPublication } from 'twilio-video';
import { VideoChatService } from '../video-chat.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent {
  @ViewChild('list', { static: false }) listRef: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef;
  @Output() participantsChanged = new EventEmitter<boolean>();
  @Output() leaveRoom = new EventEmitter<boolean>();
  @Input() activeRoomName: string;

  get participantCount() {
    return !!this.videoChatService.participants ? this.videoChatService.participants.size : 0;
  }

  get isAlone() {
    return this.participantCount === 0;
  }

  // private participants: Map<Participant.SID, RemoteParticipant>;
  private dominantSpeaker: RemoteParticipant;

  constructor(
    private readonly renderer: Renderer2,
    private videoChatService: VideoChatService
  ) { }

  clear() {
    if (this.videoChatService.participants) {
      this.videoChatService.participants.clear();
    }
  }

  initialize(participants: Map<Participant.SID, RemoteParticipant>) {
    this.videoChatService.participants = participants;
    if (this.videoChatService.participants) {
      this.videoChatService.participants.forEach(participant => this.registerParticipantEvents(participant));
    }
  }

  add(participant: RemoteParticipant) {
    if (this.videoChatService.participants && participant) {
      this.videoChatService.participants.set(participant.sid, participant);
      this.registerParticipantEvents(participant);
    }
  }

  remove(participant: RemoteParticipant) {
    if (this.videoChatService.participants && this.videoChatService.participants.has(participant.sid)) {
      this.videoChatService.participants.delete(participant.sid);
    }
  }

  loudest(participant: RemoteParticipant) {
    this.dominantSpeaker = participant;
  }

  onLeaveRoom() {
    this.leaveRoom.emit(true);
  }

  private registerParticipantEvents(participant: RemoteParticipant) {
    if (participant) {
      participant.tracks.forEach(publication => this.subscribe(publication, participant));
      participant.on('trackPublished', publication => this.subscribe(publication, participant));
      participant.on('trackUnpublished',
        publication => {
          if (publication && publication.track) {
            this.detachRemoteTrack(publication.track, participant);
          }
        });
    }
  }

  private subscribe(publication: RemoteTrackPublication | any, participant) {
    if (publication && publication.on) {
      publication.on('subscribed', track => this.attachRemoteTrack(track, participant));
      publication.on('unsubscribed', track => this.detachRemoteTrack(track, participant));
    }
  }

  private attachRemoteTrack(track: RemoteTrack, participant) {
    if (this.isAttachable(track)) {
      const element: HTMLElement = track.attach();
      this.renderer.data.id = track.sid;

      if (track.kind === 'video') {
        this.renderer.setStyle(element, 'width', '100%');
        element.setAttribute('participantsid', participant.sid);
      }
      this.renderer.appendChild(this.listRef.nativeElement, element);
      // this.renderer.setProperty(this.remoteVideo.nativeElement, 'srcObject', element.srcObject);

      this.participantsChanged.emit(true);

      /** Whenever a new participant is added publish its audio track */
      if (track.kind === 'audio') {
        this.videoChatService.newParticipantAdded.next(track.mediaStreamTrack);
      }
    }
  }

  // checkIfParticipantAlreadyThere() {
  //   this.listRef.nativeElement
  // }

  private detachRemoteTrack(track: RemoteTrack, participant) {
    if (this.isDetachable(track)) {
      track.detach().forEach(el => el.remove());
      this.participantsChanged.emit(true);
    }
  }

  private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
      ((track as RemoteAudioTrack).attach !== undefined ||
        (track as RemoteVideoTrack).attach !== undefined);
  }

  private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
      ((track as RemoteAudioTrack).detach !== undefined ||
        (track as RemoteVideoTrack).detach !== undefined);
  }
}

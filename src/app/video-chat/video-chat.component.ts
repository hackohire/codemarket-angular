import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { RoomsComponent } from './rooms/rooms.component';
import { CameraComponent } from './camera/camera.component';
import { SettingsComponent } from './settings/settings.component';
import { ParticipantsComponent } from './participants/participants.component';
import { VideoChatService } from './video-chat.service';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})

export class VideoChatComponent implements OnInit, AfterViewInit {

  @ViewChild('rooms', { static: false }) rooms: RoomsComponent;
  @ViewChild('camera', { static: false }) camera: CameraComponent;
  @ViewChild('settings', { static: false }) settings: SettingsComponent;
  @ViewChild('participants', { static: false }) participants: ParticipantsComponent;

  activeRoom: Room;
  sharableLink: string;
  joined: boolean;

  publishedVideoTrack = null;
  publishedScreenTrack = null;

  // private notificationHub: HubConnection;

  constructor(
    private readonly videoChatService: VideoChatService,
    public matDialogRef: MatDialogRef<VideoChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
  ) { }

  async ngOnInit() {
    // const builder =
    //     new HubConnectionBuilder()
    //         .configureLogging(LogLevel.Information)
    //         .withUrl(`${location.origin}/notificationHub`);

    // this.notificationHub = builder.build();
    // this.notificationHub.on('RoomsUpdated', async updated => {
    //     if (updated) {
    //         await this.rooms.updateRooms();
    //     }
    // });
    // await this.notificationHub.start();

    this.sharableLink = window.location.href + '?video_chat=true';

    /** Whenever localparticipant's stream is changed / updated
     * Notify all the users with updated stream
     */
    this.videoChatService.$localStreamUpdated.subscribe(async (s) => {
      if (s && s.name === 'screen' && this.activeRoom) {
        console.log(this.activeRoom.localParticipant);
        this.activeRoom.localParticipant.tracks.forEach(async (trackPublished) => {
          if (trackPublished.kind === 'video') {
            this.activeRoom.localParticipant.unpublishTrack(trackPublished.track);
          }
          this.publishedScreenTrack = await this.activeRoom.localParticipant.publishTrack(s.track, { name: s.name ? s.name : '' });
        });
      } else if (s && s.name !== 'screen' && this.activeRoom) {
        // Access the already published LocalTracks.
        this.activeRoom.localParticipant.tracks.forEach(async (trackPublished) => {
          if (trackPublished.name === 'screen' || trackPublished.trackName === 'screen') {
            this.activeRoom.localParticipant.unpublishTrack(trackPublished.track);
          }
          this.publishedScreenTrack = await this.activeRoom.localParticipant.publishTrack(s.track);
        });
      }
      console.log(s);
    });
  }

  trackPublished(publication) {
    console.log(`Published LocalTrack: ${publication.track}`);
  }

  ngAfterViewInit() {

  }

  async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
    // await this.camera.initializePreview(deviceInfo);
  }

  async onLeaveRoom(_: boolean) {

    this.closeRoom();

    this.camera.finalizePreview();
    // const videoDevice = this.settings.hidePreviewCamera();
    // this.camera.initializePreview(videoDevice);

    this.participants.clear();
  }

  closeRoom() {
    if (this.activeRoom) {
      this.activeRoom.disconnect();
      this.activeRoom = null;
      this.joined = false;
    }
  }

  async onRoomChanged(roomName: string) {
    if (roomName) {
      if (this.activeRoom) {
        this.joined = false;
        this.activeRoom.disconnect();
      }

      // this.camera.finalizePreview();
      const tracks = await this.settings.showPreviewCamera();

      this.activeRoom = await this.videoChatService.joinOrCreateRoom(roomName, tracks);

      this.participants.initialize(this.activeRoom.participants);
      this.registerRoomEvents();

      if (this.activeRoom) {
        this.joined = true;
      }

      // this.notificationHub.send('RoomsUpdated', true);
    }
  }

  onParticipantsChanged(_: boolean) {
    this.videoChatService.nudge();
  }

  private registerRoomEvents() {
    this.activeRoom
      .on('disconnected',
        (room: Room) => room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track)))
      .on('participantConnected',
        (participant: RemoteParticipant) => this.participants.add(participant))
      .on('participantDisconnected',
        (participant: RemoteParticipant) => this.participants.remove(participant))
      .on('dominantSpeakerChanged',
        (dominantSpeaker: RemoteParticipant) => this.participants.loudest(dominantSpeaker));
  }

  private detachLocalTrack(track: LocalTrack) {
    if (this.isDetachable(track)) {
      track.detach().forEach(el => el.remove());
    }
  }

  private isDetachable(track: LocalTrack): track is LocalAudioTrack | LocalVideoTrack {
    return !!track
      && ((track as LocalAudioTrack).detach !== undefined
        || (track as LocalVideoTrack).detach !== undefined);
  }

  close() {
    this.closeRoom();
    this.matDialogRef.close();
  }

}

import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { RoomsComponent } from './rooms/rooms.component';
import { CameraComponent } from './camera/camera.component';
import { SettingsComponent } from './settings/settings.component';
import { ParticipantsComponent } from './participants/participants.component';
import { VideoChatService } from './video-chat.service';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../shared/models/post.model';
import { User } from '../shared/models/user.model';
import { EmailService } from '../email/email.service';
import { Email } from '../shared/models/email.model';
import { description } from '../shared/constants/fragments_constatnts';
import { appConstants } from '../shared/constants/app_constants';
import { runInDebugContext } from 'vm';

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

  ringIntervalFn = null;

  // private notificationHub: HubConnection;
  isUsercalling: boolean;

  constructor(
    private readonly videoChatService: VideoChatService,
    public matDialogRef: MatDialogRef<VideoChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post, loggedInUser: User, caller?: User, isCallReceiving?: boolean },
    private emailService: EmailService
  ) {

    /** When user receives the call, if user doesn't press the join,
     * Stop the call within 15 seconds
     */
    if (this.data.isCallReceiving) {

      /** Play Ringtone Every interval of 2 seconds */
      const ring = new Audio(appConstants.videoChat.callingTune);
      this.ringIntervalFn = setInterval(() => {
        ring.play();
      }, 2000);

      setTimeout(() => {
        /** Stop Playing Ringtone Interval */
        clearTimeout(this.ringIntervalFn);

        this.data.isCallReceiving = false;

        if (!this.videoChatService.participants || Array.from(this.videoChatService.participants).length < 1) {
          this.close();
        }
      }, appConstants.videoChat.receiverTimout);
    }
  }

  async ngOnInit() {

    this.sharableLink = window.location.origin + '/post/' + this.data.post.slug + '?video_chat=true';

    /** Whenever localparticipant's tries to share the screen it will publish the track and unpublish the video track
     * And when user switch back to the
     */
    this.videoChatService.$localStreamUpdated.subscribe(async (s) => {
      if (s && s.name === 'screen' && this.activeRoom) {

        /** Unpublish Video Track */
        this.activeRoom.localParticipant.tracks.forEach(async (trackPublished) => {
          if (trackPublished.kind === 'video') {
            this.activeRoom.localParticipant.unpublishTrack(trackPublished.track);
          }
        });

        /** Publish Screen Track  */
        this.publishedScreenTrack = await this.activeRoom.localParticipant.publishTrack(s.track, { name: s.name ? s.name : '' });

      } else if (s && s.name !== 'screen' && this.activeRoom) {

        /** Unpublish Screen Track */
        this.activeRoom.localParticipant.tracks.forEach(async (trackPublished) => {
          if (trackPublished.name === 'screen' || trackPublished.trackName === 'screen') {
            this.activeRoom.localParticipant.unpublishTrack(trackPublished.track);
          }
        });

        /** Publish Video Track  */
        this.publishedScreenTrack = await this.activeRoom.localParticipant.publishTrack(s.track);
      }

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

    // this.camera.finalizePreview();
    // const videoDevice = this.settings.hidePreviewCamera();
    // this.camera.initializePreview(videoDevice);

    this.participants.clear();
    this.close();
  }

  closeRoom() {
    if (this.activeRoom) {
      this.activeRoom.disconnect();
      this.activeRoom = null;
      this.joined = false;
    }
  }

  clearRingInterval() {
    if (this.ringIntervalFn) {
      clearTimeout(this.ringIntervalFn);
    }
  }

  async onRoomChanged(roomName: string) {

    if (this.data.isCallReceiving) {
      this.data.isCallReceiving = false;
    }

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
        this.clearRingInterval();
        this.joined = true;
      }

      // this.notificationHub.send('RoomsUpdated', true);
    }
  }

  onParticipantsChanged(_: boolean) {
    this.clearRingInterval();
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

  /** When user tries to make a call to the post author */
  call() {
    const caller = {
      _id: this.data.loggedInUser._id,
      avatar: this.data.loggedInUser.avatar,
      name: this.data.loggedInUser.name,
      slug: this.data.loggedInUser.slug
    };
    const post = {
      _id: this.data.post._id,
      name: this.data.post.name,
      slug: this.data.post.slug,
      createdBy: this.data.post.createdBy._id
    };
    this.isUsercalling = true;

    const ring = new Audio(appConstants.videoChat.callingTune);

    this.videoChatService.call(post, caller).subscribe(a => {
      if (a && !this.activeRoom) {
        /** Create room */
        this.onRoomChanged(this.data.post.slug);

        /** Play Ringtone Every interval of 2 seconds */
        this.ringIntervalFn = setInterval(() => {
          ring.play();
        }, 2000);

        /** When user receives the call, if user doesn't press the join,
         * Stop the call within 15 seconds
         */
        setTimeout(() => {

          this.isUsercalling = false; /** Set the isUserCalling flag to false */
          /** Stop Playing Ringtone Interval */
          clearTimeout(this.ringIntervalFn);
          ring.remove();

          if (!this.videoChatService.participants || Array.from(this.videoChatService.participants).length < 1) {

            /** Send the Post Author an email notification, about the user tried to reach out to him */
            const emailBody: Email = {
              to: [this.data.post.createdBy.email],
              subject: `${this.data.loggedInUser.name} tried calling you`,
              descriptionHTML:
                `<div>
                  <p>${'Dear ' + this.data.post.createdBy.name}</p>
                  <p>${this.data.loggedInUser.name}, Tried to reach out to you to discuss regarding “<a href=${this.sharableLink}><strong>${this.data.post.name}</strong></a>”</p>
                </div>`,
              createdBy: this.data.loggedInUser._id
            };

            this.emailService.sendEmailFromFrontend(emailBody).subscribe(a => {
              console.log(a);
            });

            this.close();
          }
        }, appConstants.videoChat.callerTimeout);
      }
    });
  }

  close() {
    this.clearRingInterval();
    this.closeRoom();
    this.matDialogRef.close();
  }

}

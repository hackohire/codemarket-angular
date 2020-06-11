import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { createLocalTracks, LocalTrack, LocalVideoTrack } from 'twilio-video';
import { VideoChatService } from '../video-chat.service';

@Component({
    selector: 'app-camera',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements AfterViewInit {

    isScreenSharing: boolean;
    isInitializing = true;

    @ViewChild('preview', { static: false }) previewElement: ElementRef;
    @ViewChild('myVideo', { static: false }) myVideo: ElementRef;

    @Input() allowScreenShare = false;

    get tracks(): LocalTrack[] {
        return this.localTracks;
    }

    private videoTrack: LocalVideoTrack;
    private localTracks: LocalTrack[] = [];

    @Output() OnStreamChanges = new EventEmitter();

    constructor(
        private readonly renderer: Renderer2,
        private videoChatService: VideoChatService
    ) { }

    async ngAfterViewInit() {
        if (this.previewElement && this.previewElement.nativeElement) {
            await this.initializeDevice();
        }
    }

    initializePreview(deviceInfo?: MediaDeviceInfo) {
        if (deviceInfo) {
            this.initializeDevice(deviceInfo.kind, deviceInfo.deviceId);
        } else {
            this.initializeDevice();
        }
    }

    finalizePreview() {
        try {
            if (this.videoTrack) {
                this.videoTrack.detach().forEach(element => element.remove());
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async initializeDevice(kind?: MediaDeviceKind, deviceId?: string) {
        try {
            this.isInitializing = true;

            this.finalizePreview();

            this.localTracks = kind && deviceId
                ? await this.initializeTracks(kind, deviceId)
                : await this.initializeTracks();

            this.videoTrack = this.localTracks.find(t => t.kind === 'video') as LocalVideoTrack;
            const videoElement = this.videoTrack.attach();
            this.renderer.setStyle(videoElement, 'height', '100%');
            this.renderer.setStyle(videoElement, 'width', '100%');
            // this.renderer.appendChild(this.previewElement.nativeElement, videoElement);

            this.myVideo.nativeElement.srcObject = videoElement.srcObject;
        } finally {
            this.isInitializing = false;
        }
    }

    private initializeTracks(kind?: MediaDeviceKind, deviceId?: string) {
        if (kind) {
            switch (kind) {
                case 'audioinput':
                    return createLocalTracks({ audio: { deviceId }, video: true });
                case 'videoinput':
                    return createLocalTracks({ audio: true, video: { deviceId } });
            }
        }

        return createLocalTracks({ audio: true, video: true });
    }

    async screenShare() {
        // @ts-ignore
        navigator.mediaDevices.getDisplayMedia().then((stream: MediaStream) => {
            this.isScreenSharing = true;

            const screenTrack = stream.getVideoTracks()[0];
            this.videoTrack = new LocalVideoTrack(screenTrack);
            const videoElement = this.videoTrack.attach();

            this.videoChatService.streamUpdate.next(screenTrack);

            this.renderer.setStyle(videoElement, 'height', '100%');
            this.renderer.setStyle(videoElement, 'width', '100%');
            this.renderer.setProperty(this.myVideo.nativeElement, 'srcObject', videoElement.srcObject);

            this.videoTrack.mediaStreamTrack.onended = ((e) => {
                console.log(e);
                this.stopScreenShare();
            });
        });
    }

    async stopScreenShare(kind?, deviceId?) {
        this.isScreenSharing = false;
        this.localTracks = kind && deviceId
            ? await this.initializeTracks(kind, deviceId)
            : await this.initializeTracks();

        this.videoTrack = this.localTracks.find(t => t.kind === 'video') as LocalVideoTrack;
        const videoElement = this.videoTrack.attach();
        this.renderer.setProperty(this.myVideo.nativeElement, 'srcObject', videoElement.srcObject);

        this.videoChatService.streamUpdate.next(this.videoTrack.mediaStreamTrack);
    }

}

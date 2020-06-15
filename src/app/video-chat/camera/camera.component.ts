import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { createLocalTracks, LocalTrack, LocalVideoTrack } from 'twilio-video';
import { VideoChatService } from '../video-chat.service';

import * as RecordRTC from 'recordrtc';

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
    private screenShareStream: MediaStream;


    isBeingRecorded: boolean;
    private recorder;

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

            // @ts-ignore
            // navigator.mediaDevices.getDisplayMedia().then(async (stream: MediaStream) => {

            //     const recorder = new RecordRTCPromisesHandler(stream, {
            //         type: 'video'
            //     });
            //     recorder.startRecording();

            //     const sleep = m => new Promise(r => setTimeout(r, m));
            //     await sleep(5000);

            //     await recorder.stopRecording();
            //     const blob = await recorder.getBlob();
            //     this.renderer.setProperty(this.myVideo.nativeElement, 'srcObject', URL.createObjectURL(blob));
            // });
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

    invokeGetDisplayMedia(success, error) {
        let displaymediastreamconstraints = {
            video: {
                displaySurface: 'monitor', // monitor, window, application, browser
                logicalSurface: true,
                cursor: 'always' // never, always, motion
            },
            audio: true
        };

        // @ts-ignore
        if (navigator.mediaDevices.getDisplayMedia) {
            // @ts-ignore
            navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
        } else {
            // @ts-ignore
            navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
        }
    }

    invokeMic(success, error) {
        // @ts-ignore
        if (navigator.mediaDevices.getUserMedia) {
            // @ts-ignore
            navigator.mediaDevices.getUserMedia({ audio: true }).then(success).catch(error);
        } else {
            // @ts-ignore
            navigator.getUserMedia({ audio: true }).then(success).catch(error);
        }
    }

    captureScreen(callback) {
        this.invokeGetDisplayMedia((screen) => {
            callback(screen);
        }, (error) => {
            console.error(error);
            alert('Unable to capture your screen. Please check console logs.\n' + error);
        });
    }

    captureMic(callback) {
        this.invokeMic((mic) => {
            callback(mic);
        }, (error) => {
            console.error(error);
            alert('Unable to capture your mic. Please check console logs.\n' + error);
        });
    }

    recordScreen() {
        this.captureScreen((screenStream) => {

            // this.captureMic((mic) => {

            // screenStream.addTrack(mic.getTracks()[0]);

            this.renderer.setProperty(this.myVideo.nativeElement, 'srcObject', screenStream);

            this.recorder = RecordRTC(screenStream, {
                type: 'video'
            });

            this.recorder.startRecording();

            // release screen on stopRecording
            this.recorder.screen = screenStream;

            this.isBeingRecorded = true;
            // });
        });
    }

    stopRecordingCallback = () => {
        this.renderer.setProperty(this.myVideo.nativeElement, 'srcObject', null);
        this.renderer.setProperty(this.myVideo.nativeElement, 'src', URL.createObjectURL(this.recorder.getBlob()));

        this.recorder.screen.stop();
        this.recorder.destroy();
        this.recorder = null;
    }

    stopRecording() {
        this.recorder.stopRecording(this.stopRecordingCallback);
        this.isBeingRecorded = false;
    }

}

import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CameraComponent } from '../camera/camera.component';
import { DeviceSelectComponent } from './device-select/device-select.component';
import { DeviceService } from '../device.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private devices: MediaDeviceInfo[] = [];
  private subscription: Subscription;
  private videoDeviceId: string;

  get hasAudioInputOptions(): boolean {
      return this.devices && this.devices.filter(d => d.kind === 'audioinput').length > 0;
  }
  get hasAudioOutputOptions(): boolean {
      return this.devices && this.devices.filter(d => d.kind === 'audiooutput').length > 0;
  }
  get hasVideoInputOptions(): boolean {
      return this.devices && this.devices.filter(d => d.kind === 'videoinput').length > 0;
  }

  @ViewChild('camera', { static: false }) camera: CameraComponent;
  @ViewChild('videoSelect', { static: false }) video: DeviceSelectComponent;

  @Input() isPreviewing: boolean;
  @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

  constructor(
      private readonly deviceService: DeviceService) { }

  ngOnInit() {
      this.subscription =
          this.deviceService
              .$devicesUpdated
              .pipe(debounceTime(350))
              .subscribe(async deviceListPromise => {
                  this.devices = await deviceListPromise;
                  this.handleDeviceAvailabilityChanges();
              });
  }

  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }

  async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
      if (this.isPreviewing) {
          await this.showPreviewCamera();
      } else {
          this.settingsChanged.emit(deviceInfo);
      }
  }

  async showPreviewCamera() {
      this.isPreviewing = true;

      if (this.videoDeviceId !== this.video.selectedId) {
          this.videoDeviceId = this.video.selectedId;
          const videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
          await this.camera.initializePreview(videoDevice);
      }
      
      return this.camera.tracks;
  }

  hidePreviewCamera() {
      this.isPreviewing = false;
      this.camera.finalizePreview();
      return this.devices.find(d => d.deviceId === this.video.selectedId);
  }

  private handleDeviceAvailabilityChanges() {
      if (this.devices && this.devices.length && this.video && this.video.selectedId) {
          let videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
          if (!videoDevice) {
              videoDevice = this.devices.find(d => d.kind === 'videoinput');
              if (videoDevice) {
                  this.video.selectedId = videoDevice.deviceId;
                  this.onSettingsChanged(videoDevice);
              }
          }
      }
  }
}

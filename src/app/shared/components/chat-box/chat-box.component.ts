import { Component, OnInit, Input, AfterViewChecked, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import * as Chat from 'twilio-chat';
import moment from 'moment';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  @Input() loggedInUser;
  @Input() postDetails;
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  public commentsList = [];
  public username: string = '';
  public chatToken: string = '';
  public channelName: string = "";
  public channelStatus: string = "";
  public disableScrollDown = false  

  chatClient: any;
  generalChannel: any;
  public msg: any;

  constructor(private _chatService: ChatService) {
  }

  ngOnInit() {
    this.username = `${this.loggedInUser.name}_${this.loggedInUser._id}`;
    this.channelName = this.postDetails._id;
    this.createTwilioToken();
  }

  createTwilioToken() {
    this._chatService.createToken(this.username).subscribe(data => {
      this.chatToken = data['token'];
      this.username = data['identity'];
      Chat.Client.create(this.chatToken).then(client => {
        // Use client
        this.chatClient = client;
        this.chatClient.getSubscribedChannels().then(this.createOrJoinGeneralChannel(this.channelName));
      });
    });
  }

  createOrJoinGeneralChannel(channel_id) {
    this.chatClient.getChannelByUniqueName(channel_id).then(channel => {
      this.generalChannel = channel;
      this.channelStatus = this.generalChannel.state.status;
      this.setupChannel();
    }).catch(() => {
      this.chatClient.createChannel({
        uniqueName: channel_id,
        friendlyName: channel_id
      }).then(channel => {
        this.generalChannel = channel;
        this.setupChannel();
      }).catch(channel => {
      });
    });
  }

  setupChannel() {
    if (this.channelStatus !== 'joined') {
      this.generalChannel.join().then(channel => {
        if (channel.state.status === 'joined') {
          this.generalChannel.getMessages(30).then(page => {
            this.commentsList = page.items;
            if (this.commentsList.length > 0) {
              this.generalChannel.updateLastConsumedMessageIndex(this.commentsList[this.commentsList.length - 1].index).then((data) => {
              });
            }
          });
        }
      });
    } else {
      this.generalChannel.getMessages(30).then(page => {
        this.commentsList = page.items;
        if (this.commentsList.length > 0) {
          this.generalChannel.updateLastConsumedMessageIndex(this.commentsList[this.commentsList.length - 1].index).then((data) => {
          });
          this.scrollToBottom();
        }
      });
    }

    // Listen for new messages sent to the channel
    this.generalChannel.on('messageAdded', message => {
      this.commentsList.push(message);
      if (this.commentsList.length > 0) {
        this.generalChannel.updateLastConsumedMessageIndex(this.commentsList[this.commentsList.length - 1].index).then((data) => {
        });
      }
    });
  }

  sendMsg() {
    if (this.generalChannel.members.size === 1) {
      // Send Notification
    }
    if (this.msg !== '' && this.msg !== undefined && this.msg.trim() !== '') {
      this.generalChannel.sendMessage(this.msg);
      this.msg = '';
      this.scrollToBottom();
    }
  }

  getFormatedDate(datetime) {
    if (moment().format('DD MMM YYYY') === moment(datetime).format('DD MMM YYYY')) {
      return moment(datetime).format('hh:mm A');
    } else {
      return moment(datetime).format('hh:mm A') + ' ' + moment(datetime).format('DD MMM YYYY');
    }
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}

import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
const Chat = require('twilio-chat');

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
 
  @Input() loggedInUserId;
  @Input() postDetails;

  public commentsList = [];
  public username:string = '';
  public chatToken: string = '';
  public channelName: string = "";
  public channelStatus: string = "";
  chatClient: any;
  generalChannel: any;
  public msg: any;

  constructor(private _chatService: ChatService) {
  }

  ngOnInit() {
    this.username = this.loggedInUserId;
    this.channelName = this.postDetails._id;
    console.log(this.postDetails._id);
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
    // Join the general channel
    // if (this.generalChannel.state.status !== 'joined') {
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
      console.log('Joined channel as '
        + '<span class="me">' + this.username + '</span>.', true);
      this.generalChannel.getMessages(30).then(page => {
        this.commentsList = page.items;
        if (this.commentsList.length > 0) {
          this.generalChannel.updateLastConsumedMessageIndex(this.commentsList[this.commentsList.length - 1].index).then((data) => {
          });
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
      // this.sendNotificationForChat();
    }
    if (this.msg !== '' && this.msg !== undefined && this.msg.trim() !== '') {
      this.generalChannel.sendMessage(this.msg);
      this.msg = '';
    }
  }
}

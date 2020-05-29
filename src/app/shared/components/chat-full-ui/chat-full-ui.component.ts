import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import * as Chat from 'twilio-chat';
import moment from 'moment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from '../../../../environments/environment';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-chat-full-ui',
  templateUrl: './chat-full-ui.component.html',
  styleUrls: ['./chat-full-ui.component.scss']
})
export class ChatFullUiComponent implements OnInit {

  @Input() postList = [];
  @Input() loggedInUser;
  @ViewChild('deleteSwal', { static: false }) private deleteSwal: SwalComponent;
  @ViewChild('scrollMe', { static: false }) scrollMe: ElementRef;

  public commentsList = [];
  public selectedPost;
  public anonymousAvatar = '../../assets/images/anonymous-avatar.jpg';
  public username = '';
  public chatToken = '';
  public channelName = '';
  public channelStatus = '';
  public chatClient: any;
  public generalChannel: any;
  public msg: any;
  public loadingMessage = '';
  public loginUser;
  scrolltop: number = null;
  s3FilesBucketURL = environment.s3FilesBucketURL;
  constructor(
    private _chatService: ChatService,
    public postService: PostService
  ) { }

  ngOnInit() {
    // this.username = `${this.loggedInUser.name}_${this.loggedInUser._id}`;
    this.postList.map((post, i) => { post.isActive = false, post.count = 0, post.indexAt = i, post.lastMessage = '', post.dateTime = new Date(); });
    // this.createTwilioToken();
  }

  openPostChat(index: number) {
    // if (!this.loadingMessage) {
    //   this.loadingMessage = 'Please Wait ...';
    //   const findPost = this.postList.findIndex(x => x.isActive === true);

    //   if (findPost !== -1) {
    //     this.postList[findPost].isActive = false;
    //   }

    //   this.postList[index].isActive = true;
    //   this.selectedPost = this.postList[index];
    //   this.channelName = this.selectedPost._id;

    //   if (this.channelName === this.postList[index]._id) {
    //     this.postList[index].count = 0;
    //     this.postList[index].lastMessage = '';
    //   }

    //   if (this.channelName) {
    //     this.chatClient.getSubscribedChannels().then(this.createOrJoinGeneralChannel(this.channelName));
    //   }
    // }
  }

  createTwilioToken() {
    // const self = this;
    // this._chatService.createToken(this.username).subscribe(data => {
    //   this.chatToken = data.token;
    //   this.username = data.identity;
    //   Chat.Client.create(this.chatToken).then(client => {
    //     // Use client
    //     this.chatClient = client;
    //     this.chatClient.getSubscribedChannels().then((paginator) => {
    //       console.log(paginator.items);
    //     });

    //     this.chatClient.on('messageAdded', (message) => {
    //       self.postList.map((post) => {
    //         if (post._id === message.channel.uniqueName
    //           && message.author !== self.username
    //           && self.channelName !== post._id) {
    //           post.count = post.count + 1;
    //           post.lastMessage = message.body;
    //           post.dateTime = message.timestamp;
    //         }
    //       });
    //       self.postList.sort((a, b) => {
    //         return  (new Date(b.dateTime) as any) -  (new Date(a.dateTime) as any);
    //       });
    //     });
    //   });
    // });
  }

  createOrJoinGeneralChannel(channel_id) {
    // this.chatClient.getChannelByUniqueName(channel_id).then(channel => {
    //   this.generalChannel = channel;
    //   this.channelStatus = this.generalChannel.state.status;
    //   this.setupChannel();
    // }).catch(() => {
    //   this.chatClient.createChannel({
    //     uniqueName: channel_id,
    //     friendlyName: channel_id
    //   }).then(channel => {
    //     this.generalChannel = channel;
    //     this.channelStatus = this.generalChannel.state.status;
    //     this.setupChannel();
    //   }).catch(channel => {
    //   });
    // });
  }

  setupChannel() {
    // if (this.channelStatus !== 'joined') {
    //   this.generalChannel.join().then(channel => {
    //     if (channel.state.status === 'joined') {
    //       this.generalChannel.getMessages(30).then(page => {
    //         this.commentsList = page.items;
    //         this.scrolltop = this.scrollMe.nativeElement.scrollHeight;
    //         if (this.commentsList.length > 0) {
    //           this.generalChannel.updateLastConsumedMessageIndex(this.commentsList[this.commentsList.length - 1].index).then((data) => {
    //           });
    //         }
    //         this.loadingMessage = '';
    //       });
    //     }
    //   });
    // } else {
    //   this.generalChannel.getMessages(30).then(page => {
    //     this.commentsList = page.items;
    //     this.scrolltop = this.scrollMe.nativeElement.scrollHeight;
    //     if (this.commentsList.length > 0) {
    //       this.generalChannel.updateLastConsumedMessageIndex(this.commentsList[this.commentsList.length - 1].index).then((data) => {
    //       });
    //     }
    //     this.loadingMessage = '';
    //   });
    // }

    // // Listen for new messages sent to the channel
    // this.generalChannel.on('messageAdded', message => {
    //   this.commentsList.push(message);
    //   // this.scrolltop = this.comment.nativeElement.scrollHeight;
    //   if (this.commentsList.length > 0) {
    //     this.generalChannel.updateLastConsumedMessageIndex(this.commentsList[this.commentsList.length - 1].index).then((data) => {
    //     });
    //   }
    // });
  }

  sendMsg() {
    // if (this.generalChannel.members.size === 1) {
    //   // Send Notification
    // }
    // if (this.msg !== '' && this.msg !== undefined && this.msg.trim() !== '') {
    //   this.generalChannel.sendMessage(this.msg);
    //   this.msg = '';

    // }
  }

  getFormatedDate(datetime) {
    if (moment().format('DD MMM YYYY') === moment(datetime).format('DD MMM YYYY')) {
      return moment(datetime).format('hh:mm A');
    } else {
      return moment(datetime).format('hh:mm A') + ' ' + moment(datetime).format('DD MMM YYYY');
    }
  }

  removeChannel() {
    // if (this.generalChannel) {
    //   this.generalChannel.delete().then(channel => {
    //     const findPost = this.postList.findIndex((post) => post._id === this.selectedPost._id);
    //     if (findPost !== -1) {
    //       this.postList[findPost].isActive = false;
    //       this.selectedPost = {};
    //       this.commentsList = [];
    //     }
    //   });
    // }
  }

}

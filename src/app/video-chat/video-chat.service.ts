import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Participant, RemoteParticipant } from 'twilio-video';

interface AuthToken {
    token: string;
}

export interface NamedRoom {
    id: string;
    name: string;
    maxParticipants?: number;
    participantCount: number;
}

export type Rooms = NamedRoom[];

@Injectable({
    providedIn: 'root'
})
export class VideoChatService {
    $roomsUpdated: Observable<boolean>;
    $localStreamUpdated: Observable<{ track: MediaStreamTrack, name?: string }>;
    $newParticipantAdded: Observable<any>;

    private roomBroadcast = new ReplaySubject<boolean>();

    streamUpdate = new BehaviorSubject<{ track: MediaStreamTrack, name?: string }>(null);
    newParticipantAdded = new BehaviorSubject(null);

    /** List Of Participants In the Room */
    participants: Map<Participant.SID, RemoteParticipant>;

    constructor(
        private apollo: Apollo,
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.$roomsUpdated = this.roomBroadcast.asObservable();
        this.$localStreamUpdated = this.streamUpdate.asObservable();
        this.$newParticipantAdded = this.newParticipantAdded.asObservable();
    }

    private async getAuthToken() {
        if (!this.authService.loggedInUser) {
            this.authService.checkIfUserIsLoggedIn(true);
            return;
        }
        const auth = await this.apollo.query<AuthToken>(
            {
                query: gql`
                      query createVideoToken($identity: String) {
                        createVideoToken(identity: $identity) {
                          token,
                          identity
                        }
                      }
                    `,
                variables: {
                    identity: this.authService.loggedInUser._id
                },
                fetchPolicy: 'no-cache'
            }
        ).pipe(
            map((p: any) => {
                return p.data.createVideoToken;
            }),
        ).toPromise();

        return auth.token;

    }

    getAllRooms() {
        return this.http
            .get<Rooms>('api/video/rooms')
            .toPromise();
    }

    async joinOrCreateRoom(name: string, tracks: LocalTrack[]) {
        let room: Room = null;
        try {
            const token = await this.getAuthToken();
            room =
                await connect(
                    token,
                    {
                        name,
                        tracks,
                        // RecordParticipantsOnConnect: true,
                        dominantSpeaker: true
                    } as ConnectOptions);
        } catch (error) {
            console.error(`Unable to connect to Room: ${error.message}`);
        } finally {
            if (room) {
                this.roomBroadcast.next(true);
                room.localParticipant.tracks.forEach(this.trackPublished);
            }
        }

        return room;
    }

    nudge() {
        this.roomBroadcast.next(true);
    }

    trackPublished = (publication) => {
        console.log(`Published LocalTrack: ${publication.track}`);
    }

    call(post, caller) {
        return this.apollo.mutate(
            {
                mutation: gql`
                mutation call($post: PostInput, $caller: UserInput) {
                    call(post: $post, caller: $caller)
        }`,
                variables: {
                    post,
                    caller
                }
            }
        ).pipe(
            map((p: any) => p.data.call),
        );
    }

}

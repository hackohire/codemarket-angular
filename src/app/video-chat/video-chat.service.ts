import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

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
    $localStreamUpdated: Observable<any>;

    private roomBroadcast = new ReplaySubject<boolean>();

    streamUpdate = new BehaviorSubject(null);

    constructor(
        private apollo: Apollo,
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.$roomsUpdated = this.roomBroadcast.asObservable();
        this.$localStreamUpdated = this.streamUpdate.asObservable();
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
                    token, {
                        name,
                        tracks,
                        dominantSpeaker: true
                    } as ConnectOptions);
        } catch (error) {
            console.error(`Unable to connect to Room: ${error.message}`);
        } finally {
            if (room) {
                this.roomBroadcast.next(true);
            }
        }

        return room;
    }

    nudge() {
        this.roomBroadcast.next(true);
    }
}

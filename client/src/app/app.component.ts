import { Component, OnInit } from '@angular/core';
import {
    encodeCompositeMetadata,
    encodeRoute,
    IdentitySerializer,
    JsonSerializer,
    MESSAGE_RSOCKET_ROUTING,
    RSocketClient,
    BufferEncoders,
    MESSAGE_RSOCKET_COMPOSITE_METADATA,
    Encodable,
} from 'rsocket-core';
import { Payload, ReactiveSocket } from 'rsocket-types';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { Product } from './shared/product.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    client!: RSocketClient<Product, Encodable>;

    ngOnInit(): void {
        this.createRSocketClient();
        this.connect();
    }

    private createRSocketClient(): void {
        this.client = new RSocketClient<Product, Encodable>({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer,
            },
            setup: {
                // ms btw sending keepalive to server
                keepAlive: 60000,
                // ms timeout if no keepalive response
                lifetime: 180000,
                // format of `data`
                dataMimeType: 'application/json',
                // format of `metadata`
                metadataMimeType: MESSAGE_RSOCKET_ROUTING.string,
            },
            transport: new RSocketWebSocketClient({
                debug: true,
                url: 'ws://localhost:7000',
                wsCreator: (url) => new WebSocket(url),
            }),
        });
    }

    private connect(): void {
        this.client.connect().subscribe({
            onComplete: (socket: ReactiveSocket<Product, Encodable>) => {
                // socket provides the rsocket interactions fire/forget, request/response,
                // request/stream, etc as well as methods to close the socket.
                socket
                    .requestResponse({
                        data: { id: '123', label: 'Jean', price: 100 },
                        metadata:
                            String.fromCharCode('request.response'.length) +
                            'request.response',
                    })
                    .subscribe({
                        onComplete: (response) => console.log(response),
                        onError: (error) => {
                            console.log(
                                'Connection has been closed due to:: ' + error
                            );
                        },
                        onSubscribe: () => {
                            console.log('Subscribed !');
                        },
                    });
            },
            onError: (error) => {
                console.log('Connection has been refused due to:: ' + error);
            },
            onSubscribe: (cancel) => {
                /* call cancel() to abort */
            },
        });
    }
}

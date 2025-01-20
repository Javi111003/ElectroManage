import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private subject!: Subject<any>;

  public connect(url: string): Subject<any> {
    if (!this.subject) {
      this.socket = new WebSocket(url);
      this.subject = this.create(this.socket);
    }
    return this.subject;
  }

  private create(socket: WebSocket): Subject<any> {
    const observable = new Observable(observer => {
      socket.onmessage = (event) => observer.next(event.data);
      socket.onerror = (event) => observer.error(event);
      socket.onclose = () => observer.complete();
    });

    const observer = {
      next: (data: object) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }
}

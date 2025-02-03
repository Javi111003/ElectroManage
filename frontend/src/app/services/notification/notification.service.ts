import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../../shared/shared.module';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private lastId = 0;
  private notificationsSubject = new BehaviorSubject<Item[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Adds a new notification with the specified message.
   *
   * This method creates a new notification object with a unique ID and the provided message.
   * It then updates the current notifications list by adding the new notification and
   * emits the updated list using the `notificationsSubject`.
   *
   * @param message - The message to be included in the new notification.
   */
  addNotification(message: string): void {
    const newNotification: Item = {
      id: ++this.lastId,
      name: message
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);
  }

  /**
   * Removes a notification with the specified ID.
   *
   * This method filters out the notification with the given ID from the current notifications list
   * and emits the updated list using the `notificationsSubject`.
   *
   * @param id - The ID of the notification to be removed.
   */
  removeNotification(id: number): void {
    const updatedNotifications = this.notificationsSubject.value.filter(
      (notification) => notification.id !== id
    );
    this.notificationsSubject.next(updatedNotifications);
  }
}

import { Notification } from '..';
import Media from '../../../entity/Media';
import { MediaRequest } from '../../../entity/MediaRequest';
import { User } from '../../../entity/User';
import { NotificationAgentConfig } from '../../settings';

export interface NotificationPayload {
  subject: string;
  notifyUser: User;
  media?: Media;
  image?: string;
  message?: string;
  extra?: { name: string; value: string }[];
  request?: MediaRequest;
}

export abstract class BaseAgent<T extends NotificationAgentConfig> {
  protected settings?: T;
  public constructor(settings?: T) {
    this.settings = settings;
  }

  protected abstract getSettings(): T;

  protected userNotificationTypes: Notification[] = [
    Notification.MEDIA_APPROVED,
    Notification.MEDIA_DECLINED,
    Notification.MEDIA_AVAILABLE,
  ];
}

export interface NotificationAgent {
  shouldSend(type: Notification, payload: NotificationPayload): boolean;
  send(type: Notification, payload: NotificationPayload): Promise<boolean>;
}

import type { Account, Hashtag } from '../types';

export function isTwitterAccount(item: Account | Hashtag): item is Account {
  return Boolean((item as Account).handle);
}

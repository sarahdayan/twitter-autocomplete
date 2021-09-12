import type { Hit } from '@algolia/client-search';

import type { Account, AutocompleteItem } from '../types';

export function isTwitterAccount(item: AutocompleteItem): item is Hit<Account> {
  return Boolean((item as Hit<Account>).handle);
}

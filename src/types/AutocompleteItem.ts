import type { Hit } from '@algolia/client-search';

import type { Hashtag, Account } from '.';

export type AutocompleteItem = Hit<Account | Hashtag>;

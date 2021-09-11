import type {
  AutocompleteOptions,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { useMemo, useState } from 'react';

import type { TwitterAccount } from '../types';

export function useAutocomplete(props: AutocompleteOptions<TwitterAccount>) {
  const [state, setState] = useState<AutocompleteState<TwitterAccount>>(() => ({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  }));

  const autocomplete = useMemo(
    () =>
      createAutocomplete<
        TwitterAccount,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        ...props,
        onStateChange(params) {
          props.onStateChange?.(params);
          setState(params.state);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { autocomplete, state };
}

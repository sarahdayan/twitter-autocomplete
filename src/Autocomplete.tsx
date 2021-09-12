import React, { useRef } from 'react';
import getCaretCoordinates from 'textarea-caret';

import { useAutocomplete } from './hooks';
import { accounts, hashtags } from './items';
import type { AutocompleteItem, Hashtag, QueryToken, Account } from './types';
import { replaceAt } from './utils';

type AccountItemProps = {
  item: Account;
};

const AccountItem = ({ item }: AccountItemProps) => {
  return (
    <>
      {(item.follower || item.followed) && (
        <div className="flex items-center space-x-1 text-gray-600 text-sm">
          <svg className="h-4 w-auto" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          {item.follower && item.followed && <span>You follow each other</span>}
          {!item.follower && item.followed && <span>You follow them</span>}
          {item.follower && !item.followed && <span>They follow you</span>}
        </div>
      )}
      <div className="flex items-center space-x-4">
        <img
          className="w-10 h-10 rounded-full flex-none"
          src={`https://pbs.twimg.com/profile_images/${item.image}`}
          alt=""
        />
        <div>
          <div className="text-white font-semibold flex items-center space-x-1">
            <span>{item.name}</span>
            {item.verified && (
              <svg
                className="h-5 w-5 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="text-gray-500">{item.handle}</div>
        </div>
      </div>
    </>
  );
};

type HashtagItemProps = {
  item: Hashtag;
};

const HashtagItem = ({ item }: HashtagItemProps) => {
  return <>{`#${item.hashtag}`}</>;
};

function isTwitterAccount(item: AutocompleteItem): item is Account {
  return Boolean((item as Account).handle);
}

export const Autocomplete = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { autocomplete, state } = useAutocomplete({
    id: 'twitter-autocomplete',
    defaultActiveItemId: 0,
    placeholder: "What's up?",
    getSources({ query }) {
      const cursorPosition = inputRef.current?.selectionEnd;
      const tokenizedQuery = query
        .split(/[\s\n]/)
        .reduce((acc, token, index) => {
          const previous = acc[index - 1];
          const start = index === 0 ? index : previous.range[1] + 1;
          const end = start + token.length;

          return acc.concat([{ token, range: [start, end] }]);
        }, [] as QueryToken[]);

      if (cursorPosition) {
        const activeToken = tokenizedQuery.find((token) =>
          token.range.includes(cursorPosition)
        );

        if (
          activeToken?.token.startsWith('@') &&
          activeToken?.token.length > 1
        ) {
          return [
            {
              sourceId: 'accounts',
              onSelect({ item, setQuery }) {
                const [index] = activeToken.range;
                const replacement = `@${(item as Account).handle}`;
                const newQuery = replaceAt(query, replacement, index);

                setQuery(newQuery);
              },
              getItems() {
                return accounts.filter(({ name, handle }) => {
                  const tokenizedName = name.split(' ');
                  const tokenizedHandle = handle
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    .split(' ');
                  const normalizedToken = activeToken?.token
                    .toLowerCase()
                    .slice(1);

                  return [...tokenizedName, ...tokenizedHandle].some((item) =>
                    item.toLowerCase().startsWith(normalizedToken)
                  );
                });
              },
            },
          ];
        }

        if (
          activeToken?.token.startsWith('#') &&
          activeToken?.token.length > 1
        ) {
          return [
            {
              sourceId: 'hashtags',
              onSelect({ item, setQuery }) {
                const [index] = activeToken.range;
                const replacement = `#${(item as Hashtag).hashtag}`;
                const newQuery = replaceAt(query, replacement, index);

                setQuery(newQuery);
              },
              getItems() {
                return hashtags.filter(({ hashtag }) => {
                  const tokenizedHashtag = hashtag
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    .split(' ');
                  const normalizedToken = activeToken?.token
                    .toLowerCase()
                    .slice(1);

                  return tokenizedHashtag.some((item) =>
                    item.toLowerCase().startsWith(normalizedToken)
                  );
                });
              },
            },
          ];
        }
      }

      return [];
    },
  });

  const { top, height } = inputRef.current
    ? getCaretCoordinates(inputRef.current, inputRef.current?.selectionEnd)
    : { top: 0, height: 0 };

  return (
    <div {...autocomplete.getRootProps({})}>
      <div className="rounded-lg shadow-xl bg-gray-900">
        <div className="shadow rounded-lg">
          <div className="py-4 px-6 text-white rounded-lg">
            <div className="flex space-x-4">
              <img
                className="w-10 h-10 rounded-full flex-none"
                src="https://pbs.twimg.com/profile_images/977873484759158784/mOItIR7M_x96.jpg"
                alt=""
              />
              <div className="relative flex-grow mt-2">
                <form
                  {...autocomplete.getFormProps({
                    inputElement:
                      inputRef.current as unknown as HTMLInputElement,
                  })}
                >
                  <textarea
                    className="bg-transparent focus:outline-none placeholder-gray-500 w-full resize-none h-36"
                    ref={inputRef}
                    {...autocomplete.getInputProps({
                      inputElement:
                        inputRef.current as unknown as HTMLInputElement,
                    })}
                    spellCheck={false}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={true}
                    maxLength={280}
                  />
                </form>
                {state.isOpen && (
                  <div
                    {...autocomplete.getPanelProps({})}
                    className="absolute shadow-light-xl w-full max-w-xs left-0 rounded-lg"
                    style={{ top: `${top + height}px` }}
                  >
                    <div className="shadow-light rounded-lg">
                      {state.collections.map(({ source, items }) => {
                        return (
                          <div
                            key={`source-${source.sourceId}`}
                            className="bg-gray-900 rounded-lg overflow-hidden py-2 mt-2 w-full"
                          >
                            {items.length > 0 && (
                              <ul {...autocomplete.getListProps()}>
                                {items.map((item) => {
                                  const itemProps = autocomplete.getItemProps({
                                    item,
                                    source,
                                  });
                                  const isAccount = isTwitterAccount(item);

                                  return (
                                    <li
                                      key={
                                        isAccount ? item.handle : item.hashtag
                                      }
                                      {...itemProps}
                                    >
                                      <div
                                        className={[
                                          'py-2 px-6 flex flex-col space-y-1 cursor-pointer',
                                          itemProps['aria-selected'] &&
                                            'bg-gray-800',
                                        ]
                                          .filter(Boolean)
                                          .join(' ')}
                                      >
                                        {isAccount ? (
                                          <AccountItem item={item} />
                                        ) : (
                                          <HashtagItem item={item} />
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="py-3 px-6 rounded-bl-lg rounded-br-lg flex justify-end border-t border-gray-800">
            <button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 transition-colors py-1.5 px-4 rounded-full font-bold"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

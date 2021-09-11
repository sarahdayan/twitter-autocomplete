import React from 'react';

import { Autocomplete } from './Autocomplete';

export const App = () => {
  return (
    <div className="p-6 bg-gray-600 w-screen h-screen">
      <div className="mx-auto max-w-xl w-full">
        <Autocomplete />
      </div>
    </div>
  );
};

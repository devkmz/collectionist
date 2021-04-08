import { css, SerializedStyles } from '@emotion/core';
import React from 'react';

const style = (): SerializedStyles => css`

`;

const App = (): JSX.Element => {
  return (
    <div css={style}>
      <h1>App component</h1>
    </div>
  );
}

export default App;

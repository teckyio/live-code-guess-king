/** @jsxImportSource @emotion/react */

import React from 'react'
import { css } from '@emotion/react';
import Hand, { HandType } from './Hand';

export default function Resultboard(props: {
  result?: HandType
}) {
  return (
    <div css={css`
      display: flex;
      flex: 1;
      justify-content: center;
    `}>
      <Hand handtype={props.result} />
    </div>
  )
}
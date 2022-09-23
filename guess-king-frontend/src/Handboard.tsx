/** @jsxImportSource @emotion/react */

import React from 'react'
import { css } from '@emotion/react';
import Hand, { HandType } from './Hand';

export default function Handboard() {
  return (
    <div css={css`
      display: flex;
      justify-content: center;
    `}>
      <Hand handtype={HandType.Rock} />
      <Hand handtype={HandType.Paper} />
      <Hand handtype={HandType.Scissor} />
    </div>
  )
}

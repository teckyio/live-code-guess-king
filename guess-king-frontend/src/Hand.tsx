/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import React from 'react'

export enum HandType {
  Rock,
  Paper,
  Scissor
}

export default function Hand(props: {
  handtype?: HandType
}) {
  return (
    <button css={css`
      border: solid 1px #ccc;
      background: transparent;
      border-radius: 1rem;
      display: flex;
      width: 1.5rem;
      height: 1.5rem;
      justify-content: center;
      align-items: center;
      margin: 0.2rem;
      background: #fff;
    `}>
      {props.handtype === HandType.Rock && '✊🏻'}
      {props.handtype === HandType.Paper && '🖐🏻'}
      {props.handtype === HandType.Scissor && '✌🏻'}
      {props.handtype == null && '❓'}
    </button>
  )
}

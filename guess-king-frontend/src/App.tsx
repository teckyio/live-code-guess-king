/** @jsxImportSource @emotion/react */

import React, { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import Handboard from './Handboard';
import Hand, { HandType } from './Hand';
import Resultboard from './Resultboard';
import io, { Socket } from 'socket.io-client'

interface Player {
  id: string;
  name: string;
}

function App() {
  const [name, setName] = useState(null);
  const socket = useRef<Socket>();

  const [queue, setQueue] = useState<Player[]>([])
  const [king, setKing] = useState<Player | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null); 

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_BACKEND_URL!)
    socket.current?.on('queued', ({ uuid, name, currentPosition, queue }) => {
      setName(name)
      setCurrentPlayer(uuid)
      setKing(queue.slice(0)[0])
      setQueue(queue.slice(1))
    })

    socket.current?.on('new-player', ({ id, name }) => {
      setQueue(queue => [...queue, { id, name }].slice(0, 5))
    })
  
    return () => {
      socket.current?.disconnect();
    }
  }, [socket, setCurrentPlayer])
  
  return (
    <div css={css`
      width: 100%;
    `}>
      { !name && (
        <form css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1rem;
        `} onSubmit={(e) => {
          e.preventDefault();

          socket.current?.emit('join', e.currentTarget['username'].value)
        }}>
          <p>你的名字：</p>
          <input name="username" />
          <button>成為庶民</button>
        </form>
      )}
      { name &&
        <header css={css`
          .emoji {
            font-family: 'Noto Color Emoji', sans-serif;
          }

          .player {
            border-radius: 1rem;
            margin: 0.3rem;

            .player-badge {
              display: flex;
              justify-content: center;
            }
          }
        `}>

          <div className='player' css={css`
            background: linear-gradient(#ffcc00, #ffcc99);
            padding: 1rem 2rem;
          `}>
            <div className="player-badge">
              <div className="emoji">🤴🏻</div>
              <span>{king?.name}</span>
            </div>

            {currentPlayer === king?.id ? <Handboard /> : <Resultboard />}
          </div>

          <div css={css`
            .queue {
              padding: 0.3rem;
              background: linear-gradient(#ccc, #eee);

              .emoji {
                padding-right: 1rem;
              }
            }
          `}>

          {queue.map((player, index) => (
            <div key={player.id} className="queue player">
              <div className="player-badge">
                <div className="emoji">🙎🏻</div>
                <span>{player.name}</span>
              </div>

              {index === 0 && (
                currentPlayer === player.id 
                  ? <Handboard />
                  : <Resultboard />
              )}
            </div>
          ))}
          </div>
        </header>
      }
    </div>
  );
}

export default App;

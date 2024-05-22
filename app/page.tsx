'use client';

import games from './../tmp/games.json';
import React, { useState } from 'react';
import { Game } from '@/interfaces';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

export default function Page() {
  const [gamesList, setFilter] = useState(games.filter(game => game.watch && !game?.fav).slice(0, 304));

  function handleButton(filter: string) {
    if (filter === "all") {
      setFilter(games)
    } else if (filter === "watch") {
      setFilter(games.filter(game => game.watch && !game.fav).slice(0, 304));
    } else if (filter === "unwatch") {
      setFilter(games.filter(game => !game.watch));
    } else if (filter === "fav") {
      // @ts-ignore
      setFilter(games.filter(game => game.fav));
    } else if (filter === "order") {
      setFilter(games
        .sort((a, b) => {
          const priceA = parseInt(a.price.split(',')[0]) || 0;
          const priceB = parseInt(b.price.split(',')[0]) || 0;
          return priceA - priceB;
        })
        .filter(game => game.watch && !game.fav).slice(0, 304));
    }
  }

  function handleButtonWatch(index: number, watch = true) {
    fetch(`/api/${watch ? 'unwatch' : 'watch'}/${index}`);
    // @ts-ignore
    games.find(game => game.index === index).watch = !watch;
    setFilter(games.filter(game => game.watch && !game.fav).slice(0, 304));
  }

  function handleButtonFav(index: number, fav = true) {
    fetch(`/api/${fav ? 'unfav' : 'fav'}/${index}`);
    // @ts-ignore
    games.find(game => game.index === index).fav = !fav;
    setFilter(games.filter(game => game.watch && !game.fav).slice(0, 304));
  }

  function GameCard({ game, index }: {game: Game, index: number}) {
    return (
      <div className="col-auto w-auto m-0 p-2">
        <div className='card card-fw h-100 m-0 p-0' key={index} data-index={game.index}>
          <img src={game.image} className='rounded' onClick={() => window.open(game.url, '_blank')}/>
          <p className='m-0' onClick={() => window.open(game.url, '_blank')}>{game.name}</p>
          <p className='m-0'>{game.price} {parseInt(game.price.split(',')[0])}</p>
          <div className='mt-auto mb-1'>
            {game.watch
            ? (<FaRegEye className='mx-2' size={18} onClick={() => handleButtonWatch(game.index, true)} />)
            : (<FaRegEyeSlash className='mx-2' size={18} onClick={() => handleButtonWatch(game.index, false)} />)}
            {game?.fav
            ? (<MdFavorite className='mx-2' size={18} color='red' onClick={() => handleButtonFav(game.index, true)} />)
            : (<MdFavoriteBorder className='mx-2' size={18} color='red' onClick={() => handleButtonFav(game.index, false)} />)}
          </div>
        </div>
      </div>
      )
  }

  // @ts-ignore
    // @ts-ignore
  return (
    <main className="p-4 text-center">
      <button className="btn btn-primary m-2" value='watch'
              onClick={() => handleButton('watch')}>Watch ({games.filter(game => game.watch).length})
      </button>
      <button className="btn btn-danger m-2" value='fav'
              onClick={() => handleButton('fav')}>Fav ({games.filter(game => game.fav).length})
      </button>
      <button className="btn btn-secondary m-2" value='unwatch'
              onClick={() => handleButton('unwatch')}>Unwatch ({games.filter(game => !game.watch).length})
      </button>
      <button className="btn btn-link m-2" value='all'
              onClick={() => handleButton('all')}>All
      </button>
      <div className='container-fluid mt-2'>
        <div className='row p-0'>
          {gamesList.map((game, index) => (
            // @ts-ignore
            <GameCard key={index} game={game} index={index}/>
          ))}
        </div>
      </div>
    </main>
  );
};

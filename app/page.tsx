'use client';

import games from './../games.json';
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
      <div className='p-3 bg-white flex flex-1 flex-col justify-between' key={index} data-index={game.index}>
        <img src={game.image} className='cursor-pointer' onClick={() => window.open(game.url, '_blank')}/>
        <p className='text-sm cursor-pointer' onClick={() => window.open(game.url, '_blank')}>{game.name}</p>
        <p className='text-sm text-red-600'>{game.price} {parseInt(game.price.split(',')[0])}</p>
        <div className='flex justify-left static'>
          {game.watch
          ? (<FaRegEye className='cursor-pointer m-1' onClick={() => handleButtonWatch(game.index, true)} />)
          : (<FaRegEyeSlash className='cursor-pointer m-1' onClick={() => handleButtonWatch(game.index, false)} />)}
          {game?.fav
          ? (<MdFavorite className='cursor-pointer m-1' color='red' onClick={() => handleButtonFav(game.index, true)} />)
          : (<MdFavoriteBorder className='cursor-pointer m-1' color='red' onClick={() => handleButtonFav(game.index, false)} />)}
        </div>
      </div>
      )
  }

  // @ts-ignore
    // @ts-ignore
  return (
    <main className='p-6 bg-gray-300'>
      <div className='flex items-center justify-center p-8'>
        <button className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded m-1" value='watch'
                onClick={() => handleButton('watch')}>Watch ({games.filter(game => game.watch).length})
        </button>
        <button className="bg-red-600 text-white font-bold py-2 px-4 rounded m-1" value='fav'
                onClick={() => handleButton('fav')}>Fav ({games.filter(game => game.fav).length})
        </button>
        <button className="text-white font-bold py-2 px-4 rounded m-1" value='all'
                onClick={() => handleButton('order')}>Order by price
        </button>
        <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded m-1" value='unwatch'
                onClick={() => handleButton('unwatch')}>Unwatch ({games.filter(game => !game.watch).length})
        </button>
        <button className="text-white font-bold py-2 px-4 rounded m-1" value='all'
                onClick={() => handleButton('all')}>All
        </button>
      </div>
      <div className='grid gap-3 grid-cols-[repeat(auto-fit,_11%)] justify-center'>
        {gamesList.map((game, index) => (
          // @ts-ignore
          <GameCard key={index} game={game} index={index}/>
        ))}
      </div>
    </main>
  );
};

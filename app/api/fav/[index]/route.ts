import { NextResponse } from 'next/server';
import games from './../../../../games.json';
import * as fs from 'node:fs';

export async function GET(
  _request: Request,
  { params} : { params: { index: number } }
) {
  // @ts-ignore
  games.find(g => parseInt(g.index.toString()) === parseInt(params.index.toString())).fav = true;

  fs.writeFileSync('./games.json', JSON.stringify(games));
  console.log(games[0]);

  return NextResponse.json({ message: "success" });
}

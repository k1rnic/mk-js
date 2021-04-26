import { RandomFighter } from './fighter.js';
import Game from './game.js';

const game = new Game(new RandomFighter(), new RandomFighter());

game.start();

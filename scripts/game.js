import Controller from './controller.js';
import { RandomFighter } from './fighter.js';
import Logger from './logger.js';
import { Player } from './player.js';

export default class Game {
  #arena = document.querySelector('.arenas');
  #resultsEl = document.querySelector('.results');

  constructor(fighterOne, fighterTwo) {
    this.playerOne = new Player(1, fighterOne);
    this.playerTwo = new Player(2, fighterTwo);

    this.controller = new Controller({
      onFight: this.handleFightClick,
    });
  }

  get gameOver() {
    return this.playerOne.looser || this.playerTwo.looser;
  }

  get gameOverState() {
    if (this.playerOne.looser && this.playerTwo.looser) {
      return {};
    }

    return {
      winner: this.playerOne.looser ? this.playerTwo : this.playerOne,
      looser: this.playerTwo.looser ? this.playerTwo : this.playerOne,
    };
  }

  start = () => {
    this.#arena.append(this.playerOne.element, this.playerTwo.element);
    Logger.start(this.playerOne, this.playerTwo);
  };

  fight = ({ defence: playerDefence, ...playerAttack }) => {
    const {
      defence: enemyDefence,
      ...enemyAttack
    } = RandomFighter.getRandomAttack(this.playerTwo.fighter.name);

    this.playerOne.attack(this.playerTwo, playerAttack, enemyDefence);
    this.playerTwo.attack(this.playerOne, enemyAttack, playerDefence);
  };

  handleFightClick = (playerAttack) => {
    this.fight(playerAttack);

    if (this.gameOver) {
      this.showGameResults(this.gameOverState);
      this.controller.showRematchButton();
    }
  };

  showGameResults = ({ winner, looser }) => {
    winner ? Logger.win(winner, looser) : Logger.draw();

    this.#resultsEl.innerText = winner ? `${winner.fighter.name} wins` : `Draw`;
  };
}

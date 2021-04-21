import Component from './component.js';
import Logger from './logger.js';
import Player from './player.js';

const logger = new Logger();

export default function (fighterOne, fighterTwo) {
  this.player = new Player(1, fighterOne);
  this.enemy = new Player(2, fighterTwo);

  logger.log('start', 'info', this.player, this.enemy);

  this.$results = document.querySelector('.results');
  this.$arena = document.querySelector('.arenas');
  this.$arena.append(this.player.$el, this.enemy.$el);

  this.nextRound = (
    { defence: playerDefence, ...playerAttack },
    { defence: enemyDefence, ...enemyAttack },
  ) => {
    this.attack(this.player, playerAttack, this.enemy, enemyDefence);
    this.attack(this.enemy, enemyAttack, this.player, playerDefence);

    if (this.matchEnded()) {
      this.showResults();
      this.rematch();
    }
  };

  this.attack = (puncher, attack, defender, defence) => {
    const isDefended = puncher.hit(defender, attack, defence);

    isDefended
      ? logger.log('defence', 'info', puncher, defender, attack)
      : logger.log('hit', 'warning', puncher, defender, attack);
  };

  this.matchEnded = () => this.player.isLost() || this.enemy.isLost();

  this.getMatchState = () => {
    if (this.player.isLost() && this.enemy.isLost()) {
      return {};
    }

    return {
      winner: this.player.isLost() ? this.enemy : this.player,
      looser: this.player.isLost() ? this.player : this.enemy,
    };
  };

  this.showResults = () => {
    const { winner, looser } = this.getMatchState();

    winner
      ? logger.log('end', 'info', winner, looser)
      : logger.log('draw', 'info');

    this.$results.innerText = winner ? `${winner.name} wins` : `Draw`;
  };

  this.rematch = () => {
    const $rematchBtn = new Component('button', 'rematch')
      .classes('btn', 'rematch-btn')
      .get();

    $rematchBtn.addEventListener('click', function () {
      window.location.reload();
    });

    const $rematchBtnContainer = new Component('div')
      .classes('reloadWrap')
      .children($rematchBtn)
      .get();

    this.$arena.append($rematchBtnContainer);
  };
}

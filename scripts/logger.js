import LOGS from '../data/logs.js';
import Component from './component.js';
import { getRandom, getTime } from './utils.js';
export default class Logger {
  static #component = document.querySelector('.chat');

  static start = ({ fighter: fighterOne }, { fighter: fighterTwo }) => {
    const text = this.#getLog('start')
      .replace('{time}', getTime())
      .replace('{playerOne}', fighterOne.name)
      .replace('{playerTwo}', fighterTwo.name);

    this.#log(text, 'info');
  };

  static win = ({ fighter: winner }, { fighter: looser }) => {
    const text = this.#getLog('win')
      .replace('{winner}', winner.name)
      .replace('{looser}', looser.name);

    this.#log(text, 'success');
  };

  static draw = () => {
    const text = this.#getLog('draw');

    this.#log(text, 'info');
  };

  static hit = ({ fighter: puncher }, { fighter: defender }, damage) => {
    const text = this.#getLog('hit')
      .replace('{hp}', defender.hp)
      .replace('{damage}', damage)
      .replace('{puncher}', puncher.name)
      .replace('{defender}', defender.name);

    this.#log(text, 'warning');
  };

  static defence = ({ fighter: puncher }, { fighter: defender }) => {
    const text = this.#getLog('defence')
      .replace('{puncher}', puncher.name)
      .replace('{defender}', defender.name);

    this.#log(text, 'success');
  };

  static #getLog = (type) => {
    const text = this.#getRandomLogByType(type);

    switch (type) {
      case 'defence':
      case 'hit':
        return `[${getTime()}] ${text}`;
      default:
        return text;
    }
  };

  static #getRandomLogByType = (type) => {
    const log = LOGS[type];
    return log[getRandom(log.length - 1)];
  };

  static #log = (text, level) => {
    this.#component.prepend(
      new Component('p', text).classes('message', level).get(),
    );
  };
}

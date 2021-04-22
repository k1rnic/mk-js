import Component from './component.js';

export default class Controller {
  #fightCtrl = document.querySelector('.controller .fight-ctrl');
  #rematchCtrl = document.querySelector('.controller .rematch-ctrl');

  constructor({ onFight }) {
    this.#addFightClickListener(onFight);
  }

  showRematchButton = () => {
    this.#fightCtrl.remove();

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

    this.#rematchCtrl.append($rematchBtnContainer);
  };

  #addFightClickListener = (handler) => {
    this.#fightCtrl.addEventListener('submit', (e) => {
      e.preventDefault();

      handler(this.#getPlayerAttack());

      this.#fightCtrl.reset();
    });
  };

  #getPlayerAttack = () => {
    const { value: hit } = Array.from(this.#fightCtrl).find(
      ({ checked, name }) => checked && name === 'hit',
    );
    const { value: defence } = Array.from(this.#fightCtrl).find(
      ({ checked, name }) => checked && name === 'defence',
    );
    return { defence, hit };
  };
}

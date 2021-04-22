import Arena from './arena.js';
import { getRandomAttack, getRandomFighter } from './fighter.js';

const arena = new Arena(getRandomFighter(), getRandomFighter());
const $controller = document.querySelector('.controller');

$controller.addEventListener('submit', (e) => {
  e.preventDefault();

  arena.nextRound(getPlayerAttack(), getRandomAttack());

  if (arena.matchEnded()) {
    $controller.remove();
  }
  $controller.reset();
});

const getPlayerAttack = () => {
  const { value: hit } = Array.from($controller).find(
    ({ checked, name }) => checked && name === 'hit',
  );

  const { value: defence } = Array.from($controller).find(
    ({ checked, name }) => checked && name === 'defence',
  );

  return { defence, hit, damage: 20 };
};

import Component from './component.js';
import { getRandom, getTime } from './utils.js';

const LOGS = {
  start: (playerOne, playerTwo) => [
    `Часы показывали ${getTime()}, когда ${playerOne.name} и ${
      playerTwo.name
    } бросили вызов друг другу.`,
  ],
  draw: () => [`Ничья - это тоже победа!`],
  end: (winner, looser) => [
    `Результат удара ${winner.name}: ${looser.name} - труп`,
    `${looser.name} погиб от удара бойца ${winner.name}`,
    `Результат боя: ${looser.name} - жертва, ${winner.name} - убийца`,
  ],
  hit: (puncher, defender, { damage }) => [
    `${defender.name} пытался сконцентрироваться, но ${puncher.name} разбежавшись раздробил копчиком левое ухо врага. -${damage} [${defender.hp}/100]`,
    `${defender.name} расстроился, как вдруг, неожиданно ${puncher.name} случайно раздробил грудью грудину противника. -${damage} [${defender.hp}/100]`,
    `${defender.name} зажмурился, а в это время ${puncher.name}, прослезившись, раздробил кулаком пах оппонента. -${damage} [${defender.hp}/100]`,
    `${defender.name} чесал <вырезано цензурой>, и внезапно неустрашимый ${puncher.name} отчаянно размозжил грудью левый бицепс оппонента. -${damage} [${defender.hp}/100]`,
    `${defender.name} задумался, но внезапно ${puncher.name} случайно влепил грубый удар копчиком в пояс оппонента. -${damage} [${defender.hp}/100]`,
    `${defender.name} ковырялся в зубах, но ${puncher.name} проснувшись влепил тяжелый удар пальцем в кадык врага. -${damage} [${defender.hp}/100]`,
    `${defender.name} вспомнил что-то важное, но внезапно ${puncher.name} зевнув, размозжил открытой ладонью челюсть противника. -${damage} [${defender.hp}/100]`,
    `${defender.name} осмотрелся, и в это время ${puncher.name} мимоходом раздробил стопой аппендикс соперника. -${damage} [${defender.hp}/100]`,
    `${defender.name} кашлянул, но внезапно ${puncher.name} показав палец, размозжил пальцем грудь соперника. -${damage} [${defender.hp}/100]`,
    `${defender.name} пытался что-то сказать, а жестокий ${puncher.name} проснувшись размозжил копчиком левую ногу противника. -${damage} [${defender.hp}/100]`,
    `${defender.name} забылся, как внезапно безумный ${puncher.name} со скуки, влепил удар коленом в левый бок соперника. -${damage} [${defender.hp}/100]`,
    `${defender.name} поперхнулся, а за это ${puncher.name} мимоходом раздробил коленом висок врага. -${damage} [${defender.hp}/100]`,
    `${defender.name} расстроился, а в это время наглый ${puncher.name} пошатнувшись размозжил копчиком губы оппонента. -${damage} [${defender.hp}/100]`,
    `${defender.name} осмотрелся, но внезапно ${puncher.name} робко размозжил коленом левый глаз противника. -${damage} [${defender.hp}/100]`,
    `${defender.name} осмотрелся, а ${puncher.name} вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента. -${damage} [${defender.hp}/100]`,
    `${defender.name} ковырялся в зубах, как вдруг, неожиданно ${puncher.name} отчаянно размозжил плечом мышцы пресса оппонента. -${damage} [${defender.hp}/100]`,
    `${defender.name} пришел в себя, и в это время ${puncher.name} провел разбивающий удар кистью руки, пробив блок, в голень противника. -${damage} [${defender.hp}/100]`,
    `${defender.name} пошатнулся, а в это время ${puncher.name} хихикая влепил грубый удар открытой ладонью по бедрам врага. -${damage} [${defender.hp}/100]`,
  ],
  defence: (puncher, defender) => [
    `${puncher.name} потерял момент и храбрый ${defender.name} отпрыгнул от удара открытой ладонью в ключицу.`,
    `${puncher.name} не контролировал ситуацию, и потому ${defender.name} поставил блок на удар пяткой в правую грудь.`,
    `${puncher.name} потерял момент и ${defender.name} поставил блок на удар коленом по селезенке.`,
    `${puncher.name} поскользнулся и задумчивый ${defender.name} поставил блок на тычок головой в бровь.`,
    `${puncher.name} старался провести удар, но непобедимый ${defender.name} ушел в сторону от удара копчиком прямо в пятку.`,
    `${puncher.name} обманулся и жестокий ${defender.name} блокировал удар стопой в солнечное сплетение.`,
    `${puncher.name} не думал о бое, потому расстроенный ${defender.name} отпрыгнул от удара кулаком куда обычно не бьют.`,
    `${puncher.name} обманулся и жестокий ${defender.name} блокировал удар стопой в солнечное сплетение.`,
  ],
};

const getRandomLogByType = (type, ...args) => {
  const logsByType = LOGS[type](...args);
  return logsByType[getRandom(logsByType.length - 1)];
};

export default function () {
  this.$el = document.querySelector('.chat');

  this.log = (type, level, ...args) => {
    const text = getRandomLogByType(type, ...args);

    let $message;

    switch (type) {
      case 'hit':
      case 'defence':
      case 'draw': {
        $message = new Component('p', `[${getTime()}] ${text}`);
        break;
      }
      default:
        $message = new Component('p', `${text}`);
    }

    this.$el.prepend($message.classes('message', level).get());
  };
}

const DEFAULT_CHAR_HEIGHT = 268;

const CHARACTERS = {
  anfisa: {
    weapon: ['fan'],
    animationDuration: {
      punch: 1500,
      damage: 1500,
    },
  },
};

function createElement(element, ...classNames) {
  const $htmlElement = document.createElement(element);
  $htmlElement.classList.add(...classNames);

  return $htmlElement;
}

class Player {
  animationDuration = null;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.hp = 100;
    this.props = CHARACTERS[this.name];
    this.isWinner = false;
    this.createElement();
  }

  createElement = () => {
    this.$element = createElement('div', `player${this.id}`);

    this.createLifePanel();
    this.createCharacterPlaceholder();
    this.setSprite('pose', true);
  };

  createLifePanel = () => {
    this.$lifePanel = createElement('div', 'progressbar');

    this.$lifeIndicator = createElement('div', 'life');
    this.$lifeIndicator.style.width = `${this.hp}%`;

    this.$characterName = createElement('div', 'name');
    this.$characterName.innerText = this.name;

    this.$lifePanel.append(this.$lifeIndicator, this.$characterName);
    this.$element.appendChild(this.$lifePanel);
  };

  createCharacterPlaceholder = () => {
    this.$characterPlaceholder = createElement('div', 'character');
    this.$sprite = createElement('img', 'character-img');
    this.$characterPlaceholder.appendChild(this.$sprite);
    this.$element.appendChild(this.$characterPlaceholder);
  };

  do = (action) => {
    this.$sprite.setAttribute(
      'src',
      `./assets/fighters/${this.name}/${action}.gif`,
    );
  };

  setSprite = (action, repeat) => {
    clearTimeout(this.animationDuration);
    this.do(action);

    if (!repeat) {
      this.animationDuration = setTimeout(() => {
        this.do('pose');
      }, CHARACTERS[this.name].animationDuration[action]);
    }
  };

  isLost = () => this.hp === 0;

  damage = (damage) => {
    this.hp = Math.max(0, this.hp - damage);
    this.$lifeIndicator.style.width = `${this.hp}%`;

    this.setSprite('damage');
  };

  punch = (enemy) => {
    enemy.damage(Math.ceil(Math.random() * 20));
    this.isWinner = enemy.isLost();

    this.setSprite('punch');
  };

  lose = () => {
    this.setSprite('lose', true);
  };

  win = () => {
    this.setSprite('win', true);
  };
}

class Arena {
  constructor(players) {
    this.$element = document.querySelector('.arenas');
    this.players = players;
    this.players.forEach((player) => {
      this.$element.appendChild(player.$element);
    });
  }

  congratulate(winnerName) {
    const $congratulationTitle = createElement('div', 'winnerTitle');
    $congratulationTitle.innerText = `${winnerName} wins`;
    this.$element.appendChild($congratulationTitle);
  }
}

class Game {
  constructor(players) {
    this.arena = new Arena(players);
    this.$punchTrigger = document.querySelector('.punch-trigger');
    this.$punchTrigger.addEventListener('click', this.luckyPunch);
  }

  randomize = () => {
    return this.arena.players.sort(() => Math.random() - 0.5);
  };

  luckyPunch = () => {
    const [punisher, enemy] = this.randomize();
    punisher.punch(enemy);

    if (enemy.hp === 0) {
      this.$punchTrigger.disabled = true;
      this.arena.congratulate(punisher.name);
      punisher.win();
      enemy.lose();
    }
  };
}

const game = new Game([new Player(1, 'anfisa'), new Player(2, 'anfisa')]);

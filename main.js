const CHARACTERS = {
  policewoman: {
    weapons: ['handcuffs'],
  },
  stepsister: {
    weapons: ['cross'],
  },
};

function createElement(element, ...classNames) {
  const $htmlElement = document.createElement(element);
  $htmlElement.classList.add(...classNames);

  return $htmlElement;
}

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.hp = 100;
    this.characteristic = CHARACTERS[this.name];
    this.createElement();
  }

  createElement = () => {
    this.$element = createElement('div', `player${this.id}`);

    this.createLifePanel();
    this.createCharacterPlaceholder();
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
    const $characterImg = createElement('img', 'character-img');

    $characterImg.setAttribute('src', `./assets/fighters/${this.name}.gif`);

    this.$characterPlaceholder.appendChild($characterImg);
    this.$element.appendChild(this.$characterPlaceholder);
  };

  damage = (damage) => {
    this.hp = Math.max(0, this.hp - damage);
    this.$lifeIndicator.style.width = `${this.hp}%`;
  };

  punch = (enemy) => {
    const damage = Math.ceil(Math.random() * 20);
    enemy.damage(damage);
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
    }
  };
}

const game = new Game([new Player(1, 'policewoman'), new Player(2, 'sister')]);

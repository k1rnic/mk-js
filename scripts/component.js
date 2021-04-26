export default class Component {
  #component;

  constructor(tag, text) {
    this.#component = document.createElement(tag);

    if (text) {
      this.#component.innerText = text;
    }
  }

  get = () => this.#component;

  attrs = (attrs = {}) => {
    for (let key in attrs) {
      this.#component.setAttribute(key, attrs[key]);
    }
    return this;
  };

  styles = (styles) => {
    if (styles) {
      Object.assign(this.#component.style, styles);
    }
    return this;
  };

  classes = (...cn) => {
    this.#component.classList.add(...cn);
    return this;
  };

  children = (...children) => {
    this.#component.append(...children);
    return this;
  };
}

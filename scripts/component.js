export default function (tag, text) {
  this.$el = document.createElement(tag);

  if (text) {
    this.$el.innerText = text;
  }

  this.get = () => this.$el;

  this.attrs = (attrs = {}) => {
    for (let key in attrs) {
      this.$el.setAttribute(key, attrs[key]);
    }
    return this;
  };

  this.styles = (styles) => {
    if (styles) {
      Object.assign(this.$el.style, styles);
    }
    return this;
  };

  this.classes = (...cn) => {
    this.$el.classList.add(...cn);
    return this;
  };

  this.children = (...children) => {
    this.$el.append(...children);
    return this;
  };
}

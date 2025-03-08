import { createElement } from '../render.js';

function createPointTemplate() {
  return `
        <ul class="trip-events__list"></ul>`;
}

export default class PointsList {
  getTemplate() {
    return createPointTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

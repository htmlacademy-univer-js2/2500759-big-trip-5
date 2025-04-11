import AbstractView from '../framework/view/abstract-view';
import { createElement } from '../render';
function createPointTemplate() {
  return '<ul class="trip-events__list"></ul>';
}
export default class PointsList extends AbstractView{
  get template() {
    return createPointTemplate();
  }

  getElement() {
    return createElement(this.template);
  }
}

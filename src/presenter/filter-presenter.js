import { render } from '../framework/render.js';
import Filter from '../view/filterView.js';

const filterContainer = document.querySelector('.trip-controls__filters');

export default class FilterPresenter {
  init() {
    render(new Filter(), filterContainer);
  }
}

import { render, RenderPosition } from '../framework/render.js';
import TripInfo from '../view/infoView.js';
import { SortTypes } from '../const.js';
import { sort } from '../utils.js';

export default class TripInfoPresenter {
  #container = null;
  #eventsModel = null;

  constructor(container, eventsModel) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.eventsList = [...this.#eventsModel.events];
    this.destinationsList = [...this.#eventsModel.destinations];
    render(new TripInfo({points: sort[SortTypes.DAY](this.eventsList), destinations: this.destinationsList}), this.#container, RenderPosition.AFTERBEGIN);
  }
}

import { render, RenderPosition } from '../framework/render.js';
import TripInfo from '../view/infoView.js';
import { remove } from '../framework/render.js';

export default class TripInfoPresenter {
  #hasRendered = false;
  #container = null;
  #eventsModel = null;
  #pointsModel = null;
  #destinationsModel = null;
  #tripInfoComponent = null;

  constructor({ container, pointsModel, destinationsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    if (this.#hasRendered) {
      return;
    }

    const points = this.#pointsModel.getPoints() || [];
    const destinations = this.#destinationsModel.getDestinations() || [];

    this.#hasRendered = true;
    this.#tripInfoComponent = new TripInfo({ points, destinations });
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === 'INIT' || updateType === 'MINOR' || updateType === 'MAJOR') {
      this.#clearTripInfo();
      this.#hasRendered = false;
      this.#renderTripInfo();
    }
  };

  #clearTripInfo() {
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }
  }
}

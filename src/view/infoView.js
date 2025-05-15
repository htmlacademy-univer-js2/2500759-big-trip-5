import AbstractView from '../framework/view/abstract-view';
import { getRouteTitle, getTripDates } from '../utils';

function createTripInfoTemplate({ points, destinations }) {
  if (!points || !points.length || !destinations || !destinations.length) {
    return '<section class="trip-main__trip-info trip-info"></section>';
  }
  const routeTitle = getRouteTitle(points, destinations);
  const dates = getTripDates(points);
  const totalPrice = points.reduce((total, point) => total + (point.basePrice || point.price || 0), 0);
  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${routeTitle}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;
}

export default class TripInfo extends AbstractView {
  #points = [];
  #destinations = [];

  constructor({ points = [], destinations = [] }) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate({
      points: this.#points,
      destinations: this.#destinations,
    });
  }

  #calculateTotalPrice() {
    return this.#points.reduce((total, point) => total + point.price, 0);
  }

  #getDestinationNames() {
    return this.#points.map((point) => this.#destinations.find((dest) => dest.id === point.destination).name);
  }
}

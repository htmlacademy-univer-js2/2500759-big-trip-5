import AbstractView from '../framework/view/abstract-view';
import { formateDate } from '../utils';
import { DATE_FORMAT } from '../const';
const MAX_DESTINATIONS_TO_RENDER = 3;

function createTripInfoTemplate({totalPrice, destinationNames, points}) {
  const destinations = Array.from(new Set(destinationNames));
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations.length > MAX_DESTINATIONS_TO_RENDER ? `${destinations[0]} &mdash;...&mdash; ${destinations[destinations.length - 1]}` : destinations.join(' &mdash; ')}</h1>
        <p class="trip-info__dates">${formateDate(points[0].dateFrom, DATE_FORMAT.TOTAL_MONTH)}&nbsp;&mdash;&nbsp;${formateDate(points[points.length - 1].dateTo, DATE_FORMAT.TOTAL_MONTH)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
}

export default class TripInfo extends AbstractView {
  #points = null;
  #destinations = null;

  constructor({points, destinations}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate({
      totalPrice: this.#calculateTotalPrice(),
      destinationNames: this.#getDestinationNames(),
      points: this.#points
    });
  }

  #calculateTotalPrice() {
    return this.#points.reduce((total, point) => total + point.price, 0);
  }

  #getDestinationNames() {
    return this.#points.map((point) => this.#destinations.find((dest) => dest.id === point.destination).name);
  }
}

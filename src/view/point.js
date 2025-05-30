import AbstractView from '../framework/view/abstract-view.js';
import { formatDate, calculateDuration } from '../utils.js';
import { DateFormats } from '../const.js';
import he from 'he';

function createPointTemplate(point, allOffers, destinations) {
  const {price, dateFrom, dateTo, isFavorite, destination, offers, type} = point;

  const offersForEventType = allOffers.find((offer) => offer.type === type);
  const destinationInfo = destinations.find((dest) => dest.id === destination);
  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${formatDate(dateFrom, DateFormats.MONTH)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${he.encode(destinationInfo.name)}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${formatDate(dateFrom, DateFormats.TIME)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="2019-03-18T11:00">${formatDate(dateTo, DateFormats.TIME)}</time>
                  </p>
                  <p class="event__duration">${calculateDuration(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offersForEventType.offers.map((offer) => {
    if (offers.includes(offer.id)) {
      return (`<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </li>`);
    }
  }).join('')}
                </ul>
                <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}

export default class EventView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #handleEditBtnClick = null;
  #handleFavoriteBtnClick = null;

  constructor({point, offers, destinations, onEditBtnClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditBtnClick = onEditBtnClick;
    this.#handleFavoriteBtnClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #editClickHandler = () => {
    this.#handleEditBtnClick();
  };

  #favoriteClickHandler = () => {
    this.#handleFavoriteBtnClick();
  };
}

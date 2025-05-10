import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalize, getFormTimeString } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function getEventListItemTemplate(offersType, id) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${offersType}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${offersType}">
      <label class="event__type-label  event__type-label--${offersType}" for="event-type-${offersType}-${id}">${capitalize(offersType)}</label>
    </div>`
  );
}

function getEventListTemplate(offersTypes) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${offersTypes.map(getEventListItemTemplate).join('')}
      </fieldset>
    </div>`
  );
}

function getEventDestinationsDataListItemTemplate({name: destinationName}) {
  return (`<option value="${destinationName}"></option>`);
}

function getEventDestinationsListTemplate(destinations) {
  return (
    `<datalist id="destination-list-1">
      ${destinations.map(getEventDestinationsDataListItemTemplate).join('')}
    </datalist>`
  );
}

function getAvailableOfferTemplate(offersData, isActive) {
  const {price, title, id} = offersData;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isActive ? 'checked' : ''}>
      <label class="event__offer-label" for="${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function getAvailableOffersTemplate(offersData, pointActiveOffers) {
  if (!offersData || !Array.isArray(offersData)) {
    return '';
  }
  return (
    `<div class="event__available-offers">
      ${offersData.map((offerData) => {
      const isAсtiveOffer = pointActiveOffers.includes(offerData.id);

      return getAvailableOfferTemplate(offerData, isAсtiveOffer);
    })
      .join('')}
    </div>`
  );
}

function getEventPhotosTemplate(pictures) {
  return(
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map(getEventPhotoTemplate).join('')}
      </div>
    </div>`
  );
}

function getEventPhotoTemplate({src, description}) {
  return (`<img class="event__photo" src="${src}" alt="${description}">`);
}

function createEditFormTemplate(pointData, allOffers, destinations) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    activeDestination,
    offers,
    type
  } = pointData;

  const name = activeDestination?.name || '';
  const description = activeDestination?.description || '';
  const pictures = activeDestination?.pictures || [];

  const eventTimeStart = getFormTimeString(dateFrom);
  const eventTimeEnd = getFormTimeString(dateTo);
  const offersByCurrentPointType = allOffers[type] || [];

  const offersListTemplate = getEventListTemplate(Object.keys(allOffers));
  const destinationsListTemplate = getEventDestinationsListTemplate(destinations);
  const availableOffersTemplate = getAvailableOffersTemplate(offersByCurrentPointType, offers);
  const eventPhotosTemplate = getEventPhotosTemplate(pictures);
  const destinationNames = destinations.map((d) => d.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const saveButtonText = pointData.isSaving ? 'Saving...' : 'Save';
  const deleteButtonText = pointData.isDeleting ? 'Deleting...' : 'Delete';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            ${offersListTemplate}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1" pattern="^(${destinationNames})$" title="Выберите город из списка">
            ${destinationsListTemplate}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventTimeStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventTimeEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${pointData.isDisabled ? 'disabled' : ''}>${saveButtonText}</button>
          <button class="event__reset-btn" type="reset" ${pointData.isDisabled ? 'disabled' : ''}>${deleteButtonText}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersByCurrentPointType.length ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            ${availableOffersTemplate}
          </section>` : ''}

         ${activeDestination ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            ${eventPhotosTemplate}
          </section>` : ''}
        </section>
      </form>
    </li>`
  );
}

export default class editForm extends AbstractStatefulView {
  #allOffers;
  #destinations;
  #handleSubmit;
  #state;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, allOffers, destinations, onFormSubmit}) {
    super();
    this.#allOffers = allOffers;
    this.#destinations = destinations;
    this.#handleSubmit = onFormSubmit;
    this.#state = this.parsePointToState(point);
    this._setState(this.parsePointToState(point));
    this._restoreHandlers();
  }

  #formSubmit = (evt) => {
    evt.preventDefault();
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');

    if (!this.#destinations.some((d) => d.name === destinationInput.value)) {
      destinationInput.setCustomValidity('Выберите город из списка');
      destinationInput.reportValidity();
      return;
    }

    if (!/^\d+$/.test(priceInput.value)) {
      priceInput.setCustomValidity('Введите корректную цену');
      priceInput.reportValidity();
      return;
    }

    destinationInput.setCustomValidity('');
    priceInput.setCustomValidity('');

    if (evt.submitter?.classList?.contains('event__reset-btn')) {
      this.#handleDelete();
    } else {
      this.#handleSubmit(this.parseStateToPoint(this._state));
    }
  };

  #handleDelete = () => {
    this.#handleSubmit({ ...this.parseStateToPoint(this._state), isDeleting: true });
  };

  #replaceEditForm = () => {
    this.destroy();
  };

  get template() {
    return createEditFormTemplate(
      this._state,
      this.#allOffers,
      this.#destinations
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event')
      .addEventListener('submit', this.#formSubmit);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleDelete);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formSubmit);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#pointDestinationChangeHandler);

    [...this.element.querySelectorAll('.event__type-input')].forEach((typeInputElement) => {
      typeInputElement.addEventListener('change', this.#pointTypeChangeHandler);
    });
    [...this.element.querySelectorAll('.event__offer-checkbox')].forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offerChangeHandler);
    });

    this.element.querySelector('.event__input--price')
      .addEventListener('keydown', this.#priceInputHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationInputHandler);

    this.#initDatepickers();
  }

  #priceInputHandler = (evt) => {
    if (!/[\d]|Backspace|Delete|Tab|Arrow/.test(evt.key)) {
      evt.preventDefault();
    }
  };

  #destinationInputHandler = (evt) => {
    const input = evt.target;
    const value = input.value.toLowerCase();
    const hasMatch = this.#destinations.some((d) => d.name.toLowerCase().includes(value)
    );
    if (!hasMatch && value.length > 0) {
      input.setCustomValidity('Город не найден в списке');
    } else {
      input.setCustomValidity('');
    }
  };

  #initDatepickers() {
    const dateFromInput = this.element.querySelector('#event-start-time-1');
    const dateToInput = this.element.querySelector('#event-end-time-1');

    this.#datepickerFrom = flatpickr(dateFromInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: (selectedDates) => {
        this.updateElement({
          dateFrom: selectedDates[0]
        });
      }
    });

    this.#datepickerTo = flatpickr(dateToInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      onChange: (selectedDates) => {
        this.updateElement({
          dateTo: selectedDates[0]
        });
      }
    });
  }

  destroy() {
    super.destroy();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const newType = evt.target.value;
    if(this._state.type !== newType) {
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();

    const newDestinationName = evt.target.value;
    const newDestination = this.#destinations.find(({ name }) => name === newDestinationName);

    if (!newDestination) {
      evt.target.setCustomValidity('Выберите город из списка');
      evt.target.reportValidity();
      return;
    }
    evt.target.setCustomValidity('');
    this.updateElement({
      destination: newDestination.id,
      activeDestination: newDestination
    });
  };


  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = parseInt(evt.target.name, 10);
    const newOffers = [...this._state.offers];

    if (newOffers.includes(offerId)) {
      newOffers.splice(newOffers.indexOf(offerId), 1);
    } else {
      newOffers.push(offerId);
    }

    this.updateElement({
      offers: newOffers
    });
  };

  parsePointToState(point) {
    const state = {...point};
    if (point.destination) {
      state.activeDestination = this.#destinations.find(({id}) => id === point.destination) || null;
    } else {
      state.activeDestination = null;
    }
    return state;
  }

  parseStateToPoint(state) {
    const point = { ...state };

    delete point.activeDestination;

    return {
      ...point
    };
  }

  updateElement(data) {
    this.#state = { ...this.#state, ...data };
    this.#rerender();
  }

  shake(callback) {
    this.element.style.animation = 'shake 0.6s';
    setTimeout(() => {
      this.element.style.animation = '';
      callback?.();
    }, 600);
  }

  #rerender() {
    const prevElement = this.element;
    const parent = prevElement?.parentElement;
    if (!parent) {
      return;
    }

    this.removeElement();
    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);
    this._restoreHandlers();
    this.#initDatepickers();
  }
}

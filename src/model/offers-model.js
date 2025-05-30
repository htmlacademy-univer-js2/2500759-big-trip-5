import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #eventsApiService = null;
  #offers = [];

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get offers() {
    return this.#offers;
  }

  init() {
    this.#eventsApiService.offers.then((offers) => {
      this.#offers = offers;
    }).catch((err) => err);
  }
}

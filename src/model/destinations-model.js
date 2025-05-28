import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #eventsApiService = null;
  #destinations = [];

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init() {
    this.#eventsApiService.destinations.then((destinations) => {
      this.#destinations = destinations;
    }).catch((err) => err);
  }
}

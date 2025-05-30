import { RenderPosition, render, remove } from '../framework/render';
import { sort } from '../utils.js';
import { SortTypes } from '../const.js';
import HeaderView from '../view/header-view';

export default class HeaderPresenter {
  #container = null;
  #eventsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #headerComponent = null;

  constructor(container, eventsModel, destinationsModel, offersModel) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#eventsModel.addObserver(this.#handleEventsChange);
  }

  get events() {
    return this.#eventsModel.events;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init() {
    this.#renderHeaderList();
  }

  #renderHeaderList() {
    if (this.#headerComponent) {
      remove(this.#headerComponent);
    }
    if (this.events.length === 0) {
      return;
    }
    this.#headerComponent = new HeaderView({
      points: sort[SortTypes.DAY](this.events),
      destinations: this.destinations,
      offers: this.offers
    });
    render(this.#headerComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleEventsChange = () => {
    this.#renderHeaderList();
  };
}

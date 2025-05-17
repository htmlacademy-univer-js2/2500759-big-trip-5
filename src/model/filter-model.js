export default class FilterModel {
  #currentFilter = 'everything';
  #observers = [];

  get filter() {
    return this.#currentFilter;
  }

  setFilter(filter) {
    if (this.#currentFilter !== filter) {
      this.#currentFilter = filter;
      this.#notifyObservers(filter);
    }
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers(filter) {
    this.#observers.forEach((observer) => observer(filter));
  }
}

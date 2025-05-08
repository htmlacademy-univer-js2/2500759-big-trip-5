export default class FilterModel {
  #currentFilter = 'everything';
  #observers = [];

  get filter() {
    return this.#currentFilter;
  }

  setFilter(newFilter) {
    if (this.#currentFilter !== newFilter) {
      this.#currentFilter = newFilter;
      this.#notifyObservers();
    }
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}

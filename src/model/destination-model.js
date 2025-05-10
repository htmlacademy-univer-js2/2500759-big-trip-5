export default class DestinationModel {
  #destinations = [];
  #apiService = null;
  constructor(apiService) {
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.getDestinations();
      return true;
    } catch (err) {
      this.#destinations = [];
      return false;
    }
  }

  getById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}

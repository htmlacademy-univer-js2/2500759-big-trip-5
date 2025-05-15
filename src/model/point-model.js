import Observable from '../framework/observable';
export default class PointsModel extends Observable {
  #points = [];
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #apiService = null;

  constructor(filterModel, apiService) {
    super();
    this.#filterModel = filterModel;
    this.#apiService = apiService;
  }

  getPoints() {
    const filter = this.#filterModel?.filter || 'everything';
    const now = new Date();

    switch (filter) {
      case 'future':
        return this.#points.filter((point) => new Date(point.dateFrom) > now);
      case 'present':
        return this.#points.filter((point) => new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now
        );
      case 'past':
        return this.#points.filter((point) => new Date(point.dateTo) < now);
      case 'everything':
      default:
        return [...this.#points];
    }
  }

  async init() {
    try {
      const points = await this.#apiService.getPoints();
      this.#points = points.map(this.#adaptToClient);
      this._notify('INIT');
      return true;
    } catch (err) {
      this.#points = [];
      return false;
    }
  }

  setPoints(pointsData) {
    this.#points = pointsData;
  }

  async updatePoint(update) {
    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
      this._notify('MINOR');
      return true;
    } catch (err) {
      return false;
    }
  }

  async addPoint(point) {
    try {
      const response = await this.#apiService.addPoint(point);
      const newPoint = this.#adaptToClient(response);
      this.#points.push(newPoint);
      this._notify('MAJOR');
      return true;
    } catch (err) {
      return false;
    }
  }

  async deletePoint(id) {
    try {
      await this.#apiService.deletePoint(id);
      this.#points = this.#points.filter((point) => point.id !== id);
      this._notify('MAJOR');
      return true;
    } catch (err) {
      return false;
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      basePrice: Number(point['base_price']) || 0,
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}

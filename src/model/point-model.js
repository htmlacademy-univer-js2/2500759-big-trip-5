//import { points } from '../mock/points.js';

export default class PointsModel {
  #points = [];
  #filterModel = null;

  constructor(filterModel) {
    this.#filterModel = filterModel;
  }

  init(pointsData) {
    this.#points = pointsData;
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

  setPoints(pointsData) {
    this.#points = pointsData;
  }

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
  }

  addPoint(point) {
    this.#points.push(point);
  }

  deletePoint(id) {
    this.#points = this.#points.filter((point) => point.id !== id);
  }
}

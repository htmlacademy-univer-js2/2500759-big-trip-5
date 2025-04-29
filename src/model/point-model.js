import { points } from '../mock/points.js';

export default class PointsModel {
  #points = [];

  init() {
    this.#points = points;
  }

  getPoints() {
    return this.#points;
  }

  setPoints(pointsData) {
    this.#points = pointsData;
  }

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
  }
}

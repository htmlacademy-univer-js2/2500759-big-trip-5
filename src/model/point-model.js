import { points } from '../mock/points.js';

export default class PointsModel {
  #points = [];

  init() {
    this.#points = points;
  }

  getPoints() {
    return this.#points;
  }
}

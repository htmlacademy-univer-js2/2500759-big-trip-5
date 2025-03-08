import { destination } from '../mock/destinations.js';

export default class DestinationModel {
  constructor() {
    this.destination = [];
  }

  init() {
    this.destination = destination;
  }

  getDestination() {
    return this.destination;
  }
}

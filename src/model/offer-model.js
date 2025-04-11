import { offers } from '../mock/offers.js';

export default class OffersModel {
  constructor() {
    this.offers = [];
  }

  init() {
    this.offers = offers;
  }

  getOffers() {
    return this.offers;
  }

  getByType(type) {
    return this.offers.find((offer) => offer.type === type)?.offers || [];
  }
}

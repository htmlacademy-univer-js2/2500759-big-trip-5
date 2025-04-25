import { offers } from '../mock/offers.js';

export default class OffersModel {
  #offers = offers;

  constructor() {
    this.#offers = offers;
  }

  get allOffers() {
    return this.#offers.reduce((acc, offerGroup) => {
      acc[offerGroup.type] = offerGroup.offers;
      return acc;
    }, {});
  }

  getOffersByType(type) {
    if (!this.#offers || !Array.isArray(this.#offers)) {
      return [];
    }
    const offerGroup = this.#offers.find((group) => group.type === type);
    return offerGroup?.offers || [];
  }
}

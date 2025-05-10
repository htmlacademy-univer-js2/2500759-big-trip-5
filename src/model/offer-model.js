export default class OffersModel {
  #offers = [];
  #apiService = null;

  constructor(apiService) {
    this.#apiService = apiService;
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

  async init() {
    try {
      this.#offers = await this.#apiService.getOffers();
      return true;
    } catch (err) {
      this.#offers = [];
      return false;
    }
  }
}

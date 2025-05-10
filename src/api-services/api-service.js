import { ApiMethod, ContentType } from '../const.js';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  async #load({
    url,
    method = ApiMethod.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      { method, body, headers },
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError(err) {
    throw err;
  }

  async getPoints() {
    const response = await this.#load({ url: 'points' });
    return ApiService.parseResponse(response);
  }

  async getDestinations() {
    const response = await this.#load({ url: 'destinations' });
    return ApiService.parseResponse(response);
  }

  async getOffers() {
    const response = await this.#load({ url: 'offers' });
    return ApiService.parseResponse(response);
  }

  async updatePoint(point) {
    const response = await this.#load({
      url: `points/${point.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': ContentType.JSON }),
    });
    return ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this.#load({
      url: 'points',
      method: ApiMethod.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': ContentType.JSON }),
    });
    return ApiService.parseResponse(response);
  }

  async deletePoint(id) {
    const response = await this.#load({
      url: `points/${id}`,
      method: ApiMethod.DELETE,
    });
    return ApiService.parseResponse(response);
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'base_price': point.basePrice,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}

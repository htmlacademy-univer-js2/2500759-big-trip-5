import AbstractView from '../framework/view/abstract-view';

function createPointsListTemplate() {
  return `
      <section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>
        <ul class="trip-events__list"></ul>
      </section>
    `;
}
export default class PointsList extends AbstractView{
  get template() {
    return createPointsListTemplate();
  }

  get listContainer() {
    return this.element.querySelector('.trip-events__list');
  }
}

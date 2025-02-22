import CreateForm from '../view/createFormView.js';
import EditForm from '../view/editFormView.js';
import RoutePoint from '../view/routePointView.js';
import { render, RenderPosition } from '../render.js';

export default class MainPresenter {

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new EditForm(), this.container, RenderPosition.BEFOREEND);
    render(new CreateForm(), this.container, RenderPosition.BEFOREEND);
    for (let i = 0; i < 3; i++) {
      render(new RoutePoint(), this.container, RenderPosition.BEFOREEND);
    }
  }
}

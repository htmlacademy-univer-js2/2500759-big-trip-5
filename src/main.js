import Filter from '../src/view/filterView.js';
import Sort from '../src/view/sortView.js';
import createForm from '../src/view/createFormView.js';
import editForm from '../src/view/editFormView.js';
import routePoint from '../src/view/routePointView.js';

import { render, RenderPosition } from '../src/render.js';

export default class Main {

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new editForm(), this.container, RenderPosition.BEFOREEND);
    render(new createForm(), this.container, RenderPosition.BEFOREEND);
    for (let i = 0; i < 3; i++) {
      render(new routePoint(), this.container, RenderPosition.BEFOREEND);
    }
  }
}


import { render, replace, remove } from '../framework/render';
import routePoint from '../view/routePointView';
import editForm from '../view/editFormView';
import { Mode } from '../const';
import { isEscapeKey } from '../utils';

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #offers = [];
  #destinations = [];

  constructor({
    pointListContainer,
    offers,
    destinations,
    onDataChange,
    onModeChange
  }) {
    this.#pointListContainer = pointListContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new routePoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: () => {
        this.#replacePoint();
        document.addEventListener('keydown', this.#onEscKeyDownClose);
      },
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#pointEditComponent = new editForm({
      point: this.#point,
      destinations: this.#destinations || [],
      offers: this.#offers || [],
      onFormSubmit: () => {
        this.#handleSubmit(this.#point);
        document.removeEventListener('keydown', this.#onEscKeyDownClose);
      },
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #replacePoint() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditForm() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDownClose);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeyDownClose = (evt) => {
    if (isEscapeKey) {
      evt.preventDefault();
      this.#replaceEditForm();
      document.removeEventListener('keydown', this.#onEscKeyDownClose);
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceEditForm();
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditForm();
    }
  }
}

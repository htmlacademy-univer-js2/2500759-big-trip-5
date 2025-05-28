import EventView from '../view/point.js';
import EventEditorView from '../view/point-editor.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import { UpdateType, UserAction } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointComponent = null;
  #pointEditComponent = null;
  #newPointFormComponent = null;
  #point = null;
  #pointsContainer = null;
  #offers = [];
  #destinations = [];
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({pointsContainer, offers, destinations, onDataChange, onModeChange, newPointFormComponent}) {
    this.#pointsContainer = pointsContainer;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#newPointFormComponent = newPointFormComponent;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new EventView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditBtnClick: this.#editBtnClickHandler,
      onFavoriteClick: this.#favoriteBtnClickHandler,
    });

    this.#pointEditComponent = new EventEditorView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#editFormSubmitHandler,
      onFormReset: this.#editFormResetHandler,
      onDeleteClick: this.#deletePointHandler
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetFormView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isSaving: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDeleting: true
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #replacePointToEditForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escapeKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escapeKeydownHandler);
    }
  };

  #editBtnClickHandler = () => {
    this.#replacePointToEditForm();
    if (this.#newPointFormComponent) {
      this.#newPointFormComponent.destroy();
    }
  };

  #favoriteBtnClickHandler = () => {
    this.#handleDataChange(UserAction.UPDATE_EVENT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #deletePointHandler = (point) => {
    this.#handleDataChange(UserAction.DELETE_EVENT, UpdateType.MINOR, point);
  };

  #editFormSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.UPDATE_EVENT, UpdateType.MINOR, point);
  };

  #editFormResetHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
  };
}

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
  #destinations = [];
  #offersModel = null;
  #loadingComponent = null;

  get pointComponent() {
    return this.#pointComponent;
  }

  constructor({
    pointListContainer,
    offersModel,
    destinations,
    onDataChange,
    onModeChange,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#destinations = destinations;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#loadingComponent = null;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    const currentTypeOffers = this.#offersModel?.getOffersByType(point.type) || [];

    if (!this.#point.offers) {
      this.#point.offers = [];
    }

    this.#pointComponent = new routePoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: currentTypeOffers,
      onEditClick: this.#editBtnClickHandler,
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#pointEditComponent = new editForm({
      point: this.#point,
      destinations: this.#destinations || [],
      allOffers: this.#offersModel.allOffers,
      onFormSubmit: this.#handleSubmit,
      onFormReset: this.#editFormResetHandler,
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

  #replacePoint = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
  };

  #replaceEditForm() {
    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, this.#pointEditComponent);
      this.#pointEditComponent.destroy();
      document.removeEventListener('keydown', this.#onEscKeyDownClose);
      this.#mode = Mode.DEFAULT;
      this.#handleModeChange();
    }
  }

  #onEscKeyDownClose = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      if (this.#point.isNew) {
        this.destroy();
        this.#handleDataChange({ action: 'DELETE', point: this.#point });
      } else {
        this.#replaceEditForm();
      }
    }
  };

  #handleFavoriteClick = () => {
    const updatedPoint = {...this.#point,isFavorite: !this.#point.isFavorite};
    this.#handleDataChange({ action: 'UPDATE', point: updatedPoint });
    this.#point = updatedPoint;
  };

  #showError = (message) => {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-notification';
    errorContainer.textContent = message;
    document.body.appendChild(errorContainer);
    setTimeout(() => {
      errorContainer.remove();
    }, 3000);
  };

  #handleSubmit = async (point) => {
    if (point.isClosing) {
      this.#replaceEditForm();
      return;
    }

    try {
      if (point.isDeleting) {
        await this.#handleDataChange({ action: 'DELETE', point });
      } else if (point.isNew) {
        await this.#handleDataChange({ action: 'ADD', point });
      } else {
        await this.#handleDataChange({ action: 'UPDATE', point });
      }
      this.#replaceEditForm();
    } catch {
      this.setAborting();
    }
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

  #editBtnClickHandler = () => {
    this.#replacePoint();
    this.#handleModeChange();
    document.addEventListener('keydown', this.#onEscKeyDownClose);
    this.#mode = Mode.EDITING;
  };

  #editFormResetHandler = () => {
    this.#replaceEditForm();
    document.removeEventListener('keydown', this.#onEscKeyDownClose);
  };

  setEditMode() {
    if (!this.#pointEditComponent || !this.#pointComponent) {
      this.init(this.#point);
    }
    this.#replacePoint();
    this.#mode = Mode.EDITING;
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.EDITING) {
      const resetFormState = () => {
        this.#pointEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };

      this.#pointEditComponent.shake(resetFormState);
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }
}

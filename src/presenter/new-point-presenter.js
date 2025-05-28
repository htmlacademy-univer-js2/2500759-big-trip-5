import { UpdateType, UserAction } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import AddPointView from '../view/point-creator';


export default class NewPointPresenter {
  #container = null;
  #offers = null;
  #destinations = null;
  #handleDataChange = null;
  #handleResetForm = null;
  #addPointFormComponent = null;

  constructor({container, offers, destinations, onDataChange, onResetForm}) {
    this.#container = container;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleResetForm = onResetForm;
  }

  init() {
    this.#addPointFormComponent = new AddPointView({
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onFormReset: this.#closeAddPointForm,
    });
    render(this.#addPointFormComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    this.#closeAddPointForm();
  }

  setSaving() {
    this.#addPointFormComponent.updateElement({
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#addPointFormComponent.updateElement({
        isSaving: false
      });
    };

    this.#addPointFormComponent.shake(resetFormState);
  }

  #closeAddPointForm = () => {
    remove(this.#addPointFormComponent);
    this.#handleResetForm();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.ADD_EVENT, UpdateType.MAJOR, point);
  };
}

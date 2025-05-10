import AbstractView from '../framework/view/abstract-view.js';

function createLoadingTemplate({isSaving, isDeleting}) {
  let message = 'Loading...';
  if (isSaving) {
    message = 'Saving...';
  } else if (isDeleting) {
    message = 'Deleting...';
  }
  return `
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="trip-events__msg">${message}</p>
    </div>
  `;
}

export default class LoadingView extends AbstractView {
  constructor({isSaving = false, isDeleting = false} = {}) {
    super();
    this._state = {isSaving, isDeleting};
  }

  get template() {
    return createLoadingTemplate(this._state);
  }
}

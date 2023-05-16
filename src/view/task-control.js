//Parents
import AbstractView from './abstract.js';

//Supporting const
import { UpdateElement, ControlType } from '../const.js';

///

//Function

const isLoadingClass = (control, currentControl) => control === currentControl ? 'loading' : '';


//Template

const createTaskControlsTemplate = (taskData, currentControl) => {
  const { is_archived, is_favorite, isSaving } = taskData;

  return `<div class="card__control">
        <button type="button" class="card__btn card__btn--edit" ${isSaving ? 'disabled' : ''}>
          edit
        </button>
        <button type="button" class="card__btn card__btn--archive ${is_archived ? 'card__btn--active': ''}
        ${isSaving ? isLoadingClass(currentControl, ControlType.ARCHIVE) : ''}" data-control="archive" ${isSaving ? 'disabled' : ''}>
          <span>a</span><span>r</span><span>c</span><span>h</span><span>i</span><span>v</span><span>e</span>
        </button>
        <button type="button" class="card__btn card__btn--favorites ${is_favorite ? 'card__btn--active': ''}
        ${isSaving ? isLoadingClass(currentControl, ControlType.FAVORITES) : ''}" data-control="favorites" ${isSaving ? 'disabled' : ''}>
          <span>f</span><span>a</span><span>v</span><span>o</span><span>r</span><span>i</span><span>t</span><span>e</span><span>s</span>
        </button>
      </div>`;
};


export default class TaskControls extends AbstractView {
  constructor(taskData) {
    super();

    //Data
    this._taskData = this.parseTaskToData(taskData);

    //Variable
    this._currentControl = null;

    //Handler
    this._onClickEditButton = this._onClickEditButton.bind(this);
    this._onClickArchiveButton = this._onClickArchiveButton.bind(this);
    this._onClickFavoritesButton = this._onClickFavoritesButton.bind(this);

  }

  getTemplate() {
    return createTaskControlsTemplate(this._taskData, this._currentControl);
  }


  //Data

  parseTaskToData(data) {
    return Object.assign(
      {},
      data,
      {
        isSaving: false,
      },
    );
  }

  parseDataToTask(data) {
    data = Object.assign(
      {},
      data,
    );

    delete data.isSaving;

    return data;
  }


  //Update

  updateData(update, updateElement = UpdateElement.UPDATE) {
    if (!update) {
      return;
    }

    this._taskData = JSON.parse(JSON.stringify(this._taskData));

    this._taskData = Object.assign(
      {},
      this._taskData,
      update,
    );

    if (updateElement) {
      this._updateElement();
    }
  }

  _updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }


  //Handler

  setClickEditButtonHandler(callback) {
    this._callback.clickEditButton = callback;
    this.getElement().querySelector('.card__btn--edit').addEventListener('click', this._onClickEditButton);
  }

  _onClickEditButton(evt) {
    evt.preventDefault();
    this._callback.clickEditButton();
  }

  setClickArchiveButtonHandler(callback) {
    this._callback.clickArchiveButton = callback;
    this.getElement().querySelector('.card__btn--archive').addEventListener('click', this._onClickArchiveButton);
  }

  _onClickArchiveButton(evt) {
    evt.preventDefault();
    this._currentControl = evt.target.closest('.card__btn').dataset.control;

    this.updateData({
      is_archived: !this._taskData.is_archived,
    }, UpdateElement.NO_UPDATE);

    this._callback.clickArchiveButton(this.parseDataToTask(this._taskData));
  }

  setClickFavoritesButtonHandler(callback) {
    this._callback.clickFavoritesButton = callback;
    this.getElement().querySelector('.card__btn--favorites').addEventListener('click', this._onClickFavoritesButton);
  }

  _onClickFavoritesButton(evt) {
    evt.preventDefault();
    this._currentControl = evt.target.closest('.card__btn').dataset.control;

    this.updateData({
      is_favorite: !this._taskData.is_favorite,
    }, UpdateElement.NO_UPDATE);

    this._callback.clickFavoritesButton(this.parseDataToTask(this._taskData));
  }

  _restoreHandlers() {
    this.setClickEditButtonHandler(this._callback.clickEditButton);
    this.setClickArchiveButtonHandler(this._callback.clickArchiveButton);
    this.setClickFavoritesButtonHandler(this._callback.clickFavoritesButton);
  }

}

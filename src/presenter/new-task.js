//View
import TaskEditorView from '../view/task-editor.js';

//Supporting const
import { State, UserAction, TaskType, StateDatepiker } from '../const.js';

//Supporting function
import { render, remove } from '../utils/render.js';

////


const EMPTY_TASK = {
  color: 'black',
  description: '',
  due_date: null,
  is_archived: false,
  is_favorite: false,
  repeating_days: {
    fr: false,
    mo: false,
    sa: false,
    su: false,
    th: false,
    tu: false,
    we: false,
  },
};


export default class NewTaskPresenter {
  constructor(container, onViewUpdateData, onCloseNewTask) {

    //Callback
    this._onViewUpdateData = onViewUpdateData;
    this._onCloseNewTask = onCloseNewTask;

    //Container
    this._container = container;

    //Data
    this._taskData = EMPTY_TASK;

    //Component
    this._taskEditorComponent = null;

    //Handler
    this._onClickDeleteButton = this._onClickDeleteButton.bind(this);
    this._onClickSaveButton = this._onClickSaveButton.bind(this);

    this._onActionDatepiker = this._onActionDatepiker.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onEnterKeyDown = this._onEnterKeyDown.bind(this);
  }

  //Render

  renderNewTask() {
    this._taskEditorComponent = new TaskEditorView(this._taskData, TaskType.NEW);

    this._taskEditorComponent.setClickDeleteButtonHandler(this._onClickDeleteButton);
    this._taskEditorComponent.setClickSaveButtonHandler(this._onClickSaveButton);
    this._setEditorHandlers();

    render(this._container, this._taskEditorComponent, 'afterbegin');
  }


  //Remove

  removeNewTask() {
    this._taskEditorComponent.removeDatepicker();

    remove(this._taskEditorComponent);
    this._taskEditorComponent = null;

    this._removeEditorHandlers();
  }


  //Handler

  _setEditorHandlers() {
    document.addEventListener('keydown', this._onEscKeyDown);
    document.addEventListener('keydown', this._onEnterKeyDown);
    document.addEventListener('datepiker', this._onActionDatepiker);
  }

  _removeEditorHandlers() {
    document.removeEventListener('keydown', this._onEscKeyDown);
    document.removeEventListener('keydown', this._onEnterKeyDown);
    document.removeEventListener('datepiker', this._onActionDatepiker);
  }

  _onClickSaveButton(taskData) {
    this._onViewUpdateData(taskData, UserAction.ADD);
  }

  _onClickDeleteButton() {
    this._onCloseNewTask();
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._onCloseNewTask();
    }
  }

  _onEnterKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      if (this._isOpenDatepiker) {
        return;
      }

      this._onViewUpdateData(this._taskEditorComponent.getData(), UserAction.ADD);
    }
  }

  _onActionDatepiker(evt) {
    switch (evt.detail) {
      case StateDatepiker.OPEN:
        this._isOpenDatepiker = true;
        break;

      case StateDatepiker.CLOSE:
        this._isOpenDatepiker = false;
        break;
    }
  }


  //State

  _resetTaskEditorState() {
    this._taskEditorComponent.updateData({
      isSaving: false,
      isDeleting: false,
    });

    document.addEventListener('keydown', this._onEscKeyDown);
    document.addEventListener('keydown', this._onEnterKeyDown);
  }

  setStateView(state) {
    document.removeEventListener('keydown', this._onEscKeyDown);
    document.removeEventListener('keydown', this._onEnterKeyDown);

    switch (state) {
      case State.SAVING:
        this._taskEditorComponent.updateData({
          isSaving: true,
        });

        break;

      case State.DELETING:
        this._taskEditorComponent.updateData({
          isDeleting: true,
        });

        break;

      case State.ABORTING:
        this._taskEditorComponent.shakeButtons(this._resetTaskEditorState.bind(this));
        break;
    }
  }

}

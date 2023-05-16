//View
import TaskView from '../view/task.js';
import TaskControlsView from '../view/task-control.js';
import TaskEditorView from '../view/task-editor.js';

//Supporting const
import { State, UserAction, TypeView, StateDatepiker } from '../const.js';

//Supporting function
import { render, replace, remove } from '../utils/render.js';

////


export default class TaskPresenter {
  constructor(container, onViewUpdateData, onTypeViewChange) {

    //Callback
    this._onTypeViewChange = onTypeViewChange;
    this._onViewUpdateData = onViewUpdateData;

    //Variable
    this._typeView = TypeView.DEFAULT;
    this._isOpenNewTask = null;
    this._isOpenDatepiker = null;

    //Container
    this._container = container;
    this._controlContainer = null;

    //Data
    this._taskData = null;

    //Component
    this._taskComponent = null;
    this._taskControlsComponent = null;
    this._taskEditorComponent = null;

    //Handler
    this._onClickEditButton = this._onClickEditButton.bind(this);
    this._onClickDeleteButton = this._onClickDeleteButton.bind(this);
    this._onClickSaveButton = this._onClickSaveButton.bind(this);
    this._onClickArchiveButton = this._onClickArchiveButton.bind(this);
    this._onClickFavoritesButton = this._onClickFavoritesButton.bind(this);

    this._onActionDatepiker = this._onActionDatepiker.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onEnterKeyDown = this._onEnterKeyDown.bind(this);
  }

  init(taskData,isOpenNewTask) {
    this._taskData = taskData;
    this._isOpenNewTask = isOpenNewTask;
  }

  //Render

  renderTask() {
    this._createTask();
    this._createTaskControls();
    this._createTaskEditor();

    render(this._container, this._taskComponent, 'beforeend');
    render(this._controlContainer, this._taskControlsComponent, 'afterbegin');
  }


  //Create

  _createTask() {
    this._taskComponent = new TaskView(this._taskData);
    this._controlContainer = this._taskComponent.getElement().querySelector('.card__inner');
  }

  _createTaskControls() {
    this._taskControlsComponent = new TaskControlsView(this._taskData);
    this._taskControlsComponent.setClickEditButtonHandler(this._onClickEditButton);
    this._taskControlsComponent.setClickArchiveButtonHandler(this._onClickArchiveButton);
    this._taskControlsComponent.setClickFavoritesButtonHandler(this._onClickFavoritesButton);
  }

  _createTaskEditor() {
    this._taskEditorComponent = new TaskEditorView(this._taskData);
    this._taskEditorComponent.setClickDeleteButtonHandler(this._onClickDeleteButton);
    this._taskEditorComponent.setClickSaveButtonHandler(this._onClickSaveButton);
  }


  //Update

  updateControl() {
    const prevTaskControlsComponent = this._taskControlsComponent;

    this._createTaskControls();

    if (prevTaskControlsComponent === null) {
      render(this._controlContainer, this._taskControlsComponent, 'afterbegin');
      return;
    }

    if (this._typeView === TypeView.DEFAULT) {
      replace(this._taskControlsComponent, prevTaskControlsComponent);
    }
  }


  //Remove

  removeTask() {
    this._taskEditorComponent.removeDatepicker();

    this._removeEditorHandlers();

    remove(this._taskComponent);
    this._taskComponent = null;

    remove(this._taskControlsComponent);
    this._taskControlsComponent = null;

    remove(this._taskEditorComponent);
    this._taskEditorComponent = null;
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
    this._onViewUpdateData(taskData, UserAction.UPDATE, this._typeView);
  }

  _onClickDeleteButton(taskData) {
    this._onViewUpdateData(taskData, UserAction.DELETE, this._typeView);
  }

  _onClickEditButton() {
    if (this._isOpenNewTask) {
      this._onTypeViewChange();
      return;
    }

    this._replaceTaskToEditor();
  }

  _onClickArchiveButton(taskData) {
    this._onViewUpdateData(taskData, UserAction.UPDATE, this._typeView);
  }

  _onClickFavoritesButton(taskData) {
    this._onViewUpdateData(taskData, UserAction.UPDATE, this._typeView);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._taskEditorComponent.resetData(this._taskData);
      this._replaceEditorToTask();
    }
  }

  _onEnterKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      if (this._isOpenDatepiker) {
        return;
      }

      this._onViewUpdateData(this._taskEditorComponent.getData(), UserAction.UPDATE, this._typeView);
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

  _resetTaskEditorState () {
    this._taskEditorComponent.updateData({
      isSaving: false,
      isDeleting: false,
    });

    document.addEventListener('keydown', this._onEscKeyDown);
    document.addEventListener('keydown', this._onEnterKeyDown);
  }

  _resetTaskControlsState () {
    this._taskControlsComponent.updateData({
      isSaving: false,
    });
  }

  setStateView(state) {
    document.removeEventListener('keydown', this._onEscKeyDown);
    document.removeEventListener('keydown', this._onEnterKeyDown);

    switch (state) {
      case State.SAVING:
        if (this._typeView === TypeView.DEFAULT) {
          this._taskControlsComponent.updateData({
            isSaving: true,
          });
          return;
        }

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
        if (this._typeView === TypeView.DEFAULT) {
          this._taskControlsComponent.shake(this._resetTaskControlsState.bind(this));
          return;
        }

        this._taskEditorComponent.shakeButtons(this._resetTaskEditorState.bind(this));

        break;
    }
  }


  //Other

  _replaceTaskToEditor() {
    replace(this._taskEditorComponent, this._taskComponent);

    this._setEditorHandlers();

    this._taskEditorComponent.setDatepicker();

    this._onTypeViewChange();

    this._typeView = TypeView.EDITING;
  }

  _replaceEditorToTask() {
    replace(this._taskComponent, this._taskEditorComponent);

    this._removeEditorHandlers();

    this._taskEditorComponent.removeDatepicker();

    this._typeView = TypeView.DEFAULT;
  }

  resetView() {
    if (this._typeView !== TypeView.DEFAULT) {
      this._taskEditorComponent.resetData(this._taskData);
      this._replaceEditorToTask();
    }
  }

}

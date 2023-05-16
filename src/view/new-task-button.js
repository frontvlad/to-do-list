//Parents
import AbstractView from './abstract.js';

//Supporting const
import { State } from '../const.js';


////


//Function

const isDisabled = (state) => {
  if (state === State.DISABLED) {
    return 'disabled';
  }

  return '';
};


//Template

const createAddNewTaskButtonTemplate = (state) => `<button class="control__button" ${isDisabled(state)}>+ ADD NEW TASK</button>`;


export default class AddNewTaskButton extends AbstractView {
  constructor(state) {
    super();

    //Variable
    this._state = state;

    //Handler
    this._onClickAddNewTaskButton = this._onClickAddNewTaskButton.bind(this);

  }

  getTemplate() {
    return createAddNewTaskButtonTemplate(this._state);
  }

  //Handler

  setClickAddNewTaskButtonHandler(callback) {
    this._callback.clickAddNewTaskButton = callback;
    this.getElement().addEventListener('click', this._onClickAddNewTaskButton);
  }

  _onClickAddNewTaskButton(evt) {
    evt.preventDefault();
    this._callback.clickAddNewTaskButton();
  }

}

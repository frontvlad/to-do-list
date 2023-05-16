//Parents
import AbstractView from './abstract.js';

////


//Template

const createShowButtonTemplate = () => '<button class="load-more" type="button">load more</button>';


export default class ShowButtonView extends AbstractView {
  constructor() {
    super();

    //Handler
    this._onClickShowButton = this._onClickShowButton.bind(this);

  }

  getTemplate() {
    return createShowButtonTemplate();
  }


  //Handler

  setClickShowButtonHandler(callback) {
    this._callback.clickShowButton = callback;
    this.getElement().addEventListener('click', this._onClickShowButton);
  }

  _onClickShowButton(evt) {
    evt.preventDefault();
    this._callback.clickShowButton();
  }

}


//Suporting const
import { SHAKE_ANIMATION_TIMEOUT } from '../const.js';

//Supporting function
import { createElement } from '../utils/render.js';

////


export default class Abstract {
  constructor() {

    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }

    this._element = null;
    this._callback = {};

  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      if (callback) {
        callback();
        return;
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}


//Parents
import AbstractView from './abstract.js';

//Supporting const
import { UpdateElement, TaskType, COLORS, StateDatepiker } from '../const.js';

//Supporting function
import { humanizeDate, DateFormat, getObjectDateISO, getToday } from '../utils/date.js';

//Library
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

///


//Function

const isChecked = (currentItem, item) => currentItem === item ? 'checked' : '';

const isDisabledState = (isSaving, isDeleting) => {
  if (isSaving || isDeleting) {
    return true;
  }

  return false;
};

const isRepeatingState = (repeatingDays) => {
  if (Object.values(repeatingDays).some((day) => day)) {
    return true;
  }

  return false;
};

const isDateState = (dueDate) => {
  if (dueDate) {
    return true;
  }

  return false;
};


//Template

////MainTemplate

const createTaskEditorTemplate = (taskData, taskType) => {
  const { color, description, due_date, repeating_days, isRepeating, isDate, isSaving, isDeleting } = taskData;
  const isDisabled = isDisabledState(isSaving, isDeleting);
  return `<article class="card card--edit card--${color} ${isRepeating ? 'card--repeat' : ''} ${taskType === TaskType.NEW ? 'card--new' : ''}">
  <form class="card__form" method="get">
    <div class="card__inner">
      <div class="card__color-bar">
        <svg class="card__color-bar-wave" width="100%" height="10">
          <use xlink:href="#wave"></use>
        </svg>
      </div>

      <div class="card__textarea-wrap">
        <label>
          <textarea
            class="card__text"
            placeholder="Start typing your text here..."
            name="text"
          >${description}</textarea>
        </label>
      </div>

      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
            ${createTaskDateTemplate(isDate, due_date, isDisabled)}
            ${createTaskRepeatingTemplate(isRepeating, repeating_days, isDisabled)}
          </div>
        </div>

        <div class="card__colors-inner">
          ${createColorsTemplate(color, isDisabled)}
        </div>
      </div>

      <div class="card__status-btns">
        <button class="card__save" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'saving' : 'save'}</button>
        ${createDeleteButtonTemplate(taskType, isDisabled, isDeleting)}
      </div>
    </div>
  </form>
</article>`;
};


////ButtonTemplate

const createDeleteButtonTemplate = (taskType, isDisabled, isDeleting) => {
  if (taskType === TaskType.NEW) {
    return `<button class="card__delete" type="button" ${isDisabled ? 'disabled' : ''}>Cancel</button>`;
  }

  return `<button class="card__delete" type="button" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'deleting' : 'delete'}</button>`;
};


////DateTemplate

const createTaskDateTemplate = (isDate, dueDate, isDisabled) => {
  if (isDate) {
    return `<button class="card__date-deadline-toggle" type="button" ${isDisabled ? 'disabled' : ''}>
    date: <span class="card__date-status">yes</span>
  </button>

  <fieldset class="card__date-deadline">
    <label class="card__input-deadline-wrap">
      <input
        class="card__date"
        type="text"
        placeholder=""
        name="date"
        value="${humanizeDate(dueDate, DateFormat.YEAR_MONTH_DAY_HOUR_MINUTE_24)}"
        ${isDisabled ? 'disabled' : ''}
      />
    </label>
  </fieldset>`;
  }

  return `<button class="card__date-deadline-toggle" type="button" ${isDisabled ? 'disabled' : ''}>
    date: <span class="card__date-status">no</span>
  </button>`;
};


////RepeatingTemplate

const createTaskRepeatingTemplate = (isRepeating, repeatingDays, isDisabled) => {
  if (isRepeating) {
    return `<button class="card__repeat-toggle" type="button" ${isDisabled ? 'disabled' : ''}>
    repeat:<span class="card__repeat-status">yes</span>
  </button>
  ${createRepeatingDayListTemplate(repeatingDays, isDisabled)}`;
  }

  return `<button class="card__repeat-toggle" type="button" ${isDisabled ? 'disabled' : ''}>
  repeat:<span class="card__repeat-status">no</span>
</button>`;
};

const createRepeatingDayListTemplate = (repeatingDays, isDisabled) => {
  return `<fieldset class="card__repeat-days">
  <div class="card__repeat-days-inner">
    ${Object.entries(repeatingDays).map((day) => createRepeatingDayTemplate(day[0], day[1], isDisabled)).join('')}
  </div>
</fieldset>`;
};

const createRepeatingDayTemplate = (day, isChecked, isDisabled) => {
  return `<input
  class="visually-hidden card__repeat-day-input"
  type="checkbox"
  id="repeat-${day}-4"
  name="repeat"
  value="${day}"
  ${isChecked ? 'checked' : ''}
  ${isDisabled ? 'disabled' : ''}
/>
<label class="card__repeat-day" for="repeat-${day}-4"
  >${day}</label
>`;
};


////ColorTemplate

const createColorsTemplate = (currentColor, isDisabled) => {
  return `<h3 class="card__colors-title">Color</h3>
  <div class="card__colors-wrap">
    ${COLORS.map((color) => createColorItemTemplate(color, currentColor, isDisabled)).join('')}
  </div>`;
};

const createColorItemTemplate = (color, currentColor, isDisabled) => {
  return `<input
  type="radio"
  id="color-${color}-4"
  class="card__color-input card__color-input--${color} visually-hidden"
  name="color"
  value="${color}"
  ${isChecked(currentColor, color)}
  ${isDisabled ? 'disabled' : ''}
/>
<label
  for="color-${color}-4"
  class="card__color card__color--${color}"
  >${color}</label
>`;
};


export default class TaskEditor extends AbstractView {
  constructor(taskData, taskType = TaskType.DEFAULT) {
    super();

    //Variable
    this._taskType = taskType;

    //Data
    this._taskData = this.parseTaskToData(taskData);

    //Handler
    this._onClickDeleteButton = this._onClickDeleteButton.bind(this);
    this._onClickSaveButton = this._onClickSaveButton.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);

    this._onOpenDatepiker = this._onOpenDatepiker.bind(this);
    this._onCloseDatepiker = this._onCloseDatepiker.bind(this);

    //Function
    this._setInnerHandler();

    //Other
    this._datepicker = null;

  }

  getTemplate() {
    return createTaskEditorTemplate(this._taskData, this._taskType);
  }


  //Datepicker

  setDatepicker() {
    if (this._datepicker) {
      this.removeDatepicker();
    }

    if (this._taskData.isDate) {

      if (!this._taskData.due_date) {
        this._taskData.due_date = humanizeDate(getToday(), DateFormat.DEADLINE_DATE);
      }

      this._datepicker = flatpickr(
        this.getElement().querySelector('.card__date'),
        {
          time_24hr: true,
          dateFormat: 'j F Y',
          defaultDate: getObjectDateISO(this._taskData.due_date),
          onChange: this._onChangeDate,
          onOpen: this._onOpenDatepiker,
          onClose: this._onCloseDatepiker,
        },
      );
    }
  }

  removeDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }


  //Data

  parseTaskToData(data) {
    return Object.assign(
      {},
      data,
      {
        isRepeating: isRepeatingState(data.repeating_days),
        isDate: isDateState(data.due_date),
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  parseDataToTask(data) {
    data = Object.assign(
      {},
      data,
    );

    if (!data.isDate) {
      data.due_date = null;
    }

    if (!data.isRepeating) {
      Object.keys(data.repeating_days).forEach((day) => data.repeating_days[day] = false);
    }

    delete data.isRepeating;
    delete data.isDate;
    delete data.isSaving;
    delete data.isDeleting;

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

  _setInnerHandler() {
    this.getElement()
      .querySelector('.card__date-deadline-toggle')
      .addEventListener('click', this._onChangeIsDate.bind(this));

    this.getElement()
      .querySelector('.card__repeat-toggle')
      .addEventListener('click', this._onChangeIsRepeating.bind(this));

    this.getElement()
      .querySelector('.card__colors-wrap')
      .addEventListener('change', this._onChangeColor.bind(this));

    this.getElement()
      .querySelector('.card__text')
      .addEventListener('input', this._onInputDescription.bind(this));

    if (this._taskData.isRepeating) {
      this.getElement()
        .querySelector('.card__repeat-days-inner')
        .addEventListener('change', this._onChangeRepeatingDay.bind(this));
    }
  }

  _restoreHandlers() {
    this._setInnerHandler();

    this.setClickDeleteButtonHandler(this._callback.clickDeleteButton);
    this.setClickSaveButtonHandler(this._callback.clickSaveButton);

    this.setDatepicker();
  }

  setClickDeleteButtonHandler(callback) {
    this._callback.clickDeleteButton = callback;
    this.getElement().querySelector('.card__delete').addEventListener('click', this._onClickDeleteButton);
  }

  _onClickDeleteButton(evt) {
    evt.preventDefault();
    this._callback.clickDeleteButton(this.parseDataToTask(this._taskData));
  }

  setClickSaveButtonHandler(callback) {
    this._callback.clickSaveButton = callback;
    this.getElement().querySelector('.card__save').addEventListener('click', this._onClickSaveButton);
  }

  _onClickSaveButton(evt) {
    evt.preventDefault();
    this._callback.clickSaveButton(this.parseDataToTask(this._taskData));
  }

  _onChangeDate([userInput]) {
    this.updateData({
      due_date: humanizeDate(userInput, DateFormat.DEADLINE_DATE),
    }, UpdateElement.NO_UPDATE);
  }

  _onChangeColor(evt) {
    evt.preventDefault();
    this.updateData({
      color: evt.target.value,
    });
  }

  _onChangeRepeatingDay(evt) {
    evt.preventDefault();
    const day = evt.target.value;
    const repeatingDays = Object.assign(
      {},
      this._taskData.repeating_days,
    );

    repeatingDays[day] = !repeatingDays[day];

    this.updateData({
      repeating_days: repeatingDays,
    }, UpdateElement.NO_UPDATE);
  }

  _onChangeIsRepeating(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._taskData.isRepeating,
    });
  }

  _onChangeIsDate(evt) {
    evt.preventDefault();
    this.updateData({
      isDate: !this._taskData.isDate,
    });
  }

  _onInputDescription(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value,
    }, UpdateElement.NO_UPDATE);
  }

  _onOpenDatepiker() {
    this.getElement().dispatchEvent(new CustomEvent('datepiker', {
      detail: StateDatepiker.OPEN,
      bubbles: true,
    }));
  }

  _onCloseDatepiker() {
    this.getElement().dispatchEvent(new CustomEvent('datepiker', {
      detail: StateDatepiker.CLOSE,
      bubbles: true,
    }));

    this.getElement().querySelector('.card__date').blur();
  }

  //Get

  getData() {
    return this.parseDataToTask(this._taskData);
  }


  //Other

  resetData(taskData) {
    this.updateData(
      this.parseTaskToData(taskData),
    );
  }

  shakeButtons(callback) {
    this.getElement().querySelector('.card__status-btns').style.animation = `shake ${600 / 1000}s`;
    setTimeout(() => {
      this.getElement().querySelector('.card__status-btns').style.animation = '';
      if (callback) {
        callback();
        return;
      }
    }, 600);
  }

}

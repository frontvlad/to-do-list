//Library
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';


//Dayjs
const dayjs = require('dayjs');
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(objectSupport);
dayjs.extend(utc);

////


export const MeasureDate = {
  DAY: 'day',
  WEEK: 'week',
  QUARTER: 'quarter',
  MONTH: 'month',
  YEAR: 'year',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
  MILLISECOND: 'millisecond',
};

export const DateFormat = {
  YEAR: 'YYYY',
  DAY_MONTH: 'D MMMM YYYY',
  DAY_MONTH_YEAR: 'D MMMM YYYY',
  YEAR_MONTH_DAY_HOUR_MINUTE_24: 'YYYY-MM-DD HH:mm',
  DEADLINE_DATE: 'YYYY-MM-DDT23:59:59',
};

//Приводит date к нужному формату format
export const humanizeDate = (date, format) => dayjs(date).format(format);

//Возвращает копию нативного объекта Date
export const getObjectDate = (date) => dayjs(date).toDate();

//Возвращает копию нативного объекта Date ISO
export const getObjectDateISO = (date) => dayjs(date).toISOString();

//Возвращает сегодняшнюю дату
export const getToday = () => dayjs();

//Возвращает объект продолжительности duration. measure задаёт еденицу измерения
export const getDuration = (duration, measure) => dayjs.duration(duration, measure);

//Получает строку вида D/H/M из продолжительности duration
export const getStringDate = (duration, measure) => {
  const date = getDuration(duration, measure);
  return `${date.get('days') ? date.get('days') + 'D' : ''} ${date.get('hour') ? date.get('hour') + 'H' : ''} ${date.get('minute') ? date.get('minute') + 'M' : ''}`;
};

//Вычитает из dateA - dateB и возвращает разницу в указанной еденице измерения measure
export const getDifferenceDates = (dateA, dateB, measure) => dayjs(dateA).diff(dayjs(dateB), measure);


//Вычитает (count) measure от date и возвращает полученную дату
export const getDateSubtract = (date, count, measure) => dayjs(date).subtract(count, measure);

//Возвращает true если день dateA и dateB совпадают, по еденице измерения measure
export const isSameDayDate = (dateA, dateB, measure) => dayjs(dateA).isSame(dayjs(dateB), measure);

//Возвращает true если dateA является такой же или находится до dateB, по еденице измерения measure;
export const isSameOrBeforeDate = (dateA, dateB, measure) => dayjs(dateA).isSameOrBefore(dayjs(dateB), measure);

//Возвращает true если dateA является такой же или следует после dateB, по еденице измерения measure;
export const isSameOrAfterDate = (dateA, dateB, measure) => dayjs(dateA).isSameOrAfter(dayjs(dateB), measure);

//Возвращает true если dateA следует после dateB, по еденице измерения measure;
export const isAfterDate = (dateA, dateB, measure) => dayjs(dateA).isAfter(dayjs(dateB), measure);

//Возвращает true если dateA находится до dateB, по еденице измерения measure;
export const isBeforeDate = (dateA, dateB, measure) => dayjs(dateA).isBefore(dayjs(dateB), measure);

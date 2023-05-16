const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};


export default class Api {
  constructor(linkData, authorization) {

    this._linkData = linkData;
    this._authorization = authorization;

  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._linkData}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  getData() {
    return this._load({url: 'tasks'})
      .then(Api.toJSON);
  }

  updateData(dataItem) {
    return this._load({
      url: `tasks/${dataItem.id}`,
      method: Method.PUT,
      body: JSON.stringify(dataItem),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  addData(dataItem) {
    return this._load({
      url: 'tasks',
      method: Method.POST,
      body: JSON.stringify(dataItem),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  deleteData(dataId) {
    return this._load({
      url: `tasks/${dataId}`,
      method: Method.DELETE,
    });
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

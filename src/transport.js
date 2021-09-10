/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Util } = require('./util.js');

/**********************************************************************************
 * 
 * Node implementation
 * 
 *********************************************************************************/
/* istanbul ignore else */
if (!Util.isBrowser()) {

  // Transport layer using axios library
  const axios = require('axios');


  /**
   * 
   * Request body (options)
   * - headers (kv)
   * - method
   * - url
   * - data
   * 
   * Response
   * - data
   * - statusCode
   * - statusText
   * - request
   */

  const request = (options) => {
    const request = {
      method: options.method,
      url: options.url,
      headers: options.headers,
      data: options.data
    };
    return axios(request)
    .then((response) => {
      // HTTP success (200, 201, etc.) are returned here
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      // Not an HTTP error
      const response = error.response;
      if (!response)
        return Promise.reject(error);
      // HTTP errors (400, 404, 500, etc.) are returned here
      return Promise.reject({
        statusCode: response.status,
        statusText: response.statusText,
        data: response.data,
        request: request
      });
    })
  }


  exports.request = request;

}

/**********************************************************************************
 * 
 * Browser-side implementation of the request-promise-native node module.
 * This simply wraps the fetch API
 * From https://www.npmjs.com/package/request-promise-native
 * 
 *********************************************************************************/
 else {

  const request = function(options) {

    const headers = new Headers();
    for (var k in options.headers) {
        headers.append(k, options.headers[k]);
    }    
    const r = new Request(options.url, {
        method: options.method,
        headers: headers,
        body: options.data
    });

    const p = fetch(r).then((response) => {
        if (!response.ok)
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        return response.blob().then((blob) => {
            return blob.text();
        });
    });
    return p;
  }

  module.exports.request = request;

}
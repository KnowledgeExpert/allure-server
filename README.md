# Allure Server

This module is an http storage for an Allure reporter entities (Suite, Test, Step, etc.).

## Usage and Use Case

Accumulating test artifacts in runtime, for processing afterwards.
Better to use lang wrappers like [allure-client](https://github.com/KnowledgeExpert/allure-client) for NodeJS.

Using function-as-a-service approach with allure-server can be helpful for paralleling JavaScript long UI tests.

Since FAAS cant store any kind of 'state' which are required for testing it collects in runtime some test data (test-suites, test-cases, attachments, etc.) so some external test data 'collector' can be used.

Idea is that in FAAS you collect test data in allure-server, and after all tests are finished, you pop this data from collector and generate an allure report using allure-cli locally as usual.


## API
* Generate unic ID
  * description - generates new unic `uuid`. Can be used as `Session` id generator.
  * request
    * method - `GET`
    * path - `/session`
  * response
    * type - `plain text`
* Delete specific session data
  * clean data mapped to some `Session` id
  * request
    * method - `DELETE`
    * path - `/session`
    * query params - `uuid`
  * response
    * type - `JSON`
* Pop data from storage
  * pops all data associated with some `Session` id
  * request
    * method - `GET`
    * path - `/popdata`
    * query params - `uuid`
  * response
    * type - `JSON`
* Start suite
  * start new test suite
  * request
    * method - `POST`
    * path - `/startsuite`
    * body params - `uuid`, `name`, `timestamp` (optional)
  * response
    * type - `JSON`
* End suite
  * end current test suite
  * request
    * method - `POST`
    * path - `/endsuite`
    * body params - `uuid`, `timestamp` (optional)
  * response
    * type - `JSON`
* Start test
  * start new test case
  * request
    * method - `POST`
    * path - `/starttest`
    * body params - `uuid`, `name`, `timestamp` (optional)
  * response
    * type - `JSON`
* End test
  * end current test case
  * request
    * method - `POST`
    * path - `/endtest`
    * body params - `uuid`, `status`, `error` (optional), `timestamp` (optional)
  * response
    * type - `JSON`
* Start step
  * start new test step
  * request
    * method - `POST`
    * path - `/startstep`
    * body params - `uuid`, `name`, `timestamp` (optional)
  * response
    * type - `JSON`
* End step
  * end current test step
  * request
    * method - `POST`
    * path - `/endstep`
    * body params - `uuid`, `status`, `timestamp` (optional)
  * response
    * type - `JSON`
* Set description
  * set `Allure`'s description to current test
  * request
    * method - `POST`
    * path - `/description`
    * body params - `uuid`, `content`, `type`
  * response
    * type - `JSON`
* Add attachment
  * add attachment to current test or step
  * request
    * method - `POST`
    * path - `/attachment`
    * form body params - `uuid`, `title`, `attachment` (read stream or object with buffer)
  * response
    * type - `JSON`
* Add label
  * add label to current test
  * request
    * method - `POST`
    * path - `/label`
    * form body params - `uuid`, `name`, `value`
  * response
    * type - `JSON`
* Add parameter
  * add parameter to current test
  * request
    * method - `POST`
    * path - `/parameter`
    * form body params - `uuid`, `kind`, `name`, `value`
  * response
    * type - `JSON`

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testRun_1 = require("./beans/cache/testRun");
const testRun_2 = require("./beans/memory/testRun");
var Storage;
(function (Storage) {
    const sessionsMap = {};
    function deleteSession(session_id) {
        assertTruthy('Session Id', session_id);
        if (sessionsMap[session_id]) {
            delete sessionsMap[session_id];
        }
        else {
            throw new Error(`No session with session_id '${session_id}'`);
        }
    }
    Storage.deleteSession = deleteSession;
    async function getData(session_id, popdata = false) {
        assertTruthy('Session Id', session_id);
        const cachedTestRunMap = sessionsMap[session_id];
        if (!cachedTestRunMap)
            throw new Error(`No data found by session id '${session_id}'`);
        const inMemorySessionData = await transformCachedData(cachedTestRunMap, popdata);
        const result = toJson(inMemorySessionData);
        return result;
    }
    Storage.getData = getData;
    async function popData(session_id) {
        const json = getData(session_id, true);
        deleteSession(session_id);
        return json;
    }
    Storage.popData = popData;
    function startSuite(session_id, test_run_id, name, timestamp) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Timestamp', timestamp);
        assertTruthy('Suite name', name);
        getTestRun(session_id, test_run_id).startSuite(name, parseInt(timestamp));
    }
    Storage.startSuite = startSuite;
    function endSuite(session_id, test_run_id, timestamp) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).endSuite(parseInt(timestamp));
    }
    Storage.endSuite = endSuite;
    function startTest(session_id, test_run_id, name, timestamp) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Test name', name);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).startCase(name, parseInt(timestamp));
    }
    Storage.startTest = startTest;
    function endTest(session_id, test_run_id, status, rawError, timestamp) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        const error = rawError ? JSON.parse(rawError) : null;
        getTestRun(session_id, test_run_id).endCase(status, error, parseInt(timestamp));
    }
    Storage.endTest = endTest;
    function startStep(session_id, test_run_id, name, timestamp) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Step name', name);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).startStep(name, parseInt(timestamp));
    }
    Storage.startStep = startStep;
    function endStep(session_id, test_run_id, status, timestamp) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).endStep(status, parseInt(timestamp));
    }
    Storage.endStep = endStep;
    function addDescription(session_id, test_run_id, content, type) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Content', content);
        assertTruthy('Type', type);
        getTestRun(session_id, test_run_id).setDescription(content, type);
    }
    Storage.addDescription = addDescription;
    function addAttachment(session_id, test_run_id, title, filepath, mime, size, fileId) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Title', title);
        getTestRun(session_id, test_run_id).addAttachment(title, filepath, mime, size, fileId);
    }
    Storage.addAttachment = addAttachment;
    function addLabel(session_id, test_run_id, name, value) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getTestRun(session_id, test_run_id).addLabel(name, value);
    }
    Storage.addLabel = addLabel;
    function addParameter(session_id, test_run_id, kind, name, value) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Kind', kind);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getTestRun(session_id, test_run_id).addParameter(kind, name, value);
    }
    Storage.addParameter = addParameter;
    function assertTruthy(name, value) {
        if (!value) {
            throw new Error(`${name} should be truthy, but was '${value}'`);
        }
    }
    async function transformCachedData(cachedTestRunMap, popdata) {
        const mergedTestRun = Object.keys(cachedTestRunMap)
            .map(key => cachedTestRunMap[key])
            .reduce(mergeTestRuns);
        return await testRun_2.TestRun.wrap(mergedTestRun, popdata);
    }
    function toJson(object) {
        const cache = [];
        const removeCircularReferences = (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        };
        return JSON.stringify(object, removeCircularReferences);
    }
    function getTestRun(session_id, test_run_id) {
        ensurePresent(session_id, test_run_id);
        return sessionsMap[session_id][test_run_id];
    }
    function ensurePresent(session_id, test_run_id) {
        sessionsMap[session_id] = sessionsMap[session_id] ? sessionsMap[session_id] : {};
        sessionsMap[session_id][test_run_id] =
            sessionsMap[session_id][test_run_id]
                ? sessionsMap[session_id][test_run_id]
                : new testRun_1.TestRun();
    }
    function mergeTestRuns(firstTestRun, secondTestRun) {
        secondTestRun.suites.forEach(suite => firstTestRun.suites.push(suite));
        return firstTestRun;
    }
})(Storage = exports.Storage || (exports.Storage = {}));
//# sourceMappingURL=index.js.map
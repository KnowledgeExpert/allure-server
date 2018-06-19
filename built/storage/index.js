"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = require("./beans/cache/session");
const session_2 = require("./beans/memory/session");
var Storage;
(function (Storage) {
    const sessionsMap = {};
    function deleteSession(uuid) {
        assertTruthy('Uuid', uuid);
        if (sessionsMap[uuid]) {
            delete sessionsMap[uuid];
        }
        else {
            throw new Error(`No session with uuid '${uuid}'`);
        }
    }
    Storage.deleteSession = deleteSession;
    async function getData(uuid) {
        assertTruthy('Uuid', uuid);
        const rawSessionData = sessionsMap[uuid];
        if (!rawSessionData)
            throw new Error(`No data present with id ${uuid}`);
        const inMemorySessionData = await transformCachedData(rawSessionData, false);
        const result = toJson(inMemorySessionData);
        return result;
    }
    Storage.getData = getData;
    async function popData(uuid) {
        const json = getData(uuid);
        deleteSession(uuid);
        return json;
    }
    Storage.popData = popData;
    function startSuite(uuid, name, timestamp) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Timestamp', timestamp);
        assertTruthy('Suite name', name);
        ensurePresent(uuid);
        getSession(uuid).startSuite(name, parseInt(timestamp));
    }
    Storage.startSuite = startSuite;
    function endSuite(uuid, timestamp) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).endSuite(parseInt(timestamp));
    }
    Storage.endSuite = endSuite;
    function startTest(uuid, name, timestamp) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Test name', name);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).startCase(name, parseInt(timestamp));
    }
    Storage.startTest = startTest;
    function endTest(uuid, status, rawError, timestamp) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        const error = rawError ? JSON.parse(rawError) : null;
        getSession(uuid).endCase(status, error, parseInt(timestamp));
    }
    Storage.endTest = endTest;
    function startStep(uuid, name, timestamp) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Step name', name);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).startStep(name, parseInt(timestamp));
    }
    Storage.startStep = startStep;
    function endStep(uuid, status, timestamp) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).endStep(status, parseInt(timestamp));
    }
    Storage.endStep = endStep;
    function addDescription(uuid, content, type) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Content', content);
        assertTruthy('Type', type);
        getSession(uuid).setDescription(content, type);
    }
    Storage.addDescription = addDescription;
    function addAttachment(uuid, title, filepath, mime, size, fileId) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Title', title);
        getSession(uuid).addAttachment(title, filepath, mime, size, fileId);
    }
    Storage.addAttachment = addAttachment;
    function addLabel(uuid, name, value) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getSession(uuid).addLabel(name, value);
    }
    Storage.addLabel = addLabel;
    function addParameter(uuid, kind, name, value) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Kind', kind);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getSession(uuid).addParameter(kind, name, value);
    }
    Storage.addParameter = addParameter;
    function assertTruthy(name, value) {
        if (!value) {
            throw new Error(`${name} should be truthy, but was '${value}'`);
        }
    }
    async function transformCachedData(cachedSession, popdata) {
        return await session_2.Session.wrap(cachedSession, popdata);
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
    function ensurePresent(uuid) {
        sessionsMap[uuid] = sessionsMap[uuid] ? sessionsMap[uuid] : new session_1.Session();
    }
    function getSession(uuid) {
        return sessionsMap[uuid];
    }
})(Storage = exports.Storage || (exports.Storage = {}));
//# sourceMappingURL=index.js.map
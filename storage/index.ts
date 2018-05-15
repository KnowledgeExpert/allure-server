import {Session as CachedSession} from "./beans/cache/session";
import {Session as MemorySession} from "./beans/memory/session";
import {TEST_STATUS} from "./beans/testStatus";
import {STEP_STATUS} from "./beans/stepStatus";
import {DESCRIPTION_TYPE} from "./beans/description";


export namespace Storage {

    const sessionsMap: { [uuid: string]: CachedSession } = {};

    export function clear(uuid?: string) {
        if (uuid) {
            if (sessionsMap[uuid]) {
                delete sessionsMap[uuid];
            } else {
                throw new Error(`No session with uuid '${uuid}'`);
            }
        } else {
            for (let uuid in sessionsMap) {
                delete sessionsMap[uuid];
            }
        }
    }

    export function popData(uuid: string): string {
        throwIfNotTruthy('Uuid', uuid);
        const rawSessionData = sessionsMap[uuid];
        if (!rawSessionData) throw new Error(`No data present with id ${uuid}`);

        const inMemorySessionData = transformCachedData(rawSessionData);
        const result = toJson(inMemorySessionData);

        delete sessionsMap[uuid];
        return result;
    }

    export function startSuite(uuid: string, suiteName: string, timestamp: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Timestamp', timestamp);
        throwIfNotTruthy('Suite name', suiteName);
        ensurePresent(uuid);
        getSession(uuid).startSuite(suiteName, parseInt(timestamp));
    }

    export function endSuite(uuid: string, timestamp: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Timestamp', timestamp);
        getSession(uuid).endSuite(parseInt(timestamp));
    }

    export function startCase(uuid: string, testName: string, timestamp: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Test name', testName);
        throwIfNotTruthy('Timestamp', timestamp);
        getSession(uuid).startCase(testName, parseInt(timestamp));
    }

    export function endCase(uuid: string, rawStatus: string, rawError: string, timestamp: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Status', rawStatus);
        throwIfNotTruthy('Error', rawError);
        throwIfNotTruthy('Timestamp', timestamp);
        const testStatus = rawStatus === 'broken'
            ? TEST_STATUS.BROKEN
            : rawStatus === 'failed'
                ? TEST_STATUS.FAILED
                : rawStatus === 'passed'
                    ? TEST_STATUS.PASSED
                    : rawStatus === 'pending'
                        ? TEST_STATUS.PENDING : TEST_STATUS.SKIPPED;
        const error = rawError ? JSON.parse(rawError) : null;
        getSession(uuid).endCase(testStatus, error, parseInt(timestamp));
    }

    export function startStep(uuid: string, stepName: string, timestamp: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Step name', stepName);
        throwIfNotTruthy('Timestamp', timestamp);
        getSession(uuid).startStep(stepName, parseInt(timestamp));
    }

    export function endStep(uuid: string, rawStatus: string, timestamp: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Status', rawStatus);
        throwIfNotTruthy('Timestamp', timestamp);
        const stepStatus = rawStatus === 'failed' ? STEP_STATUS.FAILED : STEP_STATUS.PASSED;
        getSession(uuid).endStep(stepStatus, parseInt(timestamp));
    }

    export function setDescription(uuid: string, content: string, type: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Content', content);
        throwIfNotTruthy('Type', type);
        const descriptionType = type === 'html'
            ? DESCRIPTION_TYPE.HTML
            : type === 'text'
                ? DESCRIPTION_TYPE.TEXT
                : DESCRIPTION_TYPE.MARKDOWN;
        getSession(uuid).setDescription(content, descriptionType);
    }

    export function addAttachment(uuid: string, name: string, stringBuffer: string, type: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Name', name);
        throwIfNotTruthy('Content', stringBuffer);
        throwIfNotTruthy('Type', type);
        getSession(uuid).addAttachment(name, stringBuffer, type);
    }

    export function addLabel(uuid: string, name: string, value: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Name', name);
        throwIfNotTruthy('Value', value);
        getSession(uuid).addLabel(name, value);
    }

    export function addParameter(uuid: string, kind: string, name: string, value: string) {
        throwIfNotTruthy('Uuid', uuid);
        throwIfNotTruthy('Kind', kind);
        throwIfNotTruthy('Name', name);
        throwIfNotTruthy('Value', value);
        getSession(uuid).addParameter(kind, name, value);
    }

    function throwIfNotTruthy(name: string, value: any) {
        if (!value) {
            throw new Error(`${name} should be truthy, but was '${value}'`);
        }
    }

    function transformCachedData(cachedSession: CachedSession): MemorySession {
        return new MemorySession(cachedSession);
    }

    function toJson(object: any): string {
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

    function ensurePresent(uuid: string) {
        sessionsMap[uuid] = sessionsMap[uuid] ? sessionsMap[uuid] : new CachedSession();
    }

    function getSession(uuid: string) {
        return sessionsMap[uuid];
    }
}

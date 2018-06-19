import {Session as CachedSession} from "./beans/cache/session";
import {Session as MemorySession} from "./beans/memory/session";


export namespace Storage {

    const sessionsMap: { [uuid: string]: CachedSession } = {};

    export function deleteSession(uuid?: string) {
        assertTruthy('Uuid', uuid);
        if (sessionsMap[uuid]) {
            delete sessionsMap[uuid];
        } else {
            throw new Error(`No session with uuid '${uuid}'`);
        }
    }

    export async function getData(uuid: string): Promise<string> {
        assertTruthy('Uuid', uuid);
        const rawSessionData = sessionsMap[uuid];
        if (!rawSessionData) throw new Error(`No data present with id ${uuid}`);

        const inMemorySessionData = await transformCachedData(rawSessionData, false);
        const result = toJson(inMemorySessionData);

        return result;
    }

    export async function popData(uuid: string): Promise<string> {
        const json = getData(uuid);
        deleteSession(uuid);
        return json;
    }

    export function startSuite(uuid: string, name: string, timestamp: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Timestamp', timestamp);
        assertTruthy('Suite name', name);
        ensurePresent(uuid);
        getSession(uuid).startSuite(name, parseInt(timestamp));
    }

    export function endSuite(uuid: string, timestamp: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).endSuite(parseInt(timestamp));
    }

    export function startTest(uuid: string, name: string, timestamp: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Test name', name);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).startCase(name, parseInt(timestamp));
    }

    export function endTest(uuid: string, status: string, rawError: string, timestamp: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        const error = rawError ? JSON.parse(rawError) : null;
        getSession(uuid).endCase(status, error, parseInt(timestamp));
    }

    export function startStep(uuid: string, name: string, timestamp: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Step name', name);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).startStep(name, parseInt(timestamp));
    }

    export function endStep(uuid: string, status: string, timestamp: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        getSession(uuid).endStep(status, parseInt(timestamp));
    }

    export function addDescription(uuid: string, content: string, type: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Content', content);
        assertTruthy('Type', type);
        getSession(uuid).setDescription(content, type);
    }

    export function addAttachment(uuid: string, title: string, filepath: string, mime: string, size: number, fileId: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Title', title);
        getSession(uuid).addAttachment(title, filepath, mime, size, fileId);
    }

    export function addLabel(uuid: string, name: string, value: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getSession(uuid).addLabel(name, value);
    }

    export function addParameter(uuid: string, kind: string, name: string, value: string) {
        assertTruthy('Uuid', uuid);
        assertTruthy('Kind', kind);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getSession(uuid).addParameter(kind, name, value);
    }

    function assertTruthy(name: string, value: any) {
        if (!value) {
            throw new Error(`${name} should be truthy, but was '${value}'`);
        }
    }

    async function transformCachedData(cachedSession: CachedSession, popdata: boolean) {
        return await MemorySession.wrap(cachedSession, popdata);
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

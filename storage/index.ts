import {TestRun as CachedTestRun} from "./beans/cache/testRun";
import {TestRun as MemoryTestRun} from "./beans/memory/testRun";
import {CachedSessionMap} from "./cachedSessionMap";
import {CachedTestRunMap} from "./cachedTestRunMap";


export namespace Storage {
    const sessionsMap: CachedSessionMap = {};

    export function deleteSession(session_id?: string) {
        assertTruthy('Session Id', session_id);
        if (sessionsMap[session_id]) {
            delete sessionsMap[session_id];
        } else {
            throw new Error(`No session with session_id '${session_id}'`);
        }
    }

    export async function getData(session_id: string, popdata = false): Promise<string> {
        assertTruthy('Session Id', session_id);
        const cachedTestRunMap: CachedTestRunMap = sessionsMap[session_id];
        if (!cachedTestRunMap) throw new Error(`No data found by session id '${session_id}'`);

        const inMemorySessionData = await transformCachedData(cachedTestRunMap, popdata);
        const result = toJson(inMemorySessionData);

        return result;
    }

    export async function popData(session_id: string): Promise<string> {
        const json = getData(session_id, true);
        deleteSession(session_id);
        return json;
    }

    export function startSuite(session_id: string, test_run_id: string, name: string, timestamp: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Timestamp', timestamp);
        assertTruthy('Suite name', name);
        getTestRun(session_id, test_run_id).startSuite(name, parseInt(timestamp));
    }

    export function endSuite(session_id: string, test_run_id: string, timestamp: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).endSuite(parseInt(timestamp));
    }

    export function startTest(session_id: string, test_run_id: string, name: string, timestamp: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Test name', name);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).startCase(name, parseInt(timestamp));
    }

    export function endTest(session_id: string, test_run_id: string, status: string, rawError: string, timestamp: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        const error = rawError ? JSON.parse(rawError) : null;
        getTestRun(session_id, test_run_id).endCase(status, error, parseInt(timestamp));
    }

    export function startStep(session_id: string, test_run_id: string, name: string, timestamp: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Step name', name);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).startStep(name, parseInt(timestamp));
    }

    export function endStep(session_id: string, test_run_id: string, status: string, timestamp: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Status', status);
        assertTruthy('Timestamp', timestamp);
        getTestRun(session_id, test_run_id).endStep(status, parseInt(timestamp));
    }

    export function addDescription(session_id: string, test_run_id: string, content: string, type: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Content', content);
        assertTruthy('Type', type);
        getTestRun(session_id, test_run_id).setDescription(content, type);
    }

    export function addAttachment(session_id: string, test_run_id: string, title: string, filepath: string, mime: string, size: number, fileId: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Title', title);
        getTestRun(session_id, test_run_id).addAttachment(title, filepath, mime, size, fileId);
    }

    export function addLabel(session_id: string, test_run_id: string, name: string, value: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getTestRun(session_id, test_run_id).addLabel(name, value);
    }

    export function addParameter(session_id: string, test_run_id: string, kind: string, name: string, value: string) {
        assertTruthy('Session Id', session_id);
        assertTruthy('Test Run Id', test_run_id);
        assertTruthy('Kind', kind);
        assertTruthy('Name', name);
        assertTruthy('Value', value);
        getTestRun(session_id, test_run_id).addParameter(kind, name, value);
    }

    function assertTruthy(name: string, value: any) {
        if (!value) {
            throw new Error(`${name} should be truthy, but was '${value}'`);
        }
    }

    async function transformCachedData(cachedTestRunMap: CachedTestRunMap, popdata: boolean) {
        const mergedTestRun = Object.keys(cachedTestRunMap)
            .map(key => cachedTestRunMap[key])
            .reduce(mergeTestRuns);
        return await MemoryTestRun.wrap(mergedTestRun, popdata);
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


    function getTestRun(session_id: string, test_run_id: string): CachedTestRun {
        ensurePresent(session_id, test_run_id);
        return sessionsMap[session_id][test_run_id];
    }

    function ensurePresent(session_id: string, test_run_id: string) {
        sessionsMap[session_id] = sessionsMap[session_id] ? sessionsMap[session_id] : {};
        sessionsMap[session_id][test_run_id] =
            sessionsMap[session_id][test_run_id]
                ? sessionsMap[session_id][test_run_id]
                : new CachedTestRun();
    }

    function mergeTestRuns(firstTestRun: CachedTestRun, secondTestRun: CachedTestRun) {
        secondTestRun.suites.forEach(suite => firstTestRun.suites.push(suite));
        return firstTestRun;
    }
}

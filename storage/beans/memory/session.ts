import {Suite} from "./suite";
import {Session as CachedAllureSession} from "../cache/session";


export class Session {
    public readonly suites: Suite[];

    constructor(cachedSession: CachedAllureSession) {
        this.suites = cachedSession.suites.map(cachedSuite => new Suite(cachedSuite));
    }
}
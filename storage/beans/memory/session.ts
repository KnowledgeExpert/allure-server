import {Suite} from "./suite";
import {Suite as CachedSuite} from "../cache/suite";
import {Session as CachedAllureSession} from "../cache/session";


export class Session {
    public readonly suites: Suite[];

    constructor(suites: Suite[]) {
        this.suites = suites;
    }

    static async wrap(cachedSession: CachedAllureSession, popdata: boolean) {
        const suites = await Promise.all(cachedSession.suites.map(async (cachedSuite: CachedSuite) => await Suite.wrap(cachedSuite, popdata)));
        return new Session(suites);
    }
}
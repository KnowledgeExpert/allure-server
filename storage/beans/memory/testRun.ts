import {Suite} from "./suite";
import {Suite as CachedSuite} from "../cache/suite";
import {TestRun as CachedTestRun} from "../cache/testRun";


export class TestRun {
    public readonly suites: Suite[];

    constructor(suites: Suite[]) {
        this.suites = suites;
    }

    static async wrap(cachedSession: CachedTestRun, popdata: boolean) {
        const suites = await Promise.all(cachedSession.suites.map(async (cachedSuite: CachedSuite) => await Suite.wrap(cachedSuite, popdata)));
        return new TestRun(suites);
    }
}
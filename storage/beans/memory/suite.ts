import {Test} from "./test";
import {Suite as CachedSuite} from "../cache/suite";

export class Suite {
    public readonly name: string;
    public readonly start: number;
    public readonly stop: number;
    public readonly tests: Test[] = [];

    constructor(cachedSuite: CachedSuite) {
        this.name = cachedSuite.name;
        this.start = cachedSuite.start;
        this.stop = cachedSuite.stop;
        this.tests = cachedSuite.tests.map(cachedTest => new Test(cachedTest));
    }
}
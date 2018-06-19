import {Test} from "./test";
import {Suite as CachedSuite} from "../cache/suite";

export class Suite {
    public readonly name: string;
    public readonly start: number;
    public readonly stop: number;
    public readonly tests: Test[] = [];

    private constructor(name, start, stop, tests) {
        this.name = name;
        this.start = start;
        this.stop = stop;
        this.tests = tests;
    }

    static async wrap(cachedSuite: CachedSuite, popdata: boolean) {
        const tests = await Promise.all(cachedSuite.tests.map(async (cachedTest) => Test.wrap(cachedTest, popdata)));
        return new Suite(
            cachedSuite.name,
            cachedSuite.start,
            cachedSuite.stop,
            tests
        );
    }
}
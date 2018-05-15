import {Test} from "./test";

export class Suite {
    public readonly name: string;
    public readonly start: number;
    public stop: number;
    public readonly tests: Test[] = [];
    public currentTest: Test;

    constructor(name: string, timestamp = Date.now()) {
        if (!name) {
            throw new Error(`Cannot create suite with 'name' - '${name}'`);
        }
        this.name = name;
        this.start = timestamp;
    }

    end(timestamp = Date.now()) {
        this.stop = timestamp;
    }

    addTest(test: Test) {
        this.tests.push(test);
    }

}
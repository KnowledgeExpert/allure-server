"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./test");
class Suite {
    constructor(name, start, stop, tests) {
        this.tests = [];
        this.name = name;
        this.start = start;
        this.stop = stop;
        this.tests = tests;
    }
    static async wrap(cachedSuite) {
        const tests = await Promise.all(cachedSuite.tests.map(async (cachedTest) => test_1.Test.wrap(cachedTest)));
        return new Suite(cachedSuite.name, cachedSuite.start, cachedSuite.stop, tests);
    }
}
exports.Suite = Suite;
//# sourceMappingURL=suite.js.map
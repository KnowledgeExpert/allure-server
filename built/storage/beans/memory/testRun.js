"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suite_1 = require("./suite");
class TestRun {
    constructor(suites) {
        this.suites = suites;
    }
    static async wrap(cachedSession, popdata) {
        const suites = await Promise.all(cachedSession.suites.map(async (cachedSuite) => await suite_1.Suite.wrap(cachedSuite, popdata)));
        return new TestRun(suites);
    }
}
exports.TestRun = TestRun;
//# sourceMappingURL=testRun.js.map
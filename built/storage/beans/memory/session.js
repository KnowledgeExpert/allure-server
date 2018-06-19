"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suite_1 = require("./suite");
class Session {
    constructor(suites) {
        this.suites = suites;
    }
    static async wrap(cachedSession, popdata) {
        const suites = await Promise.all(cachedSession.suites.map(async (cachedSuite) => await suite_1.Suite.wrap(cachedSuite, popdata)));
        return new Session(suites);
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map
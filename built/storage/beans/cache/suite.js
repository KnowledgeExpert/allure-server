"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Suite {
    constructor(name, timestamp = Date.now()) {
        this.tests = [];
        if (!name) {
            throw new Error(`Cannot create suite with 'name' - '${name}'`);
        }
        this.name = name;
        this.start = timestamp;
    }
    end(timestamp = Date.now()) {
        this.stop = timestamp;
    }
    addTest(test) {
        this.tests.push(test);
    }
}
exports.Suite = Suite;
//# sourceMappingURL=suite.js.map
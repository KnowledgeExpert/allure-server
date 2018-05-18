"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const description_1 = require("../description");
class Test {
    constructor(name, timestamp = Date.now()) {
        this.steps = [];
        this.labels = [];
        this.attachments = [];
        this.parameters = [];
        if (!name) {
            throw new Error(`Cannot create test with 'name' - '${name}'`);
        }
        this.name = name;
        this.start = timestamp;
        this.steps = [];
        this.attachments = [];
        this.labels = [];
        this.parameters = [];
    }
    setDescription(content, type) {
        this.description = new description_1.Description(content, type);
    }
    addLabel(name, value) {
        this.labels.push({ name: name, value: value });
    }
    addParameter(kind, name, value) {
        this.parameters.push({ kind: kind, name: name, value: value });
    }
    ;
    addStep(step) {
        this.steps.push(step);
    }
    ;
    addAttachment(attachment) {
        this.attachments.push(attachment);
    }
    ;
    end(status, error, timestamp = Date.now()) {
        this.stop = timestamp;
        this.status = !this.status ? status : this.status;
        this.failure = error ? { message: error.message, 'stack-trace': error.stackTrace } : this.failure;
    }
}
exports.Test = Test;
//# sourceMappingURL=test.js.map
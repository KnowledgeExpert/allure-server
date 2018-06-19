"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachment_1 = require("./attachment");
const step_1 = require("./step");
class Test {
    constructor(name, start, stop, failure, status, labels, parameters, description, attachments, steps) {
        this.name = name;
        this.start = start;
        this.stop = stop;
        this.failure = failure;
        this.status = status;
        this.labels = labels;
        this.parameters = parameters;
        this.description = description;
        this.attachments = attachments;
        this.steps = steps;
    }
    static async wrap(cachedTest, popdata) {
        const attachments = await Promise.all(cachedTest.attachments.map(async (cachedAttachment) => attachment_1.Attachment.wrap(cachedAttachment, popdata)));
        const steps = await Promise.all(cachedTest.steps.map(async (cachedStep) => step_1.Step.wrap(cachedStep, popdata)));
        return new Test(cachedTest.name, cachedTest.start, cachedTest.stop, cachedTest.failure, cachedTest.status, cachedTest.labels, cachedTest.parameters, cachedTest.description, attachments, steps);
    }
}
exports.Test = Test;
//# sourceMappingURL=test.js.map
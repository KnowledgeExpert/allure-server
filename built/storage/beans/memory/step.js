"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachment_1 = require("./attachment");
class Step {
    constructor(name, status, start, stop, attachments, innerSteps) {
        this.attachments = [];
        this.innerSteps = [];
        this.name = name;
        this.status = status;
        this.start = start;
        this.stop = stop;
        this.attachments = attachments;
        this.innerSteps = innerSteps;
    }
    static async wrap(cachedStep, popdata) {
        return new Step(cachedStep.name, cachedStep.status, cachedStep.start, cachedStep.stop, await Promise.all(cachedStep.attachments.map(async (cachedAttachment) => await attachment_1.Attachment.wrap(cachedAttachment, popdata))), await Promise.all(cachedStep.innerSteps.map(async (cachedStep) => await Step.wrap(cachedStep, popdata))));
    }
}
exports.Step = Step;
//# sourceMappingURL=step.js.map
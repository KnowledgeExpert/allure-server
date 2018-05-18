"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Step {
    constructor(name, timestamp = Date.now()) {
        this.innerSteps = [];
        this.attachments = [];
        if (!name) {
            throw new Error(`Cannot create step with 'name' - '${name}'`);
        }
        this.name = name;
        this.start = timestamp;
    }
    addStep(step) {
        this.innerSteps.push(step);
    }
    addAttachment(attachment) {
        this.attachments.push(attachment);
    }
    end(status, timestamp = Date.now()) {
        this.status = status;
        this.stop = timestamp;
    }
}
exports.Step = Step;
//# sourceMappingURL=step.js.map
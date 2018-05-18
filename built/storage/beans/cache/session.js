"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suite_1 = require("./suite");
const attachment_1 = require("./attachment");
const test_1 = require("./test");
const step_1 = require("./step");
class Session {
    constructor() {
        this.suites = [];
    }
    startSuite(suiteName, timestamp) {
        this.suites.unshift(new suite_1.Suite(suiteName, timestamp));
    }
    endSuite(timestamp) {
        const suite = this.getCurrentSuite();
        suite.end(timestamp);
    }
    startCase(testName, timestamp) {
        const suite = this.getCurrentSuite();
        if (suite.currentTest) {
            throw new Error("");
        }
        const test = new test_1.Test(testName, timestamp);
        suite.currentTest = test;
        suite.addTest(test);
    }
    endCase(status, err, timestamp) {
        this.getCurrentTest().end(status, err, timestamp);
        this.getCurrentSuite().currentTest = null;
    }
    startStep(stepName, timestamp) {
        const test = this.getCurrentTest();
        const newStep = new step_1.Step(stepName, timestamp);
        const currentStep = test.currentStep;
        if (currentStep) {
            currentStep.addStep(newStep);
            newStep.parent = currentStep;
            test.currentStep = newStep;
        }
        else {
            test.addStep(newStep);
            test.currentStep = newStep;
        }
    }
    endStep(status, timestamp) {
        const currentStep = this.getCurrentStep();
        const currentStepParent = currentStep.parent;
        currentStep.end(status, timestamp);
        this.getCurrentTest().currentStep = currentStepParent;
    }
    setDescription(content, type) {
        this.getCurrentTest().setDescription(content, type);
    }
    addAttachment(title, filepath, mime, size, fileId) {
        const attachment = new attachment_1.Attachment(title, filepath, mime, size, fileId);
        const test = this.getCurrentTest();
        if (test.currentStep) {
            test.currentStep.addAttachment(attachment);
        }
        else {
            test.addAttachment(attachment);
        }
    }
    addLabel(name, value) {
        this.getCurrentTest().addLabel(name, value);
    }
    addParameter(kind, name, value) {
        this.getCurrentTest().addParameter(kind, name, value);
    }
    ;
    getCurrentSuite() {
        const suite = this.suites[0];
        if (!suite) {
            throw new Error('No started suite');
        }
        return suite;
    }
    getCurrentTest() {
        const test = this.getCurrentSuite().currentTest;
        if (!test) {
            throw new Error('No started test');
        }
        return test;
    }
    getCurrentStep() {
        const step = this.getCurrentTest().currentStep;
        if (!step) {
            throw new Error('No started step');
        }
        return step;
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map
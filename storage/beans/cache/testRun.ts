import {Suite} from "./suite";
import {Attachment} from "./attachment";
import {Test} from "./test";
import {Step} from "./step";


export class TestRun {
    public readonly suites: Suite[] = [];

    startSuite(suiteName: string, timestamp: number) {
        this.suites.unshift(new Suite(suiteName, timestamp));
    }

    endSuite(timestamp: number) {
        const suite = this.getCurrentSuite();
        suite.end(timestamp);
    }

    startCase(testName: string, timestamp: number) {
        const suite = this.getCurrentSuite();
        if (suite.currentTest) {
            throw new Error("");
        }

        const test = new Test(testName, timestamp);
        suite.currentTest = test;
        suite.addTest(test);
    }

    endCase(status: string, err: { message: string, stackTrace: string }, timestamp: number) {
        this.getCurrentTest().end(status, err, timestamp);
        this.getCurrentSuite().currentTest = null;
    }

    startStep(stepName: string, timestamp: number) {
        const test = this.getCurrentTest();
        const newStep = new Step(stepName, timestamp);
        const currentStep = test.currentStep;
        if (currentStep) {
            currentStep.addStep(newStep);
            newStep.parent = currentStep;
            test.currentStep = newStep;
        } else {
            test.addStep(newStep);
            test.currentStep = newStep;
        }
    }

    endStep(status: string, timestamp: number) {
        const currentStep = this.getCurrentStep();
        const currentStepParent = currentStep.parent;
        currentStep.end(status, timestamp);
        this.getCurrentTest().currentStep = currentStepParent;
    }

    setDescription(content: string, type: string) {
        this.getCurrentTest().setDescription(content, type);
    }

    addAttachment(title: string, filepath: string, mime: string, size: number, fileId: string) {
        const attachment = new Attachment(title, filepath, mime, size, fileId);
        const test = this.getCurrentTest();
        if (test.currentStep) {
            test.currentStep.addAttachment(attachment);
        } else {
            test.addAttachment(attachment);
        }
    }

    addLabel(name: string, value: string) {
        this.getCurrentTest().addLabel(name, value);
    }

    addParameter(kind: string, name: string, value: string) {
        this.getCurrentTest().addParameter(kind, name, value);
    };

    private getCurrentSuite() {
        const suite = this.suites[0];
        if (!suite) {
            throw new Error('No started suite');
        }
        return suite;
    }

    private getCurrentTest() {
        const test = this.getCurrentSuite().currentTest;
        if (!test) {
            throw new Error('No started test');
        }
        return test;
    }

    private getCurrentStep() {
        const step = this.getCurrentTest().currentStep;
        if (!step) {
            throw new Error('No started step');
        }
        return step;
    }
}
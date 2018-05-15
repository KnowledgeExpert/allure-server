import {Attachment} from "./attachment";
import {Step} from "./step";
import {Description, DESCRIPTION_TYPE} from "../description";
import {TEST_STATUS} from "../testStatus";
import {Label} from "../label";
import {Parameter} from "../parameter";


export class Test {

    public readonly name: string;
    public readonly start: number;
    public stop: number;
    public failure: any;
    public status: TEST_STATUS;
    public readonly steps: Step[] = [];
    public readonly labels: Label[] = [];
    public readonly attachments: Attachment[] = [];
    public readonly parameters: Parameter[] = [];
    public description: Description;
    public currentStep: Step;

    constructor(name: string, timestamp = Date.now()) {
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

    setDescription(content: string, type: DESCRIPTION_TYPE) {
        this.description = new Description(content, type);
    }

    addLabel(name: string, value: string) {
        this.labels.push({name: name, value: value});
    }

    addParameter(kind: string, name: string, value: string) {
        this.parameters.push({kind: kind, name: name, value: value});
    };

    addStep(step: Step) {
        this.steps.push(step);
    };

    addAttachment(attachment: Attachment) {
        this.attachments.push(attachment);
    };

    end(status: TEST_STATUS, error: { message: string, stackTrace: string }, timestamp = Date.now()) {
        this.stop = timestamp;
        this.status = !this.status ? status : this.status;
        this.failure = error ? {message: error.message, 'stack-trace': error.stackTrace} : this.failure;
    }

}

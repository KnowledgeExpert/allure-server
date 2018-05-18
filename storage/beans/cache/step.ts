import {Attachment} from "./attachment";


export class Step {
    public readonly name: string;
    public status: string;
    public readonly start: number;
    public stop: number;
    public readonly innerSteps: Step[] = [];
    public readonly attachments: Attachment[] = [];
    public parent: Step;

    constructor(name: string, timestamp = Date.now()) {
        if (!name) {
            throw new Error(`Cannot create step with 'name' - '${name}'`);
        }
        this.name = name;
        this.start = timestamp;
    }

    addStep(step: Step) {
        this.innerSteps.push(step);
    }

    addAttachment(attachment: Attachment) {
        this.attachments.push(attachment);
    }

    end(status: string, timestamp = Date.now()) {
        this.status = status;
        this.stop = timestamp;
    }

}
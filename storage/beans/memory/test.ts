import {Test as CachedTest} from "../cache/test";
import {Label} from "../label";
import {Parameter} from "../parameter";
import {Description} from "../description";
import {Attachment} from "./attachment";
import {Attachment as CachedAttachment} from "../cache/attachment";
import {Step} from "./step";
import {Step as CachedStep} from "../cache/step";

export class Test {
    public readonly name: string;
    public readonly start: number;
    public readonly stop: number;
    public readonly failure: any;
    public readonly status: string;
    public readonly labels: Label[];
    public readonly parameters: Parameter[];
    public readonly description: Description;
    public readonly attachments: Attachment[];
    public readonly steps: Step[];

    private constructor(name, start, stop, failure, status, labels, parameters, description, attachments, steps) {
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

    static async wrap(cachedTest: CachedTest, popdata: boolean) {
        const attachments = await Promise.all(cachedTest.attachments.map(async (cachedAttachment) => Attachment.wrap(cachedAttachment, popdata)));
        const steps = await Promise.all(cachedTest.steps.map(async (cachedStep) => Step.wrap(cachedStep, popdata)));
        return new Test(
            cachedTest.name,
            cachedTest.start,
            cachedTest.stop,
            cachedTest.failure,
            cachedTest.status,
            cachedTest.labels,
            cachedTest.parameters,
            cachedTest.description,
            attachments,
            steps
        );
    }
}

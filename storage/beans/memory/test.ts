import {Test as CachedTest} from "../cache/test";
import {TEST_STATUS} from "../testStatus";
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
    public readonly status: TEST_STATUS;
    public readonly labels: Label[];
    public readonly parameters: Parameter[];
    public readonly description: Description;
    public readonly attachments: Attachment[];
    public readonly steps: Step[];

    constructor(cachedTest: CachedTest) {
        this.name = cachedTest.name;
        this.start = cachedTest.start;
        this.stop = cachedTest.stop;
        this.failure = cachedTest.failure;
        this.status = cachedTest.status;
        this.labels = cachedTest.labels;
        this.parameters = cachedTest.parameters;
        this.description = cachedTest.description;
        this.attachments = cachedTest.attachments
            .map((cachedAttachment: CachedAttachment) => new Attachment(cachedAttachment));
        this.steps = cachedTest.steps
            .map((cachedStep: CachedStep) => new Step(cachedStep));
    }
}

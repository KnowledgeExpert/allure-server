import * as uuid from "uuid";
import {Storage} from "../storage/";


const RESPONSE_SUCCESS = {status: "success"};

export const router = function (app) {

    app.get("/id", (request, response) => {
        response.status(200).send(uuid.v4());
    });

    app.delete("/", (request, response) => {
        returnJson(response, () => {
            const uuid = request.query.uuid;
            Storage.clear(uuid);
        });
    });

    app.get("/popdata", (request, response) => {
        returnJson(response, () => {
            const uuid = request.query.uuid;
            return Storage.popData(uuid);
        });
    });

    app.post("/startsuite", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const name: string = request.body.name;
            const timestamp: string = request.body.timestamp;
            Storage.startSuite(uuid, name, timestamp)
        });
    });

    app.post("/endsuite", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const timestamp: string = request.body.timestamp;
            Storage.endSuite(uuid, timestamp)
        });
    });

    app.post("/starttest", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const timestamp: string = request.body.timestamp;
            const name: string = request.body.name;
            Storage.startCase(uuid, name, timestamp)
        });
    });

    app.post("/endtest", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const timestamp: string = request.body.timestamp;
            const status: string = request.body.status;
            const error: string = request.body.error;
            Storage.endCase(uuid, status, error, timestamp);
        });
    });

    app.post("/startstep", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const timestamp: string = request.body.timestamp;
            const name: string = request.body.name;
            Storage.startStep(uuid, name, timestamp);
        });
    });

    app.post("/endstep", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const status: string = request.body.status;
            const timestamp: string = request.body.timestamp;
            Storage.endStep(uuid, status, timestamp);
        });
    });

    app.post("/description", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const content: string = request.body.content;
            const type: string = request.body.type;
            Storage.setDescription(uuid, content, type);
        });
    });


    app.post("/attachment", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const name: string = request.body.name;
            const mime: string = request.body.mime;
            const rawContent: string = request.body.content;
            const content: string = rawContent.match(/^['"](.*)['"]$/) ? rawContent.match(/^['"](.*)['"]$/)[1] : rawContent;
            Storage.addAttachment(uuid, name, content, mime);
        });
    });

    app.post("/label", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const name: string = request.body.name;
            const value: string = request.body.value;
            Storage.addLabel(uuid, name, value);
        });
    });

    app.post("/parameter", (request, response) => {
        returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const kind: string = request.body.kind;
            const name: string = request.body.name;
            const value: string = request.body.value;
            Storage.addParameter(uuid, kind, name, value);
        });
    });

    function returnJson(response, func: () => any) {
        response.setHeader('Content-Type', 'application/json');
        try {
            const result = func();
            response.status(200).json(result ? result : RESPONSE_SUCCESS);
        } catch (error) {
            response.status(500).send({
                status: 'failed',
                message: error.message ? error.message : '',
                stackTrace: error.stack ? error.stack : ''
            });
            return;
        }

    }

};

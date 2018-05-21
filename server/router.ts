import * as uuid from "uuid";
import {Storage} from "../storage/";
import * as p from "path";
import {Configuration} from "./configuration";
const multer = require("multer");
const upload = multer({dest: Configuration.cacheDir});


export const router = function (app) {

    app.get("/session", async (request, response) => {
        response.status(200).send(uuid.v4());
    });

    app.delete("/session", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.query.uuid;
            console.log('delete /session', uuid);
            Storage.deleteSession(uuid);
        });
    });

    app.get("/popdata", async (request, response) => {
        await returnJson(response, async () => {
            const uuid = request.query.uuid;
            console.log('get /popdata', uuid);
            return await Storage.popData(uuid);
        });
    });

    app.post("/startsuite", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const name: string = request.body.name;
            const timestamp: string = request.body.timestamp;
            console.log('post /startsuite', uuid, name, timestamp);
            Storage.startSuite(uuid, name, timestamp)
        });
    });

    app.post("/endsuite", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const timestamp: string = request.body.timestamp;
            console.log('post /endsuite', uuid, timestamp);
            Storage.endSuite(uuid, timestamp)
        });
    });

    app.post("/starttest", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const name: string = request.body.name;
            const timestamp: string = request.body.timestamp;
            console.log('post /starttest', uuid, name, timestamp);
            Storage.startTest(uuid, name, timestamp)
        });
    });

    app.post("/endtest", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const status: string = request.body.status;
            const error: string = request.body.error;
            const timestamp: string = request.body.timestamp;
            console.log('post /endtest', uuid, status, error, timestamp);
            Storage.endTest(uuid, status, error, timestamp);
        });
    });

    app.post("/startstep", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const name: string = request.body.name;
            const timestamp: string = request.body.timestamp;
            console.log('post /startstep', uuid, name, timestamp);
            Storage.startStep(uuid, name, timestamp);
        });
    });

    app.post("/endstep", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const status: string = request.body.status;
            const timestamp: string = request.body.timestamp;
            console.log('post /endstep', uuid, status, timestamp);
            Storage.endStep(uuid, status, timestamp);
        });
    });

    app.post("/description", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const content: string = request.body.content;
            const type: string = request.body.type;
            console.log('post /description', uuid, content, type);
            Storage.addDescription(uuid, content, type);
        });
    });

    app.post("/attachment", upload.single('attachment'), async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const title: string = request.body.title;

            const path = p.resolve(Configuration.cacheDir, request.file.filename);
            const mime = request.file.mimetype;
            const filesize = request.file.size;
            const fileId = request.file.filename;

            console.log('post /attachment', uuid, title, request.file);
            Storage.addAttachment(uuid, title, path, mime, filesize, fileId);
        });
    });

    app.post("/label", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const name: string = request.body.name;
            const value: string = request.body.value;
            console.log('post /label', uuid, name, value);
            Storage.addLabel(uuid, name, value);
        });
    });

    app.post("/parameter", async (request, response) => {
        await returnJson(response, () => {
            const uuid: string = request.body.uuid;
            const kind: string = request.body.kind;
            const name: string = request.body.name;
            const value: string = request.body.value;
            console.log('post /parameter', uuid, kind, name, value);
            Storage.addParameter(uuid, kind, name, value);
        });
    });

    async function returnJson(response, func: () => any) {
        const RESPONSE_SUCCESS = {status: "success"};
        response.setHeader('Content-Type', 'application/json');
        try {
            const result = await func();
            response.status(200).json(result ? result : RESPONSE_SUCCESS);
            console.log('Success');
        } catch (error) {
            response.status(500).send({
                status: 'failed',
                message: error.message ? error.message : '',
                stack: error.stack ? error.stack : ''
            });
            console.log('Error');
            return;
        }

    }

};

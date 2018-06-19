"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const _1 = require("../storage/");
const p = require("path");
const configuration_1 = require("./configuration");
const multer = require("multer");
const upload = multer({ dest: configuration_1.Configuration.cacheDir });
exports.router = function (app) {
    app.get("/session", async (request, response) => {
        response.status(200).send(uuid.v4());
    });
    app.delete("/session", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.query.uuid;
            console.log('delete /session', uuid);
            _1.Storage.deleteSession(uuid);
        });
    });
    app.get("/popdata", async (request, response) => {
        await returnJson(response, async () => {
            const uuid = request.query.uuid;
            console.log('get /popdata', uuid);
            return await _1.Storage.popData(uuid);
        });
    });
    app.get("/data", async (request, response) => {
        await returnJson(response, async () => {
            const uuid = request.query.uuid;
            console.log('get /popdata', uuid);
            return await _1.Storage.getData(uuid);
        });
    });
    app.post("/startsuite", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const name = request.body.name;
            const timestamp = request.body.timestamp;
            console.log('post /startsuite', uuid, name, timestamp);
            _1.Storage.startSuite(uuid, name, timestamp);
        });
    });
    app.post("/endsuite", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const timestamp = request.body.timestamp;
            console.log('post /endsuite', uuid, timestamp);
            _1.Storage.endSuite(uuid, timestamp);
        });
    });
    app.post("/starttest", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const name = request.body.name;
            const timestamp = request.body.timestamp;
            console.log('post /starttest', uuid, name, timestamp);
            _1.Storage.startTest(uuid, name, timestamp);
        });
    });
    app.post("/endtest", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const status = request.body.status;
            const error = request.body.error;
            const timestamp = request.body.timestamp;
            console.log('post /endtest', uuid, status, error, timestamp);
            _1.Storage.endTest(uuid, status, error, timestamp);
        });
    });
    app.post("/startstep", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const name = request.body.name;
            const timestamp = request.body.timestamp;
            console.log('post /startstep', uuid, name, timestamp);
            _1.Storage.startStep(uuid, name, timestamp);
        });
    });
    app.post("/endstep", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const status = request.body.status;
            const timestamp = request.body.timestamp;
            console.log('post /endstep', uuid, status, timestamp);
            _1.Storage.endStep(uuid, status, timestamp);
        });
    });
    app.post("/description", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const content = request.body.content;
            const type = request.body.type;
            console.log('post /description', uuid, content, type);
            _1.Storage.addDescription(uuid, content, type);
        });
    });
    app.post("/attachment", upload.single('attachment'), async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const title = request.body.title;
            const path = p.resolve(configuration_1.Configuration.cacheDir, request.file.filename);
            const mime = request.file.mimetype;
            const filesize = request.file.size;
            const fileId = request.file.filename;
            console.log('post /attachment', uuid, title, request.file);
            _1.Storage.addAttachment(uuid, title, path, mime, filesize, fileId);
        });
    });
    app.post("/label", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const name = request.body.name;
            const value = request.body.value;
            console.log('post /label', uuid, name, value);
            _1.Storage.addLabel(uuid, name, value);
        });
    });
    app.post("/parameter", async (request, response) => {
        await returnJson(response, () => {
            const uuid = request.body.uuid;
            const kind = request.body.kind;
            const name = request.body.name;
            const value = request.body.value;
            console.log('post /parameter', uuid, kind, name, value);
            _1.Storage.addParameter(uuid, kind, name, value);
        });
    });
    async function returnJson(response, func) {
        const RESPONSE_SUCCESS = { status: "success" };
        response.setHeader('Content-Type', 'application/json');
        try {
            const result = await func();
            response.status(200).json(result ? result : RESPONSE_SUCCESS);
            console.log('Success');
        }
        catch (error) {
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
//# sourceMappingURL=router.js.map
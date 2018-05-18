"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const router_1 = require("./router");
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
router_1.router(app);
app.use((request, response) => {
    response.status(404).send({ url: `${request.originalUrl} not found` });
});
const server = app.listen(port, () => console.log(`Allure Http Storage is running on port ${port}`));
//# sourceMappingURL=app.js.map
const express = require('express');
const chatUserRouter = require('./chatUserRouter');

function createMainRouter() {
    const mainRouter = express.Router();
    mainRouter.use(`/chat-user`, chatUserRouter);

    return mainRouter;
}

module.exports = { createMainRouter };

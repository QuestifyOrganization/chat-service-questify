const express = require('express');
const chatGroupRouter = require('./chatGroupRouter');
const chatGroupMembershipRouter = require('./chatGroupMembershipRouter');
const chatUserRouter = require('./chatUserRouter');
const messageRouter = require('./messageRouter');
const messageViewerRouter = require('./messageViewerRouter');

function createMainRouter() {
    const mainRouter = express.Router();

    mainRouter.use(`/${chatGroupRouter.modelName}`, chatGroupRouter);
    mainRouter.use(`/${chatGroupMembershipRouter.modelName}`, chatGroupMembershipRouter);
    mainRouter.use(`/${chatUserRouter.modelName}`, chatUserRouter);
    mainRouter.use(`/${messageRouter.modelName}`, messageRouter);
    mainRouter.use(`/${messageViewerRouter.modelName}`, messageViewerRouter);

    return mainRouter;
}

module.exports = { createMainRouter };

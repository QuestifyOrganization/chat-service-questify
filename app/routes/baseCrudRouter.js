const express = require('express');

class BaseCrudRouter {
    constructor(controllerObject) {
        if (!controllerObject) {
            throw new Error('The controllerObject parameter is required to create the BaseCrudRouter.');
        }

        this.controller = controllerObject;
        this.modelName = this.controller.model.modelName.toLowerCase();
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get(`/list`, this.controller.getAllRecords);
        this.router.get(`/:id`, this.controller.getRecordById);
        this.router.post(`/create`, this.controller.createRecord);
        this.router.put(`/update/:id`, this.controller.updateRecord);
        this.router.delete(`/delete/:id`, this.controller.deleteRecord);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = BaseCrudRouter;

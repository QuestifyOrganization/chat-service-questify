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
        this.router.get(`/list`, (req, res) => {
            this.controller.getAllRecords(req, res);
        });
    
        this.router.get(`/:id`, (req, res) => {
            this.controller.getRecordById(req, res);
        });
    
        this.router.post(`/create`, (req, res) => {
            this.controller.createRecord(req, res);
        });
    
        this.router.put(`/update/:id`, (req, res) => {
            this.controller.updateRecord(req, res);
        });
    
        this.router.delete(`/delete/:id`, (req, res) => {
            this.controller.deleteRecord(req, res);
        });
    }    

    getRouter() {
        return this.router;
    }
}

module.exports = BaseCrudRouter;

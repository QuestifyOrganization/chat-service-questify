const mongoose = require('../services/databaseService');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const CompanyModel = mongoose.model('Company', companySchema);

module.exports = CompanyModel;

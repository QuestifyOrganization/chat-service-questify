class BaseCrudController {
  constructor(model) {
    if (!model) {
      throw new Error('Model is required for BaseCrudController');
    }
    this.model = model;
  }

  async getAllRecords(req, res) {
      try {
        const records = await this.model.findAll();
        return res.status(200).json(records);
      } catch (error) {
        console.error('Error fetching records:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  
  async getRecordById(req, res, recordData = null) {
    const { id } = recordData || req.params;
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        return res.status(404).json({ error: 'Record not found' });
      } else {
        return res.status(200).json(record);
      }
    } catch (error) {
      console.error('Error fetching record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async createRecord(req, res, recordData = null) {
    try {
      const newRecord = new this.model(recordData || req.body);
      const savedRecord = await newRecord.save();

      return res.status(201).json(savedRecord);
    } catch (error) {
      console.error('Error creating record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async updateRecord(req, res, recordData = null) {
    const { id } = recordData || req.params;
    try {
      const [updatedRows] = await this.update(req.body, { where: { id } });
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Record not found' });
      } else {
        return res.status(200).json({ message: 'Record updated successfully' });
      }
    } catch (error) {
      console.error('Error updating record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async deleteRecord(req, res, recordData = null) {
    const { id } = recordData || req.params;
    try {
      const deletedRowCount = await this.model.destroy({ where: { id } });
      if (deletedRowCount === 0) {
        return res.status(404).json({ error: 'Record not found' });
      } else {
        return res.status(204).json();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

}
  
  module.exports = BaseCrudController;
  
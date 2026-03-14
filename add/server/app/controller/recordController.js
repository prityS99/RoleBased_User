const Record = require("../models/record");

class RecordsController {

  // CREATE RECORD
  async createRecord(req, res) {
    try {

      const { title, description, status } = req.body;

      const record = await Record.create({
        title,
        description,
        status,
        created_by: req.user._id
      });

      res.status(201).json({
        success: true,
        message: "Record created successfully",
        record
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET ALL RECORDS
  async getAllRecords(req, res) {
    try {

      const records = await Record.find()
        .populate("created_by", "name email")
        .sort({ created_at: -1 });

      res.status(200).json({
        success: true,
        count: records.length,
        records
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET SINGLE RECORD
  async getRecordById(req, res) {
    try {

      const { id } = req.params;

      const record = await Record.findById(id)
        .populate("created_by", "name email");

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found"
        });
      }

      res.status(200).json({
        success: true,
        record
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // UPDATE RECORD
  async updateRecord(req, res) {
    try {

      const { id } = req.params;

      const record = await Record.findByIdAndUpdate(
        id,
        {
          ...req.body,
          updated_at: Date.now()
        },
        { new: true }
      );

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Record updated successfully",
        record
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE RECORD
  async deleteRecord(req, res) {
    try {

      const { id } = req.params;

      const record = await Record.findByIdAndDelete(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Record deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

}

module.exports = new RecordsController();
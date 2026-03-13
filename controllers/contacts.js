const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('contacts').find();
        result.toArray().then((contacts) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(contacts);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        // FIXED: Changed from find() to findOne() and fixed syntax
        const contact = await mongodb.getDatabase().db().collection('contacts').findOne({ _id: userId });
        
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ADDED: Export the functions
module.exports = {
    getAll,
    getSingle
};
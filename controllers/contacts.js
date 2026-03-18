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

const createContact = async (req, res) => {
    try {                                           // ✅ added try/catch
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday,
        };
        const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the contact.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateContact = async (req, res) => {
    try {                                           // ✅ added try/catch
        const contactId = new ObjectId(req.params.id);
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday,
        };
        const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId }, contact); // ✅ fixed contactIdId → contactId
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occurred while updating contact.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteContact = async (req, res) => {
    try {                                           // ✅ added try/catch
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: userId }); // ✅ replaceOne → deleteOne, removed bogus `true`
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occurred while deleting contact.');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ADDED: Export the functions
module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};
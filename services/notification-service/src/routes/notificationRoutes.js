const express = require('express');
const router = express.Router();
const {
    createnotification,
    getAllnotifications,
    notificationById,
    editnotification,
    deletenotification
} = require('../controllers/notificationControllers');

router.post('/notifications', createnotification);

router.get('/notifications', getAllnotifications);

router.get('/notifications/:id', notificationById);

router.put('/notifications/:id', editnotification);

router.delete('/notifications/:id', deletenotification);

module.exports = router;
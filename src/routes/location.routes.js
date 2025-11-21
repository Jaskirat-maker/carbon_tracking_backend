const express = require('express');
const router = express.Router();
const { getNearest } = require('../controllers/location.controller');

router.post('/nearest', getNearest);

module.exports = router;

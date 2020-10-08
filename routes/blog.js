var express = require('express');
var router = express.Router();

const controller = require("../controller/blogController")

/* GET blog listing. */
router.get('/', controller.index);

module.exports = router;

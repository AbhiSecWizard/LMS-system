const multer = require("multer");
const path = require("path");

// Isse 'upload' folder aapke project ke root folder ke andar banega
const upload = multer({ dest: path.join(__dirname, "../../upload") });

module.exports = upload;
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const extname =
      path.extname(file.originalname) || file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + extname);
  },
});

module.exports = multer({ storage: storage }).single("img");

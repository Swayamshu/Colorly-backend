const express = require("express");
const router = express.Router();
const { ColorPaletteController } = require("../controllers");

// !!! ----- V IMP ----- !!!!
// route path is relative here

router.get("/", ColorPaletteController.getColorPalette);
router.post("/", ColorPaletteController.createColorPalette);
router.patch("/", ColorPaletteController.saveColorPalette);
router.patch("/unsave", ColorPaletteController.unsaveColorPalette);

module.exports = router;
const express = require("express");
const router = express.Router();
const { ColorPaletteController } = require("../controllers");

router.get("/", ColorPaletteController.getColorPalette);
router.get("/random", ColorPaletteController.getRandomColorPalettes);
router.post("/new", ColorPaletteController.getNewColorPalettes);
router.post("/popular", ColorPaletteController.getPopularColorPalettes);
router.post("/pattern/top", ColorPaletteController.getTopColorPatterns);
router.post("/", ColorPaletteController.createColorPalette);
router.patch("/", ColorPaletteController.saveColorPalette);
router.patch("/unsave", ColorPaletteController.unsaveColorPalette);

module.exports = router;
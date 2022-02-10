const express = require("express");
const productController = require("../controllers/product");
const auth = require("../middleware/auth");
const multer = require("multer");

const router = express.Router();

//how files get stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

router.get("/list-category", productController.listCategory);
router.post("/create-category", productController.createCategory);
router.get("/detail-category/:id", productController.detailCategory);
router.put("/update-category/:id", productController.updateCategory);
router.delete("/delete-category/:id", productController.deleteCategory);
router.get("/search-category/", productController.searchCategory);

//product
router.get("/list-product", productController.listProduct);
router.post(
    "/create-product",
    upload.single("productImage"),
    productController.createProduct
);
router.get("/detail-product/:id", productController.detailProduct);

router.get("/excel-converter", productController.bulkUploadFromExcel);
router.put(
    "/update-product",
    upload.single("productImage"),
    productController.updateProduct
);
router.delete("/delete-product/:id", productController.deleteProduct);
router.get("/search-product/", productController.searchProduct);
router.get(
    "/category-per-product/",
    productController.listOfProductsPerCategory
);

//bulkUploadFromExcel

module.exports = router;

// listOfProductsPerCategory

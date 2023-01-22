const { Router } = require("express");

const productRouter = require("./productRouter.js");
const categoryRouter = require("./categoryRouter");

const router = Router();
const express = require("express");

router.use(express.json());

router.use("/products", productRouter);
router.use("/categorys", categoryRouter);

module.exports = router;

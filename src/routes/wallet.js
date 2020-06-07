const router = require("express").Router();
const stockModel = require("../models/stock");

router.get("/", async (_, res) => {

});

module.exports = (app) => app.use("/wallet", router);

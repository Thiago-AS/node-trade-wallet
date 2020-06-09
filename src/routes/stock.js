const router = require("express").Router();
const stockModel = require("../models/stock");

router.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    const stock = id
      ? await stockModel.findById(id)
      : await stockModel.find({});
    return res.status(200).send(stock);
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
});

router.get("/value", async (req, res) => {
  const { id } = req.query;
  try {
    const stockValue = await stockModel.findById(id, { value: 1 });
    return res.status(200).send(stockValue);
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
});

module.exports = (app) => app.use("/stock", router);

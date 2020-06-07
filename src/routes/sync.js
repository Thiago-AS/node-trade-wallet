const router = require("express").Router();
const selectedStocks = require("../data/selectedStocks.json");
const finhub = require("../service/finhub");
const axios = require("axios");
const stockModel = require("../models/stock");

router.get("/", async (req, res) => {
  const stocksInfo = (
    await Promise.all(
      selectedStocks.map((stock) =>
        axios.get(finhub.companyProfileURL(stock.symbol))
      )
    )
  ).map(({ data }) => data);

  let inserted, failed;
  try {
    const data = await stockModel.insertMany(stocksInfo, { ordered: false });
    inserted = data.length;
  } catch (err) {
    console.log(err);
    failed = err.writeErrors.length;
  }
  return res.status(200).json({inserted, failed});
  
});

module.exports = (app) => app.use("/sync", router);

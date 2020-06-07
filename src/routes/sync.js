const router = require("express").Router();
const selectedStocks = require("../data/selectedStocks.json");
const finhub = require("../service/finhub");
const axios = require("axios");
const stockModel = require("../models/stock");

router.get("/stocks/init", async (_, res) => {
  const stocksInfo = (
    await Promise.all(
      selectedStocks.map(({ symbol }) =>
        axios.get(finhub.companyProfileURL(symbol))
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
  return res.status(200).send({ inserted, failed });
});

router.get("/stocks/value", async (_, res) => {
  try {
    const stocks = await stockModel.find(
      {},
      {
        _id: 1,
        ticker: 1,
      }
    );
    const response = await Promise.all(
      stocks.map(async ({ _id, ticker }) => {
        const response = await axios.get(finhub.quoteStockPrice(ticker));
        const value = response.status === 200 ? response.data : undefined;
        return await stockModel.findByIdAndUpdate(
          _id,
          {
            $set: { value, updatedAt: Date.now() },
          },
          { new: true }
        );
      })
    );

    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ data: [] });
  }
});

module.exports = (app) => app.use("/sync", router);

const router = require("express").Router();
const selectedStocks = require("../data/selectedStocks.json");
const finhub = require("../service/finhub");
const axios = require('axios');

router.get("/", async (req, res) => {
  const promises = selectedStocks.map(stock => axios.get(finhub.companyProfileURL(stock.symbol)));
  const resolvedPromises = await Promise.all(promises);
  
  return res.status(200).json({ "status": "ok" });
});


module.exports = app => app.use("/sync", router);

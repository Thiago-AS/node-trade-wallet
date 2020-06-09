const router = require("express").Router();
const stockModel = require("../models/stock");
const walletModel = require("../models/wallet");
const { validateToken } = require("../utils/auth");

router.use(validateToken);

router.post("/operation", async (req, res) => {
  const { stockId, amount, price, operationType } = req.body;
  const { userId } = req;
  try {
    const wallet = await walletModel.findOne({ userId });
    const { ticker, name } = await stockModel.findById(stockId, {
      ticker: 1,
      name: 1,
    });
    if (wallet.stocks[stockId]) {
      wallet.stocks[stockId].amount =
        operationType === "buy"
          ? wallet.stocks[stockId].amount + amount
          : wallet.stocks[stockId].amount - amount;

      if (wallet.stocks[stockId].amount > 0) {
        wallet.stocks[stockId].averagePrice =
          operationType === "buy"
            ? (wallet.stocks[stockId].averagePrice *
                wallet.stocks[stockId].amount +
                price * amount) /
              (wallet.stocks[stockId].amount + amount)
            : (wallet.stocks[stockId].averagePrice *
                wallet.stocks[stockId].amount -
                price * amount) /
              (wallet.stocks[stockId].amount - amount);
      } else {
        wallet.stocks[stockId] = undefined;
        delete wallet.stocks[stockId];
      }
    } else {
      wallet.stocks[stockId] = {
        amount,
        ticker,
        averagePrice: price,
        name,
      };
    }
    wallet.markModified("stocks");
    wallet.history.push({
      ticker,
      amount,
      name,
      date: Date.now(),
      price,
      operationType,
      stockId,
    });
    wallet.updatedAt = Date.now();
    await wallet.save();
    return res.status(200).send(wallet);
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
});

router.get("/history", async (req, res) => {
  const { userId } = req;
  try {
    const history = await walletModel.findOne({ userId }, { history: 1 });
    return res.status(200).send(history);
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
});

router.get("/", async (req, res) => {
  const { userId } = req;
  try {
    const wallet = await walletModel.findOne({ userId });
    return res.status(200).send(wallet);
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
});

router.get("/stocks", async (req, res) => {
  const { userId } = req;
  try {
    const wallet = await walletModel.findOne({ userId });
    const stocksIds = Object.keys(wallet.stocks);
    const stocks = await stockModel.find().where("_id").in(stocksIds).exec();

    const stocksInfo = stocks.map((stock) => {
      const stockInfo = { ...stock.toObject(), ...wallet.stocks[stock._id] };
      return stockInfo;
    });
    return res.status(200).send(stocksInfo);
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
});

module.exports = (app) => app.use("/wallet", router);

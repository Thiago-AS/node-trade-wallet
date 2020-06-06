const router = require("express").Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken, validateToken } = require("../utils/auth");

router.post("/register", async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    const token = generateToken(user.id);
    return res.status(200).json({ user, token });
  } catch (err) {
    if (err.name === "UniqueError")
      return res.status(400).json({ error: "User already exists" });
    else return res.status(400).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) return res.status(400).send({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: "Invalid password" });

    user.password = undefined;
    user.__v = undefined;
    const token = generateToken(user.id);

    res.status(200).json({ user, token });
  } catch (err) {
    return res.status(400).json({ error: "Could not login into the system" });
  }
});

router.get("/test",validateToken, (req, res) => {
    res.json({ok: `funfou ${req.userId}`})
})

module.exports = app => app.use("/auth", router);
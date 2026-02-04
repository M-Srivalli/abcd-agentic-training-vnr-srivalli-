const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/check-review", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      review: req.body.review
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.listen(5001, () => {
  console.log("Backend running on port 5001");
});
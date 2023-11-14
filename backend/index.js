const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const axios = require("axios");

// connect to express app
const app = express();

dotenv.config();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// connect to mongoDB
const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(3001, () => {
      console.log("Server connected to port 3001 and MongoDb");
    });
  })
  .catch((error) => {
    console.log("Unable to connect to Server and/or MongoDB", error);
  });

// middleware
app.use(bodyParser.json());
app.use(cors());

// Translation model
const Translation = mongoose.model("Translation", {
  word: String,
  targetLanguage: String,
  translation: String,
});

/**
 * Api endpoint for Get all translations
 */
app.get("/translations/all", async (req, res) => {
  try {
    const allTranslations = await Translation.find();
    res.status(200).json(allTranslations);
  } catch (error) {
    console.error("Error retrieving all translations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Api endpoint for Add new translations
 * @constructor
 * @param {string} word - The word.
 * @param {string} targetLanguage - The targetLanguage of the word.
 * @param {string} translation - The translation of the word.
 */
app.post("/translations", async (req, res) => {
  try {
    const { word, targetLanguage, translation } = req.body;
    const newTranslation = new Translation({
      word,
      targetLanguage,
      translation,
    });
    await newTranslation.save();
    res.status(201).json({
      message: "Translation added successfully",
      _id: newTranslation._id,
    });
  } catch (error) {
    console.error("Error adding translation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Api endpoint for Retrieve translations
 * @constructor
 * @param {string} word - The word.
 * @param {string} targetLanguage - The targetLanguage of the word.
 */
app.get("/translations", async (req, res) => {
  try {
    const { word, targetLanguage } = req.body;
    const translations = await Translation.find({ word, targetLanguage });
    res.status(200).json(translations);
  } catch (error) {
    console.error("Error retrieving translations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Api endpoint for Update existing translations
 * @constructor
 * @param {string} id - The id of translation word.
 * @param {string} translation - The translation of the word.
 */
app.put("/translations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { translation } = req.body;
    let existingTranslation = await Translation.findByIdAndUpdate(id, {
      translation,
    });
    await existingTranslation.save();
    res.status(200).json({ message: "Translation updated successfully" });
  } catch (error) {
    console.error("Error updating translation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Api endpoint for Delete translations
 * @constructor
 * @param {string} id - The id of translation word.
 */
app.delete("/translations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Translation.findByIdAndDelete(id);
    res.status(200).json({ message: "Translation deleted successfully" });
  } catch (error) {
    console.error("Error deleting translation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Api endpoint for Translation of word in any language
 * @constructor
 * @param {string} word - The word.
 * @param {string} targetLanguage - The targetLanguage of the word.
 */
app.post("/translate", async (req, res) => {
  try {
    const { word, targetLanguage } = req.body;

    const encodedParams = new URLSearchParams();
    encodedParams.set("source_language", "en");
    encodedParams.set("target_language", targetLanguage);
    encodedParams.set("text", word);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.TRANSLATE_API_KEY,
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(400).json(error);
    }
  } catch (error) {
    console.error("Error retrieving translations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;

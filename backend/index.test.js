const request = require("supertest");
const app = require("./index.js");

describe("GET /translations/all", () => {
  it("should get all translations", async () => {
    const response = await request(app).get("/translations/all");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  }, 10000);
});

describe("POST /translations", () => {
  it("should add a new translation", async () => {
    const newTranslation = {
      word: "example",
      targetLanguage: "en",
      translation: "example translation",
    };

    const response = await request(app)
      .post("/translations")
      .send(newTranslation);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Translation added successfully",
      _id: response.body._id,
    });
  });
});

describe("GET /translations", () => {
  it("should retrieve translations based on word and targetLanguage", async () => {
    const response = await request(app).get("/translations").send({
      word: "example",
      targetLanguage: "hi",
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("PUT /translations/:id", () => {
  it("should update an existing translation", async () => {
    const existingTranslation = await request(app).post("/translations").send({
      word: "updateExample",
      targetLanguage: "hi",
      translation: "initial translation",
    });

    const response = await request(app)
      .put(`/translations/${existingTranslation.body._id}`)
      .send({
        translation: "updated translation",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Translation updated successfully",
    });
  });
});

describe("DELETE /translations/:id", () => {
  it("should delete an existing translation", async () => {
    const newTranslation = {
      word: "deleteExample",
      targetLanguage: "hi",
      translation: "example translation",
    };

    const addedTranslation = await request(app)
      .post("/translations")
      .send(newTranslation);

    const response = await request(app).delete(
      `/translations/${addedTranslation.body._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Translation deleted successfully",
    });
  });
});

describe("POST /translate", () => {
  it("should translate a word to a target language", async () => {
    const response = await request(app).post("/translate").send({
      word: "translateExample",
      targetLanguage: "es",
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("translatedText");
  });
});

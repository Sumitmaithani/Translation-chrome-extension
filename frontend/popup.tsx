import axios from "axios"
import { useState } from "react"

import { API_URI, Primary_Color, Text_color } from "~constants"

function IndexPopup() {
  const [word, setWord] = useState<string>("")
  const [lang, setLang] = useState<string>("hi")
  const [translate, setTranslate] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleTranslate = async () => {
    if (word.length < 1) {
      setError("Please enter the text")
      return
    }
    try {
      const response = await axios.post(`${API_URI}/translate`, {
        word: word,
        targetLanguage: lang
      })
      setTranslate(response.data.data.translatedText)
      handleSave()
    } catch (err) {
      console.log(err)
    }
  }

  const handleSave = async () => {
    try {
      await axios.post(`${API_URI}/translations`, {
        word: word,
        targetLanguage: lang,
        translation: translate
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      style={{
        width: 200
      }}>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}>
        <div>
          <textarea
            onChange={(e) => {
              setWord(e.target.value)
              setError("")
            }}
            value={word}
            style={{
              width: 180,
              border: 2,
              borderColor: Primary_Color,
              borderStyle: "solid",
              borderRadius: 10
            }}
            placeholder="Enter Text"
            rows={4}
          />
          <select
            data-testid="language-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              border: 1,
              borderColor: Primary_Color,
              borderStyle: "solid",
              background: Primary_Color,
              color: Text_color,
              paddingRight: 10,
              paddingLeft: 10,
              margin: 10,
              paddingTop: 5,
              paddingBottom: 5
            }}>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="ge">German</option>
            <option value="fr">French</option>
            <option value="ja">Japanese</option>
          </select>
          <div>
            <textarea
              disabled
              value={translate}
              style={{
                width: 180,
                border: 2,
                borderColor: Primary_Color,
                borderStyle: "solid",
                borderRadius: 10
              }}
              placeholder="Translation"
              rows={4}
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div>
            <button
              style={{
                background: Primary_Color,
                color: Text_color,
                border: 0,
                paddingRight: 10,
                paddingLeft: 10,
                margin: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 4,
                fontSize: 15
              }}
              onClick={handleTranslate}>
              Translate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup

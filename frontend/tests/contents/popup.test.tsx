import { describe, expect, it, jest } from "@jest/globals"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import axios from "axios"
import axiosMock from "axios-mock-adapter"
import React from "react"

import IndexPopup from "../../popup"

// Mocking Axios
const mockAxios = new axiosMock(axios)

// Mocking API_URI
jest.mock("~constants", () => ({
  API_URI: "http://example.com/api",
  Primary_Color: "#ffffff",
  Text_color: "#000000"
}))

describe("IndexPopup Component", () => {
  it("renders the component", () => {
    render(<IndexPopup />)
    expect(screen.getByPlaceholderText("Enter Text")).toBeTruthy()
    expect(screen.getByTestId("language-select")).toBeTruthy()
    expect(screen.getByPlaceholderText("Translation")).toBeTruthy()
    expect(screen.getByText("Translate")).toBeTruthy()
  })

  it("handles translation and save", async () => {
    render(<IndexPopup />)
    // Mocking the translation API call
    mockAxios.onPost("http://example.com/api/translate").reply(200, {
      data: { translatedText: "TranslatedText" }
    })

    // Mocking the save API call
    mockAxios.onPost("http://example.com/api/translations").reply(201, {})

    // Typing into the textarea
    fireEvent.change(screen.getByPlaceholderText("Enter Text"), {
      target: { value: "Test Text" }
    })

    // Selecting a language
    fireEvent.change(screen.getByTestId("language-select"), {
      target: { value: "es" }
    })

    // Clicking the translate button
    fireEvent.click(screen.getByText("Translate"))

    // Wait for translation to complete
    await waitFor(() => {
      const translationTextarea = screen.getByPlaceholderText(
        "Translation"
      ) as HTMLTextAreaElement
      expect(translationTextarea.value).toBe("TranslatedText")
    })

    expect(mockAxios.history.post.length).toBe(2) // Two requests should be made (translate and save)
  })

  it("displays an error when text is not entered for translation", async () => {
    render(<IndexPopup />)

    // Clicking the translate button without entering text
    fireEvent.click(screen.getByText("Translate"))

    // Check if the error message is displayed
    expect(screen.getByText("Please enter the text")).toBeTruthy()
  })
})

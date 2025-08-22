import { createSlice } from "@reduxjs/toolkit";

const countriesSlice = createSlice({
  name: "countries",
  initialState: {
    list: [
      "United States",
      "Canada",
      "United Kingdom",
      "Australia",
      "Germany",
      "France",
      "Japan",
      "Brazil",
      "India",
      "China",
      "Mexico",
      "Italy",
      "Spain",
      "South Korea",
      "Argentina",
      "Netherlands",
      "Switzerland",
      "Sweden",
      "Norway",
      "Denmark",
      "Finland",
      "Russia",
      "South Africa",
      "Egypt",
      "Nigeria",
      "Kenya",
      "Saudi Arabia",
      "Turkey",
      "Thailand",
      "Vietnam",
      "Indonesia",
      "Malaysia",
      "Singapore",
      "New Zealand",
    ],
    selectedCountry: null,
  },
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
  },
});
export const { setSelectedCountry } = countriesSlice.actions
export default countriesSlice.reducer;

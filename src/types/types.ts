interface YearlyCO2 {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
}

interface CountryCO2 {
  data: YearlyCO2[];
  iso_code: string;
}

interface CO2Dataset {
  [countryName: string]: CountryCO2;
}

export interface SelectedCountry {
  name: string;
  data: CountryCO2;
}

export type { YearlyCO2, CountryCO2, CO2Dataset };

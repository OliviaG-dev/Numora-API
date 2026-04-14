export interface BusinessNumbersResult {
  expression: {
    raw: number;
    value: number;
  };
  active: {
    raw: number;
    value: number;
  };
  hereditary: {
    raw: number;
    value: number;
  };
}

export interface PersonalNumbersResult {
  year: {
    number: number;
    description: string;
  };
  month: {
    number: number;
    description: string;
  };
  day: {
    number: number;
    description: string;
  };
}

export interface AddressVibrationInput {
  streetNumber: string;
  streetName: string;
  allowMasterNumbers?: boolean;
}

export interface LocalityVibrationInput {
  postalCode: string;
  city: string;
  allowMasterNumbers?: boolean;
}

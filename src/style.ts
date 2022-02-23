import { DefaultTheme } from "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    bgColor: string;
    fontColor: string;
    borderColor: string;
  }
}

export const lightTheme: DefaultTheme = {
  fontColor: "#2c2c2c",
  bgColor:"lightgrey",
  borderColor:`rgba(0, 0, 0, 0.1)`,
};

export const darkTheme: DefaultTheme = {
  fontColor: "#F6F6F6",
  bgColor:"#333333",
  borderColor:`rgba(255, 255, 255, 0.1)`,
};
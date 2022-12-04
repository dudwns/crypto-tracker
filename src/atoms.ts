import { atom } from "recoil";

export const isDarkAtom = atom({
  //atom은 고유한 key와 default 값을 요구
  key: "isDark",
  default: false,
});

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const queryClient = new QueryClient();

root.render(
  //ThemeProvider 안에 있는 component들은 theme object에 접근 가능
  //QueryClientProvider도 마찬가지로 안에 있는 component들은 queryClient에 접근 가능
  //Recoil 시작하는 방법
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>
);

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Holdings from "./pages/Holdings";
import Trades from "./pages/Trades";
import CurrencyRates from "./pages/CurrencyRates";
import Splits from './pages/Splits';
import Landing from "./pages/Landing";
import Upload from "./pages/Uplaod";
export default function App() {
  return (
      <Routes>
         <Route path="/" element={<Landing />} />
    <Route path="/upload" element={<Upload />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/currency-rates" element={<CurrencyRates />} />
          <Route path="/splits" element={<Splits />} />
        </Route>
      </Routes>
  );
}

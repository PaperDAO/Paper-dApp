import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import {
  Landing,
  Paper,
  Editor,
  Market,
} from './pages';

const AppRoutes: any = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={<Landing />} />
      <Route
        path="/editor"
        element={<Editor />} />
      <Route
        path="/paper"
        element={<Paper />} />
      <Route
        path="/market"
        element={<Market />} />
    </Routes>
  </Router>
);

export default AppRoutes;

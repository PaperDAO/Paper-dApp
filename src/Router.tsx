import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import {
  Landing,
  Editor,
  Collection,
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
        path="/collection"
        element={<Collection />} />
    </Routes>
  </Router>
);

export default AppRoutes;

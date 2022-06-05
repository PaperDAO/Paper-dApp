import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Landing from './pages/Landing';
import  Editor from './pages/Editor';
import Collection from './pages/Collection';

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

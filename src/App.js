import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Home from './pages/Home';
import EditMeme from './pages/EditMeme';

function App() {
  return (
    <>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:id" element={<EditMeme />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

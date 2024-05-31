import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then(response => response.json())
      .then(data => setMemes(data.data.memes));
  }, []);

  return (
    <Container>
      <h1 className="text-center my-4">Meme Generator</h1>
      <Row>
        {memes.map(meme => (
          <Col key={meme.id} xs={12} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Img variant="top" src={meme.url} />
              <Card.Body>
                <Card.Title>{meme.name}</Card.Title>
                <Card.Text>
                  <Link to={`/edit/${meme.id}`}>Edit Meme</Link>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;

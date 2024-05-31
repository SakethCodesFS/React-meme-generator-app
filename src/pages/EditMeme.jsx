import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import { toPng } from 'html-to-image';
import { Container, Button, InputGroup, FormControl } from 'react-bootstrap';

function EditMeme() {
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then(response => response.json())
      .then(data => {
        const selectedMeme = data.data.memes.find(meme => meme.id === id);
        setMeme(selectedMeme);
      });
  }, [id]);

  const addText = () => {
    setTexts([...texts, { text: currentText, x: 0, y: 0, isEditing: true }]);
    setCurrentText('');
  };

  const handleDrag = (index, e, data) => {
    const newTexts = texts.slice();
    newTexts[index] = { ...newTexts[index], x: data.x, y: data.y };
    setTexts(newTexts);
  };

  const handleSave = () => {
    const node = document.getElementById('meme-container');
    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${meme.name}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Could not generate image', err);
      });
  };

  const toggleInputToParagraph = (index) => {
    const newTexts = texts.slice();
    newTexts[index].isEditing = !newTexts[index].isEditing;
    setTexts(newTexts);
  };

  return (
    <Container className="text-center mt-4">
      {meme && (
        <div id="meme-container" style={{ position: 'relative', display: 'inline-block' }}>
          <img src={meme.url} alt={meme.name} width="500" />
          {texts.map((textItem, index) => (
            <Draggable
              key={index}
              position={{ x: textItem.x, y: textItem.y }}
              onDrag={(e, data) => handleDrag(index, e, data)}
            >
              <div
                onDoubleClick={() => toggleInputToParagraph(index)}
                style={{
                  position: 'absolute',
                  top: textItem.y,
                  left: textItem.x,
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '5px',
                  cursor: 'move',
                }}
              >
                {textItem.isEditing ? (
                  <input
                    type="text"
                    value={textItem.text}
                    onChange={(e) => {
                      const newTexts = texts.slice();
                      newTexts[index].text = e.target.value;
                      setTexts(newTexts);
                    }}
                    onBlur={() => toggleInputToParagraph(index)}
                  />
                ) : (
                  <p>{textItem.text}</p>
                )}
              </div>
            </Draggable>
          ))}
        </div>
      )}
      <div className="mt-3">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Enter text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
          />
          <Button variant="primary" onClick={addText}>
            Add Text
          </Button>
        </InputGroup>
      </div>
      <Button variant="success" onClick={handleSave}>
        Save Meme
      </Button>
    </Container>
  );
}

export default EditMeme;

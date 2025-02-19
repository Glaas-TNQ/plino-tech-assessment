import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'sonner';

const AddLLMForm = ({ onAddLLM, onAddRandom }) => {
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [modelName, setModelName] = useState('');
  const [parameters, setParameters] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (company && category && releaseDate && modelName && parameters >= 0) {
      try {
        const response = await onAddLLM({
          company,
          category,
          release_date: releaseDate,
          model_name: modelName,
          num_million_parameters: parseInt(parameters),
        });

        if (response.error) {
          toast.error('Il modello scelto è già stato inserito!');
        } else {
          toast.success('LLM aggiunto con successo!');
          setCompany('');
          setCategory('');
          setReleaseDate('');
          setModelName('');
          setParameters('');
        }
      } catch (error) {
        toast.error('Si è verificato un errore durante l\'aggiunta del LLM.');
      }
    }
  };

  const handleRandomAdd = async () => {
    try {
      const response = await onAddRandom();
  
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Si è verificato un errore durante l'aggiunta del LLM Random.");
    }
  };
  
  return (
    <Container className="d-flex justify-content-center align-items-center vh-50">
      <Card className="p-4 shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
        <h3 className="text-secondary text-center mb-3">Aggiungi un LLM</h3>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Model Name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="number"
                placeholder="Parameters (millions)"
                min="0"
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                required
              />
            </Col>
            <Col md={12}>
              <Form.Control
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-center mt-4">
            <Button type="submit" variant="success" className="me-2 px-4">
              Aggiungi LLM
            </Button>
            <Button variant="primary" className="px-4" onClick={handleRandomAdd}>
              Aggiungi LLM Random
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddLLMForm;
// src/pages/CreateOfferPage/CreateOfferPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './../Form.css'; // On réutilise le style de base

function CreateOfferPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State pour l'offre d'emploi
  const [offer, setOffer] = useState({ title: '', description: '' });
  // State pour le QCM
  const [qcm, setQcm] = useState({
    title: '',
    duration_minutes: 15,
    questions: [{ question_text: '', answers: [{ answer_text: '', is_correct: true }, { answer_text: '', is_correct: false }] }]
  });

  // ----- Fonctions pour manipuler le formulaire -----

  const handleOfferChange = (e) => setOffer({ ...offer, [e.target.name]: e.target.value });
  const handleQcmChange = (e) => setQcm({ ...qcm, [e.target.name]: e.target.value });

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...qcm.questions];
    newQuestions[qIndex].question_text = value;
    setQcm({ ...qcm, questions: newQuestions });
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...qcm.questions];
    newQuestions[qIndex].answers[aIndex].answer_text = value;
    setQcm({ ...qcm, questions: newQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, aIndex) => {
    const newQuestions = [...qcm.questions];
    // On met toutes les autres réponses à 'false' pour cette question
    newQuestions[qIndex].answers.forEach((ans, idx) => ans.is_correct = (idx === aIndex));
    setQcm({ ...qcm, questions: newQuestions });
  };
  
  const addQuestion = () => {
    setQcm({
      ...qcm,
      questions: [...qcm.questions, { question_text: '', answers: [{ answer_text: '', is_correct: true }, { answer_text: '', is_correct: false }] }]
    });
  };

  const addAnswer = (qIndex) => {
    const newQuestions = [...qcm.questions];
    if (newQuestions[qIndex].answers.length < 4) { // Limite à 4 réponses
        newQuestions[qIndex].answers.push({ answer_text: '', is_correct: false });
        setQcm({ ...qcm, questions: newQuestions });
    }
  };

  // ----- Soumission du formulaire -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const payload = {
        ...offer,
        qcm: qcm,
    };

    try {
        const response = await fetch('http://localhost:8000/api/job-offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.message || 'Erreur lors de la création');
        
        alert('Offre créée avec succès !');
        navigate('/recruiter/dashboard');

    } catch(err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>Créer une Nouvelle Offre d'Emploi</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        
        <h2>Informations sur l'offre</h2>
        <div className="form-group">
          <label>Titre de l'offre</label>
          <input type="text" name="title" value={offer.title} onChange={handleOfferChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={offer.description} onChange={handleOfferChange} rows="5" required style={{ width: '100%' }}></textarea>
        </div>

        <hr style={{ margin: '40px 0' }} />

        <h2>Configuration du QCM</h2>
        <div className="form-group">
          <label>Titre du QCM</label>
          <input type="text" name="title" value={qcm.title} onChange={handleQcmChange} required />
        </div>
        <div className="form-group">
          <label>Durée (en minutes)</label>
          <input type="number" name="duration_minutes" value={qcm.duration_minutes} onChange={handleQcmChange} required min="1" />
        </div>

        <h3>Questions</h3>
        {qcm.questions.map((question, qIndex) => (
          <div key={qIndex} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '20px' }}>
            <div className="form-group">
              <label>Question {qIndex + 1}</label>
              <input type="text" value={question.question_text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} required />
            </div>
            
            <label>Réponses</label>
            {question.answers.map((answer, aIndex) => (
                <div key={aIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input type="radio" name={`correct_answer_${qIndex}`} checked={answer.is_correct} onChange={() => handleCorrectAnswerChange(qIndex, aIndex)} />
                    <input type="text" placeholder={`Réponse ${aIndex + 1}`} value={answer.answer_text} onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)} required style={{ marginLeft: '10px', flexGrow: 1 }} />
                </div>
            ))}
            <button type="button" onClick={() => addAnswer(qIndex)}>Ajouter une réponse</button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Ajouter une question</button>

        <hr style={{ margin: '40px 0' }} />
        
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Création en cours...' : 'Publier l\'offre et le QCM'}
        </button>
      </form>
    </div>
  );
}

export default CreateOfferPage;
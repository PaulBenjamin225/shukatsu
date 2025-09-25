// src/pages/TestPage/TestPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './TestPage.css';

function TestPage() {
  const { sessionId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [qcmData, setQcmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  const webcamRef = useRef(null);
  const proctoringIntervalRef = useRef(null);

  // --- DÉMARRAGE DU TEST ---
  useEffect(() => {
    const startTest = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/test-sessions/${sessionId}/start`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Impossible de démarrer le test.');
        }
        const data = await response.json();
        setQcmData(data);
        startWebcamAndProctoring();
      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if(token) {
      startTest();
    }

    // Nettoyage à la sortie du composant : on arrête la surveillance
    return () => {
      clearInterval(proctoringIntervalRef.current);
      // On arrête aussi la webcam si elle est active
      if (webcamRef.current && webcamRef.current.srcObject) {
        webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [sessionId, token]); // Dépendances du useEffect

  // --- LOGIQUE DE SELECTION DE RÉPONSE ---
  const handleAnswerSelect = (questionId, answerId) => {
    setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: answerId
    }));
  };

  // --- LOGIQUE DE PROCTORING ---
  const startWebcamAndProctoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      proctoringIntervalRef.current = setInterval(analyzeWebcamFrame, 7000);
    } catch (err) {
      console.error("Erreur Webcam", err);
      setError("Impossible d'activer la webcam. La surveillance est désactivée.");
    }
  };

  const analyzeWebcamFrame = async () => {
    if (!webcamRef.current || !webcamRef.current.srcObject || webcamRef.current.paused || webcamRef.current.ended) return;

    const canvas = document.createElement('canvas');
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(webcamRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');

        try {
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.status === 'anomaly_detected') {
                const eventType = data.anomalies[0];
                await fetch(`http://localhost:8000/api/test-sessions/${sessionId}/proctoring-event`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ event_type: eventType })
                });
            }
        } catch (e) {
            console.error("Erreur d'analyse proctoring:", e);
        }
    }, 'image/jpeg');
  };

  // --- LOGIQUE DE SOUMISSION ---
  const handleSubmit = async () => {
    clearInterval(proctoringIntervalRef.current);
    if (webcamRef.current && webcamRef.current.srcObject) {
        webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    const responsesPayload = Object.keys(userAnswers).map(questionId => ({
        question_id: parseInt(questionId),
        answer_id: userAnswers[questionId]
    }));
    
    console.log("Payload envoyé à l'API de soumission :", { responses: responsesPayload });

    try {
        const response = await fetch(`http://localhost:8000/api/test-sessions/${sessionId}/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ responses: responsesPayload })
        });

        const data = await response.json();
        
        if(!response.ok) {
            if(response.status === 422) {
                const errorMessages = Object.values(data.errors || {error: ["Format de réponse invalide"]}).flat().join(' ');
                throw new Error(`Erreur de validation: ${errorMessages}`);
            }
            throw new Error(data.message || "Une erreur inconnue est survenue lors de la soumission.");
        }

        navigate(`/candidate/results/${sessionId}`);
        // Ici, on redirigera vers la page de résultats
        // navigate(`/candidate/results/${sessionId}`);

    } catch(err) {
        setError(err.message);
    }
  };

  if (loading) return <div className="test-status">Préparation du test...</div>;
  if (error) return <div className="test-status error">ERREUR: {error}</div>;
  if (!qcmData || !qcmData.qcm) return <div className="test-status">Erreur: impossible de charger les données du QCM.</div>;

  return (
    <div className="test-page-container">
      <div className="qcm-main-panel">
        <h1>{qcmData.qcm.title}</h1>
        <p><strong>Durée:</strong> {qcmData.duration_minutes} minutes</p>
        
        {qcmData.qcm.questions.map((q, index) => (
          <div key={q.id} className="question-block">
            <h3>{index + 1}. {q.question_text}</h3>
            <div className="answers-container">
              {q.answers.map(a => (
                <label key={a.id} className="answer-label">
                  <input 
                    type="radio" 
                    name={`question_${q.id}`} 
                    value={a.id} 
                    onChange={() => handleAnswerSelect(q.id, a.id)} 
                  />
                  <span>{a.answer_text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleSubmit} className="submit-test-btn">Terminer et Soumettre le Test</button>
      </div>

      <div className="proctoring-panel">
        <h3>Surveillance</h3>
        <video ref={webcamRef} autoPlay muted playsInline></video>
        {/* On pourrait ajouter un log des événements ici plus tard */}
      </div>
    </div>
  );
}

export default TestPage;
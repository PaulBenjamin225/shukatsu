import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # 1. Importer la librairie CORS
import cv2
import numpy as np

# Initialiser l'application Flask
app = Flask(__name__)

# --- 2. ACTIVER CORS ---
# Cette ligne autorise les requêtes provenant d'autres origines (comme votre frontend React)
CORS(app)
# --- C'EST TOUT POUR LA CONFIGURATION ---


# Définir le chemin vers notre classifieur de visage
# (Le reste du code ne change pas du tout)
CASC_PATH = os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier(CASC_PATH)

# Définir les seuils pour les anomalies
MAX_FACES = 1
MIN_FACES = 1

@app.route('/analyze', methods=['POST'])
def analyze_frame():
    """
    Reçoit une image du navigateur, l'analyse et renvoie un verdict.
    """
    # Vérifier qu'une image a bien été envoyée
    if 'image' not in request.files:
        return jsonify({'error': 'Aucun fichier image fourni'}), 400

    file = request.files['image']
    
    try:
        # Lire et décoder l'image
        in_memory_file = file.read()
        nparr = np.frombuffer(in_memory_file, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Format d\'image invalide'}), 400

        # L'analyse principale : détection de visages
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        
        num_faces = len(faces)
        
        # Générer le verdict
        anomalies = []
        if num_faces > MAX_FACES:
            anomalies.append('multiple_faces_detected')
        elif num_faces < MIN_FACES:
            anomalies.append('no_face_detected')

        status = 'ok' if not anomalies else 'anomaly_detected'

        # Renvoyer une réponse JSON claire
        return jsonify({
            'status': status,
            'face_count': num_faces,
            'anomalies': anomalies
        })

    except Exception as e:
        return jsonify({'error': 'Erreur lors du traitement de l\'image', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
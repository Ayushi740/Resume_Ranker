import os
import io

from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from PyPDF2 import PdfReader
from docx import Document
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

# ✅ FIXED CORS (no blocking)
CORS(app, supports_credentials=True)

app.config["SECRET_KEY"] = "dev-secret"
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ================= MODELS =================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)


class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    text = db.Column(db.Text)


with app.app_context():
    db.create_all()


# ================= AUTH =================

@app.post("/api/signup")
def signup():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "User already exists"}), 400

    new_user = User(
        email=email,
        password_hash=generate_password_hash(password)
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account created successfully"})


@app.post("/api/login")
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    session["user_id"] = user.id
    return jsonify({"message": "Login successful"})


@app.get("/api/me")
def me():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    return jsonify({"user_id": user_id})


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})


# ================= FILE TEXT =================

def extract_text(filename, raw_bytes):
    text = ""

    try:
        if filename.lower().endswith(".pdf"):
            reader = PdfReader(io.BytesIO(raw_bytes))
            for page in reader.pages:
                text += page.extract_text() or ""

        elif filename.lower().endswith(".docx"):
            doc = Document(io.BytesIO(raw_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"

    except Exception as e:
        print("❌ Extraction Error:", e)

    return text.strip().lower()


# ================= ROUTES =================

@app.get("/")
def home():
    return jsonify({"message": "Resume Screening API running"})


@app.post("/api/resumes")
def upload_resume():
    if "file" not in request.files:
        return jsonify({"error": "file required"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "empty filename"}), 400

    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        return jsonify({"error": "Only PDF or DOCX allowed"}), 400

    raw = file.read()
    text = extract_text(file.filename, raw)

    if not text:
        return jsonify({"error": "could not extract text"}), 400

    resume = Resume(filename=file.filename, text=text)
    db.session.add(resume)
    db.session.commit()

    return jsonify({"message": "uploaded", "filename": file.filename})


@app.get("/api/resumes")
def get_resumes():
    resumes = Resume.query.all()

    return jsonify([
        {"id": r.id, "filename": r.filename}
        for r in resumes
    ])


@app.post("/api/rank")
def rank_resumes():
    data = request.get_json() or {}

    job_description = data.get("job_description", "").strip()

    if not job_description:
        return jsonify({"error": "job_description required"}), 400

    resumes = Resume.query.all()

    if not resumes:
        return jsonify({"error": "no resumes uploaded"}), 400

    documents = [job_description] + [r.text for r in resumes]

    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform(documents)

    scores = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

    results = []
    for i, (resume, score) in enumerate(zip(resumes, scores)):
        results.append({
            "id": resume.id,
            "filename": resume.filename,
            "score": float(score),
            "rank": i + 1
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return jsonify({"results": results})


# ================= RUN =================


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
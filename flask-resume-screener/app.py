import os
import io
from functools import wraps

from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SESSION_SECRET", "dev-secret-change-me")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    resumes = db.relationship("Resume", backref="user", lazy=True, cascade="all, delete-orphan")


class Resume(db.Model):
    __tablename__ = "resumes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    stored_path = db.Column(db.String(512), nullable=False)
    text = db.Column(db.Text, nullable=False, default="")
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())


with app.app_context():
    db.create_all()


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "authentication required"}), 401
        return f(*args, **kwargs)
    return wrapper


def extract_pdf_text(file_stream) -> str:
    reader = PdfReader(file_stream)
    parts = []
    for page in reader.pages:
        try:
            parts.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(parts).strip()


@app.get("/")
def index():
    return jsonify({
        "name": "Resume Screening API",
        "endpoints": [
            "POST /api/signup",
            "POST /api/login",
            "POST /api/logout",
            "GET  /api/me",
            "POST /api/resumes (multipart: file)",
            "GET  /api/resumes",
            "DELETE /api/resumes/<id>",
            "POST /api/rank (json: {job_description, resume_ids?})",
        ],
    })


@app.post("/api/signup")
def signup():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return jsonify({"error": "username and password required"}), 400
    if len(password) < 6:
        return jsonify({"error": "password must be at least 6 characters"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "username already taken"}), 409
    user = User(username=username, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    session["user_id"] = user.id
    return jsonify({"id": user.id, "username": user.username}), 201


@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "invalid credentials"}), 401
    session["user_id"] = user.id
    return jsonify({"id": user.id, "username": user.username})


@app.post("/api/logout")
def logout():
    session.pop("user_id", None)
    return jsonify({"ok": True})


@app.get("/api/me")
@login_required
def me():
    user = db.session.get(User, session["user_id"])
    return jsonify({"id": user.id, "username": user.username})


@app.post("/api/resumes")
@login_required
def upload_resume():
    if "file" not in request.files:
        return jsonify({"error": "file field is required"}), 400
    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "empty filename"}), 400
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "only PDF files are supported"}), 400

    filename = secure_filename(file.filename)
    raw = file.read()
    try:
        text = extract_pdf_text(io.BytesIO(raw))
    except Exception as e:
        return jsonify({"error": f"failed to parse PDF: {e}"}), 400

    user_dir = os.path.join(UPLOAD_DIR, str(session["user_id"]))
    os.makedirs(user_dir, exist_ok=True)
    stored_path = os.path.join(user_dir, filename)
    base, ext = os.path.splitext(stored_path)
    counter = 1
    while os.path.exists(stored_path):
        stored_path = f"{base}_{counter}{ext}"
        counter += 1
    with open(stored_path, "wb") as f:
        f.write(raw)

    resume = Resume(
        user_id=session["user_id"],
        filename=filename,
        stored_path=stored_path,
        text=text,
    )
    db.session.add(resume)
    db.session.commit()
    return jsonify({
        "id": resume.id,
        "filename": resume.filename,
        "characters": len(text),
        "preview": text[:200],
    }), 201


@app.get("/api/resumes")
@login_required
def list_resumes():
    resumes = Resume.query.filter_by(user_id=session["user_id"]).order_by(Resume.id.desc()).all()
    return jsonify([
        {
            "id": r.id,
            "filename": r.filename,
            "characters": len(r.text or ""),
            "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
        }
        for r in resumes
    ])


@app.delete("/api/resumes/<int:resume_id>")
@login_required
def delete_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=session["user_id"]).first()
    if not resume:
        return jsonify({"error": "not found"}), 404
    try:
        if os.path.exists(resume.stored_path):
            os.remove(resume.stored_path)
    except OSError:
        pass
    db.session.delete(resume)
    db.session.commit()
    return jsonify({"ok": True})


@app.post("/api/rank")
@login_required
def rank_resumes():
    data = request.get_json(silent=True) or {}
    job_description = (data.get("job_description") or "").strip()
    if not job_description:
        return jsonify({"error": "job_description is required"}), 400

    requested_ids = data.get("resume_ids")
    query = Resume.query.filter_by(user_id=session["user_id"])
    if requested_ids:
        query = query.filter(Resume.id.in_(requested_ids))
    resumes = query.all()

    resumes = [r for r in resumes if (r.text or "").strip()]
    if not resumes:
        return jsonify({"error": "no resumes with extractable text found"}), 400

    docs = [job_description] + [r.text for r in resumes]
    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform(docs)
    sims = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

    ranked = sorted(
        (
            {
                "resume_id": r.id,
                "filename": r.filename,
                "score": float(round(score, 4)),
                "match_percent": float(round(score * 100, 2)),
            }
            for r, score in zip(resumes, sims)
        ),
        key=lambda x: x["score"],
        reverse=True,
    )
    for i, item in enumerate(ranked, start=1):
        item["rank"] = i
    return jsonify({"count": len(ranked), "results": ranked})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

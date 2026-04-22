# Resume Screening API (Flask)

A Flask backend that ranks PDF resumes against a job description using TF-IDF + cosine similarity.

## Run

```bash
python flask-resume-screener/app.py
```

The server listens on `PORT` (default `5000`). SQLite database file: `flask-resume-screener/app.db`. Uploaded PDFs are stored under `flask-resume-screener/uploads/<user_id>/`.

## Endpoints

All authenticated endpoints use a session cookie set on signup/login.

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| POST | `/api/signup` | `{username, password}` | Create account & log in |
| POST | `/api/login` | `{username, password}` | Log in |
| POST | `/api/logout` | — | Log out |
| GET | `/api/me` | — | Current user |
| POST | `/api/resumes` | multipart `file=<pdf>` | Upload a PDF resume; text is extracted with PyPDF2 |
| GET | `/api/resumes` | — | List your resumes |
| DELETE | `/api/resumes/<id>` | — | Delete a resume |
| POST | `/api/rank` | `{job_description, resume_ids?}` | Rank resumes against the job description |

### Example

```bash
# 1. Sign up (saves a session cookie)
curl -c jar.txt -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"secret123"}' \
  http://localhost:5000/api/signup

# 2. Upload a PDF resume
curl -b jar.txt -F 'file=@resume.pdf' http://localhost:5000/api/resumes

# 3. Rank against a job description
curl -b jar.txt -H 'Content-Type: application/json' \
  -d '{"job_description":"Senior Python engineer with Flask, SQL, and ML experience"}' \
  http://localhost:5000/api/rank
```

## Stack

- Flask + Flask-SQLAlchemy (SQLite)
- Werkzeug password hashing & secure file handling
- PyPDF2 for PDF text extraction
- scikit-learn `TfidfVectorizer` + `cosine_similarity` for ranking

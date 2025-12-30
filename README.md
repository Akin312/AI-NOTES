🧠 AI Notes — Smart Note Editing & PDF / TXT Export App

Edits, simplifies, summarizes, saves — and lets you download your notes using AI.

✔ For students
✔ Clean up lecture notes
✔ Daily — project — summary writing

Built with Flask + SQLite + OpenRouter (LLM).

🚀 Table of Contents

⭐ Features

⚙ Setup

🔑 Setting the API Key

▶️ Running the App

✨ Usage

📄 PDF / TXT Download

🗂 Database Structure

🛠 Troubleshooting

🔮 Development Ideas

⭐ Features

✔ User registration & login
✔ Add notes
✔ AI edit / simplify / summarize
✔ Choose summary type (short / normal / detailed)
✔ View past notes
✔ Search
✔ Delete individually
✔ Bulk delete
✔ Download TXT
✔ Download PDF (Turkish character support)

⚙ Setup
1️⃣ Clone or download the project
git clone <repo-link>
cd AI-Notes

2️⃣ Install required packages
pip install -r requirements.txt


If missing:

pip install flask requests reportlab

🔑 API Key — OpenRouter
1️⃣ Create an API key on OpenRouter

👉 https://openrouter.ai

Dashboard → API Keys → Create Key

2️⃣ Add it to your system

🔹 Windows (PowerShell)

$env:OPENROUTER_API_KEY="PUT_YOUR_KEY_HERE"


🔹 Linux / Mac

export OPENROUTER_API_KEY="PUT_YOUR_KEY_HERE"


You can add it to environment variables to make it permanent.

▶️ Run the App
python app.py


Open in your browser:

http://127.0.0.1:5000

✨ Usage

1️⃣ Log in or create an account
2️⃣ Write your note
3️⃣ Choose summary type:

short

normal

detailed

4️⃣ Click “Edit / Summarize” — AI rewrites it
5️⃣ It is saved & added to your history list

📄 PDF / TXT Download

On each summary page:

⬇ Download TXT
📄 Download PDF

For Turkish characters, the project uses this font:

static/fonts/dejavu-sans/DejaVuSans.ttf


PDF includes:

✔ titles
✔ date
✔ text
✔ intact Turkish characters

🗂 Database Structure

File:

notes.db

Tables

users

field	description
id	user id
username	username
password	password

summaries

field	description
id	summary id
user_id	user
note	original text
summary	edited text
created_at	date
🛠 Troubleshooting (IMPORTANT)

❌ “Server error: API key not found”

→ API key not loaded in terminal

Check:

echo $env:OPENROUTER_API_KEY


If empty, add it again.

❌ Squares / boxes in PDF

Font must be here:

static/fonts/dejavu-sans/DejaVuSans.ttf


and registered inside app.py.

❌ 404 / Not Found

Route and button may not match.

Check:

/download
/download_pdf


❌ Connection lost / API not responding

Possible reasons:

internet

VPN

rate limit

temporary API issue

Wait a bit → try again.

🔮 Development Ideas

🔹 Theme & dark mode
🔹 Export CSV / JSON
🔹 Tag system (lesson / diary / project)
🔹 Filter by category
🔹 AI “explain like a teacher” mode
🔹 Mobile-friendly UI

👤 Not

Bu proje öğrenme amaçlıdır.
Geliştirmek, değiştirmek, yayınlamak serbest değildir 👍

from flask import Flask, render_template, request, session, redirect, url_for
from logic import akilli_duzenle
from database import init_db, save_summary, get_summaries
from database import get_summary_by_id
from database import delete_summary
from database import search_summaries
from database import create_user, get_user
from database import delete_all_summaries
from flask import make_response
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from flask import send_file
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import io
from reportlab.lib.pagesizes import A4




app = Flask(__name__)

app.secret_key = "super-secret-key"

init_db()

@app.route("/", methods=["GET", "POST"])
def index():
    sonuc = None
    query = request.args.get("q", "")

    if request.method == "POST":
        # 🔒 Not kaydetmek için giriş gerekli
        if "user_id" not in session:
            return redirect("/login")
        
        note = request.form["note"]
        mode = request.form.get("mode","normal")
        sonuc = akilli_duzenle(note,mode)

        # ✅ ARTIK USER_ID İLE KAYDEDİYORUZ
        if sonuc:
            save_summary(
            session["user_id"],
            note,
            str(sonuc)
    )


    # 🔍 Giriş yapmışsa özetlerini göster, yapmamışsa boş liste
    summaries = []
    if "user_id" in session:
        user_id = session["user_id"]
        if query:
            summaries = search_summaries(user_id, query)
        else:
            summaries = get_summaries(user_id)

    return render_template(
        "index.html",
        sonuc=sonuc,
        summaries=summaries,
        query=query
    )


@app.route("/summary/<int:summary_id>")
def summary_detail(summary_id):
    # 🔒 Giriş kontrolü
    if "user_id" not in session:
        return redirect("/login")
    
    summary = get_summary_by_id(summary_id)

    if not summary:
        return "Özet bulunamadı", 404

    return render_template("summary_detail.html", summary=summary)


@app.route("/summary/<int:summary_id>/delete", methods=["POST"])
def delete_summary_route(summary_id):
    # 🔒 Giriş kontrolü
    if "user_id" not in session:
        return redirect("/login")
    
    delete_summary(summary_id, session["user_id"])  # ✅ user_id eklendi
    return redirect("/")

@app.route("/summary/delete_all", methods=["POST"])
def delete_all():
    if "user_id" not in session:
        return redirect("/login")

    user_id = session["user_id"]

    delete_all_summaries(user_id)

    return redirect("/")



@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        create_user(username, password)
        return redirect("/login")
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        user = get_user(username, password)  # ✅ Her iki parametre de gönderiliyor
        
        if user:
            session["user_id"] = user[0]
            session["username"] = user[1]
            return redirect("/")
        else:
            return render_template("login.html", error="Kullanıcı adı veya şifre hatalı!")
    
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")  # ✅ Ana sayfaya yönlendir

@app.route("/search", methods=["GET"])
def search():
    if "user_id" not in session:
        return redirect("/login")

    user_id = session["user_id"]
    query = request.args.get("q", "")

    results = search_summaries(user_id, query)

    return render_template("search.html", query=query, results=results)


@app.route("/summary/<int:summary_id>/download")
def download_summary(summary_id):
    if "user_id" not in session:
        return redirect("/login")

    summary = get_summary_by_id(summary_id)

    if not summary:
        return "Özet bulunamadı", 404

    content = f"""
TARİH: {summary['created_at']}
ORİJİNAL NOT:
{summary['note']}

------------------------

DÜZENLENMİŞ / ÖZET:
{summary['summary']}
"""

    response = make_response(content)
    response.headers["Content-Type"] = "text/plain"
    response.headers["Content-Disposition"] = f"attachment; filename=summary_{summary_id}.txt"

    return response

@app.route("/summary/<int:summary_id>/download_pdf")
def download_pdf(summary_id):
    summary = get_summary_by_id(summary_id)

    if not summary:
        return "Bulunamadı", 404

    buffer = io.BytesIO()

    pdfmetrics.registerFont(
        TTFont("DejaVu", "static/fonts/dejavu-sans/DejaVuSans.ttf")
    )

    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()

    style = styles["Normal"]
    style.fontName = "DejaVu"
    style.fontSize = 11

    content = []

    content.append(Paragraph(f"Tarih: {summary['created_at']}", style))
    content.append(Spacer(1, 10))

    content.append(Paragraph("<b>Orijinal Not:</b>", style))
    content.append(Spacer(1, 6))
    content.append(Paragraph(summary["note"], style))
    content.append(Spacer(1, 12))

    content.append(Paragraph("<b>Düzenlenmiş / Özet:</b>", style))
    content.append(Spacer(1, 6))
    content.append(Paragraph(summary["summary"], style))

    doc.build(content)

    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"summary_{summary_id}.pdf",
        mimetype="application/pdf"
    )





if __name__ == "__main__":
    app.run(debug=True)
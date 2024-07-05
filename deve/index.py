from flask import Flask,render_template,redirect,request,url_for


app = Flask(__name__)

# ログインページへ移動
@app.route("/to_login")
def to_login():
    return render_template("login.html")

# トップ
@app.route("/")
def index():
    return render_template("index.html")

# チャットページ
@app.route("/chat")
def chat():
    return render_template("chat.html")
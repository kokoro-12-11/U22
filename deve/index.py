from flask import Flask,render_template,redirect,request,url_for,jsonify,session,flash
from werkzeug.security import check_password_hash, generate_password_hash

# mysql_connector
import mysql.connector
from mysql.connector import Error

# 翻訳
import google.generativeai as genai
import requests,time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdfgtgbhuiklmngffgh'

# Gemini AIのAPIキー
Google_AI_Key = "AIzaSyB_QPU9Xa5QzDI3LgpAStA7ukDsl_9lBdg"
# Deeple (翻訳)のAPIキー
Deeple_Key = "b82c6d36-4623-4cdd-99cf-c1f075144a57:fx"


# # DBとのコネクションの作成
# db_config ={
#     'host':'localhost',
#     'user':'root',
#     'password':'p@ssw0rd',
#     'database':'sk',
# }
# def get_db_connection():
#     try:
#         conn = mysql.connector.connect(**db_config)
#         return conn
#     except Error as e:
#         print(f"Error: {e}")
#         return None


# welcome
@app.route("/wel")
def wel():
    return render_template("welcome.html")
# ログインページへ移動
@app.route("/to_login")
def to_login():
    return render_template("login.html")
# メンバー登録
@app.route("/member")
def member():
    return render_template("membership.html")
# わすれた
@app.route("/login_f")
def login_f():
    return render_template("login_forgot.html")
# チャットページ
@app.route("/chat2")
def chat2():
    return render_template("chat2.html")
# チャットページ
@app.route("/chat3")
def chat3():
    return render_template("chat3.html")
# チャットページ
@app.route("/chat4")
def chat4():
    return render_template("chat4.html")
# チャットページ
@app.route("/chat5")
def chat5():
    return render_template("chat5.html")


# # ログイン機能
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         username = request.form.get('name')
#         password = request.form.get('password')

#         connection = mysql.connector.connect(**db_config)
#         cursor = connection.cursor(dictionary=True, buffered=True)
#         cursor.execute("SELECT * FROM user WHERE username = %s", (username,))
#         user = cursor.fetchone()
#         cursor.close()
#         connection.close()

#         if user and check_password_hash(user['password'], password):
#             session['username'] = username  # ユーザー名をセッションに保存
#             return redirect("/")
#         else:
#             flash('ログイン失敗。', 'danger')
#             return redirect("/login")
#     return render_template('login.html')
        



# # 登録機能
# @app.route('/membership', methods=['GET', 'POST'])
# def membership():
#     if request.method == 'POST':
#         username = request.form.get('username')
#         password = request.form.get('password')
#         hashed_password = generate_password_hash(password)  # パスワードをハッシュ化

#         connection = mysql.connector.connect(**db_config)
#         cursor = connection.cursor()
#         cursor.execute("INSERT INTO user (username, password) VALUES (%s, %s)", (username, hashed_password))
#         connection.commit()
#         cursor.close()
#         connection.close()

#         flash('会員登録が完了しました。', 'success')
#         return redirect('/to_login')

#     return render_template('membership.html')

# トップ
@app.route("/")
def index():
    return render_template("index.html")


# チャットページ
@app.route("/chat")
def chat():
    return render_template("chat.html")


# 入力音声のテキストを翻訳
def translate_text(text, lan_to):
    result = requests.get(
        "https://api-free.deepl.com/v2/translate",
        params={
            "auth_key": Deeple_Key,
            "target_lang": lan_to,
            "text": text,
        },
    )
    return result.json()["translations"][0]["text"]




# AI関係
def generate_ai_response(text):
    
    genai.configure(api_key=Google_AI_Key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(text)
    return response.text

# 音声データ取得と返答
@app.route('/api/recognition/', methods=['POST'])
def recognition():
    data = request.json
    transcript = data.get('transcript')
    lang = data.get('page')
    # lang=1
    print(transcript)
    print(lang)
    # 言語選択をhtmlにつくる　今は固定で日本語
    # chat.javaの中をいじる必要あり
    # Lan = data.get('lang')
    Lan="ja-JP"
    
    if Lan == "ja-JP":
        lan_to = "JA"
        AI = "JA"
    elif Lan == "en-US":
        lan_to = "EN"
        AI = "EN"
    
    # 入力音声翻訳
    translated_text = translate_text(transcript, lan_to)
    
    prompt = "Provide only the code."
    if lang == "1":
        # AI応答生成
        ai_response = generate_ai_response("use html"+translated_text+prompt)
    elif lang == "2":
        ai_response = generate_ai_response("use css"+translated_text+prompt)
    elif lang == "3":
        ai_response = generate_ai_response("use javascript"+translated_text+prompt)
    elif lang == "4":
        ai_response = generate_ai_response("use python"+translated_text+prompt)
    else :
        print("存在しないカテゴリーです")

    # print(ai_response)
    # AI応答の再翻訳
    
    translated_ai_response = translate_text(ai_response, AI)
    # print(translated_ai_response)
    
    response = {
        'original_text': transcript,
        'translated_text': translated_text,
        'ai_response': ai_response,
        'final_response': translated_ai_response
    }
    
    return jsonify(response)



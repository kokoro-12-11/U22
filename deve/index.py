from flask import Flask,render_template,redirect,request,url_for,jsonify

# mysql_connector
import mysql.connector
from mysql.connector import Error

# 翻訳
import google.generativeai as genai
import requests,time

app = Flask(__name__)

# Gemini AIのAPIキー
Google_AI_Key = "AIzaSyB_QPU9Xa5QzDI3LgpAStA7ukDsl_9lBdg"
# Deeple (翻訳)のAPIキー
Deeple_Key = "b82c6d36-4623-4cdd-99cf-c1f075144a57:fx"


# DBとのコネクションの作成
# db_config ={
#     'host':'localhost',
#     'user':'root',
#     'password':'######',
#     'database':'######',
# }
# def get_db_connection():
#     try:
#         conn = mysql.connector.connect(**db_config)
#         return conn
#     except Error as e:
#         print(f"Error: {e}")
#         return None



# ログインページへ移動
@app.route("/to_login")
def to_login():
    return render_template("login.html")


# ログイン機能
@app.route("/login",methods=["post"])
def login():
    if request.method=="post":
        username = request.form['username']
        password = request.form['password']
        
#       connection=mysql.connector.connect(**db_config)
#       cursor=connection.cursor(dictionary=True)
#       query="""
#           INSERT INTO T_User ()
#           """
#       cursor.execute(query)
#       result=cursor.fetchall()
#       connection.commit()
#       connection.close()
    return render_template("index.html")

# 登録機能
@app.route("/membership",methods=["post"])
def membership():
    if request.method=="post":
        username = request.form['username']
        password = request.form['password']
#       connection=mysql.connector.connect(**db_config)
#       cursor=connection.cursor(dictionary=True)
#       query="""###"""
#       cursor.execute(query)
#       result=cursor.fetchall()
#       connection.commit()
#       connection.close()
    return login()

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
    print(lang)
    # 言語選択をhtmlにつくる　今は固定で日本語
    # chat.javaの中をいじる必要あり
    # Lan = data.get('lang')
    Lan="ja-JP"
    
    if Lan == "ja-JP":
        lan_to = "EN"
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

    print(ai_response)
    # AI応答の再翻訳
    
    translated_ai_response = translate_text(ai_response, AI)
    print(translated_ai_response)
    
    response = {
        'original_text': transcript,
        'translated_text': translated_text,
        'ai_response': ai_response,
        'final_response': translated_ai_response
    }
    
    return jsonify(response)



# 音声認識モジュール
import speech_recognition as sr 
# Gemini AIモジュール
import google.generativeai as genai

import requests,time

# Gemini AIのAPIキー
Google_AI_Key = "AIzaSyB_QPU9Xa5QzDI3LgpAStA7ukDsl_9lBdg"
# Deeple (翻訳)のAPIキー
Deeple_Key = "b82c6d36-4623-4cdd-99cf-c1f075144a57:fx"

r = sr.Recognizer()

with sr.Microphone() as source:
  
  # 翻訳前の言語選択
  while True:
    print("")
    print("翻訳前の言語を選択してください。\n 日本語:JP 英語:EN")
    print("")
    # Lan:翻訳前の言語
    Lan = input()
    print("")
    if Lan == "JP":
      # Deeplが認識するパラメータに変換
      lan = "ja-JP"
      # 翻訳先の言語
      lan_to = "EN"
      # AIの出力を元の言語に翻訳するためのパラメータ
      AI="JA"
      break
    elif Lan == "EN":
      # Deeplが認識するパラメータに変換
      lan = "en-EN"
      # 翻訳先の言語
      lan_to = "JA"
      # AIの出力を元の言語に翻訳するためのパラメータ
      AI="EN"
      break
    else:
      True
  
  # 音声の取得
  r.adjust_for_ambient_noise(source)
  print("")
  print("認識中です....")
  print("")
  audio = r.listen(source,timeout=5,phrase_time_limit=5)
  print("")
  print("認識しました！")
  print("")
  try:
    # 入力内容を文字列でtextに格納
    text = r.recognize_google(audio, language=lan)
    print("")
    # 翻訳前の言語で出力（確認用）
    print("-------------------翻訳前-------------------")
    print(text)
    print("")
    
    # DeepleAPIで翻訳
    result = requests.get(
      "https://api-free.deepl.com/v2/translate",
      params={ 
        "auth_key": Deeple_Key,
        "target_lang": lan_to,
        "text": text,
      },
    ) 
    
    translated_text = result.json()["translations"][0]["text"]
    
    print("")
    print("翻")
    time.sleep(0.5)
    print("訳")
    time.sleep(0.5)
    print("中")
    time.sleep(0.5)
    
    print("")
    # 翻訳先の言語で出力
    print("-------------------翻訳後-------------------")
    print(translated_text)
    print("")
    
    # AIに引き渡し
    genai.configure(api_key=Google_AI_Key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # AIから受け取り
    response = model.generate_content(translated_text)
    
    print("")
    print("生")
    time.sleep(0.5)
    print("成")
    time.sleep(0.5)
    print("中")
    time.sleep(0.5)
    
    # AIからの返答を平文で出力 (確認用)
    print("")
    print(response.text)
    print("")
    
    # AIからの出力を翻訳前言語に戻す
    result2 = requests.get(
      "https://api-free.deepl.com/v2/translate",
      params={ 
        "auth_key": Deeple_Key,
        "target_lang": AI,
        "text": response.text,
      },
    ) 
    translated_text2 = result2.json()["translations"][0]["text"]
    
    # AIからの翻訳済返答を出力
    print("")
    print(translated_text2)
    print("")
    
    # 例外処理
  except sr.UnknownValueError: # 音声入力の失敗
    print("すみません 聞き取れませんでした")
  except sr.RequestError as e: # Deeplとのリクエストエラー
    print("Could not request results from Google Speech Recognition service; {0}".format(e))
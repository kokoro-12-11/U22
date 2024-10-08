document.addEventListener('DOMContentLoaded', () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ja-JP';
        recognition.interimResults = true;
        recognition.continuous = false;

        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const resetBtn = document.getElementById('reset-btn');
        const resultDiv = document.getElementById('result-div');
        const textInput = document.getElementById('text-input');
        const sendBtn = document.getElementById('send-btn');
        //ページデータの挿入
        const pageValue = document.getElementById('page-data').value;

    let finalTranscript = '';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                textInput.value = finalTranscript; // テキストエリアに音声入力結果を表示
            } else {
                interimTranscript = transcript;
            }
        }
        resultDiv.innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</i>';
    };

    startBtn.onclick = () => recognition.start();
    stopBtn.onclick = () => recognition.stop();

    sendBtn.onclick = () => {
        const textValue = textInput.value;
        if (textValue) {
            resultDiv.innerHTML = textValue; // テキストエリアの内容を結果として表示
            textInput.value = ''; // テキストエリアをクリアして次回の入力に備える

            fetch('/api/recognition/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transcript: textValue,
                    page: pageValue
                })
            })
            .then(response => response.json())
            .then(data => {
                const outputText = document.querySelector('.outputText');

                // HTMLのコード文字を実体参照に変換
                const escapeHtml = (text) => {
                  return text.replace(/[&<>"']/g, (match) => {
                      const escapeMap = {
                          '&': '&amp;',
                          '<': '&lt;',
                          '>': '&gt;',
                          '"': '&quot;',
                          "'": '&#039;'
                      };
                      return escapeMap[match];
                  });
                };
    
                // AIからの返答を改行ごとに分割し、配列として取得
                const responseLines = escapeHtml(data.ai_response).split('\n');
            
                // 1行目と最終行を削除
                const editResponseLine = responseLines.slice(1, -1);
            
                // 削除後の行を再結合してHTMLに表示
                outputText.innerHTML = editResponseLine.map((line, index) => {
                    let lineNum = (index + 1).toString().padStart(2, '0');
                    return `${lineNum}| ${line}<br>`;
                }).join('');
            
                // ダウンロードボタンのクリックイベントを設定
                const downloadBtn = document.getElementById('download-btn');
                downloadBtn.onclick = () => {
                    const aiResponseText = data.ai_response; // AIからの返答を取得
                    if (aiResponseText) {
                        const pageData = document.getElementById('page-data').value; 
                        // data-pageの値でファイル拡張子変更
                        let fileExtension = 'txt'; // デフォルトは.txt
                        switch (pageData) {
                            case '1':
                                fileExtension = 'html';
                                break;
                            case '2':
                                fileExtension = 'css';
                                break;
                            case '3':
                                fileExtension = 'js';
                                break;
                            case '4':
                                fileExtension = 'py';
                                break;
                            default:
                                fileExtension = 'txt';
                                break;
                        }
                    
                        // AIからの返答を改行ごとに分割し、配列として取得
                        const responseLines = aiResponseText.split('\n');
                        // 1行目と最終行を削除
                        const editResponseLine = responseLines.slice(1, -1);
                        // 削除後の行を再結合してテキストとして準備
                        const editedResponseText = editResponseLine.join('\n');
                        const blob = new Blob([editedResponseText], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Parakeet.${fileExtension}`; //拡張子配置
                        a.click();
                        URL.revokeObjectURL(url); 
                    }
                };
            })
            .catch(error => console.error('Error:', error));
        }
    };

    resetBtn.onclick = () => {
        textInput.value = ''; // テキストエリアをクリア
        resultDiv.innerHTML = ''; // 結果表示エリアをクリア
        finalTranscript = ''; // 最終認識結果をリセット
    };
} else {
    console.error("SpeechRecognition is not supported in this browser.");
}})

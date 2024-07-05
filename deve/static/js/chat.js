// ブラウザがSpeechRecognition APIをサポートしているか確認
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // SpeechRecognitionオブジェクトを作成
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // 言語設定とその他の設定
    recognition.lang = 'ja-JP';
    recognition.interimResults = true; // 暫定結果を表示
    recognition.continuous = false; // 連続認識しない

    // ボタンと結果表示用の要素を取得
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resultDiv = document.getElementById('result-div');

    let finalTranscript = ''; // 最終認識結果を格納する変数

    // 認識結果のイベントハンドラ
    recognition.onresult = (event) => {
        let interimTranscript = ''; // 暫定結果を格納する変数
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                // 最終結果の場合
                finalTranscript += transcript;
                // 最終結果をサーバーに送信
                sendToServer(finalTranscript);
            } else {
                // 暫定結果の場合
                interimTranscript = transcript;
            }
        }
        // 結果を画面に表示
        resultDiv.innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</i>';
    };

    // 「開始」ボタンのクリックイベントハンドラ
    startBtn.onclick = () => {
        recognition.start();
    };

    // 「停止」ボタンのクリックイベントハンドラ
    stopBtn.onclick = () => {
        recognition.stop();
    };

    // サーバーにデータを送信する関数
    function sendToServer(data) {
        fetch('/api/recognition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: data }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
} else {
    // SpeechRecognition APIがサポートされていない場合のエラーメッセージ
    console.error("SpeechRecognition is not supported in this browser.");
}


if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = false;

    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resultDiv = document.getElementById('result-div');
    const textInput = document.getElementById('text-input'); // textareaを取得
    const sendBtn = document.getElementById('send-btn');

    // ページ固有の値を取得
    const pageValue = document.body.getAttribute('data-page') || '1'; // デフォルト値は '1'

    let finalTranscript = '';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                textInput.value = finalTranscript; // テキストエリアに結果を表示
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
            sendToServer(textValue);
            finalTranscript += textValue;
            resultDiv.innerHTML = finalTranscript;
            textInput.value = ''; // テキストエリアをクリア
        }

        fetch('/api/recognition/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transcript: textValue,
                page: pageValue //!ここで言語の選別してる
            })
        })
        .then(response => response.json())
        .then(data => {
            const outputText = document.querySelector('.outputText');
            outputText.innerHTML = data.ai_response.split('\n').map((line, index) => {
                let lineNum = (index + 1).toString().padStart(2, '0');
                return `${lineNum}| ${line}<br>`;
            }).join('');
        })
        .catch(error => console.error('Error:', error));
    };

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
    console.error("SpeechRecognition is not supported in this browser.");
}

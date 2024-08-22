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

    const pageValue = document.body.getAttribute('data-page') || '1';

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
                outputText.innerHTML = data.ai_response.split('\n').map((line, index) => {
                    let lineNum = (index + 1).toString().padStart(2, '0');
                    return `${lineNum}| ${line}<br>`;
                }).join('');
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
}

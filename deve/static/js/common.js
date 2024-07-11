//フォームのsubmitイベントに対するリスナーを追加
document.getElementById('login_form').addEventListener('submit', function(event) {
    //ユーザー名とパスワードの入力値を取得
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    //バリデーション：空白チェック
    //trim()は入力の前後の空白を削除
    if(username.trim() === '' || password.trim() === '') {
        alert('ユーザーネームとパスワードが入力されていません。');
        //バリデーションに失敗した場合、フォームの送信を防ぐ
        event.preventDefault();
        return;
    }

    //バリデーション：ユーザーネームの長さ
    if (username.length < 6) {
        alert('ユーザーネームは6文字以上で入力してください。');
        event.prenventDefault();
        return;
    }

    //バリデーション：パスワードの長さ
    if (password.length < 6) {
        alert('パスワードは6文字以上で入力してください。');
        event.prenventDefault();
        return;
    }
});
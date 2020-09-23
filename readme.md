# cdda-js-itembrowser
## 概要
Cataclysm: Dark Days Ahead(CDDA)のゲーム内アイテムをWebブラウザで検索、表示できるアドオンです。<br>
Javascriptで動作するため、専用のサーバーなどは不要、ローカル環境のみで動作します。<br>
また、アイテムの入手場所を調べる際に便利なアイテムグループの検索機能もあります。<br>

## 免責事項
開発中なのでバグ等が多数あります。<br>
内容を鵜のみにせず、必ずゲーム上で正しい情報を確認してください。

## 動作環境
対応OSは現在のところWindows 10のみです。Linux/OS Xは未対応。<br>
ブラウザはGoogle Chromeで動作確認しています。

## CDDAバージョン
0.E-b11026で確認。

## 使い方
1. 以下URLよりファイルをダウンロードします。<br>
https://github.com/lispcoc/cdda-js-itembrowser/archive/master.zip
2. zipファイルを解凍し、中にあるbrowserフォルダをCDDAの実行ファイルがあるディレクトリにコピーします。
3. browserフォルダに入り、exec.batをダブルクリックで実行するとウィンドウが開き、jsonファイルの読み込みが始まります。
4. 読み込みが終わったら、適当なキーを押してウィンドウを閉じます。
5. アイテムを検索したい場合はbrowser.htmlを、アイテムグループを検索したい場合はitem_itemgroup_analyser.htmlをWebブラウザで開いてください。

## 技術的制約
- あくまでJsonから読み取れる情報をもとに生成しているため、ハードコードされた部分については未サポートになります。

## バグ報告・開発協力
Githubリポジトリにて、Issueやプルリクエストは随時受け付けています。

## ライセンス
MITライセンスとします。

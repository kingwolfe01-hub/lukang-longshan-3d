# 鹿港龍山寺・全 3D 立體紙地圖與雙語國際教育示範（國小童趣 + 本地 MP3 語音版）

## 目錄結構
- `index.html`: 主程式入口（保留您原本資料夾中的 `index.html` 即可）
- `config.js`: 12 大景點座標、國小童趣雙語導覽腳本、基礎單字與 6 首暖心籤詩庫
- `materials.js`: PBR 材質與宣紙紋理工廠
- `components.js`: 3D 傳統建築構件工廠
- `architecture.js`: 寺廟八大殿宇組裝器
- `engine.js`: 3D 渲染引擎、南管合成音效，以及**本地 MP3 語音優先播放器**（自動讀取 `audio/` 資料夾內音檔）
- `audio/`: 請將您用微軟 Azure TTS 產製好的 `landmark_01_en.mp3` ～ `landmark_12_zh.mp3` 與 `fortune_01_en.mp3` ～ `fortune_06_zh.mp3` 放入此資料夾中！

## 啟動與部署方式
1. 將壓縮包內的檔案解壓縮，覆蓋至您原本的專案資料夾（與 `index.html` 放在同一層）。
2. 把微軟 API 產製的 36 個 `.mp3` 音檔放進 `audio/` 資料夾內。
3. 使用 VS Code 的 **Live Server** 開啟，或直接上傳至 **GitHub Pages**（連同 `audio/` 資料夾一起上傳）即可線上播放真人級雙語語音！

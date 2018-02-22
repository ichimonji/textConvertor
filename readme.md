# 汎用テキストコンバータ

「Original Text」欄に変換したいテキストを入れ各種の変換ボタンを押してください。「Converted Text」欄に変換後のテキストが出力されます。  
変換後のテキストをさらに変換したい場合は「MOVE」ボタンを押して変換後テキストを「Original Text」欄に移動させてください。  
「AUTO MOVE」にチェックを入れると自動で変換後のテキストが「Original Text」欄に移動します。

「Original Text」欄でテキストを選択したまま各種変換ボタンを押すと、その選択範囲にのみ変換が適用されます。  
「DELETE」でテキストがすべて削除されます。  
「UNDO」を押す度に変換前の状態に一つずつ戻ります。  
「REPLACE」を押すとテキストエリアの左右を入れ替えることができます。

項目が多すぎて扱いづらい場合は「ケース」、「Url/Base64」といったグループ名の部分を押すとそのグループが折りたたまれます。  
折りたたまれたグループはもう一回押すと元に戻ります。

## 各項目の説明

### ケース

半角英単語のケース操作を行う。またケース変換の他にクォーテーションの変更や符号付ラテン文字の符号解除なども行う。

+ `TITLE`  
	「タイトルケース」 頭文字のみ大文字に
+ `UPPER`  
	「アッパーケース」 全て大文字に
+ `LOWER`  
	「ロウアーケース」 全て小文字に
+ `SWAP`  
	「ケーススワップ」 大文字小文字を逆転
+ `\'\'→\"\"`  
	シングルクォーテーションをダブルクーテーションに
+ `\"\"→\'\'`  
	ダブルクーテーションをシングルクォーテーションに
+ `abc-def→abc_def`  
	文字間のハイフンをアンダーバーに
+ `abc_def→abc-def`  
	文字間のアンダーバーをハイフンに
+ `abcDef→abc-def`  
	キャメルケースをハイフンに
+ `abc-def→abcDef`  
	文字間のハイフンをキャメルケースに
+ `Àóṫœ→Aoto`  
	符号付きラテン文字の符号を解除

※ 「符号付きラテン文字を標準化」では結合分音記号も削除します。

### Url/Base64

各種エンコード／デコードを行う。

+ `URL エンコード(軽)`  
	パーセントエンコード（;/?:@& = +$-\_!~\*.,()a\#\'以外）を実行
+ `URL エンコード(中)`  
	パーセントエンコード（\-\_!~\*.()a\'以外）を実行
+ `URL エンコード(強)`  
	パーセントエンコード（\*+-\_./以外）を実行
+ `URL デコード`  
	パーセントエンコードをすべてデコード
+ `BASE64 エンコード`  
	BASE64エンコードを実行
+ `BASE64 デコード`  
	BASE64エンコードをすべてデコード

### Unicode関連

Unicode関連の変換を行う。

+ `エスケープ`  
	Unicode値でのパーセントエンコード（%u～）
+ `アンエスケープ`  
	Unicode値でのパーセントデコード
+ `HTMLエスケープ(中)`  
	HTML数値文字参照（\&#x～;）
+ `HTMLエスケープ(強)`  
	全文字をHTML数値文字参照（\&#x～;）
+ `HTMLアンエスケープ`  
	文字参照、実体参照を復号
+ `[<>\&]の実体参照化`  
	HTMLタグ用文字を実体参照化
+ `UTF-32→UTF-16`  
	UTF32のオーバーフロー分をサロゲートペアに変換
+ `UTF-16→UTF-32`  
	サロゲートペアをUTF32表記に

### 数値型/数字

数値型に対しての進数変換や、アラビア数字からほかの数字記号への変換などを行う。

+ `Dec→Bin` `Bin→Dec`  
	10進数を2進数に、あるいはその逆
+ `Dec→Hex` `Hex→Dec`  
	10進数を16進数に、あるいはその逆
+ `Bin→Hex` `Hex→Bin`  
	2進数を16進数に、あるいはその逆
+ `123→百二十三`  
	アラビア数字を漢数字に（桁付き）
+ `123→一二三`  
	アラビア数字を漢数字に（桁なし）
+ `百二十三→123`  
	漢数字をアラビア数字に
+ `Arabic→Roman` `Roman→Arabic`  
	アラビア数字をローマ数字に或いはその逆に変換  
	変換型は「M(1~3999)」型、「ↀ(1~399999)」型、「CIↃ(1~399999)」型の3つから選ぶことができる。

※ アラビア数字をローマ数字に関して、ↀ型の場合の100000である「ↈ（&amp;#x2188;）」はほとんどのフォントで表示が不可能です。  
※ アラビア数字から漢数字の変換（桁付き）に関して、少数の桁（分、厘、毛など）に関しては考慮せず数字のみを列記する方式にしております。

### 抽出/排除

チェックした文字種類のみを抽出、あるいは排除した文字列を出力する

### 一括排除

該当の対象文字を文字列から排除する

+ `全ての改行`  
	すべての改行、改頁コードを削除
+ `ＨＴＭＬタグ`  
	開始タグ、終了タグ、独立タグをすべて削除
+ `余分なスペース`  
	行頭のスペースを削除し、単語間の複数スペースを単独スペースに変換
+ `余分な改行`  
	連続する改行コードを単独に変換、文頭文末の改行も削除
+ `重複する文字`  
	重複する文字をすべて削除
+ `重複する行`  
	まったく同じ行を削除
+ `重複する単語`  
	まったく同じ単語を削除（スペース区切り評価）

### 反転/ソート

文字列全体に対して反転やソートを行う。

+ `文字単位で反転`  
	文字単位でテキスト全体を反転
+ `行単位で反転`  
	行単位でテキスト全体を反転
+ `単語単位で反転`  
	単語（スペース区切り評価）でテキスト全体を反転
+ `行単位で昇順に整列`  
	行単位でテキスト全体を昇順ソート
+ `行単位で降順に整列`  
	行単位でテキスト全体を降順ソート
+ `文字単位で昇順に整列`  
	文字単位でテキスト全体を昇順ソート
+ `文字単位で降順に整列`  
	文字単位でテキスト全体を降順ソート

※ ソート順位の評価はUnicode順となります。

### 重複文字/行列

重複文字に対して操作や行列に対しての変換を行う。

+ `ABA→AB`  
	重複部分のみ削除
+ `ABA→AA`  
	重複部分を重複したまま抽出
+ `ABA→B`  
	重複した文字以外を抽出
+ `ABA→A`  
	重複部分を重複させないで抽出
+ `行と列を入れ替え`  
	チェックされた文字を列区切りに使って行と列を入れ替えます

### 日本語関連

日本語テキストに関して様々な変換を行う。

+ `あ→ア` `ア→あ`  
	全角ひらがなを全角カタカナに、あるいはその逆
+ `ｱ→ア` `ア→ｱ`  
	半角カタカナを全角カタカナに、あるいはその逆
+ `A1→Ａ１` `Ａ１→A1`  
	半角英数字を全角英数字に、あるいはその逆
+ `新字→旧字（中）`  
	新字体を旧字体に（異体字セレクタ分を含まない）
+ `新字→旧字（強）`  
	新字体を旧字体に（異体字セレクタ分を含む）
+ `旧字→新字`  
	旧字体を新字体に（異体字セレクタ分を含む）
+ `一二→壱弐` `壱弐→一二`  
	漢数字を大字に、あるいはその逆
+ `トウキョウ→tôkyô`  
	全角カタカナを訓令式ローマ字表記に
+ `トウキョウ→tokyo`  
	全角カタカナをヘボン式ローマ字表記に
+ `tokyo→トキョ`  
	ヘボン式ローマ字を全角カタカナに

※ 全角カタカナからの訓令式・ヘボン式ローマ字変換に関して、特殊な用法や表外の訓に関しては（99式などに倣った）独自の変換をしています。  
※ 新字体→旧字体の変換において旧字が別字として存在しない、あるいはUTF16範囲にない場合は異体字セレクタによって旧字体を表示します。

### CJK関連

漢字に対して様々な変換を行う。

+ `日→簡体`  
	日本字体を簡体字に
+ `日→繁体`  
	日本字体を繁体字に
+ `簡体→日`  
	簡体字を日本字体に
+ `繁体→日`  
	繁体字を日本字体に
+ `簡体→繁体`  
	簡体字を繁体字に
+ `繁体→簡体`  
	繁体字を簡体字に
+ `ピンイン`  
	漢字の直後にピンインを追加

※ CJK変換全般に関して、一部の文字の変換が不可逆変換であるため正しく変換されない恐れがあります。  
※ ピンイン表記追加に関して、ピンインは「[A/B/C]」といった形式で表示します。

### Sanskrit

サンスクリットの各種変換を行う。

+ `संस्कृत→saMskRta`  
	デーヴァナガリーを京都・ハーバード方式に
+ `संस्कृत→saṃskṛta`  
	デーヴァナガリーをIASTに
+ `saMskRta→संस्कृत`  
	京都・ハーバード方式をデーヴァナガリーに
+ `saMskRta→saṃskṛta`  
	京都・ハーバード方式をIASTに
+ `saṃskṛta→संस्कृत`  
	IASTをデーヴァナガリーに
+ `saṃskṛta→saMskRta`  
	IASTを京都・ハーバード方式に

※ 「サンスクリット変換」のIAST方式、HK方式の変換では拡張IAST（ISO-15919方式）ではなく元来の方式のためISO-15919方式を正しく変換できません。

### 正規表現

正規表現置換を行う

### 連番生成

連番を生成します。  
生成される連番は __from__ から __to__ までの間、 __step__ 刻みの数字で、  
__padding__ によってゼロパディングを行います。  
生成された連番は __join__ に従って変換前テキストに挿入されます。  
__Reg__ の正規表現に従って連番と変換前テキストが成形されます。  
`$1`は連番、`$2`は変換前テキストを示し、例えばRegが

```
$1: $2
```

の場合、出力されるのは

```
001: 変換前のテキスト1
002: 変換前のテキスト2
003: 変換前のテキスト3
```

といったテキストになります。

### 左右連結

左右のテキストエリアを使った連結を行います。

+ `上下に結合`  
	左右のテキストエリアを上下結合した結果を出力
+ `行ごとに結合`  
	左右のテキストエリアを行ごとに結合した結果を出力
+ `文字ごとに結合`  
	左右のテキストエリアを文字ごとに結合した結果を出力

## その他

### github

[https://github.com/ichimonji/textConvertor](textConvertor)

### 変換用マップ

CJKなど変換には配列を使ったマッピングによって対応しています。

+ `cjk.js`
	- cjk_all  
		簡体字、繁体字、日本漢字の単語
	- cjk_word  
		簡体字、繁体字、日本漢字の熟語
+ `japanese.js`
	- shin2kyu  
		新字体、旧字体の対応（基本）
	- kyu2shinAdd  
		新字体、旧字体の対応（不可逆変換対応）
	- shinSpBase  
		新字体、旧字体の対応（異体字セレクタ対応）
	- kunre  
		訓令式ローマ字用
	- hebon  
		ヘボン式ローマ字用
	- kanaroma  
		ローマ字→カナ変換用
	- kanaMap  
		半角カタカナ用
	- kanaAlpha  
		全角英数字→半角英数字変換用
	- pinyin  
		ピンイン検索用
+ `other.js`
	- charaMap  
		文字参照用
	- latinVariety  
		ラテン符号付文字検索用
	- daizi, zero2nine, ten2thou, suffices  
		漢数字→大字用
	- roman, romanTh, romanStr, romanStr1, romanStr2, romanUni  
		アラビア数字→ローマ数字用
	- sanskrit  
		サンスクリット用




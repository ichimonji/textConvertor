# 汎用テキストコンバータ

pug関連、stylus関連はSublime Textの「SublimeOnSaveBuild」を利用してビルド。  
eslintはSublime Textの「sublimelinter」を利用してチェック。

グローバルにインストールしたnode module

+ browserify
+ eslint
+ eslint-config-airbnb-base
+ eslint-plugin-html
+ eslint-plugin-import
+ jstransformer
+ jstransformer-html-beautify
+ jstransformer-markdown-it
+ jstransformer-stylus
+ nib
+ pug
+ stylus

各jsをcommon.es6.jsにインポート。  
browserify、babelifyでes5化しバンドル。


common.jsにビルド（圧縮無し）

```
npm run b
```

common.jsにビルド（圧縮有り）

```
npm run bm
```


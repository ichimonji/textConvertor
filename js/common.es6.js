/* eslint */

// 各変数を各ファイルからインポート
import {
  romanTh, latin, latinVariety, latinVariety2, latinVariety3, chara, charaMap,
  zero, zero2nine, suffices, ten2thou, point, roman,
  romanStrBase, romanStr1, romanStr2, findR, findR2, romanUni, sktS, sktAddA,
  sktS2, sanskrit, sktH, sktH2, sktRemoveA, sktAddVirama, sktI, sktI2, DayArr,
  MonthArr, serialData
} from './other';
import {
  kana1, kana1arr, kanaMap, kana2, kana2arr, alpha1, alpha1arr, kanaAlpha, alpha2,
  alpha2arr, cjk1, cjk1arr, shin2kyu, cjk2, cjk2arr, shinSp1, shinSpBase,
  shinSp1arr, cjk1add, cjk1addArr, kyu2shinAdd, findDK, findDD, daizi, kun1,
  kun1arr, kunre, heb1, heb1arr, hebon, kanaroma, kanaromaArr, kanaromaReg
} from './japanese';
import {
  findWordN, findWordNArr, cjkWord, findN, findNArr, findKArr, findHArr, findWordK,
  findWordKArr, findK, findWordH, findWordHArr, findH
} from './cjk';
import { pinyin, pinyin2, pin } from './pinyin';

// jQueryおよびbootstrap3をセット
window.$ = require('jquery');

window.jQuery = window.$;
require('bootstrap');

$(function () {
  const
    $ipt = $('#text-i'),
    $opt = $('#text-o'),
    $bt = $('.bt-control');

  let
    histArr = [{ ipt: '', opt: '' }],
    instArr,
    lastArr,
    tmp,
    tmpFlg = false;

  Array.prototype.getArrLast = function () { return this[this.length - 1]; };
  Array.prototype.arrIndex = function (r) {
    instArr = [];
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].indexOf(r) !== -1) instArr.push(i);
    }
    return instArr;
  };

  const
    // 出力処理
    output = (iStr, oStr) => {
      lastArr = histArr.getArrLast();
      if (lastArr.opt !== oStr) {
        instArr = { ipt: iStr, opt: oStr };
        histArr.push(instArr);
        $ipt.val(iStr);
        $opt.val(oStr);

        if ($('.automove').prop('checked')) {
          instArr = { ipt: $opt.val(), opt: '' };
          $ipt.val($opt.val());
          $opt.val('');
          histArr.push(instArr);
        }
        $('#lengthDisp').html(`ch/li:${$ipt.val().length}/${$ipt.val().split(/\n/).length}&gt;${$opt.val().length}/${$opt.val().split(/\n/).length}`);
      } else {
        $opt.val(oStr);
      }
      return this;
    },
    toRoman = (r, num) => romanTh[r].replace(/(.)/g, n => num[parseInt(n, 10)]),
    dupDelete = str => str.split('').filter((x, i, self) => self.indexOf(x) === i).join(''),
    // クリップボードコピー用
    $forCopyElm = $('#forCopy'),
    copyClip = str => {
      $forCopyElm.val(str);
      $forCopyElm.select();
      return document.execCommand('copy');
    };

  // 部分選択用
  $ipt.on('mouseup touchend keyup', e => {
    const
      elm = e.currentTarget,
      $selDisp = $('#selDisp');

    if (elm.selectionStart === elm.selectionEnd) {
      tmpFlg = false;
      $selDisp.text('');
    } else {
      tmpFlg = true;
      tmp = { start: elm.selectionStart, end: elm.selectionEnd };
      $selDisp.text(`(select:${tmp.end - tmp.start}characters)`);
    }
  });

  // 変換処理
  $bt.on('click', e => {
    const
      ival = $(e.currentTarget).val();

    let
      iStr = $ipt.val(),
      instArr2 = '',
      instArr3 = '',
      pathArr = [],
      instStr = '',
      instStr2 = '',
      instStr3 = '',
      instNum = 0,
      oStr = '',
      find = '',
      flg = 'g',
      hi,
      lo,
      pathStep = 0,
      beforeStr = '',
      endStr = '',
      int,
      fract,
      seisuu = '',
      shousuu = '';
    instArr = [];

    if (tmpFlg) {
      beforeStr = iStr.slice(0, tmp.start);
      endStr = iStr.slice(tmp.end);
      iStr = iStr.slice(tmp.start, tmp.end);
    }
    switch (ival) {
      /* Code/Numerals */
      // Convert Case
      case 'case-title':
        oStr = iStr.replace(/\S\S*/g, txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'case-upper':
        oStr = iStr.toUpperCase();
        break;
      case 'case-lower':
        oStr = iStr.toLowerCase();
        break;
      case 'case-swap':
        oStr = iStr.replace(/[a-zA-Z]/g, r => r[(/[a-z]/g).test(r) ? 'toUpperCase' : 'toLowerCase']());
        break;
      case 'case-toDouble':
        oStr = iStr.replace(/"/g, '\'');
        break;
      case 'case-toSingle':
        oStr = iStr.replace(/'/g, '"');
        break;
      case 'case-hyphenToUnder':
        oStr = iStr.replace(/(\w+)-(?=(\w+))/g, '$1_');
        break;
      case 'case-underToHyphen':
        oStr = iStr.replace(/(\w+)_(?=(\w+))/g, '$1-');
        break;
      case 'case-camelToHyphen':
        oStr = iStr.replace(/(\w+)([A-Z])(?=(\w+))/g, (r, r1, r2) => `${r1}-${r2.toLowerCase()}`);
        break;
      case 'case-hyphenToCamel':
        oStr = iStr.replace(/(\w+)-(\w)(?=(\w+))/g, (r, r1, r2) => r1 + r2.toUpperCase());
        break;
      case 'case-latinNomalize':
        oStr = iStr.replace(latin, r => {
          [[instStr]] = latinVariety.filter(s => (s[1].join('').indexOf(r) !== -1));
          return (r === r.toLowerCase()) ? instStr : instStr.toUpperCase();
        }).replace(/[\u0300-\u036F]/g, '');
        break;
      // Url / Base64
      case 'url-encodeS':
        oStr = encodeURI(iStr);
        break;
      case 'url-encodeM':
        oStr = encodeURIComponent(iStr);
        break;
      case 'url-encodeL':
        oStr = escape(iStr);
        break;
      case 'url-decode':
        oStr = decodeURIComponent(iStr);
        break;
      case 'b64-encode':
        oStr = btoa(unescape(encodeURIComponent(iStr)));
        break;
      case 'b64-decode':
        oStr = decodeURIComponent(escape(atob(iStr)));
        break;
      // Unicode
      case 'uni-escape':
        oStr = escape(iStr);
        break;
      case 'uni-unescape':
        oStr = unescape(iStr);
        break;
      case 'uniH-escapeM':
        oStr = escape(iStr).replace(/%(\w{2,2})/gi, '&#x00$1;').replace(/%u(\w{4,5})/gi, '&#x$1;');
        break;
      case 'uniH-escapeL':
        oStr = iStr.replace(/(.)/g, r => `&#x${(String(r)).charCodeAt(0).toString(16)};`);
        break;
      case 'uniH-unescape':
        instStr = iStr.replace(chara, (r, r1) => charaMap[r1]);
        instStr = instStr.replace(/&#(\d{4,5});/g, (r, r1) => `%u${(parseInt(r1, 10)).toString(16)}`);
        instStr = instStr.replace(/(&#\x)([\da-f]{2};)/g, (r, r1, r2) => `${r1}00${r2}`);
        instStr = instStr.replace(/(&#\x)([\da-f]{3};)/g, (r, r1, r2) => `${r1}0${r2}`);
        instStr = instStr.replace(/&#\x([\da-f]{4,5});/g, '%u$1');
        oStr = unescape(instStr);
        break;
      case 'uni-escapeForHtml':
        oStr = iStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        break;
      case 'uni-utf32to16':
        oStr = iStr.replace(/(&#x|%u)([12][\da-f]{4,4})(;{0,1})/gi, (r, r1, r2, r3) => {
          instNum = parseInt(r2, 16);
          hi = Math.floor((instNum - 0x10000) / 0x400) + 0xD800;
          lo = ((instNum - 0x10000) % 0x400) + 0xDC00;
          return r1 + hi.toString(16) + r3 + r1 + lo.toString(16) + r3;
        });
        break;
      case 'uni-utf16to32': {
        const
          instReg = new RegExp('(&#x|%u)(d[89a-f][0-9a-f]{2,2})(;{0,1})(&#x|%u)(d[c-f][0-9a-f]{2,2})(;{0,1})', 'gi');
        oStr = iStr.replace(instReg, (r, r1, r2, r3, r4, r5) => {
          hi = parseInt(r2, 16);
          lo = parseInt(r5, 16);
          instNum = ((0x10000 + (hi - 0xD800)) * 0x400) + (lo - 0xDC00);
          return r1 + instNum.toString(16) + r3;
        });
        break;
      }
      case 'js-escape':
        instStr = iStr;
        instStr = instStr.replace(/\\/g, '\\\\');
        instStr = instStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        instStr = instStr.replace(/\f/g, '\\f').replace(/\v/g, '\\v');
        instStr = instStr.replace(/\t/g, '\\t');
        oStr = instStr;
        break;
      case 'js-unescape':
        instStr = iStr;
        instStr = instStr.replace(/\\t/g, '\t');
        instStr = instStr.replace(/\\f/g, '\f').replace(/\\v/g, '\v');
        instStr = instStr.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
        instStr = instStr.replace(/\\\\/g, '\\');
        oStr = instStr;
        break;
      // Numeric 1
      case 'num-10_2':
        oStr = iStr.replace(/([\d.]+)/g, n => parseInt(n, 10).toString(2));
        break;
      case 'num-2_10':
        oStr = iStr.replace(/([01]+)/g, n => parseInt(n, 2).toString(10));
        break;
      case 'num-10_16':
        oStr = iStr.replace(/([\d.]+)/g, n => parseInt(n, 10).toString(16));
        break;
      case 'num-16_10':
        oStr = iStr.replace(/([\da-f]+)/g, n => parseInt(n, 16).toString(10));
        break;
      case 'num-2_16':
        oStr = iStr.replace(/([01]+)/g, n => parseInt(n, 2).toString(16));
        break;
      case 'num-16_2':
        oStr = iStr.replace(/([\da-f]+)/g, n => parseInt(n, 16).toString(2));
        break;
      case 'num-comma':
        oStr = iStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        break;
      case 'num-decomma':
        oStr = iStr.replace(/([\d,]+)/g, n => n.replace(/,/g, ''));
        break;
      case 'num-abs':
        oStr = iStr.replace(/([-+]?\d+.\d+|[-+]?\d)/g, n => Math.abs(parseFloat(n, 10)));
        break;
      case 'num-int':
        oStr = iStr.replace(/([-+]?\d+.\d+|[-+]?\d)/g, n => parseInt(n, 10));
        break;
      case 'num-round':
        oStr = iStr.replace(/([-+]?\d+.\d+|[-+]?\d)/g, n => Math.round(parseFloat(n, 10)));
        break;
      case 'num-floor':
        oStr = iStr.replace(/([-+]?\d+.\d+|[-+]?\d)/g, n => Math.floor(parseFloat(n, 10)));
        break;
      case 'num-ceil':
        oStr = iStr.replace(/([-+]?\d+.\d+|[-+]?\d)/g, n => Math.ceil(parseFloat(n, 10)));
        break;
      /* StrControl */
      // Extract
      case 'extract':
        flg = 'gu';
        instStr = '[';
        $('.extract_reg:checked').each(function () {
          instStr += $(this).val();
        });
        instStr += ']';
        instStr = instStr.replace(/\[/g, '[^');
        find = new RegExp(instStr, flg);
        oStr = iStr.replace(find, '');
        break;
      case 'exclude':
        flg = 'gu';
        instStr = '[';
        $('.extract_reg:checked').each(function () {
          instStr += $(this).val();
        });
        instStr += ']';
        find = new RegExp(instStr, flg);
        oStr = iStr.replace(find, '');
        break;
      // Exclusion
      case 'newline':
        oStr = iStr.replace(/[\r\n]/g, '');
        break;
      case 'html':
        oStr = iStr.replace(/<[^>]*?>/g, '');
        break;
      case 'space':
        oStr = iStr.replace(/[\t 　]+/gm, ' ');
        oStr = oStr.replace(/^[\t 　]/gm, '');
        oStr = oStr.replace(/[\t 　]\n/gm, '\n');
        break;
      case 'margin':
        oStr = iStr.replace(/\r\n/g, '\n');
        oStr = oStr.replace(/^[\t 　]+$/gm, '');
        oStr = oStr.replace(/\n(?=\n)/g, '');
        oStr = oStr.replace(/^\n/g, '');
        break;
      case 'ex_dup1':
        instArr = iStr.split('');
        instArr = instArr.filter((x, i, self) => (/\s/.test(x) || self.indexOf(x) === i));
        oStr = instArr.join('');
        break;
      case 'ex_dup2':
        instArr = iStr.replace(/\r\n/g, '\n').split(/\n/);
        instArr = instArr.filter((x, i, self) => self.indexOf(x) === i);
        oStr = instArr.join('\n');
        break;
      case 'ex_dup3':
        instStr = iStr.replace(/\r\n/g, '\n');
        instArr = instStr.replace(/(\S+|\s+)/g, '$1|-|-|').split('|-|-|');
        instArr = instArr.filter((x, i, self) => (/\s+/.test(x) || self.indexOf(x) === i));
        oStr = instArr.join('');
        break;
      // Reverse/Sort
      case 'rev-chara':
        for (let i = iStr.length - 1; i >= 0; i -= 1) instStr += iStr.charAt(i);
        oStr = instStr;
        break;
      case 'rev-line':
        instArr = iStr.replace(/\r\n/g, '\n').split(/\n/);
        for (let i = instArr.length - 1; i >= 0; i -= 1) instStr += `${instArr[i]}\n`;
        oStr = instStr;
        break;
      case 'rev-line2':
        instArr = iStr.replace(/\r\n/g, '\n').split(/\n/);
        for (let i = 0; i < instArr.length; i += 1) {
          instStr += `${instArr[i].split('').reverse().join('')}\n`;
        }
        oStr = instStr;
        break;
      case 'rev-word':
        instArr = iStr.replace(/\r\n/g, '\n').replace(/(\s)/g, '||||$1||||').split('||||');
        for (let i = instArr.length - 1; i >= 0; i -= 1) instStr += instArr[i];
        oStr = instStr;
        break;
      case 'sort1':
        instArr = iStr.replace(/\r\n/g, '\n').split('\n');
        oStr = instArr.sort((a, b) => ((a > b) - (a < b))).join('\n');
        break;
      case 'sort2':
        instArr = iStr.replace(/\r\n/g, '\n').split('\n');
        oStr = instArr.sort((a, b) => ((a < b) - (a > b))).join('\n');
        break;
      case 'sort3':
        instArr = iStr.replace(/\r\n/g, '\n').split('');
        oStr = instArr.sort((a, b) => ((a > b) - (a < b))).join('');
        break;
      case 'sort4':
        instArr = iStr.replace(/\r\n/g, '\n').split('');
        oStr = instArr.sort((a, b) => ((a < b) - (a > b))).join('');
        break;
      case 'sort5':
        instArr = iStr.replace(/\r\n/g, '\n').split('\n');
        oStr = instArr.sort((a, b) => ((a.length > b.length) - (a.length < b.length))).join('\n');
        break;
      case 'sort6':
        instArr = iStr.replace(/\r\n/g, '\n').split('\n');
        oStr = instArr.sort((a, b) => ((a.length < b.length) - (a.length > b.length))).join('\n');
        break;
      // Duplication/matrix-change
      case 'dup1':
        oStr = iStr.split('').filter((x, i, self) => self.indexOf(x) === i).join('');
        break;
      case 'dup2':
        oStr = iStr.split('').filter((x, i, self) => self.indexOf(x) !== self.lastIndexOf(x)).join('');
        break;
      case 'dup3':
        oStr = iStr.split('').filter((x, i, self) => self.indexOf(x) === self.lastIndexOf(x)).join('');
        break;
      case 'dup4':
        oStr = iStr.split('').filter((x, i, self) => (self.indexOf(x) === i && i !== self.lastIndexOf(x))).join('');
        break;
      case 'matrix-change': {
        const trans = a => Object.keys(a[0]).map(c => a.map(r => r[c]));
        instArr = iStr.replace(/\r\n/g, '\n').split('\n');
        const
          splitter = ($('.matrix:checked').val()).replace('\\t', '\t').replace('\\,', ',');
        instArr2 = [];
        instArr = instArr.map(r => r.split(new RegExp(splitter, 'g')));
        instStr = trans(instArr).map(r => r.join(splitter)).join('\n');
        oStr = instStr;
        break;
      }
      // Tidy
      case 'tidy': {
        const
          tdAm = parseInt($('#td_amount').val(), 10),
          tdReg = new RegExp(`(.{${tdAm},${tdAm}})`, 'g');
        instStr = iStr.replace(/[\n\r]/g, '');
        instStr = instStr.replace(tdReg, '$1\n');
        oStr = instStr;
        break;
      }
      case 'tidy2': {
        const
          td2Reg = $('#td2_reg').val().replace(/\\\\/g, '\\'),
          td2Reg2 = new RegExp(`(.)(${td2Reg})`, 'g');
        instStr = iStr.replace(/[\n\r]/g, '');
        instStr = instStr.replace(td2Reg2, '$1\n$2');
        oStr = instStr;
        break;
      }
      case 'tidy3': {
        const
          td3Cb = Object.values($('.tidy3_cb').filter(':checked').map((index, elm) => $(elm).val()).get()).join(''),
          td3Cb1 = td3Cb.replace(/[「（]/g, ''),
          td3Cb2 = td3Cb.replace(/[^「（]/g, ''),
          td3Reg1 = new RegExp(`([${td3Cb1}])`, 'g');
        instStr = iStr.replace(/[\n\r]/g, '');
        instStr = instStr.replace(td3Reg1, '$1\n');
        if (td3Cb2 !== '') {
          const
            td3Reg2 = new RegExp(`([${td3Cb2}])`, 'g');
          instStr = instStr.replace(td3Reg2, '\n$1');
          instStr = instStr.replace(/([。、.,])(\n)([」）])/g, '$1$3');
          instStr = instStr.replace(/([。、.,])(\n\n)([「（])/g, '$1\n$3');
        }
        oStr = instStr;
        break;
      }
      case 'tree': {
        instArr = iStr.replace(/\r/g, '').split(/\n/g).map(n => n.split(/\//g));
        instArr2 = {};
        let instIstr;
        for (let i = 0; i < instArr.length; i += 1) {
          instIstr = instArr[i];
          if (instIstr.join('/').slice(-1) !== '/') {
            for (let j = 0; j < instIstr.length; j += 1) {
              if (!j) {
                if (!(instIstr[j] in instArr2)) instArr2[instIstr[j]] = {};
                pathArr = instArr2[instIstr[j]];
              } else {
                if (!(instIstr[j] in pathArr)) pathArr[instIstr[j]] = {};
                pathArr = pathArr[instIstr[j]];
              }
            }
          }
        }
        instStr = JSON.stringify(instArr2, null, '\t');
        instStr = instStr.replace(/(: [[{])$/gm, '/');
        instStr = instStr.replace(/^(\t+)"(.*?)"([/]?)([: {},[\]]*?)$/gm, '$1$2$3');
        instStr = instStr.replace(/^([\t [\]{},]+)$/gm, '');
        instStr = instStr.replace(/\n+/g, '\n').replace(/^\t/gm, '').replace(/^\n/g, '');
        oStr = instStr;
        break;
      }
      case 'path':
        instArr = iStr.replace(/\r/g, '').split(/\n/g);
        instArr2 = instArr.map(n => n.split(/\t/g).length - 1);
        instArr = instArr.map(n => n.replace(/\t/g, ''));
        for (let i = 0; i < instArr.length; i += 1) {
          if (instArr[i].slice(-1) === '/') {
            [instStr3] = instArr[i].split('/');
            if (instArr2[i] > pathStep - 1 || pathStep === 0) {
              pathArr.push(instStr3);
            } else if (instArr2[i] <= pathStep - 1) {
              pathArr = pathArr.slice(0, instArr2[i]);
              pathArr.push(instStr3);
            }
            pathStep = pathArr.length;
          } else if (instArr[i] !== '') {
            instStr += `${pathArr.join('')}/${instArr[i]}\n`;
          }
        }
        oStr = instStr;
        break;
      case 'jsonTidy': {
        let jsonTab = '';
        instStr = iStr;
        instStr = instStr.replace(/(\{.+\}|\[.+\])/g, r => {
          instStr2 = r;
          instStr2 = instStr2.replace(/([^"])(true|false|null)([^"])/g, '$1"toStr:::$2:::/toStr"$3');
          instStr2 = instStr2.replace(/([^"\d])(-?\d+(\.\d*)?([eE][+-]?\d+)?)([^"\d])/g, '$1"toStr:::$2:::/toStr"$5');
          instStr2 = instStr2.replace(/([^"]+)($|".*?[^//]")/g, (s, s1, s2) => s1.replace(/[^{}[\]:,]/g, '').replace(/([[\]{},])/g, '$1$1$1') + s2);
          instStr2 = instStr2.replace(/":([^ ])/g, '": $1');
          instStr2 = instStr2.replace(/([{[,]{3})/g, '$1\n');
          instStr2 = instStr2.replace(/([}\]]{3})/g, '\n$1');
          instArr = instStr2.split(/\n/g);
          jsonTab = 0;
          for (let i = 0; i < instArr.length; i += 1) {
            if (/[\]}]{3}/.test(instArr[i])) jsonTab -= 1;
            instArr[i] = Array(jsonTab + 1).join('\t') + instArr[i];
            if (/[[{]{3}/.test(instArr[i])) jsonTab += 1;
          }
          instStr2 = instArr.join('\n');
          instStr2 = instStr2.replace(/([[\]{},])\1\1/g, '$1').replace(/("toStr:::|:::\/toStr")/g, '');
          return instStr2;
        });
        oStr = instStr;
        break;
      }
      // replace
      case 'replacement':
        flg = $('#caps').prop('checked') ? 'g' : 'gi';
        find = new RegExp($('#rep_find').val(), flg);
        instStr2 = $('#rep_rep').val();
        instStr2 = instStr2.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
        oStr = iStr.replace(find, instStr2);
        break;
      // merge
      case 'merge1':
        oStr = `${iStr}\n${$opt.val()}`;
        break;
      case 'merge2': {
        instArr = iStr.split(/\n/g);
        instArr2 = $opt.val().split(/\n/g);
        const
          mg2Length = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        for (let i = 0; i < mg2Length; i += 1) {
          if (instArr[i]) instStr += instArr[i];
          if (instArr2[i]) instStr += instArr2[i];
          instStr += '\n';
        }
        oStr = instStr;
        break;
      }
      case 'merge3': {
        instArr = iStr.split('');
        instArr2 = $opt.val().split('');
        const
          mg3Length = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        for (let i = 0; i < mg3Length; i += 1) {
          if (instArr[i]) instStr += instArr[i];
          if (instArr2[i]) instStr += instArr2[i];
        }
        oStr = instStr;
        break;
      }
      case 'merge4':
        instArr = $ipt.val().split('');
        instArr2 = $opt.val().split('');
        instArr3 = [];
        for (let i = 0; i < instArr.length; i += 1) {
          for (let j = 0; j < instArr2.length; j += 1) {
            if (instArr[i] === instArr2[j]) {
              instArr3.push(instArr[i]);
              break;
            }
          }
        }
        instArr = instArr.filter(r => (instArr3.indexOf(r) === -1));
        instArr2 = instArr2.filter(r => (instArr3.indexOf(r) === -1));
        iStr = instArr.join('');
        oStr = instArr2.join('');
        break;
      /* Language */
      // Numeric 2
      case 'num-toJpL':
        oStr = iStr.replace(/([\d,.]+)/g, n => {
          instNum = n.replace(/,/g, '');
          instNum.match(/(\d+)(?:\.(\d+))?/i);
          int = RegExp.$1;
          fract = RegExp.$2;
          seisuu = '';
          for (let i = int.length - 1; i >= 0; i -= 1) {
            seisuu += zero2nine[parseInt(int[int.length - i - 1], 10)];
            if (i % 4 === 0) {
              seisuu += suffices[Math.floor(i / 4)];
            } else {
              seisuu += ten2thou[i % 4];
            }
          }
          seisuu = seisuu.replace(/〇[十百千]/g, '');
          seisuu = seisuu.replace(/一([十百千])/g, '$1');
          seisuu = seisuu.replace(/〇/g, '');
          seisuu = seisuu.replace(/([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/g, '$1');
          seisuu = seisuu.replace('禾予', '%uD855%uDF71');
          seisuu = unescape(seisuu);
          if (seisuu === '') seisuu = zero;
          if (fract) shousuu = point + fract.replace(/(.)/g, r => zero2nine[parseInt(r, 10)]);
          return seisuu + shousuu;
        });
        break;
      case 'num-toJpM':
        oStr = iStr.replace(/([\d,.]+)/g, n => {
          instStr = n.replace(/(\d)/g, r => zero2nine[parseInt(r, 10)]);
          return instStr.replace(',', '').replace('.', '点');
        });
        break;
      case 'num-j_a': {
        const kTen1 = new RegExp('(([零点〇一二三四五六七八九十百千万億兆京垓穣溝澗正載極]|\uD855\uDF71|恒河沙|阿僧祇|那由他|不可思議|無量大数)+)', 'gu');
        oStr = iStr.replace(kTen1, r => {
          const kTen2 = new RegExp('(\uD855\uDF71|\u25771)', 'gu');
          instStr = r.replace(kTen2, '禾予');
          [int, fract] = instStr.split('点');
          let nowKeta;
          if (int === '零') {
            seisuu = '0';
          } else {
            instArr = int.split(/([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/);
            for (let i = 0; i < instArr.length; i += 1) {
              if (instArr[i].match(/([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/) !== null) {
                nowKeta = suffices.indexOf(RegExp.$1);
                if (instArr[i + 2] !== suffices[nowKeta - 1] && nowKeta > 1) instArr.splice(i + 1, 0, '〇千〇百〇十〇', suffices[nowKeta - 1]);
              } else {
                instArr[i] = instArr[i].replace(/([十百千]|^)([十百千])/g, '$1一$2');
                if (instArr[i].indexOf('千') === -1) instArr[i] = `〇千${instArr[i]}`;
                if (instArr[i].indexOf('百') === -1) instArr[i] = `${instArr[i].slice(0, 2)}〇百${instArr[i].slice(2, instArr[i].length)}`;
                if (instArr[i].indexOf('十') === -1) instArr[i] = `${instArr[i].slice(0, 4)}〇十${instArr[i].slice(4, instArr[i].length)}`;
                if (instArr[i].charAt(instArr[i].length - 1) === '十') instArr[i] = `${instArr[i]}〇`;
              }
            }
            seisuu = instArr.join('').replace(/([十百千万億兆京垓穣禾予溝澗正載極恒河沙阿僧祇那由他不可思議無量大数])/g, '');
            seisuu = seisuu.replace(/(.)/g, n => zero2nine.indexOf(n));
            seisuu = seisuu.replace(/^0+/g, '');
          }
          if (fract) shousuu += `.${fract.replace(/(.)/g, n => zero2nine.indexOf(n))}`;
          return seisuu + shousuu;
        });
        break;
      }
      case 'num-a_r':
        oStr = iStr.replace(/(\d[\d.,]+|\d+)/g, n => {
          instNum = parseInt(n.replace(/,/g, '').split('.')[0], 10);
          let rom = '';
          if (instNum < 1 || instNum > 399999) {
            return instNum;
          } else if (instNum > 3999 && $('.roman_class:checked').val() === 'M') {
            return instNum;
          }
          // else paragraph
          if (instNum >= 100000) {
            instStr = Math.floor(instNum / 100000);
            rom += Array(instStr + 1).join(roman[5]);
            instNum -= instStr * 100000;
          }
          if (instNum >= 10000) {
            instStr = Math.floor(instNum / 10000);
            rom += toRoman(instStr - 1, roman[4]);
            instNum -= instStr * 10000;
          }
          if (instNum >= 1000) {
            instStr = Math.floor(instNum / 1000);
            rom += toRoman(instStr - 1, roman[3]);
            instNum -= instStr * 1000;
          }
          if (instNum >= 100) {
            instStr = Math.floor(instNum / 100);
            rom += toRoman(instStr - 1, roman[2]);
            instNum -= instStr * 100;
          }
          if (instNum >= 10) {
            instStr = Math.floor(instNum / 10);
            rom += toRoman(instStr - 1, roman[1]);
            instNum -= instStr * 10;
          }
          if (instNum !== 0) {
            rom += toRoman(instNum - 1, roman[0]);
          }
          const romanConv = new RegExp(`[${romanStrBase.join('')}]`, 'g');
          if ($('.roman_class:checked').val() === 'C1') {
            rom = rom.replace(romanConv, r => romanStr1[romanStrBase.indexOf(r)]);
          } else if ($('.roman_class:checked').val() === 'C2') {
            rom = rom.replace(romanConv, r => romanStr2[romanStrBase.indexOf(r)]);
          }
          return rom;
        });
        break;
      case 'num-r_a':
        oStr = iStr.replace(findR, n => {
          instStr = n.replace(/[ↀↁↂↇↈ]/g, s => romanStrBase[romanStr1.indexOf(s)]);
          instNum = 0;
          instStr = instStr.replace(findR2, r => romanUni[r]);
          instStr = instStr
            .replace(/CCCIↃↃↃ/g, 'Z')
            .replace(/IↃↃↃ/g, 'F')
            .replace(/CCIↃↃ/g, 'W')
            .replace(/IↃↃ/g, 'P')
            .replace(/CIↃ/g, 'M');
          instStr = instStr.replace(/^Z+/g, r => {
            instNum += (r.length) * 100000;
            return '';
          });
          instStr = instStr.replace(/^[WFZ]+/g, r => {
            instStr2 = r.replace(/W/g, '0').replace(/F/g, '1').replace(/Z/g, '2');
            instNum += (romanTh.indexOf(instStr2) + 1) * 10000;
            return '';
          });
          instStr = instStr.replace(/^[MPW]+/g, r => {
            instStr2 = r.replace(/M/g, '0').replace(/P/g, '1').replace(/W/g, '2');
            instNum += (romanTh.indexOf(instStr2) + 1) * 1000;
            return '';
          });
          instStr = instStr.replace(/^[CDM]+/g, r => {
            instStr2 = r.replace(/C/g, '0').replace(/D/g, '1').replace(/M/g, '2');
            instNum += (romanTh.indexOf(instStr2) + 1) * 100;
            return '';
          });
          instStr = instStr.replace(/^[XLC]+/g, r => {
            instStr2 = r.replace(/X/g, '0').replace(/L/g, '1').replace(/C/g, '2');
            instNum += (romanTh.indexOf(instStr2) + 1) * 10;
            return '';
          });
          instStr = instStr.replace(/^[IVX]+/g, r => {
            instStr2 = r.replace(/I/g, '0').replace(/V/g, '1').replace(/X/g, '2');
            instNum += (romanTh.indexOf(instStr2) + 1);
            return '';
          });
          return instNum;
        });
        break;
      // Jpn Characters
      case 'jpn1':
        oStr = iStr.replace(/[\u3041-\u3096]/g, r => String.fromCharCode(r.charCodeAt(0) + 0x60));
        break;
      case 'jpn2':
        oStr = iStr.replace(/[\u30a1-\u30f6]/g, r => String.fromCharCode(r.charCodeAt(0) - 0x60));
        break;
      case 'jpn3':
        oStr = iStr.replace(kana1, r => kanaMap[kana1arr.indexOf(r)][1]).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');
        break;
      case 'jpn4':
        oStr = iStr.replace(kana2, r => kanaMap[kana2arr.indexOf(r)][0]);
        break;
      case 'jpn5':
        oStr = iStr.replace(alpha1, r => kanaAlpha[alpha1arr.indexOf(r)][1]).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');
        break;
      case 'jpn6':
        oStr = iStr.replace(alpha2, r => kanaAlpha[alpha2arr.indexOf(r)][0]);
        break;
      case 'jpn7':
        instStr = iStr.replace(cjk1, r => shin2kyu[cjk1arr.indexOf(r)][1]);
        oStr = instStr;
        break;
      case 'jpn7b':
        instStr = iStr.replace(cjk1, r => shin2kyu[cjk1arr.indexOf(r)][1]);
        instStr = instStr.replace(shinSp1, r => unescape(shinSpBase[shinSp1arr.indexOf(r)][1]));
        oStr = instStr;
        break;
      case 'jpn8':
        instStr = iStr.replace(cjk2, r => shin2kyu[cjk2arr.indexOf(r)][0]);
        instStr = instStr.replace(cjk1add, r => kyu2shinAdd[cjk1addArr.indexOf(r)][1]);
        instStr = escape(instStr).replace(/(%uFE00|%uDB40%uDD[01][0-9a-fA-F])/g, '');
        oStr = unescape(instStr);
        break;
      case 'jpn9':
        oStr = iStr.replace(findDK, r => daizi.dai[daizi.kan.indexOf(r)]);
        break;
      case 'jpna':
        oStr = iStr.replace(findDD, r => daizi.kan[daizi.dai.indexOf(r)]);
        break;
      case 'jpnb':
        instStr = iStr.replace(/ン([ヤユヨアイウエオ])/g, 'ン\'$1');
        instStr = instStr.replace(kun1, r => kunre[kun1arr.indexOf(r)][1]);
        instStr = instStr.replace(/ッ([kstnhmyrgzjpbd])/g, '$1$1').replace(/ッ/g, '\'');
        instStr = instStr.replace(/o[uo]/g, 'ô').replace(/uu/g, 'û').replace(/ii/g, 'î');
        instStr = instStr.replace(/([aiueo])ー/g, (r, r1) => 'âîûêô'['aiueo'.indexOf(r1)]);
        oStr = instStr;
        break;
      case 'jpnc':
        instStr = iStr.replace(/ン([ヤユヨアイウエオ])/g, 'ン\'$1');
        instStr = instStr.replace(heb1, r => hebon[heb1arr.indexOf(r)][1]);
        instStr = instStr.replace(/n([bmp])/g, 'm$1');
        instStr = instStr.replace(/ッch/g, 'tch').replace(/ッ([kstnhmyrgzjpbd])/g, '$1$1').replace(/ッ/g, '\'');
        instStr = instStr.replace(/ー/g, '').replace(/o[uo]/g, 'o').replace(/uu/g, 'u').replace(/ii/g, 'i');
        oStr = instStr;
        break;
      case 'jpnd':
        instStr = iStr.replace(/[nm]([^aiueoyw])/g, 'ン$1');
        instStr = iStr.replace(/([kstnhmyrgzjpbd])\1/g, 'ッ$1');
        instStr = instStr.replace(kanaromaReg, r => kanaroma[kanaromaArr.indexOf(r)][1]);
        oStr = instStr;
        break;
      // CJK Characters
      case 'tocjk1':
        oStr = iStr.replace(findWordN, r => escape(cjkWord[findWordNArr.indexOf(r)][0]));
        oStr = oStr.replace(findN, r => {
          instArr = findNArr.arrIndex(r);
          if (instArr.length === 1) {
            if (findKArr[instArr[0]].length === 1) {
              instStr = findKArr[instArr[0]];
            } else {
              instStr = `(${dupDelete(findKArr[instArr[0]]).split('').join('|')})`;
            }
          } else {
            instStr2 = '';
            for (let i = 0; i < instArr.length; i += 1) {
              instStr2 += findKArr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if (instStr2.length > 1) instStr = `(${instStr2.split('').join('|')})`;
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk2':
        oStr = iStr.replace(findWordN, r => escape(cjkWord[findWordNArr.indexOf(r)][1]));
        oStr = oStr.replace(findN, r => {
          instArr = findNArr.arrIndex(r);
          if (instArr.length === 1) {
            if (findHArr[instArr[0]].length === 1) {
              instStr = findHArr[instArr[0]];
            } else {
              instStr = `(${dupDelete(findHArr[instArr[0]]).split('').join('|')})`;
            }
          } else {
            instStr2 = '';
            for (let i = 0; i < instArr.length; i += 1) {
              instStr2 += findHArr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if (instStr2.length > 1) instStr = `(${instStr2.split('').join('|')})`;
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk3':
        oStr = iStr.replace(findWordK, r => escape(cjkWord[findWordKArr.indexOf(r)][2]));
        oStr = oStr.replace(findK, r => {
          instArr = findKArr.arrIndex(r);
          if (instArr.length === 1) {
            if (findNArr[instArr[0]].length === 1) {
              instStr = findNArr[instArr[0]];
            } else {
              instStr = `(${dupDelete(findNArr[instArr[0]]).split('').join('|')})`;
            }
          } else {
            instStr2 = '';
            for (let i = 0; i < instArr.length; i += 1) {
              instStr2 += findNArr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if (instStr2.length > 1) instStr = `(${instStr2.split('').join('|')})`;
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk4':
        oStr = iStr.replace(findWordH, r => escape(cjkWord[findWordHArr.indexOf(r)][2]));
        oStr = oStr.replace(findH, r => {
          instArr = findHArr.arrIndex(r);
          if (instArr.length === 1) {
            if (findNArr[instArr[0]].length === 1) {
              instStr = findNArr[instArr[0]];
            } else {
              instStr = `(${dupDelete(findNArr[instArr[0]]).split('').join('|')})`;
            }
          } else {
            instStr2 = '';
            for (let i = 0; i < instArr.length; i += 1) {
              instStr2 += findNArr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if (instStr2.length > 1) instStr = `(${instStr2.split('').join('|')})`;
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk5':
        oStr = iStr.replace(findWordK, r => escape(cjkWord[findWordKArr.indexOf(r)][1]));
        oStr = oStr.replace(findK, r => {
          instArr = findKArr.arrIndex(r);
          if (instArr.length === 1) {
            if (findHArr[instArr[0]].length === 1) {
              instStr = findHArr[instArr[0]];
            } else {
              instStr = `(${dupDelete(findHArr[instArr[0]]).split('').join('|')})`;
            }
          } else {
            instStr2 = '';
            for (let i = 0; i < instArr.length; i += 1) {
              instStr2 += findHArr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if (instStr2.length > 1) instStr = `(${instStr2.split('').join('|')})`;
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk6':
        oStr = iStr.replace(findWordH, r => escape(cjkWord[findWordHArr.indexOf(r)][1]));
        oStr = oStr.replace(findH, r => {
          instArr = findHArr.arrIndex(r);
          if (instArr.length === 1) {
            if (findKArr[instArr[0]].length === 1) {
              instStr = findKArr[instArr[0]];
            } else {
              instStr = `(${dupDelete(findKArr[instArr[0]]).split('').join('|')})`;
            }
          } else {
            instStr2 = '';
            for (let i = 0; i < instArr.length; i += 1) {
              instStr2 += findKArr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if (instStr2.length > 1) instStr = `(${instStr2.split('').join('|')})`;
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk7':
        instStr = escape(iStr).replace(pin, (r, r1) => ((r1 in pinyin) ? `${r}[${pinyin[r1]}]` : r));
        oStr = unescape(instStr);
        break;
      // skt
      case 'skt1':
        oStr = iStr.replace(sktS, r => {
          instStr = r.replace(sktAddA, '$1a');
          instStr = instStr.replace(sktS2, s => {
            [[[instStr2]]] = sanskrit.filter(t => (t[2].indexOf(s) !== -1));
            return instStr2;
          });
          instStr = instStr.replace(/-/g, '');
          return instStr;
        });
        break;
      case 'skt2':
        oStr = iStr.replace(sktS, r => {
          instStr = r.replace(sktAddA, '$1a');
          instStr = instStr.replace(sktS2, s => {
            [[, [instStr2]]] = sanskrit.filter(t => (t[2].indexOf(s) !== -1));
            return instStr2;
          });
          instStr = instStr.replace(/-/g, '');
          return instStr;
        });
        break;
      case 'skt3':
        oStr = iStr.replace(sktH, r => {
          flg = true;
          instStr = r.replace(sktH2, s => {
            [[, , instArr]] = sanskrit.filter(t => (t[0].indexOf(s) !== -1));
            instStr2 = (flg && instArr.length === 2) ? instArr[1] : instArr[0];
            flg = false;
            return instStr2;
          });
          instStr = instStr.replace(sktAddVirama, '$1्');
          instStr = instStr.replace(sktRemoveA, '$1');
          return instStr;
        });
        break;
      case 'skt4':
        oStr = iStr.replace(sktH, r => {
          instStr = r.replace(sktH2, s => {
            [[, [instStr2]]] = sanskrit.filter(t => (t[0].indexOf(s) !== -1));
            return instStr2;
          });
          return instStr;
        });
        break;
      case 'skt5':
        oStr = iStr.replace(sktI, r => {
          flg = true;
          instStr = r.toLowerCase();
          instStr = instStr.replace(sktI2, s => {
            [[, , instArr]] = sanskrit.filter(t => (t[1].indexOf(s) !== -1));
            instStr2 = (flg && instArr.length === 2) ? instArr[1] : instArr[0];
            flg = false;
            return instStr2;
          });
          instStr = instStr.replace(sktAddVirama, '$1्');
          instStr = instStr.replace(sktRemoveA, '$1');
          return instStr;
        });
        break;
      case 'skt6':
        oStr = iStr.replace(sktI, r => {
          instStr = r.toLowerCase();
          instStr = instStr.replace(sktI2, s => {
            [[[instStr2]]] = sanskrit.filter(t => (t[1].indexOf(s) !== -1));
            return instStr2;
          });
          return instStr;
        });
        break;
      /* StrMakeing */
      // repeat
      case 'repeat': {
        const
          rpStr = $('#rp_string').val(),
          rpTm = parseInt($('#rp_time').val(), 10),
          rpJn = $('#rp_join').val().replace(/\\n/g, '\n'),
          rpOf = $('#rp_of').prop('checked'),
          rpReg = $('#rp_reg').val(),
          rpJnReg = new RegExp(rpJn, 'g');

        instArr2 = iStr.split(rpJnReg);
        let rpLength = rpTm <= instArr2.length ? instArr2.length : rpTm;
        rpLength = !rpOf ? instArr2.length : rpLength;
        for (let i = 0; i < rpLength; i += 1) {
          instStr2 = '';
          if (rpTm > i) {
            instStr2 += `___1___${rpStr}___1___`;
          } else {
            instStr2 += '___1______1___';
          }
          if (instArr2.length > i) {
            instStr2 += `___2___${instArr2[i]}___2___`;
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, rpReg);
          instStr += instStr2 + rpJn;
        }
        oStr = instStr;
        break;
      }
      // numbering
      case 'numbering': {
        const
          mxSt = parseFloat($('#mx_start').val()),
          mxEd = parseFloat($('#mx_end').val()),
          mxSp = parseFloat($('#mx_step').val()),
          mxPd = parseInt($('#mx_padding').val(), 10),
          mxJn = $('#mx_join').val().replace(/\\n/g, '\n'),
          mxReg = $('#mx_reg').val(),
          mxOf = $('#mx_of').prop('checked'),
          mxJnReg = new RegExp(mxJn, 'g'),
          pd = Array(mxPd + 1).join('0'),
          mop = 10000;
        let
          instM = 0;

        if (mxSt > mxEd && mxSp > 0) {
          break;
        } else if (mxSp === 0 || mxSt === mxEd) {
          break;
        } else if (mxSt < mxEd && mxSp < 0) {
          break;
        }
        instArr = [];
        instStr = '';
        instStr2 = '';
        let
          padZeroLength = 0,
          padZero = '';
        if (Math.abs(mxSp) % 1 !== 0) {
          padZeroLength = Math.abs(mxSp).toString().length - 2;
          padZero = Array(padZeroLength + 1).join('0');
        }
        if (mxSt < mxEd) {
          for (let i = mxSt; i <= mxEd; i = Math.round((i + mxSp) * mop, 2) / mop) {
            instArr.push(i);
          }
        } else {
          for (let i = mxSt; i >= mxEd; i = Math.round((i + mxSp) * mop, 2) / mop) {
            instArr.push(i);
          }
        }
        instArr2 = iStr.split(mxJnReg);
        let
          mxLengthN = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        mxLengthN = !mxOf ? instArr2.length : mxLengthN;
        for (let j = 0; j < mxLengthN; j += 1) {
          instStr2 = '';
          if (instArr.length > j) {
            instStr3 = Math.floor(Math.abs(instArr[j]));
            if (instStr3.toString(10).length <= mxPd) {
              instStr3 = (pd + instStr3).slice(-mxPd);
            }
            if (instArr[j] < 0) {
              instStr3 = `-${instStr3}`;
            }
            if (Math.abs(mxSp) % 1 !== 0) {
              instM = Math.round((instArr[j] % 1) * mop) / mop;
              instM = instM ? instM.toString(10).split('.')[1] : 0;
              instM = (instM + padZero).substr(0, padZeroLength);
              instStr3 = `${instStr3}.${instM}`;
            }
            instStr2 += `___1___${instStr3}___1___`;
          } else {
            instStr2 += '___1______1___';
          }
          if (instArr2.length > j) {
            instStr2 += `___2___${instArr2[j]}___2___`;
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, mxReg);
          instStr += instStr2 + mxJn;
        }
        oStr = instStr;
        break;
      }
      // numbering16
      case 'numbering16': {
        const
          mx16St = parseInt(`0x${$('#mx16_start').val()}`, 16),
          mx16Ed = parseInt(`0x${$('#mx16_end').val()}`, 16),
          mx16Sp = parseInt(`0x${$('#mx16_step').val()}`, 16),
          mx16Pd = parseInt($('#mx16_padding').val(), 10),
          mx16Jn = $('#mx16_join').val().replace(/\\n/g, '\n'),
          mx16Reg = $('#mx16_reg').val(),
          mx16Of = $('#mx16_of').prop('checked'),
          mx16JnReg = new RegExp(mx16Jn, 'g'),
          pd16 = Array(mx16Pd + 1).join('0');
        if (mx16St > mx16Ed && mx16Sp > 0) {
          break;
        } else if (mx16Sp === 0 || mx16St === mx16Ed) {
          break;
        } else if (mx16St < mx16Ed && mx16Sp < 0) {
          break;
        }
        instArr = [];
        instStr = '';
        instStr2 = '';

        if (mx16St < mx16Ed) {
          for (let i = mx16St; i <= mx16Ed; i += mx16Sp) {
            instArr.push(i);
          }
        } else {
          let i = mx16St;
          while (i >= mx16Ed) {
            instArr.push(i);
            i += mx16Sp;
          }
        }
        instArr2 = iStr.split(mx16JnReg);
        let
          mxLengthN2 = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        mxLengthN2 = !mx16Of ? instArr2.length : mxLengthN2;
        for (let j = 0; j < mxLengthN2; j += 1) {
          instStr2 = '';
          if (instArr.length > j) {
            instStr3 = Math.floor(Math.abs(instArr[j]));
            if (instStr3.toString(16).length <= mx16Pd) {
              instStr3 = (pd16 + instStr3.toString(16)).slice(-mx16Pd);
            } else {
              instStr3 = instStr3.toString(16);
            }
            if (instArr[j] < 0) {
              instStr3 = `-${instStr3}`;
            }
            instStr2 += `___1___${instStr3}___1___`;
          } else {
            instStr2 += '___1______1___';
          }
          if (instArr2.length > j) {
            instStr2 += `___2___${instArr2[j]}___2___`;
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, mx16Reg);
          instStr += instStr2 + mx16Jn;
        }
        oStr = instStr;
        break;
      }
      // dating
      case 'dating': {
        const
          dtSt = new Date($('#dt_start').val()),
          dtEd = new Date($('#dt_end').val()),
          dtSp = parseInt($('#dt_step').val(), 10) * 60 * 60 * 24 * 1000,
          dtJn = $('#dt_join').val().replace(/\\n/g, '\n'),
          dtOf = $('#dt_of').prop('checked'),
          dtReg = $('#dt_reg').val(),
          dtReg2 = $('#dt_reg2').val(),
          dtJnReg = new RegExp(dtJn, 'g');
        let
          YYYY,
          YY,
          MM,
          M,
          DD,
          D,
          d,
          d1,
          d2,
          d3,
          d4,
          d5,
          m1,
          m2,
          m3,
          m4,
          dateTypeAll = {};
        const
          dtStTime = dtSt.getTime(),
          dtEdTime = dtEd.getTime();
        instArr = [];
        if (dtSp < 0) {
          let x = dtStTime;
          while (x >= dtEdTime) {
            instArr.push(x);
            x += dtSp;
          }
        } else if (dtSp > 0) {
          for (let x = dtStTime; x <= dtEdTime; x += dtSp) {
            instArr.push(x);
          }
        }
        instArr2 = iStr.split(dtJnReg);
        let
          dtLengthN3 = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        dtLengthN3 = !dtOf ? instArr2.length : dtLengthN3;
        for (let j = 0; j < dtLengthN3; j += 1) {
          instStr2 = '';
          if (instArr.length > j) {
            const
              nDate = new Date(instArr[j]);
            YYYY = nDate.getFullYear();
            YY = YYYY.toString(10).slice(-2);
            M = nDate.getMonth() + 1;
            MM = `0${M}`.slice(-2);
            D = nDate.getDate();
            DD = `0${D}`.slice(-2);
            d = nDate.getDay();
            [d1, d2, d3, d4, d5] = DayArr[d];
            [m1, m2, m3, m4] = MonthArr[M - 1];
            dateTypeAll = {
              YYYY,
              YY,
              MM,
              M,
              DD,
              D,
              d1,
              d2,
              d3,
              d4,
              d5,
              m1,
              m2,
              m3,
              m4
            };
            instStr3 = dtReg;
            const
              dateTypeReg = new RegExp(`(${Object.keys(dateTypeAll).join('|')})`, 'g');
            instStr3 = instStr3.replace(dateTypeReg, (r, r1) => dateTypeAll[r1]);

            instStr2 += `___1___${instStr3}___1___`;
          } else {
            instStr2 += '___1______1___';
          }
          if (instArr2.length > j) {
            instStr2 += `___2___${instArr2[j]}___2___`;
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, dtReg2);
          instStr += instStr2 + dtJn;
        }
        oStr = instStr;
        break;
      }
      // listing
      case 'listing': {
        const
          rzType = serialData[$('[name=rz_type]').val()],
          rzSp = parseInt($('#rz_step').val(), 10),
          rzAm = parseInt($('#rz_amount').val(), 10),
          rzJn = $('#rz_join').val().replace(/\\n/g, '\n'),
          rzOf = $('#rz_of').prop('checked'),
          rzReg = $('#rz_reg').val(),
          rzJnReg = new RegExp(rzJn, 'g');
        instArr = [];
        for (let i = 0; i < rzSp * rzAm; i += rzSp) {
          instArr.push(rzType[i % rzType.length]);
        }
        instArr2 = iStr.split(rzJnReg);
        let
          rzLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        rzLength = !rzOf ? instArr2.length : rzLength;
        for (let j = 0; j < rzLength; j += 1) {
          instStr2 = '';
          if (instArr.length > j) {
            instStr2 += `___1___${instArr[j]}___1___`;
          } else {
            instStr2 += '___1______1___';
          }
          if (instArr2.length > j) {
            instStr2 += `___2___${instArr2[j]}___2___`;
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, rzReg);
          instStr += instStr2 + rzJn;
        }
        oStr = instStr;
        break;
      }
      // accent
      case 'accent':
        oStr = iStr + $('#alphaDisp').text();
        $('#alphaDisp').html('');
        $('#accent').modal('hide');
        break;
      // ligature
      case 'ligature':
        oStr = iStr + $('#ligatDisp').text();
        $('#ligatDisp').html('');
        $('#ligat').modal('hide');
        break;
      // pinyin
      case 'pinyin2':
        oStr = iStr + $('#pyinDisp').text();
        $('#pyinDisp').html('');
        $('#pyin').modal('hide');
        break;
      // uni2
      case 'uni2':
        oStr = iStr + $('#uniDisp').text();
        $('#uniDisp').html('');
        $('#uni').modal('hide');
        break;
      // other
      case 'copy':
        instStr = $opt.val();
        copyClip(instStr);
        break;
      case 'move':
        iStr = $opt.val();
        oStr = '';
        break;
      case 'undo':
        if (histArr.length > 1) {
          lastArr = histArr.getArrLast();
          iStr = lastArr.ipt;
          oStr = lastArr.opt;
          $ipt.val(iStr);
          $opt.val(oStr);
          histArr.pop();
        }
        break;
      case 'delete':
        $ipt.val('');
        $opt.val('');
        histArr = [
          {
            ipt: '',
            opt: ''
          }
        ];
        break;
      case 'change':
        iStr = $ipt.val();
        oStr = $opt.val();
        $ipt.val(oStr);
        $opt.val(iStr);
        break;
      default:
        break;
    }
    if (ival !== 'undo' && ival !== 'copy' && ival !== 'delete' && ival !== 'change') {
      if (tmpFlg) {
        iStr = beforeStr + iStr + endStr;
        oStr = beforeStr + oStr + endStr;
        $ipt.focus();
        $ipt.get(0).setSelectionRange(tmp.start, tmp.end);
      }
      output(iStr, oStr);
    }
  });
  output($ipt.val(), $opt.val());

  // タブ操作
  const
    $ctGroupRd = $('[name = ctGroupRd]'),
    $tabBtn = $('.ctLabel').children('.btn');
  $ctGroupRd.on('change', () => {
    const ival = $ctGroupRd.filter(':checked').attr('id');
    $tabBtn.addClass('btn-info').removeClass('btn-primary');
    $tabBtn.filter(`[for=${ival}]`).addClass('btn-primary').removeClass('btn-info');
  });
  if ($ctGroupRd.filter(':checked').length === 0) {
    $tabBtn.eq(0).click();
  } else {
    $ctGroupRd.change();
  }

  // ヘルプリンク
  const
    $helpModal = $('#help'),
    iconArr = {
      COPY: '<i class="fa fa-clipboard"></i>',
      DELETE: '<i class="glyphicon glyphicon-remove"></i>',
      UNDO: '<i class="glyphicon glyphicon-undo"></i>',
      MOVE: '<i class="glyphicon glyphicon-chevron-left"></i>',
      REPLACE: '<i class="fa fa-exchange"></i>',
      help: '<i class="fa fa-question-circle"></i>',
      settings: '<i class="glyphicon glyphicon-cog" aria-hidden="true"></i>'
    };
  let
    tex,
    vid;
  $('.info').find('h4').each(function (r) {
    tex = $(this).text();
    vid = `help_${r + 1}`;
    $(this).attr({ id: vid });
    $(`[data-target="${tex}"]`).attr('data-href', vid);
  });
  $('.info').find('strong').each(function () {
    const keyText = $(this).text();
    if (keyText in iconArr) {
      $(this).html(`${iconArr[keyText]} ${keyText}`);
    }
  });
  $('.linkHelp').on('click', function () {
    vid = $(this).attr('data-href');
    $helpModal.modal('show');
    $helpModal.one('shown.bs.modal', () => {
      window.location.hash = vid;
    });
  });
  $helpModal.on('click', () => {
    $helpModal.modal('hide');
  }).on('hidden.bs.modal', () => {
    window.location.hash = 'header';
  });

  // settings
  const
    $settings = $('#settings'),
    $pts = $('#text-i,#text-o');
  $settings.find('input').on('change', function () {
    const
      tName = $(this).attr('name'),
      $target = $(`[name=${tName}]:checked`),
      tVal = $target.val();
    if (tName === 'areaHeight') {
      $pts.removeClass('s m l');
      $pts.addClass(tVal);
    } else {
      $pts.css(tName, tVal);
    }
  });
  $settings.find('[name=font-size]').trigger('change');
  $settings.find('[name=font-family]').trigger('change');
  $settings.find('[name=areaHeight]').trigger('change');

  // IME
  const
    $btnAlphaGroup = $('.btn-group-alpha'),
    $btnAlphaControl = $btnAlphaGroup.find('.btn-control'),
    $btnAlpha = $btnAlphaGroup.find('.btn-alpha'),
    $alphaOpt = $('#alpha_opt'),
    $alphaDisp = $('#alphaDisp'),
    cassArr = ['toUpperCase', 'toLowerCase'];
  let
    alphaCase = 0,
    alphaVal;

  $btnAlphaControl.on('click', () => {
    $btnAlpha.each(function () {
      const
        str = $(this).val(),
        str2 = str[cassArr[alphaCase]]();
      $(this).text(str2);
      $(this).val(str2);
    });
    alphaCase = (alphaCase + 1) % 2;
  });
  $btnAlpha.on('click', function () {
    alphaVal = $(this).val();
    let alphaArr = latinVariety2[alphaVal.toLowerCase()];
    alphaArr = alphaArr.map(n => n.charAt(alphaCase));
    $alphaOpt.html('');
    for (let i = 0; i < alphaArr.length; i += 1) {
      $alphaOpt.append(`<button class="btn btn-primary" type="button" value="${alphaArr[i]}">${alphaArr[i]}</button>`);
    }
  });
  $alphaOpt.on('click', '.btn', function () {
    $alphaDisp.append($(this).val());
  });

  const
    $btnLigatGroup = $('.btn-group-ligat'),
    $btnLigat = $btnLigatGroup.find('.btn-ligat'),
    $ligatOpt = $('#ligat_opt'),
    $ligatDisp = $('#ligatDisp');
  $btnLigat.on('click', function () {
    const ligatVal = $(this).val();
    $ligatOpt.html('');
    for (let i = 0; i < latinVariety3[ligatVal].length; i += 1) {
      $ligatOpt.append(`<button class="btn btn-primary" type="button" value="${latinVariety3[ligatVal][i]}">${latinVariety3[ligatVal][i]}</button>`);
    }
  });
  $ligatOpt.on('click', '.btn', function () {
    $ligatDisp.append($(this).val());
  });

  const
    $btnPyinGroup = $('.btn-group-pyin'),
    $btnPyin = $btnPyinGroup.find('.btn-pyin'),
    $pyinOpt = $('#pyin_opt'),
    $pyinOpt2 = $('#pyin_opt2'),
    $pyinDisp = $('#pyinDisp');
  let
    nowParentAlpha = '';
  $btnPyin.on('click', function () {
    const pyinVal = $(this).val();
    $pyinOpt.html('');
    nowParentAlpha = pyinVal;
    Object.keys(pinyin2[pyinVal]).forEach(r => $pyinOpt.append(`<button class="btn btn-primary" type="button" value="${r}">${r}</button>`));
  });
  $pyinOpt.on('click', '.btn', function () {
    const
      pyinVal2 = $(this).val();
    let
      pyinStr = '';
    $pyinOpt2.html('');
    for (let i = 0; i < pinyin2[nowParentAlpha][pyinVal2].length; i += 1) {
      pyinStr = `&#x${pinyin2[nowParentAlpha][pyinVal2][i]};`;
      $pyinOpt2.append(`<button class="btn btn-primary" type="button" value="${pyinStr}">${pyinStr}</button>`);
    }
  });
  $pyinOpt2.on('click', '.btn', function () {
    $pyinDisp.append($(this).val());
  });

  const
    $uniSelect = $('#uniSelect'),
    $uniDisp = $('#uniDisp'),
    $uniOpt = $('#uni_opt');
  $uniSelect.on('change', function () {
    const iVal = $(this).val();
    if (iVal !== '') {
      $uniOpt.html('');
      const
        uniSt = parseInt(`0x${iVal.split('-')[0]}`, 16),
        uniEd = parseInt(`0x${iVal.split('-')[1]}`, 16);
      let
        uniHex = '0000',
        uniStr = '';
      for (let i = uniSt; i <= uniEd; i += 1) {
        uniHex = (`000${i.toString(16)}`).slice(-4).toUpperCase();
        if (i === 0 || i % 16 === 0) {
          $uniOpt.append(`<label class="btn btn-default">${uniHex.slice(0, 2)}<br>${uniHex.slice(-2)}</label>`);
        }
        uniStr = `&#x${uniHex};`;
        $uniOpt.append(`<button class="btn btn-primary" type="button" value="${uniStr}">${uniStr}</button>`);
      }
    }
  });
  $uniOpt.on('click', '.btn', function () {
    $uniDisp.append($(this).val());
  });
});

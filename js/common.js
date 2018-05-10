/*
  eslint
    no-undef: 0,
    indent: [2, 2, { "SwitchCase": 1 }],
    linebreak-style: 0,
    no-irregular-whitespace: ["error", { "skipRegExps": true }]
*/
$(function() {
  const
    $ipt = $('#text-i'),
    $opt = $('#text-o'),
    $bt = $('.bt-control');

  let
    histArr = [{'ipt':'', 'opt':''}],
    instArr, lastArr,
    tmp, tmpFlg = false;

  Array.prototype.getArrLast = function(){ return this[this.length -1];};
  Array.prototype.arrIndex = function(r){
    instArr = [];
    for(let i = 0; i < this.length; i++) {
      if(this[i].indexOf(r) !== -1) instArr.push(i);
    }
    return instArr;
  };

  const
    // 出力処理
    output = (iStr, oStr) => {
      lastArr = histArr.getArrLast();
      if(lastArr.opt !== oStr){
        instArr = {'ipt':iStr, 'opt':oStr};
        histArr.push(instArr);
        $ipt.val(iStr);
        $opt.val(oStr);

        if($('.automove').prop('checked')){
          instArr = {'ipt':$opt.val(), 'opt':''};
          $ipt.val($opt.val());
          $opt.val('');
          histArr.push(instArr);
        }
        $('#lengthDisp').html('ch/li: ' + $ipt.val().length + '/' + $ipt.val().split(/\n/).length + '&gt;' + $opt.val().length + '/' + $opt.val().split(/\n/).length);
      } else {
        $opt.val(oStr);
      }
      return this;
    },
    toRoman = function(r, num){
      return romanTh[r].replace(/(.)/g, n => num[parseInt(n, 10)]);
    },
    dupDelete = function(str){
      return str.split('').filter((x, i, self) => self.indexOf(x) === i).join('');
    },
    // クリップボードコピー用
    $forCopyElm = $('#forCopy'),
    copyClip = str => {
      $forCopyElm.val(str);
      $forCopyElm.select();
      return document.execCommand('copy');
    };

  // 部分選択用
  $ipt.on('mouseup touchend keyup', e => {
    let
      elm = e.currentTarget,
      $selDisp = $('#selDisp');
    if(elm.selectionStart === elm.selectionEnd){
      tmpFlg = false;
      $selDisp.text('');
    } else {
      tmpFlg = true;
      tmp = { 'start':elm.selectionStart, 'end':elm.selectionEnd };
      $selDisp.text('(select:' + (tmp.end - tmp.start) + ' characters)');
    }
  });

  // 変換処理
  $bt.on('click', e => {
    let
      ival = $(e.currentTarget).val(),
      iStr = $ipt.val(),
      instArr = '', instArr2 = '', instArr3 = '', pathArr = [],
      instStr = '', instStr2 = '', instStr3 = '', instNum = 0,
      oStr = '', find = '', flg = 'g', hi, lo, pathStep = 0,
      beforeStr = '', endStr = '',
      int, fract, seisuu = '', shousuu = '';
    instArr = [];

    if(tmpFlg){
      beforeStr = iStr.slice(0, tmp.start);
      endStr = iStr.slice(tmp.end);
      iStr = iStr.slice(tmp.start, tmp.end);
    }
    switch(ival){
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
        oStr = iStr.replace(/(\w+)([A-Z])(?=(\w+))/g, (r, r1, r2) => r1 + '-' + r2.toLowerCase());
        break;
      case 'case-hyphenToCamel':
        oStr = iStr.replace(/(\w+)-(\w)(?=(\w+))/g, (r, r1, r2) => r1 + r2.toUpperCase());
        break;
      case 'case-latinNomalize':
        oStr = iStr.replace(latin, r => {
          instStr = latinVariety.filter(s => (s[1].join('').indexOf(r) !== -1))[0][0];
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
        oStr = escape(iStr).replace(/%(\w{2,2})/gi,'&#x00$1;').replace(/%u(\w{4,5})/gi,'&#x$1;');
        break;
      case 'uniH-escapeL':
        oStr = iStr.replace(/(.)/g, r => '&#x' + (String(r)).charCodeAt(0).toString(16) + ';');
        break;
      case 'uniH-unescape':
        instStr = iStr.replace(chara, (r, r1) => charaMap[r1]);
        instStr = instStr.replace(/&#(\d{4,5});/g, (r, r1) => '%u' + (parseInt(r1, 10)).toString(16));
        instStr = instStr.replace(/(&#\x)([\da-f]{2,2};)/g, '$1' +'00' +'$2');
        instStr = instStr.replace(/(&#\x)([\da-f]{3,3};)/g, '$1' +'0' +'$2');
        instStr = instStr.replace(/&#\x([\da-f]{4,5});/g, '%u$1');
        oStr = unescape(instStr);
        break;
      case 'uni-escapeForHtml':
        oStr = iStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        break;
      case 'uni-utf32to16':
        oStr = iStr.replace(/(&#x|%u)([12][\da-f]{4,4})(;{0,1})/gi, (r, r1, r2, r3) => {
          instNum = parseInt(r2, 16);
          hi = ((instNum - 0x10000) / 0x400)|0 + 0xD800;
          lo = (instNum - 0x10000) % 0x400 + 0xDC00;
          return r1 + hi.toString(16) + r3 + r1 + lo.toString(16) + r3;
        });
        break;
      case 'uni-utf16to32': {
        instReg = new RegExp('(&#x|%u)(d[89a-f][0-9a-f]{2,2})(;{0,1})(&#x|%u)(d[c-f][0-9a-f]{2,2})(;{0,1})', 'gi');
        oStr = iStr.replace(instReg, (r, r1, r2, r3, r4, r5) => {
          hi = parseInt(r2, 16);
          lo = parseInt(r5, 16);
          instNum = 0x10000 + (hi - 0xD800) * 0x400 + (lo - 0xDC00);
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
        $('.extract_reg:checked').each(function(){
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
        $('.extract_reg:checked').each(function(){
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
        oStr = iStr.replace(/[\t 　]+/gm,' ');
        oStr = oStr.replace(/^[\t 　]/gm,'');
        oStr = oStr.replace(/[\t 　]\n/gm,'\n');
        break;
      case 'margin':
        oStr = iStr.replace(/\r\n/g, '\n');
        oStr = oStr.replace(/^[\t 　]+$/gm,'');
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
        for(let i = iStr.length - 1; i >= 0; i--) instStr += iStr.charAt(i);
        oStr = instStr;
        break;
      case 'rev-line':
        instArr = iStr.replace(/\r\n/g, '\n').split(/\n/);
        for(let i = instArr.length - 1; i >= 0; i--) instStr += instArr[i] + '\n';
        oStr = instStr;
        break;
      case 'rev-line2':
        instArr = iStr.replace(/\r\n/g, '\n').split(/\n/);
        for(let i = 0; i < instArr.length; i++){
          instStr += instArr[i].split('').reverse().join('') + '\n';
        }
        oStr = instStr;
        break;
      case 'rev-word':
        instArr = iStr.replace(/\r\n/g, '\n').replace(/(\s)/g, '||||$1||||').split('||||');
        for(let i = instArr.length - 1; i >= 0; i--) instStr += instArr[i];
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
      case 'matrix-change':
        var trans = a => Object.keys(a[0]).map(c => a.map(r => r[c]));
        instArr = iStr.replace(/\r\n/g, '\n').split('\n');
        splitter = ($('.matrix:checked').val()).replace('\\t', '\t').replace('\\,',',');
        instArr2 = [];
        instArr = instArr.map(r => r.split(new RegExp(splitter, 'g')));
        instStr = trans(instArr).map(r => r.join(splitter)).join('\n');
        oStr = instStr;
        break;
      // Tidy
      case 'tidy': {
        let
          td_am = parseInt($('#td_amount').val(), 10),
          td_reg = new RegExp('(.{' + td_am + ',' + td_am + '})', 'g');
        instStr = iStr.replace(/[\n\r]/g, '');
        instStr = instStr.replace(td_reg, '$1\n');
        oStr = instStr;
        break;
      }
      case 'tidy2': {
        let
          td2_reg = $('#td2_reg').val().replace(/\\\\/g, '\\'),
          td2_reg2 = new RegExp('(.)(' + td2_reg + ')', 'g');
        instStr = iStr.replace(/[\n\r]/g, '');
        instStr = instStr.replace(td2_reg2, '$1\n$2');
        oStr = instStr;
        break;
      }
      case 'tidy3': {
        let
          td3_cb = Object.values($('.tidy3_cb').filter(':checked').map((index, elm) => $(elm).val()).get()).join(''),
          td3_cb_1 = td3_cb.replace(/[「（]/g, ''),
          td3_cb_2 = td3_cb.replace(/[^「（]/g, ''),
          td3_reg_1 = new RegExp('([' + td3_cb_1 + '])', 'g');
        instStr = iStr.replace(/[\n\r]/g, '');
        instStr = instStr.replace(td3_reg_1, '$1\n');
        if(td3_cb_2 !== ''){
          let
            td3_reg_2 = new RegExp('([' + td3_cb_2 + '])', 'g');
          instStr = instStr.replace(td3_reg_2, '\n$1');
          instStr = instStr.replace(/([。、.,])(\n)([」）])/g, '$1$3');
          instStr = instStr.replace(/([。、.,])(\n\n)([「（])/g, '$1\n$3');
        }
        oStr = instStr;
        break;
      }
      case 'tree': {
        instArr = iStr.replace(/\r/g, '').split(/\n/g).map(n => n.split(/\//g));
        instArr2 = {};
        let inst_i;
        for(let i = 0; i < instArr.length; i++){
          inst_i = instArr[i];
          if(inst_i.join('/').slice(-1) === '/'){
            continue;
          }
          for(let j = 0; j < inst_i.length; j++){
            if(!j){
              if(!(inst_i[j] in instArr2)){
                instArr2[inst_i[j]] = {};
              }
              pathArr = instArr2[inst_i[j]];
            } else {
              if(!(inst_i[j] in pathArr)){
                pathArr[inst_i[j]] = {};
              }
              pathArr = pathArr[inst_i[j]];
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
        for(let i = 0; i < instArr.length; i++){
          if(instArr[i].slice(-1) === '/'){
            instStr3 = instArr[i].split('/')[0];
            if(instArr2[i] > pathStep - 1 || pathStep === 0){
              pathArr.push(instStr3);
            } else if(instArr2[i] <= pathStep - 1){
              pathArr = pathArr.slice(0, instArr2[i]);
              pathArr.push(instStr3);
            }
            pathStep = pathArr.length;
          } else if( instArr[i] !== '' ){
            instStr += pathArr.join('/') + '/' + instArr[i] + '\n';
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
          instStr2 = instStr2.replace(/([^"]+)($|".*?[^//]")/g, (s,s1,s2) => {
            return s1.replace(/[^{}[\]:,]/g, '').replace(/([[\]{},])/g, '$1$1$1') + s2;
          });
          instStr2 = instStr2.replace(/":([^ ])/g, '": $1');
          instStr2 = instStr2.replace(/([{[,]{3})/g, '$1\n');
          instStr2 = instStr2.replace(/([}\]]{3})/g, '\n$1');
          instArr = instStr2.split(/\n/g);
          jsonTab = 0;
          for(let i = 0; i < instArr.length; i++){
            if(/[\]}]{3}/.test(instArr[i])) jsonTab--;
            instArr[i] = Array(jsonTab+1).join('\t') + instArr[i];
            if(/[[{]{3}/.test(instArr[i])) jsonTab++;
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
        flg = $('#caps').prop('checked') ? 'g' :'gi';
        find = new RegExp($('#rep_find').val(), flg);
        instStr2 = $('#rep_rep').val();
        instStr2 = instStr2.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
        oStr = iStr.replace(find, instStr2);
        break;
      // merge
      case 'merge1':
        oStr = iStr + '\n' + $opt.val();
        break;
      case 'merge2':
        instArr = iStr.split(/\n/g);
        instArr2 = $opt.val().split(/\n/g);
        mxLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        for(let i = 0; i < mxLength; i++){
          if(instArr[i]){
            instStr += instArr[i];
          }
          if(instArr2[i]){
            instStr += instArr2[i];
          }
          instStr += '\n';
        }
        oStr = instStr;
        break;
      case 'merge3':
        instArr = iStr.split('');
        instArr2 = $opt.val().split('');
        mxLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        for(let i = 0; i < mxLength; i++){
          if(instArr[i]){
            instStr += instArr[i];
          }
          if(instArr2[i]){
            instStr += instArr2[i];
          }
        }
        oStr = instStr;
        break;
      case 'merge4':
        instArr = $ipt.val().split('');
        instArr2 = $opt.val().split('');
        instArr3 = [];
        for(let i = 0; i < instArr.length; i++){
          for(let j = 0; j < instArr2.length; j++){
            if(instArr[i] == instArr2[j]){
              instArr3.push(instArr[i]);
              break;
            }
          }
        }
        instArr = instArr.filter(r=>(instArr3.indexOf(r) === -1));
        instArr2 = instArr2.filter(r=>(instArr3.indexOf(r) === -1));
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
          for(let i = int.length - 1; i >= 0; i--){
            seisuu += zero2nine[parseInt(int[int.length - i - 1], 10)];
            if(i % 4 === 0){
              seisuu += suffices[(i / 4) | 0];
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
          if(seisuu === '') seisuu = zero;
          if(fract) shousuu = point + fract.replace(/(.)/g, n => zero2nine[parseInt(n, 10)]);
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
        let k_10_1 = new RegExp('(([零点〇一二三四五六七八九十百千万億兆京垓穣溝澗正載極]|\uD855\uDF71|恒河沙|阿僧祇|那由他|不可思議|無量大数)+)', 'gu');
        oStr = iStr.replace(k_10_1, r => {
          k_10_2 = new RegExp('(\uD855\uDF71|\u25771)', 'gu');
          instStr = r.replace(k_10_2, '禾予');
          int = instStr.split('点')[0];
          fract = instStr.split('点')[1];
          let now_keta;
          if(int === '零'){
            seisuu = '0';
          } else {
            instArr = int.split(/([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/);
            for(let i = 0; i < instArr.length; i++){
              if(instArr[i].match(/([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/) !== null){
                now_keta = suffices.indexOf(RegExp.$1);
                if(instArr[i + 2] !== suffices[now_keta - 1] && now_keta > 1) instArr.splice(i + 1, 0, '〇千〇百〇十〇', suffices[now_keta - 1]);
              } else {
                instArr[i] = instArr[i].replace(/([十百千]|^)([十百千])/g, '$1一$2');
                if(instArr[i].indexOf('千') === -1) instArr[i] = '〇千' + instArr[i];
                if(instArr[i].indexOf('百') === -1) instArr[i] = instArr[i].slice(0, 2) + '〇百' + instArr[i].slice(2, instArr[i].length);
                if(instArr[i].indexOf('十') === -1) instArr[i] = instArr[i].slice(0, 4) + '〇十' + instArr[i].slice(4, instArr[i].length);
                if(instArr[i].charAt(instArr[i].length - 1) === '十') instArr[i] = instArr[i] + '〇';
              }
            }
            seisuu = instArr.join('').replace(/([十百千万億兆京垓穣禾予溝澗正載極恒河沙阿僧祇那由他不可思議無量大数])/g, '');
            seisuu = seisuu.replace(/(.)/g, n => zero2nine.indexOf(n));
            seisuu = seisuu.replace(/^0+/g, '');
          }
          if(fract) shousuu += '.' + fract.replace(/(.)/g, n => zero2nine.indexOf(n));
          return seisuu + shousuu;
        });
        break;
      }
      case 'num-a_r':
        oStr = iStr.replace(/(\d[\d.,]+|\d+)/g, n => {
          instNum = parseInt(n.replace(/,/g, '').split('.')[0]);
          rom = '';
          if(instNum < 1 || instNum > 399999) {
            return instNum;
          } else if(instNum > 3999 && $('.roman_class:checked').val() === 'M') {
            return instNum;
          } else {
            if(instNum >= 100000){
              instStr = (instNum / 100000) | 0;
              rom += Array(instStr + 1).join(roman[5]);
              instNum -= instStr * 100000;
            }
            if(instNum >= 10000){
              instStr = (instNum / 10000) | 0;
              rom += toRoman(instStr - 1, roman[4]);
              instNum -= instStr * 10000;
            }
            if(instNum >= 1000){
              instStr = (instNum / 1000) | 0;
              rom += toRoman(instStr - 1, roman[3]);
              instNum -= instStr * 1000;
            }
            if(instNum >= 100){
              instStr = (instNum / 100) | 0;
              rom += toRoman(instStr - 1, roman[2]);
              instNum -= instStr * 100;
            }
            if(instNum >= 10){
              instStr = (instNum / 10) | 0;
              rom += toRoman(instStr - 1, roman[1]);
              instNum -= instStr * 10;
            }
            if(instNum !== 0){
              rom += toRoman(instNum - 1, roman[0]);
            }
            romanConv = new RegExp('[' + romanStr_base.join('') + ']', 'g');
            if($('.roman_class:checked').val() === 'C1'){
              rom = rom.replace(romanConv, n => romanStr1[romanStr_base.indexOf(n)]);
            } else if($('.roman_class:checked').val() === 'C2'){
              rom = rom.replace(romanConv, n => romanStr2[romanStr_base.indexOf(n)]);
            }
            return rom;
          }
        });
        break;
      case 'num-r_a':
        oStr = iStr.replace(findR, n => {
          instStr = n.replace(/[ↀↁↂↇↈ]/g, s => romanStr_base[romanStr1.indexOf(s)]);
          instNum = 0;
          instStr = instStr.replace(findR2, r => romanUni[r]);
          instStr = instStr.replace(/CCCIↃↃↃ/g ,'Z').replace(/IↃↃↃ/g ,'F').replace(/CCIↃↃ/g ,'W').replace(/IↃↃ/g ,'P').replace(/CIↃ/g ,'M');
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
        oStr = iStr.replace(kana1, r => kanaMap[kana1_arr.indexOf(r)][1]).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');
        break;
      case 'jpn4':
        oStr = iStr.replace(kana2, r => kanaMap[kana2_arr.indexOf(r)][0]);
        break;
      case 'jpn5':
        oStr = iStr.replace(alpha1, r => kanaAlpha[alpha1_arr.indexOf(r)][1]).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');
        break;
      case 'jpn6':
        oStr = iStr.replace(alpha2, r => kanaAlpha[alpha2_arr.indexOf(r)][0]);
        break;
      case 'jpn7':
        instStr = iStr.replace(cjk1, r => shin2kyu[cjk1_arr.indexOf(r)][1]);
        oStr = instStr;
        break;
      case 'jpn7b':
        instStr = iStr.replace(cjk1, r => shin2kyu[cjk1_arr.indexOf(r)][1]);
        instStr = instStr.replace(shinSp1, r => unescape(shinSpBase[shinSp1_arr.indexOf(r)][1]));
        oStr = instStr;
        break;
      case 'jpn8':
        instStr = iStr.replace(cjk2, r => shin2kyu[cjk2_arr.indexOf(r)][0]);
        instStr = instStr.replace(cjk1add, r => kyu2shinAdd[cjk1add_arr.indexOf(r)][1]);
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
        instStr = instStr.replace(kun1, r => kunre[kun1_arr.indexOf(r)][1]);
        instStr = instStr.replace(/ッ([kstnhmyrgzjpbd])/g, '$1$1').replace(/ッ/g, '\'');
        instStr = instStr.replace(/o[uo]/g, 'ô').replace(/uu/g, 'û').replace(/ii/g, 'î');
        instStr = instStr.replace(/([aiueo])ー/g, (r, r1) => 'âîûêô'['aiueo'.indexOf(r1)]);
        oStr = instStr;
        break;
      case 'jpnc':
        instStr = iStr.replace(/ン([ヤユヨアイウエオ])/g, 'ン\'$1');
        instStr = instStr.replace(heb1, r => hebon[heb1_arr.indexOf(r)][1]);
        instStr = instStr.replace(/n([bmp])/g, 'm$1');
        instStr = instStr.replace(/ッch/g, 'tch').replace(/ッ([kstnhmyrgzjpbd])/g, '$1$1').replace(/ッ/g, '\'');
        instStr = instStr.replace(/ー/g, '').replace(/o[uo]/g, 'o').replace(/uu/g, 'u').replace(/ii/g, 'i');
        oStr = instStr;
        break;
      case 'jpnd':
        instStr = iStr.replace(/[nm]([^aiueoyw])/g, 'ン$1');
        instStr = iStr.replace(/([kstnhmyrgzjpbd])\1/g, 'ッ$1');
        instStr = instStr.replace(kanaroma_reg, r => kanaroma[kanaroma_arr.indexOf(r)][1]);
        oStr = instStr;
        break;
      // CJK Characters
      case 'tocjk1':
        oStr = iStr.replace(findWordN, r => escape(cjk_word[findWordN_arr.indexOf(r)][0]));
        oStr = oStr.replace(findN, r => {
          instArr = findN_arr.arrIndex(r);
          if(instArr.length === 1){
            if(findK_arr[instArr[0]].length === 1){
              instStr = findK_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete(findK_arr[instArr[0]]).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for(let i = 0; i < instArr.length; i++) {
              instStr2 += findK_arr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if(instStr2.length > 1) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk2':
        oStr = iStr.replace(findWordN, r => escape(cjk_word[findWordN_arr.indexOf(r)][1]));
        oStr = oStr.replace(findN, r => {
          instArr = findN_arr.arrIndex(r);
          if(instArr.length === 1){
            if(findH_arr[instArr[0]].length === 1){
              instStr = findH_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete(findH_arr[instArr[0]]).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for(let i = 0; i < instArr.length; i++) {
              instStr2 += findH_arr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if(instStr2.length > 1) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk3':
        oStr = iStr.replace(findWordK, r => escape(cjk_word[findWordK_arr.indexOf(r)][2]));
        oStr = oStr.replace(findK, r => {
          instArr = findK_arr.arrIndex(r);
          if(instArr.length === 1){
            if(findN_arr[instArr[0]].length === 1){
              instStr = findN_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete(findN_arr[instArr[0]]).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for(let i = 0; i < instArr.length; i++) {
              instStr2 += findN_arr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if(instStr2.length > 1) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk4':
        oStr = iStr.replace(findWordH, r => escape(cjk_word[findWordH_arr.indexOf(r)][2]));
        oStr = oStr.replace(findH, r => {
          instArr = findH_arr.arrIndex(r);
          if(instArr.length === 1){
            if(findN_arr[instArr[0]].length === 1){
              instStr = findN_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete(findN_arr[instArr[0]]).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for(let i = 0; i < instArr.length; i++) {
              instStr2 += findN_arr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if(instStr2.length > 1) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk5':
        oStr = iStr.replace(findWordK, r => escape(cjk_word[findWordK_arr.indexOf(r)][1]));
        oStr = oStr.replace(findK, r => {
          instArr = findK_arr.arrIndex(r);
          if(instArr.length === 1){
            if(findH_arr[instArr[0]].length === 1){
              instStr = findH_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete(findH_arr[instArr[0]]).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for(let i = 0; i < instArr.length; i++) {
              instStr2 += findH_arr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if(instStr2.length > 1) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk6':
        oStr = iStr.replace(findWordH, r => escape(cjk_word[findWordH_arr.indexOf(r)][1]));
        oStr = oStr.replace(findH, r => {
          instArr = findH_arr.arrIndex(r);
          if(instArr.length === 1){
            if(findK_arr[instArr[0]].length === 1){
              instStr = findK_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete(findK_arr[instArr[0]]).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for(let i = 0; i < instArr.length; i++) {
              instStr2 += findK_arr[instArr[i]];
            }
            instStr2 = dupDelete(instStr2);
            if(instStr2.length > 1) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape(oStr);
        break;
      case 'tocjk7':
        instStr = escape(iStr).replace(pin, (r, r1) => (r1 in pinyin) ? ( r + '[' + pinyin[r1] + ']') : r);
        oStr = unescape(instStr);
        break;
      // skt
      case 'skt1':
        oStr = iStr.replace(skt_s, r => {
          instStr = r.replace(skt_add_a, '$1a');
          instStr = instStr.replace(skt_s2, s => {
            instStr2 = sanskrit.filter(t => (t[2].indexOf(s) !== -1))[0][0][0];
            return instStr2;
          });
          instStr = instStr.replace(/-/g, '');
          return instStr;
        });
        break;
      case 'skt2':
        oStr = iStr.replace(skt_s, r => {
          instStr = r.replace(skt_add_a, '$1a');
          instStr = instStr.replace(skt_s2, s => {
            instStr2 = sanskrit.filter(t => (t[2].indexOf(s) !== -1))[0][1][0];
            return instStr2;
          });
          instStr = instStr.replace(/-/g, '');
          return instStr;
        });
        break;
      case 'skt3':
        oStr = iStr.replace(skt_h, r => {
          flg = true;
          instStr = r.replace(skt_h2, s => {
            instArr = sanskrit.filter(t => (t[0].indexOf(s) !== -1))[0][2];
            instStr2 = (flg && instArr.length === 2) ? instArr[1] : instArr[0];
            flg = false;
            return instStr2;
          });
          instStr = instStr.replace(skt_add_virama, '$1्');
          instStr = instStr.replace(skt_remove_a, '$1');
          return instStr;
        });
        break;
      case 'skt4':
        oStr = iStr.replace(skt_h, r => {
          instStr = r.replace(skt_h2, s => {
            instStr2 =sanskrit.filter(t => (t[0].indexOf(s) !== -1))[0][1][0];
            return instStr2;
          });
          return instStr;
        });
        break;
      case 'skt5':
        oStr = iStr.replace(skt_i, r => {
          flg = true;
          instStr = r.toLowerCase();
          instStr = instStr.replace(skt_i2, s => {
            instArr = sanskrit.filter(t => (t[1].indexOf(s) !== -1))[0][2];
            instStr2 = (flg && instArr.length === 2) ? instArr[1] : instArr[0];
            flg = false;
            return instStr2;
          });
          instStr = instStr.replace(skt_add_virama, '$1्');
          instStr = instStr.replace(skt_remove_a, '$1');
          return instStr;
        });
        break;
      case 'skt6':
        oStr = iStr.replace(skt_i, r => {
          instStr = r.toLowerCase();
          instStr = instStr.replace(skt_i2, s => {
            instStr2 = sanskrit.filter(t => (t[1].indexOf(s) !== -1))[0][0][0];
            return instStr2;
          });
          return instStr;
        });
        break;
      /* StrMakeing */
      // repeat
      case 'repeat': {
        let
          rp_str = $('#rp_string').val(),
          rp_tm = parseInt($('#rp_time').val(), 10),
          rp_jn = $('#rp_join').val().replace(/\\n/g, '\n'),
          rp_of = $('#rp_of').prop('checked'),
          rp_reg = $('#rp_reg').val(),
          rp_jnReg = new RegExp(rp_jn, 'g');
        instArr2 = iStr.split(rp_jnReg);
        rpLength = rp_tm <= instArr2.length ? instArr2.length : rp_tm;
        rpLength = !rp_of ? instArr2.length : rpLength;
        for(let i = 0; i < rpLength; i++){
          instStr2 = '';
          if(rp_tm > i){
            instStr2 += '___1___' + rp_str + '___1___';
          } else {
            instStr2 += '___1______1___';
          }
          if(instArr2.length > i){
            instStr2 += '___2___' + instArr2[i] + '___2___';
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, rp_reg);
          instStr += instStr2 + rp_jn;
        }
        oStr = instStr;
        break;
      }
      // numbering
      case 'numbering': {
        let
          mx_st = parseFloat($('#mx_start').val()),
          mx_ed = parseFloat($('#mx_end').val()),
          mx_sp = parseFloat($('#mx_step').val()),
          mx_pd = parseInt($('#mx_padding').val()),
          mx_jn = $('#mx_join').val().replace(/\\n/g, '\n'),
          mx_reg = $('#mx_reg').val(),
          mx_of = $('#mx_of').prop('checked'),
          mx_jnReg = new RegExp(mx_jn, 'g'),
          pd = Array(mx_pd + 1).join('0'),
          mop = 10000,
          inst_m = 0;
        if(mx_st > mx_ed && mx_sp > 0){
          break;
        } else if(mx_sp === 0 || mx_st === mx_ed){
          break;
        } else if(mx_st < mx_ed && mx_sp < 0){
          break;
        }
        instArr = [];
        instStr = '';
        instStr2 = '';

        padZeroLength = 0;
        padZero = '';
        if(Math.abs(mx_sp) % 1 !== 0){
          padZeroLength = Math.abs(mx_sp).toString().length-2;
          padZero = Array(padZeroLength + 1).join('0');
        }
        if(mx_st < mx_ed){
          for(let i = mx_st; i <= mx_ed; i = Math.round((i + mx_sp) * mop, 2) / mop) {
            instArr.push(i);
          }
        } else {
          for(let i = mx_st; i >= mx_ed; i = Math.round((i + mx_sp) * mop, 2) / mop) {
            instArr.push(i);
          }
        }
        instArr2 = iStr.split(mx_jnReg);
        mxLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        mxLength = !mx_of ? instArr2.length : mxLength;
        for(let j = 0; j < mxLength; j++){
          instStr2 = '';
          if(instArr.length > j){
            instStr3 = Math.abs(instArr[j]) | 0;
            if(instStr3.toString(10).length <= mx_pd){
              instStr3 = (pd + instStr3).slice(-mx_pd);
            }
            if(instArr[j] < 0){
              instStr3 = '-' + instStr3;
            }
            if(Math.abs(mx_sp) % 1 !== 0){
              inst_m = Math.round((instArr[j] % 1) * mop) / mop;
              inst_m = inst_m ? inst_m.toString(10).split('.')[1] : 0;
              inst_m = (inst_m + padZero).substr(0, padZeroLength);
              instStr3 = instStr3 + '.' + inst_m;
            }
            instStr2 += '___1___' + instStr3 + '___1___';
          } else {
            instStr2 += '___1______1___';
          }
          if(instArr2.length > j){
            instStr2 += '___2___' + instArr2[j] + '___2___';
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, mx_reg);
          instStr += instStr2 + mx_jn;
        }
        oStr = instStr;
        break;
      }
      // numbering16
      case 'numbering16': {
        let
          mx16_st = parseInt('0x' + $('#mx16_start').val(), 16),
          mx16_ed = parseInt('0x' + $('#mx16_end').val(), 16),
          mx16_sp = parseInt('0x' + $('#mx16_step').val(), 16),
          mx16_pd = parseInt($('#mx16_padding').val(), 10),
          mx16_jn = $('#mx16_join').val().replace(/\\n/g, '\n'),
          mx16_reg = $('#mx16_reg').val(),
          mx16_of = $('#mx16_of').prop('checked'),
          mx16_jnReg = new RegExp(mx16_jn, 'g'),
          pd16 = Array(mx16_pd + 1).join('0');
        if(mx16_st > mx16_ed && mx16_sp > 0){
          break;
        } else if(mx16_sp === 0 || mx16_st === mx16_ed){
          break;
        } else if(mx16_st < mx16_ed && mx16_sp < 0){
          break;
        }
        instArr = [];
        instStr = '';
        instStr2 = '';

        if(mx16_st < mx16_ed){
          for(let i = mx16_st; i <= mx16_ed; i += mx16_sp) {
            instArr.push(i);
          }
        } else {
          for(let i = mx16_st; i >= mx16_ed; i += mx16_sp) {
            instArr.push(i);
          }
        }
        instArr2 = iStr.split(mx16_jnReg);
        mxLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        mxLength = !mx16_of ? instArr2.length : mxLength;
        for(let j = 0; j < mxLength; j++){
          instStr2 = '';
          if(instArr.length > j){
            instStr3 = Math.abs(instArr[j]) | 0;
            if(instStr3.toString(16).length <= mx16_pd){
              instStr3 = (pd16 + instStr3.toString(16)).slice(-mx16_pd);
            } else {
              instStr3 = instStr3.toString(16);
            }
            if(instArr[j] < 0){
              instStr3 = '-' + instStr3;
            }
            instStr2 += '___1___' + instStr3 + '___1___';
          } else {
            instStr2 += '___1______1___';
          }
          if(instArr2.length > j){
            instStr2 += '___2___' + instArr2[j] + '___2___';
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, mx16_reg);
          instStr += instStr2 + mx16_jn;
        }
        oStr = instStr;
        break;
      }
      // dating
      case 'dating': {
        let
          dt_st = new Date($('#dt_start').val()),
          dt_ed = new Date($('#dt_end').val()),
          dt_sp = parseInt($('#dt_step').val(), 10) * 60 * 60 * 24 * 1000,
          dt_jn = $('#dt_join').val().replace(/\\n/g, '\n'),
          dt_of = $('#dt_of').prop('checked'),
          dt_reg = $('#dt_reg').val(),
          dt_reg2 = $('#dt_reg2').val(),
          dt_jnReg = new RegExp(dt_jn, 'g'),
          YYYY, YY, MM, M, DD, D, d, d1, d2, d3, d4, d5, m1, m2, m3, m4,
          dateTypeAll = {};
        instArr = [];
        dt_st = dt_st.getTime();
        dt_ed = dt_ed.getTime();
        if(dt_sp < 0){
          for(let x = dt_st; x >= dt_ed; x = x + dt_sp) {
            instArr.push(x);
          }
        } else if(dt_sp > 0){
          for(let x = dt_st; x <= dt_ed; x = x + dt_sp) {
            instArr.push(x);
          }
        }
        instArr2 = iStr.split(dt_jnReg);
        dtLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        dtLength = !dt_of ? instArr2.length : dtLength;
        for(let j = 0; j < dtLength; j++){
          instStr2 = '';
          if(instArr.length > j){
            nDate = new Date(instArr[j]);
            YYYY = nDate.getFullYear();
            YY = YYYY.toString(10).slice(-2);
            M = nDate.getMonth() + 1;
            MM = ('0' + M).slice(-2);
            D = nDate.getDate();
            DD = ('0' + D).slice(-2);
            d = nDate.getDay();
            d1 = DayArr[d][0];
            d2 = DayArr[d][1];
            d3 = DayArr[d][2];
            d4 = DayArr[d][3];
            d5 = DayArr[d][4];
            m1 = MonthArr[M-1][0];
            m2 = MonthArr[M-1][1];
            m3 = MonthArr[M-1][2];
            m4 = MonthArr[M-1][3];
            dateTypeAll = {'YYYY': YYYY,'YY': YY,'MM': MM,'M': M,'DD': DD,'D': D,'d1': d1,'d2': d2,'d3': d3,'d4': d4,'d5': d5,'m1': m1,'m2': m2,'m3': m3,'m4': m4};
            instStr3 = dt_reg;
            dateTypeReg = new RegExp('(' + Object.keys(dateTypeAll).join('|') + ')', 'g');
            instStr3 = instStr3.replace(dateTypeReg, (r, r1) => dateTypeAll[r1]);

            instStr2 += '___1___' + instStr3 + '___1___';
          } else {
            instStr2 += '___1______1___';
          }
          if(instArr2.length > j){
            instStr2 += '___2___' + instArr2[j] + '___2___';
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, dt_reg2);
          instStr += instStr2 + dt_jn;
        }
        oStr = instStr;
        break;
      }
      // listing
      case 'listing': {
        let
          rz_type = serialData[$('[name=rz_type]').val()],
          rz_sp = parseInt($('#rz_step').val(), 10),
          rz_am = parseInt($('#rz_amount').val(), 10),
          rz_jn = $('#rz_join').val().replace(/\\n/g, '\n'),
          rz_of = $('#rz_of').prop('checked'),
          rz_reg = $('#rz_reg').val(),
          rz_jnReg = new RegExp(rz_jn, 'g');
        instArr = [];
        for(let i = 0; i < rz_sp * rz_am; i = i + rz_sp){
          instArr.push(rz_type[i % rz_type.length]);
        }
        instArr2 = iStr.split(rz_jnReg);
        rzLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        rzLength = !rz_of ? instArr2.length : rzLength;
        for(let j = 0; j < rzLength; j++){
          instStr2 = '';
          if(instArr.length > j){
            instStr2 += '___1___' + instArr[j] + '___1___';
          } else {
            instStr2 += '___1______1___';
          }
          if(instArr2.length > j){
            instStr2 += '___2___' + instArr2[j] + '___2___';
          } else {
            instStr2 += '___2______2___';
          }
          instStr2 = instStr2.replace(/___1___(.*?)___1______2___(.*?)___2___/g, rz_reg);
          instStr += instStr2 + rz_jn;
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
        if(histArr.length > 1){
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
            'ipt':'',
            'opt':''
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
    if(ival !== 'undo' && ival !== 'copy' && ival !== 'delete' && ival !== 'change'){
      if(tmpFlg){
        iStr = beforeStr + iStr + endStr;
        oStr = beforeStr + oStr + endStr;
        $ipt.focus();
        $ipt.get(0).setSelectionRange(tmp.start, tmp.end);
      }
      output(iStr, oStr);
    }
  });
  output($ipt.val(),$opt.val());

  // タブ操作
  let
    $ctGroupRd = $('[name = ctGroupRd]'),
    $tabBtn = $('.ctLabel').children('.btn');
  $ctGroupRd.on('change', function(){
    var ival = $ctGroupRd.filter(':checked').attr('id');
    $tabBtn.addClass('btn-info').removeClass('btn-primary');
    $tabBtn.filter('[for=' + ival + ']').addClass('btn-primary').removeClass('btn-info');
  });
  if($ctGroupRd.filter(':checked').length === 0){
    $tabBtn.eq(0).click();
  } else {
    $ctGroupRd.change();
  }

  // ヘルプリンク
  let
    $helpModal = $('#help'),
    iconArr = {
      'COPY': '<i class="fa fa-clipboard"></i>',
      'DELETE': '<i class="glyphicon glyphicon-remove"></i>',
      'UNDO': '<i class="glyphicon glyphicon-undo"></i>',
      'MOVE': '<i class="glyphicon glyphicon-chevron-left"></i>',
      'REPLACE': '<i class="fa fa-exchange"></i>',
      'help': '<i class="fa fa-question-circle"></i>',
      'settings': '<i class="glyphicon glyphicon-cog" aria-hidden="true"></i>'
    },
    tex, vid;
  $('.info').find('h4').each(function(r){
    tex = $(this).text();
    vid = 'help_' + (r + 1);
    $(this).attr({
      'id': vid
    });
    $('[data-target="' + tex + '"]').attr('data-href', vid);
  });
  $('.info').find('strong').each(function(){
    let keyText = $(this).text();
    if( keyText in iconArr ){
      $(this).html(iconArr[keyText] + ' ' + keyText);
    }
  });
  $('.linkHelp').on('click', function(){
    vid = $(this).attr('data-href');
    $helpModal.modal('show');
    $helpModal.one('shown.bs.modal', function(){
      location.hash = vid;
    });
  });
  $helpModal.on('click', function(){
    $helpModal.modal('hide');
  }).on('hidden.bs.modal', function(){
    location.hash = 'header';
  });

  // settings
  let
    $settings = $('#settings'),
    $pts = $('#text-i,#text-o');
  $settings.find('input').on('change', function(){
    let
      tName = $(this).attr('name'),
      $target = $('[name=' + tName + ']:checked'),
      tVal = $target.val();
    if(tName === 'areaHeight'){
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
  let
    $btnAlphaGroup = $('.btn-group-alpha'),
    $btnAlphaControl = $btnAlphaGroup.find('.btn-control'),
    $btnAlpha = $btnAlphaGroup.find('.btn-alpha'),
    $alphaOpt = $('#alpha_opt'),
    $alphaDisp = $('#alphaDisp'),
    alphaCase = 0,
    cassArr = ['toUpperCase','toLowerCase'],
    alphaVal;
  $btnAlphaControl.on('click', function(){
    $btnAlpha.each(function(){
      let
        str = $(this).val(),
        str2 = str[cassArr[alphaCase]]();
      $(this).text(str2);
      $(this).val(str2);
    });
    alphaCase = ~alphaCase & 1;
  });
  $btnAlpha.on('click', function(){
    alphaVal = $(this).val();
    let alphaArr = latinVariety2[alphaVal.toLowerCase()];
    alphaArr = alphaArr.map(n => n.charAt(alphaCase));
    $alphaOpt.html('');
    for(let i = 0; i < alphaArr.length; i++){
      $alphaOpt.append('<button class="btn btn-primary" type="button" value="' + alphaArr[i] + '">' + alphaArr[i] + '</button>');
    }
  });
  $alphaOpt.on('click', '.btn', function(){
    $alphaDisp.append($(this).val());
  });

  let
    $btnLigatGroup = $('.btn-group-ligat'),
    $btnLigat = $btnLigatGroup.find('.btn-ligat'),
    $ligatOpt = $('#ligat_opt'),
    $ligatDisp = $('#ligatDisp');
  $btnLigat.on('click', function(){
    let ligatVal = $(this).val();
    $ligatOpt.html('');
    for(let i = 0; i < latinVariety3[ligatVal].length; i++){
      $ligatOpt.append('<button class="btn btn-primary" type="button" value="' + latinVariety3[ligatVal][i] + '">' + latinVariety3[ligatVal][i] + '</button>');
    }
  });
  $ligatOpt.on('click', '.btn', function(){
    $ligatDisp.append($(this).val());
  });

  let
    $btnPyinGroup = $('.btn-group-pyin'),
    $btnPyin = $btnPyinGroup.find('.btn-pyin'),
    $pyinOpt = $('#pyin_opt'),
    $pyinOpt2 = $('#pyin_opt2'),
    $pyinDisp = $('#pyinDisp'),
    nowParentAlpha = '';
  $btnPyin.on('click', function(){
    let pyinVal = $(this).val();
    $pyinOpt.html('');
    nowParentAlpha = pyinVal;
    for(let key in pinyin2[pyinVal]){
      $pyinOpt.append('<button class="btn btn-primary" type="button" value="' + key + '">' + key + '</button>');
    }
  });
  $pyinOpt.on('click', '.btn', function(){
    let
      pyinVal2 = $(this).val(),
      pyinStr = '';
    $pyinOpt2.html('');
    for(let i = 0; i < pinyin2[nowParentAlpha][pyinVal2].length; i++){
      pyinStr = '&#x' + pinyin2[nowParentAlpha][pyinVal2][i] + ';';
      $pyinOpt2.append('<button class="btn btn-primary" type="button" value="' + pyinStr + '">' + pyinStr + '</button>');
    }
  });
  $pyinOpt2.on('click', '.btn', function(){
    $pyinDisp.append($(this).val());
  });

  let
    $uniSelect = $('#uniSelect'),
    $uniDisp = $('#uniDisp'),
    $uniOpt = $('#uni_opt');
  $uniSelect.on('change', function(){
    let iVal = $(this).val();
    if(iVal !==''){
      $uniOpt.html('');
      let
        uni_st = parseInt('0x' + iVal.split('-')[0], 16),
        uni_ed = parseInt('0x' + iVal.split('-')[1], 16),
        uni_hex = '0000',
        uni_str = '';
      for (let i = uni_st; i <= uni_ed; i++) {
        uni_hex = ('000' + i.toString(16)).slice(-4).toUpperCase();
        if( i === 0 || i % 16 === 0 ){
          $uniOpt.append('<label class="btn btn-default">' + uni_hex.slice(0,2) + '<br>' + uni_hex.slice(-2) + '</label>');
        }
        uni_str = '&#x' + uni_hex + ';';
        $uniOpt.append('<button class="btn btn-primary" type="button" value="' + uni_str + '">' + uni_str + '</button>');
      }
    }
  });
  $uniOpt.on('click', '.btn', function(){
    $uniDisp.append($(this).val());
  });

});
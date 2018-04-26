/*
 * pinyinを更新したとき、pinyin2を出力するためのjs
 */
let
  pinyinRe0 = '',
  pinyinRe1 = [],
  pinyinRe2 = {},
  pinyinRe3 = '',
  arr, str1, str2,
  $opt = document.getElementById('opt');

pinyinRe0 = JSON.stringify(pinyin_default);
pinyinRe0 = pinyinRe0.replace(/\{/g, '{\n').replace(/\}/g, '\n  },\n');
pinyinRe0 = 'const\n  pinyin = ' + pinyinRe0;
pinyinRe0 = pinyinRe0.replace(/("[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?","[^,]*?",)/g, '$1\n');
pinyinRe0 = pinyinRe0.replace(/\n"/g, '\n    "');
pinyinRe0 = pinyinRe0.replace(/"/g, '\'');
pinyinRe0 = pinyinRe0 + '  pin = new RegExp(\'\%u(3[4-9a-fA-F][0-9a-fA-F]{2}|[4-9][0-9a-fA-F]{3})\',\'g\'),\n'

//$opt.innerText = pinyinRe0;

for (let key in pinyin_default) {
  arr = pinyin_default[key].split('/');
  for(let i = 0; i < arr.length; i++){
    pinyinRe1.push([arr[i], key]);
  }
}
let diffArr = 'aāáǎàbcdeēéěèếễểềfghiīíǐìjklmḿnňoōóǒòpqrstuūúǔùüǖǘǚǜvwxyz';
diff = r => {
  ff = r.split('');
  ff = ff.map(t=>{
    return t.replace(/([āáǎàēéěèếễểềīíǐìōóǒòūúǔùüǖǘǚǜḿňa-z])/g,u=>{
      if(u==='y') document.title=('0'+diffArr.indexOf(u)).slice(-2);
      return ('0'+diffArr.indexOf(u)).slice(-2)
    });
  });
  ff = ff.join('');
  return ff;
};
pinyinRe1 = pinyinRe1.sort((a, b) => ((diff(a[0]) > diff(b[0])) - (diff(a[0]) < diff(b[0]))));

for(let i = 0; i < pinyinRe1.length; i++){
  str1 = pinyinRe1[i][0];
  if( /^[csz]h/.test(str1) ){
    str2 = str1.slice(0,2);
  } else {
    str2 = str1.charAt(0);
  }
  str2 = str2.replace(/[āáǎà]/g,'a').replace(/[ēéěèếễểề]/g,'e').replace(/[īíǐì]/g,'i').replace(/[ōóǒò]/g,'o').replace(/[ūúǔùǖǘǚǜ]/g,'u').replace(/ň/g,'n').replace(/ḿ/g, 'm');
  if(str1 !== '*'){
    if( !(str2 in pinyinRe2) ){
      pinyinRe2[str2] = {};
    }
    if( !(str1 in pinyinRe2[str2]) ){
      pinyinRe2[str2][str1] = [];
    }
    pinyinRe2[str2][str1].push(pinyinRe1[i][1]);
  }
}
pinyinRe3 = JSON.stringify(pinyinRe2);
pinyinRe3 = pinyinRe3.replace(/([{,])("[a-z]+"):\{/g, '$1\n    $2:{\n      ');
pinyinRe3 = pinyinRe3.replace(/\},/g, '\n    },');
pinyinRe3 = pinyinRe3.replace(/\],"/g, '],\n      "');
pinyinRe3 = '  pinyin2 = ' + pinyinRe3 + ';';
pinyinRe3 = pinyinRe3.replace(/\}\};/g, '\n    }\n  };');
pinyinRe3 = pinyinRe3.replace(/"/g, '\'');

$opt.innerText = pinyinRe0 + pinyinRe3;


/*
 * pinyinを更新したとき、pinyin2を出力するためのjs
 */
let
  pinyinRe1 = [],
  pinyinRe2 = {},
  arr, str1, str2;

for (let key in pinyin) {
  arr = pinyin[key].split('/');
  for(let i = 0; i < arr.length; i++){
    pinyinRe1.push([arr[i], key]);
  }
}
let diffArr = 'aāáǎàbcdeēéěèếễểềfghiīíǐìjklmnoōóǒòpqrstuūúǔùǖǘǚǜvwxyz';
diff = r => {
  ff = r.split('');
  ff = ff.map(t=>{
    return t.replace(/([āáǎàēéěèếễểềīíǐìōóǒòūúǔùǖǘǚǜa-z])/g,u=>{
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
  str2 = str2.replace(/[āáǎà]/g,'a').replace(/[ēéěèếễểề]/g,'e').replace(/[īíǐì]/g,'i').replace(/[ōóǒò]/g,'o').replace(/[ūúǔùǖǘǚǜ]/g,'u');
  if(str1 !== '*'){
    if( !(str2 in pinyinRe2) ){
      pinyinRe2[str2] = {};
    }
    if( !(str1 in pinyinRe2[str2]) ){
      pinyinRe2[str2][str1] = [];
    }
    pinyinRe2[str2][str1].push(pinyinRe1[i][1])
  }
}
console.log(pinyinRe2);

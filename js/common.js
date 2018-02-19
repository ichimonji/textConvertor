/*jshint esversion: 6 */

$(function() {
  const
    $ipt = $( '#text-i' ),
    $opt = $( '#text-o' ),
    $bt = $( '.bt-control' ),
    $genre = $( '.ct-set' ),
    $genreHead = $genre.find( '.head label' ),
    $genreBody = $genre.find( '.body' ),
    charaMap = {
      'quot':'\"','amp':'&','apos':'\'','lt':'<','gt':'>','nbsp':' ','iexcl':'¡','cent':'¢',
      'pound':'£','curren':'¤','yen':'¥','brvbar':'¦','sect':'§','uml':'¨','copy':'©','ordf':'ª',
      'laquo':'«','not':'¬','reg':'®','macr':'¯','deg':'°','plusmn':'±','sup2':'²','sup3':'³',
      'acute':'´','micro':'µ','para':'¶','middot':'·','cedil':'¸','sup1':'¹','ordm':'º','raquo':'»',
      'frac14':'¼','frac12':'½','frac34':'¾','iquest':'¿','Agrave':'À','Aacute':'Á','Acirc':'Â','Atilde':'Ã',
      'Auml':'Ä','Aring':'Å','AElig':'Æ','Ccedil':'Ç','Egrave':'È','Eacute':'É','Ecirc':'Ê','Euml':'Ë',
      'Igrave':'Ì','Iacute':'Í','Icirc':'Î','Iuml':'Ï','ETH':'Ð','Ntilde':'Ñ','Ograve':'Ò','Oacute':'Ó',
      'Ocirc':'Ô','Otilde':'Õ','Ouml':'Ö','times':'×','Oslash':'Ø','Ugrave':'Ù','Uacute':'Ú','Ucirc':'Û',
      'Uuml':'Ü','Yacute':'Ý','THORN':'Þ','szlig':'ß','agrave':'à','aacute':'á','acirc':'â','atilde':'ã',
      'auml':'ä','aring':'å','aelig':'æ','ccedil':'ç','egrave':'è','eacute':'é','ecirc':'ê','euml':'ë',
      'igrave':'ì','iacute':'í','icirc':'î','iuml':'ï','eth':'ð','ntilde':'ñ','ograve':'ò','oacute':'ó',
      'ocirc':'ô','otilde':'õ','ouml':'ö','divide':'÷','oslash':'ø','ugrave':'ù','uacute':'ú','ucirc':'û',
      'uuml':'ü','yacute':'ý','thorn':'þ','yuml':'ÿ','OElig':'Œ','oelig':'œ','Scaron':'Š','scaron':'š',
      'Yuml':'Ÿ','fnof':'ƒ','circ':'ˆ','tilde':'˜','Alpha':'Α','Beta':'Β','Gamma':'Γ','Delta':'Δ',
      'Epsilon':'Ε','Zeta':'Ζ','Eta':'Η','Theta':'Θ','Iota':'Ι','Kappa':'Κ','Lambda':'Λ','Mu':'Μ',
      'Nu':'Ν','Xi':'Ξ','Omicron':'Ο','Pi':'Π','Rho':'Ρ','Sigma':'Σ','Tau':'Τ','Upsilon':'Υ',
      'Phi':'Φ','Chi':'Χ','Psi':'Ψ','Omega':'Ω','alpha':'α','beta':'β','gamma':'γ','delta':'δ',
      'epsilon':'ε','zeta':'ζ','eta':'η','theta':'θ','iota':'ι','kappa':'κ','lambda':'λ','mu':'μ',
      'nu':'ν','xi':'ξ','omicron':'ο','pi':'π','rho':'ρ','sigmaf':'ς','sigma':'σ','tau':'τ',
      'upsilon':'υ','phi':'φ','chi':'χ','psi':'ψ','omega':'ω','thetasym':'ϑ','upsih':'ϒ','piv':'ϖ',
      'ndash':'–','mdash':'—','lsquo':'‘','rsquo':'’','sbquo':'‚','ldquo':'“','rdquo':'”','bdquo':'„',
      'dagger':'†','Dagger':'‡','bull':'•','hellip':'…','permil':'‰','prime':'′','Prime':'″','lsaquo':'‹',
      'rsaquo':'›','oline':'‾','frasl':'⁄','euro':'€','image':'ℑ','weierp':'℘','real':'ℜ','trade':'™',
      'alefsym':'ℵ','larr':'←','uarr':'↑','rarr':'→','darr':'↓','harr':'↔','crarr':'↵','lArr':'⇐',
      'uArr':'⇑','rArr':'⇒','dArr':'⇓','hArr':'⇔','forall':'∀','part':'∂','exist':'∃','empty':'∅',
      'nabla':'∇','isin':'∈','notin':'∉','ni':'∋','prod':'∏','sum':'∑','minus':'−','lowast':'∗',
      'radic':'√','prop':'∝','infin':'∞','ang':'∠','and':'∧','or':'∨','cap':'∩','cup':'∪',
      'int':'∫','there4':'∴','sim':'∼','cong':'≅','asymp':'≈','ne':'≠','equiv':'≡','le':'≤',
      'ge':'≥','sub':'⊂','sup':'⊃','nsub':'⊄','sube':'⊆','supe':'⊇','oplus':'⊕','otimes':'⊗',
      'perp':'⊥','sdot':'⋅','lceil':'⌈','rceil':'⌉','lfloor':'⌊','rfloor':'⌋','lang':'〈','rang':'〉',
      'loz':'◊','spades':'♠','clubs':'♣','hearts':'♥','diams':'♦'
    },
    chara = new RegExp( '&(' + Object.keys(charaMap).join('|') + ');','g' ),
    latinVariety = [
      [ 'a', ['àÀ','áÁ','âÂ','ãÃ','äÄ','åÅ','āĀ','ăĂ','ąĄ','ǎǍ','ǻǺ','ȁȀ','ȃȂ','ȧȦ','ạẠ','ảẢ','ấẤ','ầẦ','ẩẨ','ẫẪ','ậẬ','ắẮ','ằẰ','ẳẲ','ẵẴ','ặẶ','ḁḀ','ⱥȺ','ǡǠ','ǟǞ','ɑⱭ','ɐⱯ','ẚ','ᴀ','ɒ','ᶏ'] ],
      [ 'b', ['ƀɃ','ɓƁ','ƃƂ','ƅƄ','ḃḂ','ḅḄ','ḇḆ','ꞗꞖ','ᵬ','ᶀ'] ],
      [ 'c', ['çÇ','ćĆ','ĉĈ','ċĊ','čČ','ɔƆ','ƈƇ','ḉḈ','c̄C̄','ȼȻ','ɕ'] ],
      [ 'd', ['ðÐ','ďĎ','ɗƊ','ɖƉ','ƌƋ','ḋḊ','ḍḌ','ḏḎ','ḑḐ','ḓḒ','ȡ'] ],
      [ 'e', ['èÈ','éÉ','êÊ','ëË','ēĒ','ĕĔ','ėĖ','ęĘ','ěĚ','ǝƎ','əƏ','ȅȄ','ȇȆ','ȩȨ','ḕḔ','ḗḖ','ḙḘ','ḛḚ','ḝḜ','ẹẸ','ẻẺ','ẽẼ','ếẾ','ềỀ','ểỂ','ễỄ','ệỆ'] ],
      [ 'f', ['ḟḞ','ƒƑ'] ],
      [ 'g', ['ĝĜ','ğĞ','ġĠ','ģĢ','ǥǤ','ǧǦ','ǵǴ','ḡḠ','ɠƓ','ᶃ','ɢ'] ],
      [ 'h', ['ĥĤ','ħĦ','ȟȞ','ḣḢ','ḥḤ','ḧḦ','ḩḨ','ḫḪ','ⱨⱧ','ẖ','ɦ'] ],
      [ 'i', ['ìÌ','íÍ','îÎ','ïÏ','ĩĨ','īĪ','ĭĬ','įĮ','ıİ','ǐǏ','ȉȈ','ȋȊ','ḭḬ','ḯḮ','ỉỈ','ịỊ','ı','İ'] ],
      [ 'j', ['ĵĴ','ǰ'] ],
      [ 'k', ['ķĶ','ǩǨ','ḱḰ','ḳḲ','ḵḴ','ƙƘ'] ],
      [ 'l', ['ĺĹ','ļĻ','ľĽ','ŀĿ','łŁ','ḷḶ','ḹḸ','ḻḺ','ḽḼ'] ],
      [ 'm', ['ḿḾ','ṁṀ','ṃṂ','ᶆ'] ],
      [ 'n', ['ñÑ','ńŃ','ņŅ','ňŇ','ǹǸ','ṅṄ','ṇṆ','ṉṈ','ṋṊ','ɲƝ','ƞȠ','ᵰ','ᶇ','ɳ','ȵ','ɴ'] ],
      [ 'o', ['òÒ','óÓ','ôÔ','õÕ','öÖ','ōŌ','ŏŎ','őŐ','ǒǑ','ǫǪ','ǭǬ','ȍȌ','ȏȎ','ȫȪ','ȭȬ','ȯȮ','ȱȰ','ṍṌ','ṏṎ','ṑṐ','ṓṒ','ốỐ','ồỒ','ổỔ','ỗỖ','ộỘ','ớỚ','ờỜ','ởỞ','ỡỠ','ợỢ','ọỌ','ỏỎ','øØ','ǿǾ','ꝍꝌ'] ],
      [ 'p', ['ṕṔ','ṗṖ','ƥƤ','ꝑꝐ','ꝓꝒ'] ],
      [ 'q', ['ɋɊ','ʠ'] ],
      [ 'r', ['ŕŔ','ŗŖ','řŘ','ȑȐ','ȓȒ','ṙṘ','ṛṚ','ṝṜ','ṟṞ','ɍɌ','ɽⱤ','ᵲ','ᶉ','ɼ','ɾ','ᵳ','ʀ'] ],
      [ 's', ['śŚ','ŝŜ','şŞ','šŠ','șȘ','ṡṠ','ṣṢ','ṥṤ','ṧṦ','ṩṨ','ſ'] ],
      [ 't', ['ţŢ','ťŤ','ŧŦ','țȚ','ṫṪ','ṭṬ','ṯṮ','ṱṰ','ƭƬ','ẗ'] ],
      [ 'u', ['ùÙ','úÚ','ûÛ','üÜ','ũŨ','ūŪ','ŭŬ','ůŮ','űŰ','ųŲ','ǔǓ','ǖǕ','ǘǗ','ǚǙ','ǜǛ','ȕȔ','ȗȖ','ṳṲ','ṵṴ','ṷṶ','ṹṸ','ṻṺ','ụỤ','ủỦ','ứỨ','ừỪ','ửỬ','ữỮ','ựỰ','ʋƲ','Ưư','Ʉʉ','ᵾ','ᶙ','ᴜ'] ],
      [ 'v', ['ṽṼ','ṿṾ','ꝟꝞ'] ],
      [ 'w', ['ŵŴ','ẁẀ','ẃẂ','ẅẄ','ẇẆ','ẉẈ','ⱳⱲ','ẘ','Ɯ'] ],
      [ 'x', ['ẋẊ','ẍẌ'] ],
      [ 'y', ['ýÝ','ÿŸ','ŷŶ','ȳȲ','ẏẎ','ỳỲ','ỵỴ','ỷỶ','ỹỸ','ƴƳ','ẙ'] ],
      [ 'z', ['źŹ','żŻ','žŽ','ȥȤ','ẑẐ','ẓẒ','ẕẔ','ƶƵ','ⱬⱫ','ʒƷ','ƹƸ','ᵶ','ᶎ','ʐ','ʑ','ɀ','ᴢ','ƺ'] ],
      [ 'þ', ['þÞ'] ],
      [ 'ae', ['æÆ','ǣǢ','ǽǼ','ᴂᴁ','ᴭᵆ'] ],
      [ 'ao', ['ꜵꜴ'] ],
      [ 'au', ['ꜷꜶ'] ],
      [ 'av', ['ꜹꜸ','ꜻꜺ'] ],
      [ 'ay', ['ꜽꜼ'] ],
      [ 'db', ['ȸ'] ],
      [ 'dz', ['ǳǲǱ','ǆǅǄ'] ],
      [ 'ff', ['ﬀ'] ],
      [ 'ffi', ['ﬃ'] ],
      [ 'ffl', ['ﬄ'] ],
      [ 'fi', ['ﬁ'] ],
      [ 'fl', ['ﬂ'] ],
      [ 'ij', ['ĳĲ'] ],
      [ 'lj', ['ǉǈǇ'] ],
      [ 'ng', ['ŋŊ'] ],
      [ 'nj', ['ǌǋǊ'] ],
      [ 'oe', ['œŒ'] ],
      [ 'oo', ['ꝏꝎ'] ],
      [ 'ou', ['ȣȢ'] ],
      [ 'qp', ['ȹ'] ],
      [ 'st', ['ﬅ','ﬆ'] ],
      [ 'sz', ['ßẞ'] ],
      [ 'ue', ['ᵫ'] ],
      [ 'vy', ['ꝡꝠ'] ]
    ],
    latinArr = latinVariety.map( r => r[1].join('') ),
    latin = new RegExp( '[' + latinArr.join('') + ']','g' ),
    daizi = {
      'kan':['〇','一','二','三','四','五','六','七','八','九','十','百','千','万'],
      'dai':['零','壱','弐','参','肆','伍','陸','漆','捌','玖','拾','陌','阡','萬']
    },
    findDK = new RegExp( '([' + daizi.kan.join('') + '])','g' ),
    findDD = new RegExp( '([' + daizi.dai.join('') + '])','g' ),
    zero = '零',
    point = '点',
    zero2nine = ['〇','一','二','三','四','五','六','七','八','九'],
    ten2thou = ['','十','百','千'],
    suffices = ['','万','億','兆','京','垓','禾予','穣','溝','澗','正','載','極','恒河沙','阿僧祇','那由他','不可思議','無量大数'],//𥝱(&#xD855;&#xDF71;)
    roman = ['IVX','XLC','CDM','MPW','WFZ','Z'],
    romanTh = ['0','00','000','01','1','10','100','1000','02'],
    romanStr_base = ['M','P','W','F','Z'],
    romanStr1 = ['ↀ','ↁ','ↂ','ↇ','ↈ'],
    romanStr2 = ['CIↃ','IↃↃ','CCIↃↃ','IↃↃↃ','CCCIↃↃↃ'],
    romanUni = {
      'Ⅰ':'I','Ⅱ':'II','Ⅲ':'III','Ⅳ':'IV','Ⅴ':'V','Ⅵ':'VI','Ⅶ':'VII','Ⅷ':'VIII','Ⅸ':'IX','Ⅹ':'X','Ⅺ':'XI','Ⅻ':'XII',
      'ⅰ':'I','ⅱ':'II','ⅲ':'III','ⅳ':'IV','ⅴ':'V','ⅵ':'VI','ⅶ':'VII','ⅷ':'VIII','ⅸ':'IX','ⅹ':'X','ⅺ':'XI','ⅻ':'XII',
      'Ⅼ':'L','Ⅽ':'C','Ⅾ':'D','Ⅿ':'M','ⅼ':'L','ⅽ':'C','ⅾ':'D','ⅿ':'M','Ɔ':'Ↄ','|':'I'
    },
    findR = new RegExp( '[IVXLCDↀↁↂↇↈIↃM' + Object.keys(romanUni).join('') + ']+','g' ),
    findR2 = new RegExp( '[' + Object.keys(romanUni).join('') + ']','g' ),
    sanskrit = [
      [['-'],['-'],['्']],
      [['E','LL','lRR'],['ḹ','Ḹ'],['ॣ','ॡ']],[['bh'],['bh','Bh'],['भ']],[['ph'],['ph','Ph'],['फ']],
      [['dh'],['dh','Dh'],['ध']],[['th'],['th','Th'],['थ']],[['Dh'],['ḍh','Ḍh'],['ढ']],[['Th'],['ṭh','Ṭh'],['ठ']],
      [['jh'],['jh','Jh'],['झ']],[['ch'],['ch','Ch'],['छ']],[['gh'],['gh','Gh'],['घ']],[['kh'],['kh','Kh'],['ख']],
      [['L','lR'],['ḷ','Ḷ'],['ॢ','ऌ']],[['q','RR'],['ṝ','Ṝ'],['ॄ','ॠ']],[['au'],['au','Au'],['ौ','औ']],
      [['ai'],['ai','Ai'],['ै','ऐ']],[['U','uu'],['ū','Ū'],['ू','ऊ']],[['I','ii'],['ī','Ī'],['ी','ई']],
      [['A','aa'],['ā','Ā'],['ा','आ']],[['s'],['s','S'],['स']],[['S'],['ṣ','Ṣ'],['ष']],[['z'],['ś','Ś'],['श']],
      [['v'],['v','V'],['व']],[['l'],['l','L'],['ल']],[['r'],['r','R'],['र']],[['y'],['y','Y'],['य']],
      [['m'],['m','M'],['म']],[['h'],['h','H'],['ह']],[['b'],['b','B'],['ब']],[['p'],['p','P'],['प']],
      [['n'],['n','N'],['न']],[['d'],['d','D'],['द']],[['t'],['t','T'],['त']],[['N'],['ṇ','Ṇ'],['ण']],
      [['D'],['ḍ','Ḍ'],['ड']],[['T'],['ṭ','Ṭ'],['ट']],[['J'],['ñ','Ñ'],['ञ']],[['j'],['j','J'],['ज']],
      [['c'],['c','C'],['च']],[['G'],['ṅ','Ṅ'],['ङ']],[['g'],['g','G'],['ग']],[['k'],['k','K'],['क']],
      [['H'],['ḥ','Ḥ'],['ः']],[['M'],['ṃ','Ṃ'],['ं']],[['o'],['o','O'],['ो','ओ']],[['e'],['e','E'],['े','ए']],
      [['R'],['ṛ','Ṛ'],['ृ','ऋ']],[['u'],['u','U'],['ु','उ']],[['i'],['i','I'],['ि','इ']],[['a'],['a','A'],['अ']],
      [['1'],['1'],['१']],[['2'],['2'],['२']],[['3'],['3'],['३']],[['4'],['4'],['४']],[['5'],['5'],['५']],[['6'],['6'],['६']],[['7'],['7'],['७']],[['8'],['8'],['८']],[['9'],['9'],['९']],[['0'],['0'],['०']]
    ],
    skt_h_arr = sanskrit.map( r => r[0].join('|') ),
    skt_i_arr = sanskrit.map( r => r[1].join('|') ),
    skt_s_arr = sanskrit.map( r => r[2].join('|') ),
    skt_h = new RegExp( '(' + skt_h_arr.join('|') + ')+','g' ),
    skt_i = new RegExp( '(' + skt_i_arr.join('|') + ')+','g' ),
    skt_s = new RegExp( '(' + skt_s_arr.join('|') + ')+','g' ),
    skt_h2 = new RegExp( '(' + skt_h_arr.join('|') + ')','g' ),
    skt_i2 = new RegExp( '(' + skt_i_arr.join('|') + ')','g' ),
    skt_s2 = new RegExp( '(' + skt_s_arr.join('|') + ')','g' ),
    skt_add_a = new RegExp( '([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])(?=([ंँःकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])|$)','g' ),
    skt_add_virama = new RegExp( '([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])(?=([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])|$)','g' ),
    skt_remove_a = new RegExp( '([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])अ(?=([ंँःकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])|$)','g' );

  let
    histArr = [ { 'ipt':'', 'opt':'' } ],
    instArr,lastArr,i,check,
    tmp,tmpFlg = false;

  Array.prototype.getArrLast = function(){ return this[this.length -1];};
  Array.prototype.arrIndex = function( r ){
    instArr = [];
    for (var i = 0; i < this.length; i++) {
      if( this[i].indexOf(r) !== -1 ) instArr.push( i );
    }
    return instArr;
  };

  const
    output = ( iStr, oStr ) => {
      lastArr = histArr.getArrLast();
      if( lastArr.opt !== oStr ){
        instArr = { 'ipt':iStr, 'opt':oStr };
        histArr.push( instArr );
        $ipt.val( iStr );
        $opt.val( oStr );

        if( $('.automove').prop('checked') ){
          instArr = { 'ipt':$opt.val(), 'opt':'' };
          $ipt.val( $opt.val() );
          $opt.val( '' );
          histArr.push( instArr );
        }
        $('#lengthDisp').html('length:' + $ipt.val().length + ' &gt;&gt; ' + $opt.val().length + ' characters' );
      } else {
        $opt.val( oStr );
      }
      return this;
    },
    toRoman = function( r, num ){
      return romanTh[r].replace( /(.)/g,n => num[parseInt( n,10 )] );
    },
    dupDelete = function( str ){
      return str.split('').filter( ( x, i, self ) => self.indexOf(x) === i ).join('');
    };

  $ipt.on('mouseup touchend keyup', e => {
    let elm = e.currentTarget;
    if( elm.selectionStart === elm.selectionEnd ){
      tmpFlg = false;
      $('#selDisp').text( '' );
    } else {
      tmpFlg = true;
      tmp = { 'start':elm.selectionStart, 'end':elm.selectionEnd };
      $('#selDisp').text( '(select:' + ( tmp.end - tmp.start ) + ' characters)' );
    }
  });


  $bt.on('click',e => {
    let ival = $( e.currentTarget ).val(),
      iStr = $ipt.val(),
      instArr = '', instArr2 = '', i, j,
      instStr = '', instStr2 = '', instNum = 0,
      oStr = '', find = '', flg = 'g', hi,lo,
      beforeStr = '', endStr = '',
      int, fract, seisuu = '', shousuu = '';
    instArr = [];

    if( tmpFlg ){
      beforeStr = iStr.slice( 0,tmp.start );
      endStr = iStr.slice( tmp.end );
      iStr = iStr.slice( tmp.start,tmp.end );
    }

    switch( ival ){
    // Convert Case
      case 'case-title':
        oStr = iStr.replace( /\S\S*/g,txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() );
        break;
      case 'case-upper':
        oStr = iStr.toUpperCase();
        break;
      case 'case-lower':
        oStr = iStr.toLowerCase();
        break;
      case 'case-swap':
        oStr = iStr.replace( /[a-zA-Z]/g,r => r[( /[a-z]/g ).test( r ) ? 'toUpperCase' :'toLowerCase']() );
        break;
      case 'case1':
        oStr = iStr.replace( /\"/g,'\'' );
        break;
      case 'case2':
        oStr = iStr.replace( /\'/g,'\"' );
        break;
      case 'case3':
        oStr = iStr.replace( /(\w+)\-(?=(\w+))/g,'$1_' );
        break;
      case 'case4':
        oStr = iStr.replace( /([A-Za-z0-9]+)\_(?=([A-Za-z0-9]+))/g,'$1\-' );
        break;
      case 'case5':
        oStr = iStr.replace( /([a-z0-9]+)([A-Z])(?=(\w+))/g,( r,r1,r2 ) => r1 + '-' + r2.toLowerCase() );
        break;
      case 'case6':
        oStr = iStr.replace( /(\w+)\-(\w)(?=(\w+))/g,( r,r1,r2 ) => r1 + r2.toUpperCase() );
        break;
      case 'case7':
        oStr = iStr.replace( latin, r => {
          instStr = latinVariety.filter( s => ( s[1].join('').indexOf(r) !== -1 ) )[0][0];
          return ( r === r.toLowerCase() ) ? instStr : instStr.toUpperCase();
        }).replace( /[\u0300-\u036F]/g, '' );
        break;

    // Numeric 1
      case 'num-10_2':
        oStr = iStr.replace( /([0-9.]+)/g,n => parseInt( n,10 ).toString( 2 ) );
        break;
      case 'num-2_10':
        oStr = iStr.replace( /([01]+)/g,n => parseInt( n,2 ).toString( 10 ) );
        break;
      case 'num-10_16':
        oStr = iStr.replace( /([0-9.]+)/g,n => parseInt( n,10 ).toString( 16 ) );
        break;
      case 'num-16_10':
        oStr = iStr.replace( /([0-9a-fA-F]+)/g,n => parseInt( n,16 ).toString( 10 ) );
        break;
      case 'num-2_16':
        oStr = iStr.replace( /([01]+)/g,n => parseInt( n,2 ).toString( 16 ) );
        break;
      case 'num-16_2':
        oStr = iStr.replace( /([0-9a-fA-F]+)/g,n => parseInt( n,16 ).toString( 2 ) );
        break;
    // Numeric 2
      case 'num-a_j':
        oStr = iStr.replace( /([0-9\,\.]+)/g,n => {
          instNum = n.replace( /,/g,'' );
          instNum.match(/(\d+)(?:\.(\d+))?/i);
          int = RegExp.$1;
          fract = RegExp.$2;
          seisuu = '';
          for( i = int.length - 1; i >= 0; i-- ){
            seisuu += zero2nine[parseInt( int[int.length - i - 1],10 )];
            if( i % 4 === 0 ){
              seisuu += suffices[( i / 4 ) | 0];
            } else {
              seisuu += ten2thou[i % 4];
            }
          }
          seisuu = seisuu.replace( /〇[十百千]/g,'' );
          seisuu = seisuu.replace( /一([十百千])/g,'$1' );
          seisuu = seisuu.replace( /〇/g,'' );
          seisuu = seisuu.replace( /([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/g,'$1');
          seisuu = seisuu.replace( '禾予','%uD855%uDF71' );
          seisuu = unescape( seisuu );
          if( seisuu === '' ) seisuu = zero;
          if( fract ) shousuu = point + fract.replace( /(.)/g,n => zero2nine[parseInt( n,10 )] );
          return seisuu + shousuu;
        } );
        break;
      case 'num-a_j2':
        oStr = iStr.replace( /([0-9\,\.]+)/g,n => {
          instStr = n.replace( /([0-9])/g, r => zero2nine[parseInt( r, 10 )]);
          return instStr.replace(',','').replace('\.','点');
        } );
        break;
      case 'num-j_a':
        let k_10_1 = new RegExp('(([零点〇一二三四五六七八九十百千万億兆京垓穣溝澗正載極]|\uD855\uDF71|恒河沙|阿僧祇|那由他|不可思議|無量大数)+)','gu');
        oStr = iStr.replace( k_10_1,r => {
          k_10_2 = new RegExp('(\uD855\uDF71|\u25771)','gu');
          instStr = r.replace( k_10_2,'禾予' );
          int = instStr.split('点')[0];
          fract = instStr.split('点')[1];
          let now_keta;
          if( int === '零' ){
            seisuu = '0';
          } else {
            instArr = int.split( /([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/ );
            for( i = 0; i < instArr.length; i++ ){
              if( instArr[i].match( /([万億兆京垓穣溝澗正載極]|禾予|恒河沙|阿僧祇|那由他|不可思議|無量大数)/ ) !== null ){
                now_keta = suffices.indexOf( RegExp.$1 );
                if( instArr[i + 2] !== suffices[now_keta - 1] && now_keta > 1 ) instArr.splice( i + 1,0,'〇千〇百〇十〇',suffices[now_keta - 1] );
              } else {
                instArr[i] = instArr[i].replace( /([十百千]|^)([十百千])/g,'$1一$2' );
                if( instArr[i].indexOf('千') === -1 ) instArr[i] = '〇千' + instArr[i];
                if( instArr[i].indexOf('百') === -1 ) instArr[i] = instArr[i].slice(0,2) + '〇百' + instArr[i].slice(2,instArr[i].length);
                if( instArr[i].indexOf('十') === -1 ) instArr[i] = instArr[i].slice(0,4) + '〇十' + instArr[i].slice(4,instArr[i].length);
                if( instArr[i].charAt( instArr[i].length - 1 ) === '十' ) instArr[i] = instArr[i] + '〇';
              }
            }
            seisuu = instArr.join('').replace( /([十百千万億兆京垓穣禾予溝澗正載極恒河沙阿僧祇那由他不可思議無量大数])/g,'' );
            seisuu = seisuu.replace( /(.)/g,n => zero2nine.indexOf( n ) );
            seisuu = seisuu.replace( /^0+/g,'' );
          }
          if( fract ) shousuu += '\.' + fract.replace( /(.)/g,n => zero2nine.indexOf( n ) );
          return seisuu + shousuu;
        } );
        break;
      case 'num-a_r':
        oStr = iStr.replace( /([0-9][0-9.,]+|[0-9]+)/g,n => {
          instNum = parseInt( n.replace( /,/g,'' ).split( '.' )[0] );
          rom = '';
          if( instNum < 1 || instNum > 399999 ){
            return instNum;
          } else if( instNum > 3999 && $('.roman_class:checked').val() === 'M' ) {
            return instNum;
          } else {
            if( instNum >= 100000 ){
              instStr = ( instNum / 100000 ) | 0;
              rom += Array( instStr + 1 ).join( roman[5] );
              instNum -= instStr * 100000;
            }
            if( instNum >= 10000 ){
              instStr = ( instNum / 10000 ) | 0;
              rom += toRoman( instStr - 1,roman[4] );
              instNum -= instStr * 10000;
            }
            if( instNum >= 1000 ){
              instStr = ( instNum / 1000 ) | 0;
              rom += toRoman( instStr - 1,roman[3] );
              instNum -= instStr * 1000;
            }
            if( instNum >= 100 ){
              instStr = ( instNum / 100 ) | 0;
              rom += toRoman( instStr - 1,roman[2] );
              instNum -= instStr * 100;
            }
            if( instNum >= 10 ){
              instStr = ( instNum / 10 ) | 0;
              rom += toRoman( instStr - 1,roman[1] );
              instNum -= instStr * 10;
            }
            if( instNum !== 0 ){
              rom += toRoman( instNum - 1,roman[0] );
            }
            romanConv = new RegExp( '[' + romanStr_base.join('') + ']','g' );
            if( $('.roman_class:checked').val() === 'C1' ){
              rom = rom.replace( romanConv,n => romanStr1[romanStr_base.indexOf( n )] );
            } else if( $('.roman_class:checked').val() === 'C2' ){
              rom = rom.replace( romanConv,n => romanStr2[romanStr_base.indexOf( n )] );
            }
            return rom;
          }
        });
        break;
      case 'num-r_a':
        oStr = iStr.replace( findR,n => {
          instStr = n.replace( /[ↀↁↂↇↈ]/g,s => romanStr_base[romanStr1.indexOf( s )] );
          instNum = 0;
          instStr = instStr.replace( findR2,r => romanUni[r] );
          instStr = instStr.replace( /CCCIↃↃↃ/g ,'Z' ).replace( /IↃↃↃ/g ,'F' ).replace( /CCIↃↃ/g ,'W' ).replace( /IↃↃ/g ,'P' ).replace( /CIↃ/g ,'M' );
          instStr = instStr.replace( /^Z+/g, r => {
            instNum += ( r.length ) * 100000;
            return '';
          } );
          instStr = instStr.replace( /^[WFZ]+/g,r => {
            instStr2 = r.replace( /W/g,'0').replace( /F/g,'1').replace( /Z/g,'2');
            instNum += ( romanTh.indexOf( instStr2 ) + 1 ) * 10000;
            return '';
          } );
          instStr = instStr.replace( /^[MPW]+/g,r => {
            instStr2 = r.replace( /M/g,'0').replace( /P/g,'1').replace( /W/g,'2');
            instNum += ( romanTh.indexOf( instStr2 ) + 1 ) * 1000;
            return '';
          } );
          instStr = instStr.replace( /^[CDM]+/g,r => {
            instStr2 = r.replace( /C/g,'0').replace( /D/g,'1').replace( /M/g,'2');
            instNum += ( romanTh.indexOf( instStr2 ) + 1 ) * 100;
            return '';
          } );
          instStr = instStr.replace( /^[XLC]+/g,r => {
            instStr2 = r.replace( /X/g,'0').replace( /L/g,'1').replace( /C/g,'2');
            instNum += ( romanTh.indexOf( instStr2 ) + 1 ) * 10;
            return '';
          } );
          instStr = instStr.replace( /^[IVX]+/g,r => {
            instStr2 = r.replace( /I/g,'0').replace( /V/g,'1').replace( /X/g,'2');
            instNum += ( romanTh.indexOf( instStr2 ) + 1 );
            return '';
          } );
          return instNum;
        });
        break;

    // Url / Base64
      case 'url-encode':
        oStr = encodeURI( iStr );
        break;
      case 'url-encode2':
        oStr = encodeURIComponent( iStr );
        break;
      case 'url-encode3':
        oStr = escape( iStr );
        break;
      case 'url-decode':
        oStr = decodeURIComponent( iStr );
        break;
      case 'b64-encode':
        oStr = btoa( unescape( encodeURIComponent( iStr ) ) );
        break;
      case 'b64-decode':
        oStr = decodeURIComponent( escape( atob( iStr ) ) );
        break;

    // Unicode
      case 'uni-escape':
        oStr = escape( iStr );
        break;
      case 'uniH-escape':
        oStr = escape( iStr ).replace( /%([0-9a-f]{2,2})/gi,'&#x00$1;' ).replace( /%u([0-9a-f]{4,5})/gi,'&#x$1;' );
        break;
      case 'uniH-escape2':
        oStr = iStr.replace( /(.)/g,r => '&#x' + ( String(r) ).charCodeAt( 0 ).toString( 16 ) + ';' );
        break;
      case 'uni-unescape':
        oStr = unescape( iStr );
        break;
      case 'uniH-unescape':
        instStr = iStr.replace( chara, ( r, r1 ) => charaMap[r1] );
        instStr = instStr.replace( /\&\#([0-9]{4,5})\;/gi, ( r, r1 ) => '%u' + ( parseInt( r1,10 ) ).toString( 16 ) );
        instStr = instStr.replace( /\&\#\x([0-9a-f]{4,5})\;/gi, '%u$1' );
        oStr = unescape( instStr );
        break;
      case 'uni-escape3':
        oStr = iStr.replace( /\&/g,'&amp;' ).replace( /</g,'&lt;' ).replace( />/g,'&gt;' );
        break;
      case 'uni-escape4':
        oStr = iStr.replace( /(&#x|%u)([12][0-9a-f]{4,4})(;{0,1})/gi,( r,r1,r2,r3 ) => {
          instNum = parseInt( r2,16 );
          hi = ( ( instNum - 0x10000 ) / 0x400 )|0 + 0xD800;
          lo = ( instNum - 0x10000 ) % 0x400 + 0xDC00;
          return r1 + hi.toString( 16 ) + r3 + r1 + lo.toString( 16 ) + r3;
        } );
        break;
      case 'uni-escape5':
        instReg = new RegExp( '(&#x|%u)(d[89a-f][0-9a-f]{2,2})(;{0,1})(&#x|%u)(d[c-f][0-9a-f]{2,2})(;{0,1})','gi' );
        oStr = iStr.replace( instReg,( r,r1,r2,r3,r4,r5,r6 ) => {
          hi = parseInt( r2,16 );
          lo = parseInt( r5,16 );
          instNum = 0x10000 + ( hi - 0xD800 ) * 0x400 + ( lo - 0xDC00 );
          return r1 + instNum.toString( 16 ) + r3;
        } );
        break;

    // Extract
      case 'extract':
        flg = 'gu';
        instStr = '[';
        $('.extract_reg:checked').each(function(){
          instStr += $(this).val();
        });
        instStr += ']';
        instStr = instStr.replace( /\[/g,'\[\^' );
        find = new RegExp( instStr,flg );
        oStr = iStr.replace( find,'' );
        break;
      case 'exclude':
        flg = 'gu';
        instStr = '[';
        $('.extract_reg:checked').each(function(){
          instStr += $(this).val();
        });
        instStr += ']';
        find = new RegExp( instStr,flg );
        oStr = iStr.replace( find,'' );
        break;

    // Exclusion
      case 'newline':
        oStr = iStr.replace( /[\r\n]/g,'' );
        break;
      case 'html':
        oStr = iStr.replace( /<[^>]*?>/g,'' );
        break;
      case 'space':
        oStr = iStr.replace( /[\t 　]+/gm,' ' );
        oStr = oStr.replace( /^[\t 　]/gm,'' );
        oStr = oStr.replace( /[\t 　]\n/gm,'\n' );
        break;
      case 'margin':
        oStr = iStr.replace( /\r\n/g,'\n' );
        oStr = oStr.replace( /^[\t 　]+$/gm,'' );
        oStr = oStr.replace( /\n(?=\n)/g,'' );
        oStr = oStr.replace( /^\n/g,'' );
        break;
      case 'ex_dup1':
        instArr = iStr.split('');
        instArr = instArr.filter( ( x, i, self ) => ( /\s/.test(x) || self.indexOf(x) === i ) );
        oStr = instArr.join('');
        break;
      case 'ex_dup2':
        instArr = iStr.replace( /\r\n/g,'\n' ).split( /\n/ );
        instArr = instArr.filter( ( x, i, self ) => self.indexOf(x) === i );
        oStr = instArr.join('\n');
        break;
      case 'ex_dup3':
        instStr = iStr.replace( /\r\n/g,'\n' );
        instArr = instStr.replace( /(\S+|\s+)/g,'$1|-|-|' ).split('|-|-|');
        instArr = instArr.filter( ( x, i, self ) => ( /\s+/.test(x) || self.indexOf(x) === i ) );
        oStr = instArr.join('');
        break;

    // Reverse/Sort
      case 'rev-chara':
        for( i = iStr.length - 1; i >= 0 ; i-- ) instStr += iStr.charAt( i );
        oStr = instStr;
        break;
      case 'rev-line':
        instArr = iStr.replace( /\r\n/g,'\n' ).split( /\n/ );
        for( i = instArr.length - 1; i >= 0 ; i-- ) instStr += instArr[i] + '\n';
        oStr = instStr;
        break;
      case 'rev-word':
        instArr = iStr.replace( /\r\n/g,'\n' ).replace( /(\s)/g,'||||$1||||' ).split('||||');
        for( i = instArr.length - 1; i >= 0 ; i-- ) instStr += instArr[i];
        oStr = instStr;
        break;
      case 'sort1':
        instArr = iStr.replace( /\r\n/g,'\n' ).split( '\n' );
        oStr = instArr.sort( ( a,b ) => ( ( a > b ) - ( a < b ) ) ).join('\n');
        break;
      case 'sort2':
        instArr = iStr.replace( /\r\n/g,'\n' ).split( '\n' );
        oStr = instArr.sort( ( a,b ) => ( ( a < b ) - ( a > b ) ) ).join('\n');
        break;
      case 'sort3':
        instArr = iStr.replace( /\r\n/g,'\n' ).split( '' );
        oStr = instArr.sort( ( a,b ) => ( ( a > b ) - ( a < b ) ) ).join('');
        break;
      case 'sort4':
        instArr = iStr.replace( /\r\n/g,'\n' ).split( '' );
        oStr = instArr.sort( ( a,b ) => ( ( a < b ) - ( a > b ) ) ).join('');
        break;

    // Duplication/matrix-change
      case 'dup1':
        oStr = iStr.split('').filter( ( x, i, self ) => self.indexOf(x) === i ).join('');
        break;
      case 'dup2':
        oStr = iStr.split('').filter( ( x, i, self ) => self.indexOf(x) !== self.lastIndexOf(x) ).join('');
        break;
      case 'dup3':
        oStr = iStr.split('').filter( ( x, i, self ) => self.indexOf(x) === self.lastIndexOf(x) ).join('');
        break;
      case 'dup4':
        oStr = iStr.split('').filter( ( x, i, self ) => ( self.indexOf(x) === i && i !== self.lastIndexOf(x) ) ).join('');
        break;
      case 'matrix-change':
        var trans = a => Object.keys(a[0]).map( c => a.map( r => r[c] ) );
        instArr = iStr.replace( /\r\n/g,'\n' ).split( '\n' );
        splitter = ( $('.matrix:checked').val() ).replace('\\t','\t').replace('\\,','\,');
        instArr2 = [];
        instArr = instArr.map( r => r.split( new RegExp( splitter, 'g') ) );
        instStr = trans(instArr).map( r => r.join(splitter) ).join('\n');
        oStr = instStr;
        break;

    // Jpn Characters
      case 'jpn1':
        oStr = iStr.replace(/[\u3041-\u3096]/g,r => String.fromCharCode( r.charCodeAt(0) + 0x60 ) );
        break;
      case 'jpn2':
        oStr = iStr.replace(/[\u30a1-\u30f6]/g,r => String.fromCharCode( r.charCodeAt(0) - 0x60 ) );
        break;
      case 'jpn3':
        oStr = iStr.replace( kana1,r => kanaMap[kana1_arr.indexOf(r)][1] ).replace(/ﾞ/g,'゛').replace(/ﾟ/g,'゜');
        break;
      case 'jpn4':
        oStr = iStr.replace( kana2,r => kanaMap[kana2_arr.indexOf(r)][0] );
        break;
      case 'jpn5':
        oStr = iStr.replace( alpha1,r => kanaAlpha[alpha1_arr.indexOf(r)][1] ).replace(/ﾞ/g,'゛').replace(/ﾟ/g,'゜');
        break;
      case 'jpn6':
        oStr = iStr.replace( alpha2,r => kanaAlpha[alpha2_arr.indexOf(r)][0] );
        break;
      case 'jpn7':
        instStr = iStr.replace( cjk1,r => shin2kyu[cjk1_arr.indexOf(r)][1] );
        oStr = instStr;
        break;
      case 'jpn7b':
        instStr = iStr.replace( cjk1,r => shin2kyu[cjk1_arr.indexOf(r)][1] );
        instStr = instStr.replace( shinSp1, r => unescape( shinSpBase[shinSp1_arr.indexOf(r)][1] ) );
        oStr = instStr;
        break;
      case 'jpn8':
        instStr = iStr.replace( cjk2,r => shin2kyu[cjk2_arr.indexOf(r)][0] );
        instStr = instStr.replace( cjk1add,r => kyu2shinAdd[cjk1add_arr.indexOf(r)][1] );
        instStr = escape( instStr ).replace( /(%uFE00|%uDB40%uDD[01][0-9a-fA-F])/g, '' );
        oStr = unescape( instStr );
        break;
      case 'jpn9':
        oStr = iStr.replace( findDK,r => daizi.dai[daizi.kan.indexOf( r )] );
        break;
      case 'jpna':
        oStr = iStr.replace( findDD,r => daizi.kan[daizi.dai.indexOf( r )] );
        break;
      case 'jpnb':
        instStr = iStr.replace( /ン([ヤユヨアイウエオ])/g, 'ン\'$1' );
        instStr = instStr.replace( kun1,r => kunre[kun1_arr.indexOf(r)][1] );
        instStr = instStr.replace( /ッ([kstnhmyrgzjpbd])/g,'$1$1' ).replace( /ッ/g,'\'' );
        instStr = instStr.replace( /o[uo]/g,'ô' ).replace( /uu/g,'û' ).replace( /ii/g,'î' );
        instStr = instStr.replace( /([aiueo])ー/g,( r,r1 ) => 'âîûêô'['aiueo'.indexOf(r1)] );
        oStr = instStr;
        break;
      case 'jpnc':
        instStr = iStr.replace( /ン([ヤユヨアイウエオ])/g, 'ン\'$1' );
        instStr = instStr.replace( heb1,r => hebon[heb1_arr.indexOf(r)][1] );
        instStr = instStr.replace( /n([bmp])/g,'m$1' );
        instStr = instStr.replace( /ッch/g,'tch' ).replace( /ッ([kstnhmyrgzjpbd])/g,'$1$1' ).replace( /ッ/g,'\'' );
        instStr = instStr.replace( /ー/g,'').replace( /o[uo]/g,'o').replace( /uu/g,'u').replace( /ii/g,'i');
        oStr = instStr;
        break;
      case 'jpnd':
        instStr = iStr.replace( /[nm]([^aiueoyw])/g, 'ン$1' );
        instStr = iStr.replace( /([kstnhmyrgzjpbd])\1/g, 'ッ$1' );
        instStr = instStr.replace( kanaroma_reg,r => kanaroma[kanaroma_arr.indexOf(r)][1] );
        oStr = instStr;
        break;

    // CJK Characters
      case 'tocjk1':
        oStr = iStr.replace( findWordN,r => escape( cjk_word[findWordN_arr.indexOf(r)][0] ) );
        oStr = oStr.replace( findN,r => {
          instArr = findN_arr.arrIndex(r);
          if( instArr.length === 1 ){
            if( findK_arr[instArr[0]].length === 1 ){
              instStr = findK_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete( findK_arr[instArr[0]] ).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for ( var i = 0; i < instArr.length; i++ ) {
              instStr2 += findK_arr[instArr[i]];
            }
            instStr2 = dupDelete( instStr2 );
            if( instStr2.length > 1 ) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape( oStr );
        break;
      case 'tocjk2':
        oStr = iStr.replace( findWordN,r => escape( cjk_word[findWordN_arr.indexOf(r)][1] ) );
        oStr = oStr.replace( findN,r => {
          instArr = findN_arr.arrIndex(r);
          if( instArr.length === 1 ){
            if( findH_arr[instArr[0]].length === 1 ){
              instStr = findH_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete( findH_arr[instArr[0]] ).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for ( var i = 0; i < instArr.length; i++ ) {
              instStr2 += findH_arr[instArr[i]];
            }
            instStr2 = dupDelete( instStr2 );
            if( instStr2.length > 1 ) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape( oStr );
        break;
      case 'tocjk3':
        oStr = iStr.replace( findWordK,r => escape( cjk_word[findWordK_arr.indexOf(r)][2] ) );
        oStr = oStr.replace( findK,r => {
          instArr = findK_arr.arrIndex(r);
          if( instArr.length === 1 ){
            if( findN_arr[instArr[0]].length === 1 ){
              instStr = findN_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete( findN_arr[instArr[0]] ).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for ( var i = 0; i < instArr.length; i++ ) {
              instStr2 += findN_arr[instArr[i]];
            }
            instStr2 = dupDelete( instStr2 );
            if( instStr2.length > 1 ) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape( oStr );
        break;
      case 'tocjk4':
        oStr = iStr.replace( findWordH,r => escape( cjk_word[findWordH_arr.indexOf(r)][2] ) );
        oStr = oStr.replace( findH,r => {
          instArr = findH_arr.arrIndex(r);
          if( instArr.length === 1 ){
            if( findN_arr[instArr[0]].length === 1 ){
              instStr = findN_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete( findN_arr[instArr[0]] ).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for ( var i = 0; i < instArr.length; i++ ) {
              instStr2 += findN_arr[instArr[i]];
            }
            instStr2 = dupDelete( instStr2 );
            if( instStr2.length > 1 ) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape( oStr );
        break;
      case 'tocjk5':
        oStr = iStr.replace( findWordK,r => escape( cjk_word[findWordK_arr.indexOf(r)][1] ) );
        oStr = oStr.replace( findK,r => {
          instArr = findK_arr.arrIndex(r);
          if( instArr.length === 1 ){
            if( findH_arr[instArr[0]].length === 1 ){
              instStr = findH_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete( findH_arr[instArr[0]] ).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for ( var i = 0; i < instArr.length; i++ ) {
              instStr2 += findH_arr[instArr[i]];
            }
            instStr2 = dupDelete( instStr2 );
            if( instStr2.length > 1 ) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape( oStr );
        break;
      case 'tocjk6':
        oStr = iStr.replace( findWordH,r => escape( cjk_word[findWordH_arr.indexOf(r)][1] ) );
        oStr = oStr.replace( findH,r => {
          instArr = findH_arr.arrIndex(r);
          if( instArr.length === 1 ){
            if( findK_arr[instArr[0]].length === 1 ){
              instStr = findK_arr[instArr[0]];
            } else {
              instStr = '(' + dupDelete( findK_arr[instArr[0]] ).split('').join('|') + ')';
            }
          } else {
            instStr2 = '';
            for ( var i = 0; i < instArr.length; i++ ) {
              instStr2 += findK_arr[instArr[i]];
            }
            instStr2 = dupDelete( instStr2 );
            if( instStr2.length > 1 ) instStr = '(' + instStr2.split('').join('|') + ')';
          }
          return instStr;
        });
        oStr = unescape( oStr );
        break;
      case 'tocjk7':
        instStr = escape( iStr ).replace( pin,( r,r1 ) => r + '\[' + pinyin[r1] + '\]' );
        oStr = unescape( instStr );
        break;

    // skt
      case 'skt1':
        oStr = iStr.replace( skt_s, r => {
          instStr = r.replace( skt_add_a, '$1a' );
          instStr = instStr.replace( skt_s2, s => {
            instStr2 = sanskrit.filter( t => ( t[2].indexOf(s) !== -1 ) )[0][0][0];
            return instStr2;
          } );
          instStr = instStr.replace( /\-/g, '');
          return instStr;
        });
        break;
      case 'skt2':
        oStr = iStr.replace( skt_s, r => {
          instStr = r.replace( skt_add_a, '$1a' );
          instStr = instStr.replace( skt_s2, s => {
            instStr2 = sanskrit.filter( t => ( t[2].indexOf(s) !== -1 ) )[0][1][0];
            return instStr2;
          } );
          instStr = instStr.replace( /\-/g, '');
          return instStr;
        });
        break;
      case 'skt3':
        oStr = iStr.replace( skt_h, r => {
          flg = true;
          instStr = r.replace( skt_h2, s => {
            instArr = sanskrit.filter( t => ( t[0].indexOf(s) !== -1 ) )[0][2];
            instStr2 = ( flg && instArr.length === 2 ) ? instArr[1] : instArr[0];
            flg = false;
            return instStr2;
          } );
          instStr = instStr.replace( skt_add_virama, '$1्' );
          instStr = instStr.replace( skt_remove_a, '$1');
          return instStr;
        });
        break;
      case 'skt4':
        oStr = iStr.replace( skt_h, r => {
          instStr = r.replace( skt_h2, s => {
            instStr2 =sanskrit.filter( t => ( t[0].indexOf(s) !== -1 ) )[0][1][0];
            return instStr2;
          } );
          return instStr;
        });
        break;
      case 'skt5':
        oStr = iStr.replace( skt_i, r => {
          flg = true;
          instStr = r.toLowerCase();
          instStr = instStr.replace( skt_i2, s => {
            instArr = sanskrit.filter( t => ( t[1].indexOf(s) !== -1 ) )[0][2];
            instStr2 = ( flg && instArr.length === 2 ) ? instArr[1] : instArr[0];
            flg = false;
            return instStr2;
          } );
          instStr = instStr.replace( skt_add_virama, '$1्' );
          instStr = instStr.replace( skt_remove_a, '$1');
          return instStr;
        });
        break;
      case 'skt6':
        oStr = iStr.replace( skt_i, r => {
          instStr = r.toLowerCase();
          instStr = instStr.replace( skt_i2, s => {
            instStr2 = sanskrit.filter( t => ( t[1].indexOf(s) !== -1 ) )[0][0][0];
            return instStr2;
          } );
          return instStr;
        });
        break;

    // replace
      case 'replacement':
        flg = $('#caps').prop('checked') ? 'g' :'gi';
        find = new RegExp( $('#rep_find').val(),flg );
        instStr2 = $('#rep_rep').val();
        instStr2 = instStr2.replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\r/g,'\r');
        oStr = iStr.replace( find,instStr2 );
        break;

    // numbering
      case 'numbering':
        mx_st = parseInt($('#mx_start').val(), 10);
        mx_ed = parseInt($('#mx_end').val(), 10);
        mx_sp = parseInt($('#mx_step').val(), 10);
        mx_jn = $('#mx_join').val().replace(/\\n/g,'\n');
        mx_jnReg = new RegExp( mx_jn, 'g' );
        instArr = [];
        instStr = '';
        for (i = mx_st; i <= mx_ed; i = i + mx_sp) {
          instArr.push(i);
        }
        instArr2 = iStr.split(mx_jnReg);
        mxLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        for (j = 0; j < mxLength; j++){
          if( instArr[j] ){
            instStr += instArr[j];
          }
          if( instArr2[j] ){
            instStr += instArr2[j];
          }
          instStr += mx_jn;
        }
        oStr = instStr;
        break;

    // merge
      case 'merge1':
        oStr = iStr + '\n' + $opt.val();
        break;
      case 'merge2':
        instArr = iStr.split(/\n/g);
        instArr2 = $opt.val().split(/\n/g);
        mxLength = instArr.length <= instArr2.length ? instArr2.length : instArr.length;
        for (i = 0; i < mxLength; i++){
          if( instArr[i] ){
            instStr += instArr[i];
          }
          if( instArr2[i] ){
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
        for (i = 0; i < mxLength; i++){
          if( instArr[i] ){
            instStr += instArr[i];
          }
          if( instArr2[i] ){
            instStr += instArr2[i];
          }
        }
        oStr = instStr;
        break;

    // other
      case 'move':
        iStr = $opt.val();
        oStr = '';
        break;
      case 'undo':
        if( histArr.length > 1 ){
          lastArr = histArr.getArrLast();
          iStr = lastArr.ipt;
          oStr = lastArr.opt;
          $ipt.val( iStr );
          $opt.val( oStr );
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
      default:
        break;
    }
    if( ival !== 'undo' && ival !== 'delete' ){
      if( tmpFlg ){
        iStr = beforeStr + iStr + endStr;
        oStr = beforeStr + oStr + endStr;
        $ipt.focus();
        $ipt.get(0).setSelectionRange( tmp.start,tmp.end );
      }
      output( iStr,oStr );
    }
  });

  output( $ipt.val(),$opt.val() );
});
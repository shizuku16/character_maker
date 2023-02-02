function previewImage(obj){
    var fileReader = new FileReader();
    fileReader.onload = (function() {
        document.getElementById('preview').src = fileReader.result;
    });
    fileReader.readAsDataURL(obj.files[0]);
}

async function nameget() {
	const url=document.getElementById("url").value
    $.ajax({
            url: url+".js",
            type: 'GET',
            dataType: 'jsonp',
            jsonpCallback: 'callback'
        })
        .done(function(jsondata){
            let header = document.getElementById('name');
		    header.textContent = '';
		    header.insertAdjacentHTML('afterbegin',`　タイトル：${jsondata.data_title}`);
            if(jsondata.V_GLv16!="0") document.getElementById("rider").hidden=false;
            else document.getElementById("rider").hidden=true;
		})
}

function bukiload(choice){
    if(choice.checked) {
        document.getElementById("bukioption").hidden=false;
        document.getElementById("kurirei").checked=true;
        document.getElementById("demeup").checked=true;
        document.getElementById("demefix").checked=true;
    }
    else {
        document.getElementById("bukioption").hidden=true;
        document.getElementById("kurirei").checked=false;
        document.getElementById("demeup").checked=false;
        document.getElementById("demefix").checked=false;
    }
}

async function load() {
    const imagefile=document.getElementById("image");
    if(imagefile.files[0]){
    await imagefile.files[0].arrayBuffer().then((arraybuffer) => {
        const sha = new jsSHA("SHA-256", 'ARRAYBUFFER');
        sha.update(arraybuffer);
        const hash = sha.getHash("HEX");
        return hash
    })
    .then((hash)=>{
        const writeString=`    <data name="image">\n      <data type="image" name="imageIdentifier">${hash}</data>\n    </data>`;
        yomikomi(writeString);
    })
}else{yomikomi(`<data name="image">\n      <data type="image" name="imageIdentifier"></data>\n    </data>`)}
}

function yomikomi(img){
    var url=document.getElementById("url").value.replace(/#top/,"");
    $.ajax({
            url: url+".js",
            type: 'GET',
            dataType: 'jsonp',
            jsonpCallback: 'callback'
        })
        .done(function(jsondata){
            const hp=jsondata.HP;
            const mp=jsondata.MP;
            const bougo=jsondata.bougo;
            const ginou_list=["ファイター","グラップラー","フェンサー","シューター","ソーサラー","コンジャラー",`プリースト/${jsondata.priest_sinkou}`,"フェアリーテイマー","マギテック","スカウト","レンジャー","セージ","エンハンサー","バード","アルケミスト","ライダー","デーモンルーラー","ウォーリーダー","ミスティック","グリモワール","アーティザン","アリストクラシー","","ドルイド","ジオマンサー","バトルダンサー"];
            let writeString=`<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<character location.name=\"table\" location.x=\"0\" location.y=\"0\" posZ=\"0\" rotate=\"0\" roll=\"0\">\n  <data name=\"character\">\n    ${img}\n    <data name=\"common\">\n      <data name=\"name\">${jsondata.pc_name}`;
            writeString+=`</data>\n      <data name="size">1</data>\n    </data>\n    <data name="detail">\n      <data name="リソース">\n        <data type="numberResource" currentValue="${hp}" name="HP">${hp}</data>\n        <data type="numberResource" currentValue="${mp}" name="MP">${mp}</data>\n        <data type="numberResource" currentValue="${bougo}" name="防護点">${bougo}</data>\n`;
            writeString+=`        <data type="numberResource" currentValue="0" name="1ゾロ">10</data>\n`
            if(jsondata.V_GLv14!="0") writeString+=`        <data name="楽素">\n          <data name="高揚" type="numberResource" currentValue="0">10</data>\n          <data name="鎮静" type="numberResource" currentValue="0">10</data>\n          <data name="魅惑" type="numberResource" currentValue="0">10</data>\n        </data>\n`;
            if(jsondata.V_GLv25!="0") writeString+=`        <data name="命脈点">\n          <data name="天" type="numberResource" currentValue="0">4</data>\n          <data name="地" type="numberResource" currentValue="0">4</data>\n          <data name="人" type="numberResource" currentValue="0">4</data>\n        </data>\n`;
            if(jsondata.V_GLv18!="0") writeString+=`        <data type="numberResource" currentValue="0" name="陣気">10</data>\n`;
            writeString+=`      </data>\n      <data name="能力値">\n        <data name="器用度">${jsondata.NP1}</data>\n        <data name="敏捷度">${jsondata.NP2}</data>\n        <data name="筋力">${jsondata.NP3}</data>\n        <data name="生命力">${jsondata.NP4}</data>\n        <data name="知力">${jsondata.NP5}</data>\n        <data name="精神力">${jsondata.NP6}</data>\n      </data>\n`;
            writeString+=`      <data name="技能">\n        <data name="冒険者レベル">${jsondata.lv}</data>\n`;
            for(let i=1;i<=26;i++){
                let num="V_GLv"+i
                if(jsondata[num]==0)continue;
                writeString+=`        <data name="${ginou_list[i-1]}">${jsondata[num]}</data>\n`
            }
            writeString+=`\n      </data>\n      <data name="バフ・デバフ">\n        <data type="numberResource" currentValue="0" name="命中">5</data>\n        <data type="numberResource" currentValue="0" name="回避">5</data>\n        <data type="numberResource" currentValue="0" name="攻撃">5</data>\n        <data type="numberResource" currentValue="0" name="攻撃2">5</data>`;
            if(document.getElementById("kurirei").checked) writeString+= `\n        <data type="numberResource" currentValue="0" name="クリレイ">5</data>`;
            if(document.getElementById("demeup").checked) writeString+= `\n        <data type="numberResource" currentValue="0" name="出目上昇">5</data>`;
            if(document.getElementById("demefix").checked) writeString+=`\n        <data type="numberResource" currentValue="0" name="出目固定">12</data>`;
            writeString+=`\n        <data type="numberResource" currentValue="0" name="魔法行使">5</data>\n        <data type="numberResource" currentValue="0" name="魔法威力">5</data>\n        <data type="numberResource" currentValue="0" name="生命抵抗">5</data>\n        <data type="numberResource" currentValue="0" name="精神抵抗">5</data>`;
            if(document.getElementById("damage").checked) writeString+=`\n        <data type="numberResource" currentValue="0" name="ダメージ軽減">5</data>`;
            writeString+=`\n      </data>\n      <data name="所持品">\n`;
            for(let i=0;i<jsondata.item_name.length;i++){
                writeString+=`        <data type="numberResource" currentValue="${jsondata.item_num[i]}" name="${jsondata.item_name[i]}">${jsondata.item_num[i]}</data>\n`;
            }
            //以下チャットパレット
            writeString+=`      </data>\n    </data>\n  </data>\n  <chat-palette dicebot="SwordWorld2.5">1d\n1d&gt;=4\n2d 【平目】\n\n`;
            if(document.getElementById("damage").checked) writeString+=`//-----ダメージ計算\nC({HP}-()+{防護点}+{ダメージ軽減}) 　【残HP（物理ダメージ）】\nC({HP}-()+{ダメージ軽減})　【残HP（魔法ダメージ）】\nC({MP}-())　【MP消費】`;
            writeString+=`\n\n//-----冒険者判定\n2d+{冒険者レベル}+({知力}/6) 【真偽判定】\n2d+{冒険者レベル}+({敏捷度}/6) 【跳躍判定】【水泳判定】\n2d+{冒険者レベル}+({筋力}/6) 【登攀判定】【腕力判定】\n\n//-----抵抗力\n`;
            let mental_calc=jsondata.mental_resist-jsondata.lv-jsondata.NB6-(jsondata.mental_resist_mod||0);
            let life_calc=jsondata.life_resist-jsondata.lv-jsondata.NB4-(jsondata.life_resist_mod||0);
            writeString+=`2d+{冒険者レベル}+({生命力}/6)+{生命抵抗}+${jsondata.life_resist_mod||0}+${life_calc} 【生命抵抗力判定】\n2d+{冒険者レベル}+({精神力}/6)+{精神抵抗}+${jsondata.mental_resist_mod||0}+${mental_calc} 【精神抵抗力判定】\n`;

            //チャットパレット(技能依存の判定)
            if(jsondata.V_GLv10!="0") writeString+=`\n//-----スカウト\n2d+{スカウト}+({器用度}/6) 【スカウト技巧判定】スリ/変装/隠蔽/解除/罠設置\n2d+{スカウト}+({敏捷度}/6) 【スカウト運動判定】先制/受け身/隠密/軽業/登攀/尾行\n2d+{スカウト}+({知力}/6) 【スカウト観察判定】宝物鑑定/足跡追跡/異常感知/聞き耳/危険感知/探索/天候予測/罠回避/地図作製\n`;
            if(jsondata.V_GLv11!="0") writeString+=`\n//-----レンジャー\n2d+{レンジャー}+({器用度}/6) 【レンジャー技巧判定】応急手当/隠蔽/解除*/罠設置* (*は自然環境のみ)\n2d+{レンジャー}+({敏捷度}/6) 【レンジャー運動判定】受け身/隠密/軽業/登攀/尾行\n2d+{レンジャー}+({知力}/6) 【レンジャー観察判定】病気知識/薬品学/足跡追跡/異常感知*/聞き耳/危険感知/探索*/天候予測/罠回避*/地図作製* (*は自然環境のみ)\nk10+{レンジャー}+({器用度}/6)@13 【救命草】\nk0+{レンジャー}+({器用度}/6)@13 【魔香草】\nk20+{レンジャー}+({知力}/6)@13 【ヒーリングポーション】\nk30+{レンジャー}+({知力}/6)@13 【トリートポーション】\nC({レンジャー}+({知力}/6)) 【魔香水】\n`;
            if(jsondata.V_GLv12!="0") writeString+=`\n//-----セージ\n2d+{セージ}+({知力}/6) 【セージ知識判定】見識/文献/魔物知識/文明鑑定/宝物鑑定/病気知識/薬品学/地図作製\n`;
            if(jsondata.V_GLv14!="0") writeString+=`\n//-----バード\n2d+{バード}+({知力}/6) 【見識判定】\n2d+{バード}+({精神力}/6) 【演奏判定】\n`;
            if(jsondata.V_GLv16!="0") {
                writeString+=`\n//-----ライダー\n2d+{ライダー}+({器用度}/6) 【応急手当判定】\n2d+{ライダー}+({敏捷度}/6) 【ライダー運動判定】受け身/騎乗\n2d+{ライダー}+({知力}/6) 【ライダー知識判定】弱点隠蔽/魔物知識*/地図作製 (*弱点不可)\n2d+{ライダー}+({知力}/6) 【ライダー観察判定*】足跡追跡/異常感知/危険感知/探索/罠回避 (*要【探索指令】)\n`;
                if(document.getElementById("riderseisin").checked) writeString+=`2d+{ライダー}+({精神力}/6) 【ライダー精神力】威嚇/騎獣特殊能力 \n`
            }
            if(jsondata.V_GLv15!="0") writeString+=`\n//-----アルケミスト\n2d+{アルケミスト}+({知力}/6) 【アルケミスト知識判定】見識/文献/薬品学\n2d+{アルケミスト}+({知力}/6) 【賦術判定】\n`;
            if(jsondata.V_GLv10!="0"||jsondata.V_GLv12!="0"||jsondata.V_GLv16!="0"||jsondata.V_GLv18!="0") writeString+=`\n//-----戦闘準備\n`;
            if(jsondata.V_GLv10!="0") writeString+=`2d+{スカウト}+({敏捷度}/6)+${jsondata.sensei_mod||0} 【先制判定】\n`;
            if(jsondata.V_GLv18!="0") writeString+=`2d+{ウォーリーダー}+({敏捷度}/6)+${jsondata.sensei_mod||0} 【先制判定】\n`;
            if(jsondata.V_GLv18!="0"&&jsondata.Sensei_INT_Bonus=="1") writeString+=`2d+{ウォーリーダー}+({知力}/6)+${jsondata.sensei_mod||1} 【先制判定】\n`;
            if(jsondata.V_GLv12!="0") writeString+=`2d+{セージ}+({知力}/6)+${jsondata.mamono_chishiki_mod||0} 【魔物知識判定】\n`;
            if(jsondata.V_GLv16!="0") writeString+=`2d+{ライダー}+({知力}/6)+${jsondata.mamono_chishiki_mod||0} 【魔物知識判定*】 (*弱点不可)`;

            writeString+=`\n\n//-----回避\n`;
            if(jsondata.kaihi_ginou_name) writeString+=`2d+{${jsondata.kaihi_ginou_name}}+({敏捷度}/6)+{回避}+${jsondata.armor_kaihi||0}+${jsondata.shield_kaihi||0}+${jsondata.shield2_kaihi||0}+${jsondata.bougu_kaihi_tokugi||0}+${jsondata.bougu_kaihi_mod||0} 【回避力判定】\n`;
            else writeString+=`2d+{回避}+${jsondata.armor_kaihi||0}+${jsondata.shield_kaihi||0}+${jsondata.shield2_kaihi||0}+${jsondata.bougu_kaihi_tokugi||0}+${jsondata.bougu_kaihi_mod||0} 【回避力判定】\n`;


            //チャットパレット(武器)
            if(jsondata.arms_name.length){
                for(let i=0;i<jsondata.arms_name.length;i++){
                    if(!jsondata.arms_name[i]) continue;
                    let buki=jsondata.arms_name[i];
                    let ginou=ginou_list[Number(jsondata.V_arms_hit_ginou[i])-1];
                    let iryoku="k"+jsondata.arms_iryoku[i];
                    let koteiti=`${jsondata.arms_damage_mod[i]||0}`;
                    let critical=Number(jsondata.arms_critical[i])||10;
                    let hit=`{器用度}/6`;
                    if(jsondata.arms_is_senyou[i]==1) hit=`({器用度}+2)/6`;
                    hit+=`+${jsondata.arms_hit_mod[i]||0}+${jsondata.arms_hit_tokugi||0}`;
                    if(!ginou) continue;
                    if(document.getElementById("buki").checked){
                        writeString+=`\n//-----${buki}`;
                        writeString+=`\n2d+{${ginou}}+${hit}+{命中} 【命中力判定】${buki}`;
                        writeString+=`\n${iryoku}+{${ginou}}+{筋力}/6+${koteiti}+{攻撃}+{攻撃2}@${critical} 【威力】${buki}`;
                        if(document.getElementById("kurirei").checked)
                            writeString+=`\n${iryoku}+{${ginou}}+{筋力}/6+${koteiti}+{攻撃}+{攻撃2}@${critical}$+{クリレイ} 【威力】${buki}/クリレイ`;
                        if(document.getElementById("demeup").checked)
                            writeString+=`\n${iryoku}+{${ginou}}+{筋力}/6+${koteiti}+{攻撃}+{攻撃2}@${critical}#{出目上昇} 【威力】${buki}/出目上昇`;
                        if(document.getElementById("kurirei").checked&&document.getElementById("demeup").checked)
                            writeString+=`\n${iryoku}+{${ginou}}+{筋力}/6+${koteiti}+{攻撃}+{攻撃2}@${critical}#{出目上昇}$+{クリレイ} 【威力】${buki}/クリレイ&amp;出目上昇`;
                        if(document.getElementById("demefix").checked)
                            writeString+=`\n${iryoku}+{${ginou}}+{筋力}/6+${koteiti}+{攻撃}+{攻撃2}@${critical}\${出目固定} 【威力】${buki}/出目固定\n`;
                    }
                    
                }
            }

            //チャットパレット(魔法)
            const magic_numlist=[5,6,7,8,9,17,24];
            const magicName_list=["真語魔法","操霊魔法","神聖魔法","妖精魔法","魔動機術","召異魔法","森羅魔法"];
            const magic_list={
                5:[
                    {level:1,iryoku:"k10",name:"エネルギー・ボルト",c:10},
                    {level:3,iryoku:"k20",name:"リープ・スラッシュ",c:10},
                    {level:4,iryoku:"k20",name:"ライトニング",c:10},
                    {level:5,iryoku:"k30",name:"ブラスト",c:10},
                    {level:6,iryoku:"k20",name:"ファイアボール",c:10},
                    {level:7,iryoku:"k10",name:"スティール・マインド",c:10},
                    {level:8,iryoku:"k40",name:"エネルギー・ジャベリン",c:10},
                    {level:9,iryoku:"k0",name:"ブレードネット",c:13},
                    {level:10,iryoku:"k30",name:"ブリザード",c:10},
                    {level:11,iryoku:"k50",name:"サンダー・ボルト",c:10},
                    {level:12,iryoku:"k40",name:"シャイニング・スポット",c:9},
                    {level:12,iryoku:"k30",name:"ショック",c:10},
                    {level:14,iryoku:"k60",name:"ディメンジョン・ソード",c:10},
                    {level:15,iryoku:"k100",name:"メテオ・ストライク",c:10}
                ],
                6:[
                    {level:1,iryoku:"k0",name:"スパーク",c:10},
                    {level:7,iryoku:"k10",name:"ドレイン・タッチ",c:10},
                    {level:8,iryoku:"k20",name:"アシッド・クラウド",c:10},
                    {level:8,iryoku:"k20",name:"クリメイション",c:10},
                    {level:9,iryoku:"k30",name:"カースドール",c:10},
                    {level:15,iryoku:"k60",name:"デス・クラウド",c:10},
                    {level:1,line:true},
                    {level:2,iryoku:"k0",name:"アースヒール",c:13},
                    {level:11,iryoku:"k30",name:"アース・ヒール2",c:13}
                ],
                7:[
                    {level:3,iryoku:"k10",name:"フォース",c:10},
                    {level:5,iryoku:"k20",name:"ホーリー・ライト",c:10},
                    {level:8,iryoku:"k20",name:"ゴッド・フィスト【小神】",c:9},
                    {level:8,iryoku:"k30",name:"ゴッド・フィスト【大神】",c:10},
                    {level:8,iryoku:"k40",name:"ゴッド・フィスト【古代神】",c:11},
                    {level:9,iryoku:"k30",name:"フォース・イクスプロ―ジョン",c:10},
                    {level:11,iryoku:"k50",name:"ホーリー・ライト2",c:10},
                    {level:1,line:true},
                    {level:2,iryoku:"k10",name:"キュア・ウーンズ",c:13},
                    {level:5,iryoku:"k30",name:"キュア・ハート",c:13},
                    {level:10,iryoku:"k50",name:"キュア・インジャリー",c:13},
                    {level:13,iryoku:"k70",name:"キュア・モータリー",c:13},
                ],
                8:[
                    {level:3,iryoku:"k10",name:"アースハンマー",c:12},
                    {level:4,iryoku:"k10",name:"ペブルショット",c:10},
                    {level:6,iryoku:"k20",name:"ストーンブラスト",c:10},
                    {level:12,iryoku:"k40",name:"クラック",c:10},
                    {level:13,iryoku:"k50",name:"ジャイアントキック",c:12},
                    {level:1,line:true},
                    {level:3,iryoku:"k10",name:"アイスボルト",c:10},
                    {level:7,iryoku:"k10",name:"チルレイン",c:10},
                    {level:11,iryoku:"k40",name:"ウォーターエッジ",c:10},
                    {level:13,iryoku:"k30",name:"アイスストーム",c:10},
                    {level:14,iryoku:"k40",name:"フリーズ",c:10},
                    {level:15,iryoku:"k40",name:"メイルシュトローム",c:10},
                    {level:1,line:true},
                    {level:2,iryoku:"k10",name:"ファイアボルト",c:10},
                    {level:4,iryoku:"k30",name:"ヒートメタル",c:10},
                    {level:5,iryoku:"k20",name:"フレイムアロー",c:10},
                    {level:6,iryoku:"k10",name:"ファイアブラスト",c:10},
                    {level:10,iryoku:"k40",name:"ファイアストーム",c:10},
                    {level:11,iryoku:"k50",name:"ファイアジャベリン",c:10},
                    {level:13,iryoku:"k20",name:"フレイムガイザー",c:13},
                    {level:14,iryoku:"k60",name:"ファイアモーラー",c:10},
                    {level:1,line:true},
                    {level:3,iryoku:"k10",name:"ウィンドカッター",c:10},
                    {level:7,iryoku:"k20",name:"シュートアロー",c:10},
                    {level:12,iryoku:"k20",name:"ウィンドストーム",c:10},
                    {level:15,iryoku:"k40",name:"トルネード",c:10},
                ],
                9:[
                    {level:5,iryoku:"k30",name:"グレネード",c:10},
                    {level:8,iryoku:"k50",name:"パイルシューター",c:10},
                    {level:14,iryoku:"k100",name:"オメガシューター",c:10},
                    {level:15,iryoku:"k90",name:"スーパーノヴァ・ボム",c:10},
                    {level:1,line:true},
                    {level:2,iryoku:"k0",name:"ヒーリング・バレット",c:13},
                    {level:10,iryoku:"k30",name:"トリート・バレット",c:13},
                    {level:13,iryoku:"k30",name:"ヒーリングシャワー・バレット",c:13},
                    {level:9,iryoku:"k50",name:"メディカルキット",c:13},
                ],
                17:[
                    {level:2,iryoku:"k20",name:"アヴェンジャー",c:10},
                    {level:3,iryoku:"k10",name:"ヴェノムブレス",c:10},
                    {level:5,iryoku:"k10",name:"アストラルバーン",c:10},
                    {level:9,iryoku:"k40",name:"ヴェノムエスパーダ",c:10},
                    {level:13,iryoku:"k40",name:"ソウルドレイン",c:10},
                    {level:14,iryoku:"k70",name:"バーストゲート",c:10},
                    {level:15,iryoku:"k30",name:"リーサルディメンジョン",c:13},
                ],
                24:[
                    {level:3,iryoku:"dru[4,7,13]",name:"ソーンバッシュ"},
                    {level:4,iryoku:"k20",name:"フリージングブレス",c:10},
                    {level:4,iryoku:"k10",name:"ポイズンスプレッド",c:10},
                    {level:7,iryoku:"dru[12,15,18]",name:"コングスマッシュ"},
                    {level:9,iryoku:"dru[13,16,19]",name:"ボアラッシュ"},
                    {level:10,iryoku:"k20",name:"チリングブレス",c:10},
                    {level:10,iryoku:"dru[18,21,24]",name:"マルサーヴラプレス"},
                    {level:12,iryoku:"k30",name:"クライオボルト",c:10},
                    {level:13,iryoku:"k30",name:"ビームストライク",c:10},
                    {level:13,iryoku:"dru[18,21,36]",name:"フリージングブレス"},
                    {level:15,iryoku:"dru[24,27,30]",name:"ダブルストンプ"},
                    {level:15,iryoku:"k50",name:"ブレイズシャワー",c:10},
                    {level:1,line:true},
                    {level:2,iryoku:"k10",name:"ナチュラルパワー",c:13},
                    {level:12,iryoku:"k30",name:"ナチュラルパワー2",c:13},
                ],
                wizard:[
                    {level:4,iryoku:"k20",name:"トキシック・ブリーズ",c:10},
                    {level:7,iryoku:"k10",name:"ドロー・アウト",c:10},
                    {level:8,iryoku:"k10",name:"ライフ・デリバー",c:10},
                    {level:9,iryoku:"k20",name:"スリーショット・ライトニング【3本】",c:10},
                    {level:9,iryoku:"k25",name:"スリーショット・ライトニング【2本】",c:10},
                    {level:9,iryoku:"k30",name:"スリーショット・ライトニング【1本】",c:10},
                    {level:12,iryoku:"k0",name:"ギアス",c:10},
                    {level:13,iryoku:"k70",name:"デス・レイ",c:10},
                    {level:15,iryoku:"k20",name:"オーバーブロウ",c:10},
                ],
            };

            const magictype=document.getElementById("mahou");
            if(magictype.checked){
                for(let i=0;i<magic_numlist.length;i++){
                    let magic="MLv"+magic_numlist[i];
                    let lv=Number(jsondata[magic]);
                    let ginou=ginou_list[magic_numlist[i]-1];
                    if(!lv) continue;
                    writeString+=`\n//-----${ginou}\n2d+{${ginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法行使} 【${magicName_list[i]}行使判定】\n`;
                    for(let j=0;j<magic_list[magic_numlist[i]].length;j++){
                        let magic_item=magic_list[magic_numlist[i]][j];
                        if(magic_item.level<=lv){
                            if(magic_item.line) {
                                writeString+=`\n`
                                continue;
                            }
                            let critical="@"+magic_item.c;
                            if(!magic_item.c) critical="";
                            writeString+=`${magic_item.iryoku}+{${ginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法威力}${critical}　【${magic_item.name}】\n`;
                        }
                    }
                }

                //チャットパレット(ウィザード)
                if(jsondata.V_GLv5!="0"&&jsondata.V_GLv6!="0"){
                    let minlv=Math.min(Number(jsondata["MLv5"]),Number(jsondata["MLv6"]));
                    let minginou;
                    let maxginou;
                    if(minlv==Number(jsondata["MLv5"])){
                        minginou=ginou_list[4];
                        maxginou=ginou_list[5];
                    }else{
                        minginou=ginou_list[5];
                        maxginou=ginou_list[4];
                    }
                    writeString+=`\n//-----ウィザード\n2d+{${maxginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法行使} 【深智魔法行使判定】\n`;
                    for(let i=0;i<magic_list.wizard.length;i++){
                        let magic_item=magic_list.wizard[i];
                        if(magic_item.level<=minlv)
                            writeString+=`${magic_item.iryoku}+{${maxginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法威力}@${magic_item.c}　【${magic_item.name}】\n`;
                    }
                }
            }else{
                for(let i=0;i<magic_numlist.length;i++){
                    let magic="MLv"+magic_numlist[i];
                    let lv=Number(jsondata[magic]);
                    let ginou=ginou_list[magic_numlist[i]-1];
                    if(!lv) continue;
                    writeString+=`\n//-----${ginou}\n2d+{${ginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法行使} 【${magicName_list[i]}行使判定】\n`;
                    for(let j=0;j<=100;j+=10){
                        writeString+=`k${j}+{${ginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法威力}　【${magicName_list[i]}威力${j}】\n`;
                    }
                }

                //チャットパレット(ウィザード)
                if(jsondata.V_GLv5!="0"&&jsondata.V_GLv6!="0"){
                    let minlv=Math.min(Number(jsondata["MLv5"]),Number(jsondata["MLv6"]));
                    let maxginou;
                    if(minlv==Number(jsondata["MLv5"])) maxginou=ginou_list[5];
                    else maxginou=ginou_list[4];

                    writeString+=`\n//-----ウィザード\n2d+{${maxginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法行使} 【深智魔法行使判定】\n`;
                    for(let i=0;i<=100;i+=10){
                        writeString+=`k${i}+{${maxginou}}+({知力}/6)+${jsondata.MM_Tokugi}+${jsondata.arms_maryoku_sum}+{魔法威力}　【深智魔法威力${j}】\n`;
                    }
                }
            }

            //チャットパレット(戦闘特技)
            if(document.getElementById("tokugi").checked){
                writeString+="\n//-----戦闘特技\n"
                for(let i=0;i<jsondata.ST_name.length;i++){
                    writeString+=`《${jsondata.ST_name[i]}》${jsondata.ST_kouka[i]}\n`
                }
            }

            //チャットパレット(錬技)
            if(jsondata.V_GLv13!="0"){ 
                let breath="";
                writeString+=`\n//-----練技\n`;
                for(let i=0;i<jsondata.ES_name.length;i++){
                    if(!jsondata.ES_name[i]) continue;
                    writeString+=`【${jsondata.ES_name[i]}】(${jsondata.ES_koukatime[i]})${jsondata.ES_kouka[i]}\n`;
                    if(jsondata.ES_name[i].match("ブレス")) breath=`\n2d+{エンハンサー}+({知力}/6) 【ファイアブレス行使判定】\nk10+{エンハンサー}+({知力}/6) 【ファイアブレス威力】\n`;
                }
                writeString+=breath;
            }

            //チャットパレット(呪歌)
            if(jsondata.V_GLv14!="0") {
                let zyuka=`\n//-----呪歌\n2d+{バード}+({精神力}/6) 【演奏判定】\nk10+{バード}+({精神力}/6) 【終律威力10】\nk20+{バード}+({精神力}/6) 【終律威力20】\nk30+{バード}+({精神力}/6) 【終律威力30】\nk0+{バード}+({精神力}/6)@13 【終律回復0】\nk10+{バード}+({精神力}/6)@13 【終律回復10】\nk20+{バード}+({精神力}/6)@13 【終律回復20】\nk30+{バード}+({精神力}/6)@13 【終律回復30】\nk40+{バード}+({精神力}/6)@13 【終律回復40】\n`;
                if(jsondata.is_juka_senyou=="1") zyuka=zyuka.replace(/\{精神力\}/g,"({精神力}+2)");
                writeString+=zyuka;
            }

            //チャットパレット(騎芸)
            if(jsondata.V_GLv16!="0"){
                writeString+=`\n//-----騎芸\n2d+{ライダー}+({敏捷度}/6) 【騎乗判定】\n2d+{ライダー}+({知力}/6) 【弱点隠蔽判定】\n`;
                for(let i=0;i<jsondata.KG_name.length;i++){
                    if(!jsondata.KG_name[i]) continue;
                    writeString+=`《${jsondata.KG_name[i]}》${jsondata.KG_kouka[i]}\n`;
                }
            }

            //チャットパレット(賦術)
            if(jsondata.V_GLv15!="0"){
                writeString+=`\n//-----賦術\n`;
                for(let i=0;i<jsondata.HJ_name.length;i++){
                    if(!jsondata.HJ_name[i])continue;
                    writeString+=`《${jsondata.HJ_name[i]}》${jsondata.HJ_kouka[i]}\n`;
                }
            }

            //チャットパレット(鼓咆)
            if(jsondata.V_GLv18!="0"){
                writeString+=`\n//-----鼓咆\n`;
                for(let i=0;i<jsondata.HO_name.length;i++){
                    if(!jsondata.HO_name[i]) continue;
                    writeString+=`《${jsondata.HO_name[i]}》${jsondata.HO_kouka[i]}\n`;
                }

            }

            //チャットパレット(相域)
            if(jsondata.V_GLv25!="0"){
                writeString+=`\n//-----相域\n`;
                for(let i=0;i<jsondata.GEM_name.length;i++){
                    if(!jsondata.GEM_name[i]) continue;
                    writeString+=`《${jsondata.GEM_name[i]}》${jsondata.GEM_kouka[i]}\n`;
                }
            }

            writeString+=`\n</chat-palette>\n</character>`;
            writeString=writeString.replace(/\+0/g,"");

            let writeString2=[];
            const kizyucheck=document.getElementById("kizyu").checked;
            if(jsondata.horse_name&&kizyucheck) writeString2=horsemake(jsondata);
            download(writeString,writeString2,jsondata);
        })
}

//奇獣作成
function horsemake(jsondata){
    let horse2=[jsondata.horse_name].concat(jsondata.horses_name);
    let horse=[];
    for(let i=0;i<horse2.length;i++) if(horse2[i]) horse.push(horse2[i]);
    console.log(horse)
    let animaldata=[];
    let v={name:[],hp:[],mp:[],hit:[],dmg:[],evd:[],def:[],hr:[],mr:[]};
    for(let i=0;i<3;i++){
        let name=`horse${i+1}_name`;
        let hp=`horse${i+1}_hp`;
        let mp=`horse${i+1}_mp`;
        let hit=`horse${i+1}_hit`;
        let dmg=`horse${i+1}_dmg`;
        let evd=`horse${i+1}_evd`;
        let def=`horse${i+1}_mp`;
        let hr=`horse${i+1}_hr`;
        let mr=`horse${i+1}_mr`;
        v.name.push(jsondata[name]);
        v.hp.push(jsondata[hp]);
        v.mp.push(jsondata[mp]);
        v.hit.push(jsondata[hit]);
        v.dmg.push(jsondata[dmg]);
        v.evd.push(jsondata[evd]);
        v.def.push(jsondata[def]);
        v.hr.push(jsondata[hr]);
        v.mr.push(jsondata[mr]);
    }
    v.name=v.name.concat(jsondata.horsedatas_name);
    v.hp=v.hp.concat(jsondata.horsedatas_hp);
    v.mp=v.mp.concat(jsondata.horsedatas_mp);
    v.hit=v.hit.concat(jsondata.horsedatas_hit);
    v.dmg=v.dmg.concat(jsondata.horsedatas_dmg);
    v.evd=v.evd.concat(jsondata.horsedatas_evd);
    v.def=v.def.concat(jsondata.horsedatas_def);
    v.hr=v.hr.concat(jsondata.horsedatas_hr);
    v.mr=v.mr.concat(jsondata.horsedatas_mr);
    console.log(v);

    let bui1 = v.hr.findIndex(e=>{if(e.match(/\d+/)) return true});
    let bui2=v.hr.findIndex(e=>{if(e.match(/\d+/)) return true});
    for(let num=0;num<horse.length;num++){
        console.log(bui1);
        let writeString=`<?xml version="1.0" encoding="UTF-8"?>\n<character>\n  <data name="character">\n    <data name="image">\n      <data type="image" name="imageIdentifier"></data>\n    </data>    <data name="common">\n      <data name="name">${horse[num]}</data>\n      <data name="size">1</data>\n    </data>\n`;
        writeString+=`    <data name="detail">\n      <data name="リソース">\n`;

        for(let i=1;v.name[bui1];bui1++){
            writeString+=`        <data name="${v.name[bui1]}">\n          <data name="HP${i}" type="numberResource" currentValue="${v.hp[bui1]}">${v.hp[bui1]}</data>\n`;
            if(v.mp[bui1]) writeString+=`          <data name="MP${i}" type="numberResource" currentValue="${v.mp[bui1]}">${v.mp[bui1]}</data>\n`;
            writeString+=`        </data>\n`;
            i++;
        }
        bui1=v.hr.findIndex((e,index)=>{if(index>bui1&&e.match(/\d+/)) return true});
        writeString+=`      </data>\n      <data name="バフ・デバフ">\n        <data name="命中" type="numberResource" currentValue="0">5</data>\n        <data name="回避" type="numberResource" currentValue="0">5</data>\n        <data name="攻撃" type="numberResource" currentValue="0">5</data>\n        <data name="精神抵抗" type="numberResource" currentValue="0">5</data>\n        <data name="生命抵抗" type="numberResource" currentValue="0">5</data>\n      </data>\n    </data>\n  </data>\n  <chat-palette dicebot="SwordWorld2.5">`;
        writeString+=`2d+${v.mr[bui2]}+{精神抵抗}　【精神抵抗】\n2d+${v.hr[bui2]}+{生命抵抗}　【生命抵抗】\n`;
        for(;v.name[bui2];bui2++){
            writeString+=`\n[${v.name[bui2]}]\n2d+${v.hit[bui2]}+{命中} 【命中判定】\n2d+${v.dmg[bui2]}+{攻撃}　【ダメージ】\n2d+${v.evd[bui2]}+{回避}　【回避】\n`;
        }
        bui2=v.hr.findIndex((e,index)=>{if(index>bui2&&e.match(/\d+/)) return true});
        writeString+=`</chat-palette>\n</character>`;
        animaldata.push(writeString);
    }
    return animaldata;
}

function download(writeString,writeString2,jsondata){
    let zip = new JSZip();
    let date=new Date();
    const empty=""
    const image=document.getElementById("image").files[0]
    zip.file(`data0.xml`, writeString);
    for(let i=0;i<writeString2.length;i++) zip.file(`data${i+1}.xml`, writeString2[i]);
    zip.file("image.png",image)
    zip.generateAsync({type:'blob'})
    .then(function(content) {
            //ダウンロード用にリンクを作成する
            const download = document.createElement('a');
            //リンク先に上記で生成したURLを指定する
            download.href = URL.createObjectURL(content);
            //download属性にファイル名を指定する
            download.download = `xml_${jsondata.pc_name||empty}_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}${date.getMinutes()}.zip`;
            //作成したリンクをクリックしてダウンロードを実行する
            download.click();
            //createObjectURLで作成したオブジェクトURLを開放する
            (window.URL || window.webkitURL).revokeObjectURL(url);})
}      

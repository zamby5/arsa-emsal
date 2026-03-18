import { useState, useMemo, useCallback, useEffect, useRef, createContext, useContext } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ─── MARKA AYARLARI — Buradan değiştirin ───────────────── */
const BRAND = {
  firmaAdi:    "Turyap Queen",
  uzmanAdi:    "Murat İyicioğlu",
  unvan:       "Gayrimenkul Yatırım Uzmanı",
  whatsapp:    "905324564866",
  whatsappMsg: "Merhaba, arsa fizibilite raporu hakkında bilgi almak istiyorum.",
  logoUrl:     "",
  watermark:   "TURYAP QUEEN",
};

/* ─── Referans No Üretici ────────────────────────────────── */
const makeRefNo = () => {
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth()+1).padStart(2,"0");
  const r = Math.floor(Math.random()*900)+100;
  return `REF-${y}${m}-${r}`;
};


const LANGS = {
  TR: {
    appName:"Arsa Emsal", tagline:"Yatırım Karar Destek Sistemi",
    quickMode:"Hızlı Mod", proMode:"Profesyonel Mod",
    quickDesc:"4 veri gir, 10 saniyede fizibilite sonucu. Müşteri toplantısı için.",
    proDesc:"Tüm parametreler, canlı grafikler, IRR, WACC. Yatırımcı sunumu için.",
    free:"Ücretsiz · Tarayıcıda çalışır · Veri paylaşımı yok",
    back:"← Geri", goHome:"← Ana Sayfa", proSwitch:"📊 Pro Mod →",
    quickTitle:"4 veri, anında sonuç",
    quickSub:'Müşteri masasında "hemen bir bakalım" için',
    shareLink:"🔗 Link Paylaş", linkCopied:"✅ Kopyalandı!",
    printPdf:"🖨️ PDF", printLandscape:"⬛ Yatay", printPortrait:"📄 Dikey",
    liveResults:"ANLIK SONUÇLAR",
    deploy:{
      title:"🚀 Yayına Al (Ücretsiz, ~60sn)",
      vercel:"Vercel (Önerilen)", netlify:"Netlify Drop",
      vercelCmd:"npx vercel", netlifyUrl:"app.netlify.com/drop",
      vercelNote:"Terminal'de çalıştır → Soruları yanıtla → Canlı link hazır!",
      netlifyNote:"Siteye git → Klasörü sürükle-bırak → Bitti!",
      note:"GitHub hesabı ile 30sn'de kayıt — kredi kartı gerekmez",
    },
    tabs:{
      overview:"🏠 Özet", inputs:"⚙️ Girdiler", cost:"💰 Maliyet",
      revenue:"📈 Gelir & Kâr", cashflow:"🔄 Nakit & IRR",
      stress:"🔬 Stres Testi", inventory:"🏷️ Stok", plan3d:"🏢 3D Kesit",
      compare:"⚖️ A vs B", optimizer:"🎯 Optimizer", aiozet:"🤖 AI Özet", history:"📂 Geçmiş",
      doviz:"💱 Döviz", harita:"🗺️ Harita", slider:"🎚️ Simülatör",
    },
    sections:{ parcel:"⬡ PARSEL & İMAR", cost:"⬡ MALİYET", revenue:"⬡ GELİR & SATIŞ", premium:"⬡ ŞEREFİYE", wacc:"⬡ WACC / SERMAYE" },
    fields:{
      arsaAlan:"Arsa Alanı", il:"İl", ilce:"İlçe", mahalle:"Mahalle / Köy",
      adaNo:"Ada No", parselNo:"Parsel No",
      planNotu:"Plan Notu (KAKS/H/Yapı Düzeni)",
      kaks:"KAKS (Emsal)", taks:"TAKS",
      parselEn:"Parsel Eni", parselBoy:"Parsel Boyu",
      onCekme:"Ön Çekme", arkaCekme:"Arka Çekme", yanCekme:"Yan Çekmeler",
      nizam:"Nizam", bonus:"Bonus/Plan Notu",
      cikmaD:"Çıkma Derinliği", cikmaF:"Çıkma Cephesi",
      fire:"Çatı Fire Oranı", asma:"Asma Kat Oranı", bodrum:"Bodrum Kat",
      insBirim:"İnşaat Birim Maliyeti", projeG:"Proje/Ruhsat",
      altyapiG:"Altyapı Gideri", finOran:"Finansman Oranı",
      cont:"Contingency", insSure:"İnşaat Süresi",
      konutF:"Konut Fiyatı", ticariF:"Ticari Fiyat",
      dukkanByk:"Dükkan Büyüklüğü", dukkanAdet:"Dükkan Adedi",
      dubleksByk:"Dubleks Büyüklüğü", dubleksAdet:"Dubleks Adedi",
      anaByk:"Ana Daire Büyüklüğü",
      zC:"Zemin Kat", k1C:"1. Normal Kat", araC:"Ara Katlar",
      snC:"Son Kat", catiC:"Çatı/Dubleks",
      kuzey:"Kuzey Cephe", guney:"Güney/Manzara",
      ozkaynak:"Özkaynak Oranı", ozGetiri:"Özkaynak Getiri Bek.",
      krediF:"Kredi Faizi", kurumlarV:"Kurumlar Vergisi",
      projeSure:"Proje Süresi", pazOran:"Pazarlama Oranı",
      eskalOran:"Eskalasyon (aylık)", onSatisO:"Ön Satış Oranı",
    },
    kpis:{
      totalSat:"TOPLAM SATILABİLİR", kat:"KAT SAYISI",
      bb:"BAĞIMSIZ BÖLÜM", taban:"TABAN ALANI",
      maliyet:"MALİYET (Cont. dahil)", brut:"BRÜT SATIŞ",
      pazKar:"PAZ. NET KÂR", roi:"ROI / WACC",
      sKar:"ŞEREFİYE KÂR", eskKar:"ESKAL. KÂR",
      nbD:"NBD (NPV)", irr:"IRR (Yıllık)",
    },
    status:{ emsal30Ok:"✅ %30 Emsal Uygun", emsal30Fail:"🔴 %30 Aşım",
      cikmaOk:"✅ Çıkma OK", cikmaFail:"⚠️ Çıkma İhlal",
      profitOk:"✅ Kârlı", profitFail:"🔴 Zarar",
      cazip:"CAZIP", sinirda:"SINIRDA", riskli:"RİSKLİ" },
    stress:{ title:"5×5 DUYARLILIK MATRİSİ",
      worst:"🔴 Kötü\nMal+20%, Fiyat−20%",
      base:"🟡 Baz\nMevcut girdiler",
      best:"🟢 İyi\nMal−10%, Fiyat+10%",
      bep:"BAŞABAŞ ANALİZİ", bepPrice:"Başabaş Satış Fiyatı",
      bepRatio:"Mevcut/Başabaş", margin:"Güvenlik Tamponu",
      bepNote1:"Bu altında satış = zarar", bepNote2:"1.00 üzeri güvenli", bepNote3:"Fiyat ne kadar düşebilir" },
    cashflow:{ title:"NAKİT AKIŞ (3 DÖNEM)", inflow:"Satış Girişi (+)",
      outflow:"Maliyet Çıkışı (−)", net:"NET NAKİT AKIŞI",
      irr:"IRR — İÇ VERİM ORANI", periodic:"Dönemsel IRR",
      annual:"Yıllık IRR", cum:"KÜMÜLATİF NAKİT AKIŞ",
      metrics:"NAKİT AKİŞ METRİKLERİ",
      equity:"Özkaynak Tutarı", debt:"Kredi Tutarı",
      maxFin:"Maks. Fin. İhtiyacı",
    },
    cost:{ title:"MALİYET DETAYI", insMal:"İnşaat Maliyeti",
      cont:"Contingency", fin:"Finansman", other:"Diğer",
      total:"TOPLAM + CONTİNGENCY", sensitivity:"MALİYET — SATIŞ FİYATI DUYARLILIĞI",
      why:"⚠️ CONTİNGENCY NEDEN ÖNEMLİ?",
      whyText:"Zemin sürprizi, malzeme zammı, hava gecikmeleri her projede yaşanır.",
      whyNote:"Kullanılmazsa kâra eklenir; kullanılırsa projeyi kurtarır.",
    },
    revenue:{ title:"KATMANLI KÂR ANALİZİ", flat:"Düz Fiyat", premium:"+ Şerefiye",
      mkt:"+ Pazarlama", esk:"+ Eskalasyon",
      gelir:"Gelir", kar:"Net Kâr", split:"GELİR DAĞILIMI",
      residential:"Konut", commercial:"Ticari",
    },
    inventory:{ title:"TEKİL ÜNİTE STOK LİSTESİ", auto:"Şerefiye fiyatları girdilerden otomatik",
      portfolio:"Portföy Toplam", total:"TOPLAM",
      type:"Birim Tipi", floor:"Kat", facade:"Cephe",
      mult:"Çarpan", base:"Baz ₺/m²", prem:"Şer. ₺/m²",
    },
  },
  EN: {
    appName:"Land Emsal", tagline:"Investment Decision Support System",
    quickMode:"Quick Mode", proMode:"Professional Mode",
    quickDesc:"Enter 4 values, get feasibility in 10 seconds. For client meetings.",
    proDesc:"All parameters, live charts, IRR, WACC. For investor presentations.",
    free:"Free · Runs in browser · No data sharing",
    back:"← Back", goHome:"← Home", proSwitch:"📊 Pro Mode →",
    quickTitle:"4 inputs, instant results",
    quickSub:"For a quick look in client meetings",
    shareLink:"🔗 Share Link", linkCopied:"✅ Copied!",
    printPdf:"🖨️ PDF", printLandscape:"⬛ Landscape", printPortrait:"📄 Portrait",
    liveResults:"INSTANT RESULTS",
    deploy:{
      title:"🚀 Go Live (Free, ~60sec)",
      vercel:"Vercel (Recommended)", netlify:"Netlify Drop",
      vercelCmd:"npx vercel", netlifyUrl:"app.netlify.com/drop",
      vercelNote:"Run in terminal → Answer prompts → Live link ready!",
      netlifyNote:"Visit site → Drag & drop folder → Done!",
      note:"Sign up with GitHub in 30sec — no credit card needed",
    },
    tabs:{
      overview:"🏠 Overview", inputs:"⚙️ Inputs", cost:"💰 Cost",
      revenue:"📈 Revenue", cashflow:"🔄 Cash & IRR",
      stress:"🔬 Stress Test", inventory:"🏷️ Inventory", plan3d:"🏢 3D Section",
      compare:"⚖️ A vs B", optimizer:"🎯 Optimizer", aiozet:"🤖 AI Summary",
      history:"📂 History", doviz:"💱 Currency", harita:"🗺️ Map", slider:"🎚️ Simulator",
    },
    sections:{ parcel:"⬡ PARCEL & ZONING", cost:"⬡ COST", revenue:"⬡ REVENUE & SALES", premium:"⬡ PREMIUM MULTIPLIERS", wacc:"⬡ WACC / CAPITAL" },
    fields:{
      arsaAlan:"Plot Area", il:"Province", ilce:"District", mahalle:"Neighbourhood",
      adaNo:"Block No", parselNo:"Parcel No",
      planNotu:"Zoning Notes (FAR/H/Type)",
      kaks:"FAR", taks:"Ground Coverage",
      parselEn:"Plot Width", parselBoy:"Plot Depth",
      onCekme:"Front Setback", arkaCekme:"Rear Setback", yanCekme:"Side Setbacks",
      nizam:"Building Type", bonus:"FAR Bonus",
      cikmaD:"Proj. Depth", cikmaF:"Proj. Width",
      fire:"Roof Loss Ratio", asma:"Mezzanine Ratio", bodrum:"Basement",
      insBirim:"Construction Cost", projeG:"Project/Permit",
      altyapiG:"Infrastructure", finOran:"Financing Rate",
      cont:"Contingency", insSure:"Construction Period",
      konutF:"Residential Price", ticariF:"Commercial Price",
      dukkanByk:"Shop Size", dukkanAdet:"No. Shops",
      dubleksByk:"Duplex Size", dubleksAdet:"No. Duplexes",
      anaByk:"Apt Size",
      zC:"Ground Floor", k1C:"1st Floor", araC:"Middle Floors",
      snC:"Top Floor", catiC:"Roof/Duplex",
      kuzey:"North Facade", guney:"South/View",
      ozkaynak:"Equity Ratio", ozGetiri:"Expected Equity Return",
      krediF:"Loan Rate", kurumlarV:"Corp. Tax",
      projeSure:"Project Duration", pazOran:"Marketing Rate",
      eskalOran:"Monthly Escalation", onSatisO:"Pre-sale Ratio",
    },
    kpis:{
      totalSat:"TOTAL SALEABLE", kat:"FLOORS",
      bb:"UNITS", taban:"FOOTPRINT",
      maliyet:"COST (w/ Cont.)", brut:"GROSS SALES",
      pazKar:"NET PROFIT", roi:"ROI / WACC",
      sKar:"PREMIUM PROFIT", eskKar:"ESCALATION PROFIT",
      nbD:"NPV", irr:"IRR (Annual)",
    },
    status:{ emsal30Ok:"✅ 30% Limit OK", emsal30Fail:"🔴 30% Exceeded",
      cikmaOk:"✅ Projection OK", cikmaFail:"⚠️ Proj. Violation",
      profitOk:"✅ Profitable", profitFail:"🔴 Loss",
      cazip:"ATTRACTIVE", sinirda:"BORDERLINE", riskli:"RISKY" },
    stress:{ title:"5×5 SENSITIVITY MATRIX",
      worst:"🔴 Worst\nCost+20%, Price−20%",
      base:"🟡 Base\nCurrent inputs",
      best:"🟢 Best\nCost−10%, Price+10%",
      bep:"BREAK-EVEN ANALYSIS", bepPrice:"Break-even Price",
      bepRatio:"Current/BEP", margin:"Safety Margin",
      bepNote1:"Below this = loss", bepNote2:"Above 1.00 = safe", bepNote3:"How much can price drop" },
    cashflow:{ title:"CASH FLOW (3 PERIODS)", inflow:"Sales Inflow (+)",
      outflow:"Cost Outflow (−)", net:"NET CASH FLOW",
      irr:"IRR — INTERNAL RATE OF RETURN", periodic:"Periodic IRR",
      annual:"Annualized IRR", cum:"CUMULATIVE CASH FLOW",
      metrics:"CASH FLOW METRICS",
      equity:"Equity Amount", debt:"Debt Amount",
      maxFin:"Max Finance Need",
    },
    cost:{ title:"COST BREAKDOWN", insMal:"Construction",
      cont:"Contingency", fin:"Financing", other:"Other",
      total:"TOTAL + CONTINGENCY", sensitivity:"COST vs PRICE SENSITIVITY",
      why:"⚠️ WHY CONTINGENCY MATTERS?",
      whyText:"Ground issues, material costs, delays happen in every project.",
      whyNote:"Unused = added to profit; used = saves the project.",
    },
    revenue:{ title:"LAYERED PROFIT ANALYSIS", flat:"Flat Price", premium:"+ Premium",
      mkt:"+ Marketing", esk:"+ Escalation",
      gelir:"Revenue", kar:"Net Profit", split:"REVENUE SPLIT",
      residential:"Residential", commercial:"Commercial",
    },
    inventory:{ title:"UNIT INVENTORY", auto:"Premium prices auto-calc from inputs",
      portfolio:"Total Portfolio", total:"TOTAL",
      type:"Type", floor:"Floor", facade:"Facade",
      mult:"Mult.", base:"Base ₺/m²", prem:"Prem. ₺/m²",
    },
  },
};

/* ─── Theme ─────────────────────────────────────────────── */
const DARK = {
  bg:"#05090f", bg2:"#080e18", bg3:"#0d1a28", bg4:"#091220",
  border:"#1a2a3a", border2:"#2a3a4a",
  text:"#d8cfc0", text2:"#8090a0", text3:"#506070",
  accent:"#c9a84c", accentLow:"#c9a84c30",
  nav:"#040c16", navBorder:"#c9a84c25",
  card:"#080e18",
  input:"#0d1f32", inputText:"#f9e84d",
  green:"#22c55e", red:"#ef4444", blue:"#3b82f6",
  purple:"#8b5cf6", teal:"#14b8a6",
  chartGrid:"#1a2a3a", tooltipBg:"#080e18",
  isDark: true,
};
const LIGHT = {
  bg:"#f4f0e8", bg2:"#ffffff", bg3:"#faf7f1", bg4:"#ede8dc",
  border:"#d4cdc0", border2:"#bfb8ab",
  text:"#2a2018", text2:"#6b5c48", text3:"#9a8c78",
  accent:"#7a5c10", accentLow:"#7a5c1020",
  nav:"#1a1208", navBorder:"#c9a84c40",
  card:"#ffffff",
  input:"#faf7f1", inputText:"#5c4010",
  green:"#15803d", red:"#dc2626", blue:"#1d4ed8",
  purple:"#6d28d9", teal:"#0f766e",
  chartGrid:"#e8e0d4", tooltipBg:"#ffffff",
  isDark: false,
};

/* ─── Context ───────────────────────────────────────────── */
const Ctx = createContext({ th: DARK, lang: "TR", t: LANGS.TR });
const useCtx = () => useContext(Ctx);

/* ─── Calculation Engine ────────────────────────────────── */
function calc(g) {
  const n = (v, d = 0) => { const p = parseFloat(v); return isNaN(p) ? d : p; };
  const arsaAlan=n(g.arsaAlan,1000), kaks_raw=n(g.kaks,1.5), taks_raw=n(g.taks,0.4);

  // Plan notu otomatik parse — "KAKS:2.0 TAKS:0.4 H:9.50 AYRK" gibi metni okur
  const planNotu = (g.planNotu||"").toUpperCase();
  const parsePN = (key, fallback) => {
    const m = planNotu.match(new RegExp(key+"[=:\\s]+([0-9.]+)"));
    return m ? parseFloat(m[1]) : fallback;
  };
  const kaks = parsePN("KAKS|E", kaks_raw);
  const taks = parsePN("TAKS", taks_raw);
  const planH = parsePN("H|YUKSEKLIK", 0); // 0 = imar planında belirtilmemiş
  const pEn=n(g.parselEn,20), pBoy=n(g.parselBoy,50);
  const onC=n(g.onCekme,5), arkaC=n(g.arkaCekme,3), yanC=n(g.yanCekme,6);
  const bonus=n(g.bonus,0), cikmaD=n(g.cikmaD,1.5), cikmaF=n(g.cikmaF,13);
  const fire=n(g.fire,0.45), asma=n(g.asma,0.30), bodrum=n(g.bodrum,0);
  const insBirim=n(g.insBirim,20000), projeG=n(g.projeG,150000);
  const altyapiG=n(g.altyapiG,100000), finOran=n(g.finOran,0.10);
  const cont=n(g.cont,0.05), insSure=n(g.insSure,18);
  const konutF=n(g.konutF,35000), ticariF=n(g.ticariF,50000);
  const dukkanByk=n(g.dukkanByk,120), dukkanAdet=n(g.dukkanAdet,2);
  const dubleksByk=n(g.dubleksByk,160), dubleksAdet=n(g.dubleksAdet,1);
  const anaByk=n(g.anaByk,90), eskalOran=n(g.eskalOran,0.03);
  const onSatisO=n(g.onSatisO,0.3), insSatisO=n(g.insSatisO,0.5);
  const ozkaynak=n(g.ozkaynak,0.4), ozGetiri=n(g.ozGetiri,0.30);
  const krediF=n(g.krediF,0.42), kurumlarV=n(g.kurumlarV,0.25);
  const projeSure=n(g.projeSure,1.5), pazOran=n(g.pazOran,0.04);
  const zC=n(g.zC,0.88), k1C=n(g.k1C,0.93), araC=n(g.araC,1.0);
  const snC=n(g.snC,1.08), catiC=n(g.catiC,1.18);
  const kuzey=n(g.kuzey,-0.05), guney=n(g.guney,0.07);
  const nizam = g.nizam || "AYRK";

  const etkinYan = nizam==="BİLEŞ"?0:nizam==="İKİZ"?yanC/2:yanC;
  const binaEni = Math.max(0, pEn - etkinYan);
  const taban = Math.min(arsaAlan*taks, Math.max(0, binaEni*(pBoy-onC-arkaC)));
  const yasalEmsal = arsaAlan * kaks * (1+bonus);
  const cikmaAlan = cikmaF * cikmaD;
  const normalKat = taban + cikmaAlan;
  const katSayisi = normalKat>0 ? (yasalEmsal>taban ? Math.max(1,1+Math.floor((yasalEmsal-taban)/normalKat)) : 1) : 1;
  const catiPiyes = normalKat * (1-fire);
  const asmaKat = taban * Math.min(asma, 0.5);
  const bodrumKaz = taban * bodrum;
  const emsalDisi = (katSayisi>1?(katSayisi-1)*cikmaAlan:0) + catiPiyes + asmaKat;
  const emsalUygun = yasalEmsal>0 && emsalDisi <= yasalEmsal*0.3;
  const cikmaUygun = (onC-cikmaD) >= 3;
  const toplamSat = yasalEmsal + emsalDisi + bodrumKaz;
  const ticariM2 = dukkanAdet * dukkanByk;
  const konutM2 = Math.max(0, toplamSat - ticariM2);
  const kalan = Math.max(0, toplamSat - ticariM2 - dubleksAdet*dubleksByk);
  const anaAdet = anaByk>0 ? Math.floor(kalan/anaByk) : 0;
  const bbSayisi = dukkanAdet + dubleksAdet + anaAdet;
  const insMal = toplamSat * insBirim;
  const contingency = insMal * cont;
  const finG = insMal * finOran;
  const topMal = insMal + finG + projeG + altyapiG + contingency;
  const konutGelir = konutM2 * konutF, ticariGelir = ticariM2 * ticariF;
  const brutSatis = konutGelir + ticariGelir;
  const netKar = brutSatis - topMal;
  const karMarji = brutSatis>0 ? netKar/brutSatis : 0;
  const roi = topMal>0 ? netKar/topMal : 0;
  const sGelir = (
    taban*konutF*zC +
    (katSayisi>=2 ? normalKat*konutF*k1C : 0) +
    (katSayisi>=4 ? (katSayisi-3)*normalKat*konutF*araC : 0) +
    (katSayisi>=3 ? normalKat*konutF*snC : 0) +
    (catiPiyes+asmaKat)*konutF*catiC
  ) * (1+guney*0.3+kuzey*0.3) + ticariGelir;
  const sKar = sGelir - topMal;
  const eskMal = insMal*(1+eskalOran*insSure*0.65)+finG*(1+eskalOran*insSure*0.65)+projeG+altyapiG+contingency;
  const eskKar = sGelir - eskMal;
  const karErime = sKar!==0 ? Math.max(0,(sKar-eskKar)/Math.abs(sKar)) : 0;
  const pazGider = brutSatis*pazOran, pazKar = sGelir-topMal-pazGider;
  const pazMarji = sGelir>0 ? pazKar/sGelir : 0;
  const krediOran = 1-ozkaynak, netKrediF = krediF*(1-kurumlarV);
  const wacc = ozkaynak*ozGetiri + krediOran*netKrediF;
  const hurdle = wacc+0.05;
  const ozTutar = topMal*ozkaynak, krediTutar = topMal*krediOran;
  const projRoi = ozTutar>0 ? pazKar/ozTutar : 0;
  const waccKarar = projRoi>hurdle?"CAZIP":projRoi>wacc?"SINIRDA":"RİSKLİ";
  const nbD = pazKar/Math.pow(1+wacc,projeSure) - ozTutar;
  const cf0 = -ozTutar;
  const cf1 = brutSatis*onSatisO + brutSatis*insSatisO - (topMal-ozTutar)*0.6;
  const cf2 = brutSatis*(1-onSatisO-insSatisO) - (topMal-ozTutar)*0.4;
  let irrVal=null; let lo=-0.99, hi=10;
  for(let i=0;i<300;i++){
    const m=(lo+hi)/2;
    const npv=cf0+cf1/(1+m)+cf2/Math.pow(1+m,2);
    if(Math.abs(npv)<100){irrVal=m;break;}
    if(npv>0)lo=m;else hi=m;
  }
  const irrYillik = irrVal!==null ? Math.pow(1+irrVal, 12/(insSure/2))-1 : null;
  return {
    planH, kaks, taks,
    taban,binaEni,yasalEmsal,normalKat,katSayisi,catiPiyes,asmaKat,bodrumKaz,
    emsalDisi,emsalUygun,cikmaUygun,toplamSat,ticariM2,konutM2,anaAdet,bbSayisi,
    insMal,contingency,finG,topMal,konutGelir,ticariGelir,brutSatis,netKar,karMarji,roi,
    sGelir,sKar,eskKar,karErime,pazGider,pazKar,pazMarji,
    wacc,hurdle,projRoi,waccKarar,nbD,ozTutar,krediTutar,irrVal,irrYillik,cf0,cf1,cf2
  };
}

/* ─── Defaults ──────────────────────────────────────────── */
const D = {
  musteriAdi:"", refNo: makeRefNo(),
  arsaAlan:1000, il:"", ilce:"", mahalle:"", adaNo:"", parselNo:"", planNotu:"",
  kaks:1.5, taks:0.4, parselEn:20, parselBoy:50,
  onCekme:5,arkaCekme:3,yanCekme:6,bonus:0,nizam:"AYRK",
  cikmaD:1.5,cikmaF:13,fire:0.45,asma:0.30,bodrum:0,
  insBirim:20000,projeG:150000,altyapiG:100000,finOran:0.10,cont:0.05,insSure:18,
  konutF:35000,ticariF:50000,dukkanByk:120,dukkanAdet:2,
  dubleksByk:160,dubleksAdet:1,anaByk:90,
  eskalOran:0.03,onSatisO:0.3,insSatisO:0.5,
  ozkaynak:0.4,ozGetiri:0.30,krediF:0.42,kurumlarV:0.25,projeSure:1.5,pazOran:0.04,
  zC:0.88,k1C:0.93,araC:1.00,snC:1.08,catiC:1.18,kuzey:-0.05,guney:0.07,
};

/* ─── Formatters ────────────────────────────────────────── */
const ƒ = {
  tl:(v)=>{if(v==null||isNaN(v))return"—";const a=Math.abs(v);const s=v<0?"−":"";return s+(a>=1e6?(a/1e6).toFixed(1)+" M₺":a>=1e3?(a/1e3).toFixed(0)+" K₺":a.toFixed(0)+" ₺");},
  tlF:(v)=>v==null?"—":new Intl.NumberFormat("tr-TR",{maximumFractionDigits:0}).format(v)+" ₺",
  pct:(v,d=1)=>v==null||isNaN(v)?"—":(v*100).toFixed(d)+"%",
  m2:(v)=>v==null||isNaN(v)?"—":Math.round(v).toLocaleString("tr-TR")+" m²",
  num:(v)=>Math.round(v).toLocaleString("tr-TR"),
};

/* ─── URL State ─────────────────────────────────────────── */
const encState = (inp) => { try { return btoa(unescape(encodeURIComponent(JSON.stringify(inp)))); } catch { return ""; } };
const decState = (s) => { try { return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch { return null; } };
const getInit = () => {
  try {
    const s = new URL(window.location.href).searchParams.get("s");
    if (s) { const d = decState(s); if (d) return {...D,...d}; }
  } catch {}
  return D;
};

/* ─── AnimNum ────────────────────────────────────────────── */
function AnimNum({ value, fmt }) {
  const [disp, setDisp] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const s = prev.current, e = typeof value==="number" ? value : 0;
    if (s === e) return;
    const dur=500, t0=performance.now();
    const frame = t => {
      const p = Math.min(1,(t-t0)/dur);
      const ease = 1-Math.pow(1-p,3);
      setDisp(s+(e-s)*ease);
      if(p<1) requestAnimationFrame(frame);
      else { setDisp(e); prev.current=e; }
    };
    requestAnimationFrame(frame);
  }, [value]);
  return <>{fmt(typeof disp==="number" ? disp : 0)}</>;
}

/* ─── Input ─────────────────────────────────────────────── */
function Inp({ label, field, unit, step="any", min, max, options, tip, inp, set }) {
  const { th } = useCtx();
  const base = { background:th.input, border:`1px solid ${th.inputBorder||th.accent+"60"}`, color:th.inputText||th.accent, borderRadius:6, padding:"7px 10px", fontSize:12, fontFamily:"inherit", flex:1, outline:"none" };
  const btnStyle = { background:th.input, border:`1px solid ${th.accent}60`, color:th.accent, borderRadius:5, width:28, height:28, cursor:"pointer", fontSize:16, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, userSelect:"none", transition:"background 0.15s" };
  const stepNum = step === "any" ? 1 : parseFloat(step) || 1;
  const handleStep = (dir) => {
    const cur = parseFloat(inp[field]) || 0;
    const next = Math.round((cur + dir * stepNum) * 10000) / 10000;
    if (min !== undefined && next < min) return;
    if (max !== undefined && next > max) return;
    set(field, next);
  };
  return (
    <div style={{ marginBottom:11 }}>
      <label style={{ display:"block", fontSize:10, color:th.text3, marginBottom:3, letterSpacing:"0.07em" }}>
        {label}{tip && <span title={tip} style={{ marginLeft:3, cursor:"help", color:th.text3 }}>ⓘ</span>}
      </label>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        {options ? (
          <select value={inp[field]} onChange={e=>set(field,e.target.value)}
            style={{ ...base, cursor:"pointer" }}>
            {options.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <>
            <button onMouseDown={()=>handleStep(-1)} style={btnStyle}
              onMouseEnter={e=>e.currentTarget.style.background=th.accent+"30"}
              onMouseLeave={e=>e.currentTarget.style.background=th.input}>−</button>
            <input type="number" value={inp[field]} step={step} min={min} max={max}
              onChange={e=>set(field, parseFloat(e.target.value)||0)}
              style={{ ...base, textAlign:"center", fontFamily:"'Courier Prime',monospace", fontWeight:700 }} />
            <button onMouseDown={()=>handleStep(1)} style={btnStyle}
              onMouseEnter={e=>e.currentTarget.style.background=th.accent+"30"}
              onMouseLeave={e=>e.currentTarget.style.background=th.input}>+</button>
          </>
        )}
        {unit && <span style={{ fontSize:9, color:th.text3, minWidth:24 }}>{unit}</span>}
      </div>
    </div>
  );
}

/* ─── KPI Card ──────────────────────────────────────────── */
function Kpi({ label, value, sub, accent, warn=false, fmt }) {
  const { th } = useCtx();
  const ac = accent || th.accent;
  const fmtFn = fmt || (typeof value==="string" ? (()=>value) : ƒ.tl);
  return (
    <div style={{ background:warn?th.red+"12":th.card, border:`1px solid ${warn?th.red+"40":ac+"35"}`, borderTop:`2px solid ${warn?th.red:ac}`, borderRadius:8, padding:"11px 13px", transition:"transform 0.15s", cursor:"default" }}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{ fontSize:9, color:th.text3, letterSpacing:"0.1em", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:17, fontWeight:700, color:warn?th.red:th.text, lineHeight:1, fontFamily:"'Courier Prime',monospace" }}>
        <AnimNum value={typeof value==="number"?value:0} fmt={fmtFn} />
      </div>
      {sub && <div style={{ fontSize:9, color:th.text3, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

/* ─── SecTitle ──────────────────────────────────────────── */
function SecTitle({ children, color }) {
  const { th } = useCtx();
  const c = color || th.accent;
  return (
    <div style={{ fontSize:10, color:c, fontWeight:700, letterSpacing:"0.12em", marginBottom:11, paddingBottom:5, borderBottom:`1px solid ${c}30` }}>
      {children}
    </div>
  );
}

/* ─── Status Badge ──────────────────────────────────────── */
function Badge({ ok, okText, failText }) {
  const { th } = useCtx();
  return (
    <span style={{ background:ok?th.green+"18":th.red+"18", border:`1px solid ${ok?th.green+"45":th.red+"45"}`, color:ok?th.green:th.red, fontSize:11, fontWeight:600, padding:"5px 13px", borderRadius:20 }}>
      {ok ? okText : failText}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [lang,   setLang]   = useState("TR");
  const [mode,   setMode]   = useState("splash");
  const [tab,    setTab]    = useState("overview");
  const [inp,    setInp]    = useState(getInit);
  const [copied, setCopied] = useState(false);
  const [anim,   setAnim]   = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const [scenarioA, setScenarioA] = useState(null); // saved A scenario
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiApiKey, setAiApiKey] = useState(() => { try { return localStorage.getItem("ai_key")||""; } catch { return ""; } });
  const [kurlar, setKurlar] = useState({ USD:null, EUR:null, GBP:null, RUB:null });
  const [kurLoading, setKurLoading] = useState(false);
  const [sliderMal, setSliderMal] = useState(0);
  const [sliderFiy, setSliderFiy] = useState(0);
  const [haritaLat, setHaritaLat] = useState("");
  const [haritaLng, setHaritaLng] = useState("");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("arsa_history")||"[]"); } catch { return []; }
  });

  // Geçmişe kaydet (2sn debounce) - r yerine calc'ı direkt çağır
  useEffect(() => {
    const t = setTimeout(() => {
      if (!inp.arsaAlan) return;
      const rr = calc(inp);
      const entry = {
        refNo: inp.refNo || makeRefNo(),
        ts: Date.now(),
        musteriAdi: inp.musteriAdi||"",
        il: inp.il||"", ilce: inp.ilce||"",
        arsaAlan: inp.arsaAlan, kaks: inp.kaks,
        pazKar: rr.pazKar, pazMarji: rr.pazMarji,
        inp: {...inp},
      };
      setHistory(prev => {
        const filtered = prev.filter(h=>h.refNo!==entry.refNo);
        const next = [entry,...filtered].slice(0,10);
        try { localStorage.setItem("arsa_history", JSON.stringify(next)); } catch {}
        return next;
      });
    }, 2000);
    return () => clearTimeout(t);
  }, [inp]);

  // Orientation detection
  useEffect(() => {
    const update = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? "landscape" : "portrait");
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", () => setTimeout(update, 100));
    return () => { window.removeEventListener("resize", update); };
  }, []);

  // Fullscreen API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const th = isDark ? DARK : LIGHT;
  const t  = LANGS[lang];
  const r  = useMemo(() => calc(inp), [inp]);
  const set = useCallback((k,v) => setInp(p=>({...p,[k]:v})), []);

  useEffect(() => { if (mode!=="splash") setAnim(true); }, [mode]);

  const goMode = m => { setAnim(false); setTimeout(()=>{ setMode(m); setAnim(true); },180); };

  const share = () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?s=${encState(inp)}`;
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      else { const el=document.createElement("input"); el.value=url; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
      setCopied(true); setTimeout(()=>setCopied(false),2500);
    } catch {}
  };

  // Inject responsive CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "responsive-css";
    style.textContent = `
      @media (orientation: landscape) and (max-height: 500px) {
        .quick-grid { grid-template-columns: repeat(4, 1fr) !important; }
        .quick-results { grid-template-columns: repeat(6, 1fr) !important; }
      }
      :fullscreen .pro-content { padding: 24px !important; }
      @keyframes pulse {
        0%,100% { box-shadow: 0 4px 16px rgba(201,168,76,0.5); transform: scale(1); }
        50% { box-shadow: 0 4px 24px rgba(201,168,76,0.8); transform: scale(1.05); }
      }
      @media print {
        .no-print { display: none !important; }
        .print-header { display: block !important; }
        /* Sadece görünen içeriği yazdır */
        body { background: white !important; color: #1a1a1a !important; }
        /* Tab navigation gizle */
        [class*="tab"] button { display: none !important; }
        /* Overflow olan içerikleri kır */
        * { overflow: visible !important; }
        /* Sayfa kırılmasını zorla */
        .pro-content > div > div { page-break-inside: avoid; }
        /* Grafik container yüksekliği */
        .recharts-wrapper { max-height: 250px !important; }
        /* Gereksiz boşlukları kaldır */
        @page { margin: 15mm; }
        @page :first { margin-top: 5mm; }
        /* Tek sayfa için küçült */
        .pro-content { font-size: 11px !important; }
        /* Sekme içeriği — sadece aktif olan */
        .tab-content-hidden { display: none !important; }
      }
    `;
    const existing = document.getElementById("responsive-css");
    if (existing) existing.remove();
    document.head.appendChild(style);
  }, []);

  const ctxVal = { th, lang, t };

  // WhatsApp mesaj linki
  const makeWALink = () => {
    const ref = inp.refNo || "—";
    const loc = [inp.il, inp.ilce, inp.mahalle].filter(Boolean).join("/") || "Belirtilmemiş";
    const msg = encodeURIComponent(
      `${BRAND.whatsappMsg}\n\n📋 Referans: ${ref}\n📍 Lokasyon: ${loc}\n📐 Arsa: ${inp.arsaAlan}m² | KAKS: ${r.kaks?.toFixed(2)||inp.kaks}\n💰 Net Kâr Tahmini: ${ƒ.tl(r.pazKar)}`
    );
    return `https://wa.me/${BRAND.whatsapp}?text=${msg}`;
  };

  /* ── Clippy Maskot ─────────────────────────────────── */
  const CLIPPY_TIPS = lang==="TR" ? [
    { icon:"🏗️", text:"Hızlı Mod'da 4 veri girin — 10 saniyede fizibilite hazır!" },
    { icon:"⚖️", text:"A vs B sekmesiyle iki senaryoyu karşılaştırın. Yatırımcı her zaman sorar!" },
    { icon:"💱", text:"Döviz sekmesinden anlık USD/EUR kuru çekip raporu dövizli gösterin." },
    { icon:"🎚️", text:"Simülatörde maliyet kaydırıcısını +15 yapın — kâr ne oldu?" },
    { icon:"🤖", text:"AI Özet sekmesi tüm verileri okuyup yatırımcı raporu yazar." },
    { icon:"🗺️", text:"Harita sekmesine koordinat girin, müşteri parseli haritada görsün." },
    { icon:"🔗", text:"Link Paylaş butonu tüm hesaplamayı URL'ye gömer — WhatsApp'a atın." },
    { icon:"📋", text:"Plan notuna 'KAKS:1.50 TAKS:0.40' yazın — otomatik uygulanır!" },
    { icon:"🎯", text:"Optimizer 6 farklı birim karışımını test eder, en kârlısını gösterir." },
    { icon:"📄", text:"PDF için 📄 dikey veya 🖨️ yatay — müşteriye yatay daha etkileyici!" },
  ] : [
    { icon:"🏗️", text:"Quick Mode: Enter 4 values, get feasibility in 10 seconds!" },
    { icon:"⚖️", text:"Use A vs B to compare scenarios. Investors always ask!" },
    { icon:"💱", text:"Fetch live USD/EUR rates in the Currency tab." },
    { icon:"🎚️", text:"Try the Simulator — slide cost to +15% and see profit impact." },
    { icon:"🤖", text:"AI Summary generates a full investor report from your data." },
    { icon:"🔗", text:"Share Link embeds all calculations in a URL." },
  ];
  const [clippyIdx,     setClippyIdx]     = useState(0);
  const [clippyVisible, setClippyVisible] = useState(true);
  const [clippyMin,     setClippyMin]     = useState(false);
  const [clippyAnim,    setClippyAnim]    = useState(false);

  const nextTip = useCallback(()=>{
    setClippyAnim(true);
    setTimeout(()=>{ setClippyIdx(i=>(i+1)%10); setClippyAnim(false); },200);
  },[]);

  useEffect(()=>{ const t=setInterval(nextTip,6000); return()=>clearInterval(t); },[nextTip]);

  const ClippyWidget = () => !clippyVisible ? null : (
    <div className="no-print" style={{ position:"fixed", bottom:76, right:20, zIndex:9998, fontFamily:"inherit" }}>
      {!clippyMin && (
        <div style={{ background:isDark?"#0d1a28":"#fffde7", border:`2px solid ${th.accent}`, borderRadius:14, padding:14, maxWidth:230, marginBottom:8, boxShadow:`0 8px 28px ${th.accent}35`, position:"relative", opacity:clippyAnim?0:1, transform:clippyAnim?"translateY(4px)":"translateY(0)", transition:"opacity 0.2s, transform 0.2s" }}>
          <div style={{ position:"absolute", bottom:-10, right:22, width:0, height:0, borderLeft:"8px solid transparent", borderRight:"8px solid transparent", borderTop:`10px solid ${th.accent}` }} />
          <div style={{ position:"absolute", bottom:-8, right:23, width:0, height:0, borderLeft:"7px solid transparent", borderRight:"7px solid transparent", borderTop:`9px solid ${isDark?"#0d1a28":"#fffde7"}` }} />
          <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{CLIPPY_TIPS[clippyIdx].icon}</span>
            <span style={{ fontSize:11, color:th.text, lineHeight:1.65 }}>{CLIPPY_TIPS[clippyIdx].text}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:3 }}>
              {CLIPPY_TIPS.slice(0,6).map((_,i)=>(
                <div key={i} onClick={()=>setClippyIdx(i)} style={{ width:5, height:5, borderRadius:"50%", background:i===clippyIdx%6?th.accent:th.border, cursor:"pointer" }} />
              ))}
            </div>
            <div style={{ display:"flex", gap:3 }}>
              <button onClick={nextTip} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text3, borderRadius:4, padding:"1px 6px", cursor:"pointer", fontSize:9, fontFamily:"inherit" }}>→</button>
              <button onClick={()=>setClippyMin(true)} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text3, borderRadius:4, padding:"1px 6px", cursor:"pointer", fontSize:9, fontFamily:"inherit" }}>−</button>
              <button onClick={()=>setClippyVisible(false)} style={{ background:"transparent", border:`1px solid ${th.red}50`, color:th.red, borderRadius:4, padding:"1px 6px", cursor:"pointer", fontSize:9, fontFamily:"inherit" }}>✕</button>
            </div>
          </div>
        </div>
      )}
      <div onClick={()=>setClippyMin(m=>!m)} title={lang==="TR"?"İpuçları":"Tips"}
        style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${th.accent},#e8c060)`, border:`2px solid ${th.accent}80`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, cursor:"pointer", boxShadow:`0 4px 16px ${th.accent}50`, marginLeft:"auto", transition:"transform 0.2s", userSelect:"none", animation:clippyMin?"none":"pulse 3s ease-in-out infinite" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12) rotate(-8deg)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1) rotate(0)"}>
        🏗️
      </div>
    </div>
  );
  const Controls = () => {
    const printWithOrientation = (landscape) => {
      // Aktif olmayan sekme içeriklerini gizle
      const allTabDivs = document.querySelectorAll(".tab-panel");
      allTabDivs.forEach(d => d.classList.add("tab-content-hidden"));
      const activeTab = document.querySelector(`.tab-panel-${tab}`);
      if (activeTab) activeTab.classList.remove("tab-content-hidden");

      const style = document.createElement("style");
      style.id = "print-orientation";
      style.textContent = `@media print { @page { size: ${landscape ? "A4 landscape" : "A4 portrait"}; } }`;
      const existing = document.getElementById("print-orientation");
      if (existing) existing.remove();
      document.head.appendChild(style);
      window.print();

      // Print sonrası geri al
      setTimeout(()=>{
        allTabDivs.forEach(d => d.classList.remove("tab-content-hidden"));
      }, 1000);
    };
    return (
    <div className="no-print" style={{ display:"flex", gap:5, alignItems:"center" }}>
      <button onClick={()=>setLang(l=>l==="TR"?"EN":"TR")}
        style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text2, borderRadius:5, padding:"4px 9px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
        {lang==="TR"?"🇬🇧 EN":"🇹🇷 TR"}
      </button>
      <button onClick={()=>setIsDark(d=>!d)}
        style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text2, borderRadius:5, padding:"4px 8px", cursor:"pointer", fontSize:12 }}>
        {isDark?"☀️":"🌙"}
      </button>
      <button onClick={share}
        style={{ background:copied?th.green+"20":"transparent", border:`1px solid ${copied?th.green:th.border}`, color:copied?th.green:th.text2, borderRadius:5, padding:"4px 10px", cursor:"pointer", fontSize:10, fontFamily:"inherit", transition:"all 0.2s" }}>
        {copied ? t.linkCopied : t.shareLink}
      </button>
      <button onClick={()=>printWithOrientation(false)}
        style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text2, borderRadius:5, padding:"4px 8px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}
        title="Dikey / Portrait">
        📄
      </button>
      <button onClick={()=>printWithOrientation(true)}
        style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text2, borderRadius:5, padding:"4px 8px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}
        title="Yatay / Landscape">
        🖨️
      </button>
      <button onClick={toggleFullscreen}
        style={{ background:isFullscreen?th.accent+"20":"transparent", border:`1px solid ${isFullscreen?th.accent:th.border}`, color:isFullscreen?th.accent:th.text2, borderRadius:5, padding:"4px 8px", cursor:"pointer", fontSize:12 }}
        title={isFullscreen?"Tam Ekrandan Çık":"Tam Ekran"}>
        {isFullscreen ? "⊡" : "⛶"}
      </button>
      <a href={makeWALink()} target="_blank" rel="noopener noreferrer"
        style={{ background:"linear-gradient(135deg,#25d366,#128c7e)", border:"none", color:"white", borderRadius:5, padding:"4px 10px", cursor:"pointer", fontSize:10, fontWeight:700, fontFamily:"inherit", textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}
        title={lang==="TR"?"Uzmanla Görüş (WhatsApp)":"Consult Expert (WhatsApp)"}>
        💬 {lang==="TR"?"Uzmanla Görüş":"Ask Expert"}
      </a>
    </div>
    );
  };

  const CC = [th.accent, th.blue, th.green, "#f59e0b", th.purple, "#ec4899", th.teal, "#f97316"];
  const TT = { fontSize:9, fill:th.text3 };
  const tipStyle = { background:th.tooltipBg, border:`1px solid ${th.border2}`, fontSize:10, color:th.text };

  /* ═══════════════════════════════════════════════════
     SPLASH
  ═══════════════════════════════════════════════════ */
  if (mode==="splash") return (
    <Ctx.Provider value={ctxVal}>
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:isDark?"radial-gradient(ellipse at 35% 40%, #0d2a40, #070e18 60%, #020608)":"linear-gradient(135deg,#f9f5ec,#ede7d9)", fontFamily:"'Palatino Linotype',Palatino,serif", position:"relative", overflow:"hidden" }}>
      {/* Grid texture */}
      <div style={{ position:"absolute", inset:0, opacity:isDark?0.03:0.05, backgroundImage:`linear-gradient(${th.accent} 1px,transparent 1px),linear-gradient(90deg,${th.accent} 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" }} />
      {/* Controls */}
      <div className="no-print" style={{ position:"absolute", top:16, right:20 }}>
        <Controls />
      </div>
      <div style={{ position:"relative", textAlign:"center", maxWidth:680, padding:"0 28px" }}>
        <div style={{ fontSize:10, letterSpacing:"0.35em", color:th.accent+"80", marginBottom:18 }}>◆ {t.appName.toUpperCase()} ◆</div>
        <h1 style={{ fontSize:"clamp(32px,5.5vw,64px)", fontWeight:400, color:th.text, margin:0, lineHeight:1.1, letterSpacing:"-0.02em" }}>
          {lang==="TR" ? "Yatırım Karar" : "Investment Decision"}<br/>
          <span style={{ color:th.accent }}>{lang==="TR" ? "Destek Sistemi" : "Support System"}</span>
        </h1>
        <p style={{ fontSize:14, color:th.text2, marginTop:16, marginBottom:40, lineHeight:1.7, fontStyle:"italic" }}>
          {lang==="TR"
            ? "355 satırlık Excel modelinin gücü, iki farklı deneyimde."
            : "The power of a 355-row Excel model in two experiences."}
          <br/>
          {lang==="TR"
            ? "Müşteri toplantısında hızlı sonuç. Yatırımcı sunumunda tam derinlik."
            : "Quick results for meetings. Full depth for investor presentations."}
        </p>

        {/* Mode cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, maxWidth:520, margin:"0 auto 36px" }}>
          {[
            { emoji:"⚡", title:t.quickMode, desc:t.quickDesc, fn:()=>goMode("quick"),
              bg:isDark?"linear-gradient(135deg,#0a1e30,#071526)":"linear-gradient(135deg,#e8f0f8,#d4e4f4)",
              border:`1px solid ${th.accent}50`, shadow:"none", badge:null },
            { emoji:"📊", title:t.proMode, desc:t.proDesc, fn:()=>goMode("pro"),
              bg:isDark?"linear-gradient(135deg,#1a1000,#0d0a00)":"linear-gradient(135deg,#2c1e04,#1a1200)",
              border:`1px solid ${th.accent}`, shadow:`0 0 28px ${th.accent}18`, badge:"PRO" },
          ].map((btn,i) => (
            <button key={i} onClick={btn.fn} style={{ background:btn.bg, border:btn.border, borderRadius:14, padding:"24px 20px", cursor:"pointer", textAlign:"left", transition:"all 0.25s", fontFamily:"inherit", position:"relative", overflow:"hidden", boxShadow:btn.shadow }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 12px 36px ${th.accent}25`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=btn.shadow||"none"; }}>
              {btn.badge && <div style={{ position:"absolute", top:0, right:0, background:th.accent, color:isDark?"#070a0f":"#fff", fontSize:9, fontWeight:800, padding:"3px 10px", letterSpacing:"0.15em" }}>{btn.badge}</div>}
              <div style={{ fontSize:28, marginBottom:9 }}>{btn.emoji}</div>
              <div style={{ fontSize:16, fontWeight:700, color:i===1?th.accent:th.text, marginBottom:6 }}>{btn.title}</div>
              <div style={{ fontSize:11, color:th.text2, lineHeight:1.6 }}>{btn.desc}</div>
            </button>
          ))}
        </div>

        {/* Deploy guide */}
        <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:12, padding:"18px 22px", maxWidth:520, margin:"0 auto" }}>
          <div style={{ fontSize:12, fontWeight:700, color:th.accent, marginBottom:12 }}>{t.deploy.title}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { title:t.deploy.vercel, cmd:t.deploy.vercelCmd, note:t.deploy.vercelNote, c:th.blue },
              { title:t.deploy.netlify, cmd:t.deploy.netlifyUrl, note:t.deploy.netlifyNote, c:th.teal },
            ].map((d,i) => (
              <div key={i} style={{ background:th.bg3, borderRadius:7, padding:"11px 13px", border:`1px solid ${d.c}28` }}>
                <div style={{ fontSize:11, fontWeight:700, color:d.c, marginBottom:5 }}>{d.title}</div>
                <div style={{ background:th.bg, borderRadius:4, padding:"4px 7px", fontSize:10, color:th.accent, fontFamily:"monospace", marginBottom:5 }}>{d.cmd}</div>
                <div style={{ fontSize:10, color:th.text2, lineHeight:1.5 }}>{d.note}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:10, color:th.text3, marginTop:8, fontStyle:"italic" }}>{t.deploy.note}</div>
        </div>

        <div style={{ marginTop:20, fontSize:10, color:th.text3, letterSpacing:"0.08em" }}>{t.free}</div>
      </div>
    </div>
    </Ctx.Provider>
  );

  /* ═══════════════════════════════════════════════════
     QUICK MODE
  ═══════════════════════════════════════════════════ */
  if (mode==="quick") return (
    <Ctx.Provider value={ctxVal}>
    <div style={{ minHeight:"100vh", fontFamily:"'Palatino Linotype',Palatino,serif", background:th.bg, color:th.text, opacity:anim?1:0, transition:"opacity 0.3s" }}>
      {/* Navbar */}
      <div className="no-print" style={{ height:50, background:th.nav, borderBottom:`1px solid ${th.navBorder}`, display:"flex", alignItems:"center", padding:"0 20px", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <span style={{ fontSize:18 }}>⚡</span>
          <span style={{ fontSize:12, fontWeight:700, color:th.accent, letterSpacing:"0.1em" }}>{t.quickMode.toUpperCase()}</span>
        </div>
        <Controls />
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={()=>goMode("splash")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text2, borderRadius:5, padding:"4px 11px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>{t.goHome}</button>
          <button onClick={()=>goMode("pro")} style={{ background:th.accent+"22", border:`1px solid ${th.accent}`, color:th.accent, borderRadius:5, padding:"4px 11px", cursor:"pointer", fontSize:10, fontWeight:700, fontFamily:"inherit" }}>{t.proSwitch}</button>
        </div>
      </div>

      <div className="print-header" style={{ display:"none", background:"#1a1208", color:"white", padding:"14px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            {BRAND.logoUrl
              ? <img src={BRAND.logoUrl} alt={BRAND.firmaAdi} style={{ height:36, marginBottom:4 }} />
              : <div style={{ fontSize:16, fontWeight:900, color:"#c9a84c", letterSpacing:"0.08em" }}>{BRAND.watermark}</div>
            }
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{BRAND.uzmanAdi} · {BRAND.unvan}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, fontWeight:700 }}>📋 {inp.refNo}</div>
            <div style={{ fontSize:9, opacity:0.6, marginTop:2 }}>{new Date().toLocaleDateString(lang==="TR"?"tr-TR":"en-GB")}</div>
          </div>
        </div>
        {inp.musteriAdi && <div style={{ fontSize:12, marginTop:8, paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.2)" }}>Sayın {inp.musteriAdi}</div>}
        <div style={{ fontSize:10, marginTop:4, opacity:0.8 }}>
          {[inp.il, inp.ilce, inp.mahalle].filter(Boolean).join(" / ")}
          {(inp.adaNo || inp.parselNo) ? ` | Ada: ${inp.adaNo||"—"} Parsel: ${inp.parselNo||"—"}` : ""}
        </div>
      </div>

      <div style={{ maxWidth: orientation==="landscape"?"100%":840, margin:"0 auto", padding: orientation==="landscape"?"16px 20px":"32px 20px" }}>
        {/* Landscape hint */}
        {orientation==="landscape" && (
          <div style={{ background:th.accent+"15", border:`1px solid ${th.accent}30`, borderRadius:8, padding:"6px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:8, fontSize:10, color:th.accent }}>
            📱 Yatay mod — daha geniş görünüm aktif
          </div>
        )}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:10, color:th.accent+"80", letterSpacing:"0.2em", marginBottom:6 }}>HIZLI FİZİBİLİTE</div>
          <h2 style={{ fontSize:26, fontWeight:400, color:th.text, margin:0 }}>{t.quickTitle}</h2>
          <p style={{ fontSize:12, color:th.text2, marginTop:5, fontStyle:"italic" }}>{t.quickSub}</p>
        </div>

        {/* Müşteri & Ref No */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:10, marginBottom:18 }}>
          <div>
            <div style={{ fontSize:10, color:th.text3, marginBottom:4 }}>{lang==="TR"?"Müşteri Adı (opsiyonel)":"Client Name (optional)"}</div>
            <input type="text" value={inp.musteriAdi||""} onChange={e=>set("musteriAdi",e.target.value)}
              placeholder={lang==="TR"?"Sayın...":"Dear..."}
              style={{ background:th.input, border:`1px solid ${th.accent}40`, color:th.inputText||th.accent, borderRadius:8, padding:"9px 14px", fontSize:13, fontFamily:"'Courier Prime',monospace", fontWeight:600, width:"100%", outline:"none" }} />
          </div>
          <div>
            <div style={{ fontSize:10, color:th.text3, marginBottom:4 }}>{lang==="TR"?"Referans No":"Reference No"}</div>
            <div style={{ background:th.bg2, border:`1px solid ${th.border}`, borderRadius:8, padding:"9px 14px", fontSize:12, fontFamily:"monospace", color:th.accent, fontWeight:700, whiteSpace:"nowrap", cursor:"pointer" }}
              onClick={()=>set("refNo",makeRefNo())}
              title={lang==="TR"?"Yeni ref no üret":"Generate new ref no"}>
              {inp.refNo||makeRefNo()} 🔄
            </div>
          </div>
        </div>

        {/* 4 big inputs */}
        <div className="quick-grid" style={{ display:"grid", gridTemplateColumns:orientation==="landscape"?"repeat(4,1fr)":"1fr 1fr", gap:14, marginBottom:18 }}>
          {[
            { label:t.fields.arsaAlan, field:"arsaAlan", unit:"m²", icon:"📐" },
            { label:t.fields.kaks,     field:"kaks",     unit:"",   icon:"📋", step:0.1 },
            { label:t.fields.konutF,   field:"konutF",   unit:"₺/m²", icon:"💵", step:1000 },
            { label:t.fields.insBirim, field:"insBirim", unit:"₺/m²", icon:"🏗️", step:500 },
          ].map(({ label, field, unit, icon, step=1 }) => (
            <div key={field} style={{ background:isDark?"linear-gradient(135deg,#0d1f32,#091626)":th.card, border:`1px solid ${th.accent}35`, borderRadius:11, padding:"18px 22px" }}>
              <div style={{ fontSize:24, marginBottom:5 }}>{icon}</div>
              <div style={{ fontSize:11, color:th.text2, marginBottom:9 }}>{label}</div>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <input type="number" value={inp[field]} step={step}
                  onChange={e=>set(field, parseFloat(e.target.value)||0)}
                  style={{ background:"transparent", border:"none", borderBottom:`2px solid ${th.accent}70`, color:isDark?th.accent:th.inputText, fontSize:22, fontWeight:700, width:"100%", fontFamily:"'Courier Prime',monospace", outline:"none", textAlign:"right", padding:"3px 0" }} />
                {unit && <span style={{ fontSize:11, color:th.accent+"60", whiteSpace:"nowrap" }}>{unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Mini params */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9, marginBottom:28 }}>
          {[
            { l:t.fields.taks, f:"taks", s:0.05 },
            { l:t.fields.insSure, f:"insSure", u:lang==="TR"?"Ay":"Mo" },
            { l:t.fields.anaByk, f:"anaByk", u:"m²" },
            { l:t.fields.ticariF, f:"ticariF", u:"₺/m²", s:1000 },
          ].map(({ l, f, u, s=1 }) => (
            <div key={f} style={{ background:th.bg2, border:`1px solid ${th.border}`, borderRadius:8, padding:"9px 11px" }}>
              <div style={{ fontSize:9, color:th.text3, marginBottom:3 }}>{l}</div>
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                <input type="number" value={inp[f]} step={s} onChange={e=>set(f, parseFloat(e.target.value)||0)}
                  style={{ background:"transparent", border:"none", borderBottom:`1px solid ${th.accent}35`, color:isDark?th.accent:th.inputText, fontSize:13, fontWeight:600, width:"100%", fontFamily:"monospace", outline:"none", textAlign:"right", padding:"2px 0" }} />
                {u && <span style={{ fontSize:9, color:th.text3 }}>{u}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Results box */}
        <div style={{ background:isDark?"linear-gradient(135deg,#0d1a0a,#081206)":th.card, border:`1px solid ${th.green}40`, borderRadius:13, padding:"24px", marginBottom:18 }}>
          <div style={{ fontSize:9, color:th.green, letterSpacing:"0.2em", marginBottom:14 }}>{t.liveResults}</div>
          <div className="quick-results" style={{ display:"grid", gridTemplateColumns:orientation==="landscape"?"repeat(6,1fr)":"repeat(3,1fr)", gap:14, marginBottom:18 }}>
            {[
              { l:t.kpis.totalSat, v:r.toplamSat, f:ƒ.m2, c:th.blue },
              { l:t.kpis.kat, v:r.katSayisi, f:v=>v+" Kat", c:th.purple },
              { l:t.kpis.bb, v:r.bbSayisi, f:v=>v+" Adet", c:th.accent },
              { l:t.kpis.maliyet, v:r.topMal, f:ƒ.tl, c:th.red },
              { l:t.kpis.brut, v:r.brutSatis, f:ƒ.tl, c:th.green },
              { l:t.kpis.pazKar, v:r.pazKar, f:ƒ.tl, c:r.pazKar>=0?th.green:th.red },
            ].map(({ l, v, f, c }) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:9, color:th.text3, marginBottom:3, letterSpacing:"0.07em" }}>{l}</div>
                <div style={{ fontSize:21, fontWeight:700, color:c, fontFamily:"monospace" }}>
                  <AnimNum value={typeof v==="number"?v:0} fmt={f} />
                </div>
              </div>
            ))}
          </div>
          {/* Profit bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:10, color:th.text3 }}>{lang==="TR"?"Kâr Marjı":"Profit Margin"}</span>
              <span style={{ fontSize:11, fontWeight:700, color:r.karMarji>0.15?th.green:r.karMarji>0.05?"#f59e0b":th.red }}>{ƒ.pct(r.karMarji)}</span>
            </div>
            <div style={{ height:6, background:th.bg, borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:3, width:`${Math.max(0,Math.min(100,r.karMarji*100*3))}%`, background:r.karMarji>0.15?`linear-gradient(90deg,${th.green},#4ade80)`:r.karMarji>0.05?"linear-gradient(90deg,#f59e0b,#fbbf24)":`linear-gradient(90deg,${th.red},#f87171)`, transition:"width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:16 }}>
          <Badge ok={r.emsalUygun} okText={t.status.emsal30Ok} failText={t.status.emsal30Fail} />
          <Badge ok={r.cikmaUygun} okText={t.status.cikmaOk}  failText={t.status.cikmaFail} />
          <Badge ok={r.pazKar>0}   okText={t.status.profitOk} failText={t.status.profitFail} />
        </div>

        {/* Hızlı erişim butonları */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
          {[
            { icon:"🎯", label:lang==="TR"?"Optimizer":"Optimizer", tab:"optimizer" },
            { icon:"🏢", label:lang==="TR"?"3D Kesit":"3D View",   tab:"plan3d" },
            { icon:"🗺️", label:lang==="TR"?"Harita":"Map",         tab:"harita" },
            { icon:"🤖", label:lang==="TR"?"AI Özet":"AI",          tab:"aiozet" },
          ].map(({icon,label,tab:t2})=>(
            <button key={t2} onClick={()=>{goMode("pro"); setTimeout(()=>setTab(t2),300);}}
              style={{background:th.bg2,border:`1px solid ${th.border}`,color:th.text2,borderRadius:8,padding:"9px 6px",cursor:"pointer",fontSize:11,fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=th.accent;e.currentTarget.style.color=th.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.color=th.text2;}}>
              <span style={{fontSize:18}}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ textAlign:"center" }}>
          <button onClick={()=>goMode("pro")} style={{ background:isDark?"linear-gradient(135deg,#1a1000,#0d0a00)":"transparent", border:`1px solid ${th.accent}`, color:th.accent, padding:"11px 34px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, letterSpacing:"0.06em", fontFamily:"inherit", transition:"all 0.2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=th.accent; e.currentTarget.style.color=isDark?"#070a0f":"#fff"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=isDark?"linear-gradient(135deg,#1a1000,#0d0a00)":"transparent"; e.currentTarget.style.color=th.accent; }}>
            {t.proSwitch}
          </button>
        </div>
      </div>
      <ClippyWidget />
    </div>
    </Ctx.Provider>
  );

  /* ═══════════════════════════════════════════════════
     PRO MODE
  ═══════════════════════════════════════════════════ */
  const alanPie = [
    { name:lang==="TR"?"Yasal Emsal":"Legal FAR",    value:Math.round(r.yasalEmsal), fill:th.blue },
    { name:lang==="TR"?"Çatı Piyesi":"Roof Space",   value:Math.round(r.catiPiyes),  fill:th.purple },
    { name:lang==="TR"?"Çıkmalar":"Projections",     value:Math.round(Math.max(0,(r.katSayisi-1)*r.catiPiyes*0.18)), fill:th.accent },
    { name:lang==="TR"?"Asma Kat":"Mezzanine",       value:Math.round(r.asmaKat),    fill:"#f59e0b" },
  ].filter(d=>d.value>0);

  const karBar = [
    { name:t.revenue.flat,    kar:Math.round(r.netKar), marj:+(r.karMarji*100).toFixed(1) },
    { name:t.revenue.premium, kar:Math.round(r.sKar),   marj:+(r.sGelir>0?r.sKar/r.sGelir*100:0).toFixed(1) },
    { name:t.revenue.mkt,     kar:Math.round(r.pazKar), marj:+(r.pazMarji*100).toFixed(1) },
    { name:t.revenue.esk,     kar:Math.round(r.eskKar), marj:+(r.sGelir>0?r.eskKar/r.sGelir*100:0).toFixed(1) },
  ];

  const SENS = [-0.2,-0.1,0,0.1,0.2];
  const sColor = v => v<0?"#7f1d1d":v<0.05?"#78350f":v<0.15?"#14532d":"#052e16";
  const sText  = v => v<0?"#fca5a5":v<0.05?"#fde68a":"#4ade80";

  const stokList = [];
  for(let i=0;i<inp.dukkanAdet;i++) stokList.push({ no:stokList.length+1, tip:lang==="TR"?"Dükkan":"Shop", kat:lang==="TR"?"Zemin":"Ground", cephe:i%2===0?"Güney":"Kuzey", brut:inp.dukkanByk, carpan:inp.zC+(i%2===0?inp.guney:inp.kuzey), bazF:inp.ticariF });
  for(let i=0;i<2&&r.katSayisi>=2;i++) stokList.push({ no:stokList.length+1, tip:lang==="TR"?"2+1 Daire":"2+1 Apt", kat:"1. Kat", cephe:i%2===0?"Kuzey":"Güney", brut:inp.anaByk, carpan:inp.k1C+(i%2===0?inp.kuzey:inp.guney), bazF:inp.konutF });
  for(let i=0;i<Math.min(r.anaAdet-2,3)&&r.anaAdet>2;i++) stokList.push({ no:stokList.length+1, tip:lang==="TR"?"2+1 Daire":"2+1 Apt", kat:"2. Kat", cephe:i%2===0?"Güney":"Kuzey", brut:inp.anaByk, carpan:inp.snC+(i%2===0?inp.guney:inp.kuzey), bazF:inp.konutF });
  if(inp.dubleksAdet>0) stokList.push({ no:stokList.length+1, tip:lang==="TR"?"Dubleks":"Duplex", kat:lang==="TR"?"Çatı":"Roof", cephe:lang==="TR"?"Güney+Teras":"South+Terrace", brut:inp.dubleksByk, carpan:inp.catiC+inp.guney, bazF:inp.konutF });

  const TABS = Object.entries(t.tabs).map(([id,label])=>({ id, label }));

  return (
    <Ctx.Provider value={ctxVal}>
    <div style={{ minHeight:"100vh", fontFamily:"'Palatino Linotype',Palatino,serif", background:th.bg, color:th.text, opacity:anim?1:0, transition:"opacity 0.35s", display:"flex", flexDirection:"column" }}>

      <div className="print-header" style={{ display:"none", background:"#1a1208", color:"white", padding:"16px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, paddingBottom:8, borderBottom:"1px solid rgba(201,168,76,0.3)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {BRAND.logoUrl
              ? <img src={BRAND.logoUrl} alt={BRAND.firmaAdi} style={{ height:44 }} />
              : <div style={{ background:"rgba(201,168,76,0.15)", border:"1px solid rgba(201,168,76,0.4)", borderRadius:8, padding:"6px 14px", fontSize:18, fontWeight:900, color:"#c9a84c", letterSpacing:"0.1em" }}>{BRAND.watermark}</div>
            }
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#c9a84c" }}>{BRAND.firmaAdi}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)", marginTop:1 }}>{BRAND.uzmanAdi}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)", marginTop:1, fontStyle:"italic" }}>{BRAND.unvan}</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#c9a84c" }}>📋 {inp.refNo}</div>
            <div style={{ fontSize:9, opacity:0.6, marginTop:3 }}>{new Date().toLocaleDateString(lang==="TR"?"tr-TR":"en-GB")}</div>
            <div style={{ fontSize:9, opacity:0.5, marginTop:1 }}>{t.appName} — {t.proMode}</div>
          </div>
        </div>
        {inp.musteriAdi && <div style={{ fontSize:12, color:"white", marginBottom:4 }}>Sayın {inp.musteriAdi},</div>}
        <div style={{ fontSize:10, opacity:0.8 }}>
          {[inp.il, inp.ilce, inp.mahalle].filter(Boolean).join(" / ")}
          {(inp.adaNo || inp.parselNo) ? ` | Ada: ${inp.adaNo||"—"} Parsel: ${inp.parselNo||"—"}` : ""}
        </div>
        {inp.planNotu && <div style={{ fontSize:9, marginTop:3, opacity:0.6 }}>Plan Notu: {inp.planNotu}</div>}
      </div>

      {/* TOP NAV */}
      <div className="no-print" style={{ height:52, background:th.nav, borderBottom:`1px solid ${th.navBorder}`, display:"flex", alignItems:"center", padding:"0 18px", gap:12, flexShrink:0, boxShadow:"0 2px 20px #00000040" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg,${th.accent},#e8c060)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🏗️</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:isDark?"#f5ead4":th.text, letterSpacing:"0.04em" }}>{t.appName}</div>
            <div style={{ fontSize:8, color:th.accent+"70", letterSpacing:"0.18em" }}>{t.proMode.toUpperCase()}</div>
          </div>
        </div>

        {/* Status pills */}
        <div style={{ display:"flex", gap:5, flex:1, justifyContent:"center", flexWrap:"wrap" }}>
          {[[r.emsalUygun,"%30"],[r.cikmaUygun,lang==="TR"?"Çıkma":"Proj."],[r.pazKar>0,lang==="TR"?"Kâr":"Profit"]].map(([ok,l],i)=>(
            <span key={i} style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:4, background:ok?th.green+"18":th.red+"20", color:ok?th.green:th.red, border:`1px solid ${ok?th.green+"40":th.red+"40"}` }}>{ok?"✅":"🔴"} {l}</span>
          ))}
          <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:4, background:r.waccKarar==="CAZIP"?th.green+"18":r.waccKarar==="SINIRDA"?"#f59e0b18":th.red+"20", color:r.waccKarar==="CAZIP"?th.green:r.waccKarar==="SINIRDA"?"#f59e0b":th.red, border:`1px solid ${th.border}` }}>
            {r.waccKarar==="CAZIP"?t.status.cazip:r.waccKarar==="SINIRDA"?t.status.sinirda:t.status.riskli}
          </span>
        </div>

        <Controls />
        <div style={{ display:"flex", gap:5 }}>
          <button onClick={()=>goMode("quick")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text2, borderRadius:5, padding:"3px 9px", cursor:"pointer", fontSize:9, fontFamily:"inherit" }}>⚡ {t.quickMode}</button>
          <button onClick={()=>goMode("splash")} style={{ background:"transparent", border:`1px solid ${th.border}`, color:th.text3, borderRadius:5, padding:"3px 9px", cursor:"pointer", fontSize:9, fontFamily:"inherit" }}>{t.goHome}</button>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a href={makeWALink()} target="_blank" rel="noopener noreferrer" className="no-print"
        style={{position:"fixed",bottom:20,right:20,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"white",borderRadius:"50px",padding:"10px 18px",fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 20px rgba(37,211,102,0.4)",zIndex:9999,transition:"transform 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        💬 {lang==="TR"?"Uzmanla Görüş":"Ask Expert"}
      </a>

      {/* TABS */}
      <div className="no-print" style={{ background:th.bg3, borderBottom:`1px solid ${th.border}`, display:"flex", gap:1, padding:"0 18px", flexShrink:0, overflowX:"auto" }}>
        {TABS.map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{ background:"transparent", color:tab===tb.id?th.accent:th.text3, border:"none", borderBottom:`2px solid ${tab===tb.id?th.accent:"transparent"}`, padding:"10px 14px", cursor:"pointer", fontSize:11, fontWeight:tab===tb.id?700:400, fontFamily:"inherit", transition:"all 0.15s", whiteSpace:"nowrap" }}>
            {tb.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="pro-content" style={{ flex:1, overflow:"auto", padding:isFullscreen?"24px":"18px" }}>

        {/* ── OVERVIEW ── */}
        {tab==="overview" && (
          <div className="tab-panel tab-panel-overview">
            {/* Konum & Ada/Parsel badge */}
            {(inp.il || inp.ilce || inp.mahalle || inp.adaNo || inp.parselNo) && (
              <div style={{ display:"flex", gap:6, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
                {inp.il && <span style={{ background:th.blue+"20", border:`1px solid ${th.blue}40`, color:th.blue, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>📍 {inp.il}</span>}
                {inp.ilce && <span style={{ background:th.blue+"15", border:`1px solid ${th.blue}30`, color:th.blue, fontSize:11, padding:"3px 10px", borderRadius:6 }}>{inp.ilce}</span>}
                {inp.mahalle && <span style={{ background:th.blue+"10", border:`1px solid ${th.blue}20`, color:th.text2, fontSize:11, padding:"3px 10px", borderRadius:6 }}>{inp.mahalle}</span>}
                {inp.adaNo && <span style={{ background:th.accent+"20", border:`1px solid ${th.accent}40`, color:th.accent, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>Ada: {inp.adaNo}</span>}
                {inp.parselNo && <span style={{ background:th.accent+"20", border:`1px solid ${th.accent}40`, color:th.accent, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>Parsel: {inp.parselNo}</span>}
                {inp.planNotu && <span style={{ background:th.green+"15", border:`1px solid ${th.green}30`, color:th.green, fontSize:10, padding:"3px 10px", borderRadius:6 }}>📋 Plan Notu Var</span>}
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9, marginBottom:9 }}>
              <Kpi label={t.kpis.totalSat} value={r.toplamSat} accent={th.blue} sub={ƒ.m2(r.yasalEmsal)+" yasal"} fmt={ƒ.m2} />
              <Kpi label={t.kpis.kat}      value={r.katSayisi} accent={th.purple} sub={ƒ.m2(r.taban)} fmt={v=>Math.round(v)+" kat"} />
              <Kpi label={t.kpis.bb}       value={r.bbSayisi}  accent={th.accent} fmt={v=>Math.round(v)+" adet"} />
              <Kpi label={t.kpis.maliyet}  value={r.topMal}    accent={th.red}    sub={`Cont: ${ƒ.tl(r.contingency)}`} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9, marginBottom:14 }}>
              <Kpi label={t.kpis.brut}   value={r.brutSatis} accent={th.green} />
              <Kpi label={t.kpis.pazKar} value={r.pazKar}    accent={r.pazKar>=0?th.green:th.red} warn={r.pazKar<0} sub={ƒ.pct(r.pazMarji)+" marj"} />
              <Kpi label={t.kpis.irr}    value={r.irrYillik||0} accent={r.irrYillik&&r.irrYillik>r.hurdle?th.green:r.irrYillik&&r.irrYillik>r.wacc?"#f59e0b":th.red} sub={`Hurdle: ${ƒ.pct(r.hurdle)}`} fmt={ƒ.pct} />
              <Kpi label={t.kpis.nbD}    value={r.nbD}       accent={r.nbD>=0?th.green:th.red} warn={r.nbD<0} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr 1.4fr", gap:13 }}>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>{t.charts?.alanDagilimi||"ALAN DAĞILIMI"}</div>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={alanPie} dataKey="value" cx="50%" cy="50%" outerRadius={68} labelLine={false} label={({percent})=>percent>0.06?`${(percent*100).toFixed(0)}%`:""}>
                      {alanPie.map((d,i)=><Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip formatter={v=>ƒ.m2(v)} contentStyle={tipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"3px 8px", marginTop:4 }}>
                  {alanPie.map((d,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:3, fontSize:9, color:th.text2 }}><div style={{ width:7,height:7,borderRadius:1,background:d.fill }} />{d.name}</div>)}
                </div>
              </div>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>{t.charts?.karSenaryolar||"KÂR SENARYO KARŞILAŞTIRMASI"}</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={karBar} margin={{ left:4, right:8, bottom:16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid} vertical={false} />
                    <XAxis dataKey="name" tick={TT} angle={-20} textAnchor="end" />
                    <YAxis yAxisId="k" tick={TT} tickFormatter={v=>(v/1e6).toFixed(0)+"M"} />
                    <YAxis yAxisId="m" orientation="right" tick={TT} tickFormatter={v=>v+"%"} />
                    <Tooltip formatter={(v,n)=>n==="marj"?v+"%":ƒ.tlF(v)} contentStyle={tipStyle} />
                    <Bar yAxisId="k" dataKey="kar" radius={[4,4,0,0]} name={lang==="TR"?"Net Kâr":"Net Profit"}>
                      {karBar.map((d,i)=><Cell key={i} fill={d.kar>=0?CC[i%CC.length]:th.red} />)}
                    </Bar>
                    <Bar yAxisId="m" dataKey="marj" fill={th.accent+"55"} radius={[4,4,0,0]} name="%" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>{t.charts?.maliyetDagilim||"MALİYET DAĞILIMI"}</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name:t.cost.insMal,  val:Math.round(r.insMal),    fill:th.red },
                    { name:t.cost.cont,    val:Math.round(r.contingency),fill:"#dc7b2a" },
                    { name:t.cost.fin,     val:Math.round(r.finG),       fill:"#f59e0b" },
                    { name:t.cost.other,   val:inp.projeG+inp.altyapiG,  fill:th.text3 },
                  ]} layout="vertical" margin={{ left:4, right:20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid} horizontal={false} />
                    <XAxis type="number" tick={TT} tickFormatter={v=>(v/1e6).toFixed(1)+"M"} />
                    <YAxis type="category" dataKey="name" tick={TT} width={70} />
                    <Tooltip formatter={v=>ƒ.tlF(v)} contentStyle={tipStyle} />
                    <Bar dataKey="val" radius={[0,4,4,0]}>
                      {[th.red,"#dc7b2a","#f59e0b",th.text3].map((c,i)=><Cell key={i} fill={c} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── INPUTS ── */}
        {tab==="inputs" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
            <div>
              <SecTitle>{t.sections.parcel}</SecTitle>
              {/* Konum bilgileri */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
                {[
                  {l:t.fields.il, f:"il", tip:lang==="TR"?"Örn: Antalya":"e.g. Antalya"},
                  {l:t.fields.ilce, f:"ilce", tip:lang==="TR"?"Örn: Kepez":"e.g. Kepez"},
                ].map(p=>(
                  <div key={p.f} style={{marginBottom:8}}>
                    <label style={{display:"block",fontSize:10,color:th.text3,marginBottom:3,letterSpacing:"0.07em"}}>{p.l}{p.tip&&<span title={p.tip} style={{marginLeft:3,cursor:"help",color:th.text3}}>ⓘ</span>}</label>
                    <input type="text" value={inp[p.f]||""} onChange={e=>set(p.f,e.target.value)} placeholder="—"
                      style={{background:th.input,border:`1px solid ${th.accent}60`,color:th.inputText||th.accent,borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:"'Courier Prime',monospace",fontWeight:700,width:"100%",outline:"none"}} />
                  </div>
                ))}
              </div>
              {[
                {l:t.fields.mahalle, f:"mahalle", isText:true, tip:lang==="TR"?"Örn: Uncalı Mah.":"e.g. Uncalı Mah."},
                {l:t.fields.adaNo, f:"adaNo", isText:true, tip:lang==="TR"?"Tapu ada numarası":"Block number"},
                {l:t.fields.parselNo, f:"parselNo", isText:true, tip:lang==="TR"?"Tapu parsel numarası":"Parcel number"},
              ].map(p=>(
                <div key={p.f} style={{marginBottom:8}}>
                  <label style={{display:"block",fontSize:10,color:th.text3,marginBottom:3,letterSpacing:"0.07em"}}>{p.l}{p.tip&&<span title={p.tip} style={{marginLeft:3,cursor:"help",color:th.text3}}>ⓘ</span>}</label>
                  <input type="text" value={inp[p.f]||""} onChange={e=>set(p.f,e.target.value)} placeholder="—"
                    style={{background:th.input,border:`1px solid ${th.accent}60`,color:th.inputText||th.accent,borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:"'Courier Prime',monospace",fontWeight:700,width:"100%",outline:"none"}} />
                </div>
              ))}

              {/* Plan Notu */}
              <div style={{marginBottom:11}}>
                <label style={{display:"block",fontSize:10,color:th.accent,marginBottom:3,letterSpacing:"0.07em",fontWeight:700}}>
                  {t.fields.planNotu}
                  <span title={lang==="TR"?"KAKS:1.5 TAKS:0.40 H:9.50 AYRK gibi yazın — otomatik uygulanır":"Write KAKS:1.5 TAKS:0.40 H:9.50 — auto-applied"} style={{marginLeft:4,cursor:"help",color:th.text3,fontWeight:400}}>ⓘ</span>
                </label>
                <textarea value={inp.planNotu||""} onChange={e=>set("planNotu",e.target.value)}
                  placeholder={lang==="TR"?"Örn: KAKS:1.50 TAKS:0.40 H:9.50 AYRK\nYa da serbest metin: \"3 katlı konut, çekme mesafeleri 5-3-3m\"":"e.g. FAR:1.50 TAKS:0.40 H:9.50 DETACHED\nOr free text: '3-storey residential, setbacks 5-3-3m'"}
                  rows={3}
                  style={{background:th.input,border:`1px solid ${th.accent}60`,color:th.inputText||th.accent,borderRadius:6,padding:"8px 10px",fontSize:11,fontFamily:"'Courier Prime',monospace",width:"100%",outline:"none",resize:"vertical",lineHeight:1.6}} />
                {inp.planNotu && (r.kaks !== n(inp.kaks,1.5) || r.taks !== n(inp.taks,0.4)) && (
                  <div style={{fontSize:10,color:th.green,marginTop:4,background:th.green+"15",padding:"4px 8px",borderRadius:4}}>
                    ✅ Plan notundan: KAKS={r.kaks.toFixed(2)} TAKS={r.taks.toFixed(2)}{r.planH>0?` H=${r.planH}m`:""}
                  </div>
                )}
              </div>
              {[
                { l:t.fields.arsaAlan, f:"arsaAlan", u:"m²" },
                { l:t.fields.kaks, f:"kaks", s:0.1 },
                { l:t.fields.taks, f:"taks", s:0.05 },
                { l:t.fields.parselEn, f:"parselEn", u:"m" },
                { l:t.fields.parselBoy, f:"parselBoy", u:"m" },
                { l:t.fields.onCekme, f:"onCekme", u:"m" },
                { l:t.fields.arkaCekme, f:"arkaCekme", u:"m" },
                { l:t.fields.yanCekme, f:"yanCekme", u:"m" },
                { l:t.fields.nizam, f:"nizam", opts:["AYRK","İKİZ","BİLEŞ"] },
                { l:t.fields.bonus, f:"bonus", s:0.05 },
                { l:t.fields.cikmaD, f:"cikmaD", u:"m", s:0.1, tip:lang==="TR"?"Max: Ön çekme - 3m":"Max: Front setback - 3m" },
                { l:t.fields.cikmaF, f:"cikmaF", u:"m" },
                { l:t.fields.fire, f:"fire", s:0.05, tip:lang==="TR"?"%45 önerilen":"45% recommended" },
                { l:t.fields.asma, f:"asma", s:0.05, max:0.5 },
                { l:t.fields.bodrum, f:"bodrum", s:1, min:0 },
              ].map(p => p.opts
                ? <Inp key={p.f} label={p.l} field={p.f} options={p.opts} inp={inp} set={set} />
                : p.isText
                ? <div key={p.f} style={{marginBottom:11}}>
                    <label style={{display:"block",fontSize:10,color:th.text3,marginBottom:3,letterSpacing:"0.07em"}}>{p.l}{p.tip&&<span title={p.tip} style={{marginLeft:3,cursor:"help",color:th.text3}}>ⓘ</span>}</label>
                    <input type="text" value={inp[p.f]||""} onChange={e=>set(p.f,e.target.value)} placeholder={lang==="TR"?"—":"—"}
                      style={{background:th.input,border:`1px solid ${th.accent}60`,color:th.inputText||th.accent,borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:"'Courier Prime',monospace",fontWeight:700,width:"100%",outline:"none"}} />
                  </div>
                : <Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} min={p.min} max={p.max} tip={p.tip} inp={inp} set={set} />)}
            </div>
            <div>
              <SecTitle color={th.green}>{t.sections.cost}</SecTitle>
              {[
                { l:t.fields.insBirim, f:"insBirim", u:"₺/m²", s:500 },
                { l:t.fields.projeG, f:"projeG", u:"₺" },
                { l:t.fields.altyapiG, f:"altyapiG", u:"₺" },
                { l:t.fields.finOran, f:"finOran", s:0.01 },
                { l:t.fields.cont, f:"cont", s:0.01, tip:lang==="TR"?"%3-8, %5 önerilen":"3-8%, 5% recommended" },
                { l:t.fields.insSure, f:"insSure", u:lang==="TR"?"Ay":"Mo", s:1 },
              ].map(p => <Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} tip={p.tip} inp={inp} set={set} />)}
              <div style={{marginTop:18}}><SecTitle color={th.blue}>{t.sections.revenue}</SecTitle></div>
              {[
                { l:t.fields.konutF, f:"konutF", u:"₺/m²", s:1000 },
                { l:t.fields.ticariF, f:"ticariF", u:"₺/m²", s:1000 },
                { l:t.fields.dukkanByk, f:"dukkanByk", u:"m²" },
                { l:t.fields.dukkanAdet, f:"dukkanAdet", s:1, min:0 },
                { l:t.fields.dubleksByk, f:"dubleksByk", u:"m²" },
                { l:t.fields.dubleksAdet, f:"dubleksAdet", s:1, min:0 },
                { l:t.fields.anaByk, f:"anaByk", u:"m²" },
              ].map(p => <Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} min={p.min} inp={inp} set={set} />)}
            </div>
            <div>
              <SecTitle>{t.sections.premium}</SecTitle>
              {[
                { l:t.fields.zC, f:"zC", s:0.01 },
                { l:t.fields.k1C, f:"k1C", s:0.01 },
                { l:t.fields.araC, f:"araC", s:0.01 },
                { l:t.fields.snC, f:"snC", s:0.01 },
                { l:t.fields.catiC, f:"catiC", s:0.01 },
                { l:t.fields.kuzey, f:"kuzey", s:0.01, tip:lang==="TR"?"Negatif = iskonto":"Negative = discount" },
                { l:t.fields.guney, f:"guney", s:0.01, tip:lang==="TR"?"Pozitif = prim":"Positive = premium" },
              ].map(p => <Inp key={p.f} label={p.l} field={p.f} step={p.s} tip={p.tip} inp={inp} set={set} />)}
              <div style={{marginTop:18}}><SecTitle color={th.purple}>{t.sections.wacc}</SecTitle></div>
              {[
                { l:t.fields.ozkaynak, f:"ozkaynak", s:0.05, max:1 },
                { l:t.fields.ozGetiri, f:"ozGetiri", s:0.01 },
                { l:t.fields.krediF, f:"krediF", s:0.01 },
                { l:t.fields.kurumlarV, f:"kurumlarV", s:0.01 },
                { l:t.fields.projeSure, f:"projeSure", u:lang==="TR"?"Yıl":"Yr", s:0.5 },
                { l:t.fields.pazOran, f:"pazOran", s:0.005 },
                { l:t.fields.eskalOran, f:"eskalOran", s:0.005 },
                { l:t.fields.onSatisO, f:"onSatisO", s:0.05, max:1 },
              ].map(p => <Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} max={p.max} inp={inp} set={set} />)}
            </div>
          </div>
        )}

        {/* ── COST ── */}
        {tab==="cost" && (
          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:14 }}>
            <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ background:th.bg3, padding:"11px 14px", borderBottom:`1px solid ${th.border}`, fontSize:11, color:th.accent, fontWeight:700 }}>{t.cost.title}</div>
              {[
                { l:t.cost.insMal, v:r.insMal, c:th.red },
                { l:t.cost.cont+" ("+ƒ.pct(inp.cont)+")", v:r.contingency, c:"#dc7b2a", note:lang==="TR"?"⚠️ Zorunlu rezerv":"⚠️ Required reserve" },
                { l:t.cost.fin, v:r.finG, c:"#f59e0b" },
                { l:lang==="TR"?"Proje/Ruhsat":"Project/Permit", v:inp.projeG, c:th.text2 },
                { l:lang==="TR"?"Altyapı":"Infrastructure", v:inp.altyapiG, c:th.text2 },
              ].map(({ l,v,c,note },i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 90px auto", gap:10, padding:"10px 14px", alignItems:"center", background:i%2===0?"transparent":th.bg3, borderBottom:`1px solid ${th.border}` }}>
                  <div>
                    <div style={{ fontSize:11, color:th.text }}>{l}</div>
                    {note && <div style={{ fontSize:9, color:"#906030", marginTop:1 }}>{note}</div>}
                  </div>
                  <div style={{ height:4, background:th.bg, borderRadius:2 }}>
                    <div style={{ height:"100%", borderRadius:2, background:c, width:`${Math.max(2,Math.min(100,v/r.topMal*100))}%`, transition:"width 0.5s" }} />
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:c, fontFamily:"monospace", whiteSpace:"nowrap" }}>{ƒ.tl(v)}</div>
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:10, padding:"12px 14px", background:isDark?"#0d1420":th.bg4, alignItems:"center" }}>
                <div style={{ fontSize:12, fontWeight:700, color:th.text }}>{t.cost.total}</div>
                <div style={{ fontSize:16, fontWeight:700, color:th.red, fontFamily:"monospace" }}>{ƒ.tl(r.topMal)}</div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>{t.cost.sensitivity}</div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={Array.from({length:9},(_,i)=>{ const f=inp.konutF*(0.75+i*0.0625); const g=r.konutM2*f+r.ticariGelir; const k=g-r.topMal; return { f:Math.round(f/1000)+"K", k:Math.round(k) }; })}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid} />
                    <XAxis dataKey="f" tick={TT} />
                    <YAxis tick={TT} tickFormatter={v=>(v/1e6).toFixed(0)+"M"} />
                    <Tooltip formatter={v=>ƒ.tlF(v)} contentStyle={tipStyle} />
                    <Line type="monotone" dataKey="k" stroke={th.green} strokeWidth={2} dot={false} name={lang==="TR"?"Kâr":"Profit"} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:isDark?"#060e08":th.card, border:`1px solid ${th.green}35`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:"#dc7b2a", fontWeight:700, marginBottom:7 }}>{t.cost.why}</div>
                <div style={{ fontSize:11, color:th.text2, lineHeight:1.7 }}>
                  {t.cost.whyText}<br/>
                  <span style={{ color:th.accent }}>%{(inp.cont*100).toFixed(0)}</span> = <span style={{ color:isDark?"#f9e84d":th.accent, fontFamily:"monospace" }}>{ƒ.tl(r.contingency)}</span><br/>
                  <span style={{ fontSize:10, color:th.text3 }}>{t.cost.whyNote}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab==="revenue" && (
          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:14 }}>
            <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ background:th.bg3, padding:"11px 14px", borderBottom:`1px solid ${th.border}`, fontSize:11, color:th.accent, fontWeight:700 }}>{t.revenue.title}</div>
              {[
                { l:t.revenue.flat, g:r.brutSatis, k:r.netKar, m:r.karMarji, c:th.blue },
                { l:t.revenue.premium, g:r.sGelir, k:r.sKar, m:r.sGelir>0?r.sKar/r.sGelir:0, c:th.accent },
                { l:t.revenue.mkt, g:r.sGelir, k:r.pazKar, m:r.pazMarji, c:th.purple },
                { l:t.revenue.esk, g:r.sGelir, k:r.eskKar, m:r.sGelir>0?r.eskKar/r.sGelir:0, c:th.red },
              ].map(({ l,g,k,m,c },i) => (
                <div key={i} style={{ padding:"12px 14px", borderBottom:`1px solid ${th.border}`, background:i%2===0?"transparent":th.bg3 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                    <div style={{ width:3, height:20, background:c, borderRadius:2 }} />
                    <span style={{ fontSize:11, color:th.text }}>{l}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 70px", gap:7, paddingLeft:10 }}>
                    <div><div style={{ fontSize:9, color:th.text3, marginBottom:2 }}>{t.revenue.gelir}</div><div style={{ fontSize:11, color:th.text2, fontFamily:"monospace" }}>{ƒ.tl(g)}</div></div>
                    <div><div style={{ fontSize:9, color:th.text3, marginBottom:2 }}>{t.revenue.kar}</div><div style={{ fontSize:13, fontWeight:700, color:k>=0?th.green:th.red, fontFamily:"monospace" }}>{ƒ.tl(k)}</div></div>
                    <div style={{ background:m>0.15?th.green+"20":m>0.05?"#f59e0b20":th.red+"20", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:12, fontWeight:700, color:m>0.15?th.green:m>0.05?"#f59e0b":th.red }}>{ƒ.pct(m)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>WACC & {lang==="TR"?"KARAR":"DECISION"}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[["WACC",ƒ.pct(r.wacc),"#f59e0b"],["Hurdle",ƒ.pct(r.hurdle),"#f59e0b"],["ROI",ƒ.pct(r.projRoi),r.projRoi>r.hurdle?th.green:r.projRoi>r.wacc?"#f59e0b":th.red],["NBD",ƒ.tl(r.nbD),r.nbD>0?th.green:th.red],[lang==="TR"?"Özkaynak":"Equity",ƒ.tl(r.ozTutar),th.purple],[lang==="TR"?"Kredi":"Debt",ƒ.tl(r.krediTutar),th.text2]].map(([k,v,c],i)=>(
                    <div key={i} style={{ background:th.bg3, borderRadius:5, padding:"8px 10px" }}>
                      <div style={{ fontSize:9, color:th.text3, marginBottom:2 }}>{k}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:c, fontFamily:"monospace" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:10, padding:"9px 11px", borderRadius:7, background:r.waccKarar==="CAZIP"?th.green+"18":r.waccKarar==="SINIRDA"?"#f59e0b18":th.red+"18", textAlign:"center" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:r.waccKarar==="CAZIP"?th.green:r.waccKarar==="SINIRDA"?"#f59e0b":th.red }}>
                    {r.waccKarar==="CAZIP"?"✅ "+(lang==="TR"?"PROJE CAZIP":"ATTRACTIVE"):r.waccKarar==="SINIRDA"?"🟡 "+(lang==="TR"?"SINIRDA":"BORDERLINE"):"🔴 "+(lang==="TR"?"CAZIP DEĞİL":"NOT ATTRACTIVE")}
                  </div>
                  <div style={{ fontSize:9, color:th.text3, marginTop:3 }}>ROI: {ƒ.pct(r.projRoi)} | Hurdle: {ƒ.pct(r.hurdle)}</div>
                </div>
              </div>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>{t.revenue.split}</div>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={[{ name:t.revenue.residential, value:Math.round(r.konutGelir), fill:th.blue },{ name:t.revenue.commercial, value:Math.round(r.ticariGelir), fill:th.accent }]} dataKey="value" cx="50%" cy="50%" outerRadius={52} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelStyle={{ fontSize:9, fill:th.text2 }}>
                      <Cell fill={th.blue} /><Cell fill={th.accent} />
                    </Pie>
                    <Tooltip formatter={v=>ƒ.tlF(v)} contentStyle={tipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── CASHFLOW & IRR ── */}
        {tab==="cashflow" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, overflow:"hidden", marginBottom:12 }}>
                <div style={{ background:th.bg3, padding:"11px 14px", borderBottom:`1px solid ${th.border}`, fontSize:11, color:th.accent, fontWeight:700 }}>{t.cashflow.title}</div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background:th.bg3 }}>
                    {[t.cashflow.title.split(" ")[0],"T=0","T=1","T=2"].map(h=><th key={h} style={{ padding:"8px 12px", fontSize:9, color:th.accent, textAlign:h.length<=3?"right":"left", letterSpacing:"0.07em" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    <tr style={{ borderBottom:`1px solid ${th.border}` }}>
                      <td style={{ padding:"9px 12px", fontSize:11, color:th.green }}>{t.cashflow.inflow}</td>
                      {[0, r.brutSatis*0.8, r.brutSatis*0.2].map((v,j)=><td key={j} style={{ padding:"9px 12px", textAlign:"right", fontSize:11, fontWeight:600, color:th.green, fontFamily:"monospace" }}>{ƒ.tl(v)}</td>)}
                    </tr>
                    <tr style={{ borderBottom:`1px solid ${th.border}` }}>
                      <td style={{ padding:"9px 12px", fontSize:11, color:th.red }}>{t.cashflow.outflow}</td>
                      {[r.cf0, -(r.topMal-r.ozTutar)*0.6, -(r.topMal-r.ozTutar)*0.4].map((v,j)=><td key={j} style={{ padding:"9px 12px", textAlign:"right", fontSize:11, fontWeight:600, color:th.red, fontFamily:"monospace" }}>{ƒ.tl(v)}</td>)}
                    </tr>
                    <tr style={{ background:isDark?"#0d1420":th.bg4, borderTop:`1px solid ${th.accent}30` }}>
                      <td style={{ padding:"11px 12px", fontSize:12, fontWeight:700, color:th.text }}>{t.cashflow.net}</td>
                      {[r.cf0, r.cf1, r.cf2].map((v,j)=><td key={j} style={{ padding:"11px 12px", textAlign:"right", fontSize:13, fontWeight:700, color:v>=0?th.green:th.red, fontFamily:"monospace" }}>{ƒ.tl(v)}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ background:isDark?"linear-gradient(135deg,#060e08,#040a06)":th.card, border:`1px solid ${th.green}35`, borderRadius:10, padding:18 }}>
                <div style={{ fontSize:10, color:th.green, fontWeight:700, letterSpacing:"0.1em", marginBottom:14 }}>{t.cashflow.irr}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                  {[[t.cashflow.periodic, r.irrVal, r.irrVal&&r.irrVal>0?th.green:"#f59e0b"],
                    [t.cashflow.annual, r.irrYillik, r.irrYillik&&r.irrYillik>r.hurdle?th.green:r.irrYillik&&r.irrYillik>r.wacc?"#f59e0b":th.red]
                  ].map(([l,v,c])=>(
                    <div key={l}><div style={{ fontSize:9, color:th.text3, marginBottom:5 }}>{l}</div>
                      <div style={{ fontSize:30, fontWeight:700, color:v!=null?c:th.text3, fontFamily:"monospace", lineHeight:1 }}>{v!=null?ƒ.pct(v):"—"}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"10px 12px", borderRadius:7, background:r.irrYillik&&r.irrYillik>r.hurdle?th.green+"18":r.irrYillik&&r.irrYillik>r.wacc?"#f59e0b18":th.red+"18", textAlign:"center" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:r.irrYillik&&r.irrYillik>r.hurdle?th.green:r.irrYillik&&r.irrYillik>r.wacc?"#f59e0b":th.red }}>
                    {r.irrYillik?r.irrYillik>r.hurdle?"✅ IRR > Hurdle — "+(lang==="TR"?"DOĞRULANMIŞ":"CONFIRMED"):r.irrYillik>r.wacc?"🟡 IRR > WACC < Hurdle":"🔴 IRR < WACC":"—"}
                  </div>
                  <div style={{ fontSize:9, color:th.text3, marginTop:3 }}>WACC: {ƒ.pct(r.wacc)} | Hurdle: {ƒ.pct(r.hurdle)}</div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>{t.cashflow.cum}</div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={[{ p:"T=0", k:r.cf0, c:r.cf0 },{ p:"T=1", k:r.cf1, c:r.cf0+r.cf1 },{ p:"T=2", k:r.cf2, c:r.cf0+r.cf1+r.cf2 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid} />
                    <XAxis dataKey="p" tick={TT} />
                    <YAxis tick={TT} tickFormatter={v=>(v/1e6).toFixed(0)+"M"} />
                    <Tooltip formatter={v=>ƒ.tlF(v)} contentStyle={tipStyle} />
                    <Area type="monotone" dataKey="c" stroke={th.accent} fill={th.accent+"22"} strokeWidth={2} name={lang==="TR"?"Kümülatif":"Cumulative"} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>{t.cashflow.metrics}</div>
                {[[t.cashflow.equity, ƒ.tl(r.ozTutar), th.purple],
                  [t.cashflow.debt, ƒ.tl(r.krediTutar), th.text2],
                  [t.cashflow.maxFin, ƒ.tl(Math.max(0,r.topMal-r.brutSatis*0.3)), th.red],
                  ["NBD", ƒ.tl(r.nbD), r.nbD>0?th.green:th.red],
                  ["WACC", ƒ.pct(r.wacc), "#f59e0b"],
                ].map(([k,v,c],i)=>(
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8, padding:"7px 0", borderBottom:i<4?`1px solid ${th.border}`:"none", alignItems:"center" }}>
                    <span style={{ fontSize:10, color:th.text3 }}>{k}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:c, fontFamily:"monospace" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STRESS TEST ── */}
        {tab==="stress" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:th.accent, marginBottom:4 }}>{t.stress.title}</div>
              <div style={{ fontSize:10, color:th.text3, marginBottom:14 }}>{lang==="TR"?"Satırlar: Maliyet | Sütunlar: Fiyat":"Rows: Cost | Columns: Price"}</div>
              <div style={{ display:"grid", gridTemplateColumns:"76px repeat(5,1fr)", gap:3, marginBottom:3 }}>
                <div style={{ fontSize:8, color:th.text3, textAlign:"center", padding:3 }}>↓/→</div>
                {["-20%","-10%","Baz","+10%","+20%"].map((l,i)=><div key={i} style={{ fontSize:8, fontWeight:700, textAlign:"center", padding:3, color:i<2?th.red:i===2?th.accent:th.green }}>{l}</div>)}
              </div>
              {["+20%","+10%","Baz","-10%","-20%"].map((rl,ri)=>{
                const mD=[0.2,0.1,0,-0.1,-0.2][ri];
                return (
                  <div key={ri} style={{ display:"grid", gridTemplateColumns:"76px repeat(5,1fr)", gap:3, marginBottom:3 }}>
                    <div style={{ fontSize:8, fontWeight:700, textAlign:"right", paddingRight:5, display:"flex", alignItems:"center", justifyContent:"flex-end", color:ri<2?th.red:ri===2?th.accent:th.green }}>{rl}</div>
                    {SENS.map((fD,ci)=>{
                      const yG=r.sGelir*(1+fD), yM=r.topMal*(1+mD);
                      const m=yG>0?(yG-yM)/yG:-1;
                      const isBaz=ri===2&&ci===2;
                      return <div key={ci} style={{ background:sColor(m), color:sText(m), borderRadius:5, padding:"8px 3px", textAlign:"center", fontSize:11, fontWeight:700, border:isBaz?`2px solid ${th.accent}`:"1px solid transparent", boxShadow:isBaz?`0 0 8px ${th.accent}30`:"none" }}>
                        {(m*100).toFixed(1)}%
                      </div>;
                    })}
                  </div>
                );
              })}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:12 }}>
                {(()=>{
                  const k=r.sGelir>0?(r.sGelir*0.8-r.topMal*1.2)/(r.sGelir*0.8):-1;
                  const b=r.sGelir>0?(r.sGelir-r.topMal)/r.sGelir:0;
                  const g=r.sGelir>0?(r.sGelir*1.1-r.topMal*0.9)/(r.sGelir*1.1):0;
                  return [[t.stress.worst,k,k>0?th.green:th.red],[t.stress.base,b,th.accent],[t.stress.best,g,th.green]].map(([l,v,c])=>(
                    <div key={l} style={{ background:th.card, border:`1px solid ${c}30`, borderRadius:7, padding:"10px", textAlign:"center" }}>
                      <div style={{ fontSize:8, color:th.text3, marginBottom:6, whiteSpace:"pre-line", lineHeight:1.4 }}>{l}</div>
                      <div style={{ fontSize:20, fontWeight:700, color:c, fontFamily:"monospace" }}>{ƒ.pct(v)}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>{t.stress.bep}</div>
                {[
                  [t.stress.bepPrice, ƒ.tl(r.konutM2>0?r.topMal/(r.konutM2*0.85):0)+"/m²", t.stress.bepNote1],
                  [t.stress.bepRatio, ƒ.pct(r.topMal>0?inp.konutF/(r.topMal/(r.konutM2*0.85||1)):0), t.stress.bepNote2],
                  [t.stress.margin, ƒ.pct(Math.max(0,1-r.topMal/Math.max(1,r.brutSatis))), t.stress.bepNote3],
                ].map(([k,v,n],i)=>(
                  <div key={i} style={{ padding:"9px 0", borderBottom:i<2?`1px solid ${th.border}`:"none" }}>
                    <div style={{ fontSize:10, color:th.text3, marginBottom:3 }}>{k}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:th.text, fontFamily:"monospace" }}>{v}</div>
                    {n && <div style={{ fontSize:9, color:th.text3, marginTop:2, fontStyle:"italic" }}>{n}</div>}
                  </div>
                ))}
              </div>
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>{lang==="TR"?"SATIŞ FİYATI ETKİSİ":"PRICE IMPACT"}</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={Array.from({length:9},(_,i)=>{ const f=inp.konutF*(0.75+i*0.0625); const g=r.konutM2*f+r.ticariGelir; const k=g-r.topMal; return { f:Math.round(f/1000)+"K", k:Math.round(k), m:g>0?+(k/g*100).toFixed(1):0 }; })}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid} />
                    <XAxis dataKey="f" tick={TT} />
                    <YAxis tick={TT} tickFormatter={v=>(v/1e6).toFixed(0)+"M"} />
                    <Tooltip formatter={(v,n)=>n==="m"?v+"%":ƒ.tlF(v)} contentStyle={tipStyle} />
                    <Line type="monotone" dataKey="k" stroke={th.green} strokeWidth={2} dot={false} name={lang==="TR"?"Kâr":"Profit"} />
                    <Line type="monotone" dataKey="m" stroke={th.accent} strokeWidth={1.5} dot={false} name="%" strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab==="inventory" && (
          <div className="tab-panel tab-panel-inventory">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <span style={{ fontSize:13, fontWeight:700, color:th.accent }}>🏷️ {t.inventory.title}</span>
                <span style={{ fontSize:10, color:th.text3, marginLeft:10, fontStyle:"italic" }}>{t.inventory.auto}</span>
              </div>
              <div style={{ display:"flex", gap:10, fontSize:10 }}>
                <span style={{ color:th.text3 }}>{t.inventory.portfolio}:</span>
                <span style={{ color:isDark?"#f9e84d":th.accent, fontWeight:700, fontFamily:"monospace", fontSize:13 }}>
                  {ƒ.tlF(stokList.reduce((s,b)=>s+Math.round(b.brut*0.85*b.carpan*b.bazF),0))}
                </span>
              </div>
            </div>
            <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:th.bg3 }}>
                    {["No", t.inventory.type, t.inventory.floor, t.inventory.facade, "Brüt m²", "Net m²", t.inventory.mult, t.inventory.base, t.inventory.prem, "TOPLAM SATIŞ"].map(h=>(
                      <th key={h} style={{ padding:"9px 11px", fontSize:9, color:th.accent, letterSpacing:"0.07em", textAlign:"right", borderBottom:`1px solid ${th.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stokList.map((b,i)=>{
                    const nM=Math.round(b.brut*0.85), sF=Math.round(b.carpan*b.bazF), tot=nM*sF;
                    return (
                      <tr key={i} style={{ background:i%2===0?"transparent":th.bg3, borderBottom:`1px solid ${th.border}` }}>
                        {[b.no, b.tip, b.kat, b.cephe, b.brut+" m²", nM+" m²", b.carpan.toFixed(2), b.bazF.toLocaleString("tr-TR"), sF.toLocaleString("tr-TR"), tot.toLocaleString("tr-TR")+" ₺"].map((v,j)=>(
                          <td key={j} style={{ padding:"8px 11px", fontSize:j===0?10:11, textAlign:"right", fontFamily:j>=4?"monospace":"inherit", fontWeight:j===9?700:j===6?700:400, color:j===9?(isDark?"#f9e84d":th.accent):j===6?th.accent:j===8?th.green:th.text }}>{v}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background:isDark?"#0d1420":th.bg4, borderTop:`2px solid ${th.accent}30` }}>
                    <td colSpan={4} style={{ padding:"9px 11px", fontSize:10, color:th.accent, fontWeight:700 }}>{t.inventory.total}</td>
                    <td style={{ padding:"9px 11px", textAlign:"right", fontSize:10, fontWeight:700, color:th.text, fontFamily:"monospace" }}>{stokList.reduce((s,b)=>s+b.brut,0)}</td>
                    <td style={{ padding:"9px 11px", textAlign:"right", fontSize:10, fontWeight:700, color:th.text, fontFamily:"monospace" }}>{stokList.reduce((s,b)=>s+Math.round(b.brut*0.85),0)}</td>
                    <td style={{ padding:"9px 11px", textAlign:"right", fontSize:10, color:th.accent }}>{stokList.length>0?(stokList.reduce((s,b)=>s+b.carpan,0)/stokList.length).toFixed(2):"—"}</td>
                    <td colSpan={2} />
                    <td style={{ padding:"9px 11px", textAlign:"right", fontSize:14, fontWeight:700, color:isDark?"#f9e84d":th.accent, fontFamily:"monospace" }}>{stokList.reduce((s,b)=>s+Math.round(b.brut*0.85*b.carpan*b.bazF),0).toLocaleString("tr-TR")} ₺</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ── 3D KAT KESİTİ ── */}
        {tab==="plan3d" && (
          <div className="tab-panel tab-panel-plan3d">
            <div style={{ fontSize:13, fontWeight:700, color:th.accent, marginBottom:4 }}>🏢 3D BİNA KESİT GÖRÜNÜMÜ</div>
            <div style={{ fontSize:10, color:th.text3, marginBottom:16 }}>
              {lang==="TR"
                ? `${r.katSayisi} katlı bina · Taban: ${Math.round(r.taban)} m² · Toplam: ${Math.round(r.toplamSat)} m²`
                : `${r.katSayisi} floors · Footprint: ${Math.round(r.taban)} m² · Total: ${Math.round(r.toplamSat)} m²`}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
              {/* 3D isometric building */}
              <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:20, display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ fontSize:11, color:th.accent, fontWeight:700, marginBottom:16, letterSpacing:"0.1em" }}>
                  {lang==="TR"?"KESİT GÖRÜNÜMÜ — CEPHE":"CROSS SECTION — FACADE"}
                </div>
                {/* Building cross-section SVG */}
                <svg width="100%" viewBox="0 0 380 420" style={{ maxWidth:400 }}>
                  {/* Sky gradient */}
                  <defs>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={th.isDark?"#0a1520":"#d4e8f8"} />
                      <stop offset="100%" stopColor={th.isDark?"#1a2a3a":"#e8f4fc"} />
                    </linearGradient>
                    <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={th.isDark?"#1a2a1a":"#c8d8b0"} />
                      <stop offset="100%" stopColor={th.isDark?"#0a1a0a":"#a8c090"} />
                    </linearGradient>
                    <linearGradient id="wallFront" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={th.isDark?"#1e3a5f":"#4a7ab5"} />
                      <stop offset="100%" stopColor={th.isDark?"#2a4a70":"#5a8ac5"} />
                    </linearGradient>
                    <linearGradient id="wallSide" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={th.isDark?"#162840":"#3a6090"} />
                      <stop offset="100%" stopColor={th.isDark?"#1e3450":"#4a70a0"} />
                    </linearGradient>
                    <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={th.isDark?"#c9a84c":"#e8c060"} />
                      <stop offset="100%" stopColor={th.isDark?"#a08030":"#c09040"} />
                    </linearGradient>
                  </defs>

                  {/* Background */}
                  <rect width="380" height="420" fill={`url(#skyGrad)`} />

                  {/* Ground */}
                  <rect x="0" y="360" width="380" height="60" fill={`url(#groundGrad)`} />
                  <line x1="0" y1="360" x2="380" y2="360" stroke={th.isDark?"#2a4a2a":"#90b070"} strokeWidth="2" />

                  {/* Trees */}
                  {[30, 330].map((x,i) => (
                    <g key={i}>
                      <rect x={x-4} y="330" width="8" height="30" fill={th.isDark?"#3a2010":"#8b6040"} />
                      <ellipse cx={x} cy="315" rx="18" ry="22" fill={th.isDark?"#1a3a1a":"#3a7a3a"} opacity="0.9" />
                      <ellipse cx={x} cy="310" rx="14" ry="18" fill={th.isDark?"#2a5a2a":"#4a8a4a"} />
                    </g>
                  ))}

                  {/* Building floors - isometric style */}
                  {(() => {
                    const floors = [];
                    const bW = 200; // building width
                    const bX = 90;  // start x
                    const floorH = r.katSayisi > 5 ? 35 : r.katSayisi > 3 ? 45 : 55;
                    const groundY = 355;
                    const totalH = r.katSayisi * floorH;
                    const startY = groundY - totalH;

                    // Shadow
                    floors.push(
                      <ellipse key="shadow" cx={bX+bW/2} cy={groundY+5} rx={bW*0.55} ry={12}
                        fill="rgba(0,0,0,0.3)" />
                    );

                    // Floors bottom to top
                    for (let f = 0; f < r.katSayisi; f++) {
                      const y = startY + (r.katSayisi - 1 - f) * floorH;
                      const isGround = f === 0;
                      const isTop = f === r.katSayisi - 1;
                      const floorColor = isGround
                        ? (th.isDark?"#1e3a5f":"#4a7ab5")
                        : f % 2 === 0
                        ? (th.isDark?"#1a3455":"#4070a8")
                        : (th.isDark?"#1e3a60":"#4878b8");

                      // Floor panel
                      floors.push(
                        <g key={`floor-${f}`}>
                          {/* Main wall */}
                          <rect x={bX} y={y} width={bW} height={floorH}
                            fill={floorColor} stroke={th.isDark?"#2a4a7a":"#3060a0"} strokeWidth="1" />

                          {/* Floor separator line */}
                          <line x1={bX} y1={y} x2={bX+bW} y2={y}
                            stroke={th.isDark?"#c9a84c40":"#80604080"} strokeWidth="1.5" />

                          {/* Windows */}
                          {[0.15, 0.38, 0.62, 0.85].map((wx, wi) => {
                            const winX = bX + bW * wx - 14;
                            const winY = y + floorH * 0.2;
                            const winH = floorH * (isGround ? 0.65 : 0.55);
                            const winW = 28;
                            if (isGround && wi === 0) {
                              // Door
                              return (
                                <g key={wi}>
                                  <rect x={winX-2} y={y+floorH*0.15} width={winW+4} height={floorH*0.85}
                                    fill={th.isDark?"#0a1020":"#1a3060"} stroke={th.isDark?"#c9a84c60":"#c9a84c80"} strokeWidth="1" />
                                  <line x1={winX+winW/2} y1={y+floorH*0.15} x2={winX+winW/2} y2={y+floorH}
                                    stroke={th.isDark?"#c9a84c40":"#c9a84c60"} strokeWidth="0.5" />
                                </g>
                              );
                            }
                            return (
                              <g key={wi}>
                                <rect x={winX} y={winY} width={winW} height={winH}
                                  fill={th.isDark?"#0d2040":"#90c0e8"} stroke={th.isDark?"#3a6090":"#5090c0"} strokeWidth="0.5"
                                  rx="1" />
                                {/* Window cross */}
                                <line x1={winX+winW/2} y1={winY} x2={winX+winW/2} y2={winY+winH}
                                  stroke={th.isDark?"#2a4060":"#4080b0"} strokeWidth="0.5" />
                                <line x1={winX} y1={winY+winH/2} x2={winX+winW} y2={winY+winH/2}
                                  stroke={th.isDark?"#2a4060":"#4080b0"} strokeWidth="0.5" />
                                {/* Light glare */}
                                <rect x={winX+2} y={winY+2} width={winW*0.3} height={winH*0.3}
                                  fill="rgba(255,255,255,0.15)" rx="1" />
                              </g>
                            );
                          })}

                          {/* Floor label */}
                          <text x={bX - 8} y={y + floorH/2 + 4} textAnchor="end"
                            fontSize="9" fill={th.text3} fontFamily="monospace">
                            {f === 0 ? (lang==="TR"?"Z":"G") : f}
                          </text>

                          {/* Floor area label */}
                          <text x={bX + bW + 8} y={y + floorH/2 + 4} textAnchor="start"
                            fontSize="9" fill={th.accent} fontFamily="monospace">
                            {Math.round(f === 0 ? r.taban : r.normalKat)}m²
                          </text>
                        </g>
                      );
                    }

                    // Roof
                    const roofY = startY;
                    floors.push(
                      <g key="roof">
                        {/* Flat roof base */}
                        <rect x={bX-4} y={roofY-8} width={bW+8} height={12}
                          fill={`url(#roofGrad)`} stroke={th.isDark?"#a08030":"#c09040"} strokeWidth="1" />
                        {/* Roof pitch */}
                        <polygon points={`${bX-4},${roofY-8} ${bX+bW/2},${roofY-8-35} ${bX+bW+4},${roofY-8}`}
                          fill={th.isDark?"#8b6020":"#c0a040"} stroke={th.isDark?"#c9a84c":"#e0b050"} strokeWidth="1" />
                        {/* Chimney */}
                        <rect x={bX+bW*0.7} y={roofY-8-50} width={16} height={28}
                          fill={th.isDark?"#3a3a3a":"#808080"} />
                        <rect x={bX+bW*0.7-3} y={roofY-8-52} width={22} height={6}
                          fill={th.isDark?"#4a4a4a":"#909090"} />
                        {/* Roof label */}
                        <text x={bX+bW/2} y={roofY-8-40} textAnchor="middle"
                          fontSize="9" fill={th.accent} fontFamily="monospace">
                          {Math.round(r.catiPiyes)}m² piye
                        </text>
                      </g>
                    );

                    // Dimension lines
                    const totalHeight = r.katSayisi * floorH + 43;
                    floors.push(
                      <g key="dims">
                        {/* Height dimension */}
                        <line x1={bX-30} y1={groundY} x2={bX-30} y2={startY-8}
                          stroke={th.accent} strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
                        <line x1={bX-35} y1={groundY} x2={bX-25} y2={groundY}
                          stroke={th.accent} strokeWidth="1" opacity="0.6" />
                        <line x1={bX-35} y1={startY-8} x2={bX-25} y2={startY-8}
                          stroke={th.accent} strokeWidth="1" opacity="0.6" />
                        <text x={bX-42} y={(groundY+startY-8)/2} textAnchor="middle"
                          fontSize="8" fill={th.accent} fontFamily="monospace"
                          transform={`rotate(-90,${bX-42},${(groundY+startY-8)/2})`}>
                          ~{(r.katSayisi * 2.9 + 2.5).toFixed(0)}m
                        </text>
                        {/* Width dimension */}
                        <line x1={bX} y1={groundY+15} x2={bX+bW} y2={groundY+15}
                          stroke={th.accent} strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
                        <text x={bX+bW/2} y={groundY+28} textAnchor="middle"
                          fontSize="8" fill={th.accent} fontFamily="monospace">
                          ~{Math.round(r.binaEni)}m
                        </text>
                      </g>
                    );

                    return floors;
                  })()}
                </svg>
              </div>

              {/* Floor breakdown panel */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, overflow:"hidden" }}>
                  <div style={{ background:th.bg3, padding:"10px 14px", borderBottom:`1px solid ${th.border}`, fontSize:11, color:th.accent, fontWeight:700 }}>
                    {lang==="TR"?"KAT DAĞILIMI":"FLOOR BREAKDOWN"}
                  </div>
                  {Array.from({length:r.katSayisi+1}, (_,i) => {
                    const isRoof = i === r.katSayisi;
                    const label = isRoof
                      ? (lang==="TR"?"Çatı Piyesi":"Roof Space")
                      : i === 0 ? (lang==="TR"?"Zemin Kat":"Ground Floor")
                      : `${i}. ${lang==="TR"?"Kat":"Floor"}`;
                    const area = isRoof ? r.catiPiyes + r.asmaKat : i === 0 ? r.taban : r.normalKat;
                    const carpan = isRoof ? inp.catiC : i === 0 ? inp.zC : i === 1 ? inp.k1C : i === r.katSayisi-1 ? inp.snC : inp.araC;
                    const color = isRoof ? th.accent : i === 0 ? th.blue : i === r.katSayisi-1 ? "#22c55e" : th.text2;
                    return (
                      <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:8, padding:"8px 12px", borderBottom:`1px solid ${th.border}`, background:i%2===0?"transparent":th.bg3, alignItems:"center" }}>
                        <span style={{ fontSize:11, color }}>{label}</span>
                        <span style={{ fontSize:10, color:th.text3, fontFamily:"monospace" }}>{Math.round(area)}m²</span>
                        <span style={{ fontSize:10, fontWeight:700, color:th.accent, fontFamily:"monospace", background:th.accent+"15", padding:"1px 6px", borderRadius:4 }}>×{carpan.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8, padding:"10px 12px", background:th.isDark?"#0d1420":th.bg4, alignItems:"center" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:th.text }}>{lang==="TR"?"TOPLAM":"TOTAL"}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:th.accent, fontFamily:"monospace" }}>{Math.round(r.toplamSat)}m²</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14 }}>
                  <div style={{ fontSize:10, color:th.accent, fontWeight:700, marginBottom:10 }}>
                    {lang==="TR"?"BİNA BİLGİLERİ":"BUILDING INFO"}
                  </div>
                  {[
                    [lang==="TR"?"Bina Eni":"Building Width", `~${Math.round(r.binaEni)}m`],
                    [lang==="TR"?"Tahmini Yükseklik":"Est. Height", `~${(r.katSayisi*2.9+2.5).toFixed(0)}m`],
                    [lang==="TR"?"Kat Adedi":"Floors", r.katSayisi+" kat"],
                    [lang==="TR"?"Taban Alanı":"Footprint", Math.round(r.taban)+"m²"],
                    [lang==="TR"?"Çatı Piyesi":"Roof Space", Math.round(r.catiPiyes)+"m²"],
                    [lang==="TR"?"Asma Kat":"Mezzanine", Math.round(r.asmaKat)+"m²"],
                    [lang==="TR"?"Açık Alan":"Open Area", Math.round(r.taban>0?r.taban*inp.taks*inp.arsaAlan/r.taban-r.taban:0)+"m²"],
                  ].map(([k,v],i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:i<6?`1px solid ${th.border}`:"none" }}>
                      <span style={{ fontSize:10, color:th.text3 }}>{k}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:th.text, fontFamily:"monospace" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ A vs B SENARYO KARŞILAŞTIRMA ══ */}
        {tab==="compare" && (
          <div className="tab-panel tab-panel-compare">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:th.accent}}>⚖️ {lang==="TR"?"SENARYO KARŞILAŞTIRMA":"SCENARIO COMPARISON"}</div>
                <div style={{fontSize:10,color:th.text3,marginTop:3}}>{lang==="TR"?"Mevcut girdileri A olarak kaydedin, B'yi düzenleyin, yan yana karşılaştırın":"Save current inputs as A, edit B, compare side by side"}</div>
              </div>
              <button onClick={()=>setScenarioA({inp:{...inp},r:{...r}})}
                style={{background:`linear-gradient(135deg,${th.accent}20,${th.accent}10)`,border:`1px solid ${th.accent}`,color:th.accent,borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=th.accent;e.currentTarget.style.color=isDark?"#070a0f":"#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${th.accent}20,${th.accent}10)`;e.currentTarget.style.color=th.accent;}}>
                💾 {lang==="TR"?"Mevcut Girdiyi A Olarak Kaydet":"Save Current as A"}
              </button>
            </div>

            {!scenarioA ? (
              <div style={{background:th.card,border:`2px dashed ${th.accent}40`,borderRadius:14,padding:40,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:12}}>⚖️</div>
                <div style={{fontSize:14,color:th.text2,marginBottom:8}}>{lang==="TR"?"Önce mevcut girdinizi A olarak kaydedin":"First save current inputs as Scenario A"}</div>
                <div style={{fontSize:11,color:th.text3}}>{lang==="TR"?"Sonra girdileri değiştirip karşılaştırın":"Then change inputs to create Scenario B"}</div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div style={{display:"grid",gridTemplateColumns:"180px 1fr 1fr",gap:2,marginBottom:2}}>
                  <div style={{background:th.bg3,borderRadius:"8px 0 0 0",padding:"10px 14px",fontSize:10,color:th.text3,fontWeight:700}}>{lang==="TR"?"METRİK":"METRIC"}</div>
                  <div style={{background:`linear-gradient(135deg,#1a2a1a,#0d1a0d)`,borderRadius:"0",padding:"10px 14px",textAlign:"center",fontSize:11,fontWeight:700,color:th.green,border:`1px solid ${th.green}40`}}>
                    🅐 {lang==="TR"?"SENARYO A (Kaydedildi)":"SCENARIO A (Saved)"}
                    {scenarioA.inp.il&&<div style={{fontSize:9,color:th.text3,marginTop:2}}>{[scenarioA.inp.il,scenarioA.inp.ilce].filter(Boolean).join("/")} {scenarioA.inp.adaNo&&`Ada:${scenarioA.inp.adaNo}`}</div>}
                  </div>
                  <div style={{background:`linear-gradient(135deg,#1a1a2a,#0d0d1a)`,borderRadius:"0 8px 0 0",padding:"10px 14px",textAlign:"center",fontSize:11,fontWeight:700,color:th.blue,border:`1px solid ${th.blue}40`}}>
                    🅑 {lang==="TR"?"SENARYO B (Mevcut)":"SCENARIO B (Current)"}
                    {inp.il&&<div style={{fontSize:9,color:th.text3,marginTop:2}}>{[inp.il,inp.ilce].filter(Boolean).join("/")} {inp.adaNo&&`Ada:${inp.adaNo}`}</div>}
                  </div>
                </div>

                {/* Rows */}
                {[
                  {l:lang==="TR"?"Arsa Alanı":"Plot Area", a:ƒ.m2(scenarioA.inp.arsaAlan), b:ƒ.m2(inp.arsaAlan), num:true, aV:scenarioA.inp.arsaAlan, bV:inp.arsaAlan},
                  {l:"KAKS", a:scenarioA.r.kaks.toFixed(2), b:r.kaks.toFixed(2), aV:scenarioA.r.kaks, bV:r.kaks},
                  {l:lang==="TR"?"Toplam Alan":"Total Area", a:ƒ.m2(scenarioA.r.toplamSat), b:ƒ.m2(r.toplamSat), aV:scenarioA.r.toplamSat, bV:r.toplamSat},
                  {l:lang==="TR"?"Kat Sayısı":"Floors", a:scenarioA.r.katSayisi+" kat", b:r.katSayisi+" kat", aV:scenarioA.r.katSayisi, bV:r.katSayisi},
                  {l:lang==="TR"?"BB Sayısı":"Units", a:scenarioA.r.bbSayisi+" adet", b:r.bbSayisi+" adet", aV:scenarioA.r.bbSayisi, bV:r.bbSayisi},
                  {l:lang==="TR"?"Toplam Maliyet":"Total Cost", a:ƒ.tl(scenarioA.r.topMal), b:ƒ.tl(r.topMal), aV:scenarioA.r.topMal, bV:r.topMal, invert:true},
                  {l:lang==="TR"?"Brüt Satış":"Gross Sales", a:ƒ.tl(scenarioA.r.brutSatis), b:ƒ.tl(r.brutSatis), aV:scenarioA.r.brutSatis, bV:r.brutSatis},
                  {l:lang==="TR"?"Şerefiye Geliri":"Premium Revenue", a:ƒ.tl(scenarioA.r.sGelir), b:ƒ.tl(r.sGelir), aV:scenarioA.r.sGelir, bV:r.sGelir},
                  {l:lang==="TR"?"Net Kâr":"Net Profit", a:ƒ.tl(scenarioA.r.pazKar), b:ƒ.tl(r.pazKar), aV:scenarioA.r.pazKar, bV:r.pazKar, highlight:true},
                  {l:lang==="TR"?"Kâr Marjı":"Profit Margin", a:ƒ.pct(scenarioA.r.pazMarji), b:ƒ.pct(r.pazMarji), aV:scenarioA.r.pazMarji, bV:r.pazMarji, highlight:true},
                  {l:"ROI", a:ƒ.pct(scenarioA.r.roi), b:ƒ.pct(r.roi), aV:scenarioA.r.roi, bV:r.roi, highlight:true},
                  {l:"IRR", a:scenarioA.r.irrYillik?ƒ.pct(scenarioA.r.irrYillik):"—", b:r.irrYillik?ƒ.pct(r.irrYillik):"—", aV:scenarioA.r.irrYillik||0, bV:r.irrYillik||0, highlight:true},
                  {l:"WACC", a:ƒ.pct(scenarioA.r.wacc), b:ƒ.pct(r.wacc), aV:scenarioA.r.wacc, bV:r.wacc},
                  {l:"NBD (NPV)", a:ƒ.tl(scenarioA.r.nbD), b:ƒ.tl(r.nbD), aV:scenarioA.r.nbD, bV:r.nbD, highlight:true},
                ].map(({l,a,b,aV,bV,highlight,invert},i)=>{
                  const aWins = invert ? aV < bV : aV > bV;
                  const bWins = invert ? bV < aV : bV > aV;
                  const same  = aV === bV;
                  return (
                    <div key={i} style={{display:"grid",gridTemplateColumns:"180px 1fr 1fr",gap:2,marginBottom:2}}>
                      <div style={{background:i%2===0?th.bg3:th.card,padding:"9px 14px",fontSize:11,color:highlight?th.text:th.text2,fontWeight:highlight?700:400,display:"flex",alignItems:"center"}}>
                        {l}
                      </div>
                      <div style={{background:aWins&&!same?(isDark?"#0a1f0a":"#e8f5e9"):i%2===0?th.bg3:th.card,border:aWins&&!same?`1px solid ${th.green}30`:"none",padding:"9px 14px",textAlign:"center",fontSize:highlight?13:11,fontWeight:highlight?700:400,color:aWins&&!same?th.green:th.text,fontFamily:"monospace",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                        {a} {aWins&&!same&&<span style={{fontSize:10}}>👑</span>}
                      </div>
                      <div style={{background:bWins&&!same?(isDark?"#0a0a1f":"#e8e8f5"):i%2===0?th.bg3:th.card,border:bWins&&!same?`1px solid ${th.blue}30`:"none",padding:"9px 14px",textAlign:"center",fontSize:highlight?13:11,fontWeight:highlight?700:400,color:bWins&&!same?th.blue:th.text,fontFamily:"monospace",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                        {b} {bWins&&!same&&<span style={{fontSize:10}}>👑</span>}
                      </div>
                    </div>
                  );
                })}

                {/* Verdict */}
                {(()=>{
                  const aScore = [scenarioA.r.pazKar,scenarioA.r.pazMarji,scenarioA.r.roi,scenarioA.r.irrYillik||0,scenarioA.r.nbD].reduce((s,v,i)=>{const bVals=[r.pazKar,r.pazMarji,r.roi,r.irrYillik||0,r.nbD];return s+(v>bVals[i]?1:0)},0);
                  const bScore = 5-aScore;
                  const winner = aScore>bScore?"A":bScore>aScore?"B":"TIE";
                  return (
                    <div style={{marginTop:12,background:winner==="A"?isDark?"#0a1f0a":"#e8f5e9":winner==="B"?isDark?"#0a0a1f":"#e8e8f5":th.card,border:`1px solid ${winner==="A"?th.green:winner==="B"?th.blue:th.accent}40`,borderRadius:10,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:winner==="A"?th.green:winner==="B"?th.blue:th.accent}}>
                          {winner==="TIE"?`🤝 ${lang==="TR"?"İki senaryo dengeli":"Both scenarios equal"}`:`${winner==="A"?"🅐":"🅑"} ${lang==="TR"?"Senaryo Kazanıyor":"Scenario Wins"}`}
                        </div>
                        <div style={{fontSize:10,color:th.text3,marginTop:3}}>
                          {lang==="TR"?`5 finansal metrikten ${winner==="A"?aScore:bScore}'ında üstün`:`Wins in ${winner==="A"?aScore:bScore} of 5 financial metrics`}
                        </div>
                      </div>
                      <div style={{fontSize:11,color:th.text3}}>
                        A: {aScore} | B: {bScore}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ══ OPTIMIZER ══ */}
        {tab==="optimizer" && (
          <div className="tab-panel tab-panel-optimizer">
            <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>🎯 {lang==="TR"?"AKILLI BİRİM DAĞILIMI":"SMART UNIT MIX OPTIMIZER"}</div>
            <div style={{fontSize:10,color:th.text3,marginBottom:16}}>{lang==="TR"?"Toplam satılabilir alanı farklı birim karışımlarıyla test ederek maksimum kârlılığı bulur":"Tests different unit mixes to find maximum profitability"}</div>
            {(()=>{
              const totalArea = r.toplamSat;
              const ticariArea = r.ticariM2;
              const konutArea = r.konutM2;

              // Predefined mixes to test
              const mixes = [
                {name:lang==="TR"?"Sadece Büyük Daire (3+1)":"Large Apts Only", desc:"3+1", dukkanAdet:0,dukkanByk:0,dubleksAdet:0,anaByk:130,icon:"🏠"},
                {name:lang==="TR"?"Dengeli Mix (2+1 ağırlıklı)":"Balanced Mix", desc:"2+1", dukkanAdet:inp.dukkanAdet,dukkanByk:inp.dukkanByk,dubleksAdet:1,anaByk:90,icon:"⚖️"},
                {name:lang==="TR"?"Küçük Daire Odaklı (1+1)":"Small Apt Focus", desc:"1+1", dukkanAdet:inp.dukkanAdet,dukkanByk:inp.dukkanByk,dubleksAdet:0,anaByk:60,icon:"🏢"},
                {name:lang==="TR"?"Ticari Ağırlıklı":"Commercial Heavy", desc:"Ticari+2+1", dukkanAdet:Math.max(4,inp.dukkanAdet*2),dukkanByk:inp.dukkanByk,dubleksAdet:1,anaByk:90,icon:"🏪"},
                {name:lang==="TR"?"Lüks Mix (Dubleks+3+1)":"Luxury Mix", desc:"Dubleks+3+1", dukkanAdet:1,dukkanByk:inp.dukkanByk,dubleksAdet:2,anaByk:120,icon:"⭐"},
                {name:lang==="TR"?"Mevcut Senaryo":"Current Scenario", desc:"Mevcut", dukkanAdet:inp.dukkanAdet,dukkanByk:inp.dukkanByk,dubleksAdet:inp.dubleksAdet,anaByk:inp.anaByk,icon:"📌"},
              ];

              const results = mixes.map(mix=>{
                const testInp = {...inp,...mix};
                const testR = calc(testInp);
                return {...mix, r:testR};
              });

              const best = results.reduce((b,c)=>c.r.pazKar>b.r.pazKar?c:b);

              return (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                    {results.map((mix,i)=>{
                      const isBest = mix.name===best.name;
                      const isCurrent = mix.desc==="Mevcut";
                      return (
                        <div key={i} style={{background:isBest?(isDark?"linear-gradient(135deg,#0a2a0a,#051505)":"linear-gradient(135deg,#e8f5e9,#d0ecd0)"):th.card,border:`${isBest?"2px":"1px"} solid ${isBest?th.green:isCurrent?th.accent:th.border}`,borderRadius:10,padding:14,position:"relative",cursor:"pointer",transition:"transform 0.15s"}}
                          onClick={()=>setInp(p=>({...p,...mix}))}
                          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                          {isBest&&<div style={{position:"absolute",top:-1,right:-1,background:th.green,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 8px",borderRadius:"0 8px 0 6px"}}>🏆 EN İYİ</div>}
                          {isCurrent&&<div style={{position:"absolute",top:-1,left:-1,background:th.accent,color:isDark?"#070a0f":"#fff",fontSize:8,fontWeight:800,padding:"2px 8px",borderRadius:"8px 0 6px 0"}}>📌 MEVCUT</div>}
                          <div style={{fontSize:20,marginBottom:6}}>{mix.icon}</div>
                          <div style={{fontSize:11,fontWeight:700,color:isBest?th.green:th.text,marginBottom:4}}>{mix.name}</div>
                          <div style={{fontSize:16,fontWeight:700,color:isBest?th.green:th.accent,fontFamily:"monospace",marginBottom:4}}>{ƒ.tl(mix.r.pazKar)}</div>
                          <div style={{fontSize:9,color:th.text3}}>
                            {ƒ.pct(mix.r.pazMarji)} marj · {mix.r.bbSayisi} adet
                          </div>
                          <div style={{marginTop:8,fontSize:9,color:th.text3,background:th.bg3,borderRadius:4,padding:"4px 6px"}}>
                            {lang==="TR"?"Uygulamak için tıklayın":"Click to apply"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bar chart comparison */}
                  <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:16}}>
                    <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:12}}>{lang==="TR"?"PAZ. SONRASI NET KÂR KARŞILAŞTIRMASI":"NET PROFIT COMPARISON"}</div>
                    {results.map((mix,i)=>{
                      const pct = best.r.pazKar>0?mix.r.pazKar/best.r.pazKar*100:0;
                      const isBest = mix.name===best.name;
                      return (
                        <div key={i} style={{marginBottom:8}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                            <span style={{fontSize:10,color:isBest?th.green:th.text2}}>{mix.icon} {mix.name}</span>
                            <span style={{fontSize:10,fontWeight:700,color:isBest?th.green:th.text,fontFamily:"monospace"}}>{ƒ.tl(mix.r.pazKar)}</span>
                          </div>
                          <div style={{height:6,background:th.bg,borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",borderRadius:3,width:`${Math.max(0,pct)}%`,background:isBest?`linear-gradient(90deg,${th.green},#4ade80)`:mix.desc==="Mevcut"?`linear-gradient(90deg,${th.accent},#e8c060)`:`linear-gradient(90deg,${th.blue},#60a0f0)`,transition:"width 0.5s"}} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{marginTop:10,fontSize:10,color:th.text3,fontStyle:"italic",textAlign:"center"}}>
                    💡 {lang==="TR"?"Karta tıklayınca o karışım ana girdilere uygulanır — sonuçlar anında güncellenir":"Clicking a card applies that mix to main inputs — results update instantly"}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ AI ÖZET ══ */}
        {tab==="aiozet" && (()=>{
          // Otomatik metin özeti — API gerektirmez
          const karar = r.waccKarar==="CAZIP" ? "✅ DEVAM ET" : r.waccKarar==="SINIRDA" ? "🟡 REVİZE ET" : "🔴 DUR";
          const kararlRenk = r.waccKarar==="CAZIP" ? th.green : r.waccKarar==="SINIRDA" ? "#f59e0b" : th.red;
          const guclu = [];
          const risk = [];
          if (r.pazKar > 0) guclu.push(`Proje ${ƒ.pct(r.pazMarji)} kâr marjıyla pozitif getiri sunuyor`);
          if (r.irrYillik && r.irrYillik > r.hurdle) guclu.push(`IRR (${ƒ.pct(r.irrYillik)}) Hurdle Rate'i (${ƒ.pct(r.hurdle)}) aşıyor — yatırım onaylandı`);
          if (r.irrYillik && r.irrYillik > r.wacc) guclu.push(`IRR > WACC (${ƒ.pct(r.wacc)}) — sermaye maliyetinin üzerinde getiri`);
          if (r.nbD > 0) guclu.push(`NBD pozitif (${ƒ.tl(r.nbD)}) — proje değer yaratıyor`);
          if (r.sKar > r.netKar) guclu.push(`Şerefiye optimizasyonu ek ${ƒ.tl(r.sKar - r.netKar)} kâr katkısı sağlıyor`);
          if (r.emsalUygun) guclu.push(`%30 emsal limiti içinde — imar uyumlu proje`);
          if (r.katSayisi >= 4) guclu.push(`${r.katSayisi} katlı yapı ile alan verimliliği yüksek`);
          if (r.pazKar < 0) risk.push(`Mevcut parametrelerle proje zarar ediyor (${ƒ.tl(r.pazKar)})`);
          if (r.irrYillik && r.irrYillik < r.wacc) risk.push(`IRR (${ƒ.pct(r.irrYillik)}) WACC'ın (${ƒ.pct(r.wacc)}) altında — sermaye maliyeti karşılanamıyor`);
          if (r.nbD < 0) risk.push(`NBD negatif (${ƒ.tl(r.nbD)}) — bugünkü değerde kayıp var`);
          if (r.karErime > 0.15) risk.push(`Eskalasyon etkisi yüksek — enflasyon kârı %${(r.karErime*100).toFixed(0)} eriyebilir`);
          if (!r.emsalUygun) risk.push(`%30 emsal aşımı var — imar revizyonu gerekebilir`);
          if (r.contingency < r.insMal * 0.03) risk.push(`Contingency rezervi düşük — beklenmedik giderler için artırın`);
          const lokasyon = [inp.il,inp.ilce,inp.mahalle].filter(Boolean).join("/") || "Belirtilmemiş";
          const tarih = new Date().toLocaleDateString("tr-TR");

          return (
          <div className="tab-panel tab-panel-aiozet">
            <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>📋 {lang==="TR"?"UZMAN FİZİBİLİTE RAPORU":"EXPERT FEASIBILITY REPORT"}</div>
            <div style={{fontSize:10,color:th.text3,marginBottom:16}}>{lang==="TR"?"Hesaplama motorundan otomatik üretilir — API gerektirmez":"Auto-generated from calculation engine — no API needed"}</div>

            {/* Karar kutusu */}
            <div style={{background:r.waccKarar==="CAZIP"?isDark?"#0a1f0a":"#e8f5e9":r.waccKarar==="SINIRDA"?isDark?"#1a1500":"#fff8e1":isDark?"#1f0a0a":"#fde8e8",border:`2px solid ${kararlRenk}`,borderRadius:12,padding:20,marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:4}}>{r.waccKarar==="CAZIP"?"🏆":r.waccKarar==="SINIRDA"?"⚖️":"⛔"}</div>
              <div style={{fontSize:22,fontWeight:900,color:kararlRenk,marginBottom:4}}>{karar}</div>
              <div style={{fontSize:11,color:th.text2}}>{lokasyon} {inp.adaNo?`| Ada: ${inp.adaNo}`:""} {inp.parselNo?`Parsel: ${inp.parselNo}`:""}</div>
              <div style={{fontSize:10,color:th.text3,marginTop:3}}>{tarih} | {inp.refNo}</div>
            </div>

            {/* Ana metrikler */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
              {[
                {l:"Net Kâr", v:ƒ.tl(r.pazKar), c:r.pazKar>=0?th.green:th.red},
                {l:"Kâr Marjı", v:ƒ.pct(r.pazMarji), c:r.pazMarji>0.15?th.green:r.pazMarji>0.05?"#f59e0b":th.red},
                {l:"IRR", v:r.irrYillik?ƒ.pct(r.irrYillik):"—", c:r.irrYillik&&r.irrYillik>r.hurdle?th.green:"#f59e0b"},
                {l:"WACC", v:ƒ.pct(r.wacc), c:th.text2},
                {l:"NBD", v:ƒ.tl(r.nbD), c:r.nbD>=0?th.green:th.red},
                {l:"ROI", v:ƒ.pct(r.roi), c:r.roi>0.2?th.green:"#f59e0b"},
              ].map(({l,v,c},i)=>(
                <div key={i} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:th.text3,marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Güçlü yönler */}
            {guclu.length>0 && (
              <div style={{background:isDark?"#0a1f0a":"#e8f5e9",border:`1px solid ${th.green}40`,borderRadius:10,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:th.green,marginBottom:8}}>✅ {lang==="TR"?"GÜÇLÜ YÖNLER":"STRENGTHS"}</div>
                {guclu.map((g,i)=>(
                  <div key={i} style={{fontSize:12,color:th.text,marginBottom:5,paddingLeft:12,borderLeft:`2px solid ${th.green}`,lineHeight:1.5}}>{g}</div>
                ))}
              </div>
            )}

            {/* Riskler */}
            {risk.length>0 && (
              <div style={{background:isDark?"#1f0a0a":"#fde8e8",border:`1px solid ${th.red}40`,borderRadius:10,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:th.red,marginBottom:8}}>⚠️ {lang==="TR"?"RİSK FAKTÖRLERİ":"RISK FACTORS"}</div>
                {risk.map((r2,i)=>(
                  <div key={i} style={{fontSize:12,color:th.text,marginBottom:5,paddingLeft:12,borderLeft:`2px solid ${th.red}`,lineHeight:1.5}}>{r2}</div>
                ))}
              </div>
            )}

            {/* Tavsiye */}
            <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:th.accent,marginBottom:8}}>💡 {lang==="TR"?"TAVSİYE":"RECOMMENDATION"}</div>
              <div style={{fontSize:12,color:th.text,lineHeight:1.8}}>
                {r.waccKarar==="CAZIP"
                  ? `Bu proje mevcut parametrelerle finansal açıdan cazip görünmektedir. ${r.irrYillik?`Yıllık IRR ${ƒ.pct(r.irrYillik)} ile hurdle rate'i aşmaktadır.`:""} ${r.nbD>0?`Net Bugünkü Değer ${ƒ.tl(r.nbD)} pozitiftir.`:""} Projeye devam edilmesi tavsiye edilir. Eskalasyon riskine karşı maliyetleri kilitlemek için erken sözleşme yapılması önerilir.`
                  : r.waccKarar==="SINIRDA"
                  ? `Proje sınırda görünmektedir. ${r.karErime>0.1?`Enflasyon etkisi kârı %${(r.karErime*100).toFixed(0)} eriyebilir.`:""} Satış fiyatlarını optimize edin, maliyetleri düşürmeye çalışın veya KAKS artışı için imar revizyonu değerlendirin. Stres testi sekmesinde farklı senaryoları inceleyin.`
                  : `Mevcut parametrelerle proje yeterli getiri sağlamamaktadır. Arsa maliyetini düşürün, inşaat birim maliyetini optimize edin veya satış fiyatlarını revize edin. A vs B sekmesinde farklı senaryoları karşılaştırın.`
                }
              </div>
            </div>

            {/* Kopyala butonu */}
            <button onClick={()=>{
              const txt = `UZMAN FİZİBİLİTE RAPORU — ${tarih}\n${lokasyon}\nRef: ${inp.refNo}\n\nKARARR: ${karar}\n\nNet Kâr: ${ƒ.tl(r.pazKar)} | Marj: ${ƒ.pct(r.pazMarji)} | IRR: ${r.irrYillik?ƒ.pct(r.irrYillik):"—"} | WACC: ${ƒ.pct(r.wacc)}\n\nGÜÇLÜ YÖNLER:\n${guclu.map(g=>`• ${g}`).join("\n")}\n\nRİSKLER:\n${risk.map(r2=>`• ${r2}`).join("\n")}`;
              try{navigator.clipboard.writeText(txt)}catch{const el=document.createElement("textarea");el.value=txt;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}
            }} style={{background:`linear-gradient(135deg,${th.accent},#e8c060)`,border:"none",color:"#070a0f",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",width:"100%"}}>
              📋 {lang==="TR"?"Raporu Kopyala (WhatsApp / E-posta)":"Copy Report"}
            </button>
          </div>
          );
        })()}

        {/* ══ GEÇMİŞ ══ */}
        {tab==="history" && (
          <div className="tab-panel tab-panel-history">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:th.accent}}>📂 {lang==="TR"?"SON HESAPLAMALAR":"RECENT CALCULATIONS"}</div>
                <div style={{fontSize:10,color:th.text3,marginTop:3}}>{lang==="TR"?"Son 10 hesaplama otomatik kaydedilir":"Last 10 calculations saved automatically"}</div>
              </div>
              {history.length>0&&<button onClick={()=>{setHistory([]);try{localStorage.removeItem("arsa_history")}catch{}}}
                style={{background:"transparent",border:`1px solid ${th.red}`,color:th.red,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>
                🗑️ {lang==="TR"?"Temizle":"Clear"}
              </button>}
            </div>
            {history.length===0 ? (
              <div style={{background:th.card,border:`2px dashed ${th.border}`,borderRadius:12,padding:40,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>📂</div>
                <div style={{fontSize:13,color:th.text2}}>{lang==="TR"?"Henüz kayıtlı hesaplama yok":"No saved calculations yet"}</div>
                <div style={{fontSize:10,color:th.text3,marginTop:4}}>{lang==="TR"?"Girdileri değiştirince otomatik kaydedilir":"Changes are auto-saved as you edit"}</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {history.map((h,i)=>(
                  <div key={i} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:"12px 16px",display:"grid",gridTemplateColumns:"auto 1fr auto auto",gap:12,alignItems:"center",cursor:"pointer",transition:"all 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=th.accent}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=th.border}>
                    <div style={{background:th.accent+"20",borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:700,color:th.accent,fontFamily:"monospace",whiteSpace:"nowrap"}}>{h.refNo}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:th.text}}>{h.musteriAdi||[h.il,h.ilce].filter(Boolean).join("/")||"—"}</div>
                      <div style={{fontSize:10,color:th.text3,marginTop:2}}>
                        {h.arsaAlan}m² · KAKS {h.kaks} · {new Date(h.ts).toLocaleDateString(lang==="TR"?"tr-TR":"en-GB")}
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:12,fontWeight:700,color:h.pazKar>=0?th.green:th.red,fontFamily:"monospace"}}>{ƒ.tl(h.pazKar)}</div>
                      <div style={{fontSize:10,color:th.text3}}>{ƒ.pct(h.pazMarji)}</div>
                    </div>
                    <button onClick={()=>setInp(h.inp)}
                      style={{background:th.accent+"20",border:`1px solid ${th.accent}`,color:th.accent,borderRadius:6,padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>
                      {lang==="TR"?"Yükle":"Load"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ DÖVİZ ══ */}
        {tab==="doviz" && (
          <div className="tab-panel tab-panel-doviz">
            <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>💱 {lang==="TR"?"CANLI DÖVİZ DÖNÜŞTÜRÜCÜ":"LIVE CURRENCY CONVERTER"}</div>
            <div style={{fontSize:10,color:th.text3,marginBottom:16}}>{lang==="TR"?"Güncel kur ile TL rakamlarını dövize çevirir (Frankfurter API)":"Converts TL amounts to foreign currency with live rates"}</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:16}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:12}}>{lang==="TR"?"KUR GETİR":"FETCH RATES"}</div>
                <button onClick={async()=>{
                  setKurLoading(true);
                  try {
                    const res = await fetch("https://api.frankfurter.app/latest?from=TRY&to=USD,EUR,GBP");
                    const d = await res.json();
                    const rates = d.rates||{};
                    // RUB için ayrı çağrı
                    const res2 = await fetch("https://api.frankfurter.app/latest?from=TRY&to=RUB");
                    const d2 = await res2.json();
                    setKurlar({ USD:rates.USD||null, EUR:rates.EUR||null, GBP:rates.GBP||null, RUB:d2.rates?.RUB||null });
                  } catch { setKurlar({USD:null,EUR:null,GBP:null,RUB:null}); }
                  setKurLoading(false);
                }} disabled={kurLoading}
                  style={{background:kurLoading?th.bg3:`linear-gradient(135deg,${th.accent},#e8c060)`,border:"none",color:kurLoading?th.text3:"#070a0f",borderRadius:8,padding:"11px 20px",cursor:kurLoading?"default":"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",width:"100%",marginBottom:12}}>
                  {kurLoading?"⏳ Yükleniyor...":"🔄 Canlı Kur Güncelle"}
                </button>
                {Object.entries({USD:"🇺🇸",EUR:"🇪🇺",GBP:"🇬🇧",RUB:"🇷🇺"}).map(([cur,flag])=>(
                  <div key={cur} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${th.border}`,alignItems:"center"}}>
                    <span style={{fontSize:13}}>{flag} {cur}</span>
                    <span style={{fontSize:13,fontWeight:700,color:kurlar[cur]?th.green:th.text3,fontFamily:"monospace"}}>
                      {kurlar[cur] ? `1 TL = ${kurlar[cur].toFixed(4)} ${cur}` : "—"}
                    </span>
                  </div>
                ))}
                <div style={{fontSize:9,color:th.text3,marginTop:8,fontStyle:"italic"}}>Kaynak: Frankfurter / ECB</div>
              </div>

              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:16}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:12}}>{lang==="TR"?"PROJE DEĞERLERİ (DÖVİZ)":"PROJECT VALUES (FOREIGN CURRENCY)"}</div>
                {[
                  {l:lang==="TR"?"Toplam Maliyet":"Total Cost", v:r.topMal},
                  {l:lang==="TR"?"Brüt Satış":"Gross Sales", v:r.brutSatis},
                  {l:lang==="TR"?"Net Kâr":"Net Profit", v:r.pazKar},
                  {l:"NBD (NPV)", v:r.nbD},
                ].map(({l,v},i)=>(
                  <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<3?`1px solid ${th.border}`:"none"}}>
                    <div style={{fontSize:10,color:th.text3,marginBottom:5}}>{l}: <span style={{color:th.text,fontWeight:700,fontFamily:"monospace"}}>{ƒ.tlF(v)}</span></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {["USD","EUR","GBP","RUB"].map(cur=>(
                        <div key={cur} style={{background:th.bg3,borderRadius:5,padding:"4px 8px",fontSize:11,fontFamily:"monospace"}}>
                          <span style={{color:th.text3,fontSize:9}}>{cur} </span>
                          <span style={{color:kurlar[cur]?th.accent:th.text3,fontWeight:700}}>
                            {kurlar[cur] ? new Intl.NumberFormat("en",{notation:"compact",maximumFractionDigits:1}).format(v*kurlar[cur]) : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Birim Fiyat Dönüştürücü */}
            <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:16}}>
              <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>
                {lang==="TR"?"BİRİM FİYAT DÖNÜŞTÜRÜCÜ":"UNIT PRICE CONVERTER"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[
                  {l:lang==="TR"?"Konut ₺/m²":"Residential ₺/m²", v:inp.konutF},
                  {l:lang==="TR"?"Ticari ₺/m²":"Commercial ₺/m²", v:inp.ticariF},
                  {l:lang==="TR"?"İnş. Birim ₺/m²":"Const. ₺/m²", v:inp.insBirim},
                  {l:lang==="TR"?"Ort. Satış ₺/m²":"Avg. Sales ₺/m²", v:r.toplamSat>0?Math.round(r.brutSatis/r.toplamSat):0},
                ].map(({l,v},i)=>(
                  <div key={i} style={{background:th.bg3,borderRadius:8,padding:10}}>
                    <div style={{fontSize:9,color:th.text3,marginBottom:4}}>{l}</div>
                    <div style={{fontSize:12,fontWeight:700,color:th.text,fontFamily:"monospace",marginBottom:4}}>{v?.toLocaleString("tr-TR")} ₺</div>
                    {["USD","EUR"].map(cur=>(
                      <div key={cur} style={{fontSize:10,color:kurlar[cur]?th.accent:th.text3,fontFamily:"monospace"}}>
                        {cur}: {kurlar[cur]?Math.round(v*kurlar[cur]).toLocaleString("en"):"—"}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ HARİTA ══ */}
        {tab==="harita" && (
          <div className="tab-panel tab-panel-harita">
            <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>🗺️ {lang==="TR"?"PARSEL KONUM HARİTASI":"PARCEL LOCATION MAP"}</div>
            <div style={{fontSize:10,color:th.text3,marginBottom:16}}>{lang==="TR"?"Enlem/Boylam girerek parseli haritada gösterin — OpenStreetMap (ücretsiz)":"Enter coordinates to show parcel on map — OpenStreetMap (free)"}</div>

            <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:14}}>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>📍 {lang==="TR"?"KOORDİNATLAR":"COORDINATES"}</div>
                  {[
                    {l:"Enlem (Lat)", k:"lat", ph:"36.8969 (Antalya)"},
                    {l:"Boylam (Lng)", k:"lng", ph:"30.7133 (Antalya)"},
                  ].map(({l,k,ph})=>(
                    <div key={k} style={{marginBottom:10}}>
                      <div style={{fontSize:10,color:th.text3,marginBottom:3}}>{l}</div>
                      <input type="text" value={k==="lat"?haritaLat:haritaLng}
                        onChange={e=>k==="lat"?setHaritaLat(e.target.value):setHaritaLng(e.target.value)}
                        placeholder={ph}
                        style={{background:th.input,border:`1px solid ${th.accent}40`,color:th.inputText||th.accent,borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:"monospace",width:"100%",outline:"none"}} />
                    </div>
                  ))}
                  <div style={{fontSize:10,color:th.text3,marginBottom:8,fontStyle:"italic"}}>
                    💡 {lang==="TR"?"Google Maps'te sağ tıklayın → Koordinatları kopyalayın":"Right-click in Google Maps → Copy coordinates"}
                  </div>
                </div>

                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>{lang==="TR"?"HIZLI KONUM":"QUICK LOCATION"}</div>
                  {[
                    {n:"Antalya Merkez", lat:"36.8969", lng:"30.7133"},
                    {n:"Kepez", lat:"36.9328", lng:"30.7219"},
                    {n:"Lara", lat:"36.8533", lng:"30.7748"},
                    {n:"Konyaaltı", lat:"36.8782", lng:"30.6419"},
                    {n:"Döşemealtı", lat:"37.0233", lng:"30.5742"},
                  ].map((loc,i)=>(
                    <button key={i} onClick={()=>{setHaritaLat(loc.lat);setHaritaLng(loc.lng);}}
                      style={{display:"block",width:"100%",background:haritaLat===loc.lat?th.accent+"20":th.bg3,border:`1px solid ${haritaLat===loc.lat?th.accent:th.border}`,color:haritaLat===loc.lat?th.accent:th.text2,borderRadius:6,padding:"7px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit",textAlign:"left",marginBottom:4}}>
                      📍 {loc.n}
                    </button>
                  ))}
                </div>

                <a href={haritaLat&&haritaLng?`https://www.google.com/maps?q=${haritaLat},${haritaLng}`:"#"} target="_blank" rel="noopener noreferrer"
                  style={{background:"linear-gradient(135deg,#4285f4,#34a853)",color:"white",borderRadius:8,padding:"10px 14px",textAlign:"center",fontSize:12,fontWeight:700,textDecoration:"none",display:"block",opacity:haritaLat&&haritaLng?1:0.4}}>
                  🗺️ Google Maps'te Aç
                </a>
              </div>

              {/* OpenStreetMap iframe */}
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,overflow:"hidden"}}>
                {haritaLat && haritaLng ? (
                  <iframe
                    key={`${haritaLat}-${haritaLng}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(haritaLng)-0.01},${parseFloat(haritaLat)-0.007},${parseFloat(haritaLng)+0.01},${parseFloat(haritaLat)+0.007}&layer=mapnik&marker=${haritaLat},${haritaLng}`}
                    style={{width:"100%",height:420,border:"none"}}
                    title="Parsel Konumu"
                  />
                ) : (
                  <div style={{height:420,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
                    <div style={{fontSize:48}}>🗺️</div>
                    <div style={{fontSize:13,color:th.text2}}>{lang==="TR"?"Koordinat girin":"Enter coordinates"}</div>
                    <div style={{fontSize:10,color:th.text3}}>{lang==="TR"?"Sol taraftan enlem/boylam girin":"Enter lat/lng on the left"}</div>
                  </div>
                )}
                {haritaLat && haritaLng && (
                  <div style={{padding:"8px 12px",background:th.bg3,borderTop:`1px solid ${th.border}`,fontSize:10,color:th.text3,display:"flex",justifyContent:"space-between"}}>
                    <span>📍 {haritaLat}, {haritaLng}</span>
                    <span>{inp.il||""} {inp.ilce||""} {inp.adaNo?`| Ada: ${inp.adaNo}`:""} {inp.parselNo?`Parsel: ${inp.parselNo}`:""}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ SLİDER SİMÜLATÖR ══ */}
        {tab==="slider" && (() => {
          const malDelta = sliderMal/100;
          const fiyDelta = sliderFiy/100;
          const simMal = r.topMal * (1+malDelta);
          const simGelir = r.sGelir * (1+fiyDelta);
          const simKar = simGelir - simMal - r.pazGider;
          const simMarj = simGelir>0 ? simKar/simGelir : 0;
          const simROI = simMal>0 ? simKar/simMal : 0;
          const karFark = simKar - r.pazKar;
          return (
            <div>
              <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>🎚️ {lang==="TR"?"CANLI DUYARLILIK SİMÜLATÖRÜ":"LIVE SENSITIVITY SIMULATOR"}</div>
              <div style={{fontSize:10,color:th.text3,marginBottom:20}}>{lang==="TR"?"Kaydırarak anlık etkiyi görün — hiçbir şeyi kaydetmez":"Slide to see instant impact — nothing is saved"}</div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                {/* Sliders */}
                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:18}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:16}}>{lang==="TR"?"DEĞİŞKENLER":"VARIABLES"}</div>

                  {[
                    {l:lang==="TR"?"Maliyet Değişimi":"Cost Change", val:sliderMal, set:setSliderMal, color:th.red, icon:"🏗️"},
                    {l:lang==="TR"?"Satış Fiyatı Değişimi":"Price Change", val:sliderFiy, set:setSliderFiy, color:th.green, icon:"💰"},
                  ].map(({l,val,set:setV,color,icon},i)=>(
                    <div key={i} style={{marginBottom:20}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:11,color:th.text}}>{icon} {l}</span>
                        <span style={{fontSize:14,fontWeight:700,color:val>0?color:val<0?th.green:th.text3,fontFamily:"monospace"}}>
                          {val>0?"+":""}{val}%
                        </span>
                      </div>
                      <input type="range" min="-30" max="30" value={val}
                        onChange={e=>setV(parseInt(e.target.value))}
                        style={{width:"100%",accentColor:color,height:4}} />
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                        <span style={{fontSize:9,color:th.text3}}>−30%</span>
                        <span style={{fontSize:9,color:th.text3}}>0</span>
                        <span style={{fontSize:9,color:th.text3}}>+30%</span>
                      </div>
                    </div>
                  ))}

                  <button onClick={()=>{setSliderMal(0);setSliderFiy(0);}}
                    style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text3,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:10,fontFamily:"inherit",width:"100%"}}>
                    ↺ {lang==="TR"?"Sıfırla":"Reset"}
                  </button>
                </div>

                {/* Live results */}
                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:18}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:16}}>{lang==="TR"?"ANLIK SONUÇ":"INSTANT RESULT"}</div>

                  {[
                    {l:lang==="TR"?"Yeni Maliyet":"New Cost", v:simMal, base:r.topMal, c:th.red},
                    {l:lang==="TR"?"Yeni Gelir":"New Revenue", v:simGelir, base:r.sGelir, c:th.blue},
                    {l:lang==="TR"?"Yeni Net Kâr":"New Net Profit", v:simKar, base:r.pazKar, c:simKar>=0?th.green:th.red, big:true},
                    {l:lang==="TR"?"Yeni Marj":"New Margin", v:simMarj, base:r.pazMarji, c:simMarj>0.15?th.green:simMarj>0.05?"#f59e0b":th.red, pct:true},
                  ].map(({l,v,base,c,big,pct},i)=>(
                    <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<3?`1px solid ${th.border}`:"none"}}>
                      <div style={{fontSize:9,color:th.text3,marginBottom:3}}>{l}</div>
                      <div style={{fontSize:big?22:14,fontWeight:700,color:c,fontFamily:"monospace"}}>
                        {pct ? ƒ.pct(v) : ƒ.tl(v)}
                      </div>
                      <div style={{fontSize:9,marginTop:2,color:(v-base)>=0?th.green:th.red}}>
                        {pct ? `${((v-base)*100).toFixed(1)}pp` : ƒ.tl(v-base)} {(v-base)>=0?"▲":"▼"} {lang==="TR"?"baz değerden":"from base"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual bar comparison */}
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:16}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:12}}>{lang==="TR"?"BAZ vs SİMÜLASYON":"BASE vs SIMULATION"}</div>
                {[
                  {l:lang==="TR"?"Baz Net Kâr":"Base Net Profit", v:r.pazKar, c:th.text2},
                  {l:lang==="TR"?"Simülasyon Net Kâr":"Simulation Net Profit", v:simKar, c:simKar>=r.pazKar?th.green:th.red},
                ].map(({l,v,c},i)=>{
                  const maxV = Math.max(Math.abs(r.pazKar),Math.abs(simKar),1);
                  const pct = Math.min(100,Math.abs(v)/maxV*100);
                  return (
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:10,color:c}}>{l}</span>
                        <span style={{fontSize:11,fontWeight:700,color:c,fontFamily:"monospace"}}>{ƒ.tl(v)}</span>
                      </div>
                      <div style={{height:8,background:th.bg,borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:4,width:`${pct}%`,background:v>=0?`linear-gradient(90deg,${c},${c}88)`:`linear-gradient(90deg,${th.red},${th.red}88)`,transition:"width 0.4s ease"}} />
                      </div>
                    </div>
                  );
                })}
                <div style={{marginTop:12,padding:"10px 14px",borderRadius:8,background:karFark>=0?th.green+"15":th.red+"15",border:`1px solid ${karFark>=0?th.green:th.red}30`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:th.text}}>{lang==="TR"?"Kâr Farkı:":"Profit Difference:"}</span>
                  <span style={{fontSize:16,fontWeight:700,color:karFark>=0?th.green:th.red,fontFamily:"monospace"}}>
                    {karFark>=0?"+":""}{ƒ.tl(karFark)}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
      <ClippyWidget />
    </div>
    </Ctx.Provider>
  );
      }

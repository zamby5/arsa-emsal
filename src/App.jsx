import { useState, useMemo, useCallback, useEffect, useRef, createContext, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";

/* ─── MARKA ─── */
const BRAND = { firmaAdi:"Turyap Queen", uzmanAdi:"Murat İyicioğlu", unvan:"Gayrimenkul Yatırım Uzmanı", whatsapp:"905324564866", whatsappMsg:"Merhaba, arsa fizibilite raporu hakkında bilgi almak istiyorum.", watermark:"TURYAP QUEEN" };
const makeRefNo = () => `REF-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,"0")}-${Math.floor(Math.random()*900)+100}`;

/* ─── i18n ─── */
const LANGS = {
  TR:{ appName:"Arsa Emsal", quickMode:"Hızlı Mod", proMode:"Profesyonel Mod", free:"Ücretsiz · Tarayıcıda çalışır · Veri paylaşımı yok", goHome:"← Ana Sayfa", proSwitch:"📊 Pro Mod →", shareLink:"🔗 Link Paylaş", linkCopied:"✅ Kopyalandı!", liveResults:"ANLIK SONUÇLAR", edit:"✏️ Düzenle", lock:"🔒 Kilitle",
    tabs:{ overview:"🏠 Özet", inputs:"⚙️ Girdiler", cost:"💰 Maliyet", revenue:"📈 Gelir", cashflow:"🔄 Nakit/IRR", stress:"🔬 Stres", inventory:"🏷️ Stok", plan3d:"🏢 3D Kesit", compare:"⚖️ A vs B", optimizer:"🎯 Optimizer", aiozet:"📋 Rapor", doviz:"💱 Döviz", harita:"🗺️ Harita" },
    sections:{ parcel:"⬡ PARSEL & İMAR", cost:"⬡ MALİYET", revenue:"⬡ GELİR & SATIŞ", premium:"⬡ ŞEREFİYE", wacc:"⬡ WACC / SERMAYE" },
    fields:{ arsaAlan:"Arsa Alanı", il:"İl", ilce:"İlçe", mahalle:"Mahalle", adaNo:"Ada No", parselNo:"Parsel No", planNotu:"Plan Notu (KAKS/H)", kaks:"KAKS", taks:"TAKS", parselEn:"Parsel Eni", parselBoy:"Parsel Boyu", onCekme:"Ön Çekme", arkaCekme:"Arka Çekme", yanCekme:"Yan Çekme", nizam:"Nizam", bonus:"Emsal Bonusu", cikmaD:"Çıkma Derinliği", cikmaF:"Çıkma Cephesi", fire:"Çatı Fire", asma:"Asma Kat", bodrum:"Bodrum", insBirim:"İnş. Birim ₺/m²", projeG:"Proje/Ruhsat", altyapiG:"Altyapı", finOran:"Finansman Oranı", cont:"Contingency", insSure:"İnşaat Süresi (ay)", konutF:"Konut Fiyatı ₺/m²", ticariF:"Ticari Fiyat ₺/m²", dukkanByk:"Dükkan m²", dukkanAdet:"Dükkan Adet", dubleksByk:"Dubleks m²", dubleksAdet:"Dubleks Adet", anaByk:"Daire m²", zC:"Zemin Kat Çarpanı", k1C:"1. Kat", araC:"Ara Kat", snC:"Son Kat", catiC:"Çatı/Dblks", kuzey:"Kuzey Cephe", guney:"Güney Cephe", ozkaynak:"Özkaynak Oranı", ozGetiri:"Öz. Getiri Beklentisi", krediF:"Kredi Faizi", kurumlarV:"Kurumlar Vergisi", projeSure:"Proje Süresi (yıl)", pazOran:"Pazarlama Gideri", eskalOran:"Eskalasyon/ay", onSatisO:"Ön Satış Oranı" },
    kpis:{ totalSat:"TOPLAM ALAN", kat:"KAT SAYISI", bb:"BB SAYISI", maliyet:"MALİYET", brut:"SATIŞ", pazKar:"NET KÂR", irr:"IRR", nbD:"NBD" },
    status:{ emsal30Ok:"✅ %30 Emsal OK", emsal30Fail:"🔴 %30 Aşım", cikmaOk:"✅ Çıkma OK", cikmaFail:"⚠️ Çıkma İhlal", profitOk:"✅ Kârlı", profitFail:"🔴 Zarar" },
  },
  EN:{ appName:"Land Emsal", quickMode:"Quick Mode", proMode:"Professional Mode", free:"Free · Runs in browser · No data sharing", goHome:"← Home", proSwitch:"📊 Pro Mode →", shareLink:"🔗 Share", linkCopied:"✅ Copied!", liveResults:"LIVE RESULTS", edit:"✏️ Edit", lock:"🔒 Lock",
    tabs:{ overview:"🏠 Overview", inputs:"⚙️ Inputs", cost:"💰 Cost", revenue:"📈 Revenue", cashflow:"🔄 Cash/IRR", stress:"🔬 Stress", inventory:"🏷️ Stock", plan3d:"🏢 3D View", compare:"⚖️ A vs B", optimizer:"🎯 Optimizer", aiozet:"📋 Report", doviz:"💱 Currency", harita:"🗺️ Map" },
    sections:{ parcel:"⬡ PARCEL & ZONING", cost:"⬡ COST", revenue:"⬡ REVENUE", premium:"⬡ PREMIUM", wacc:"⬡ WACC / CAPITAL" },
    fields:{ arsaAlan:"Plot Area", il:"Province", ilce:"District", mahalle:"Neighbourhood", adaNo:"Block", parselNo:"Parcel", planNotu:"Zoning Notes (FAR/H)", kaks:"FAR", taks:"Coverage", parselEn:"Width", parselBoy:"Depth", onCekme:"Front", arkaCekme:"Rear", yanCekme:"Side", nizam:"Type", bonus:"FAR Bonus", cikmaD:"Proj.Depth", cikmaF:"Proj.Width", fire:"Roof Loss", asma:"Mezzanine", bodrum:"Basement", insBirim:"Const.Cost", projeG:"Project", altyapiG:"Infra", finOran:"Finance", cont:"Contingency", insSure:"Duration(mo)", konutF:"Res.Price", ticariF:"Com.Price", dukkanByk:"Shop m²", dukkanAdet:"Shops", dubleksByk:"Duplex m²", dubleksAdet:"Duplexes", anaByk:"Apt m²", zC:"Ground", k1C:"1st Fl.", araC:"Mid Fl.", snC:"Top Fl.", catiC:"Roof", kuzey:"North", guney:"South", ozkaynak:"Equity", ozGetiri:"Eq.Return", krediF:"Loan Rate", kurumlarV:"Corp.Tax", projeSure:"Duration(yr)", pazOran:"Marketing", eskalOran:"Escalation", onSatisO:"Pre-sale" },
    kpis:{ totalSat:"TOTAL AREA", kat:"FLOORS", bb:"UNITS", maliyet:"COST", brut:"SALES", pazKar:"NET PROFIT", irr:"IRR", nbD:"NPV" },
    status:{ emsal30Ok:"✅ 30% OK", emsal30Fail:"🔴 30% Over", cikmaOk:"✅ Proj.OK", cikmaFail:"⚠️ Proj.", profitOk:"✅ Profit", profitFail:"🔴 Loss" },
  }
};

/* ─── Themes ─── */
const DARK={bg:"#05090f",bg2:"#080e18",bg3:"#0d1a28",border:"#1a2a3a",border2:"#2a3a4a",text:"#d8cfc0",text2:"#8090a0",text3:"#506070",accent:"#c9a84c",nav:"#040c16",navBorder:"#c9a84c25",card:"#080e18",input:"#0d1f32",inputText:"#f9e84d",green:"#22c55e",red:"#ef4444",blue:"#3b82f6",purple:"#8b5cf6",teal:"#14b8a6",tooltipBg:"#080e18"};
const LIGHT={bg:"#f4f0e8",bg2:"#ffffff",bg3:"#faf7f1",border:"#d4cdc0",border2:"#bfb8ab",text:"#2a2018",text2:"#6b5c48",text3:"#9a8c78",accent:"#7a5c10",nav:"#1a1208",navBorder:"#c9a84c40",card:"#ffffff",input:"#faf7f1",inputText:"#5c4010",green:"#15803d",red:"#dc2626",blue:"#1d4ed8",purple:"#6d28d9",teal:"#0f766e",tooltipBg:"#ffffff"};

const Ctx = createContext({th:DARK,lang:"TR",t:LANGS.TR});
const useCtx = () => useContext(Ctx);

/* ─── Calc Engine ─── */
function calc(g) {
  const n=(v,d=0)=>{const p=parseFloat(v);return isNaN(p)?d:p;};
  const arsaAlan=n(g.arsaAlan,1000);
  const planNotu=(g.planNotu||"").toUpperCase();
  const parsePN=(key,fb)=>{const m=planNotu.match(new RegExp(key+"[=:\\s]+([0-9.]+)"));return m?parseFloat(m[1]):fb;};
  const kaks=parsePN("KAKS|E",n(g.kaks,1.5)),taks=parsePN("TAKS",n(g.taks,0.4)),planH=parsePN("H|YUKSEKLIK",0);
  const pEn=n(g.parselEn,20),pBoy=n(g.parselBoy,50),onC=n(g.onCekme,5),arkaC=n(g.arkaCekme,3),yanC=n(g.yanCekme,6);
  const bonus=n(g.bonus,0),cikmaD=n(g.cikmaD,1.5),cikmaF=n(g.cikmaF,13),fire=n(g.fire,0.45),asma=n(g.asma,0.30),bodrum=n(g.bodrum,0);
  const insBirim=n(g.insBirim,20000),projeG=n(g.projeG,150000),altyapiG=n(g.altyapiG,100000),finOran=n(g.finOran,0.10),cont=n(g.cont,0.05),insSure=n(g.insSure,18);
  const konutF=n(g.konutF,35000),ticariF=n(g.ticariF,50000),dukkanByk=n(g.dukkanByk,120),dukkanAdet=n(g.dukkanAdet,2),dubleksByk=n(g.dubleksByk,160),dubleksAdet=n(g.dubleksAdet,1),anaByk=n(g.anaByk,90);
  const eskalOran=n(g.eskalOran,0.03),onSatisO=n(g.onSatisO,0.3),insSatisO=n(g.insSatisO,0.5);
  const ozkaynak=n(g.ozkaynak,0.4),ozGetiri=n(g.ozGetiri,0.30),krediF=n(g.krediF,0.42),kurumlarV=n(g.kurumlarV,0.25),projeSure=n(g.projeSure,1.5),pazOran=n(g.pazOran,0.04);
  const zC=n(g.zC,0.88),k1C=n(g.k1C,0.93),araC=n(g.araC,1.0),snC=n(g.snC,1.08),catiC=n(g.catiC,1.18),kuzey=n(g.kuzey,-0.05),guney=n(g.guney,0.07);
  const nizam=g.nizam||"AYRK";
  const etkinYan=nizam==="BİLEŞ"?0:nizam==="İKİZ"?yanC/2:yanC;
  const binaEni=Math.max(0,pEn-etkinYan);
  const taban=Math.min(arsaAlan*taks,Math.max(0,binaEni*(pBoy-onC-arkaC)));
  const yasalEmsal=arsaAlan*kaks*(1+bonus);
  const cikmaAlan=cikmaF*cikmaD,normalKat=taban+cikmaAlan;
  const katSayisi=normalKat>0?(yasalEmsal>taban?Math.max(1,1+Math.floor((yasalEmsal-taban)/normalKat)):1):1;
  const catiPiyes=normalKat*(1-fire),asmaKat=taban*Math.min(asma,0.5),bodrumKaz=taban*bodrum;
  const emsalDisi=(katSayisi>1?(katSayisi-1)*cikmaAlan:0)+catiPiyes+asmaKat;
  const emsalUygun=yasalEmsal>0&&emsalDisi<=yasalEmsal*0.3,cikmaUygun=(onC-cikmaD)>=3;
  const toplamSat=yasalEmsal+emsalDisi+bodrumKaz,ticariM2=dukkanAdet*dukkanByk;
  const konutM2=Math.max(0,toplamSat-ticariM2),kalan=Math.max(0,toplamSat-ticariM2-dubleksAdet*dubleksByk);
  const anaAdet=anaByk>0?Math.floor(kalan/anaByk):0,bbSayisi=dukkanAdet+dubleksAdet+anaAdet;
  const insMal=toplamSat*insBirim,contingency=insMal*cont,finG=insMal*finOran;
  const topMal=insMal+finG+projeG+altyapiG+contingency;
  const konutGelir=konutM2*konutF,ticariGelir=ticariM2*ticariF,brutSatis=konutGelir+ticariGelir;
  const netKar=brutSatis-topMal,karMarji=brutSatis>0?netKar/brutSatis:0,roi=topMal>0?netKar/topMal:0;
  const sGelir=(taban*konutF*zC+(katSayisi>=2?normalKat*konutF*k1C:0)+(katSayisi>=4?(katSayisi-3)*normalKat*konutF*araC:0)+(katSayisi>=3?normalKat*konutF*snC:0)+(catiPiyes+asmaKat)*konutF*catiC)*(1+guney*0.3+kuzey*0.3)+ticariGelir;
  const sKar=sGelir-topMal;
  const eskMal=insMal*(1+eskalOran*insSure*0.65)+finG*(1+eskalOran*insSure*0.65)+projeG+altyapiG+contingency;
  const eskKar=sGelir-eskMal,karErime=sKar!==0?Math.max(0,(sKar-eskKar)/Math.abs(sKar)):0;
  const katKarsiligiAktif=g.katKarsiligiAktif||false,katKarsiligiOran=n(g.katKarsiligiOran,0.45);
  const pazGider=brutSatis*pazOran,kkPayi=katKarsiligiAktif?sGelir*katKarsiligiOran:0;
  const pazKar=sGelir-topMal-pazGider-kkPayi,pazMarji=sGelir>0?pazKar/sGelir:0;
  const krediOran=1-ozkaynak,netKrediF=krediF*(1-kurumlarV),wacc=ozkaynak*ozGetiri+krediOran*netKrediF,hurdle=wacc+0.05;
  const ozTutar=topMal*ozkaynak,krediTutar=topMal*krediOran,projRoi=ozTutar>0?pazKar/ozTutar:0;
  const waccKarar=projRoi>hurdle?"CAZIP":projRoi>wacc?"SINIRDA":"RİSKLİ";
  const nbD=pazKar/Math.pow(1+wacc,projeSure)-ozTutar;
  const cf0=-ozTutar,cf1=brutSatis*onSatisO+brutSatis*insSatisO-(topMal-ozTutar)*0.6,cf2=brutSatis*(1-onSatisO-insSatisO)-(topMal-ozTutar)*0.4;
  let irrVal=null,lo=-0.99,hi=10;
  for(let i=0;i<300;i++){const m=(lo+hi)/2;const npv=cf0+cf1/(1+m)+cf2/Math.pow(1+m,2);if(Math.abs(npv)<100){irrVal=m;break;}if(npv>0)lo=m;else hi=m;}
  const irrYillik=irrVal!==null?Math.pow(1+irrVal,12/(insSure/2))-1:null;
  return {planH,kaks,taks,taban,binaEni,yasalEmsal,normalKat,katSayisi,catiPiyes,asmaKat,bodrumKaz,emsalDisi,emsalUygun,cikmaUygun,toplamSat,ticariM2,konutM2,anaAdet,bbSayisi,insMal,contingency,finG,topMal,konutGelir,ticariGelir,brutSatis,netKar,karMarji,roi,sGelir,sKar,eskKar,karErime,pazGider,pazKar,pazMarji,kkPayi,katKarsiligiAktif,katKarsiligiOran,wacc,hurdle,projRoi,waccKarar,nbD,ozTutar,krediTutar,irrVal,irrYillik,cf0,cf1,cf2};
}

/* ─── Defaults ─── */
const D={musteriAdi:"",refNo:makeRefNo(),arsaAlan:1000,il:"",ilce:"",mahalle:"",adaNo:"",parselNo:"",planNotu:"",imarTipi:"MANUEL",kaks:1.5,taks:0.4,parselEn:20,parselBoy:50,onCekme:5,arkaCekme:3,yanCekme:6,bonus:0,nizam:"AYRK",cikmaD:1.5,cikmaF:13,fire:0.45,asma:0.30,bodrum:0,insBirim:20000,projeG:150000,altyapiG:100000,finOran:0.10,cont:0.05,insSure:18,konutF:35000,ticariF:50000,dukkanByk:120,dukkanAdet:2,dubleksByk:160,dubleksAdet:1,anaByk:90,eskalOran:0.03,onSatisO:0.3,insSatisO:0.5,ozkaynak:0.4,ozGetiri:0.30,krediF:0.42,kurumlarV:0.25,projeSure:1.5,pazOran:0.04,katKarsiligiAktif:false,katKarsiligiOran:0.45,zC:0.88,k1C:0.93,araC:1.00,snC:1.08,catiC:1.18,kuzey:-0.05,guney:0.07};

/* ─── Formatters ─── */
const ƒ={
  tl:(v)=>{if(v==null||isNaN(v))return"—";const a=Math.abs(v);const s=v<0?"−":"";return s+(a>=1e6?(a/1e6).toFixed(1)+" M₺":a>=1e3?(a/1e3).toFixed(0)+" K₺":a.toFixed(0)+" ₺");},
  tlF:(v)=>v==null?"—":new Intl.NumberFormat("tr-TR",{maximumFractionDigits:0}).format(v)+" ₺",
  pct:(v,d=1)=>v==null||isNaN(v)?"—":(v*100).toFixed(d)+"%",
  m2:(v)=>v==null||isNaN(v)?"—":Math.round(v).toLocaleString("tr-TR")+" m²",
  num:(v)=>Math.round(v).toLocaleString("tr-TR"),
};
const encState=(inp)=>{try{return btoa(unescape(encodeURIComponent(JSON.stringify(inp))));}catch{return"";}};
const decState=(s)=>{try{return JSON.parse(decodeURIComponent(escape(atob(s))));}catch{return null;}};
const getInit=()=>{try{const s=new URL(window.location.href).searchParams.get("s");if(s){const d=decState(s);if(d)return{...D,...d};}}catch{}return D;};

/* ─── AnimNum ─── */
function AnimNum({value,fmt}){
  const[disp,setDisp]=useState(value);const prev=useRef(value);
  useEffect(()=>{const e=typeof value==="number"?value:0;if(prev.current===e)return;const s=prev.current,dur=500,t0=performance.now();const f=t=>{const p=Math.min(1,(t-t0)/dur),ease=1-Math.pow(1-p,3);setDisp(s+(e-s)*ease);if(p<1)requestAnimationFrame(f);else{setDisp(e);prev.current=e;}};requestAnimationFrame(f);},[value]);
  return<>{fmt(typeof disp==="number"?disp:0)}</>;
}

/* ─── Inp ─── */
function Inp({label,field,unit,step="any",min,max,options,tip,inp,set,locked}){
  const{th}=useCtx();
  const base={background:locked?th.bg3:th.input,border:`1px solid ${locked?th.border:th.accent+"60"}`,color:locked?th.text3:th.inputText||th.accent,borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:"monospace",fontWeight:700,flex:1,outline:"none",cursor:locked?"not-allowed":"text"};
  const btnS={background:locked?th.bg3:th.input,border:`1px solid ${th.accent+"50"}`,color:locked?th.text3:th.accent,borderRadius:5,width:26,height:26,cursor:locked?"not-allowed":"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:locked?0.4:1};
  const step2=step==="any"?1:parseFloat(step)||1;
  const doStep=(dir)=>{if(locked)return;const cur=parseFloat(inp[field])||0;const next=Math.round((cur+dir*step2)*10000)/10000;if(min!==undefined&&next<min)return;if(max!==undefined&&next>max)return;set(field,next);};
  return(
    <div style={{marginBottom:10}}>
      <label style={{display:"block",fontSize:10,color:th.text3,marginBottom:3,letterSpacing:"0.07em"}}>{label}{tip&&<span title={tip} style={{marginLeft:3,cursor:"help",color:th.text3}}>ⓘ</span>}</label>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        {options?<select value={inp[field]} onChange={e=>!locked&&set(field,e.target.value)} disabled={locked} style={{...base,cursor:locked?"not-allowed":"pointer"}}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>:(
          <><button onMouseDown={()=>doStep(-1)} style={btnS}>−</button>
          <input type="number" value={inp[field]} step={step} min={min} max={max} onChange={e=>!locked&&set(field,parseFloat(e.target.value)||0)} readOnly={locked} style={{...base,textAlign:"center"}}/>
          <button onMouseDown={()=>doStep(1)} style={btnS}>+</button></>
        )}
        {unit&&<span style={{fontSize:9,color:th.text3,minWidth:22}}>{unit}</span>}
      </div>
    </div>
  );
}

/* ─── Kpi ─── */
function Kpi({label,value,sub,accent,warn=false,fmt}){
  const{th}=useCtx();const ac=accent||th.accent;
  const fmtFn=fmt||(typeof value==="string"?(()=>value):ƒ.tl);
  return(
    <div style={{background:warn?th.red+"12":th.card,border:`1px solid ${warn?th.red+"40":ac+"35"}`,borderTop:`2px solid ${warn?th.red:ac}`,borderRadius:8,padding:"10px 12px",transition:"transform 0.15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{fontSize:9,color:th.text3,letterSpacing:"0.1em",marginBottom:4}}>{label}</div>
      <div style={{fontSize:15,fontWeight:700,color:warn?th.red:th.text,fontFamily:"monospace"}}><AnimNum value={typeof value==="number"?value:0} fmt={fmtFn}/></div>
      {sub&&<div style={{fontSize:9,color:th.text3,marginTop:3}}>{sub}</div>}
    </div>
  );
}
function SecTitle({children}){const{th}=useCtx();return<div style={{fontSize:10,color:th.accent,fontWeight:700,letterSpacing:"0.12em",marginBottom:10,paddingBottom:5,borderBottom:`1px solid ${th.accent+"30"}`}}>{children}</div>;}
function Badge({ok,okText,failText}){const{th}=useCtx();return<span style={{background:ok?th.green+"18":th.red+"18",border:`1px solid ${ok?th.green+"45":th.red+"45"}`,color:ok?th.green:th.red,fontSize:10,fontWeight:600,padding:"5px 12px",borderRadius:20}}>{ok?okText:failText}</span>;}
const TT={fontSize:9};const CC=["#c9a84c","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#ec4899","#14b8a6","#f97316"];

/* ═══════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════ */
export default function App() {
  const[isDark,setIsDark]=useState(true);
  const[lang,setLang]=useState("TR");
  const[mode,setMode]=useState("splash");
  const[tab,setTab]=useState("overview");
  const[inp,setInp]=useState(getInit);
  const[copied,setCopied]=useState(false);
  const[anim,setAnim]=useState(false);
  const[isFullscreen,setIsFullscreen]=useState(false);
  const[scenarioA,setScenarioA]=useState(null);
  const[kurlar,setKurlar]=useState({USD:null,EUR:null,GBP:null,RUB:null});
  const[kurLoading,setKurLoading]=useState(false);
  const[haritaLat,setHaritaLat]=useState("");
  const[haritaLng,setHaritaLng]=useState("");
  const[haritaArama,setHaritaArama]=useState("");
  const[haritaResults,setHaritaResults]=useState([]);
  const[inputsLocked,setInputsLocked]=useState(false);

  const th=isDark?DARK:LIGHT;
  const t=LANGS[lang];
  const r=useMemo(()=>calc(inp),[inp]);
  const set=useCallback((k,v)=>setInp(p=>({...p,[k]:v})),[]);
  useEffect(()=>{if(mode!=="splash")setAnim(true);},[mode]);
  const goMode=m=>{setAnim(false);setTimeout(()=>{setMode(m);setAnim(true);},180);};

  // CSS inject
  useEffect(()=>{
    const s=document.createElement("style");s.id="app-css";
    s.textContent=`
      @keyframes pulse{0%,100%{box-shadow:0 4px 16px rgba(201,168,76,.5);}50%{box-shadow:0 4px 24px rgba(201,168,76,.9);transform:scale(1.06);}}
      @media print{.no-print{display:none!important;}.print-header{display:block!important;}body{background:white!important;color:#1a1a1a!important;}}
      @media(orientation:landscape)and(max-height:500px){.quick-grid{grid-template-columns:repeat(4,1fr)!important;}.quick-res{grid-template-columns:repeat(3,1fr)!important;}}
    `;
    const ex=document.getElementById("app-css");if(ex)ex.remove();
    document.head.appendChild(s);
  },[]);

  const share=()=>{try{const url=`${window.location.origin}${window.location.pathname}?s=${encState(inp)}`;navigator.clipboard?navigator.clipboard.writeText(url):(()=>{const el=document.createElement("input");el.value=url;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);})();setCopied(true);setTimeout(()=>setCopied(false),2500);}catch{}};

  const makeWALink=()=>{const ref=inp.refNo||"—";const loc=[inp.il,inp.ilce,inp.mahalle].filter(Boolean).join("/")||"Belirtilmemiş";return`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`${BRAND.whatsappMsg}\n\n📋 Ref: ${ref}\n📍 ${loc}\n📐 ${inp.arsaAlan}m² KAKS:${r.kaks?.toFixed(2)}\n💰 ${ƒ.tl(r.pazKar)}`)}`;};

  const printDoc=(landscape)=>{const s=document.createElement("style");s.id="po";s.textContent=`@media print{@page{size:${landscape?"A4 landscape":"A4 portrait"};}}`;const ex=document.getElementById("po");if(ex)ex.remove();document.head.appendChild(s);window.print();};

  // Clippy tips
  const TIPS=lang==="TR"?[
    {i:"🏗️",t:"Hızlı Mod'da 4 veri gir — 10 sn'de fizibilite!"},
    {i:"📋",t:"Plan notuna KAKS:1.5 TAKS:0.4 yaz — otomatik uygulanır."},
    {i:"⚖️",t:"A vs B ile iki senaryoyu karşılaştır."},
    {i:"💱",t:"Döviz sekmesinde anlık kur çek."},
    {i:"🎯",t:"Optimizer 6 birim kombinasyonunu test eder."},
    {i:"🔒",t:"Girdi kilidini aç/kapat — yanlışlıkla değişiklik önler."},
    {i:"🗺️",t:"Haritada adres ara, mahalle otomatik dolar."},
    {i:"📄",t:"PDF için 📄 dikey 🖨️ yatay — yatay daha etkileyici!"},
    {i:"🤝",t:"Kat karşılığı modunu aç — arsa sahibi payını hesapla."},
    {i:"🔗",t:"Link Paylaş → tüm hesaplamayı URL'ye gömer."},
  ]:[
    {i:"🏗️",t:"Quick Mode: 4 inputs, instant feasibility!"},
    {i:"📋",t:"Type FAR:1.5 in zoning notes — auto-applied."},
    {i:"⚖️",t:"A vs B compares two scenarios side by side."},
    {i:"💱",t:"Fetch live USD/EUR rates in Currency tab."},
    {i:"🎯",t:"Optimizer tests 6 unit mix combinations."},
    {i:"🔒",t:"Lock inputs to prevent accidental changes."},
  ];
  const[tipIdx,setTipIdx]=useState(0);
  const[tipVisible,setTipVisible]=useState(true);
  const[tipMin,setTipMin]=useState(false);
  useEffect(()=>{const id=setInterval(()=>setTipIdx(i=>(i+1)%TIPS.length),7000);return()=>clearInterval(id);},[TIPS.length]);

  const ctxVal={th,lang,t};

  /* ──────────────────────────────────────────
     SPLASH
  ────────────────────────────────────────── */
  if(mode==="splash") return(
    <Ctx.Provider value={ctxVal}>
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:isDark?"radial-gradient(ellipse at 35% 40%,#0d2a40,#070e18 60%,#020608)":"linear-gradient(135deg,#f9f5ec,#ede7d9)",fontFamily:"'Palatino Linotype',serif",position:"relative",overflow:"hidden"}}>
      <div className="no-print" style={{position:"absolute",top:12,right:16,display:"flex",gap:8}}>
        <button onClick={()=>setLang(l=>l==="TR"?"EN":"TR")} style={{background:"transparent",border:`1px solid ${th.accent}50`,color:th.accent,borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🇹🇷/🇬🇧</button>
        <button onClick={()=>setIsDark(d=>!d)} style={{background:"transparent",border:`1px solid ${th.accent}50`,color:th.accent,borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>{isDark?"☀️":"🌙"}</button>
      </div>
      <div style={{textAlign:"center",maxWidth:480,padding:"0 24px"}}>
        <div style={{fontSize:52,marginBottom:8}}>🏗️</div>
        <div style={{fontSize:10,color:th.accent+"80",letterSpacing:"0.25em",marginBottom:8}}>{BRAND.firmaAdi.toUpperCase()}</div>
        <h1 style={{fontSize:36,fontWeight:400,color:isDark?"#f5ead4":th.text,margin:"0 0 6px"}}>{t.appName}</h1>
        <p style={{fontSize:13,color:th.text2,marginBottom:32}}>{BRAND.uzmanAdi} · {BRAND.unvan}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          {[{m:"quick",icon:"⚡",title:t.quickMode,desc:lang==="TR"?"4 veri gir, 10 sn'de sonuç":"4 inputs, instant results"},{m:"pro",icon:"📊",title:t.proMode,desc:lang==="TR"?"Tüm parametreler, grafikler, IRR":"Full params, charts, IRR"}].map(({m,icon,title,desc})=>(
            <button key={m} onClick={()=>goMode(m)} style={{background:isDark?"#050c15":"#fff",border:`1px solid ${th.accent}`,borderRadius:12,padding:"20px 14px",cursor:"pointer",textAlign:"center",fontFamily:"inherit",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=th.accent;}} onMouseLeave={e=>{e.currentTarget.style.background=isDark?"#050c15":"#fff";}}>
              <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:3}}>{title}</div>
              <div style={{fontSize:10,color:th.text3}}>{desc}</div>
            </button>
          ))}
        </div>
        <div style={{fontSize:10,color:th.text3}}>{t.free}</div>
      </div>
    </div>
    </Ctx.Provider>
  );

  /* ──────────────────────────────────────────
     QUICK MODE
  ────────────────────────────────────────── */
  if(mode==="quick") return(
    <Ctx.Provider value={ctxVal}>
    <div style={{minHeight:"100vh",background:th.bg,color:th.text,fontFamily:"'Palatino Linotype',serif",opacity:anim?1:0,transition:"opacity 0.3s"}}>
      {/* Print header */}
      <div className="print-header" style={{display:"none",background:"#1a1208",color:"white",padding:"14px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:16,fontWeight:900,color:"#c9a84c"}}>{BRAND.watermark}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>{BRAND.uzmanAdi} · {BRAND.unvan}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:700,color:"#c9a84c"}}>📋 {inp.refNo}</div><div style={{fontSize:9,opacity:0.6}}>{new Date().toLocaleDateString("tr-TR")}</div></div>
        </div>
        {inp.musteriAdi&&<div style={{fontSize:12,marginTop:8,borderTop:"1px solid rgba(255,255,255,0.2)",paddingTop:8}}>Sayın {inp.musteriAdi},</div>}
        <div style={{fontSize:10,opacity:0.8,marginTop:4}}>{[inp.il,inp.ilce,inp.mahalle].filter(Boolean).join(" / ")}{inp.adaNo?` | Ada:${inp.adaNo} Parsel:${inp.parselNo||"—"}`:""}</div>
      </div>
      {/* Nav */}
      <div className="no-print" style={{height:48,background:th.nav,borderBottom:`1px solid ${th.navBorder}`,display:"flex",alignItems:"center",padding:"0 16px",gap:10}}>
        <button onClick={()=>goMode("splash")} style={{background:"transparent",border:"none",color:th.accent,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>{t.goHome}</button>
        <div style={{flex:1,fontSize:12,color:th.text2,fontWeight:700}}>⚡ {t.quickMode}</div>
        <button onClick={()=>setLang(l=>l==="TR"?"EN":"TR")} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>🇹🇷/🇬🇧</button>
        <button onClick={()=>setIsDark(d=>!d)} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>{isDark?"☀️":"🌙"}</button>
        <button onClick={share} style={{background:"transparent",border:`1px solid ${th.accent}`,color:th.accent,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{copied?t.linkCopied:t.shareLink}</button>
        <button onClick={()=>printDoc(false)} className="no-print" style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>📄</button>
      </div>
      {/* Content */}
      <div style={{maxWidth:820,margin:"0 auto",padding:"24px 16px"}}>
        {/* Müşteri + Ref */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginBottom:16}}>
          <div><div style={{fontSize:9,color:th.text3,marginBottom:3}}>{t.musteriAdi||"Müşteri Adı"}</div>
            <input type="text" value={inp.musteriAdi||""} onChange={e=>set("musteriAdi",e.target.value)} placeholder="Sayın..." style={{background:th.input,border:`1px solid ${th.accent}40`,color:th.inputText||th.accent,borderRadius:7,padding:"8px 12px",fontSize:13,fontFamily:"monospace",fontWeight:600,width:"100%",outline:"none"}}/>
          </div>
          <div><div style={{fontSize:9,color:th.text3,marginBottom:3}}>Ref No</div>
            <div onClick={()=>set("refNo",makeRefNo())} style={{background:th.bg2,border:`1px solid ${th.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,fontFamily:"monospace",color:th.accent,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{inp.refNo||makeRefNo()} 🔄</div>
          </div>
        </div>
        {/* 4 Büyük Input */}
        <div className="quick-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
          {[
            {l:t.fields.arsaAlan,f:"arsaAlan",u:"m²",s:50},
            {l:t.fields.kaks,f:"kaks",u:"",s:0.1},
            {l:t.fields.konutF,f:"konutF",u:"₺/m²",s:500},
            {l:t.fields.insBirim,f:"insBirim",u:"₺/m²",s:500},
          ].map(({l,f,u,s})=>(
            <div key={f} style={{background:th.card,border:`1px solid ${th.accent}30`,borderRadius:10,padding:"14px"}}>
              <div style={{fontSize:9,color:th.accent,letterSpacing:"0.1em",marginBottom:6}}>{l}</div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <button onMouseDown={()=>{const v=parseFloat(inp[f])||0;set(f,Math.max(0,Math.round((v-s)*100)/100));}} style={{background:th.bg3,border:`1px solid ${th.accent}40`,color:th.accent,borderRadius:5,width:28,height:28,cursor:"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <input type="number" value={inp[f]} onChange={e=>set(f,parseFloat(e.target.value)||0)} style={{background:"transparent",border:"none",color:th.text,fontSize:20,fontWeight:700,fontFamily:"monospace",flex:1,textAlign:"center",outline:"none"}}/>
                <button onMouseDown={()=>{const v=parseFloat(inp[f])||0;set(f,Math.round((v+s)*100)/100);}} style={{background:th.bg3,border:`1px solid ${th.accent}40`,color:th.accent,borderRadius:5,width:28,height:28,cursor:"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
              <div style={{fontSize:10,color:th.text3,textAlign:"center",marginTop:4}}>{u}</div>
            </div>
          ))}
        </div>
        {/* Sonuçlar */}
        <div style={{background:isDark?"linear-gradient(135deg,#0d1a0a,#081206)":th.card,border:`1px solid ${th.green}40`,borderRadius:12,padding:20,marginBottom:16}}>
          <div style={{fontSize:9,color:th.green,letterSpacing:"0.2em",marginBottom:12}}>{t.liveResults}</div>
          <div className="quick-res" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
            {[
              {l:t.kpis.totalSat,v:r.toplamSat,f:ƒ.m2,c:th.blue},
              {l:t.kpis.kat,v:r.katSayisi,f:v=>Math.round(v)+" kat",c:th.purple},
              {l:t.kpis.bb,v:r.bbSayisi,f:v=>Math.round(v)+" adet",c:th.accent},
              {l:t.kpis.maliyet,v:r.topMal,f:ƒ.tl,c:th.red},
              {l:t.kpis.brut,v:r.brutSatis,f:ƒ.tl,c:th.green},
              {l:t.kpis.pazKar,v:r.pazKar,f:ƒ.tl,c:r.pazKar>=0?th.green:th.red},
            ].map(({l,v,f,c})=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:th.text3,marginBottom:2}}>{l}</div>
                <div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"monospace"}}><AnimNum value={typeof v==="number"?v:0} fmt={f}/></div>
              </div>
            ))}
          </div>
          {/* Marj bar */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:10,color:th.text3}}>Kâr Marjı</span>
            <span style={{fontSize:11,fontWeight:700,color:r.karMarji>0.15?th.green:r.karMarji>0.05?"#f59e0b":th.red}}>{ƒ.pct(r.karMarji)}</span>
          </div>
          <div style={{height:5,background:th.bg3,borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:3,width:`${Math.max(0,Math.min(100,r.karMarji*100*3))}%`,background:r.karMarji>0.15?`linear-gradient(90deg,${th.green},#4ade80)`:r.karMarji>0.05?"linear-gradient(90deg,#f59e0b,#fbbf24)":`linear-gradient(90deg,${th.red},#f87171)`,transition:"width 0.6s"}}/>
          </div>
        </div>
        {/* Badges */}
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
          <Badge ok={r.emsalUygun} okText={t.status.emsal30Ok} failText={t.status.emsal30Fail}/>
          <Badge ok={r.cikmaUygun} okText={t.status.cikmaOk} failText={t.status.cikmaFail}/>
          <Badge ok={r.pazKar>0} okText={t.status.profitOk} failText={t.status.profitFail}/>
        </div>
        {/* Hızlı erişim */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          {[{i:"🎯",l:"Optimizer",tb:"optimizer"},{i:"🏢",l:"3D Kesit",tb:"plan3d"},{i:"🗺️",l:"Harita",tb:"harita"},{i:"📋",l:"Rapor",tb:"aiozet"}].map(({i,l,tb})=>(
            <button key={tb} onClick={()=>{goMode("pro");setTimeout(()=>setTab(tb),300);}} style={{background:th.bg2,border:`1px solid ${th.border}`,color:th.text2,borderRadius:8,padding:"9px 6px",cursor:"pointer",fontSize:10,fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=th.accent;e.currentTarget.style.color=th.accent;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.color=th.text2;}}>
              <span style={{fontSize:18}}>{i}</span><span>{l}</span>
            </button>
          ))}
        </div>
        {/* Pro Mod */}
        <div style={{textAlign:"center"}}>
          <button onClick={()=>goMode("pro")} style={{background:"transparent",border:`1px solid ${th.accent}`,color:th.accent,padding:"11px 34px",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=th.accent;e.currentTarget.style.color=isDark?"#070a0f":"#fff";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=th.accent;}}>{t.proSwitch}</button>
        </div>
      </div>
      {/* Floating WA */}
      <a href={makeWALink()} target="_blank" rel="noopener noreferrer" className="no-print" style={{position:"fixed",bottom:20,right:20,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"white",borderRadius:50,padding:"10px 16px",fontSize:11,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 20px rgba(37,211,102,.4)",zIndex:9999}}>💬 {lang==="TR"?"Uzmanla Görüş":"Ask Expert"}</a>
      {/* Clippy */}
      {tipVisible&&<div className="no-print" style={{position:"fixed",bottom:70,right:20,zIndex:9998,fontFamily:"'Palatino Linotype',serif",maxWidth:220}}>
        {!tipMin&&<div style={{background:isDark?"#0d1a28":"#fffde7",border:`2px solid ${th.accent}`,borderRadius:12,padding:12,marginBottom:6,boxShadow:`0 6px 24px ${th.accent}30`,position:"relative"}}>
          <div style={{position:"absolute",bottom:-9,right:20,width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent",borderTop:`9px solid ${th.accent}`}}/>
          <div style={{position:"absolute",bottom:-7,right:21,width:0,height:0,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:`8px solid ${isDark?"#0d1a28":"#fffde7"}`}}/>
          <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
            <span style={{fontSize:16}}>{TIPS[tipIdx].i}</span>
            <span style={{fontSize:10,color:th.text,lineHeight:1.6}}>{TIPS[tipIdx].t}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:3}}>{TIPS.slice(0,6).map((_,i)=><div key={i} onClick={()=>setTipIdx(i)} style={{width:5,height:5,borderRadius:"50%",background:i===tipIdx%6?th.accent:th.border,cursor:"pointer"}}/>)}</div>
            <div style={{display:"flex",gap:3}}>
              <button onClick={()=>setTipIdx(i=>(i+1)%TIPS.length)} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text3,borderRadius:3,padding:"1px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>→</button>
              <button onClick={()=>setTipMin(true)} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text3,borderRadius:3,padding:"1px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>−</button>
              <button onClick={()=>setTipVisible(false)} style={{background:"transparent",border:`1px solid ${th.red}50`,color:th.red,borderRadius:3,padding:"1px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>✕</button>
            </div>
          </div>
        </div>}
        <div onClick={()=>setTipMin(m=>!m)} style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${th.accent},#e8c060)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,cursor:"pointer",boxShadow:`0 4px 16px ${th.accent}50`,marginLeft:"auto",animation:"pulse 3s ease-in-out infinite",userSelect:"none"}}>🏗️</div>
      </div>}
    </div>
    </Ctx.Provider>
  );

  /* ──────────────────────────────────────────
     PRO MODE
  ────────────────────────────────────────── */
  const stokList=[];
  for(let i=0;i<inp.dukkanAdet;i++)stokList.push({no:stokList.length+1,tip:"Dükkan",kat:"Zemin",cephe:i%2===0?"Güney":"Kuzey",brut:inp.dukkanByk,carpan:inp.zC+(i%2===0?inp.guney:inp.kuzey),bazF:inp.ticariF});
  for(let i=0;i<2&&r.katSayisi>=2;i++)stokList.push({no:stokList.length+1,tip:"2+1 Daire",kat:"1.Kat",cephe:i%2===0?"Kuzey":"Güney",brut:inp.anaByk,carpan:inp.k1C+(i%2===0?inp.kuzey:inp.guney),bazF:inp.konutF});
  for(let i=0;i<Math.min(r.anaAdet-2,4)&&r.anaAdet>2;i++)stokList.push({no:stokList.length+1,tip:"2+1 Daire",kat:"Ara Kat",cephe:i%2===0?"Güney":"Kuzey",brut:inp.anaByk,carpan:inp.snC+(i%2===0?inp.guney:inp.kuzey),bazF:inp.konutF});
  if(inp.dubleksAdet>0)stokList.push({no:stokList.length+1,tip:"Dubleks",kat:"Çatı",cephe:"Güney+Teras",brut:inp.dubleksByk,carpan:inp.catiC+inp.guney,bazF:inp.konutF});

  const TABS=Object.entries(t.tabs).map(([id,label])=>({id,label}));
  const tipStyle={background:th.tooltipBg,border:`1px solid ${th.border2}`,fontSize:10,color:th.text};

  const IMAR_TIPLERI=[
    {k:"KONUT",l:"🏠 Konut",kaks:1.50,taks:0.40,nizam:"AYRK",on:5,arka:3,yan:3},
    {k:"KONUT_Y",l:"🏠 Konut Yoğun",kaks:2.50,taks:0.50,nizam:"AYRK",on:5,arka:3,yan:3},
    {k:"TICARI",l:"🏪 Ticari",kaks:2.00,taks:0.50,nizam:"BİLEŞ",on:0,arka:0,yan:0},
    {k:"MIA",l:"🏙️ MİA",kaks:3.00,taks:0.60,nizam:"BİLEŞ",on:0,arka:0,yan:0},
    {k:"IBT",l:"🏢 İBT",kaks:2.50,taks:0.55,nizam:"AYRK",on:5,arka:5,yan:5},
    {k:"TURIZM",l:"🏨 Turizm",kaks:1.20,taks:0.30,nizam:"AYRK",on:10,arka:5,yan:5},
    {k:"SANAYI",l:"🏭 Sanayi",kaks:1.00,taks:0.50,nizam:"AYRK",on:10,arka:5,yan:5},
    {k:"TARIM",l:"🌾 Tarım",kaks:0.05,taks:0.05,nizam:"AYRK",on:20,arka:10,yan:10},
    {k:"MANUEL",l:"✏️ Manuel",kaks:null,taks:null,nizam:null},
  ];

  return(
    <Ctx.Provider value={ctxVal}>
    <div style={{minHeight:"100vh",fontFamily:"'Palatino Linotype',serif",background:th.bg,color:th.text,opacity:anim?1:0,transition:"opacity 0.3s",display:"flex",flexDirection:"column"}}>

      {/* Print header */}
      <div className="print-header" style={{display:"none",background:"#1a1208",color:"white",padding:"16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,paddingBottom:8,borderBottom:"1px solid rgba(201,168,76,0.3)"}}>
          <div><div style={{fontSize:17,fontWeight:900,color:"#c9a84c"}}>{BRAND.watermark}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.6)",marginTop:1}}>{BRAND.uzmanAdi} · {BRAND.unvan}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:"#c9a84c"}}>📋 {inp.refNo}</div><div style={{fontSize:9,opacity:0.6,marginTop:2}}>{new Date().toLocaleDateString("tr-TR")}</div></div>
        </div>
        {inp.musteriAdi&&<div style={{fontSize:12,marginBottom:4}}>Sayın {inp.musteriAdi},</div>}
        <div style={{fontSize:10,opacity:0.8}}>{[inp.il,inp.ilce,inp.mahalle].filter(Boolean).join(" / ")}{inp.adaNo?` | Ada:${inp.adaNo} Parsel:${inp.parselNo||"—"}`:""}</div>
        {inp.planNotu&&<div style={{fontSize:9,opacity:0.6,marginTop:2}}>Plan: {inp.planNotu}</div>}
      </div>

      {/* Floating WA */}
      <a href={makeWALink()} target="_blank" rel="noopener noreferrer" className="no-print" style={{position:"fixed",bottom:20,right:20,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"white",borderRadius:50,padding:"10px 16px",fontSize:11,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 20px rgba(37,211,102,.4)",zIndex:9999}}>💬 {lang==="TR"?"Uzmanla Görüş":"Ask Expert"}</a>

      {/* Clippy */}
      {tipVisible&&<div className="no-print" style={{position:"fixed",bottom:70,right:20,zIndex:9998,fontFamily:"'Palatino Linotype',serif",maxWidth:220}}>
        {!tipMin&&<div style={{background:isDark?"#0d1a28":"#fffde7",border:`2px solid ${th.accent}`,borderRadius:12,padding:12,marginBottom:6,boxShadow:`0 6px 24px ${th.accent}30`,position:"relative"}}>
          <div style={{position:"absolute",bottom:-9,right:20,width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent",borderTop:`9px solid ${th.accent}`}}/>
          <div style={{position:"absolute",bottom:-7,right:21,width:0,height:0,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:`8px solid ${isDark?"#0d1a28":"#fffde7"}`}}/>
          <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}><span style={{fontSize:16}}>{TIPS[tipIdx].i}</span><span style={{fontSize:10,color:th.text,lineHeight:1.6}}>{TIPS[tipIdx].t}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:3}}>{TIPS.slice(0,6).map((_,i)=><div key={i} onClick={()=>setTipIdx(i)} style={{width:5,height:5,borderRadius:"50%",background:i===tipIdx%6?th.accent:th.border,cursor:"pointer"}}/>)}</div>
            <div style={{display:"flex",gap:3}}>
              <button onClick={()=>setTipIdx(i=>(i+1)%TIPS.length)} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text3,borderRadius:3,padding:"1px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>→</button>
              <button onClick={()=>setTipMin(true)} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text3,borderRadius:3,padding:"1px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>−</button>
              <button onClick={()=>setTipVisible(false)} style={{background:"transparent",border:`1px solid ${th.red}50`,color:th.red,borderRadius:3,padding:"1px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>✕</button>
            </div>
          </div>
        </div>}
        <div onClick={()=>setTipMin(m=>!m)} style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${th.accent},#e8c060)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,cursor:"pointer",boxShadow:`0 4px 16px ${th.accent}50`,marginLeft:"auto",animation:"pulse 3s ease-in-out infinite",userSelect:"none"}}>🏗️</div>
      </div>}

      {/* Top Nav */}
      <div className="no-print" style={{height:50,background:th.nav,borderBottom:`1px solid ${th.navBorder}`,display:"flex",alignItems:"center",padding:"0 14px",gap:10,flexShrink:0}}>
        <button onClick={()=>goMode("splash")} style={{background:"transparent",border:"none",color:th.accent,cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>{t.goHome}</button>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:26,height:26,borderRadius:6,background:`linear-gradient(135deg,${th.accent},#e8c060)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🏗️</div>
          <div style={{fontSize:11,fontWeight:700,color:isDark?"#f5ead4":th.text}}>{t.appName}</div>
        </div>
        <div style={{flex:1}}/>
        <button onClick={()=>setLang(l=>l==="TR"?"EN":"TR")} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 7px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>🇹🇷/🇬🇧</button>
        <button onClick={()=>setIsDark(d=>!d)} style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{isDark?"☀️":"🌙"}</button>
        <button onClick={share} style={{background:copied?th.green+"20":"transparent",border:`1px solid ${copied?th.green:th.accent}`,color:copied?th.green:th.accent,borderRadius:4,padding:"3px 7px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>{copied?t.linkCopied:t.shareLink}</button>
        <button onClick={()=>printDoc(false)} className="no-print" style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>📄</button>
        <button onClick={()=>printDoc(true)} className="no-print" style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>🖨️</button>
        <button onClick={()=>setIsFullscreen(f=>{if(!f)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();return!f;})} className="no-print" style={{background:"transparent",border:`1px solid ${th.border}`,color:th.text2,borderRadius:4,padding:"3px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>{isFullscreen?"⊡":"⛶"}</button>
      </div>

      {/* Tab Bar */}
      <div className="no-print" style={{background:th.bg2,borderBottom:`1px solid ${th.border}`,display:"flex",overflowX:"auto",flexShrink:0,padding:"0 8px"}}>
        {TABS.map(({id,label})=>(
          <button key={id} onClick={()=>setTab(id)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?th.accent:"transparent"}`,color:tab===id?th.accent:th.text3,padding:"10px 12px",cursor:"pointer",fontSize:10,fontFamily:"inherit",fontWeight:tab===id?700:400,whiteSpace:"nowrap",transition:"color 0.15s",flexShrink:0}}>{label}</button>
        ))}
        {/* Girdi kilidi */}
        <button onClick={()=>setInputsLocked(l=>!l)} title={inputsLocked?t.edit:t.lock} style={{marginLeft:"auto",background:inputsLocked?th.accent+"20":"transparent",border:`1px solid ${inputsLocked?th.accent:th.border}`,color:inputsLocked?th.accent:th.text3,borderRadius:5,padding:"5px 10px",cursor:"pointer",fontSize:10,fontFamily:"inherit",flexShrink:0,alignSelf:"center",margin:"4px 4px"}}>{inputsLocked?"🔒":"🔓"}</button>
      </div>

      {/* KPIS strip */}
      <div style={{background:th.bg3,borderBottom:`1px solid ${th.border}`,padding:"8px 14px",display:"flex",gap:8,overflowX:"auto",flexShrink:0}}>
        {[
          {l:t.kpis.totalSat,v:r.toplamSat,f:ƒ.m2,c:th.blue},
          {l:t.kpis.kat,v:r.katSayisi,f:v=>Math.round(v)+" kat",c:th.purple},
          {l:t.kpis.bb,v:r.bbSayisi,f:v=>Math.round(v)+" adet",c:th.accent},
          {l:t.kpis.maliyet,v:r.topMal,f:ƒ.tl,c:th.red},
          {l:t.kpis.brut,v:r.brutSatis,f:ƒ.tl,c:th.green},
          {l:t.kpis.pazKar,v:r.pazKar,f:ƒ.tl,c:r.pazKar>=0?th.green:th.red},
          {l:t.kpis.irr,v:r.irrYillik||0,f:ƒ.pct,c:r.irrYillik&&r.irrYillik>r.hurdle?th.green:"#f59e0b"},
          {l:t.kpis.nbD,v:r.nbD,f:ƒ.tl,c:r.nbD>=0?th.green:th.red},
        ].map(({l,v,f,c})=>(
          <div key={l} style={{textAlign:"center",minWidth:80,flexShrink:0}}>
            <div style={{fontSize:8,color:th.text3,letterSpacing:"0.06em",marginBottom:2}}>{l}</div>
            <div style={{fontSize:12,fontWeight:700,color:c,fontFamily:"monospace"}}><AnimNum value={typeof v==="number"?v:0} fmt={f}/></div>
          </div>
        ))}
        <div style={{textAlign:"center",minWidth:80,flexShrink:0}}>
          <div style={{fontSize:8,color:th.text3,letterSpacing:"0.06em",marginBottom:2}}>KARAR</div>
          <div style={{fontSize:11,fontWeight:700,color:r.waccKarar==="CAZIP"?th.green:r.waccKarar==="SINIRDA"?"#f59e0b":th.red}}>{r.waccKarar}</div>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{flex:1,overflow:"auto",padding:"16px 14px"}}>

        {/* ══ OVERVIEW ══ */}
        {tab==="overview"&&(
          <div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              <Badge ok={r.emsalUygun} okText={t.status.emsal30Ok} failText={t.status.emsal30Fail}/>
              <Badge ok={r.cikmaUygun} okText={t.status.cikmaOk} failText={t.status.cikmaFail}/>
              <Badge ok={r.pazKar>0} okText={t.status.profitOk} failText={t.status.profitFail}/>
              {r.katKarsiligiAktif&&<span style={{background:th.accent+"18",border:`1px solid ${th.accent+"45"}`,color:th.accent,fontSize:10,fontWeight:600,padding:"5px 12px",borderRadius:20}}>🤝 Kat Karşılığı Aktif</span>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
              <Kpi label={t.kpis.totalSat} value={r.toplamSat} accent={th.blue} sub={ƒ.m2(r.yasalEmsal)+" yasal"} fmt={ƒ.m2}/>
              <Kpi label={t.kpis.kat} value={r.katSayisi} accent={th.purple} sub={ƒ.m2(r.taban)+" taban"} fmt={v=>Math.round(v)+" kat"}/>
              <Kpi label={t.kpis.bb} value={r.bbSayisi} accent={th.accent} sub={`${inp.dukkanAdet} dükkan + ${inp.dubleksAdet} dblks`} fmt={v=>Math.round(v)+" adet"}/>
              <Kpi label={t.kpis.maliyet} value={r.topMal} accent={th.red} sub={ƒ.tl(r.insMal)+" inş."}/>
              <Kpi label={t.kpis.brut} value={r.brutSatis} accent={th.green} sub={ƒ.tl(r.konutGelir)+" konut"}/>
              <Kpi label={t.kpis.pazKar} value={r.pazKar} accent={r.pazKar>=0?th.green:th.red} warn={r.pazKar<0}/>
              <Kpi label={t.kpis.irr} value={r.irrYillik||0} accent={r.irrYillik&&r.irrYillik>r.hurdle?th.green:"#f59e0b"} sub={`Hurdle: ${ƒ.pct(r.hurdle)}`} fmt={ƒ.pct}/>
              <Kpi label={t.kpis.nbD} value={r.nbD} accent={r.nbD>=0?th.green:th.red} warn={r.nbD<0}/>
            </div>
            {/* Charts */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>KÂR MARJI DAĞILIMI</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[{n:"Maliyet",v:r.topMal},{n:"Paz.Gider",v:r.pazGider},{n:r.katKarsiligiAktif?"KK Payı":"—",v:r.kkPayi||0},{n:"Net Kâr",v:Math.max(0,r.pazKar)}]} margin={{top:4,right:8,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.border}/>
                    <XAxis dataKey="n" tick={TT} stroke={th.border}/>
                    <YAxis tick={TT} stroke={th.border} tickFormatter={v=>ƒ.tl(v)}/>
                    <Tooltip contentStyle={tipStyle} formatter={v=>[ƒ.tlF(v)]}/>
                    <Bar dataKey="v" fill={th.accent} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>ALAN DAĞILIMI</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={[{name:"Yasal Emsal",value:Math.round(r.yasalEmsal)},{name:"Emsal Dışı",value:Math.round(r.emsalDisi)},{name:"Bodrum",value:Math.round(r.bodrumKaz)}].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                      {[0,1,2].map(i=><Cell key={i} fill={CC[i]}/>)}
                    </Pie>
                    <Tooltip contentStyle={tipStyle} formatter={v=>[ƒ.m2(v)]}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ══ INPUTS ══ */}
        {tab==="inputs"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {/* Sol: Parsel & İmar */}
            <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
              <SecTitle>{t.sections.parcel}</SecTitle>
              {/* İmar tipi */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:6}}>🏛️ İMAR KULLANIM TÜRÜ</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:6}}>
                  {IMAR_TIPLERI.map(it=>(
                    <button key={it.k} onClick={()=>{if(inputsLocked)return;set("imarTipi",it.k);if(it.kaks!==null){set("kaks",it.kaks);set("taks",it.taks);set("nizam",it.nizam);set("onCekme",it.on);set("arkaCekme",it.arka);set("yanCekme",it.yan);}}} style={{background:inp.imarTipi===it.k?th.accent+"25":th.bg3,border:`1px solid ${inp.imarTipi===it.k?th.accent:th.border}`,color:inp.imarTipi===it.k?th.accent:th.text2,borderRadius:6,padding:"6px 4px",cursor:inputsLocked?"not-allowed":"pointer",fontSize:9,fontFamily:"inherit",textAlign:"center",opacity:inputsLocked?0.6:1}}>
                      {it.l}
                    </button>
                  ))}
                </div>
                {inp.imarTipi&&inp.imarTipi!=="MANUEL"&&<div style={{fontSize:9,color:th.green,background:th.green+"15",padding:"4px 8px",borderRadius:4}}>✅ KAKS:{r.kaks.toFixed(2)} TAKS:{r.taks.toFixed(2)} {IMAR_TIPLERI.find(i=>i.k===inp.imarTipi)?.nizam} — manuel değiştirilebilir ↓</div>}
              </div>
              {/* Konum */}
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:th.text3,marginBottom:4}}>📍 KONUM</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                  {[{l:t.fields.il,f:"il"},{l:t.fields.ilce,f:"ilce"},{l:t.fields.mahalle,f:"mahalle"},{l:t.fields.adaNo,f:"adaNo"}].map(({l,f})=>(
                    <div key={f}><div style={{fontSize:9,color:th.text3,marginBottom:2}}>{l}</div>
                    <input type="text" value={inp[f]||""} onChange={e=>!inputsLocked&&set(f,e.target.value)} readOnly={inputsLocked} placeholder="—" style={{background:inputsLocked?th.bg3:th.input,border:`1px solid ${th.accent}40`,color:inputsLocked?th.text3:th.inputText||th.accent,borderRadius:5,padding:"6px 8px",fontSize:11,fontFamily:"monospace",width:"100%",outline:"none",cursor:inputsLocked?"not-allowed":"text"}}/></div>
                  ))}
                </div>
                <div><div style={{fontSize:9,color:th.text3,marginBottom:2}}>{t.fields.parselNo}</div>
                  <input type="text" value={inp.parselNo||""} onChange={e=>!inputsLocked&&set("parselNo",e.target.value)} readOnly={inputsLocked} placeholder="—" style={{background:inputsLocked?th.bg3:th.input,border:`1px solid ${th.accent}40`,color:inputsLocked?th.text3:th.inputText||th.accent,borderRadius:5,padding:"6px 8px",fontSize:11,fontFamily:"monospace",width:"100%",outline:"none"}}/></div>
              </div>
              {/* Plan Notu */}
              <div style={{marginBottom:10}}>
                <label style={{display:"block",fontSize:10,color:th.accent,marginBottom:3,fontWeight:700}}>{t.fields.planNotu} <span style={{fontWeight:400,color:th.text3,fontSize:9}}>→ otomatik parse</span></label>
                <textarea value={inp.planNotu||""} onChange={e=>!inputsLocked&&set("planNotu",e.target.value)} readOnly={inputsLocked} placeholder="KAKS:1.50 TAKS:0.40 H:9.50 AYRK" rows={2} style={{background:inputsLocked?th.bg3:th.input,border:`1px solid ${th.accent}60`,color:inputsLocked?th.text3:th.inputText||th.accent,borderRadius:6,padding:"7px 10px",fontSize:11,fontFamily:"monospace",width:"100%",outline:"none",resize:"vertical"}}/>
                {inp.planNotu&&<div style={{fontSize:9,color:th.green,marginTop:3,background:th.green+"15",padding:"3px 7px",borderRadius:4}}>✅ KAKS:{r.kaks.toFixed(2)} TAKS:{r.taks.toFixed(2)}{r.planH>0?` H:${r.planH}m`:""}</div>}
              </div>
              {[{l:t.fields.arsaAlan,f:"arsaAlan",u:"m²",s:50},{l:t.fields.kaks,f:"kaks",s:0.1},{l:t.fields.taks,f:"taks",s:0.05},{l:t.fields.parselEn,f:"parselEn",u:"m",s:1},{l:t.fields.parselBoy,f:"parselBoy",u:"m",s:1},{l:t.fields.onCekme,f:"onCekme",u:"m",s:0.5},{l:t.fields.arkaCekme,f:"arkaCekme",u:"m",s:0.5},{l:t.fields.yanCekme,f:"yanCekme",u:"m",s:0.5},{l:t.fields.nizam,f:"nizam",opts:["AYRK","İKİZ","BİLEŞ"]},{l:t.fields.bonus,f:"bonus",s:0.05},{l:t.fields.cikmaD,f:"cikmaD",u:"m",s:0.1},{l:t.fields.cikmaF,f:"cikmaF",u:"m",s:1},{l:t.fields.fire,f:"fire",s:0.05},{l:t.fields.asma,f:"asma",s:0.05},{l:t.fields.bodrum,f:"bodrum",s:1,min:0}].map(p=>p.opts?<Inp key={p.f} label={p.l} field={p.f} options={p.opts} inp={inp} set={set} locked={inputsLocked}/>:<Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} min={p.min} inp={inp} set={set} locked={inputsLocked}/>)}
            </div>
            {/* Sağ: Maliyet + Gelir + WACC */}
            <div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14,marginBottom:10}}>
                <SecTitle>{t.sections.cost}</SecTitle>
                {[{l:t.fields.insBirim,f:"insBirim",u:"₺/m²",s:500},{l:t.fields.projeG,f:"projeG",u:"₺",s:10000},{l:t.fields.altyapiG,f:"altyapiG",u:"₺",s:10000},{l:t.fields.finOran,f:"finOran",s:0.01},{l:t.fields.cont,f:"cont",s:0.01},{l:t.fields.insSure,f:"insSure",u:"ay",s:1}].map(p=><Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} inp={inp} set={set} locked={inputsLocked}/>)}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14,marginBottom:10}}>
                <SecTitle>{t.sections.revenue}</SecTitle>
                {[{l:t.fields.konutF,f:"konutF",u:"₺/m²",s:500},{l:t.fields.ticariF,f:"ticariF",u:"₺/m²",s:500},{l:t.fields.dukkanAdet,f:"dukkanAdet",s:1,min:0},{l:t.fields.dukkanByk,f:"dukkanByk",u:"m²",s:5},{l:t.fields.dubleksAdet,f:"dubleksAdet",s:1,min:0},{l:t.fields.dubleksByk,f:"dubleksByk",u:"m²",s:5},{l:t.fields.anaByk,f:"anaByk",u:"m²",s:5}].map(p=><Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} min={p.min} inp={inp} set={set} locked={inputsLocked}/>)}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <SecTitle>{t.sections.wacc}</SecTitle>
                {[{l:t.fields.ozkaynak,f:"ozkaynak",s:0.05},{l:t.fields.ozGetiri,f:"ozGetiri",s:0.05},{l:t.fields.krediF,f:"krediF",s:0.01},{l:t.fields.kurumlarV,f:"kurumlarV",s:0.01},{l:t.fields.projeSure,f:"projeSure",s:0.25},{l:t.fields.pazOran,f:"pazOran",s:0.005},{l:t.fields.eskalOran,f:"eskalOran",s:0.005},{l:t.fields.onSatisO,f:"onSatisO",s:0.05,max:1}].map(p=><Inp key={p.f} label={p.l} field={p.f} unit={p.u} step={p.s} max={p.max} inp={inp} set={set} locked={inputsLocked}/>)}
                {/* Kat Karşılığı Toggle */}
                <div style={{marginTop:10,background:inp.katKarsiligiAktif?isDark?"#0a1f0a":"#e8f5e9":th.bg3,border:`1px solid ${inp.katKarsiligiAktif?th.green+"40":th.border}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:inp.katKarsiligiAktif?8:0}}>
                    <div><div style={{fontSize:11,fontWeight:700,color:inp.katKarsiligiAktif?th.green:th.text}}>🤝 Kat Karşılığı Modu</div><div style={{fontSize:9,color:th.text3,marginTop:1}}>Arsa sahibine pay verilir</div></div>
                    <button onClick={()=>!inputsLocked&&set("katKarsiligiAktif",!inp.katKarsiligiAktif)} style={{background:inp.katKarsiligiAktif?th.green:th.bg2,border:`2px solid ${inp.katKarsiligiAktif?th.green:th.border}`,borderRadius:20,width:42,height:22,cursor:inputsLocked?"not-allowed":"pointer",position:"relative",transition:"all 0.2s",opacity:inputsLocked?0.5:1}}>
                      <div style={{position:"absolute",top:2,left:inp.katKarsiligiAktif?22:2,width:14,height:14,borderRadius:"50%",background:inp.katKarsiligiAktif?"white":th.text3,transition:"left 0.2s"}}/>
                    </button>
                  </div>
                  {inp.katKarsiligiAktif&&<><Inp label="Arsa Sahibi Pay Oranı" field="katKarsiligiOran" step={0.05} max={0.8} inp={inp} set={set} locked={inputsLocked}/><div style={{fontSize:10,color:th.green,background:th.green+"15",padding:"4px 8px",borderRadius:4}}>Arsa Sahibi Payı: {ƒ.tl(r.kkPayi||0)} ({ƒ.pct(inp.katKarsiligiOran)})</div></>}
                </div>
                {/* Yoğunluk */}
                <div style={{marginTop:10,background:th.bg3,border:`1px solid ${th.border}`,borderRadius:8,padding:10}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:8}}>📊 YOĞUNLUK ANALİZİ</div>
                  {[{l:"Yoğunluk (BB/dönüm)",v:r.bbSayisi&&inp.arsaAlan?(r.bbSayisi/(inp.arsaAlan/1000)).toFixed(1):"—",u:"BB/dönüm"},{l:"İnşaat Yoğunluğu",v:r.toplamSat&&inp.arsaAlan?(r.toplamSat/inp.arsaAlan).toFixed(2):"—",u:"×"},{l:"Kat Başına Alan",v:r.katSayisi?Math.round(r.toplamSat/r.katSayisi):"—",u:"m²"},{l:"Ortalama Daire",v:r.bbSayisi&&r.konutM2?Math.round(r.konutM2/r.bbSayisi):"—",u:"m²"}].map(({l,v,u},i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:i<3?`1px solid ${th.border}`:"none"}}>
                      <span style={{fontSize:9,color:th.text3}}>{l}</span>
                      <span style={{fontSize:10,fontWeight:700,color:th.accent,fontFamily:"monospace"}}>{v} <span style={{color:th.text3,fontWeight:400,fontSize:9}}>{u}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ COST ══ */}
        {tab==="cost"&&(
          <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:14}}>
            <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{background:th.bg3,padding:"10px 14px",borderBottom:`1px solid ${th.border}`,fontSize:11,color:th.accent,fontWeight:700}}>MALİYET DETAYI</div>
              {[{l:"İnşaat Maliyeti",v:r.insMal,c:th.red},{l:`Contingency (${ƒ.pct(inp.cont)})`,v:r.contingency,c:"#dc7b2a"},{l:"Finansman Gideri",v:r.finG,c:"#f59e0b"},{l:"Proje/Ruhsat",v:parseFloat(inp.projeG)||0,c:th.blue},{l:"Altyapı",v:parseFloat(inp.altyapiG)||0,c:th.purple},{l:"TOPLAM MALİYET",v:r.topMal,c:th.text,bold:true}].map(({l,v,c,bold},i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",borderBottom:`1px solid ${th.border}`,background:bold?th.bg3:"transparent"}}>
                  <span style={{fontSize:11,color:bold?th.accent:th.text2,fontWeight:bold?700:400}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:"monospace"}}>{ƒ.tlF(v)}</span>
                </div>
              ))}
            </div>
            <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
              <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:12}}>MALİYET DUYARLILIĞI</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={Array.from({length:9},(_,i)=>{const f=inp.insBirim*(0.7+i*0.075);const m=r.toplamSat*f+(parseFloat(inp.finOran)||0.1)*r.toplamSat*f+(parseFloat(inp.projeG)||0)+(parseFloat(inp.altyapiG)||0)+r.toplamSat*f*(parseFloat(inp.cont)||0.05);const k=r.sGelir-m-r.pazGider;return{f:Math.round(f/1000)+"K",k:Math.round(k/1000000*10)/10};})}>
                  <CartesianGrid strokeDasharray="3 3" stroke={th.border}/>
                  <XAxis dataKey="f" tick={TT} stroke={th.border}/>
                  <YAxis tick={TT} stroke={th.border} tickFormatter={v=>v+"M"}/>
                  <Tooltip contentStyle={tipStyle} formatter={v=>[v+" M₺","Net Kâr"]}/>
                  <Line type="monotone" dataKey="k" stroke={th.accent} strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{fontSize:9,color:th.text3,textAlign:"center",marginTop:4}}>İnşaat birim maliyeti değiştikçe net kâr</div>
            </div>
          </div>
        )}

        {/* ══ REVENUE ══ */}
        {tab==="revenue"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{background:th.bg3,padding:"10px 14px",borderBottom:`1px solid ${th.border}`,fontSize:11,color:th.accent,fontWeight:700}}>GELİR & KÂR</div>
              {[{l:"Konut Geliri",v:r.konutGelir,c:th.green},{l:"Ticari Gelir",v:r.ticariGelir,c:th.teal},{l:"Brüt Satış",v:r.brutSatis,c:th.blue,bold:true},{l:"Şerefiyeli Gelir",v:r.sGelir,c:th.accent},{l:"Toplam Maliyet",v:r.topMal,c:th.red},{l:"Pazarlama Gideri",v:r.pazGider,c:"#f59e0b"},{l:r.katKarsiligiAktif?"Arsa Sahibi Payı":"—",v:r.kkPayi||0,c:th.purple},{l:"PAZ. NET KÂR",v:r.pazKar,c:r.pazKar>=0?th.green:th.red,bold:true},{l:"KÂR MARJI",v:null,c:r.pazMarji>0.15?th.green:r.pazMarji>0.05?"#f59e0b":th.red,fmt:ƒ.pct(r.pazMarji),bold:true}].map(({l,v,c,bold,fmt},i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 14px",borderBottom:`1px solid ${th.border}`,background:bold?th.bg3:"transparent"}}>
                  <span style={{fontSize:11,color:bold?th.accent:th.text2,fontWeight:bold?700:400}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:"monospace"}}>{fmt||ƒ.tlF(v||0)}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14,marginBottom:12}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>SATIŞ FİYATI DUYARLILIĞI</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={Array.from({length:9},(_,i)=>{const f=inp.konutF*(0.75+i*0.0625);const g=r.konutM2*f+r.ticariGelir;const k=g-r.topMal;return{f:Math.round(f/1000)+"K",k:Math.round(k/1000000*10)/10,m:g>0?+(k/g*100).toFixed(1):0};})}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.border}/>
                    <XAxis dataKey="f" tick={TT} stroke={th.border}/>
                    <YAxis tick={TT} stroke={th.border} tickFormatter={v=>v+"M"}/>
                    <Tooltip contentStyle={tipStyle}/>
                    <Line type="monotone" dataKey="k" stroke={th.green} strokeWidth={2} dot={false} name="Kâr (M₺)"/>
                    <Line type="monotone" dataKey="m" stroke={th.accent} strokeWidth={1} strokeDasharray="4 2" dot={false} name="Marj %"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:8}}>WACC / KARAR</div>
                {[{l:"WACC",v:ƒ.pct(r.wacc)},{l:"Hurdle Rate",v:ƒ.pct(r.hurdle)},{l:"Proje ROI",v:ƒ.pct(r.projRoi)},{l:"KARAR",v:r.waccKarar,c:r.waccKarar==="CAZIP"?th.green:r.waccKarar==="SINIRDA"?"#f59e0b":th.red}].map(({l,v,c},i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<3?`1px solid ${th.border}`:"none"}}>
                    <span style={{fontSize:10,color:th.text3}}>{l}</span>
                    <span style={{fontSize:11,fontWeight:700,color:c||th.text,fontFamily:"monospace"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ CASHFLOW ══ */}
        {tab==="cashflow"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
              {[{l:"CF0 — Başlangıç",v:r.cf0,c:th.red,sub:"Özkaynak çıkışı"},{l:"CF1 — İnşaat",v:r.cf1,c:"#f59e0b",sub:"Ön+inş. satış - kredi"},{l:"CF2 — Teslim",v:r.cf2,c:th.green,sub:"Kalan satış - kredi"}].map(({l,v,c,sub})=>(
                <div key={l} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                  <div style={{fontSize:9,color:th.text3,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:700,color:c,fontFamily:"monospace"}}>{ƒ.tl(v)}</div>
                  <div style={{fontSize:9,color:th.text3,marginTop:3}}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:12}}>IRR & NBD</div>
                {[{l:"IRR (Dönemlik)",v:r.irrVal?ƒ.pct(r.irrVal):"—"},{l:"IRR (Yıllık)",v:r.irrYillik?ƒ.pct(r.irrYillik):"—",big:true,c:r.irrYillik&&r.irrYillik>r.hurdle?th.green:"#f59e0b"},{l:"WACC",v:ƒ.pct(r.wacc)},{l:"Hurdle Rate",v:ƒ.pct(r.hurdle)},{l:"NBD (NPV)",v:ƒ.tl(r.nbD),c:r.nbD>=0?th.green:th.red,big:true},{l:"Özkaynak",v:ƒ.tl(r.ozTutar)},{l:"Kredi Tutarı",v:ƒ.tl(r.krediTutar)}].map(({l,v,c,big},i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<6?`1px solid ${th.border}`:"none",alignItems:"center"}}>
                    <span style={{fontSize:10,color:th.text3}}>{l}</span>
                    <span style={{fontSize:big?16:12,fontWeight:700,color:c||th.text,fontFamily:"monospace"}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>NAKIT AKIŞI GRAFİĞİ</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[{d:"CF0",v:r.cf0},{d:"CF1",v:r.cf1},{d:"CF2",v:r.cf2},{d:"Net",v:r.cf0+r.cf1+r.cf2}]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={th.border}/>
                    <XAxis dataKey="d" tick={TT} stroke={th.border}/>
                    <YAxis tick={TT} stroke={th.border} tickFormatter={v=>ƒ.tl(v)}/>
                    <Tooltip contentStyle={tipStyle} formatter={v=>[ƒ.tlF(v)]}/>
                    <Bar dataKey="v" radius={[4,4,0,0]}>{[{v:r.cf0,c:th.red},{v:r.cf1,c:"#f59e0b"},{v:r.cf2,c:th.green},{v:r.cf0+r.cf1+r.cf2,c:th.blue}].map((d,i)=><Cell key={i} fill={d.c}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ══ STRESS ══ */}
        {tab==="stress"&&(()=>{
          const malD=[-0.1,0,0.1,0.2,0.3];const fiyD=[0.2,0.1,0,-0.1,-0.2];
          return(
            <div>
              <div style={{fontSize:11,color:th.accent,fontWeight:700,marginBottom:12}}>5×5 DUYARLILIK MATRİSİ</div>
              <div style={{overflowX:"auto",marginBottom:14}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                  <thead>
                    <tr><th style={{background:th.bg3,padding:"7px 10px",color:th.text3,fontWeight:400,border:`1px solid ${th.border}`,textAlign:"left"}}>Mal\Fiy</th>
                    {fiyD.map(f=><th key={f} style={{background:th.bg3,padding:"7px 10px",color:th.accent,fontWeight:700,border:`1px solid ${th.border}`,textAlign:"center"}}>{f>=0?"+":""}{(f*100).toFixed(0)}%</th>)}</tr>
                  </thead>
                  <tbody>
                    {malD.map(m=>(
                      <tr key={m}>
                        <td style={{background:th.bg3,padding:"7px 10px",color:th.accent,fontWeight:700,border:`1px solid ${th.border}`,textAlign:"center"}}>{m>=0?"+":""}{(m*100).toFixed(0)}%</td>
                        {fiyD.map(f=>{const simMal=r.topMal*(1+m);const simGelir=r.sGelir*(1+f);const k=simGelir-simMal-r.pazGider;const ok=k>=0;return<td key={f} style={{background:ok?th.green+"18":th.red+"18",border:`1px solid ${th.border}`,padding:"7px 10px",textAlign:"center",color:ok?th.green:th.red,fontWeight:700,fontFamily:"monospace",fontSize:11}}>{ƒ.tl(k)}</td>;})}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>BAŞABAŞ ANALİZİ</div>
                {[{l:"Başabaş Satış Fiyatı",v:r.konutM2>0?ƒ.tl((r.topMal+r.pazGider)/r.toplamSat):"—",sub:"Bu altında satış = zarar"},{l:"Mevcut / Başabaş",v:r.konutM2>0&&r.toplamSat>0?((r.sGelir)/(r.topMal+r.pazGider)).toFixed(2):"—",sub:"1.00 üzeri güvenli"},{l:"Güvenlik Tamponu",v:ƒ.pct(r.pazMarji),sub:"Fiyat ne kadar düşebilir"},{l:"Eskalasyon Kâr Erimesi",v:ƒ.pct(r.karErime),sub:"Enflasyon etkisi"}].map(({l,v,sub},i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<3?`1px solid ${th.border}`:"none"}}>
                    <div><div style={{fontSize:10,color:th.text2}}>{l}</div><div style={{fontSize:9,color:th.text3}}>{sub}</div></div>
                    <div style={{fontSize:13,fontWeight:700,color:th.accent,fontFamily:"monospace"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ══ INVENTORY ══ */}
        {tab==="inventory"&&(
          <div>
            <div style={{fontSize:11,color:th.accent,fontWeight:700,marginBottom:12}}>🏷️ SATIŞ STOK LİSTESİ & ŞEREFİYE</div>
            <div style={{overflowX:"auto",marginBottom:14}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead><tr style={{background:th.bg3}}>{["No","Tip","Kat","Cephe","Brüt m²","Çarpan","Baz ₺/m²","Şeref. Fiyat","Toplam"].map(h=><th key={h} style={{padding:"8px 10px",color:th.text2,fontWeight:600,border:`1px solid ${th.border}`,textAlign:"center",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                <tbody>{stokList.map((s,i)=>{const sp=s.bazF*s.carpan;const top=sp*s.brut;return<tr key={i} style={{background:i%2===0?th.bg3:th.card}}>{[s.no,s.tip,s.kat,s.cephe,Math.round(s.brut)+" m²",s.carpan.toFixed(2)+"×",s.bazF.toLocaleString("tr-TR")+" ₺",Math.round(sp).toLocaleString("tr-TR")+" ₺",ƒ.tl(top)].map((v,j)=><td key={j} style={{padding:"8px 10px",border:`1px solid ${th.border}`,textAlign:"center",color:j===8?th.green:th.text,fontFamily:j>=4?"monospace":"inherit",fontWeight:j===8?700:400}}>{v}</td>)}</tr>;})}</tbody>
              </table>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <SecTitle>{t.sections.premium}</SecTitle>
                {[{l:"Zemin Kat",f:"zC"},{l:"1. Kat",f:"k1C"},{l:"Ara Kat",f:"araC"},{l:"Son Kat",f:"snC"},{l:"Çatı/Dblks",f:"catiC"},{l:"Kuzey",f:"kuzey"},{l:"Güney",f:"guney"}].map(({l,f})=><Inp key={f} label={l} field={f} step={0.01} inp={inp} set={set} locked={inputsLocked}/>)}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>ŞEREFİYELİ KÂR</div>
                {[{l:"Şerefiyeli Gelir",v:r.sGelir,c:th.accent},{l:"Maliyet",v:r.topMal,c:th.red},{l:"Şerefiye Kârı",v:r.sKar,c:r.sKar>=0?th.green:th.red,big:true},{l:"Eskalasyon Kârı",v:r.eskKar,c:r.eskKar>=0?th.green:th.red},{l:"Kâr Erimesi",v:ƒ.pct(r.karErime),c:th.red,str:true}].map(({l,v,c,big,str},i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<4?`1px solid ${th.border}`:"none"}}>
                    <span style={{fontSize:10,color:th.text3}}>{l}</span>
                    <span style={{fontSize:big?16:11,fontWeight:700,color:c,fontFamily:"monospace"}}>{str?v:ƒ.tlF(v||0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ 3D KESİT ══ */}
        {tab==="plan3d"&&(()=>{
          const kats=Math.min(r.katSayisi,12);
          const katH=30,zemin=60,bodrum=r.bodrumKaz>0;
          const svgH=(kats+1)*katH+zemin+(bodrum?40:0)+60;
          const bW=220,bX=60,labelX=bX+bW+10;
          return(
            <div>
              <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>🏢 3D BİNA KESİT GÖRÜNÜMÜ</div>
              <div style={{fontSize:10,color:th.text3,marginBottom:14}}>Girdilere göre otomatik güncellenir — {r.katSayisi} katlı, {r.bbSayisi} bağımsız bölüm</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"start"}}>
                {/* SVG bina */}
                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14,overflowX:"auto"}}>
                  <svg width="100%" viewBox={`0 0 400 ${svgH}`} style={{fontFamily:"monospace"}}>
                    {/* Zemin */}
                    <line x1="20" y1={svgH-30} x2="380" y2={svgH-30} stroke={th.text3} strokeWidth="1"/>
                    <text x="200" y={svgH-10} textAnchor="middle" fill={th.text3} fontSize="9">ZEMIN SEVİYESİ</text>
                    {/* Bodrum */}
                    {bodrum&&<><rect x={bX} y={svgH-30-40} width={bW} height={40} fill={isDark?"#1a0a2e":"#e8e0f4"} stroke={th.purple} strokeWidth="1.5" rx="2"/><text x={bX+bW/2} y={svgH-30-40+14} textAnchor="middle" fill={th.purple} fontSize="9" fontWeight="600">BODRUM</text><text x={bX+bW/2} y={svgH-30-40+26} textAnchor="middle" fill={th.purple} fontSize="8">{ƒ.m2(r.bodrumKaz)}</text><text x={labelX} y={svgH-30-40+20} fill={th.text3} fontSize="8">B0</text></>}
                    {/* Zemin kat */}
                    {(()=>{const y=svgH-30-zemin-(bodrum?40:0);return<><rect x={bX} y={y} width={bW} height={zemin} fill={isDark?"#0a1f2e":"#e8f5ff"} stroke={th.teal} strokeWidth="2" rx="2"/><text x={bX+bW/2} y={y+20} textAnchor="middle" fill={th.teal} fontSize="9" fontWeight="700">ZEMİN KAT</text><text x={bX+bW/2} y={y+34} textAnchor="middle" fill={th.teal} fontSize="8">{inp.dukkanAdet>0?`${inp.dukkanAdet} Dükkan · ${ƒ.m2(r.ticariM2)}`:ƒ.m2(r.taban)}</text><text x={bX+bW/2} y={y+48} textAnchor="middle" fill={th.teal+"90"} fontSize="8">×{(parseFloat(inp.zC)||0.88).toFixed(2)}</text><text x={labelX} y={y+30} fill={th.text3} fontSize="8">Z</text></>;})()}
                    {/* Normal Katlar */}
                    {Array.from({length:kats},(_, ki)=>{
                      const katNo=ki+1;const y=svgH-30-zemin-(bodrum?40:0)-(katNo*katH);
                      const isCati=katNo===kats;const isUst=katNo>=kats-1;
                      const fill=isCati?(isDark?"#1f0a1a":"#ffe8f4"):isUst?(isDark?"#0d1f0a":"#e8f5e8"):(isDark?"#0a1520":"#f0f8ff");
                      const border=isCati?th.purple:isUst?th.green:th.blue;
                      const carpan=katNo===1?(parseFloat(inp.k1C)||0.93):katNo===kats?(parseFloat(inp.catiC)||1.18):(parseFloat(inp.snC)||1.08);
                      const tip=isCati?(inp.dubleksAdet>0?"Çatı Dubleks":"Çatı Piyesi"):isUst?"Son Kat":`${katNo}. Kat`;
                      return<g key={ki}>
                        <rect x={isCati?bX+20:isUst?bX+10:bX} y={y} width={isCati?bW-40:isUst?bW-20:bW} height={katH-2} fill={fill} stroke={border} strokeWidth={isUst||isCati?2:1} rx="2"/>
                        <text x={(isCati?bX+20:isUst?bX+10:bX)+(isCati?bW-40:isUst?bW-20:bW)/2} y={y+12} textAnchor="middle" fill={border} fontSize="8" fontWeight="600">{tip}</text>
                        <text x={(isCati?bX+20:isUst?bX+10:bX)+(isCati?bW-40:isUst?bW-20:bW)/2} y={y+23} textAnchor="middle" fill={th.text3} fontSize="7">×{carpan.toFixed(2)}</text>
                        <text x={labelX} y={y+16} fill={th.text3} fontSize="8">{katNo}</text>
                      </g>;
                    })}
                    {/* Ön çekme */}
                    {(()=>{const gY=svgH-30-(bodrum?40:0)-zemin-kats*katH-10;return<g><line x1={bX-30} y1={gY} x2={bX} y2={gY} stroke={th.accent} strokeWidth="1" strokeDasharray="3 2"/><line x1={bX-30} y1={svgH-30} x2={bX-30} y2={gY} stroke={th.accent} strokeWidth="1" strokeDasharray="3 2"/><text x={bX-38} y={(gY+(svgH-30))/2} textAnchor="middle" fill={th.accent} fontSize="7" transform={`rotate(-90,${bX-38},${(gY+(svgH-30))/2})`}>H={r.katSayisi*3}m</text></g>;})()}
                  </svg>
                </div>
                {/* Bilgi paneli */}
                <div style={{minWidth:200}}>
                  <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14,marginBottom:10}}>
                    <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>KAT TABLOSU</div>
                    {[{l:"Zemin Kat",v:ƒ.m2(r.taban),c:th.teal},{l:"Normal Katlar",v:`${r.katSayisi} kat`,c:th.blue},{l:"Çatı Piyesi",v:ƒ.m2(r.catiPiyes),c:th.purple},{l:"Asma Kat",v:ƒ.m2(r.asmaKat),c:"#f59e0b"},{l:"Bodrum",v:ƒ.m2(r.bodrumKaz),c:th.purple},{l:"Yasal Emsal",v:ƒ.m2(r.yasalEmsal),c:th.accent},{l:"Emsal Dışı",v:ƒ.m2(r.emsalDisi),c:th.text2},{l:"TOPLAM",v:ƒ.m2(r.toplamSat),c:th.green,bold:true}].map(({l,v,c,bold},i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<7?`1px solid ${th.border}`:"none"}}>
                        <span style={{fontSize:10,color:bold?th.accent:th.text3,fontWeight:bold?700:400}}>{l}</span>
                        <span style={{fontSize:10,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                    <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:8}}>EMSAL UYUM</div>
                    <div style={{fontSize:11,fontWeight:700,color:r.emsalUygun?th.green:th.red,marginBottom:4}}>{r.emsalUygun?"✅ %30 Emsal OK":"🔴 %30 Aşım"}</div>
                    <div style={{fontSize:9,color:th.text3}}>Emsal Dışı: {ƒ.pct(r.yasalEmsal>0?r.emsalDisi/r.yasalEmsal:0)}</div>
                    <div style={{height:6,background:th.bg3,borderRadius:3,marginTop:6,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,r.yasalEmsal>0?r.emsalDisi/r.yasalEmsal*100/0.3:0)}%`,background:r.emsalUygun?th.green:th.red,borderRadius:3}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ COMPARE ══ */}
        {tab==="compare"&&(
          <div>
            <div style={{fontSize:11,color:th.accent,fontWeight:700,marginBottom:12}}>⚖️ A vs B SENARYO KARŞILAŞTIRMASI</div>
            {!scenarioA?(
              <div style={{background:th.card,border:`2px dashed ${th.border}`,borderRadius:12,padding:32,textAlign:"center",marginBottom:14}}>
                <div style={{fontSize:32,marginBottom:8}}>📸</div>
                <div style={{fontSize:13,color:th.text2,marginBottom:4}}>Senaryo A'yı kaydedin</div>
                <div style={{fontSize:10,color:th.text3,marginBottom:16}}>Mevcut girdiler A olarak kaydedilir, B için girdileri değiştirin</div>
                <button onClick={()=>setScenarioA({inp:{...inp},r:{...r}})} style={{background:`linear-gradient(135deg,${th.accent},#e8c060)`,border:"none",color:"#070a0f",borderRadius:8,padding:"10px 24px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>📸 Senaryo A Olarak Kaydet</button>
              </div>
            ):(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontSize:10,color:th.green}}>✅ Senaryo A kaydedildi — şimdi B için girdileri değiştirin</div>
                  <button onClick={()=>setScenarioA(null)} style={{background:"transparent",border:`1px solid ${th.red}`,color:th.red,borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>🗑️ Sıfırla</button>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                    <thead><tr style={{background:th.bg3}}>{["Metrik","A — Kaydedilen","B — Mevcut","Fark"].map(h=><th key={h} style={{padding:"9px 12px",color:th.text2,fontWeight:600,border:`1px solid ${th.border}`,textAlign:"center"}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {[
                        {l:"Arsa Alanı",fa:v=>ƒ.m2(v),a:scenarioA.inp.arsaAlan,b:inp.arsaAlan},
                        {l:"KAKS",fa:v=>v?.toFixed(2),a:scenarioA.r.kaks,b:r.kaks},
                        {l:"Toplam Alan",fa:ƒ.m2,a:scenarioA.r.toplamSat,b:r.toplamSat},
                        {l:"Kat Sayısı",fa:v=>Math.round(v)+" kat",a:scenarioA.r.katSayisi,b:r.katSayisi},
                        {l:"BB Sayısı",fa:v=>Math.round(v)+" adet",a:scenarioA.r.bbSayisi,b:r.bbSayisi},
                        {l:"Maliyet",fa:ƒ.tl,a:scenarioA.r.topMal,b:r.topMal},
                        {l:"Brüt Satış",fa:ƒ.tl,a:scenarioA.r.brutSatis,b:r.brutSatis},
                        {l:"Net Kâr",fa:ƒ.tl,a:scenarioA.r.pazKar,b:r.pazKar},
                        {l:"Kâr Marjı",fa:ƒ.pct,a:scenarioA.r.pazMarji,b:r.pazMarji},
                        {l:"IRR Yıllık",fa:ƒ.pct,a:scenarioA.r.irrYillik||0,b:r.irrYillik||0},
                        {l:"NBD",fa:ƒ.tl,a:scenarioA.r.nbD,b:r.nbD},
                        {l:"WACC Kararı",fa:v=>v,a:scenarioA.r.waccKarar,b:r.waccKarar,str:true},
                      ].map(({l,fa,a,b,str},i)=>{
                        const diff=str?null:b-a;const better=diff!==null&&diff>0;
                        return<tr key={i} style={{background:i%2===0?th.bg3:th.card}}>
                          <td style={{padding:"8px 12px",border:`1px solid ${th.border}`,color:th.text2}}>{l}</td>
                          <td style={{padding:"8px 12px",border:`1px solid ${th.border}`,textAlign:"center",fontFamily:"monospace",color:th.text}}>{fa(a)}</td>
                          <td style={{padding:"8px 12px",border:`1px solid ${th.border}`,textAlign:"center",fontFamily:"monospace",fontWeight:700,color:th.accent}}>{fa(b)}</td>
                          <td style={{padding:"8px 12px",border:`1px solid ${th.border}`,textAlign:"center",fontFamily:"monospace",color:str?"":better?th.green:diff===0?th.text3:th.red}}>{str?"—":diff===0?"=":`${better?"+":""}${fa(diff)}`}</td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ OPTIMIZER ══ */}
        {tab==="optimizer"&&(()=>{
          const mixes=[{n:"Std",dk:2,da:1,ab:90},{n:"Büyük",dk:2,da:1,ab:120},{n:"Küçük",dk:2,da:1,ab:65},{n:"Ticari",dk:4,da:0,ab:90},{n:"Dblks+",dk:2,da:2,ab:90},{n:"Karma",dk:3,da:1,ab:80}];
          const results=mixes.map(m=>{const ti={...inp,dukkanAdet:m.dk,dubleksAdet:m.da,anaByk:m.ab};const ri=calc(ti);return{n:m.n,dk:m.dk,da:m.da,ab:m.ab,bb:ri.bbSayisi,kar:ri.pazKar,marj:ri.pazMarji,irr:ri.irrYillik,nbD:ri.nbD};});
          const best=results.reduce((a,b)=>b.kar>a.kar?b:a,results[0]);
          return(
            <div>
              <div style={{fontSize:11,color:th.accent,fontWeight:700,marginBottom:4}}>🎯 BİRİM MIX OPTİMİZERİ</div>
              <div style={{fontSize:9,color:th.text3,marginBottom:14}}>6 farklı birim karışımı test edilir, en kârlısı gösterilir</div>
              <div style={{background:th.green+"15",border:`1px solid ${th.green}40`,borderRadius:8,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20}}>🏆</span>
                <div><div style={{fontSize:11,fontWeight:700,color:th.green}}>En İyi Mix: {best.n}</div>
                <div style={{fontSize:9,color:th.text3}}>Net Kâr: {ƒ.tl(best.kar)} · Marj: {ƒ.pct(best.marj)} · IRR: {best.irr?ƒ.pct(best.irr):"—"}</div></div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                  <thead><tr style={{background:th.bg3}}>{["Mix","Dükkan","Dubleks","Daire m²","BB","Net Kâr","Marj","IRR","NBD"].map(h=><th key={h} style={{padding:"8px 10px",color:th.text2,fontWeight:600,border:`1px solid ${th.border}`,textAlign:"center"}}>{h}</th>)}</tr></thead>
                  <tbody>{results.map((res,i)=><tr key={i} style={{background:res.n===best.n?th.green+"18":i%2===0?th.bg3:th.card}}>
                    {[res.n,res.dk,res.da,res.ab+" m²",res.bb,ƒ.tl(res.kar),ƒ.pct(res.marj),res.irr?ƒ.pct(res.irr):"—",ƒ.tl(res.nbD)].map((v,j)=><td key={j} style={{padding:"8px 10px",border:`1px solid ${th.border}`,textAlign:"center",color:j===0&&res.n===best.n?th.green:j>=4?th.accent:th.text,fontFamily:j>=4?"monospace":"inherit",fontWeight:res.n===best.n?700:400}}>{v}</td>)}
                  </tr>)}</tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* ══ RAPOR ══ */}
        {tab==="aiozet"&&(()=>{
          const karar=r.waccKarar==="CAZIP"?"✅ DEVAM ET":r.waccKarar==="SINIRDA"?"🟡 REVİZE ET":"🔴 DUR";
          const kararlRenk=r.waccKarar==="CAZIP"?th.green:r.waccKarar==="SINIRDA"?"#f59e0b":th.red;
          const guclu=[],risk=[];
          if(r.pazKar>0)guclu.push(`Proje ${ƒ.pct(r.pazMarji)} kâr marjıyla pozitif getiri sunuyor`);
          if(r.irrYillik&&r.irrYillik>r.hurdle)guclu.push(`IRR (${ƒ.pct(r.irrYillik)}) Hurdle Rate'i (${ƒ.pct(r.hurdle)}) aşıyor`);
          if(r.irrYillik&&r.irrYillik>r.wacc)guclu.push(`IRR > WACC (${ƒ.pct(r.wacc)}) — sermaye maliyetinin üzerinde getiri`);
          if(r.nbD>0)guclu.push(`NBD pozitif (${ƒ.tl(r.nbD)}) — proje değer yaratıyor`);
          if(r.emsalUygun)guclu.push(`%30 emsal limiti içinde — imar uyumlu`);
          if(r.katSayisi>=4)guclu.push(`${r.katSayisi} katlı yapı ile alan verimliliği yüksek`);
          if(r.pazKar<0)risk.push(`Mevcut parametrelerle proje zarar ediyor (${ƒ.tl(r.pazKar)})`);
          if(r.irrYillik&&r.irrYillik<r.wacc)risk.push(`IRR (${ƒ.pct(r.irrYillik)}) WACC'ın (${ƒ.pct(r.wacc)}) altında`);
          if(r.nbD<0)risk.push(`NBD negatif (${ƒ.tl(r.nbD)}) — bugünkü değerde kayıp`);
          if(r.karErime>0.15)risk.push(`Eskalasyon etkisi yüksek — kâr %${(r.karErime*100).toFixed(0)} eriyebilir`);
          if(!r.emsalUygun)risk.push(`%30 emsal aşımı var — imar revizyonu gerekebilir`);
          const lokasyon=[inp.il,inp.ilce,inp.mahalle].filter(Boolean).join("/")||"Belirtilmemiş";
          const tarih=new Date().toLocaleDateString("tr-TR");
          return(
            <div>
              <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>📋 UZMAN FİZİBİLİTE RAPORU</div>
              <div style={{fontSize:10,color:th.text3,marginBottom:14}}>Hesaplama motorundan otomatik üretilir — API gerektirmez</div>
              {/* Karar */}
              <div style={{background:r.waccKarar==="CAZIP"?isDark?"#0a1f0a":"#e8f5e9":r.waccKarar==="SINIRDA"?isDark?"#1a1500":"#fff8e1":isDark?"#1f0a0a":"#fde8e8",border:`2px solid ${kararlRenk}`,borderRadius:12,padding:20,marginBottom:14,textAlign:"center"}}>
                <div style={{fontSize:26,marginBottom:4}}>{r.waccKarar==="CAZIP"?"🏆":r.waccKarar==="SINIRDA"?"⚖️":"⛔"}</div>
                <div style={{fontSize:24,fontWeight:900,color:kararlRenk,marginBottom:4}}>{karar}</div>
                <div style={{fontSize:11,color:th.text2}}>{lokasyon}{inp.adaNo?` | Ada:${inp.adaNo}`:""}{inp.parselNo?` P:${inp.parselNo}`:""}</div>
                <div style={{fontSize:9,color:th.text3,marginTop:2}}>{tarih} | {inp.refNo}</div>
              </div>
              {/* Metrikler */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {[{l:"Net Kâr",v:ƒ.tl(r.pazKar),c:r.pazKar>=0?th.green:th.red},{l:"Kâr Marjı",v:ƒ.pct(r.pazMarji),c:r.pazMarji>0.15?th.green:r.pazMarji>0.05?"#f59e0b":th.red},{l:"IRR",v:r.irrYillik?ƒ.pct(r.irrYillik):"—",c:r.irrYillik&&r.irrYillik>r.hurdle?th.green:"#f59e0b"},{l:"WACC",v:ƒ.pct(r.wacc),c:th.text2},{l:"NBD",v:ƒ.tl(r.nbD),c:r.nbD>=0?th.green:th.red},{l:"ROI",v:ƒ.pct(r.roi),c:r.roi>0.2?th.green:"#f59e0b"}].map(({l,v,c},i)=>(
                  <div key={i} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:8,padding:"10px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:th.text3,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:13,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Güçlü */}
              {guclu.length>0&&<div style={{background:isDark?"#0a1f0a":"#e8f5e9",border:`1px solid ${th.green}40`,borderRadius:10,padding:14,marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:th.green,marginBottom:8}}>✅ GÜÇLÜ YÖNLER</div>
                {guclu.map((g,i)=><div key={i} style={{fontSize:12,color:th.text,marginBottom:5,paddingLeft:12,borderLeft:`2px solid ${th.green}`,lineHeight:1.5}}>{g}</div>)}
              </div>}
              {/* Risk */}
              {risk.length>0&&<div style={{background:isDark?"#1f0a0a":"#fde8e8",border:`1px solid ${th.red}40`,borderRadius:10,padding:14,marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:th.red,marginBottom:8}}>⚠️ RİSK FAKTÖRLERİ</div>
                {risk.map((r2,i)=><div key={i} style={{fontSize:12,color:th.text,marginBottom:5,paddingLeft:12,borderLeft:`2px solid ${th.red}`,lineHeight:1.5}}>{r2}</div>)}
              </div>}
              {/* Tavsiye */}
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14,marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:th.accent,marginBottom:8}}>💡 TAVSİYE</div>
                <div style={{fontSize:12,color:th.text,lineHeight:1.8}}>
                  {r.waccKarar==="CAZIP"?`Bu proje mevcut parametrelerle cazip görünmektedir. ${r.irrYillik?`Yıllık IRR ${ƒ.pct(r.irrYillik)} ile hurdle rate'i aşmaktadır.`:""} ${r.nbD>0?`NPV ${ƒ.tl(r.nbD)} pozitiftir.`:""} Projeye devam edilmesi tavsiye edilir. Eskalasyon riskine karşı maliyetleri erken kilitleyin.`:r.waccKarar==="SINIRDA"?`Proje sınırda görünmektedir. ${r.karErime>0.1?`Enflasyon etkisi kârı %${(r.karErime*100).toFixed(0)} eriyebilir.`:""} Satış fiyatlarını optimize edin veya imar revizyonu değerlendirin. Stres Testi sekmesinde farklı senaryoları inceleyin.`:`Mevcut parametrelerle yeterli getiri sağlanamıyor. Arsa maliyetini düşürün, inşaat birim maliyetini optimize edin veya satış fiyatlarını revize edin. A vs B sekmesinde alternatif senaryoları karşılaştırın.`}
                </div>
              </div>
              {/* Kopyala */}
              <button onClick={()=>{const txt=`UZMAN FİZİBİLİTE RAPORU — ${tarih}\n${lokasyon}\nRef: ${inp.refNo}\n\nKARAR: ${karar}\nNet Kâr: ${ƒ.tl(r.pazKar)} | Marj: ${ƒ.pct(r.pazMarji)} | IRR: ${r.irrYillik?ƒ.pct(r.irrYillik):"—"}\n\nGÜÇLÜ YÖNLER:\n${guclu.map(g=>`• ${g}`).join("\n")}\n\nRİSKLER:\n${risk.map(r2=>`• ${r2}`).join("\n")}`;try{navigator.clipboard.writeText(txt)}catch{const el=document.createElement("textarea");el.value=txt;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}}}
                style={{background:`linear-gradient(135deg,${th.accent},#e8c060)`,border:"none",color:"#070a0f",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",width:"100%"}}>
                📋 Raporu Kopyala (WhatsApp / E-posta)
              </button>
            </div>
          );
        })()}

        {/* ══ DÖVİZ ══ */}
        {tab==="doviz"&&(
          <div>
            <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>💱 CANLI DÖVİZ DÖNÜŞTÜRÜCÜ</div>
            <div style={{fontSize:10,color:th.text3,marginBottom:14}}>Frankfurter / ECB API — Ücretsiz, güncel kur</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>KUR GETİR</div>
                <button onClick={async()=>{setKurLoading(true);try{const res=await fetch("https://api.frankfurter.app/latest?from=TRY&to=USD,EUR,GBP");const d=await res.json();const res2=await fetch("https://api.frankfurter.app/latest?from=TRY&to=RUB");const d2=await res2.json();setKurlar({USD:d.rates?.USD||null,EUR:d.rates?.EUR||null,GBP:d.rates?.GBP||null,RUB:d2.rates?.RUB||null});}catch{}setKurLoading(false);}} disabled={kurLoading}
                  style={{background:kurLoading?th.bg3:`linear-gradient(135deg,${th.accent},#e8c060)`,border:"none",color:kurLoading?th.text3:"#070a0f",borderRadius:8,padding:"10px 16px",cursor:kurLoading?"default":"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",width:"100%",marginBottom:12}}>
                  {kurLoading?"⏳ Yükleniyor...":"🔄 Canlı Kur Güncelle"}
                </button>
                {[["USD","🇺🇸"],["EUR","🇪🇺"],["GBP","🇬🇧"],["RUB","🇷🇺"]].map(([cur,flag])=>(
                  <div key={cur} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${th.border}`,alignItems:"center"}}>
                    <span style={{fontSize:13}}>{flag} {cur}</span>
                    <span style={{fontSize:13,fontWeight:700,color:kurlar[cur]?th.green:th.text3,fontFamily:"monospace"}}>{kurlar[cur]?`1 TL = ${kurlar[cur].toFixed(4)} ${cur}`:"—"}</span>
                  </div>
                ))}
                <div style={{fontSize:9,color:th.text3,marginTop:8,fontStyle:"italic"}}>Kaynak: Frankfurter / ECB</div>
              </div>
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:10}}>PROJE DEĞERLERİ</div>
                {[{l:"Toplam Maliyet",v:r.topMal},{l:"Brüt Satış",v:r.brutSatis},{l:"Net Kâr",v:r.pazKar},{l:"NBD (NPV)",v:r.nbD}].map(({l,v},i)=>(
                  <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<3?`1px solid ${th.border}`:"none"}}>
                    <div style={{fontSize:10,color:th.text3,marginBottom:5}}>{l}: <span style={{color:th.text,fontWeight:700,fontFamily:"monospace"}}>{ƒ.tlF(v)}</span></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                      {["USD","EUR","GBP","RUB"].map(cur=>(
                        <div key={cur} style={{background:th.bg3,borderRadius:5,padding:"4px 7px",fontSize:11,fontFamily:"monospace"}}>
                          <span style={{color:th.text3,fontSize:9}}>{cur} </span>
                          <span style={{color:kurlar[cur]?th.accent:th.text3,fontWeight:700}}>{kurlar[cur]?new Intl.NumberFormat("en",{notation:"compact",maximumFractionDigits:1}).format(v*kurlar[cur]):"—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ HARİTA ══ */}
        {tab==="harita"&&(
          <div>
            <div style={{fontSize:13,fontWeight:700,color:th.accent,marginBottom:4}}>🗺️ PARSEL KONUM HARİTASI</div>
            <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:14}}>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {/* Arama */}
                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:8}}>🔍 ADRES ARA</div>
                  <input type="text" value={haritaArama} onChange={async e=>{setHaritaArama(e.target.value);if(e.target.value.length<3){setHaritaResults([]);return;}try{const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(e.target.value+", Türkiye")}&format=json&limit=6&accept-language=tr&countrycodes=tr&addressdetails=1`);setHaritaResults(await res.json());}catch{setHaritaResults([]);}}}
                    placeholder="Mahalle, sokak, ilçe..."
                    style={{background:th.input,border:`1px solid ${th.accent}60`,color:th.inputText||th.accent,borderRadius:6,padding:"8px 10px",fontSize:12,fontFamily:"inherit",width:"100%",outline:"none"}}/>
                  {haritaResults.length>0&&<div style={{marginTop:5,background:th.bg,borderRadius:6,border:`1px solid ${th.border}`,maxHeight:180,overflow:"auto"}}>
                    {haritaResults.map((res,i)=>(
                      <div key={i} onClick={()=>{setHaritaLat(res.lat);setHaritaLng(res.lon);setHaritaArama(res.display_name.split(",")[0]);setHaritaResults([]);const a=res.address||{};if(a.province||a.state)set("il",a.province||a.state||"");if(a.county||a.district)set("ilce",a.county||a.district||"");if(a.suburb||a.neighbourhood||a.quarter||a.village)set("mahalle",a.suburb||a.neighbourhood||a.quarter||a.village||"");}}
                        style={{padding:"7px 10px",cursor:"pointer",borderBottom:`1px solid ${th.border}`,fontSize:10,color:th.text}} onMouseEnter={e=>e.currentTarget.style.background=th.accent+"15"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{fontWeight:600}}>{res.display_name.split(",")[0]}</div>
                        <div style={{fontSize:9,color:th.text3,marginTop:1}}>{res.display_name.split(",").slice(1,3).join(",")}</div>
                      </div>
                    ))}
                  </div>}
                </div>
                {/* Koordinat */}
                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:8}}>📍 KOORDİNAT</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[{l:"Enlem",k:"lat",ph:"36.8969"},{l:"Boylam",k:"lng",ph:"30.7133"}].map(({l,k,ph})=>(
                      <div key={k}><div style={{fontSize:9,color:th.text3,marginBottom:2}}>{l}</div>
                      <input type="text" value={k==="lat"?haritaLat:haritaLng} onChange={e=>k==="lat"?setHaritaLat(e.target.value):setHaritaLng(e.target.value)} placeholder={ph} style={{background:th.input,border:`1px solid ${th.accent}40`,color:th.inputText||th.accent,borderRadius:5,padding:"6px 8px",fontSize:11,fontFamily:"monospace",width:"100%",outline:"none"}}/></div>
                    ))}
                  </div>
                </div>
                {/* Hızlı butonlar */}
                <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:14}}>
                  <div style={{fontSize:10,color:th.accent,fontWeight:700,marginBottom:8}}>⚡ ANTALYA HIZLI</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                    {[{n:"Kepez",lat:"36.9328",lng:"30.7219"},{n:"Muratpaşa",lat:"36.8841",lng:"30.7056"},{n:"Konyaaltı",lat:"36.8782",lng:"30.6419"},{n:"Lara",lat:"36.8533",lng:"30.7748"},{n:"Döşemealtı",lat:"37.0233",lng:"30.5742"},{n:"Aksu",lat:"36.9020",lng:"30.8500"},{n:"Alanya",lat:"36.5440",lng:"32.0000"},{n:"Manavgat",lat:"36.7870",lng:"31.4430"}].map((loc,i)=>(
                      <button key={i} onClick={()=>{setHaritaLat(loc.lat);setHaritaLng(loc.lng);set("ilce",loc.n);}} style={{background:haritaLat===loc.lat?th.accent+"20":th.bg3,border:`1px solid ${haritaLat===loc.lat?th.accent:th.border}`,color:haritaLat===loc.lat?th.accent:th.text2,borderRadius:5,padding:"6px 4px",cursor:"pointer",fontSize:10,fontFamily:"inherit",textAlign:"center"}}>{loc.n}</button>
                    ))}
                  </div>
                </div>
                <a href={haritaLat&&haritaLng?`https://www.google.com/maps?q=${haritaLat},${haritaLng}`:"#"} target="_blank" rel="noopener noreferrer" style={{background:"linear-gradient(135deg,#4285f4,#34a853)",color:"white",borderRadius:8,padding:"10px",textAlign:"center",fontSize:11,fontWeight:700,textDecoration:"none",display:"block",opacity:haritaLat&&haritaLng?1:0.4}}>🗺️ Google Maps'te Aç</a>
              </div>
              {/* Harita */}
              <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,overflow:"hidden"}}>
                {haritaLat&&haritaLng?(
                  <iframe key={`${haritaLat}-${haritaLng}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(haritaLng)-0.008},${parseFloat(haritaLat)-0.005},${parseFloat(haritaLng)+0.008},${parseFloat(haritaLat)+0.005}&layer=mapnik&marker=${haritaLat},${haritaLng}`} style={{width:"100%",height:460,border:"none"}} title="Parsel"/>
                ):(
                  <div style={{height:460,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
                    <div style={{fontSize:48}}>🗺️</div>
                    <div style={{fontSize:13,color:th.text2}}>Adres arayın veya koordinat girin</div>
                  </div>
                )}
                {haritaLat&&haritaLng&&<div style={{padding:"7px 12px",background:th.bg3,borderTop:`1px solid ${th.border}`,fontSize:9,color:th.text3,display:"flex",justifyContent:"space-between"}}>
                  <span>📍 {haritaLat}, {haritaLng}</span>
                  <span>{[inp.il,inp.ilce,inp.mahalle].filter(Boolean).join(" / ")}</span>
                </div>}
              </div>
            </div>
          </div>
        )}

      </div>{/* End tab content */}
    </div>
    </Ctx.Provider>
  );
}

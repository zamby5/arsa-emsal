<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>🚁 Drone Parsel Simülatörü</title>
<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;600;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --c-bg:#02040e;--c-border:rgba(0,200,255,.18);--c-accent:#00c8ff;
  --c-red:#ff2a00;--c-green:#00e87a;--c-gold:#ffb300;
  --c-panel:rgba(2,8,22,.94);--c-text:#8ab4cc;
  --ff:'Share Tech Mono',monospace;--ff2:'Exo 2',sans-serif;
}
html,body{height:100%;overflow:hidden;background:var(--c-bg);color:#cde;font-family:var(--ff)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#050510}
::-webkit-scrollbar-thumb{background:rgba(0,200,255,.25);border-radius:3px}

/* ── FORM ─────────────────────────────────────── */
#form-screen{
  height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse at 50% 60%,#041428 0%,#020610 70%);
}
.fbox{
  background:rgba(2,10,28,.97);border:1px solid rgba(0,200,255,.28);
  border-radius:22px;padding:42px 38px;width:430px;
  box-shadow:0 0 80px rgba(0,150,255,.15),0 0 200px rgba(0,100,200,.06),inset 0 0 40px rgba(0,80,180,.05);
}
.fbox-logo{text-align:center;margin-bottom:18px}
.fbox-logo .icon{font-size:52px;filter:drop-shadow(0 0 20px rgba(0,210,255,.9))}
.fbox-title{font-family:var(--ff2);font-weight:800;font-size:22px;color:var(--c-accent);
  letter-spacing:6px;text-align:center;text-shadow:0 0 30px #0af}
.fbox-sub{font-size:9px;color:#2a3a4a;letter-spacing:3px;text-align:center;margin:6px 0 0}
.fhr{height:1px;background:linear-gradient(90deg,transparent,#0af,transparent);margin:18px 0}
.flabel{font-size:9px;color:var(--c-accent);letter-spacing:2px;display:block;margin-bottom:4px}
.finput{
  width:100%;background:rgba(0,0,0,.45);border:1px solid rgba(0,200,255,.2);
  border-radius:8px;padding:10px 14px;color:#bde;font-size:13px;font-family:var(--ff);
  outline:none;margin-bottom:12px;transition:border .2s,box-shadow .2s;
}
.finput:focus{border-color:rgba(0,220,255,.7);box-shadow:0 0 10px rgba(0,180,255,.12)}
.frow{display:flex;gap:12px}.frow .fg{flex:1}
.fbtns{display:flex;gap:10px;margin-top:6px}
.fbtn{
  flex:1;background:linear-gradient(135deg,#004aaa,#0088ff);
  border:none;border-radius:10px;padding:14px 10px;
  color:#fff;font-size:13px;font-weight:bold;cursor:pointer;letter-spacing:3px;
  font-family:var(--ff);box-shadow:0 6px 24px rgba(0,100,255,.35);transition:all .2s;
}
.fbtn:hover{transform:translateY(-1px);box-shadow:0 8px 30px rgba(0,120,255,.45)}
.fbtn.demo{background:linear-gradient(135deg,#1a3a00,#2a7a00);box-shadow:0 6px 24px rgba(0,160,0,.25)}
.ffeats{display:flex;justify-content:center;flex-wrap:wrap;gap:10px 18px;
  margin-top:14px;color:#233244;font-size:9px;letter-spacing:1px}

/* ── SIM ─────────────────────────────────────── */
#sim-screen{display:none;height:100vh;flex-direction:column}

/* topbar */
#topbar{
  height:46px;flex-shrink:0;background:rgba(2,5,18,.96);
  border-bottom:1px solid var(--c-border);z-index:30;
  display:flex;align-items:center;justify-content:space-between;padding:0 14px;
  box-shadow:0 2px 20px rgba(0,0,0,.5);
}
.tb-rec{display:flex;align-items:center;gap:6px}
.rec-dot{width:8px;height:8px;border-radius:50%;background:#f33;box-shadow:0 0 8px #f33;animation:blink 1.2s infinite}
.tb-center{font-family:var(--ff2);font-size:12px;font-weight:600;color:var(--c-accent);
  letter-spacing:2px;display:flex;align-items:center;gap:8px}
.tb-right{display:flex;align-items:center;gap:12px}
.tb-badge{
  background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.25);
  border-radius:4px;padding:2px 10px;font-size:10px;color:var(--c-accent)
}
.tb-stat{font-size:9px;letter-spacing:1px}
.exit-btn{
  background:rgba(255,255,255,.04);border:1px solid #223;border-radius:5px;
  color:#556;padding:4px 12px;cursor:pointer;font-size:9px;font-family:var(--ff);transition:all .2s;
}
.exit-btn:hover{color:#0af;border-color:#0af3}

/* main layout */
#main{flex:1;display:flex;overflow:hidden;min-height:0}

/* left panel */
#lpanel{
  width:154px;flex-shrink:0;background:var(--c-panel);
  border-right:1px solid var(--c-border);padding:10px 8px;
  display:flex;flex-direction:column;gap:8px;overflow-y:auto;
}

/* map container */
#mapc{flex:1;position:relative;min-width:0;overflow:hidden}
#map{width:100%;height:100%}
.maplibregl-popup-content{
  background:#01050f!important;border:1px solid rgba(0,200,255,.3)!important;
  color:#9be!important;font-family:var(--ff)!important;padding:6px 10px!important;
  border-radius:6px!important;font-size:10px!important;
}
.maplibregl-popup-tip{display:none!important}

/* right panel */
#rpanel{
  width:228px;flex-shrink:0;background:var(--c-panel);
  border-left:1px solid var(--c-border);padding:10px;overflow-y:auto;
  transition:width .25s;
}
#rpanel.hidden{width:0;padding:0;overflow:hidden}

/* bottombar */
#bottombar{
  height:46px;flex-shrink:0;background:rgba(2,5,18,.96);
  border-top:1px solid var(--c-border);z-index:20;
  display:flex;align-items:center;justify-content:space-around;padding:0 8px;
}
.hud-item{text-align:center;min-width:72px}
.hud-lbl{font-size:7px;color:#334466;letter-spacing:1px}
.hud-val{font-size:13px;font-weight:bold;color:var(--c-accent);font-family:var(--ff2)}

/* panel internals */
.ptitle{
  font-size:8px;color:rgba(0,200,255,.6);letter-spacing:2px;margin-bottom:6px;
  padding-bottom:5px;border-bottom:1px solid rgba(0,200,255,.1);
}
.cbtn{
  display:block;width:100%;border-radius:6px;padding:6px 9px;cursor:pointer;
  font-size:10px;font-family:var(--ff);margin-bottom:4px;text-align:left;
  transition:all .15s;border:1px solid #1a1a2a;background:rgba(255,255,255,.02);color:#445;
}
.cbtn:hover{color:#6688aa;border-color:#334}
.cbtn.on{border-color:var(--c-accent);background:rgba(0,100,200,.2);color:var(--c-accent)}
.cbtn.on-g{border-color:var(--c-green);background:rgba(0,100,60,.15);color:var(--c-green)}
.cbtn.on-r{border-color:var(--c-red);background:rgba(100,0,0,.2);color:var(--c-red)}
.cbtn.on-gold{border-color:var(--c-gold);background:rgba(80,50,0,.2);color:var(--c-gold)}
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--c-border),transparent);margin:4px 0}

/* HUD overlays */
#hud-tl{
  position:absolute;top:10px;left:10px;z-index:15;
  background:rgba(2,5,16,.82);border:1px solid rgba(0,200,255,.18);
  border-radius:8px;padding:8px 12px;backdrop-filter:blur(8px);
}
#phase-ind{
  position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:15;
  background:rgba(2,5,16,.88);border:1px solid rgba(255,80,0,.35);
  border-radius:20px;padding:5px 18px;color:#f60;font-size:10px;
  letter-spacing:2px;backdrop-filter:blur(6px);white-space:nowrap;
}
#crosshair{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  pointer-events:none;z-index:8;opacity:.5;
}
#compass{
  position:absolute;bottom:14px;left:14px;z-index:15;
  width:70px;height:70px;
}
#measure-bar{
  position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:15;
  background:rgba(0,20,10,.9);border:1px solid rgba(0,220,100,.35);
  border-radius:8px;padding:6px 16px;color:var(--c-green);font-size:11px;
  letter-spacing:1px;display:none;backdrop-filter:blur(6px);
}
#weather-badge{
  position:absolute;top:10px;right:10px;z-index:15;
  background:rgba(2,5,16,.88);border:1px solid rgba(255,180,0,.25);
  border-radius:8px;padding:8px 12px;text-align:center;backdrop-filter:blur(6px);
  min-width:90px;
}

/* right panel rows */
.rrow{display:flex;justify-content:space-between;font-size:10px;padding:4px 0;border-bottom:1px solid #060610}
.rk{color:#2a3a4a}.rv{color:#aac;text-align:right;max-width:116px}
.valbox{margin-top:8px;padding:8px;background:rgba(0,160,80,.07);border:1px solid rgba(0,160,80,.2);border-radius:6px}
.poi-item{padding:5px 0;border-bottom:1px solid #060610;font-size:10px;display:flex;align-items:center;gap:6px}
.poi-d{color:var(--c-green);margin-left:auto;flex-shrink:0}

/* Altitude slider */
input[type=range]{width:100%;accent-color:var(--c-accent);cursor:pointer}

/* animations */
@keyframes blink{0%,100%{opacity:1}50%{opacity:.08}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>

<div id="form-screen">
  <div class="fbox">
    <div class="fbox-logo"><div class="icon">🛰️</div></div>
    <div class="fbox-title">DRONE PARSEL SİM</div>
    <div class="fbox-sub">GERÇEK UYDU GÖRÜNTÜSİ · TÜM API'LER ÜCRETSİZ</div>
    <div class="fhr"></div>

    <label class="flabel">İL</label>
    <input class="finput" id="f-il" value="İstanbul" placeholder="İstanbul">

    <div class="frow">
      <div class="fg"><label class="flabel">İLÇE</label>
        <input class="finput" id="f-ilce" value="Kadıköy" placeholder="Kadıköy"></div>
      <div class="fg"><label class="flabel">MAHALLE</label>
        <input class="finput" id="f-mah" value="Moda" placeholder="Moda Mh."></div>
    </div>
    <div class="frow">
      <div class="fg"><label class="flabel">ADA NO</label>
        <input class="finput" id="f-ada" value="142" placeholder="142"></div>
      <div class="fg"><label class="flabel">PARSEL NO</label>
        <input class="finput" id="f-parsel" value="7" placeholder="7"></div>
    </div>

    <div class="fbtns">
      <button class="fbtn" onclick="startSim(false)">🚀 BAŞLAT</button>
      <button class="fbtn demo" onclick="startSim(true)" title="Demo konum (Galata Kulesi)">🗼 DEMO</button>
    </div>
    <div class="ffeats">
      <span>🛰️ ESRI Uydu</span><span>🚩 Mesafeli Flag</span>
      <span>📐 Ölçüm Aracı</span><span>📍 Overpass POI</span>
      <span>🌤️ Gerçek Hava</span><span>🌐 OSM Geocode</span>
    </div>
  </div>
</div>

<div id="sim-screen">

  <div id="topbar">
    <div class="tb-rec">
      <div class="rec-dot"></div>
      <span style="color:#f55;font-size:9px;letter-spacing:2px">● REC</span>
      <span class="tb-stat" style="color:#223344;margin-left:8px">4K · GNSS</span>
      <span class="tb-badge" id="phase-badge" style="margin-left:10px">🔻 YAKLAŞIM</span>
    </div>

    <div class="tb-center">
      🚁  <span id="tb-info">— ADA / — PARSEL</span>
    </div>

    <div class="tb-right">
      <span class="tb-stat" style="color:#0f9">🔋 92%</span>
      <span class="tb-stat" style="color:#fa0">📡 GPS-RTK</span>
      <span class="tb-stat" id="tb-crd" style="color:#0af;font-size:8px">—</span>
      <button class="exit-btn" onclick="exitSim()">← ÇIKIŞ</button>
    </div>
  </div>

  <div id="main">

    <div id="lpanel">

      <div>
        <div class="ptitle">UÇUŞ MODU</div>
        <button class="cbtn on" id="btn-cinematic" onclick="setMode('cinematic')">🎬 SİNEMATİK</button>
        <button class="cbtn" id="btn-fast"      onclick="setMode('fast')">⚡ HIZLI KEŞİF</button>
        <button class="cbtn" id="btn-paused"    onclick="setMode('paused')">⏸ DURDUR</button>
      </div>
      <div class="divider"></div>

      <div>
        <div class="ptitle">UYDU KATMANI</div>
        <button class="cbtn on" id="btn-sat"   onclick="setLayer('sat')">🛰️ UYDU</button>
        <button class="cbtn"    id="btn-osm"   onclick="setLayer('osm')">🗺️ HAR. + UYDU</button>
        <button class="cbtn"    id="btn-night" onclick="setLayer('night')">🌑 GECE IŞIK</button>
      </div>
      <div class="divider"></div>

      <div>
        <div class="ptitle">ARAÇLAR</div>
        <button class="cbtn" id="btn-measure" onclick="toggleMeasure()">📐 ÖLÇÜM</button>
        <button class="cbtn" id="btn-poi"     onclick="loadPOI()">📍 YAKIN ÇEVRE</button>
        <button class="cbtn on" id="btn-rings" onclick="toggleRings()">◎ MESAFELERİ GİZLE</button>
        <button class="cbtn on" id="btn-flags" onclick="toggleFlags()">🚩 FLAG GİZLE</button>
      </div>
      <div class="divider"></div>

      <div>
        <div class="ptitle">DRONE YÜKSEKLİĞİ</div>
        <div style="color:var(--c-accent);font-size:20px;font-weight:bold;text-align:center;padding:4px 0;font-family:var(--ff2)" id="alt-disp">120 m</div>
        <input type="range" id="alt-slide" min="30" max="600" value="120" oninput="setAlt(this.value)">
        <div style="display:flex;justify-content:space-between;color:#222;font-size:8px;margin-top:2px"><span>30m</span><span>600m</span></div>
      </div>
      <div class="divider"></div>

      <div>
        <div class="ptitle">GÖRÜNÜM AÇISI</div>
        <div style="color:var(--c-gold);font-size:16px;font-weight:bold;text-align:center;padding:2px 0;font-family:var(--ff2)" id="pitch-disp">60°</div>
        <input type="range" id="pitch-slide" min="0" max="85" value="60" oninput="setPitch(this.value)" style="accent-color:var(--c-gold)">
        <div style="display:flex;justify-content:space-between;color:#222;font-size:8px;margin-top:2px"><span>0° Yukarı</span><span>85° Yatay</span></div>
      </div>
    </div>

    <div id="mapc">
      <div id="map"></div>

      <div id="hud-tl">
        <div style="display:flex;gap:14px">
          <div class="hud-item"><div class="hud-lbl">YÜK.</div><div class="hud-val" id="h-alt" style="color:var(--c-accent)">— m</div></div>
          <div class="hud-item"><div class="hud-lbl">HIZ</div><div class="hud-val" id="h-spd" style="color:var(--c-green)">— kn</div></div>
          <div class="hud-item"><div class="hud-lbl">YÖN</div><div class="hud-val" id="h-hdg" style="color:var(--c-gold)">—°</div></div>
          <div class="hud-item"><div class="hud-lbl">ZOOM</div><div class="hud-val" id="h-zoom">—</div></div>
        </div>
      </div>

      <div id="phase-ind">🔻 YAKLAŞIM FAZASI</div>

      <div id="crosshair">
        <svg width="34" height="34" viewBox="0 0 34 34">
          <line x1="17" y1="0" x2="17" y2="11" stroke="#fff" stroke-width="1"/>
          <line x1="17" y1="23" x2="17" y2="34" stroke="#fff" stroke-width="1"/>
          <line x1="0" y1="17" x2="11" y2="17" stroke="#fff" stroke-width="1"/>
          <line x1="23" y1="17" x2="34" y2="17" stroke="#fff" stroke-width="1"/>
          <circle cx="17" cy="17" r="5" stroke="#fff" fill="none" stroke-width="1"/>
          <circle cx="17" cy="17" r="1.5" fill="var(--c-red)"/>
        </svg>
      </div>

      <canvas id="compass" width="70" height="70"></canvas>

      <div id="weather-badge">
        <div style="font-size:22px" id="wx-icon">⏳</div>
        <div style="font-size:13px;font-weight:bold;color:var(--c-gold);font-family:var(--ff2)" id="wx-temp">—°C</div>
        <div style="font-size:9px;color:#556;margin-top:2px" id="wx-wind">— km/h</div>
      </div>

      <div id="measure-bar">📐 Noktayı seçin — <span id="m-result">—</span></div>
    </div>

    <div id="rpanel">
      <div class="ptitle" style="text-align:center;font-size:9px;letter-spacing:3px">📋 İMAR ANALİZİ</div>
      <div id="rp-imar"></div>

      <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--c-border)">
        <div class="ptitle">📍 YAKIN ÇEVRE (500m)</div>
        <div id="poi-list" style="color:#334;font-size:10px;padding:6px 0">
          Sol panelden 'Yakın Çevre'ye basın.
        </div>
      </div>

      <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--c-border)">
        <div class="ptitle">🔗 BAĞLANTILAR</div>
        <a id="lnk-sv" href="#" target="_blank" style="display:block;color:var(--c-accent);font-size:10px;text-decoration:none;padding:4px 0;border-bottom:1px solid #0a0a16">
          📷 Google Street View →
        </a>
        <a id="lnk-osm" href="#" target="_blank" style="display:block;color:var(--c-accent);font-size:10px;text-decoration:none;padding:4px 0;border-bottom:1px solid #0a0a16">
          🗺️ OpenStreetMap →
        </a>
        <a id="lnk-gm" href="#" target="_blank" style="display:block;color:var(--c-accent);font-size:10px;text-decoration:none;padding:4px 0">
          📌 Google Haritalar →
        </a>
      </div>

      <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--c-border)">
        <button onclick="togglePanel()" style="width:100%;background:rgba(0,150,255,.08);border:1px solid var(--c-border);border-radius:6px;color:var(--c-accent);padding:6px;cursor:pointer;font-size:10px;font-family:var(--ff)">◀ PANELİ GİZLE</button>
      </div>
    </div>

  </div><div id="bottombar">
    <div class="hud-item"><div class="hud-lbl">YÜKSEKLİK</div><div class="hud-val" id="b-alt">— m</div></div>
    <div class="hud-item"><div class="hud-lbl">EĞİM (PITCH)</div><div class="hud-val" id="b-pitch" style="color:var(--c-gold)">—°</div></div>
    <div class="hud-item"><div class="hud-lbl">YÖN (BEARING)</div><div class="hud-val" id="b-bear" style="color:var(--c-green)">—°</div></div>
    <div class="hud-item"><div class="hud-lbl">KOORDİNAT</div><div class="hud-val" style="font-size:9px" id="b-crd">—</div></div>
    <div class="hud-item"><div class="hud-lbl">PARSEL ALANI</div><div class="hud-val" id="b-area">— m²</div></div>
    <div class="hud-item"><div class="hud-lbl">ZOOM SEVİYESİ</div><div class="hud-val" id="b-zoom">—</div></div>
    <div class="hud-item">
      <button onclick="togglePanel()" style="background:rgba(0,150,255,.1);border:1px solid var(--c-border);border-radius:5px;color:var(--c-accent);padding:4px 10px;cursor:pointer;font-size:9px;font-family:var(--ff)">📋</button>
    </div>
  </div>

</div><script>
// ═══ STATE ═══════════════════════════════════════════════
let map = null, parcelCenter = null, parcelDims = null;
let droneTimer = null, orbitRAF = null;
let phase = 0, bearing = 0, altitude = 120, pitchOverride = 60;
let mode = 'cinematic', layerKey = 'sat';
let measureOn = false, measurePts = [], measureMks = [], measureLine = false;
let ringsOn = true, flagsOn = true, panelOn = true;
let flagMks = [], ringLabelMks = [], poiMks = [];
let fd = {};
let orbitRunning = false;

const PHASES = [
  {name:'🔻 YAKLAŞIM',  zoom:14.5, pitch:30,  dur:9000},
  {name:'🔄 360° ORBİT', zoom:18.2, pitch:62,  dur:14000},
  {name:'⚡ YAKIN GEÇIŞ', zoom:19.5, pitch:78,  dur:9000},
  {name:'🎯 HOVER',      zoom:16.5, pitch:48,  dur:8000},
];

const TILE_STYLES = {
  sat:   { tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], attr:'© Esri DigitalGlobe' },
  osm:   { tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], attr:'© OpenStreetMap' },
  night: { tiles:['https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg'], attr:'© NASA VIIRS' },
};

// ═══ UTILS ═══════════════════════════════════════════════
const mLat = m => m / 111320;
const mLng = (m,lat) => m / (111320 * Math.cos(lat * Math.PI/180));

function haversine([lon1,lat1],[lon2,lat2]){
  const R=6371000, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function circleGJ(center, r, steps=64){
  const coords=[];
  for(let i=0;i<=steps;i++){
    const a=(i/steps)*2*Math.PI;
    coords.push([center[0]+mLng(r*Math.cos(a),center[1]), center[1]+mLat(r*Math.sin(a))]);
  }
  return {type:'Feature',geometry:{type:'Polygon',coordinates:[coords]},properties:{}};
}

function seeded(n){ return ((n*1337+42) % 1000)/1000; }

// ═══ START SIM ═══════════════════════════════════════════
async function startSim(isDemo){
  if(isDemo){
    fd = {il:'İstanbul',ilce:'Beyoğlu',mah:'Galata',ada:'168',parsel:'3'};
  } else {
    fd = {
      il:      document.getElementById('f-il').value.trim(),
      ilce:    document.getElementById('f-ilce').value.trim(),
      mah:     document.getElementById('f-mah').value.trim(),
      ada:     document.getElementById('f-ada').value.trim(),
      parsel:  document.getElementById('f-parsel').value.trim(),
    };
  }

  document.getElementById('form-screen').style.display='none';
  document.getElementById('sim-screen').style.display='flex';
  document.getElementById('tb-info').textContent = `${fd.ada} ADA / ${fd.parsel} PARSEL — ${fd.ilce}/${fd.il}`;

  let lat=41.0255, lng=28.9742; 
  try{
    const q=encodeURIComponent(`${fd.mah} mahallesi, ${fd.ilce}, ${fd.il}, Türkiye`);
    const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      {headers:{'Accept-Language':'tr','User-Agent':'DroneParselSim/2.0'}});
    const d=await r.json();
    if(d.length>0){lat=parseFloat(d[0].lat);lng=parseFloat(d[0].lon);}
  }catch(e){console.warn('Geocode failed',e)}

  parcelCenter=[lng,lat];
  const adaN=parseInt(fd.ada)||100, pN=parseInt(fd.parsel)||5;
  const w=22+Math.round(seeded(adaN*7)*42);  
  const d=16+Math.round(seeded(pN*13)*38);   
  parcelDims={w,d};
  const area=w*d;
  document.getElementById('b-area').textContent = area+' m²';

  const crdTxt=`${lat.toFixed(5)}°K ${lng.toFixed(5)}°D`;
  document.getElementById('tb-crd').textContent=crdTxt;
  document.getElementById('b-crd').textContent=`${lat.toFixed(4)}°K ${lng.toFixed(4)}°D`;

  document.getElementById('lnk-sv').href=`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  document.getElementById('lnk-osm').href=`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=18`;
  document.getElementById('lnk-gm').href=`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  renderImar(lat,lng,w,d,area,adaN,pN);
  initMap(lat,lng,w,d);
  fetchWeather(lat,lng);
}

function exitSim(){
  stopDrone();
  if(map){map.remove();map=null;}
  flagMks.forEach(m=>m.remove()); flagMks=[];
  ringLabelMks.forEach(m=>m.remove()); ringLabelMks=[];
  poiMks.forEach(m=>m.remove()); poiMks=[];
  measureMks.forEach(m=>m.remove()); measureMks=[];
  document.getElementById('sim-screen').style.display='none';
  document.getElementById('form-screen').style.display='flex';
}

function renderImar(lat,lng,w,d,area,adaN,pN){
  const seed=seeded(adaN+pN);
  const taks=(0.28+seed*0.22).toFixed(2);
  const kaks=(1.40+seed*1.20

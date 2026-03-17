import { useState } from "react";

const STEPS = [
  {
    id: 1,
    phase: "GitHub",
    emoji: "ğŸ™",
    title: "GitHub HesabÄ± AÃ§",
    url: "github.com",
    instruction: "Telefon tarayÄ±cÄ±sÄ±ndan github.com adresine gidin",
    doThis: "SaÄŸ Ã¼stte 'Sign up' butonuna basÄ±n",
    tip: "Gmail ile kayÄ±t en hÄ±zlÄ±sÄ±",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"10px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #30363d"}}>
          <div style={{display:"flex",gap:4}}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
          <div style={{flex:1,background:"#0d1117",borderRadius:6,padding:"4px 10px",fontSize:10,color:"#8b949e",fontFamily:"monospace"}}>github.com</div>
        </div>
        <div style={{padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{fontSize:24}}>ğŸ™</div>
            <div style={{fontSize:18,fontWeight:700,color:"white"}}>GitHub</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,background:"#161b22",border:"1px solid #30363d",borderRadius:6,padding:"8px 12px",color:"#8b949e",fontSize:11,textAlign:"center"}}>Sign in</div>
            <div style={{flex:1,background:"#2ea043",borderRadius:6,padding:"8px 12px",color:"white",fontSize:11,textAlign:"center",fontWeight:700,boxShadow:"0 0 12px #2ea04340"}}>Sign up â† BUNA BAS</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    phase: "GitHub",
    emoji: "ğŸ“",
    title: "KayÄ±t Formunu Doldur",
    url: "github.com/signup",
    instruction: "E-posta, ÅŸifre ve kullanÄ±cÄ± adÄ± girin",
    doThis: "Formu doldurun â†’ 'Create account' â†’ E-postanÄ±za gelen kodu girin",
    tip: "KullanÄ±cÄ± adÄ± sonradan URL'inizde gÃ¶rÃ¼nÃ¼r: github.com/ADINI",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"10px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #30363d"}}>
          <div style={{flex:1,background:"#0d1117",borderRadius:6,padding:"4px 10px",fontSize:10,color:"#58a6ff",fontFamily:"monospace"}}>github.com/signup</div>
        </div>
        <div style={{padding:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"white",marginBottom:14}}>Create your account</div>
          {[
            {label:"Email address *",val:"ornek@gmail.com",color:"#58a6ff"},
            {label:"Password *",val:"â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢",color:"#8b949e"},
            {label:"Username *",val:"arsa-danismani",color:"#58a6ff"},
          ].map((f,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{fontSize:10,color:"#8b949e",marginBottom:3}}>{f.label}</div>
              <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:6,padding:"8px 12px",fontSize:11,color:f.color,fontFamily:f.val.includes("â€¢")?"inherit":"monospace"}}>{f.val}</div>
            </div>
          ))}
          <div style={{background:"#2ea043",borderRadius:6,padding:"10px 12px",color:"white",textAlign:"center",fontWeight:700,fontSize:12,marginTop:6}}>Create account â†’</div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    phase: "GitHub",
    emoji: "â•",
    title: "Yeni Repository OluÅŸtur",
    url: "github.com â†’ + iÅŸareti",
    instruction: "GitHub'a giriÅŸ yaptÄ±ktan sonra saÄŸ Ã¼stteki + iÅŸaretine basÄ±n",
    doThis: "'New repository' seÃ§in",
    tip: "Ana sayfada da 'New' butonu gÃ¶rÃ¼nebilir",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #30363d"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:16}}>ğŸ™</div>
            <div style={{color:"white",fontSize:12,fontWeight:700}}>GitHub</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{fontSize:10,color:"#8b949e"}}>ğŸ””</div>
            <div style={{background:"#2ea043",borderRadius:5,padding:"4px 10px",fontSize:12,color:"white",fontWeight:700,boxShadow:"0 0 8px #2ea04340"}}>+â–¾ â† BUNA BAS</div>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#c9a84c",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>ğŸ‘¤</div>
          </div>
        </div>
        <div style={{padding:14}}>
          <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,overflow:"hidden"}}>
            {["New repository â† BUNA BAS","New project","New gist","New organization"].map((item,i)=>(
              <div key={i} style={{padding:"10px 14px",borderBottom:i<3?"1px solid #21262d":"none",fontSize:11,color:i===0?"#58a6ff":"#8b949e",background:i===0?"#1f2d3d":"transparent",display:"flex",alignItems:"center",gap:6}}>
                {i===0 && <span>ğŸ“</span>}{item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    phase: "GitHub",
    emoji: "ğŸ—ï¸",
    title: "Repository AyarlarÄ±",
    url: "github.com/new",
    instruction: "Repository adÄ±nÄ± girin ve ayarlarÄ± yapÄ±n",
    doThis: "Repository name: 'arsa-emsal' â†’ Public seÃ§in â†’ Create repository",
    tip: "BaÅŸka hiÃ§bir kutuyu iÅŸaretlemeyin â€” Ã¶zellikle README ekleme!",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"8px 14px",borderBottom:"1px solid #30363d"}}>
          <div style={{fontSize:10,color:"#58a6ff",fontFamily:"monospace"}}>github.com/new</div>
        </div>
        <div style={{padding:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"white",marginBottom:14}}>Create a new repository</div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:"#8b949e",marginBottom:4}}>Repository name *</div>
            <div style={{background:"#161b22",border:"2px solid #58a6ff",borderRadius:6,padding:"9px 12px",fontSize:12,color:"#58a6ff",fontFamily:"monospace",display:"flex",alignItems:"center",gap:6}}>
              arsa-emsal <span style={{marginLeft:"auto",fontSize:10,color:"#2ea043"}}>âœ“ Available</span>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"#8b949e",marginBottom:6}}>Visibility</div>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1,background:"#1f2d3d",border:"2px solid #58a6ff",borderRadius:6,padding:"8px 10px",fontSize:10,color:"#58a6ff",textAlign:"center"}}>
                ğŸ”“ Public â† SEÃ‡Ä°N
              </div>
              <div style={{flex:1,background:"#161b22",border:"1px solid #30363d",borderRadius:6,padding:"8px 10px",fontSize:10,color:"#8b949e",textAlign:"center"}}>
                ğŸ”’ Private
              </div>
            </div>
          </div>
          <div style={{background:"#1a2634",border:"1px solid #f0883e40",borderRadius:6,padding:"8px 12px",marginBottom:12,fontSize:10,color:"#f0883e"}}>
            âš ï¸ "Add a README" kutusunu iÅŸaretlemeyin
          </div>
          <div style={{background:"#2ea043",borderRadius:6,padding:"11px 12px",color:"white",textAlign:"center",fontWeight:700,fontSize:12,boxShadow:"0 0 12px #2ea04340"}}>
            Create repository â†’
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    phase: "GitHub",
    emoji: "ğŸ“¤",
    title: "DosyalarÄ± YÃ¼kle (4 Dosya)",
    url: "Yeni repo â†’ Add file",
    instruction: "BoÅŸ repo oluÅŸtu. Åimdi dosyalarÄ± yÃ¼kleyeceÄŸiz",
    doThis: "'uploading an existing file' linkine basÄ±n â†’ DosyalarÄ± seÃ§in",
    tip: "ZIP'i telefona indirip aÃ§tÄ±ysanÄ±z dosyalarÄ± oradan seÃ§in",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"8px 14px",borderBottom:"1px solid #30363d"}}>
          <div style={{fontSize:10,color:"#58a6ff",fontFamily:"monospace"}}>github.com/siz/arsa-emsal</div>
        </div>
        <div style={{padding:16,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:10}}>ğŸ™</div>
          <div style={{fontSize:13,fontWeight:700,color:"white",marginBottom:6}}>arsa-emsal</div>
          <div style={{fontSize:11,color:"#8b949e",marginBottom:16}}>Get started by creating a new file or uploading an existing file</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexDirection:"column"}}>
            <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:6,padding:"9px 14px",fontSize:11,color:"#8b949e",textAlign:"center"}}>creating a new file</div>
            <div style={{background:"#1f2d3d",border:"2px solid #58a6ff",borderRadius:6,padding:"9px 14px",fontSize:11,color:"#58a6ff",textAlign:"center",fontWeight:700,boxShadow:"0 0 8px #58a6ff20"}}>
              uploading an existing file â† BUNA BAS
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    phase: "GitHub",
    emoji: "ğŸ“‚",
    title: "4 DosyayÄ± SeÃ§ ve YÃ¼kle",
    url: "Upload files sayfasÄ±",
    instruction: "Dosya seÃ§im ekranÄ± aÃ§Ä±lacak",
    doThis: "'choose your files' â†’ ZIP'ten ÅŸu 4 dosyayÄ± seÃ§in: index.html, package.json, vite.config.js, vercel.json â†’ 'Commit changes'",
    tip: "Hepsini aynÄ± anda seÃ§ebilirsiniz â€” tek tek yÃ¼klemeye gerek yok",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"8px 14px",borderBottom:"1px solid #30363d"}}>
          <div style={{fontSize:10,color:"#58a6ff",fontFamily:"monospace"}}>github.com/siz/arsa-emsal/upload</div>
        </div>
        <div style={{padding:14}}>
          <div style={{border:"2px dashed #30363d",borderRadius:10,padding:16,textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:24,marginBottom:6}}>ğŸ“‚</div>
            <div style={{fontSize:11,color:"#8b949e",marginBottom:8}}>Drag files here or</div>
            <div style={{background:"#161b22",border:"1px solid #58a6ff",borderRadius:5,padding:"6px 14px",fontSize:11,color:"#58a6ff",display:"inline-block"}}>choose your files â† BUNA BAS</div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,color:"#2ea043",marginBottom:6}}>SeÃ§ilecek dosyalar:</div>
            {["ğŸ“„ index.html","ğŸ“„ package.json","ğŸ“„ vite.config.js","ğŸ“„ vercel.json"].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderBottom:"1px solid #21262d",fontSize:11,color:"#c9d1d9"}}>
                <span style={{color:"#2ea043"}}>âœ“</span>{f}
              </div>
            ))}
          </div>
          <div style={{background:"#2ea043",borderRadius:6,padding:"10px",color:"white",textAlign:"center",fontWeight:700,fontSize:12}}>Commit changes â†’</div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    phase: "GitHub",
    emoji: "ğŸ“",
    title: "src/main.jsx OluÅŸtur",
    url: "Add file â†’ Create new file",
    instruction: "Åimdi src/ klasÃ¶rÃ¼nÃ¼ ve main.jsx dosyasÄ±nÄ± oluÅŸturuyoruz",
    doThis: "'Add file' â†’ 'Create new file' â†’ Dosya adÄ± kutusuna 'src/main.jsx' yazÄ±n",
    tip: "src/ yazdÄ±ktan sonra / koyunca otomatik klasÃ¶r olur",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"8px 14px",borderBottom:"1px solid #30363d"}}>
          <div style={{fontSize:10,color:"#58a6ff",fontFamily:"monospace"}}>github.com/siz/arsa-emsal/new</div>
        </div>
        <div style={{padding:14}}>
          <div style={{fontSize:10,color:"#8b949e",marginBottom:4}}>Dosya adÄ±</div>
          <div style={{background:"#161b22",border:"2px solid #58a6ff",borderRadius:6,padding:"9px 12px",fontSize:12,marginBottom:12,display:"flex",alignItems:"center",gap:2}}>
            <span style={{color:"#8b949e",fontSize:11}}>arsa-emsal/</span>
            <span style={{color:"#58a6ff",fontFamily:"monospace"}}>src/</span>
            <span style={{color:"#79c0ff",fontFamily:"monospace"}}>main.jsx</span>
            <span style={{color:"#8b949e",fontSize:14,marginLeft:2}}>|</span>
          </div>
          <div style={{background:"#1a2634",border:"1px solid #58a6ff30",borderRadius:6,padding:10,fontSize:10,color:"#79c0ff",fontFamily:"monospace",lineHeight:1.8}}>
            <span style={{color:"#ff7b72"}}>import</span> React <span style={{color:"#ff7b72"}}>from</span> <span style={{color:"#a5d6ff"}}>'react'</span><br/>
            <span style={{color:"#ff7b72"}}>import</span> ReactDOM <span style={{color:"#ff7b72"}}>from</span> <span style={{color:"#a5d6ff"}}>'react-dom/client'</span><br/>
            <span style={{color:"#ff7b72"}}>import</span> App <span style={{color:"#ff7b72"}}>from</span> <span style={{color:"#a5d6ff"}}>'./App.jsx'</span><br/>
            ReactDOM.createRoot(...)
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    phase: "GitHub",
    emoji: "â­",
    title: "src/App.jsx OluÅŸtur",
    url: "Add file â†’ Create new file",
    instruction: "En kritik dosya â€” tÃ¼m uygulamayÄ± iÃ§eriyor",
    doThis: "'Add file' â†’ 'Create new file' â†’ Dosya adÄ±: 'src/App.jsx' â†’ Claude sohbetinden App.jsx iÃ§eriÄŸini kopyalayÄ±p yapÄ±ÅŸtÄ±rÄ±n â†’ Commit",
    tip: "Claude'a 'App.jsx iÃ§eriÄŸini ver' diyebilirsiniz â€” bu konuÅŸmadan kopyalayÄ±n",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"8px 14px",borderBottom:"1px solid #30363d"}}>
          <div style={{fontSize:10,color:"#58a6ff",fontFamily:"monospace"}}>src/App.jsx</div>
        </div>
        <div style={{padding:14}}>
          <div style={{background:"#1a1f0a",border:"1px solid #2ea04340",borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:10,color:"#2ea043",fontWeight:700,marginBottom:6}}>ğŸ“‹ NASIL KOPYALARSINIZ</div>
            <div style={{fontSize:11,color:"#8b949e",lineHeight:1.7}}>
              1. Bu Claude sohbetinde yukarÄ± kaydÄ±rÄ±n<br/>
              2. App.jsx kodunu bulun<br/>
              3. Kodu uzun basarak seÃ§in â†’ Kopyala<br/>
              4. GitHub'a geri dÃ¶nÃ¼n â†’ YapÄ±ÅŸtÄ±r
            </div>
          </div>
          <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:10,fontSize:10,color:"#8b949e",fontFamily:"monospace",lineHeight:1.6,maxHeight:80,overflow:"hidden",position:"relative"}}>
            import {'{'} useState, useMemo... {'}'}<br/>
            const LANGS = {'{'} TR: {'{'} appName...<br/>
            function hesapla(g) {'{'} ...
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:30,background:"linear-gradient(transparent,#161b22)"}}/>
          </div>
          <div style={{background:"#2ea043",borderRadius:6,padding:"10px",color:"white",textAlign:"center",fontWeight:700,fontSize:12,marginTop:10}}>
            Commit new file â†’
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    phase: "Vercel",
    emoji: "â–²",
    title: "Vercel'e Git",
    url: "vercel.com",
    instruction: "Yeni sekmede Vercel'i aÃ§Ä±n â€” GitHub repo hazÄ±r",
    doThis: "vercel.com â†’ 'Start Deploying' veya 'Sign Up' â†’ 'Continue with GitHub'",
    tip: "Vercel Ã¼cretsiz, kredi kartÄ± istemez",
    screen: () => (
      <div style={{background:"#000",borderRadius:12,overflow:"hidden",border:"1px solid #333"}}>
        <div style={{background:"#111",padding:"10px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #222"}}>
          <div style={{display:"flex",gap:4}}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
          <div style={{flex:1,background:"#000",borderRadius:6,padding:"4px 10px",fontSize:10,color:"#888",fontFamily:"monospace"}}>vercel.com</div>
        </div>
        <div style={{padding:20,textAlign:"center"}}>
          <div style={{fontSize:28,fontWeight:900,color:"white",marginBottom:4}}>â–²</div>
          <div style={{fontSize:16,fontWeight:700,color:"white",marginBottom:4}}>Vercel</div>
          <div style={{fontSize:10,color:"#666",marginBottom:20}}>Develop. Preview. Ship.</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{background:"white",borderRadius:8,padding:"11px 14px",color:"black",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              ğŸ™ Continue with GitHub â† BUNA BAS
            </div>
            <div style={{border:"1px solid #333",borderRadius:8,padding:"10px 14px",color:"#888",fontSize:11}}>Continue with GitLab</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 10,
    phase: "Vercel",
    emoji: "ğŸ”—",
    title: "GitHub Ä°zni Ver",
    url: "github.com â†’ Vercel izni",
    instruction: "GitHub, Vercel'e eriÅŸim izni isteyecek",
    doThis: "'Authorize Vercel' butonuna basÄ±n â†’ Vercel'e geri dÃ¶nÃ¼n",
    tip: "Bu gÃ¼venli â€” Vercel sadece repo okuyacak",
    screen: () => (
      <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #30363d"}}>
        <div style={{background:"#161b22",padding:"8px 14px",borderBottom:"1px solid #30363d"}}>
          <div style={{fontSize:10,color:"#58a6ff",fontFamily:"monospace"}}>github.com/login/oauth</div>
        </div>
        <div style={{padding:16,textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16}}>
            <div style={{fontSize:24}}>ğŸ™</div>
            <div style={{fontSize:16,color:"#8b949e"}}>â†”</div>
            <div style={{fontSize:24}}>â–²</div>
          </div>
          <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:6}}>Authorize Vercel</div>
          <div style={{fontSize:10,color:"#8b949e",marginBottom:16,lineHeight:1.6}}>
            Vercel by Vercel Inc. wants to access your GitHub account
          </div>
          <div style={{background:"#2ea043",borderRadius:6,padding:"11px 14px",color:"white",fontWeight:700,fontSize:12,boxShadow:"0 0 12px #2ea04340"}}>
            Authorize Vercel â† BUNA BAS
          </div>
        </div>
      </div>
    )
  },
  {
    id: 11,
    phase: "Vercel",
    emoji: "ğŸ“¦",
    title: "Repository'i Import Et",
    url: "vercel.com/new",
    instruction: "Vercel GitHub repolarÄ±nÄ±zÄ± gÃ¶sterecek",
    doThis: "arsa-emsal'Ä±n yanÄ±ndaki 'Import' butonuna basÄ±n",
    tip: "Listede gÃ¶rmÃ¼yorsanÄ±z 'Add GitHub Account' deneyin",
    screen: () => (
      <div style={{background:"#000",borderRadius:12,overflow:"hidden",border:"1px solid #333"}}>
        <div style={{background:"#111",padding:"8px 14px",borderBottom:"1px solid #222"}}>
          <div style={{fontSize:10,color:"#888",fontFamily:"monospace"}}>vercel.com/new</div>
        </div>
        <div style={{padding:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:12}}>Import Git Repository</div>
          {[
            {name:"arsa-emsal",date:"az Ã¶nce",active:true},
            {name:"diger-proje",date:"3 gÃ¼n Ã¶nce",active:false},
          ].map((r,i)=>(
            <div key={i} style={{background:"#111",border:`1px solid ${r.active?"#0070f3":"#222"}`,borderRadius:8,padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <div style={{fontSize:12,fontWeight:r.active?700:400,color:r.active?"white":"#888"}}>ğŸ™ {r.name}</div>
                <div style={{fontSize:9,color:"#555",marginTop:2}}>GÃ¼ncellendi: {r.date}</div>
              </div>
              <div style={{background:r.active?"white":"#222",color:r.active?"black":"#555",borderRadius:5,padding:"5px 12px",fontSize:11,fontWeight:r.active?700:400}}>
                {r.active?"Import â† BUNA BAS":"Import"}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 12,
    phase: "Vercel",
    emoji: "ğŸš€",
    title: "Deploy Et!",
    url: "vercel.com/deploy",
    instruction: "Son adÄ±m â€” Deploy butonuna basÄ±n",
    doThis: "HiÃ§bir ayarÄ± deÄŸiÅŸtirmeyin â†’ 'Deploy' butonuna basÄ±n â†’ 30-60 saniye bekleyin",
    tip: "Siyah ekranda loglar akacak â€” bu normal, hata deÄŸil!",
    screen: () => (
      <div style={{background:"#000",borderRadius:12,overflow:"hidden",border:"1px solid #333"}}>
        <div style={{background:"#111",padding:"8px 14px",borderBottom:"1px solid #222"}}>
          <div style={{fontSize:10,color:"#888",fontFamily:"monospace"}}>vercel.com/configure</div>
        </div>
        <div style={{padding:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:4}}>Configure Project</div>
          <div style={{fontSize:10,color:"#555",marginBottom:14}}>arsa-emsal</div>
          {[
            {label:"Framework Preset",val:"Vite âœ“ otomatik algÄ±landÄ±"},
            {label:"Root Directory",val:"./"},
            {label:"Build Command",val:"vite build"},
            {label:"Output Directory",val:"dist"},
          ].map((f,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <div style={{fontSize:9,color:"#555",marginBottom:2}}>{f.label}</div>
              <div style={{background:"#111",border:"1px solid #222",borderRadius:5,padding:"7px 10px",fontSize:10,color:"#888",fontFamily:"monospace"}}>{f.val}</div>
            </div>
          ))}
          <div style={{background:"white",borderRadius:8,padding:"12px 14px",color:"black",textAlign:"center",fontWeight:700,fontSize:13,marginTop:12,boxShadow:"0 0 20px white20"}}>
            Deploy â† BUNA BAS ğŸš€
          </div>
        </div>
      </div>
    )
  },
  {
    id: 13,
    phase: "Vercel",
    emoji: "ğŸ‰",
    title: "CanlÄ±da!",
    url: "arsa-emsal-xxx.vercel.app",
    instruction: "Konfeti yaÄŸacak â€” uygulamanÄ±z canlÄ±da!",
    doThis: "'Visit' butonuna basÄ±n â†’ UygulamanÄ±zÄ± aÃ§Ä±n â†’ Linki kopyalayÄ±p paylaÅŸÄ±n",
    tip: "URL kalÄ±cÄ± â€” istediÄŸinizle paylaÅŸabilirsiniz. Kod deÄŸiÅŸince otomatik gÃ¼ncellenir.",
    screen: () => (
      <div style={{background:"#000",borderRadius:12,overflow:"hidden",border:"1px solid #333"}}>
        <div style={{background:"#111",padding:"8px 14px",borderBottom:"1px solid #222"}}>
          <div style={{fontSize:10,color:"#0070f3",fontFamily:"monospace"}}>vercel.com/dashboard</div>
        </div>
        <div style={{padding:20,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:8}}>ğŸ‰</div>
          <div style={{fontSize:15,fontWeight:700,color:"white",marginBottom:4}}>Congratulations!</div>
          <div style={{fontSize:11,color:"#555",marginBottom:16}}>Your project has been successfully deployed.</div>
          <div style={{background:"#111",border:"1px solid #0070f350",borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{fontSize:9,color:"#555",marginBottom:6}}>ğŸŒ CanlÄ± URL'iniz:</div>
            <div style={{fontSize:13,fontWeight:700,color:"#0070f3",fontFamily:"monospace"}}>arsa-emsal-abc.vercel.app</div>
            <div style={{fontSize:9,color:"#2ea043",marginTop:4}}>âœ“ Bu link kalÄ±cÄ±</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"white",borderRadius:6,padding:"9px",color:"black",fontWeight:700,fontSize:11}}>Visit â† AÃ§</div>
            <div style={{background:"#111",border:"1px solid #333",borderRadius:6,padding:"9px",color:"#888",fontSize:11}}>Share Link</div>
          </div>
        </div>
      </div>
    )
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(new Set());

  const step = STEPS[current];
  const total = STEPS.length;
  const githubSteps = STEPS.filter(s=>s.phase==="GitHub").length;

  const next = () => {
    setDone(p=>new Set([...p,current]));
    if(current<total-1) setCurrent(c=>c+1);
  };
  const prev = () => { if(current>0) setCurrent(c=>c-1); };

  const phaseColor = step.phase==="Vercel"?"#0070f3":"#2ea043";
  const progress = ((current)/total)*100;

  return (
    <div style={{minHeight:"100vh",background:"#060c14",color:"#d8cfc0",fontFamily:"'Georgia',serif",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto"}}>

      {/* Header */}
      <div style={{background:"#040a10",borderBottom:"1px solid #1a2a3a",padding:"12px 16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#c9a84c"}}>ğŸ“± Telefon Deploy Rehberi</div>
            <div style={{fontSize:10,color:"#506070",marginTop:1}}>GitHub + Vercel Â· Tamamen Ãœcretsiz</div>
          </div>
          <div style={{background:"#c9a84c20",border:"1px solid #c9a84c40",borderRadius:10,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#c9a84c"}}>
            {current+1}/{total}
          </div>
        </div>

        {/* Progress */}
        <div style={{height:4,background:"#1a2a3a",borderRadius:2,overflow:"hidden",marginBottom:10}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,#c9a84c,${phaseColor})`,borderRadius:2,width:`${progress}%`,transition:"width 0.4s ease"}}/>
        </div>

        {/* Phase indicator */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:step.phase==="GitHub"?"#2ea043":"#555"}}/>
            <span style={{fontSize:10,color:step.phase==="GitHub"?"#2ea043":"#506070",fontWeight:step.phase==="GitHub"?700:400}}>
              ğŸ™ GitHub ({githubSteps} adÄ±m)
            </span>
          </div>
          <div style={{color:"#1a2a3a",fontSize:10}}>â”€â”€â”€â”€â”€â”€</div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:step.phase==="Vercel"?"#0070f3":"#555"}}/>
            <span style={{fontSize:10,color:step.phase==="Vercel"?"#0070f3":"#506070",fontWeight:step.phase==="Vercel"?700:400}}>
              â–² Vercel ({total-githubSteps} adÄ±m)
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"auto",padding:"16px"}}>

        {/* Step badge */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${phaseColor}30,${phaseColor}10)`,border:`2px solid ${phaseColor}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
            {step.emoji}
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#f0e8d8"}}>{step.title}</div>
            <div style={{fontSize:9,color:phaseColor,marginTop:1,letterSpacing:"0.1em"}}>{step.phase} Â· ADIM {step.id}</div>
          </div>
        </div>

        {/* Screen mockup */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,color:"#506070",marginBottom:6,letterSpacing:"0.1em"}}>ğŸ“± EKRANINIZDA GÃ–RECEKLERINIZ</div>
          <step.screen/>
        </div>

        {/* What to do */}
        <div style={{background:"#0d1a28",border:"1px solid #1a2a3a",borderRadius:10,padding:14,marginBottom:10}}>
          <div style={{fontSize:9,color:phaseColor,marginBottom:7,letterSpacing:"0.1em",fontWeight:700}}>âœ… NE YAPACAKSINIZ</div>
          <div style={{fontSize:12,color:"#d0c8b8",lineHeight:1.8}}>{step.doThis}</div>
        </div>

        {/* URL */}
        <div style={{background:"#080e18",border:`1px solid ${phaseColor}30`,borderRadius:8,padding:"9px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11}}>ğŸŒ</span>
          <div>
            <div style={{fontSize:9,color:"#506070",marginBottom:2}}>ADRES Ã‡UBUÄUNA YAZIN</div>
            <div style={{fontSize:11,color:phaseColor,fontFamily:"monospace",fontWeight:600}}>{step.url}</div>
          </div>
        </div>

        {/* Tip */}
        <div style={{background:"#0a140a",border:"1px solid #2ea04330",borderRadius:8,padding:"9px 12px",display:"flex",gap:8}}>
          <span style={{fontSize:13,flexShrink:0}}>ğŸ’¡</span>
          <div style={{fontSize:11,color:"#7090a0",lineHeight:1.6}}>{step.tip}</div>
        </div>

        {/* Final message */}
        {current===total-1&&(
          <div style={{background:"linear-gradient(135deg,#0a1f0a,#081408)",border:"1px solid #2ea04350",borderRadius:12,padding:18,textAlign:"center",marginTop:14}}>
            <div style={{fontSize:28,marginBottom:8}}>ğŸ†</div>
            <div style={{fontSize:14,fontWeight:700,color:"#4ade80",marginBottom:8}}>Tebrikler! UygulamanÄ±z CanlÄ±da!</div>
            <div style={{fontSize:11,color:"#7090a0",lineHeight:1.8}}>
              Vercel size kalÄ±cÄ± bir URL verdi.<br/>
              MÃ¼ÅŸterilerinizle paylaÅŸabilirsiniz.<br/>
              Kod deÄŸiÅŸince otomatik gÃ¼ncellenir.<br/><br/>
              <span style={{color:"#c9a84c",fontWeight:700}}>Sonraki adÄ±m:</span> GerÃ§ek bir arsa ile test edin ğŸ—ï¸
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{background:"#040a10",borderTop:"1px solid #1a2a3a",padding:"12px 16px",flexShrink:0}}>
        {/* Dots */}
        <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:12,flexWrap:"wrap"}}>
          {STEPS.map((_,i)=>(
            <div key={i} onClick={()=>setCurrent(i)} style={{width:done.has(i)?16:6,height:6,borderRadius:3,background:i===current?"#c9a84c":done.has(i)?"#2ea043":"#1a2a3a",transition:"all 0.3s",cursor:"pointer"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10}}>
          <button onClick={prev} disabled={current===0} style={{background:current===0?"#080e18":"#0d1a28",border:`1px solid ${current===0?"#1a2a3a":"#2a3a4a"}`,color:current===0?"#304050":"#8090a0",borderRadius:9,padding:"13px",fontSize:13,cursor:current===0?"default":"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
            â† Geri
          </button>
          <button onClick={next} disabled={current===total-1} style={{background:current===total-1?"#080e18":`linear-gradient(135deg,${phaseColor}20,${phaseColor}10)`,border:`1px solid ${current===total-1?"#1a2a3a":phaseColor}`,color:current===total-1?"#304050":phaseColor,borderRadius:9,padding:"13px",fontSize:13,fontWeight:700,cursor:current===total-1?"default":"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
            {current===total-1?"âœ… TamamlandÄ±!":current===total-2?"ğŸš€ Son AdÄ±m!":"Ä°leri â†’"}
          </button>
        </div>
      </div>
    </div>
  );
                       }

import json, subprocess, re, unicodedata, sys, os
S=json.load(open('scripts.json'))
SR=44100
GAP=0.3
GAPV={'f1':.12,'f2':.15,'f3':.35}
# extra pauses before segment index (dramatic beats)
EXTRA={'f1a':{4:.15,5:.5},'f1b':{5:.5},'f1c':{5:.5},
 'f3a':{2:.3,4:.4,6:.5,7:.3,8:.4,9:.3,11:.7,12:.4,13:.6,14:.8},
 'f3b':{1:.2,2:.2,6:.4,7:.3,8:.6,9:.3,10:.6,11:.8},
 'f3c':{4:.3,5:.3,6:.6,7:.3,9:.4,10:.8},
 'f2a':{5:.3},'f2b':{1:.6,5:.3},'f2c':{5:.3}}
LEAD={'f1':.12,'f2':.12,'f3':.25}
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if c.isalnum())
import numpy as np
def load(path):
    r=subprocess.run(['ffmpeg','-v','error','-i',path,'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True)
    return np.frombuffer(r.stdout,dtype=np.float32)
os.makedirs('build',exist_ok=True)
for vid,segs in S.items():
    t=LEAD[vid[:2]]; out=[]; buf=[np.zeros(int(t*SR),np.float32)]
    for i,sg in enumerate(segs):
        if i>0:
            g=GAPV[vid[:2]]+EXTRA.get(vid,{}).get(i,0); buf.append(np.zeros(int(g*SR),np.float32)); t+=g
        w=json.load(open(f'voz/{vid}_{i:02d}.json')); a=load(f'voz/{vid}_{i:02d}.mp3')
        start_cut=max(0,w[0]['s']-0.06); end_cut=w[-1]['e']+0.12
        a=a[int(start_cut*SR):int(end_cut*SR)]
        maxg={'f1':.16,'f2':.18,'f3':.32}[vid[:2]]
        # compress internal silences between words
        w=[dict(x,s=x['s']-start_cut,e=x['e']-start_cut) for x in w]; start_cut=0
        pieces=[];pos=0;shift=0;nw=[]
        for k,x in enumerate(w):
            if k>0:
                g=x['s']-w[k-1]['e']
                if g>maxg:
                    cut0=w[k-1]['e']+maxg/2; cut1=x['s']-maxg/2
                    pieces.append(a[int(pos*SR):int(cut0*SR)]); pos=cut1; shift+=cut1-cut0
            nw.append(dict(w=x['w'],s=x['s']-shift,e=x['e']-shift))
        pieces.append(a[int(pos*SR):]); a=np.concatenate(pieces); w=nw
        # attach punctuation from script tokens
        toks=sg['t'].split(); ti=0; words=[]
        for x in w:
            nx=norm(x['w']); lab=x['w']
            for j in range(ti,min(ti+4,len(toks))):
                if nx and nx in norm(toks[j]): lab=toks[j]; ti=j+1; break
            words.append(dict(w=lab,s=round(t+x['s']-start_cut,3),e=round(t+x['e']-start_cut,3)))
        d=len(a)/SR
        out.append(dict(i=i,v=sg['v'],text=sg['t'],s=round(t,3),e=round(t+d,3),words=words))
        buf.append(a); t+=d
    tail=1.6 if vid[:2]!='f3' else 2.2
    buf.append(np.zeros(int(tail*SR),np.float32)); t+=tail
    v=np.concatenate(buf)
    v.astype(np.float32).tofile(f'build/{vid}_voice.f32')
    json.dump(dict(dur=round(t,3),segs=out),open(f'build/{vid}.json','w'),ensure_ascii=False)
    print(vid,round(t,1),'s')

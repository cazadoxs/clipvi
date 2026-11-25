import numpy as np, json, sys
SR = 44100
rng = np.random.default_rng(7)

def env(n, a=.005, d=.3):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / d)
    return e

def tone(f, dur, d=.3, harm=(1, .5, .25), a=.004):
    n = int(dur * SR); t = np.arange(n) / SR
    y = sum(h * np.sin(2 * np.pi * f * (i + 1) * t) for i, h in enumerate(harm))
    return y * env(n, a, d)

def noise(dur): return rng.standard_normal(int(dur * SR))

def lp(x, k):  # one-pole lowpass, k in (0,1)
    y = np.empty_like(x); acc = 0.
    for i in range(len(x)): acc += k * (x[i] - acc); y[i] = acc
    return y

def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- SFX ----------------
def sfx_pop():
    n = int(.12 * SR); t = np.arange(n) / SR
    f = 300 + 900 * t / .12
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .04) * .8
def sfx_whoosh():
    x = noise(.45); n = len(x); t = np.arange(n) / SR
    y = np.convolve(x, np.ones(18) / 18, 'same') - np.convolve(x, np.ones(120) / 120, 'same')
    e = np.sin(np.pi * t / .45) ** 2
    return y * e * .9
def sfx_ding():
    return (tone(midi(88), 1.2, .5, (1, .3, .1)) + .6 * tone(midi(95), 1.2, .35, (1,))) * .35
def sfx_boing():
    n = int(.5 * SR); t = np.arange(n) / SR
    f = 180 + 120 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 5) + 200 * t
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .003, .25) * .6
def sfx_wahwah():  # sad descending
    out = []
    for m, d in [(62, .35), (61, .35), (60, .35), (59, .9)]:
        n = int(d * SR); t = np.arange(n) / SR
        vib = 1 + .012 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        f = midi(m) * vib
        y = sum(h * np.sin(2 * np.pi * f * (i + 1) * np.arange(n) / SR) for i, h in enumerate((1, .6, .4, .25)))
        out.append(y * np.minimum(1, t / .03) * np.minimum(1, (d - t) / .08))
    return np.concatenate(out) * .22
def sfx_thud():
    n = int(.35 * SR); t = np.arange(n) / SR
    f = 110 * np.exp(-t * 8) + 40
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .12) + .3 * noise(.35) * env(n, .001, .03)) * .9
def sfx_sparkle():
    out = np.zeros(int(1.2 * SR))
    for i, m in enumerate([84, 88, 91, 96, 100]):
        s = int(i * .07 * SR); x = tone(midi(m), .8, .25, (1, .2)); out[s:s + len(x)] += x[:len(out) - s]
    return out * .25
def sfx_tick():
    return tone(2000, .05, .01, (1,)) * .3
def sfx_click():
    return noise(.03) * env(int(.03 * SR), .0005, .006) * .5
def sfx_horn():  # truck horn
    n = int(.7 * SR); t = np.arange(n) / SR
    y = np.sign(np.sin(2 * np.pi * 233 * t)) * .5 + np.sign(np.sin(2 * np.pi * 294 * t)) * .5
    y = np.convolve(y, np.ones(8) / 8, 'same')
    return y * np.minimum(1, t / .02) * np.minimum(1, (.7 - t) / .05) * .18
def sfx_skid():
    x = noise(1.0); n = len(x); t = np.arange(n) / SR
    y = np.convolve(x, np.ones(4) / 4, 'same') * (np.sin(2 * np.pi * 1400 * t) * .5 + .5)
    return y * np.minimum(1, t / .05) * np.exp(-t * 1.5) * .25
def sfx_heart():
    o = np.zeros(int(.8 * SR))
    for s in (0, .18):
        n = int(.2 * SR); t = np.arange(n) / SR
        x = np.sin(2 * np.pi * (60 * np.exp(-t * 6) + 35) * t) * env(n, .002, .07); i = int(s * SR); o[i:i + n] += x * (1 if s == 0 else .7)
    return o * .9
def sfx_bubble():
    o = np.zeros(int(.6 * SR))
    for k in range(5):
        n = int(.08 * SR); t = np.arange(n) / SR; f = 400 + 900 * t / .08 + k * 120
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .03); i = int(k * .1 * SR); o[i:i + n] += x
    return o * .5
def sfx_splash():
    x = noise(.9); n = len(x); t = np.arange(n) / SR
    return (x - np.convolve(x, np.ones(30) / 30, 'same')) * env(n, .005, .25) * .5
def sfx_switch_on():
    return np.concatenate([sfx_click(), np.zeros(int(.02 * SR)), tone(midi(79), .5, .2, (1, .3)) * .25])
def sfx_switch_off():
    return np.concatenate([sfx_click(), np.zeros(int(.02 * SR)), tone(midi(55), .4, .15, (1, .3)) * .25])
def sfx_alarm():
    o = []
    for k in range(4):
        n = int(.25 * SR); t = np.arange(n) / SR; f = 880 if k % 2 == 0 else 660
        o.append(np.sign(np.sin(2 * np.pi * f * t)) * .12 * np.minimum(1, (0.25 - t) / .02))
    return np.convolve(np.concatenate(o), np.ones(6) / 6, 'same')
def sfx_rise():
    n = int(1.2 * SR); t = np.arange(n) / SR; f = 200 * 2 ** (t * 2.2)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / 1.2) ** 2 * .2

SFX = {k[4:]: v for k, v in globals().items() if k.startswith('sfx_')}

# ---------------- MUSIC ----------------
def music_bouncy(dur, bpm=118, seed=0):
    beat = 60 / bpm; n = int(dur * SR) + SR; out = np.zeros(n)
    prog = [(60, 64, 67), (55, 59, 62), (57, 60, 64), (53, 57, 60)]
    if seed: prog = prog[seed % 4:] + prog[:seed % 4]
    mel = [0, 2, 1, 2, 0, 1, 2, 1]
    b = 0
    while b * beat < dur:
        ch = prog[(b // 8) % 4]; t0 = int(b * beat * SR)
        def add(x, at):
            e = min(n, at + len(x)); out[at:e] += x[:e - at]
        # kick on beats 0,4 of each bar(8 eighths), snare-ish on 4
        if b % 4 == 0: add(sfx_thud() * .35, t0)
        if b % 8 == 4: add(noise(.12) * env(int(.12 * SR), .001, .04) * .12, t0)
        add(noise(.04) * env(int(.04 * SR), .0005, .01) * .05, t0 + int(beat / 2 * SR))
        # marimba arpeggio eighths
        add(tone(midi(ch[mel[b % 8]] + 12), .5, .12, (1, .15, .05)) * .16, t0)
        if b % 2 == 1: add(tone(midi(ch[(b // 2) % 3] + 24), .3, .08, (1,)) * .05, t0 + int(beat / 2 * SR))
        # bass
        if b % 2 == 0: add(tone(midi(ch[0] - 24), .45, .18, (1, .4)) * .3, t0)
        b += 1
    return out[:int(dur * SR)]

def music_tender(dur, bpm=76, mood=0):
    beat = 60 / bpm; n = int(dur * SR) + 2 * SR; out = np.zeros(n)
    prog = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]  # Am F C G
    b = 0
    def add(x, at):
        e = min(n, at + len(x)); out[at:e] += x[:e - at]
    while b * beat < dur:
        ch = prog[(b // 4) % 4]; t0 = int(b * beat * SR)
        if b % 4 == 0:  # pad
            for m in ch:
                x = tone(midi(m), beat * 4.2, 2.5, (1, .2), a=.4) * .05; add(x, t0)
            add(tone(midi(ch[0] - 12), beat * 4, 1.5, (1, .3), a=.05) * .12, t0)
        # music box arpeggio (half beats)
        for k in range(2):
            m = ch[(b * 2 + k) % 3] + 24 if (b * 2 + k) % 4 != 3 else ch[0] + 36
            add(tone(midi(m), 1.2, .5, (1, .1, .05)) * .07, t0 + int(k * beat / 2 * SR))
        b += 1
    return out[:int(dur * SR)]

def mix(vid, kind, sfx_events, music_gain=1.0, duck=True):
    voice = np.fromfile(f'build/{vid}_voice.f32', dtype=np.float32).astype(np.float64)
    n = len(voice); dur = n / SR
    if kind == 'bouncy': mus = music_bouncy(dur, seed=hash(vid) % 4 if False else 0)
    else: mus = music_tender(dur)
    mus = mus[:n]
    if len(mus) < n: mus = np.pad(mus, (0, n - len(mus)))
    # duck envelope from voice energy
    if duck:
        win = int(.05 * SR); e = np.sqrt(np.convolve(voice ** 2, np.ones(win) / win, 'same'))
        e = np.convolve((e > .02).astype(float), np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
        g = 1 - .55 * np.clip(e, 0, 1)
    else: g = 1
    # fade in/out music
    fade = np.ones(n); fi = int(.3 * SR); fo = int(1.5 * SR)
    fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
    out = voice * 1.0 + mus * g * fade * .55 * music_gain
    for ev in sfx_events:
        x = SFX[ev['n']]() * ev.get('v', 1)
        i = int(ev['t'] * SR)
        if i >= n: continue
        e = min(n, i + len(x)); out[i:e] += x[:e - i] * .7
    peak = np.max(np.abs(out)); out = out / max(peak, 1e-6) * .95 if peak > .95 else out
    out = np.tanh(out * 1.1) / np.tanh(1.1)
    (out.astype(np.float32)).tofile(f'build/{vid}_mix.f32')

if __name__ == '__main__':
    vid, kind = sys.argv[1], sys.argv[2]
    ev = json.load(open(f'build/{vid}_sfx.json'))
    mix(vid, kind, ev, float(sys.argv[3]) if len(sys.argv) > 3 else 1.0)

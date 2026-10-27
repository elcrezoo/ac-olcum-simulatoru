const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const core=script.slice(0,script.indexOf('function readParams'));
const ctx=vm.createContext({document:{getElementById:()=>null}});
vm.runInContext(core+';globalThis.run=measure;globalThis.base=defaults;',ctx);
const run=patch=>ctx.run({...ctx.base,...patch});
const close=(actual,expected,tol)=>assert(Math.abs(actual-expected)<tol,`${actual} vs ${expected}`);
for(const [wave,factor]of [['sine',Math.SQRT1_2],['square',1],['triangle',1/Math.sqrt(3)],['saw',1/Math.sqrt(3)]]){const s=run({wave,fs:100000});close(s.rms,220*factor,.2);close(s.frequency,50,.1);close(s.mean,0,.3);console.log(wave,s.rms,s.frequency);}
let s=run({dc:100});close(s.rms,Math.sqrt(10000+24200),.1);close(s.mean,100,.1);
s=run({amp:500});assert(s.clipped>0);assert(s.max<=400);assert(s.min>=-400);
s=run({fs:80});assert(!Number.isFinite(s.frequency));
s=run({amp:0,dc:25});assert(!Number.isFinite(s.frequency));close(s.mean,25,.1);
s=run({bias:0});assert(s.clipped>0);
s=run({duration:.02});assert(!Number.isFinite(s.frequency));
s=run({noise:20});assert.deepStrictEqual([...s.codes],[...run({noise:20}).codes]);
s=run({fs:100000,duration:2});assert.equal(s.n,200000);
console.log('All numerical checks passed.');
vm.runInContext('globalThis.norm=normalize;',ctx);
for(const wave of ['sine','square','triangle','saw']){
 const p=ctx.norm({...ctx.base,wave,ampMode:'rms',amp:220,fs:100000,range:1000});
 const r=ctx.run(p);close(r.ac,220,.2);
 close(r.max,p.amp,.6);
}
const rp=ctx.norm({...ctx.base,ampMode:'rms',amp:220,dc:100,range:1000});
close(ctx.run(rp).rms,Math.hypot(220,100),.2);
console.log('RMS input and DC tests passed.');
const remainder=script.slice(script.indexOf('const experiments='),script.indexOf("$('experimentsList').innerHTML"));
vm.runInContext(remainder+';globalThis.experiments=experiments;globalThis.stats=stats;',ctx);
for(const ex of ctx.experiments){
 const base={...ctx.base,...ex.before};
 const before=ctx.run(ctx.norm(base)),after=ctx.run(ctx.norm({...base,...ex.after}));
 assert(Number.isFinite(before.rms)&&Number.isFinite(after.rms));
 close(after.rms**2,after.mean**2+after.ac**2,.0001);
 console.log(ex.name, 'RMS', before.rms.toFixed(4),'->',after.rms.toFixed(4));
}
const dcSmall=run({amp:0,dc:999,range:2500,bits:16});
close(dcSmall.ac,0,1e-9);
const windowed=run({duration:.03});close(windowed.mean,46.68,.1);
const quantized=run({bits:8});close(quantized.lsb,800/255,1e-10);
console.log('Experiment, RMS decomposition, zero AC and window checks passed.');

import React from 'react';
import './style.css';
export default function Preview({resumeData={}}){
 const d=resumeData||{}; const p=d.personalInfo||{};
 
const A=v=>Array.isArray(v)?v:[];
const S=(o,ks)=>{for(const k of ks)if(o?.[k])return o[k];return''};
const P=o=>{const a=S(o,['startDate','start','from']);const b=S(o,['endDate','end','to'])||(o?.current?'Present':'');return[a,b].filter(Boolean).join(' – ')};
const Contact=({p})=><div className="contact">{[p.email,p.phone,p.location,p.linkedin,p.github].filter(Boolean).map((x,i)=><span key={i}>{x}</span>)}</div>;
const Section=({t,children})=><section className="section"><div className="section-title">{t}</div>{children}</section>;
const Summary=({d})=>d.summary?<Section t="Profile"><p>{d.summary}</p></Section>:null;
const Skills=({d})=>A(d.skills).length?<Section t="Skills"><div className="skills">{A(d.skills).map((x,i)=><span key={i}>{typeof x==='string'?x:S(x,['name','skill','label','value'])}</span>)}</div></Section>:null;
const Education=({d})=>A(d.education).length?<Section t="Education">{A(d.education).map((e,i)=><article className="entry" key={i}><div><h4>{S(e,['degree','qualification','program','title'])}</h4><div className="org">{S(e,['institution','school','college','university'])}</div><div className="meta">{S(e,['field','major','specialization'])}</div></div><time>{P(e)}</time></article>)}</Section>:null;
const Experience=({d})=>A(d.experience).length?<Section t="Experience">{A(d.experience).map((e,i)=><article className="entry" key={i}><div><h4>{S(e,['role','position','title','jobTitle'])}</h4><div className="org">{S(e,['company','organization','employer'])}</div><div className="meta">{S(e,['location'])}</div>{S(e,['description','summary'])&&<p>{S(e,['description','summary'])}</p>}{A(e.highlights||e.responsibilities||e.bullets).length>0&&<ul>{A(e.highlights||e.responsibilities||e.bullets).map((b,j)=><li key={j}>{typeof b==='string'?b:S(b,['text','description','value'])}</li>)}</ul>}</div><time>{P(e)}</time></article>)}</Section>:null;
const Projects=({d})=>A(d.projects).length?<Section t="Projects">{A(d.projects).map((x,i)=><article className="entry" key={i}><div><h4>{S(x,['name','title'])}</h4><div className="meta">{Array.isArray(S(x,['technologies','tech','stack']))?S(x,['technologies','tech','stack']).join(' · '):S(x,['technologies','tech','stack'])}</div>{S(x,['description','summary'])&&<p>{S(x,['description','summary'])}</p>}</div>{S(x,['link','url'])&&<a href={S(x,['link','url'])} target="_blank" rel="noreferrer">↗</a>}</article>)}</Section>:null;
const Certifications=({d})=>A(d.certifications).length?<Section t="Certifications">{A(d.certifications).map((x,i)=><article className="entry" key={i}><div><h4>{S(x,['name','title','certificate'])}</h4><div className="org">{S(x,['issuer','organization','provider'])}</div></div><time>{S(x,['date','issueDate','year'])}</time></article>)}</Section>:null;

 return <article className="resume-template rt100-67">
 <header className="identity"><div className="index">67</div><div className="name"><h1>{p.name||'Your Name'}</h1><h2>{p.title}</h2></div><Contact p={p}/></header>
 <div className="body"><div className="layout"><main><Experience d={d}/><Summary d={d}/><Projects d={d}/><Skills d={d}/></main><aside><div className="side-label">FILM PORTFOLIO</div><Education d={d}/><Certifications d={d}/></aside></div></div>
 </article>;
}

import React from 'react';
import './style.css';

export default function Preview({ resumeData = {} }) {
  const d = resumeData || {};
  const p = d.personalInfo || {};
  
const arr = v => Array.isArray(v) ? v : [];
const text = (v, fallback='') => v == null ? fallback : String(v);
const first = (o, keys) => { for (const k of keys) if (o?.[k]) return o[k]; return ''; };
const period = o => {
  const s = first(o,['startDate','start','from']);
  const e = first(o,['endDate','end','to']) || (o?.current ? 'Present' : '');
  return [s,e].filter(Boolean).join(' – ');
};
const Section = ({title, children, className=''}) => <section className={`rt-section ${className}`}><h3>{title}</h3>{children}</section>;
const Experience = () => arr(d.experience).length ? <Section title="Experience" className="rt-experience">{arr(d.experience).map((e,i)=>
  <article className="rt-entry" key={i}><div className="rt-entry-head"><div><h4>{first(e,['role','position','title','jobTitle'])}</h4><div className="rt-org">{first(e,['company','organization','employer'])}</div></div><time>{period(e)}</time></div>{first(e,['location'])&&<div className="rt-meta">{e.location}</div>}{first(e,['description','summary'])&&<p>{first(e,['description','summary'])}</p>}{arr(e.highlights || e.responsibilities || e.bullets).length>0&&<ul>{arr(e.highlights || e.responsibilities || e.bullets).map((b,j)=><li key={j}>{typeof b==='string'?b:first(b,['text','description','value'])}</li>)}</ul>}</article>)}</Section> : null;
const Education = () => arr(d.education).length ? <Section title="Education">{arr(d.education).map((e,i)=>
  <article className="rt-entry" key={i}><div className="rt-entry-head"><div><h4>{first(e,['degree','qualification','program','title'])}</h4><div className="rt-org">{first(e,['institution','school','college','university'])}</div></div><time>{period(e)}</time></div>{first(e,['field','specialization','major'])&&<div className="rt-meta">{first(e,['field','specialization','major'])}</div>}{first(e,['description','details'])&&<p>{first(e,['description','details'])}</p>}</article>)}</Section> : null;
const Projects = () => arr(d.projects).length ? <Section title="Projects">{arr(d.projects).map((p,i)=>
  <article className="rt-entry" key={i}><div className="rt-entry-head"><div><h4>{first(p,['name','title'])}</h4>{first(p,['technologies','tech','stack'])&&<div className="rt-tech">{Array.isArray(first(p,['technologies','tech','stack']))?first(p,['technologies','tech','stack']).join(' · '):first(p,['technologies','tech','stack'])}</div>}</div>{first(p,['link','url'])&&<a href={first(p,['link','url'])} target="_blank" rel="noreferrer">{first(p,['linkText'])||'Project'}</a>}</div>{first(p,['description','summary'])&&<p>{first(p,['description','summary'])}</p>}{arr(p.highlights || p.bullets).length>0&&<ul>{arr(p.highlights || p.bullets).map((b,j)=><li key={j}>{typeof b==='string'?b:first(b,['text','description','value'])}</li>)}</ul>}</article>)}</Section> : null;
const Skills = () => arr(d.skills).length ? <Section title="Skills"><div className="rt-skills">{arr(d.skills).map((s,i)=><span key={i}>{typeof s==='string'?s:first(s,['name','skill','label','value'])}</span>)}</div></Section> : null;
const Certifications = () => arr(d.certifications).length ? <Section title="Certifications">{arr(d.certifications).map((c,i)=><article className="rt-entry rt-cert" key={i}><h4>{first(c,['name','title','certificate'])}</h4>{first(c,['issuer','organization','provider'])&&<div className="rt-org">{first(c,['issuer','organization','provider'])}</div>}{first(c,['date','issueDate','year'])&&<time>{first(c,['date','issueDate','year'])}</time>}</article>)}</Section> : null;
const Summary = () => text(d.summary) ? <Section title="Profile" className="rt-summary"><p>{d.summary}</p></Section> : null;

  return <article className="rt-07 resume-template"><header className="rt-header"><div className="rt-rule"></div><h1>{p.name || 'Your Name'}</h1><h2>{p.title}</h2><div className="rt-contact">{[p.email,p.phone,p.location,p.linkedin,p.github].filter(Boolean).map((x,i)=><span key={i}>{x}</span>)}</div></header><div className="rt-body"><Summary/><Experience/><Projects/><Education/><Skills/><Certifications/></div></article>;
}

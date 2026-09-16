import React from 'react';
import { CalendarRange, FileCheck2, MapPin, Check, ScanLine, Orbit, Layers3, BadgeCheck, Fingerprint } from 'lucide-react';

/** Decorative, code-native product illustrations; no canvas or render loop. */
export function ServiceIllustration({ kind }: { kind: string }) {
  return <div className={'pl-scene pl-scene-' + kind} aria-hidden="true">
    <div className="pl-scene-grid"/>
    {kind === 'academic' ? <><div className="pl-scene-sheet"><div className="pl-sheet-top"><CalendarRange size={19}/><span>YOUR WEEK, ALIGNED</span></div><div className="pl-calendar-cells">{Array.from({length:15},(_,i)=><i key={i} className={i === 7 ? 'selected' : ''}>{i === 7 ? <Check size={13}/> : null}</i>)}</div></div><span className="pl-scene-chip"><span className="pl-live-dot"/>On track</span></> : kind === 'documents' ? <><div className="pl-scene-sheet"><div className="pl-sheet-top"><FileCheck2 size={20}/><span>ONE LESS THING TO DO</span></div><div className="pl-document-lines"><i/><i/><i/></div><span className="pl-document-stamp"><BadgeCheck size={30}/></span></div><span className="pl-scene-chip"><Check size={14}/>Request → ready</span></> : <><div className="pl-radar"><i/><i/><i/><span className="pl-map-center"><MapPin size={29}/></span><span className="pl-map-point"/><span className="pl-map-point second"/></div><span className="pl-scene-chip"><Orbit size={15}/>Closer, together</span></>}
  </div>;
}

export function RoleEmblem({ role }: { role: string }) {
  const Icon = role === 'student' ? Fingerprint : role === 'faculty' ? Layers3 : ScanLine;
  return <span className={'pl-role-emblem pl-emblem-' + role} aria-hidden="true"><span/><span/><i><Icon size={32} strokeWidth={1.4}/></i></span>;
}

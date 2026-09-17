import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowUpRight, type LucideIcon } from 'lucide-react';
interface Props {
  tabs: { id: string; label: string; icon: LucideIcon }[];
  activeTab: string;
  onNavigate: (id: string) => void;
  onOpenAssistant: () => void;
}
export function CampusNavigation({ tabs, activeTab, onNavigate, onOpenAssistant }: Props) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const current = tabs.find(tab => tab.id === activeTab);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  return <>
    <div className="mobile-module-bar">
      <span>{current?.label}</span>
      <button ref={toggle} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="campus-navigation">{open ? <X size={18}/> : <Menu size={18}/>} {open ? 'Close menu' : 'All services'}</button>
    </div>
    <nav id="campus-navigation" className={'campus-sidebar' + (open ? ' is-open' : '')} aria-label="Campus modules">
      <p className="sidebar-caption">WORKSPACE</p>
      <div className="sidebar-links">{tabs.map(({ id, label, icon: Icon }, index) => <React.Fragment key={id}>
        {index === 2 && <p className="sidebar-caption">CAMPUS SERVICES</p>}
        {index === 8 && <p className="sidebar-caption">COMMUNITY</p>}
        <button onClick={() => { onNavigate(id); setOpen(false); }} aria-current={id === activeTab ? 'page' : undefined}><Icon size={18} aria-hidden="true"/><span>{label}</span>{id === 'promisecheck' && <small>AI</small>}</button>
      </React.Fragment>)}</div>
      <div className="sidebar-help"><Sparkles size={21}/><strong>A helping hand,<br/>whenever you need it.</strong><p>Find answers with your campus assistant.</p><button onClick={() => {setOpen(false); onOpenAssistant();}}>Let’s talk <ArrowUpRight size={16}/></button></div>
      <span className="sidebar-bottom">YUKTI AI <span>·</span> YOUR EVERYDAY EDGE</span>
    </nav>
  </>;
}

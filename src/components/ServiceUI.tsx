import React, { useEffect, useRef } from 'react';
import { X, Search, Inbox } from 'lucide-react';
import '../services.css';

export function ServiceHeader({ label, title, description, children }: { label: string; title: string; description: string; children?: React.ReactNode }) {
  return <header className="service-heading"><div><p>{label}</p><h1>{title}</h1><span>{description}</span></div>{children}</header>;
}
export function ServiceSearch({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="service-search"><Search size={18} aria-hidden="true"/><input aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}/>{value && <button type="button" aria-label="Clear search" onClick={() => onChange('')}><X size={16}/></button>}</label>;
}
export function ServiceEmpty({ title, description }: { title: string; description: string }) {
  return <div className="service-empty"><Inbox size={30} aria-hidden="true"/><h3>{title}</h3><p>{description}</p></div>;
}
export function ServiceDialog({ title, onClose, children, busy = false }: { title: string; onClose: () => void; children: React.ReactNode; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog ref={ref} className="service-dialog" aria-label={title} onCancel={e => { e.preventDefault(); if (!busy) onClose(); }}><div className="service-dialog-title"><h2>{title}</h2><button type="button" disabled={busy} aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div>{children}</dialog>;
}

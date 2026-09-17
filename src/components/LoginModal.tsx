import React from 'react';
import { UserProfile, UserRole } from '../types';
import { ServiceDialog } from './ServiceUI';
interface LoginModalProps { isOpen:boolean; onClose:()=>void; currentUser:UserProfile; onSelectUserRole:(role:UserRole)=>void; }
export function LoginModal({isOpen,onClose,currentUser,onSelectUserRole}:LoginModalProps) {
 if(!isOpen)return null;
 return <ServiceDialog title="Choose a demo role" onClose={onClose}><div className="service-form"><p>This is a local demo, not campus SSO. No password is required or collected. All roles share this browser's sample records.</p>{(['student','faculty','admin'] as const).map(role=><button key={role} className="service-secondary" aria-pressed={currentUser.role===role} onClick={()=>{onSelectUserRole(role);onClose();}}>Explore {role} view</button>)}</div></ServiceDialog>;
}

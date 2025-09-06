import { ModalProps } from "@mui/material";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
interface TripNotificationType{
    open:boolean ,
    onClose?:()=>void
}
const TripNotification:React.FC<PropsWithChildren<TripNotificationType>>=(props)=>{
    const dialog=useRef<HTMLDialogElement|null>(null);
    useEffect(()=> { 
    if (!dialog.current) return;
    if (props.open) {
        dialog.current.showModal();   
    } else {
        dialog.current.close();       
    }},[props.open]);
    const modal=document.getElementById('root');
    if(!modal)return;
    return createPortal(
        <dialog  ref={dialog}  className="modal" >
            {props.children}
        </dialog>, modal
    )
}
export default TripNotification;
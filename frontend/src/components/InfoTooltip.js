import { useRef, useEffect } from "react";

export default function InfoTooltip({ isOpen, onClose, message,  onCloseOverlayClick, onCloseKeyDown}) {

    const popupLinkRef = useRef();

    useEffect(() => {
        const currentPopup = popupLinkRef.current;

        currentPopup.addEventListener("click", onCloseOverlayClick);
        document.addEventListener("keydown", onCloseKeyDown);
        return() => {
            document.removeEventListener("keydown", onCloseKeyDown);
            currentPopup.removeEventListener("click", onCloseOverlayClick);
        }
    }, [onClose, onCloseKeyDown, onCloseOverlayClick]);

    return(
        <div className={`popup ${isOpen && "popup_open"} popup_type_image"`} 
            ref={popupLinkRef}        
        >
            <div className="popup__container">
                <button type="button" className="popup__close-button" onClick={onClose}></button>
                <form className="form">
                    <img className="form__image" src={message.image} alt="Авторизация"></img>
                    <p className="form__subtitle">{message.text}</p>
                </form>
            </div>
        </div>
    )
}
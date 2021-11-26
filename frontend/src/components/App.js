import {useState, useEffect} from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js"; 
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import * as authUser from "../utils/authUser.js";
import InfoTooltip from "./InfoTooltip.js";
import imageResolve from "../images/resolve.svg";
import imageError from "../images/error.svg";
 
function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({name: "", link: ""});
    const [selectedCardDelet, setSelectedCardDelete] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [message, setMessage] = useState({ image: "", text: "" });
    const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
    const history = useHistory();


    useEffect(() => {
        if (loggedIn) {
        Promise.all([api.getInitialCards(), api.getUserInfoFromServer()])
        .then(([dataCards, dataUser]) => {
            setCards(dataCards);
            setCurrentUser(dataUser);
        })
        .catch((err) => {
            console.log(err);
        });
        }
    }, [loggedIn]);

    function handleCardLike(card) {
        const isLiked = card.likes.some((item) => {
            return item === currentUser._id
        });
      
        api.changeLikeCardStatus(card._id, isLiked)
        .then((newCard) => {
            setCards(cards => cards.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    function handleCardDelete(evt) {
        evt.preventDefault();
        api.handlerDeleteCards(selectedCardDelet._id)
        .then(() => {
            setCards(cards => cards.filter((c) => c._id !== selectedCardDelet._id));
            setIsDeletePopupOpen(false);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function handleDeleteCardClick(card) {
        setSelectedCardDelete(card);
        setIsDeletePopupOpen(true);
    }

    function handleAddPlaceSubmit(item) {
        api.postCards(item)
        .then(newCard => {
            setCards([...cards, newCard]);
            closeAllPopups();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }
     
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleMenuClick() {
        setIsMenuOpen(true);
    }

    function handleClosePopupKeyDown(evt) {
        if(evt.key === "Escape") {
            closeAllPopups();
        }
    }

    function handleClosePopupOverlayClick(evt) {
        if(evt.target.classList.contains("popup")) {
            closeAllPopups();
        }
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsDeletePopupOpen(false);
        setSelectedCard({name: "", link: ""});
        setIsMenuOpen(false);
        setInfoTooltipOpen(false);
        setMessage({ image: "", text: "" })
    }

    function handleUpdateUser(item) {
        api.updateUserData(item)
        .then(res => {
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function handleUpdateAvatar(item) {
        api.updateUserAvatar(item) 
        .then(res => {
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            authUser.getContent(jwt)
            .then((res) => {
                if (res) {
                  setLoggedIn(true);
                  history.push('/');
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, [history]);
    
    const onRegister = ({ password, email }) => {
        return authUser.register( password, email )
        .then((res) => {
            if(res) {
                setMessage({ image: imageResolve, text: "Вы успешно зарегистрировались!" });
                return res;
            } 
        })
        .catch((err) => {
            console.log(err);
            setMessage({ image: imageError, text: "Что-то пошло не так! Попробуйте ещё раз." });
        })
        .finally(() => {
            setInfoTooltipOpen(true);
        });
    }

    const onLogin = ({ password, email }) => { 
        return authUser.authorize( password, email ) 
        .then((data) => { 
            if (data.token){ 
                setLoggedIn(true); 
                localStorage.setItem('jwt', data.token); 
                history.push('/'); 
            }  
          }) 
        .catch((err) => { 
            console.log(err) 
            setMessage({ image: imageError, text: "Что-то пошло не так! Попробуйте ещё раз." }); 
            setInfoTooltipOpen(true); 
        }) 
    }

    const onSignOut = () => {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
    }

  return (
    <CurrentUserContext.Provider value = {currentUser}>
        <div className="App page">
            <Route>
                {loggedIn ? <Redirect to="/" />  &&           
                <Header 
                    title={"Выйти"} 
                    isOpen={isMenuOpen} 
                    onMenuClick={handleMenuClick}
                    onClose={closeAllPopups} 
                    onSignOut={onSignOut}
                /> 
                : <Redirect to="/signup" 
            />}

            </Route>
            <Switch>
                <ProtectedRoute 
                    exact
                    path="/"
                    loggedIn={loggedIn}
                    onEditProfile={handleEditProfileClick} 
                    onAddPlace={handleAddPlaceClick}  
                    onEditAvatar={handleEditAvatarClick} 
                    onCardClick={handleCardClick} 
                    onCardLike={handleCardLike} 
                    onCardDelite={handleDeleteCardClick}
                    onCards={cards}
                    component={Main} 
                />     

                <Route exact path="/signup">
                    <Header />
                    <Register onRegister={onRegister} />
                </Route>

                <Route exact path="/signin">
                    <Header />
                    <Login onLogin={onLogin} />
                </Route>

            </Switch>

            <InfoTooltip 
                isOpen={isInfoTooltipOpen}
                onClose={closeAllPopups}
                message={message}
                onCloseKeyDown={handleClosePopupKeyDown}
                onCloseOverlayClick={handleClosePopupOverlayClick}
            />

            <Footer />

            <EditProfilePopup 
                isOpen={isEditProfilePopupOpen} 
                onClose={closeAllPopups} 
                onUpdateUser={handleUpdateUser}
                onCloseKeyDown={handleClosePopupKeyDown}
                onCloseOverlayClick={handleClosePopupOverlayClick}
            />

            <EditAvatarPopup 
                isOpen={isEditAvatarPopupOpen} 
                onClose={closeAllPopups} 
                onUpdateAvatar={handleUpdateAvatar}
                onCloseKeyDown={handleClosePopupKeyDown}
                onCloseOverlayClick={handleClosePopupOverlayClick}
            />

            <AddPlacePopup 
                isOpen={isAddPlacePopupOpen} 
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
                onCloseKeyDown={handleClosePopupKeyDown}
                onCloseOverlayClick={handleClosePopupOverlayClick}
            />

            <ImagePopup 
                card={selectedCard} 
                onClose={closeAllPopups} 
                onCloseKeyDown={handleClosePopupKeyDown}
                onCloseOverlayClick={handleClosePopupOverlayClick}
            />         

            <PopupWithForm 
                name="delete-image" 
                title="Вы уверены?" 
                buttonText="Да" 
                isOpen={isDeletePopupOpen}
                onClose={closeAllPopups}
                onCloseKeyDown={handleClosePopupKeyDown}
                onCloseOverlayClick={handleClosePopupOverlayClick}
                onSubmit={handleCardDelete}
            />
        </div>
    </CurrentUserContext.Provider> 
  );
}

export default App;

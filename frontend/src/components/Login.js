import {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const resetForm = () => {
        setEmail("");
        setPassword("");
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        onLogin({ password, email })
          .then(resetForm)
          .catch((err) => {
              console.log(err);
          });
    }

    useEffect(() => {
        if (localStorage.getItem('jwt')) {
          history.push('/');
        }
    }, [history]);

    function handlePasswordAdd(evt) {
        setPassword(evt.target.value);
    }

    function handleEmailAdd(evt) {
        setEmail(evt.target.value);
    }

    return (
        <div className="login-page">
            <h1 className="login-page__title">Вход</h1>
            <form className="login-page__form" onSubmit={handleSubmit}>
                <input 
                    className="login-page__input form__login-input_email" 
                    type="email" 
                    placeholder="Email"
                    name="email"
                    required
                    value={email}
                    onChange={handleEmailAdd}
                />

                <input 
                    className="login-page__input form__login-input_password"
                    type="password"
                    placeholder="Пароль"
                    name="password"
                    required
                    value={password}
                    onChange={handlePasswordAdd}
                />
                <button className="login-page__save-button">Войти</button>
            </form>
        </div>
    )
}

export default Login;
export const BASE_URL = "https://api.last.nomoredomains.work";

export const register = (password, email) => { 
  return fetch(`${BASE_URL}/signup`, { 
    method: 'POST', 
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json' 
    }, 
    credentials: 'include', 
    body: JSON.stringify({password, email}) 
  }) 
  .then((res) => { 
    if (res.ok) { 
      return res.json(); 
    } 
    return Promise.reject(`Ошибка: ${res.status}`); 
  }) 
  .then((res) => { 
    return res; 
  }); 

} 

export const authorize = (password, email) => { 
  return fetch(`${BASE_URL}/signin`, { 
    method: 'POST', 
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
    }, 
    credentials: 'include', 
    body: JSON.stringify({password, email}) 
  }) 

  .then((res) => { 
    if (res.ok) { 
      return res.json(); 
    } 
    return Promise.reject(`Ошибка: ${res.status}`); 
  }); 

} 

export const getContent = (token) => { 
  return fetch(`${BASE_URL}/users/me`, { 
    method: 'GET', 
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`, 
    },
    credentials: 'include', 
  }) 
  .then((res) => { 
    if (res.ok) { 
      return res.json(); 
    } 
    return Promise.reject(`Ошибка: ${res.status}`); 
  }) 
  .then(data => data); 
} 
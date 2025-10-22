import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import s from './style.module.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const nav = useNavigate();
    const submit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });
        const j = await res.json();
        if (j.success) nav('/dashboard');
        else setMsg(j.error || 'Error');
    };
    return (
        <form className={s.container} onSubmit={submit}>
            <h2>Login</h2>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"/>
            <button>Login</button>
            <div>{msg}</div>
        </form>
    );
}

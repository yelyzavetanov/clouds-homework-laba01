import React, {useState} from 'react';
import s from './style.module.css'

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    const submit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:4000/api/register', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, name})
        });
        const j = await res.json();
        setMsg(j.error || 'Registered');
    };

    return (
        <form onSubmit={submit} className={s.container}>
            <h2>Register</h2>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"/>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"/>
            <button>Register</button>
            <div>{msg}</div>
        </form>
    );
}

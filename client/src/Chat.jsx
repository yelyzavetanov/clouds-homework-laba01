import React, {useState, useEffect, useRef}  from 'react';
import s from './style.module.css';
import {useNavigate} from "react-router-dom";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const [user, setUser] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:4000/api/profile', {
                credentials: 'include'
            });
            if (res.status === 401) {
                nav('/login');
                return;
            }
            const j = await res.json();
            setUser(j.user);
        })();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, {id: Date.now(), text: input}]);
        setInput('');
    };

    const handleSendXSS = () => {
        const xssPayload = `<img src=x onerror="alert('XSS!')">`;
        setMessages(prev => [...prev, {id: Date.now(), text: xssPayload}]);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className={s.container}>
            <h2>Chat (with someone)</h2>
            <div className={s.chatContainer}>

                <div className={s.messages}>
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={s.message}
                            dangerouslySetInnerHTML={{__html: msg.text}}
                        />
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
                <div className={s.messageInput}>
                    <input
                        type="text"
                        value={input}
                        placeholder="Type your message..."
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend}>Send</button>
                    <button onClick={handleSendXSS}>Send XSS Test</button>
                </div>
            </div>
        </div>
    );
}

export default Chat;

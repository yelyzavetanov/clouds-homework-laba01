import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import s from './style.module.css'

export default function Dashboard() {
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

    async function logout() {
        await fetch('http://localhost:4000/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        nav('/login');
    }

    if (!user) return <div>Loading...</div>;
    return (
        <div className={s.container}>
            <h2>Dashboard</h2>
            <p>Ласкаво просимо, {user.name || user.email}</p>
            <h3>Documentation:</h3>
            <p className={s.textContainer}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quis leo rutrum, hendrerit metus eget,
                consectetur nunc. Morbi a mauris tortor. Aliquam molestie, neque quis ullamcorper lacinia, dolor enim
                finibus purus, facilisis blandit urna nulla id velit. Integer enim est, euismod at erat in, commodo
                bibendum dolor. Donec tempus aliquet dolor et mattis. Integer egestas dolor in quam egestas, eget
                convallis odio varius. Pellentesque luctus sem id blandit euismod. Donec sit amet urna lacinia, mattis
                ipsum at, ornare magna. Nunc congue egestas lectus, et fermentum dolor sodales sit amet. Class aptent
                taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                <br/><br/>
                Cras et dui aliquam, aliquet sem sed, mattis magna. In tempus lobortis augue quis maximus. Cras ipsum
                elit, pulvinar at elementum at, consequat non augue. Integer quis rhoncus sapien. Vivamus efficitur arcu
                a sem posuere posuere. Aenean suscipit malesuada turpis non condimentum. Nullam ut nisl leo. Suspendisse
                posuere lorem vel erat accumsan, vitae mollis augue sodales. Sed porta ipsum et malesuada lacinia. Sed
                ante tortor, scelerisque eu odio eu, auctor pulvinar felis. Cras sed nulla quis dui imperdiet fermentum
                id id leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                Nulla nec sem fermentum, pharetra purus a, pulvinar est. Integer tempus ipsum et enim vehicula, non
                volutpat tellus suscipit. Sed non elementum mi. Nullam laoreet, eros id placerat tempus, odio diam
                vehicula ante, et fermentum elit magna blandit sapien.
                <br/><br/>

                Cras venenatis sodales nulla in egestas. Suspendisse tincidunt, purus a condimentum fermentum, purus
                libero dictum leo, eu lobortis massa quam sit amet tortor. Fusce sollicitudin erat eu nibh tristique,
                vitae feugiat erat malesuada. Praesent sed est facilisis elit tempor tempus eu auctor augue. Proin
                euismod vitae magna sit amet placerat. Ut ultricies dolor non orci luctus, eu porta dui dapibus. Aenean
                ac iaculis tellus, in porta dui. Aliquam ante quam, euismod ut suscipit eu, aliquet at odio. Vestibulum
                id nibh nisi.
                <br/><br/>

                Sed gravida arcu at elit finibus ornare. Nam hendrerit blandit nulla id ultrices. Duis in dictum velit.
                Integer faucibus euismod velit, sed laoreet dui tincidunt vitae. Duis libero urna, ullamcorper id
                rhoncus ac, cursus sed sapien. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Phasellus pulvinar lacinia nisi ac mollis.
            </p>
            <button onClick={logout}>Вийти</button>
        </div>
    );
}

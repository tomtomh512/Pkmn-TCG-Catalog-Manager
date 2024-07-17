import React from 'react';

export default function Card(props) {
    const {id, image, name, set, onClick} = props

    return (
        <div key={id} onClick={onClick}>
            <img src={image} alt={id}/>
            <br/>
            <section>
                <span> Name: </span> {name} <br/>
                <span> Set: </span> {set}
            </section>
        </div>
    )
}
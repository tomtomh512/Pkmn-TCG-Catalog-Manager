import React, { useState } from 'react'
import '../styles/SearchBox.css';

export default function Searchbox(props) {
    const {onSearch, loginInfo, modeChange} = props
    const [userInput, setUserInput] = useState({
        cardName: "",
        setName: "",
        artist: "",
        releaseDate: ""
    })
    const [mode, setMode] = useState('catalog')

    function handleChange(event) {
        const { name, value } = event.target;

        setUserInput(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleModeChange = (event) => {
        const { value } = event.target;
        if (value === 'collection' && !loginInfo.isLoggedIn) {
            alert('Please log in to access your collection.')
        } else {
            setMode(value)
            modeChange(value)
            setUserInput({
                cardName: "",
                setName: "",
                artist: "",
                releaseDate: ""
            })
        }
    }

    const handleClick = () => onSearch(userInput)

    return (
        <main className="search-box">

            <select
                value={mode}
                id="select-mode"
                onChange={handleModeChange}
            >
                <option value="catalog">Search Catalog</option>
                <option value="collection">Search Collection</option>
            </select>

            <section>
                <div>
                    <label> Card Name </label> <br/>
                    <input
                        type="text"
                        name="cardName"
                        placeholder="Ex: Charizard"
                        value={userInput.cardName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label> Artist </label> <br/>
                    <input
                        type="text"
                        name="artist"
                        placeholder="Ex: Ken Sugimori"
                        value={userInput.artist}
                        onChange={handleChange}
                    />
                </div>
            </section>
            <section>
                <div>
                    <label> Set Name </label> <br/>
                    <input
                        type="text"
                        name="setName"
                        placeholder="Ex: Base"
                        value={userInput.setName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label> Release Date </label> <br/>
                    <input
                        type="text"
                        name="releaseDate"
                        placeholder="Ex: 1999/01/09"
                        value={userInput.releaseDate}
                        onChange={handleChange}
                    />
                </div>
            </section>

            <br/>

            <input
                type="button"
                value="Search"
                onClick={handleClick}
                className="search-button"
            />

        </main>
    )
}
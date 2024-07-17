import React, {useEffect, useState} from 'react'
import '../styles/Featurebox.css';

export default function Featurebox(props) {
    const {featureInfo, mode, loginInfo, onCollectionChange} = props

    const [showCheck, setShowCheck] = useState(false)

    const convert = (usd) => (usd * 1.08).toFixed(2)

    function convertToDateFormat(datetime) {
        const [date] = datetime.split(' ')
        const [year, month, day] = date.split('-')

        return `${year}/${month}/${day}`
    }

    const addToCollection = () => {
        if (!loginInfo.isLoggedIn) {
            alert('Please log in to access your collection.')
        } else {
            fetch("/add_pkmn", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    card_id: featureInfo.feature.id,
                    user_id: loginInfo.user_id,
                    name: featureInfo.feature.name,
                    setName: featureInfo.feature.set.name,
                    artist: featureInfo.feature.artist,
                    image: featureInfo.feature.images.large,
                    releaseDate: featureInfo.feature.set.releaseDate,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    setShowCheck(true)
                })
        }
    }

    const removeFromCollection = () => {
        fetch("/remove_pkmn", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                unique_card_id: featureInfo.unique_id,
                user_id: loginInfo.user_id,
            }),
        })
            .then(res => res.json())
            .then(data => {
                onCollectionChange()
            })
    }

    // show checkmark for 1 second
    useEffect(() => {
        if (showCheck) {
            setTimeout(() => {
                setShowCheck(false);
            }, 1000)
        }
    }, [showCheck]);

    useEffect(() => {
        setShowCheck(false)
    }, [featureInfo]);

    const handleClick = () => {
        if (mode === "catalog") {
            addToCollection()
        } else {
            removeFromCollection()
        }
    }

    return (
        <main className="info-box">

            {featureInfo.unique_id !== '' ? (
                <>
                    <div className="feature-image-container">
                        {featureInfo.feature.images && featureInfo.feature.images.large ? (
                            <img src={featureInfo.feature.images.large} alt="card"/>
                        ) : ""}
                    </div>

                    <div className="feature-stats-container">
                        <h1>{featureInfo.feature.name ? featureInfo.feature.name : `Name`}</h1>

                        {mode === 'collection' ? (
                            <>
                                <span> Date Added to Collection: </span>
                                {featureInfo.dateAdded ? convertToDateFormat(featureInfo.dateAdded) : `Not available`}
                                <br/>
                            </>
                        ) : (
                            ''
                        )}

                        <span> Release Date: </span>
                        {featureInfo.feature.set && featureInfo.feature.set.releaseDate ? featureInfo.feature.set.releaseDate : `Not available`}
                        <br/>

                        <span> Set: </span>
                        {featureInfo.feature.set && featureInfo.feature.set.name ? featureInfo.feature.set.name : `Not available`}
                        <br/>

                        <span> Artist: </span>
                        {featureInfo.feature.artist ? featureInfo.feature.artist : `Not available`}
                        <br/>

                        <h1> Market Stats </h1>

                        <span> Trend Price: </span>
                        {featureInfo.feature.cardmarket && featureInfo.feature.cardmarket.prices && featureInfo.feature.cardmarket.prices.trendPrice ?
                            `$${convert(featureInfo.feature.cardmarket.prices.trendPrice)}` : `Not available`
                        }
                        <br/>

                        <span> Average Price: </span>
                        {featureInfo.feature.cardmarket && featureInfo.feature.cardmarket.prices && featureInfo.feature.cardmarket.prices.averageSellPrice ?
                            `$${convert(featureInfo.feature.cardmarket.prices.averageSellPrice)}` : `Not available`
                        }
                        <br/>

                        <span> Average in past 7 days: </span>
                        {featureInfo.feature.cardmarket && featureInfo.feature.cardmarket.prices && featureInfo.feature.cardmarket.prices.avg7 ?
                            `$${convert(featureInfo.feature.cardmarket.prices.avg7)}` : `Not available`
                        }
                        <br/>

                        <span> Average in past 30 days: </span>
                        {featureInfo.feature.cardmarket && featureInfo.feature.cardmarket.prices && featureInfo.feature.cardmarket.prices.avg30 ?
                            `$${convert(featureInfo.feature.cardmarket.prices.avg30)}` : `Not available`
                        }

                        <br/>

                        <input
                            type="button"
                            value={mode === 'catalog' ? "Add to Collection" : "Remove from Collection"}
                            className="add-button"
                            onClick={handleClick}
                        />

                        {showCheck ? " ✔" : ""}

                    </div>
                </>
            ) : (
                <>
                    {mode === 'catalog' ?
                        <p> Loading... </p> :
                        <p> Add cards to your collection from the catalog </p>
                    }
                </>
            )}
        </main>
    );
}
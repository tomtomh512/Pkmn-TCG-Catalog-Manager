import React, {useState, useEffect, useRef} from 'react'
import Card from './Card';
import '../styles/Listings.css';

export default function Collection(props) {
    const firstRender = useRef(true);           // feature the first card only regardless of render changes
    const {searchData, sendFeature, loginInfo, collectionRefresh} = props;

    const [loading, setLoading] = useState(true)
    const [featureInfo, setFeatureInfo] = useState({
        feature: {},
        unique_id: '',
        dateAdded: '',
    })
    const [listData, setListData] = useState({
        listings: [],
        sortMethod: '',
        pageNumber: 1,
        totalCount: 0,
    })

    // sets feature pokemon
    useEffect(() => {
        sendFeature(featureInfo);
    }, [featureInfo, sendFeature])

    // resets first render after deleting card
    useEffect(() => {
        firstRender.current = true;
    }, [collectionRefresh])

    const listDataElements = listData.listings.map((pokemon) => (
        <Card
            key={pokemon.id}
            id={pokemon.card_id}
            image={pokemon.image}
            name={pokemon.name}
            set={pokemon.setName}
            onClick={() => {
                fetch('https://api.pokemontcg.io/v2/cards/' + pokemon.card_id)
                    .then(res => res.json())
                    .then(output => {
                        setFeatureInfo({
                            feature: output.data,
                            unique_id: pokemon.id,
                            dateAdded: pokemon.dateAdded,
                        });
                    });

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        />
    ));

    useEffect(() => {
        setLoading(true)

        const queryParams = new URLSearchParams({
            user_id: loginInfo.user_id,
            cardName: searchData.cardName || '',
            setName: searchData.setName || '',
            artist: searchData.artist || '',
            releaseDate: searchData.releaseDate || '',
            sortMethod: listData.sortMethod || '',
            pageNumber: listData.pageNumber || '',
        }).toString();

        fetch(`/get_pkmn?${queryParams}`)
            .then(res => res.json())
            .then(output => {
                setLoading(false)
                setListData(prevState => ({
                    ...prevState,
                    listings: output.cards,
                    totalCount: output.totalCount,
                }))

                if (firstRender.current) {
                    // if no cards after removing
                    if (output.cards.length > 0) {
                        fetch('https://api.pokemontcg.io/v2/cards/' + output.cards[0].card_id)
                            .then(res => res.json())
                            .then(featureOutput => {
                                setFeatureInfo({
                                    feature: featureOutput.data,
                                    unique_id: output.cards[0].id,
                                    dateAdded: output.cards[0].dateAdded,
                                });
                            });
                    } else {
                        setFeatureInfo({
                            feature: {},
                            unique_id: '',
                            dateAdded: '',
                        });
                    }
                    firstRender.current = false;
                }
            })

    }, [searchData, listData.sortMethod, loginInfo.user_id, collectionRefresh, listData.pageNumber]);

    // bring page number back to 1 after new search or sort
    useEffect(() => {
        setListData(prevState => ({
            ...prevState,
            pageNumber: 1
        }));
    }, [searchData, listData.sortMethod])

    const handleSelectSort = (event) => {
        const { value } = event.target;
        setListData(prevState => ({
            ...prevState,
            sortMethod: value
        }))
    }

    const nextPage = () => {
        if (listData.pageNumber * 25 < listData.totalCount) {
            setListData(prevState => ({
                ...prevState,
                pageNumber: prevState.pageNumber + 1,
            }))
        }
    }

    const previousPage = () => {
        if (listData.pageNumber > 1) {
            setListData(prevState => ({
                ...prevState,
                pageNumber: prevState.pageNumber - 1
            }))
        }
    }

    return (
        <main className="main-listing-container" id="main-collection-container">
            <div className="list-head">

                <div className="left-head">
                    Page {listData.pageNumber} | Select a card for more details
                </div>

                <div className="right-head">
                    <input
                        type="button"
                        value="Previous Page"
                        className="list-inputs"
                        onClick={previousPage}
                    />
                    <input
                        type="button"
                        value="Next Page"
                        className="list-inputs"
                        onClick={nextPage}
                    />
                    <select value={listData.sortMethod} onChange={handleSelectSort} className="select-sort">
                        <option value="">Sort</option>
                        <option value="↑ Name">↑ Name</option>
                        <option value="↓ Name">↓ Name</option>
                        <option value="↑ Date Added">↑ Date Added</option>
                        <option value="↓ Date Added">↓ Date Added</option>
                        <option value="Oldest">Oldest</option>
                        <option value="Newest">Newest</option>
                    </select>
                </div>
            </div>

            <div className="listing-container">
                {!loading ? (
                    listDataElements.length > 0 ? listDataElements : <p> Add cards to your collection from the catalog </p>
                ) : (
                    <p> Loading... </p>
                )}
            </div>

            <div className="page-selector">
                <input
                    type="button"
                    value="Previous Page"
                    className="list-inputs"
                    onClick={previousPage}
                />
                <input
                    type="button"
                    value="Next Page"
                    className="list-inputs"
                    onClick={nextPage}
                />
            </div>
        </main>
    )
}
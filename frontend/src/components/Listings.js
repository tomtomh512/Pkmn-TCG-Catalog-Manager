import React,  {useState, useEffect, useRef} from 'react'
import Card from './Card';
import '../styles/Listings.css';

export default function Listings(props) {
    const firstRender = useRef(true);                   // feature the first card only regardless of render changes
    const {searchData, sendFeature} = props;

    const [loading, setLoading] = useState(true)
    const [featureInfo, setFeatureInfo] = useState({
        feature: {},
        unique_id: '',
    })
    const [listData, setListData] = useState({
        listings: [],
        sortMethod: '',
        pageNumber: 1,
        totalCount: 0
    })

    const listDataElements = listData.listings.map((pokemon) => (
        <Card
            key={pokemon.id}
            id={pokemon.id}
            image={pokemon.images.large}
            name={pokemon.name}
            set={pokemon.set.name}
            onClick={() => {
                setFeatureInfo({
                    feature: pokemon,
                    unique_id: 'collection',
                    dateAdded: '',
                })
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        />
    ));

    // sends feature Pokemon
    useEffect(() => {
        sendFeature(featureInfo);
    }, [featureInfo, sendFeature])

    useEffect(() => {
        setLoading(true)

        let url = 'https://api.pokemontcg.io/v2/cards';
        let attributes = []

        if (searchData.cardName) {attributes.push(`name:"${searchData.cardName}"`)}
        if (searchData.setName) {attributes.push(`set.name:"${searchData.setName}"`)}
        if (searchData.artist) {attributes.push(`artist:"${searchData.artist}"`)}
        if (searchData.releaseDate) {attributes.push(`set.releaseDate:"${searchData.releaseDate}"`)}

        let query = "";
        if (attributes.length > 0) {
            query = "?q=";

            for (let i = 0; i < attributes.length; i++) {
                query += attributes[i];
                if (i < attributes.length - 1) {
                    query += " ";
                }
            }

            query += "&pageSize=25";

        } else {
            query = "?pageSize=25";
        }

        url = url + query;

        const orderMap = {
            "": "",
            "↑ Name": "&orderBy=name",
            "↓ Name": "&orderBy=-name",
            "↑ Price": "&orderBy=cardmarket.prices.averageSellPrice",
            "↓ Price": "&orderBy=-cardmarket.prices.averageSellPrice",
            "Oldest": "&orderBy=set.releaseDate",
            "Newest": "&orderBy=-set.releaseDate",
        }

        url = url + orderMap[listData.sortMethod]
        url = url + "&page=" + listData.pageNumber

        fetch(url)
            .then(res => res.json())
            .then(output => {
                setLoading(false)
                setListData(prevState => ({
                    ...prevState,
                    listings: output.data,
                    totalCount: output.totalCount,
                }))
                if (firstRender.current) {
                    setFeatureInfo({
                        feature: output.data[0],
                        unique_id: 'collection',
                        dateAdded: '',
                    });
                    firstRender.current = false;
                }
            });

    }, [searchData, listData.sortMethod, listData.pageNumber]);

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
        <main className="main-listing-container" id="main-listing-container">
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
                        <option value="↑ Price">↑ Price</option>
                        <option value="↓ Price">↓ Price</option>
                        <option value="Oldest">Oldest</option>
                        <option value="Newest">Newest</option>
                    </select>
                </div>
            </div>

            <div className="listing-container">
                {!loading ? listDataElements : <p> Loading... </p>}
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
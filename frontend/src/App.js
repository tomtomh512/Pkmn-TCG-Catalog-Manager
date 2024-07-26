import React, {useState} from 'react'
import Navbar from './components/Navbar'
import Searchbox from "./components/Searchbox"
import Featurebox from "./components/Featurebox"
import Listings from "./components/Listings"
import Collection from "./components/Collection"
import LoginScreen from "./components/LoginScreen";
import Footer from "./components/Footer";

export default function App() {
    const [userInput, setUserInput] = useState({
        cardName: "",
        setName: "",
        artist: "",
        releaseDate: ""
    })

    const [loginState, setLoginState] = useState({
        isLoggingIn: false,
        isLoggedIn: false,
        username: "",
        user_id: "",
    })

    const [mode, setMode] = useState("catalog")

    const [featureInfo, setFeatureInfo] = useState({
        feature: {},
        unique_id: '',
        dateAdded: '',
    })

    const [collectionRefresh, setCollectionRefresh] = useState(false)

    const handleSearch = (data) => setUserInput(data)
    const handleSendFeature = (data) => setFeatureInfo(data)
    const handleModeChange = (data) => {
        setMode(data)
        setUserInput({
            cardName: "",
            setName: "",
            artist: "",
            releaseDate: ""
        })
    }

    const openLogInScreen = () => {
        setLoginState(prevState => ({
            ...prevState,
            isLoggingIn: true
        }))
    }

    const closeLogInScreen = () => {
        setLoginState(prevState => ({
            ...prevState,
            isLoggingIn: false
        }))
    }

    const getLogInInfo = (username, user_id) => {
        setLoginState(prevState => ({
            ...prevState,
            isLoggedIn: true,
            username: username,
            user_id: user_id
        }))
    }

    const handleCollectionRefresh = () => {
        setCollectionRefresh(prevState => !prevState)
    }

  return (
    <div>
        {loginState.isLoggingIn ?
            <LoginScreen
                closeLogIn={closeLogInScreen}
                handleLogIn={getLogInInfo}
            /> : ''
        }

        <Navbar
            openLogin={openLogInScreen}
            loginInfo={loginState}
        />
        <section className="main-split">
            <Featurebox
                featureInfo={featureInfo}
                loginInfo={loginState}
                mode={mode}
                onCollectionChange={handleCollectionRefresh}
            />
            <Searchbox
                onSearch={handleSearch}
                loginInfo={loginState}
                modeChange={handleModeChange}
            />
        </section>

        {mode === 'catalog' ? (
            <Listings
                searchData={userInput}
                sendFeature={handleSendFeature}
            />
        ) : (
            <Collection
                searchData={userInput}
                sendFeature={handleSendFeature}
                loginInfo={loginState}
                collectionRefresh={collectionRefresh}
            />
        )}
        <Footer />
    </div>
  );
}

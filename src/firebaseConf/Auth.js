import React, {useEffect,useState, useCallback} from "react" ;
import fire, { db } from "./Firebase";  
import CircularProgress from '@material-ui/core/CircularProgress';

//contest jest narzędziem który umożliwia 
//propagacje danych po wszystkich komponentach
export const AuthContext  = React.createContext();
//zawiera informacje o tym czy użytkownik jest zalogowany 
//czy nie i aktualizuje komponent
const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isPendingAuth, setIsPendingAuth] = useState(true);
    const [isPendingSigning, setIsPendingSigning] = useState(false);

    const updateExtraData = useCallback((newUserData = {}) => {
        setCurrentUser({
            ...currentUser,
            extraData: {
                ...currentUser.extraData,
                ...newUserData
            }
        });
    }, [currentUser]);


    const addBook = useCallback((newBook) => {
        setCurrentUser({
            ...currentUser,
            extraData: {
                ...currentUser.extraData,
                books: currentUser.extraData.books.concat([newBook])
            }
        });
    }, [currentUser]);
    
    const setBooks = useCallback((books) => {
        setCurrentUser({
            ...currentUser,
            extraData: {
                ...currentUser.extraData,
                books,
            }
        });
    }, [currentUser]);

    const logout = useCallback(async () => {
        try {
            await fire.auth().signOut();
            setCurrentUser(null);
            console.log("Poprawne wylogowanie sie");
        } catch (error) {
            console.log("Błąd przy wylogowywaniu sie");
        }
    }, []);

    useEffect(()=> { 
        fire.auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log('currentUser auth', user)
                setCurrentUser({
                    ...user,
                    extraData: {
                        books: []
                    },
                });
            } else {
                console.log('Brak aktywnej sesji')
                setCurrentUser(null);
                setIsPendingAuth(false);
            }
        });
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.uid && (isPendingAuth || isPendingSigning)) {
            const userRef = db.ref(`users/${currentUser.uid}`);
            const booksRef = db.ref(`books/${currentUser.uid}`);

            Promise.all([userRef.once('value'), booksRef.once('value')]).then(([userSnapshot, booksSnapshot]) => {
                const booksValue = booksSnapshot.val() || {};
                const books = Object.keys(booksValue).map((dbKey) => ({
                    ...booksValue[dbKey] || {},
                    dbKey,
                }));
                updateExtraData({ ...(userSnapshot.val() || {}), books });
                setIsPendingAuth(false);
                setIsPendingSigning(false);
            });
        }
    }, [currentUser, updateExtraData]);

    const renderLoader = () => (  
        
        <div  style={{display: "flex",justifyContent: "center",alignItems:"center"}}>
            <CircularProgress />
            
            <h2><b>Ładowanie</b></h2>
        </div> 
    )

    return (
        <AuthContext.Provider value={{ setIsPendingSigning, setCurrentUser, currentUser, updateExtraData, addBook, logout, setBooks }}>
            {!isPendingAuth && !isPendingSigning ? children : renderLoader()}
        </AuthContext.Provider>
    );
} 

export default AuthProvider;
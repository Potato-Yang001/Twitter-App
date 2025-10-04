import { useContext } from "react"
import { Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
// import useLocalStorage from "use-local-storage"
import ProfileSideBar from "../components/ProfileSideBar"
import ProfileMidBody from "../components/ProfileMidBody"
import { AuthContext } from "../components/AuthProvider"
import { getAuth } from "firebase/auth";

export default function ProfilePage() {
    // const [authToken, setAuthToken] = useLocalStorage("authToken", "")
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext);
    const auth = getAuth();
    if (!currentUser) {
        navigate("/login");
    }
    /*useEffect(() => {
        if (!authToken) {
            navigate("/login")
        }
    }, [authToken, navigate]) */

    const handleLogout = () => {
        // setAuthToken("")
        auth.signOut()
    }

    return (
        <>
            <Container>
                <Row>
                    <ProfileSideBar handleLogout={handleLogout} />
                    <ProfileMidBody />
                </Row>
            </Container>
        </>
    )
}
import { useState, useContext } from "react"
import { Row, Col, Image, Button, Modal, ModalBody, Form } from "react-bootstrap"
// import axios from "axios"
// import useLocalStorage from "use-local-storage"
import { useNavigate } from "react-router-dom"
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { AuthContext } from "../components/AuthProvider"

export default function AuthPage() {
    const loginImage = "https://sig1.co/img-twitter-1"   /*link for the image*/
    // ori link: https://sig1.co/img-twitter-1
    //const url = "https://9ffdc9dd-0de8-4346-aa1e-490d67695c6d-00-1rt82syjpqq8r.sisko.replit.dev:3000"
    const [modalShow, setModalShow] = useState(null)
    const handleShowSignUp = () => setModalShow("SignUp")
    const handleShowLogin = () => setModalShow("Login")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    //const [authToken, setAuthToken] = useLocalStorage("authToken", "")
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext)
    const navigate = useNavigate()

    /*useEffect(() => {
        if (authToken) {
            navigate("/profile")
        }
    }, [authToken, navigate])*/

    if (currentUser) navigate("/profile");

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                username,
                password
            )
            console.log(res.user)
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password)
        } catch (error) {
            console.error(error)
        }
    }

    const provider = new GoogleAuthProvider()
    const handleGoogleLogin = async (e) => {
        e.preventDefault()
        try {
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error(error)
        }
    }

    const handleClose = () => setModalShow(null)

    return (
        <Row>
            <Col sm={5}>
                <Image src={loginImage} fluid /> {/*the size of image which when my pages small the image will not overlap with the word. The image will follow the pages to adjust*/}
            </Col>
            <Col sm={7} className="p-4">
                <i className="bi bi-twitter" style={{ fontSize: 50, color: "dodgerblue" }}></i>

                <p className="mt-5" style={{ fontSize: 64 }}>Twilly Twi Twitter</p>
                <h2 className="my-5" style={{ fontSize: 31 }}>Join Twitter</h2>

                <Col sm={5} className="d-grid gap-2">
                    <Button className="rounded-pill" variant="outline-dark" onClick={handleGoogleLogin}>
                        <i className="bi bi-google"></i> Sign up with Google
                    </Button>
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-apple"></i> Sign up with Apple
                    </Button>
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-facebook"></i> Sign up with Facebook
                    </Button>
                    <p style={{ textAlign: "center" }}> or </p>
                    <Button className="rounded-pill" onClick={handleShowSignUp}>Create an account</Button>
                    <p style={{ fontSize: '12px' }}>
                        By signing up, you agree to the Terms of Services and Privacy Policy including Cookie Use
                    </p>

                    <p className="mt-5" style={{ fontWeight: "bold" }}>
                        Already have an account
                    </p>
                    <Button className="rounded-pill" variant="outline-primary" onClick={handleShowLogin}>Sign In</Button>
                </Col>
                <Modal show={modalShow !== null} onHide={handleClose} animation={false} centered>
                    <Modal.Body>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            {modalShow === "SignUp" ? "Create your account" : "Log in your account"}
                        </h2>
                        <Form className="d-grid gap-2 px-5" onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="email"
                                    placeholder="Please enter your email"></Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Please enter password"></Form.Control>
                            </Form.Group>
                            <p style={{ fontSize: '12px' }}>
                                By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. SigmaTweets may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account seceure and personalising our services, including ads. Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.
                            </p>
                            <Button className="rounded-pill" type="submit">
                                {modalShow === "SignUp" ? "Sign up" : "Log in"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>
        </Row>
    )
}
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";

export default function ProfilePostCard({ content, postId }) {
    const [likes, setLikes] = useState([])

    //Decode to get userId
    const token = localStorage.getItem("authToken")
    const decode = jwtDecode(token)
    const userId = decode.id

    const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";
    const BASE_URL = 'https://15a0e20f-89bb-4a0a-b88b-c1d90060eb7e-00-2bmtdh16rshw6.sisko.replit.dev'

    useEffect(() => {

        fetch(`${BASE_URL}/likes/post/${postId}`)
            .then((response) => response.json())
            .then((data) => setLikes(data))
            .catch((error) => console.error("Error:", error))
    }, [postId])

    const isLiked = likes.some((like) => like.user_id === userId)

    const handleLike = () => (isLiked ? removeFromLikes() : addToLikes())


    const addToLikes = () => {
        axios.post(`${BASE_URL}/likes`, {
            user_id: userId,
            post_id: postId,
        })

            .then((response) => {
                setLikes([...likes, { ...response.data, likes_id: response.data.id }])
            })

            .catch((error) => console.error("Error", error))
    }

    const removeFromLikes = () => {
        const like = likes.find((like) => like.user_id === userId)

        if (like) {
            axios
                .put(`${BASE_URL}/likes/${userId}/${postId}`)
                .then(() => {
                    setLikes(likes.filter((likeItem) => likeItem.user_id !== userId))
                })
                .catch((error) => console.error("Error:", error))
        }
    }

    return (
        <Row
            className="p-3"
            style={{
                borderTop: "1px solid #D3D3D3",
                borderBottom: "1px solid #D3D3D3"
            }}
        >
            <Col sm={1}>
                <Image src={pic} fluid roundedCircle />
            </Col>

            <Col>
                <strong>Carolina</strong>
                <span> @carolina.bla · Apr 16</span>
                <p> {content}</p>
                <div className="d-flex justify-content-between">
                    <Button variant="light">
                        <i className="bi bi-chat"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    <Button variant="light" onClick={handleLike}>
                        {isLiked ? (
                            <i className="bi bi-heart-fill text-danger"></i>
                        ) : (
                            <i className="bi bi-heart"></i>
                        )}
                        {likes.length}
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-graph-up"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-upload"></i>
                    </Button>
                </div>
            </Col>
        </Row>
    )
}
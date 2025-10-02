import { useState, useContext } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { likePost, removeLikeFromPost } from "../features/posts/postsSlice"
import { AuthContext } from "./AuthProvider";
// import { jwtDecode } from "jwt-decode";
import UpdatePostModal from "./UpdatePostModel";

export default function ProfilePostCard({ post }) {

    const { content, id: postId, imageUrl } = post
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [likes, setLikes] = useState(post.likes || [])
    const dispatch = useDispatch()
    const { currentUser } = useContext(AuthContext)
    const userId = currentUser.uid

    const isLiked = likes.includes(userId)



    // //Decoding to get the userId
    // const token = localStorage.getItem("authToken")
    // const decode = jwtDecode(token)
    // const userId = decode.id

    const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

    // useEffect(() => {

    //     fetch(`https://15a0e20f-89bb-4a0a-b88b-c1d90060eb7e-00-2bmtdh16rshw6.sisko.replit.dev/likes/post/${postId}`)
    //         .then((response) => response.json())
    //         .then((data) => setLikes(data.length))
    //         .catch((error) => console.error("Error:", error))
    // }, [postId])

    const handleShowUpdateModal = () => setShowUpdateModal(true)
    const handleCloseUpdateModal = () => setShowUpdateModal(false)

    const handleLike = () => (isLiked ? removeFromLikes() : addToLikes())

    const addToLikes = () => {
        setLikes([...likes, userId])
        dispatch(likePost({ userId, postId }))
    }

    const removeFromLikes = () => {
        setLikes(likes.filter((id) => id !== userId))
        dispatch(removeLikeFromPost({ userId, postId }))
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
                <Image src={imageUrl} style={{ width: 150 }} />
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
                    <Button variant="light">
                        <i className="bi bi-pencil-square"
                            onClick={handleShowUpdateModal}></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-trash"></i>
                    </Button>
                    <UpdatePostModal show={showUpdateModal}
                        handleClose={handleCloseUpdateModal}
                        postId={postId}
                        originalPostContent={content} />
                </div>
            </Col>
        </Row>
    )
}
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import io from 'socket.io-client';

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const [socket_, setsocket_] = useState(null);

	useEffect(() => {
		const socket = io('http://localhost:5000', {
			extraHeaders: {
				Authorization: localStorage.getItem('user-threads'),
			},
		});
		setsocket_(socket)


		socket.on('connect', () => {
			console.log('Socket connected');
		});


		socket.on('receiveNotification', (data) => {
			console.log('Received notification from server:', data);
			// Handle the notification (e.g., display a toast, update UI)
		});


		return () => {
			socket.disconnect(); // Cleanup on component unmount
		};
	}, []);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`http://localhost:5000/api/posts/user/${username}`);
				const data = await res.json();
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

	return (
		<>
			<UserHeader user={user} />

			{!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}

			{posts.map((post) => (
				<Post key={post._id} post={post} socket={socket_} postedBy={post.postedBy} />
			))}
		</>
	);
};

export default UserPage;

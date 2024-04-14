import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import io from 'socket.io-client';
const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const [socket_, setsocket_] = useState(null);

	const showToast = useShowToast();
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
			console.log('Home:', data);
			// Handle the notification (e.g., display a toast, update UI)
		});


		return () => {
			socket.disconnect(); // Cleanup on component unmount
		};
	}, []);
	
	useEffect(() => {

		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("http://localhost:5000/api/posts/feed", {
					method: "GET",
					headers: {
						"authorization": localStorage.getItem('token')
					},
				});
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Flex gap='10' alignItems={"flex-start"}>
			<Box flex={70}>
				{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

				{loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}

				{posts?.map((post) => (
					<Post key={post._id} post={post} socket={socket_} postedBy={post.postedBy} />
				))}
			</Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;

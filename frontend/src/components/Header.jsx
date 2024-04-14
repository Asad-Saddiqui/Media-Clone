import { Button, Flex, Badge, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, json } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { FaBell } from 'react-icons/fa'; // for Font Awesome bell icon, for instance
import { useEffect } from "react";
import { useMyContext } from '../notificatioContext/NotificationContext';

const Header = () => {
	const { datalength, setDatalength } = useMyContext();
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	let noti = localStorage.getItem('notifi')
	let data = 0;
	if (noti) {
		data = JSON.parse(localStorage.getItem('notifi'));
	}
	console.log({ mydata: data })
	useEffect(() => {

	}, [])

	return (
		<Flex justifyContent={"space-between"} mt={6} mb='12'>
			{user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

		Real Time Notification System

			{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					{/* <Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link> */}
					<Link as={RouterLink} to={`/notification`}>
						<Badge  style={{ display: 'flex', justifyContent: 'space-around' }}>
							<FaBell size={20} style={{color:`${user && datalength === 0 ? "" : "red"}`}} ></FaBell>
							{user && datalength === 0 ? "" : datalength}
						</Badge>
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

export default Header;

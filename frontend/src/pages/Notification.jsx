import React, { useEffect, useState } from 'react'
import { useMyContext } from '../notificatioContext/NotificationContext';
import io from 'socket.io-client';
import { Box, Flex, Text, Badge, Avatar } from "@chakra-ui/react";

function Notification({ user }) {
    const [socket_, setsocket_] = useState(null);

    const { datalength, notificationData } = useMyContext();
    console.log({ datalength, notificationData })

    useEffect(() => {
        const socket = io('http://localhost:5000', {
            extraHeaders: {
                Authorization: localStorage.getItem('user-threads'),
            },
        });
        setsocket_(socket)


        socket.on('connect', () => {
            console.log('Socket Notification connected');
        });
        socket.emit('updateData', user)

        socket.on('updatedData', (data) => {
            console.log('Notification', data);
            // Handle the notification (e.g., display a toast, update UI)
        });


        return () => {
            socket.disconnect(); // Cleanup on component unmount
        };
    }, []);
    console.log({ notificationData })
    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notificationData.map((notify, i) => {
                    return (
                        <Flex style={{ marginTop: '5px' }}>
                            <Avatar src={"http://localhost:5000/" + notify.img} />
                            <Box ml='3'>
                                <Text fontWeight='bold'>
                                    {notify.name}
                                    <Badge ml='1' colorScheme='green'>
                                        New
                                    </Badge>
                                </Text>
                                <div style={{ borderLeft: "2px solid gray", paddingLeft: "15px" }}>
                                    <Text style={{ fontSize: "17px" }}>{notify.action}</Text>
                                    <Text style={{ fontSize: "15px" }}>" {notify.text} "</Text>
                                </div>
                            </Box>
                        </Flex>
                    )
                })}

            </ul>

        </div>
    )
}

export default Notification
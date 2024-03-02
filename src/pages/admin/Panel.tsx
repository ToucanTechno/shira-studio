import React, {useContext, useEffect, useState} from "react";
import { AuthContext } from "../../services/AuthContext";
import axios from "axios";

interface UserInfoInterface {
    id: number;
    first_name: string;
    username: string;
    email: string;
}

const Panel = () => {
    const { authTokens, callLogout } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState<UserInfoInterface>();

    useEffect(() => {
        axios.get<UserInfoInterface>("http://127.0.0.1:3001/api/auth", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + String(authTokens.access),
            },
        })
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [authTokens.access]);

    return (
        <div className="container">
            <div className="content-container">
                here
            </div>
            <p>Name: <span>{userInfo?.first_name}</span></p>
            <p>Email: <span>{userInfo?.email}</span></p>
            <p>Username: <span>{userInfo?.username}</span></p>
            <button onClick={callLogout}>Log out</button>
        </div>
    );
};

export default Panel;

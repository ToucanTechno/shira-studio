import {useNavigate, Navigate, useLocation, useParams} from "react-router";
import {useEffect} from "react";
import {useConst} from "@chakra-ui/react";
import axios, {AxiosInstance} from "axios";

const AdminProductsDelete = () => {
    let navigate = useNavigate();
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const { id } = useParams();
    useEffect(() => {

        console.log(id);
        api.delete('products/' + id).then(res => {
            console.log(res);
        }).catch(error => console.error(error));
        navigate(-1)
    });
    return (
        <></>
    )
};

export default AdminProductsDelete;

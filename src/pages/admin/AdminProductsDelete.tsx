import { useRouter, useParams } from "next/navigation";
import {useEffect} from "react";
import {useConst} from "@chakra-ui/react";
import axios from "axios";

const AdminProductsDelete = () => {
    const router = useRouter();
    const api = useConst(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const params = useParams();
    const id = params?.id;
    useEffect(() => {

        console.log(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.delete('products/' + id).then((res: any) => {
            console.log(res);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).catch((error: any) => console.error(error));
        router.back();
    });
    return (
        <></>
    )
};

export default AdminProductsDelete;

import { useRouter, useParams } from "next/navigation";
import {useEffect} from "react";
import {useConst} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from '../../utils/apiConfig';
import { logger } from '../../utils/logger';

const AdminCategoriesDelete = () => {
    const router = useRouter();
    const api = useConst(() => axios.create({baseURL: API_URL}));
    const params = useParams();
    const id = params?.id;
    useEffect(() => {

        logger.log(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.delete('categories/' + id).then((res: any) => {
            logger.log(res);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).catch((error: any) => logger.error(error));
        router.back();
    });
    return (
        <></>
    )
};

export default AdminCategoriesDelete;

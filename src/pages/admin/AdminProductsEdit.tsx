'use client'

import { useRouter, useParams } from "next/navigation";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {IProduct} from "../../models/Product";
import axios from "axios";
import Select, { MultiValue } from 'react-select';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField, NumberInputStepper,
    Textarea, useConst
} from "@chakra-ui/react";
import FileUpload from "../../components/common/FileUpload";
import {ICategory} from "../../../backend/src/models/Category";
import {StatusCodes} from "http-status-codes";

interface SelectOption {
    value: string;
    label: string;
    name: string;
}

interface CategoriesData {
    all: SelectOption[];
    selected: SelectOption[];
    old: SelectOption[];
}

const AdminProductsEdit = () => {
    const params = useParams();
    const isEdit = params && ('id' in params);
    const [product, setProduct] =
        useState<IProduct | null>(null);
    const [categoriesData, setCategoriesData] =
        useState<CategoriesData>({all: [], selected: [], old: []});
    const [stock,  setStock] = useState(0);
    const [price,  setPrice] = useState(0);
    const [uploadedImage, setUploadedImage] = useState("");
    const productRefs = {
        ID: useRef<HTMLInputElement>(null),
        name: useRef<HTMLInputElement>(null),
        description: useRef<HTMLTextAreaElement>(null)
    }
    const api = useConst(() => axios.create({baseURL: 'http://localhost:3001/api'}));
    const router = useRouter();

    const fetchProducts = useCallback(async () => {
        if (isEdit) {
            await api.get(`/products/${params['id']}`)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any) => {
                    const parsedCategories: SelectOption[] = [];
                    // Process the response data
                    const productSkeleton: IProduct = response.data;
                    if (productSkeleton.categories) {
                        for (const category of productSkeleton.categories) {
                            // TODO: replace label back to text when available
                            parsedCategories.push({
                                value: (category as ICategory)._id as string,
                                label: (category as ICategory).name,
                                name: (category as ICategory).name
                            });
                        }
                    }
                    setCategoriesData((data) => {
                        return {
                        ...data,
                            selected: parsedCategories,
                            old: parsedCategories
                        };
                    });
                    setStock(productSkeleton.stock);
                    setPrice(productSkeleton.price);
                    setProduct(productSkeleton);
                });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await api.get(`/categories`).then((response: any) => {
            const categoriesSkeleton: {[key: string]: ICategory} = {} ;
            for (const category of response.data) {
                categoriesSkeleton[category.name] = category;
            }
            if (response.data.length === 0) {
                return;
            }
            setCategoriesData((data) => {
                return { ...data,
                    all:
                        Object.keys(categoriesSkeleton as {[key: string]: ICategory})
                            .map(key => {
                                // TODO replace label back to text when available
                                return {
                                    "value": categoriesSkeleton[key]['_id'] as string,
                                    "label": categoriesSkeleton[key]['name'],
                                    "name": categoriesSkeleton[key]['name']
                                };
                            })
                };
            });
        });
    }, [api, isEdit, params]);

    useEffect(() => {
        fetchProducts().catch(error => console.error(error));
    }, [fetchProducts])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const update = {
            productID: productRefs.ID.current?.value,
            productName: productRefs.name.current?.value,
            categories: categoriesData.selected,
            price: price,
            image: uploadedImage,
            stock: stock,
            description: productRefs.description.current?.value
        };
        if (product && update.image === "") {
            // keep image
            // TODO: probably need to have no image to avoid changing it
            update.image = product['image_src']
        }
        // TODO: select categories
        console.log("update: ", update);
        const updateEntry: IProduct = {
            product_id: update.productID as string,
            name: update.productName as string,
            categories: update.categories.map(category => category.value),  // saves us category update request
            price: update.price,
            image_src: update.image as string,
            description: update.description as string,
            stock: parseInt(update.stock.toString())
        };

        const updatePromises = [];
        if (isEdit) {
            const updateURL = `products/${params['id']}`;
            const deletedCategories = new Set(categoriesData.old.map(el => el.name));
            for (const el of update.categories) {
                deletedCategories.delete(el.name);
            }
            const addedCategories = new Set(update.categories.map(el => el.name));
            for (const el of categoriesData.old) {
                addedCategories.delete(el.name);
            }
            updatePromises.push(api.put<IProduct>(updateURL, updateEntry));
            updatePromises.push(api.put(`products/${params['id']}/categories`, {
                names: Array.from(addedCategories),
                id: update.productID,
                action: 'add'
            }));
            updatePromises.push(api.put(`products/${params['id']}/categories`, {
                names: Array.from(deletedCategories),
                id: update.productID,
                action: 'del'
            }));
        } else {  // Adding product
            const updateURL = 'products/';
            const addedCategories = update.categories.map(el => el.name);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatePromises.push(api.post(updateURL, updateEntry).then((res: any) => {
                const productID = res.data['id'];
                api.put(`products/${productID}/categories`, {
                    names: Array.from(addedCategories),
                    action: 'add'
                })
            }));
        }
        await Promise.all(updatePromises).catch(error => {
            if (error.response.status === StatusCodes.NOT_MODIFIED) {
                return;
            }
            console.error(error);
        });
        router.push('/control-panel/products');
    }

    const handleSelectCategories = (el: MultiValue<SelectOption>) => {
        setCategoriesData({...categoriesData, selected: el as SelectOption[]});
    };

    const handleImageUpload = (files: FileList) => {
        if (files !== null && files.length > 0) {
            // TODO: is that how we send it to server?
            setUploadedImage(URL.createObjectURL(files[0]));
        }
    }

    return (
        <Flex direction='column' m={4}>
            <Heading as='h1' size='xl' mb={2}>{(isEdit) ? "עריכת מוצר" : "הוספת מוצר"}</Heading>
            <form onSubmit={handleSubmit}>
                {isEdit &&
                    <FormControl>
                        <FormLabel htmlFor="productID">מזהה מוצר</FormLabel>
                        <Input type="text"
                               id="productID"
                               name="productID"
                               defaultValue={product ? product['_id'] : ''}
                               required
                               disabled
                               ref={productRefs.ID}/>
                    </FormControl>
                }

                <FormControl>
                    <FormLabel htmlFor="productName">שם המוצר:</FormLabel>
                    <Input type="text"
                           id="productName"
                           name="productName"
                           defaultValue={product ? product['name'] : ''}
                           required
                           ref={productRefs.name}
                           size='lg'/>
                </FormControl>

                {/* TODO: Choose categories as in DB */}
                <FormControl>
                <FormLabel htmlFor="categoriesDropdown">קטגוריות:</FormLabel>
                <Select id="categoryDropdown"
                        name="categories"
                        isMulti
                        isSearchable
                        onChange={handleSelectCategories}
                        value={categoriesData.selected}
                        options={categoriesData.all}/>
                </FormControl>

                <FormControl>
                <FormLabel htmlFor="price">מחיר:</FormLabel>
                    <NumberInput value={price}
                                 onChange={(_stringPrice, numberPrice) => setPrice(numberPrice)}
                                 min={0}
                                 max={99999}
                                 isRequired
                                 name='price'
                                 w='140px'
                                 allowMouseWheel>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FileUpload defaultImage={ (product) ? product.image_src : "" }
                            handleUpload={ handleImageUpload }
                            isRequired={ !isEdit }
                            name="picture">
                    העלאת תמונה
                </FileUpload>

                <FormControl>
                <FormLabel htmlFor="stock">מלאי:</FormLabel>
                    <NumberInput value={ stock }
                                 onChange={ (_stringStock, numberStock) => setStock(numberStock) }
                                 min={ 0 }
                                 max={ 999 }
                                 isRequired
                                 name='stock'
                                 dir='ltr'
                                 w='140px'
                                 allowMouseWheel>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl>
                <FormLabel htmlFor="description">תיאור המוצר:</FormLabel>
                <Textarea id="description"
                          name="description"
                          rows={4}
                          defaultValue={product ? product.description : ''}
                          ref={productRefs.description}>
                </Textarea>
                </FormControl>

                <Button type="submit" mt={2}>{ isEdit ? "עריכת מוצר" : "הוספת מוצר" }</Button>
            </form>
        </Flex>
    )
};

export default AdminProductsEdit;

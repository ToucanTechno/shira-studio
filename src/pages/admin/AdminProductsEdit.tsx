import {Form, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {IProduct} from "../../models/Product";
import axios, {AxiosInstance} from "axios";
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

interface SelectOption {
    value: string;
    label: string;
}

const AdminProductsEdit = () => {
    const params = useParams();
    const isEdit = ('id' in params);
    const [product, setProduct] =
        useState<IProduct | null>(null);
    const [categories, setCategories] =
        useState<{value: string, label: string}[]>([]);
    const [uploadedImage, setUploadedImage] = useState("");
    const [selectedCategories, setSelectedCategories] =
        useState<SelectOption[]>([]);
    const productRefs = {
        ID: useRef<HTMLInputElement>(null),
        name: useRef<HTMLInputElement>(null),
        price: useRef<HTMLInputElement>(null),
        stock: useRef<HTMLInputElement>(null),
        description: useRef<HTMLTextAreaElement>(null),
        submit: useRef<HTMLButtonElement>(null)
    }
    const api = useConst<AxiosInstance>(() => axios.create({baseURL: 'http://localhost:3001/api'}));

    useEffect(() => {
        if (isEdit) {
            api.get(`/products/${params['id']}`)
                .then(response => {
                    let parsedCategories = [];
                    // Process the response data
                    let productSkeleton: IProduct = response.data;
                    for (const category of productSkeleton.categories) {
                        parsedCategories.push({
                            value: (category as ICategory)._id as string,
                            label: (category as ICategory).text
                        });
                    }
                    setSelectedCategories(parsedCategories)
                    setProduct(productSkeleton);
                })
                .catch(error => {
                    // Handle any errors
                    console.error(error);
                });
            api.get(`/categories`).then(response => {
                let categoriesSkeleton: {[key: string]: ICategory} = {} ;
                for (const category of response.data) {
                    categoriesSkeleton[category.name] = category;
                }
                if (response.data.length === 0) {
                    return;
                }
                setCategories(Object.keys(categoriesSkeleton as {[key: string]: ICategory})
                    .map(key => {
                        return {"value": categoriesSkeleton[key]['_id'] as string, "label": categoriesSkeleton[key]['text']}
                    }));
            })
        }
    }, [isEdit, params, api])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        let update = {
            productID: productRefs.ID.current?.value,
            productName: productRefs.name.current?.value,
            categories: selectedCategories,
            price: productRefs.price.current?.value,
            image: uploadedImage,
            stock: productRefs.stock.current?.value,
            description: productRefs.description.current?.value
        };
        if (product && update.image === "") {
            // keep image
            update.image = product['image_src']
        }
        // TODO: select categories
        console.log(update);
        let updateEntry: IProduct = {
            product_id: update.productID as string,
            name: update.productName as string,
            categories: update.categories.map(category => category.value), // TODO: update IProduct to include multiple categories
            price: parseInt(update.price as string),
            image_src: update.image as string,
            description: update.description as string,
            stock: parseInt(update.stock as string)
        };

        if (isEdit) {
            const updateURL = `http://localhost:3001/api/products/${params['id']}`;
            axios.put<IProduct>(updateURL, updateEntry).then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
        } else {
            const updateURL = `http://localhost:3001/api/products/`;
            axios.post<IProduct>(updateURL, updateEntry).then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
        }
        event.preventDefault();
    }

    const handleSelectCategories = (el: MultiValue<SelectOption>) => {
        setSelectedCategories(el as SelectOption[]);
    };

    const handleImageUpload = (files: FileList) => {
        if (files !== null && files.length > 0) {
            setUploadedImage(URL.createObjectURL(files[0]));
        }
    }

    return (
        <Flex direction='column' m={4}>
            <Heading as='h1' size='xl' mb={2}>{(isEdit) ? "עריכת מוצר" : "הוספת מוצר"}</Heading>
            <Form onSubmit={handleSubmit}>
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
                        value={selectedCategories}
                        options={categories}/>
                </FormControl>

                <FormControl>
                <FormLabel htmlFor="price">מחיר:</FormLabel>
                    <NumberInput defaultValue={product ? product.price : 0}
                                 min={0}
                                 max={99999}
                                 isRequired
                                 name='price'
                                 dir='ltr'
                                 w='140px'>
                        <NumberInputField ref={productRefs.price} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FileUpload defaultImage={(product) ? product.image_src : ""}
                            handleUpload={handleImageUpload}
                            isRequired={!isEdit}
                            name="picture">
                    העלאת תמונה
                </FileUpload>

                <FormControl>
                <FormLabel htmlFor="stock">מלאי:</FormLabel>
                    <NumberInput defaultValue={product ? product.stock : 1}
                                 min={0}
                                 max={999}
                                 isRequired
                                 name='stock'
                                 dir='ltr'
                                 w='140px'>
                        <NumberInputField ref={productRefs.stock} />
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

                <Button type="submit" mt={2} ref={productRefs.submit}>{ isEdit ? "עריכת מוצר" : "הוספת מוצר" }</Button>
            </Form>
        </Flex>
    )
};

export default AdminProductsEdit;

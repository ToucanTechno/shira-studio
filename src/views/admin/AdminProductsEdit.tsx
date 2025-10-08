'use client'

import { useRouter, useParams } from "next/navigation";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {IProduct, ICategory} from "../../models/Product";
import axios  from "axios";
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
import { MultiImageUpload } from "../../components/admin/MultiImageUpload";
import {StatusCodes} from "http-status-codes";
import { API_URL } from '../../utils/apiConfig';
import { IProductImage } from "../../models/Product";

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
    const [images, setImages] = useState<IProductImage[]>([]);
    const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
    const productRefs = {
        ID: useRef<HTMLInputElement>(null),
        name: useRef<HTMLInputElement>(null),
        description: useRef<HTMLTextAreaElement>(null)
    }
    const api = useConst(() => axios.create({baseURL: API_URL}));
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
                    setImages(productSkeleton.images || []);
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
        
        const updateEntry: Partial<IProduct> = {
            product_id: productRefs.ID.current?.value,
            name: productRefs.name.current?.value,
            categories: categoriesData.selected.map(category => category.value),
            price: price,
            description: productRefs.description.current?.value,
            stock: parseInt(stock.toString())
        };

        const updatePromises = [];
        
        try {
            let productId = params['id'] as string;
            
            if (isEdit) {
                // Update existing product
                const deletedCategories = new Set(categoriesData.old.map(el => el.name));
                for (const el of categoriesData.selected) {
                    deletedCategories.delete(el.name);
                }
                const addedCategories = new Set(categoriesData.selected.map(el => el.name));
                for (const el of categoriesData.old) {
                    addedCategories.delete(el.name);
                }
                
                updatePromises.push(api.put<IProduct>(`products/${productId}`, updateEntry));
                updatePromises.push(api.put(`products/${productId}/categories`, {
                    names: Array.from(addedCategories),
                    action: 'add'
                }));
                updatePromises.push(api.put(`products/${productId}/categories`, {
                    names: Array.from(deletedCategories),
                    action: 'del'
                }));
                
                await Promise.all(updatePromises);
                
                // Upload new images if any
                if (imagesToUpload.length > 0) {
                    const formData = new FormData();
                    imagesToUpload.forEach(file => {
                        formData.append('images', file);
                    });
                    await api.post(`products/${productId}/images`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            } else {
                // Create new product
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response: any = await api.post('products/', updateEntry);
                productId = response.data['id'];
                
                // Add categories
                const addedCategories = categoriesData.selected.map(el => el.name);
                await api.put(`products/${productId}/categories`, {
                    names: Array.from(addedCategories),
                    action: 'add'
                });
                
                // Upload images
                if (imagesToUpload.length > 0) {
                    const formData = new FormData();
                    imagesToUpload.forEach(file => {
                        formData.append('images', file);
                    });
                    await api.post(`products/${productId}/images`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }
            
            router.push('/control-panel/products');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === StatusCodes.NOT_MODIFIED) {
                router.push('/control-panel/products');
                return;
            }
            console.error('Error saving product:', error);
        }
    }

    const handleSelectCategories = (el: MultiValue<SelectOption>) => {
        setCategoriesData({...categoriesData, selected: el as SelectOption[]});
    };

    const handleImagesChange = (updatedImages: IProductImage[]) => {
        setImages(updatedImages);
    };

    const handleFilesSelected = (files: File[]) => {
        setImagesToUpload(files);
    };

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

                <FormControl>
                    <FormLabel>תמונות המוצר:</FormLabel>
                    <MultiImageUpload
                        productId={isEdit && params['id'] ? params['id'] as string : undefined}
                        existingImages={images}
                        onImagesChange={handleImagesChange}
                        onFilesSelected={handleFilesSelected}
                    />
                </FormControl>

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

import ProductCategory from '../../../../src/pages/ProductCategory'

interface ProductCategoryPageProps {
    params: {
        category: string
        productCategory: string
    }
}

export default function ProductCategoryPage({ params }: ProductCategoryPageProps) {
    return <ProductCategory category={params.category} productCategory={params.productCategory} />
}
import ProductCategory from '@/views/ProductCategory'

interface ProductCategoryPageProps {
    params: Promise<{
        category: string
        productCategory: string
    }>
}

export default async function ProductCategoryPage({ params }: ProductCategoryPageProps) {
    const { category, productCategory } = await params
    return <ProductCategory category={category} productCategory={productCategory} />
}
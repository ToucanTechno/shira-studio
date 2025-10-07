import Product from '../../../src/pages/Product'

interface ProductPageProps {
    params: { product: string }
}

export default function ProductPage({ params }: ProductPageProps) {
    return <Product />
}
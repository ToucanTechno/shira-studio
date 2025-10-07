import Category from '../../../src/pages/Category'

interface CategoryPageProps {
    params: { category: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
    return <Category category={params.category} />
}
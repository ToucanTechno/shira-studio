import React, {Component} from "react";
import {withParams} from "../utils/ParamsWrapper";
import {Link} from "react-router-dom";
import CategorySampleImage from '../assets/images/categories/רקמה7-1.webp'
import './Category.css'

interface CategoryProps {
    params: {
        category: string;
    }
}

interface CategoryInfo {
    name: string;
    link: string;
    text: string;
    num_products: number;
    image_src: any;
}

interface CategoryState {
    categoryInfo: {
        name: string;
        text: string;
        categories: CategoryInfo[];
    }
}
class Category extends Component<CategoryProps, CategoryState> {
    constructor(props: CategoryProps) {
        super(props);
        this.state = {
            categoryInfo: {
                name: props.params.category,
                text: 'תכשיטים',
                categories: [
                    {name: 'brooches', link: `/category/${props.params.category}/brooches`, text: 'סיכות', num_products: 49, image_src: CategorySampleImage},
                    {name: 'earrings', link: `/category/${props.params.category}/earrings`, text: 'עגילים', num_products: 48, image_src: CategorySampleImage},
                    {name: 'bracelets', link: `/category/${props.params.category}/bracelets`, text: 'צמידים', num_products: 8, image_src: CategorySampleImage},
                    {name: 'necklaces', link: `/category/${props.params.category}/necklaces`, text: 'שרשראות', num_products: 30, image_src: CategorySampleImage},
                    {name: 'body_jewelry', link: `/category/${props.params.category}/body_jewelry`, text: 'תכשיטי גוף', num_products: 9, image_src: CategorySampleImage}
                ]
            }
        };
    }

    render () {
        return (
            <div className="container">
                <h2>{this.state.categoryInfo.text}</h2>
                <div className="gallery">
                    {this.state.categoryInfo.categories.map(item => {
                        return (
                            <div className="gallery-item" key={item.name}>
                                <Link to={item.link}>
                                    <img src={item.image_src} alt={item.name}/>
                                    {item.text} <mark>({item.num_products})</mark>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default withParams(Category);

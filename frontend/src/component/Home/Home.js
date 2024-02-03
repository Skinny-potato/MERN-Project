import React, { Fragment, useEffect } from 'react'
import { CgMouse } from "react-icons/cg"
import "./Home.css"
import Product from "./ProductCard.js"
import MetaData from '../layout/MetaData'
import { clearErrors, getProduct } from "../../actions/productAction"
import { useSelector, useDispatch } from "react-redux"
import Loader from '../layout/Loader/loader'
import { useAlert } from 'react-alert'

const Home = () => {
    const alert = useAlert()
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.products)

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors)
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>

                    <MetaData title="Ecommerce" />



                    <div className="banner">
                        <p>Welcome to the most visited website for shopping</p>
                        <h1>Find All The products YOU Need</h1>
                        <a href="#container">
                            <button>Scroll <CgMouse /></button>

                        </a>
                    </div>
                    <h2 className="homeHeading">Featured Products</h2>


                    <div className="container" id="container">
                        {products && products.map(product => (
                            <Product product={product} />
                        ))}
                    </div>
                </Fragment>
            )
            }

        </Fragment>
    )

}

export default Home

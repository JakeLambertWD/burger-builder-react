import React, { Component, Fragment } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

const TOPPING_PRICES = {
    salad: 0.2,
    bacon: 1,
    cheese: 0.3,
    meat: 1.4
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 5,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://react-my-burger-44089.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            } )
            .catch(error => {
                this.setState({error: true});
            });
    } 

    updatePurchaseState (currentIngredients) {
        // extract the keys from the object and store in an array
        const sum = Object.keys(currentIngredients)
            .map(igKey => {
                // return the value of a given key
                return currentIngredients[igKey]; [0, 0, 0, 1]
            }) 
            // reduce the array into 1 number to find sum of all ingredients
            // first param is the start no. 0 or the previous returned value
            // second param is the value of the current element   
            .reduce((sum, el) => {
                return sum + el
            }, 0);
        // this value will be a boolean
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        // get the value of a given type
        const oldCount = this.state.ingredients[type];
        // add 1 to value
        const updatedCount = oldCount + 1;
        // store a copy of the ingredients object
        const updatedIngredients = {
            ...this.state.ingredients
        };
        // change the value of a property that matches the type
        updatedIngredients[type] = updatedCount;
        // get the value of a given type
        const priceAddition = TOPPING_PRICES[type];
        // store the current price
        const oldPrice = this.state.totalPrice;
        // add the value to the current price
        const newPrice = oldPrice + priceAddition;  
        // set our state to the new values
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        // dynamic ingredients
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        // dynamic price
        const priceDeduction = TOPPING_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;  
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Jake Lambert',
                address: {
                    street: 'Cross Street',
                    postcode: 'N1 2BH',
                    country: 'England'
                },
                email: 'jakelambert1@hotmail.co.uk'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json', order)
            .then(response => { this.setState({ loading: false, purchasing: false }); })
            .catch(error => { this.setState({ loading: false, purchasing: false }); });
    }

    render () {
        const disabledInfo = {
            // copy of our ingredients object
            ...this.state.ingredients
        };
        // loop through all the keys in our object
        for (let key in disabledInfo) {
            // check if the values of our keys are true
            disabledInfo[key] = disabledInfo[key] <= 0
            // expected outcome - {salad: true, bacon: false, ...}
        }

        let orderSummary = null; 
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        // if ingredients is true
        if (this.state.ingredients) {
            burger = (
                <Fragment>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice} 
                        ordered={this.purchaseHandler}/>
                </Fragment>
            );

            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;
            
            if (this.state.loading) {
                orderSummary = <Spinner />;
            }
        }
        
        return (
            <Fragment>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Fragment>
        );
    };
}

export default withErrorHandler(BurgerBuilder, axios);
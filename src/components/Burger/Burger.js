import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = ( props ) => {
    // The Object.keys() method extracts the keys of a given object & returns the keys as an array
    // expected output: Array ["salad", "bacon", "cheese", "meat"]
    // we chain the map method which provides a function on each element in the array
    let transformedIngredients = 
        Object.keys(props.ingredients).map(ingKey => {
            console.log(ingKey);
            return [...Array(props.ingredients[ingKey])].map((_, i) => {
                console.log(i);
                return <BurgerIngredient key={ingKey + i} type={ingKey} />;
            });
        })
        .reduce((arr, el) => { 
            // concat() method creates a new array by merging (concatenating) existing arrays
            return arr.concat(el)
        }, []);
        console.log(transformedIngredients);
        
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;
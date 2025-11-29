import "./Shop.css";

import { useState } from "react";
import food from "./Food.png";
import ScreenLayout from "../../components/screenlayout";

export default function Shop() {

    const [coins, setCoins] = useState(2);
    
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const [items, setItems] = useState([
        {id: 1, name: "Food", image: food, stock: 1, price: 1},
        {id: 2, name: "Food", image: food, stock: 0, price: 1},
    ])

    const [boughtItems, setBoughtItems] = useState([])

    function addToCart(id) {
        setItems(prev =>
            prev.map(item =>
            item.id === id
                ? { ...item, stock: Math.max(0, item.stock - 1) }
                : item
            )
        ); // decrement the quantity

        setCart(prevCart => {
            const item = items.find(item => item.id === id);
            if (!item || item.stock <= 0) return prevCart; // if no stock, do nothing

            // if there's stock, add it to the cart and update the total
            setCartTotal(cartTotal + item.price);
            return [...prevCart, { ...item}];
        });
    }

    function removeFromCart(index) {
        // increment the item quantity
        setItems((prev) =>
            prev.map((item) => 
                item.id === cart[index].id
                    ? {...item, stock: item.stock + 1}
                    : item
            )   
        )

        // remove from cart
        setCart(prevCart => prevCart.filter((_, i) => i !== index));
        setCartTotal(Math.max(0, cartTotal-cart[index].price));
    }

    function checkout() {
        // calculate total price
        let totalPrice = 0;
        cart.forEach((item) => totalPrice += item.price);

        if (coins >= totalPrice) {
            setCoins(coins-totalPrice);
        } else {
            return;
        }

        setBoughtItems(...boughtItems, cart);
        setCart([]);
        setCartTotal(0);
        console.log("total price", totalPrice);
    }

    return (
        <>
            <ScreenLayout>
                <h1>Shop</h1> 

                <div className="shop-coins-container">
                    <p>Coins: {coins}</p>
                    <div className="coin-sprite"></div>
                </div>

                <div className="shop-grid">
                    {items.map((item) => (
                        <div className={item.stock <= 0 ? "shop-grid-item sold-out" : "shop-grid-item"} onClick={() => addToCart(item.id)}>
                            <img src={food}/>
                            <span>{item.name}</span>
                            <span>Stock: {item.stock}</span>
                            <span>Price: {item.price}</span>
                        </div>
                    ))}
                </div>
                
                <div className="shop-cart">
                    <h3>Cart:</h3>
                    {cart.map((item, index) => (
                        <div className="shop-cart-item">
                            <img src={item.image} onClick={() => removeFromCart(index)}/>
                        </div>
                    ))}
                </div>

                <div className="shop-coins-container">
                    <p>Total: {cartTotal}</p>
                    <div className="coin-sprite"></div>
                </div>
                
                <a className="shop-checkout" onClick={() => checkout()} disabled={true}>Checkout</a>
            </ScreenLayout>
        </>
    )
}
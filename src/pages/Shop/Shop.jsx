import "./Shop.css";

import { useState } from "react";
import food from "./Food.png";
import ScreenLayout from "../../components/screenlayout";
import { useNavigate } from "react-router-dom";
import TextWriter from "../../utils/TextWriter";

export default function Shop() {

    const navigate = useNavigate();

    const HELP_TEXT = "Select your food then checkout to purchase. If you change your mind, click on the selected item in your cart to remove it.";
    const CHECKOUT_TEXT = ""
    const [dialogueText, setDialogueText] = useState(HELP_TEXT);

    const [coins, setCoins] = useState(1);
    
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
    }

    return (
        <>
            <ScreenLayout>
                <div className="shop-container">
                    <h2 className="shop-title">Shop</h2> 
                    
                    
                    <div  style={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <p>Tip: Fight monsters to get more coins!</p>
                        </div>
                        <div className="shop-coins-container">
                            <p>Coins: {coins}</p>
                            <div className="coin-sprite"></div>
                        </div>
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
                </div>

                <div className="dialogue">
                    <div className="dialogue-text">
                        <TextWriter text={dialogueText} delay={20}/>
                    </div>
                </div>
            </ScreenLayout>
        </>
    )
}
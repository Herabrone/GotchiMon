import "./Shop.css";

import { useEffect, useState } from "react";
import ScreenLayout from "../../components/screenlayout";
import { useNavigate } from "react-router-dom";
import TextWriter from "../../utils/TextWriter";
import { updateLocalStorage } from "../../utils/localStorage";
import { useDialogue } from "../../utils/dialogueContext";
import Dialogue from "../../components/Dialogue";

export default function Shop() {

    const navigate = useNavigate();
    const { advanceDialogue } = useDialogue();

    const [coins, setCoins] = useState(localStorage.getItem("coins"));
    
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const [items, setItems] = useState(JSON.parse(localStorage.getItem("shopItems")));

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
        if (cart.length >= 1) { 
            let totalPrice = 0;
            cart.forEach((item) => totalPrice += item.price);

            if (coins >= totalPrice) {
                setCoins(coins-totalPrice);
                // update local storage on purchase
                updateLocalStorage("coins", coins-totalPrice);
            } else {
                advanceDialogue("ShopNotEnoughCoins");
                return;
            }

            setCart([]);
            setCartTotal(0);
            advanceDialogue("ShopComplete");
            // update local storage on checkout
            updateLocalStorage("shopItems", items);
        }
    }

    const handleDialogueAction = (action) => {
        if (action === "ReturnToBase") {
            navigate('/base');
        }
    };

    useEffect(() => {
        advanceDialogue("ShopStart");
    }, []);

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
                    <div className="shop-grid-container">
                        <div className="shop-grid">
                            {items ? items.map((item) => (
                                <div className={item.stock <= 0 ? "shop-grid-item sold-out" : "shop-grid-item"} onClick={() => addToCart(item.id)}>
                                    <img src={item.image}/>
                                    <span>{item.name}</span>
                                    <span>Stock: {item.stock}</span>
                                    <span>Price: {item.price}</span>
                                </div>
                            )) : "Shop is currently closed"}
                        </div>
                    </div>
                    
                    <div className="shop-bottom-container">
                        <div className="shop-cart-container">
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
                        </div>

                        <a className="shop-checkout" onClick={() => checkout()}>Checkout</a>
                    </div>
                    
                    
                </div>

                <Dialogue onAction={handleDialogueAction} />            </ScreenLayout>
        </>
    )
}

const OrderSection = () =>{
    return (
        <div> 
            <h1>Order Section</h1>
            <p>Here you can place your orders</p>
            <form>
                <input type="text" placeholder="Product Name" />
                <input type="number" placeholder="Quantity" />
                <input type="submit" value="Add to Cart" />
            </form>
            <div>
                <h2>Cart</h2>
                {/* Add Cart Items */}
            </div>
            <div>
                <h2>Order Summary</h2>
                {/* Display Order Summary */}
            </div>
            <div>
                <button>Place Order</button>
            </div>
        </div>
    );
}

export default OrderSection;

const buttons = document.querySelectorAll(".quantity_btn")
const buy_buttons = document.querySelectorAll(".buy")
const cart_btn = document.querySelector("#cart-btn")
const shopping_cart = document.querySelector(".shopping-cart")
const delete_btn = document.querySelectorAll(".btn")

const ordered_product = document.querySelector(".ordered-product")
const cart_products = document.querySelector(".cart-products")

const subtotal_fee = document.querySelector("#subtotal-fee")
const delivery_fee = document.querySelector("#delivery-fee")
const total_fee = document.querySelector("#total-fee")

const total_cost = parseFloat(subtotal_fee.textContent.replace(/[^0-9.-]/g, "")) + 
parseFloat(delivery_fee.textContent.replace(/[^0-9.-]/g, "")) 

total_fee.textContent = "$" + total_cost.toFixed(2)

document.querySelector(".stored-product").style.display = "none"
let delete_cooldown = false
let shopping_cart_ON = false

shopping_cart.style.visibility = "hidden";
cart_products.addEventListener('click', event => {
    if (delete_cooldown == true){return} 
    if (event.target.id == "increase_btn" || event.target.id == "decrease_btn"){
        const price = event.target.parentElement.parentElement.parentElement.querySelector(".left").querySelector(".stored-price")
        quantity_btn(event.target, price)
    }

    const btn = event.target.closest(".btn")
    if (!btn) {return}

    const price = btn.parentElement.parentElement.firstElementChild.querySelector(".stored-price")
    if (!price) return

   

    const saved_subtotal = parseFloat(document.querySelector("#subtotal-fee").textContent.replace(/[^0-9.-]/g, ""))
    const saved_total = parseFloat(document.querySelector("#total-fee").textContent.replace(/[^0-9.-]/g, ""))
    const converted_price = parseFloat(price.textContent.replace(/[^0-9.-]/g, ""))

    let subtotal_cost
    let total_cost
    if (!price.cost){
        subtotal_cost = saved_subtotal - converted_price
        total_cost = saved_total - converted_price    
    }
    else{
        subtotal_cost = saved_subtotal - price.cost
        total_cost = saved_total - price.cost
    }
    
    const product = btn.closest(".stored-product")
    
    if (!product) return
    
    subtotal_fee.textContent = "$" + subtotal_cost.toFixed(2)

    
    total_fee.textContent = "$" + total_cost.toFixed(2)
    product.remove()

    
    delete_cooldown = true
    setTimeout(() => {
        delete_cooldown = false
    }, 300)
})

for (let button of buy_buttons){    
    button.textContent = "Order"
    button.addEventListener('click', event => {
        const stored_product_templ = document.querySelector(".stored-product").cloneNode(true)
        stored_product_templ.style.display = "flex"
        const img = button.parentElement.parentElement.querySelector("img")
        const price = button.parentElement.querySelector(".price")
        const name = button.parentElement.parentElement.firstElementChild.querySelector(".product_name")

        const left = stored_product_templ.firstElementChild
        
        const stored_img = left.querySelector("img")
        const stored_price = left.querySelector(".stored-price")
        const stored_name = stored_product_templ.querySelector("#stored-name")

        stored_img.src = img.src
        stored_price.textContent = price.textContent
        stored_name.textContent = name.textContent
        
        const delivery_cost = parseFloat(delivery_fee.textContent.replace(/[^0-9.-]/g, ""))

        const subtotal_cost = parseFloat(stored_price.textContent.replace(/[^0-9.-]/g, "")) + 
        parseFloat(subtotal_fee.textContent.replace(/[^0-9.-]/g, ""))

        subtotal_fee.textContent = "$" + subtotal_cost.toFixed(2)


        const total_cost = subtotal_cost + delivery_cost
        total_fee.textContent = "$" + total_cost.toFixed(2)
        cart_products.appendChild(stored_product_templ)
    })
}


cart_btn.addEventListener('click', event => {
    if (shopping_cart_ON){
        shopping_cart_ON = false
        shopping_cart.style.visibility = "hidden"
    }
    else{
        shopping_cart_ON = true
        shopping_cart.style.visibility = "visible"
    }
})
function quantity_handler(button, state, price){
    let subtotal = parseFloat(document.querySelector("#subtotal-fee").textContent.replace(/[^0-9.-]/g, ""))
    let total = parseFloat(document.querySelector("#total-fee").textContent.replace(/[^0-9.-]/g, ""))
    let converted_price = parseFloat(price.textContent.replace(/[^0-9.-]/g, ""))
    const delivery_cost = parseFloat(delivery_fee.textContent.replace(/[^0-9.-]/g, ""))

    if (price.cost === undefined) {
        price.cost = converted_price   // only set the baseline once
    }

    let quantity = Number(button.parentElement.querySelector("p").textContent)
    if (quantity <= 1){
        if (state == "decrease_btn"){
            quantity = 1
        } else {
            quantity++
            price.cost += converted_price
            subtotal = subtotal + converted_price
            total = subtotal + delivery_cost
        }
    } else {
        if (state == "decrease_btn"){
            quantity--
            price.cost -= converted_price
            subtotal = subtotal - converted_price
            total = subtotal + delivery_cost
        } else {
            quantity++
            price.cost += converted_price
            subtotal = subtotal + converted_price
            total = subtotal + delivery_cost
        }
    }
    button.parentElement.querySelector("p").textContent = String(quantity)
    subtotal_fee.textContent = "$" + subtotal.toFixed(2) 
    total_fee.textContent = "$" + total.toFixed(2)
}

function quantity_btn(btn, price){
    const button = btn
    if (button.id == "decrease_btn"){
        quantity_handler(button, button.id, price)
    }
    else if(button.id == "increase_btn"){
        quantity_handler(button, button.id, price)
    }
}

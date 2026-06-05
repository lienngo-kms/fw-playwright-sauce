# Locator Practice — SauceDemo Inventory Page

**Site**: https://www.saucedemo.com  
**Username**: `standard_user`  
**Password**: `secret_sauce`

---

## 1. Shopping cart link/icon

**CSS**
```css
a.shopping_cart_link
```

**XPath**
```xpath
//a[@class='shopping_cart_link']
```

---

## 2. All "Add to cart" buttons

**CSS**
```css
button[data-test^="add-to-cart"]
```

**XPath**
```xpath
//button[normalize-space(.)='Add to cart']
```

---

## 3. Sort dropdown

**CSS**
```css
select.product_sort_container
```

**XPath**
```xpath
//select[@data-test='product-sort-container']
```

---

## 4. All product images

**CSS**
```css
img.inventory_item_img
```

**XPath**
```xpath
//img[contains(@class,'inventory_item_img')]
```

---

## 5. Items whose price contains "$15.99"

**CSS**  
_(targets the price label directly)_
```css
.inventory_item_price
```

**XPath**  
_(targets the entire inventory item card containing that price)_
```xpath
//div[@class='inventory_item'][.//div[contains(@class,'inventory_item_price') and contains(normalize-space(.),'$15.99')]]
```

---

## 6. "Add to cart" button for "Sauce Labs Backpack"

**CSS**
```css
button[data-test="add-to-cart-sauce-labs-backpack"]
```

**XPath**
```xpath
//div[@class='inventory_item'][.//div[contains(@class,'inventory_item_name') and normalize-space(.)='Sauce Labs Backpack']]//button[normalize-space(.)='Add to cart']
```

---

## 7. "Remove" button after adding "Sauce Labs Onesie" to cart

**CSS**
```css
button[data-test="remove-sauce-labs-onesie"]
```

**XPath**
```xpath
//div[@class='inventory_item'][.//div[contains(@class,'inventory_item_name') and normalize-space(.)='Sauce Labs Onesie']]//button[normalize-space(.)='Remove']
```

---

## 8. All buttons with `data-test` starting with "add-to-cart"

**CSS**
```css
button[data-test^="add-to-cart"]
```

**XPath**
```xpath
//button[starts-with(@data-test,'add-to-cart')]
```

---

## 9. All product names that do NOT contain "Sauce Labs"

**CSS**  
_(CSS has no native `:not-contains` — match all names and exclude in test code)_
```css
.inventory_item_name
```

**XPath**  
_(native exclusion via `not(contains(...))`)_
```xpath
//div[contains(@class,'inventory_item_name') and not(contains(.,'Sauce Labs'))]
```

---

## 10. Product image by matching alt text partially

**CSS**
```css
img.inventory_item_img[alt*="Backpack"]
```

**XPath**
```xpath
//img[contains(@class,'inventory_item_img') and contains(@alt,'Backpack')]
```

---

## Summary table

| # | Requirement | CSS | XPath |
|---|---|---|---|
| 1 | Shopping cart link | `a.shopping_cart_link` | `//a[@class='shopping_cart_link']` |
| 2 | All "Add to cart" buttons | `button[data-test^="add-to-cart"]` | `//button[normalize-space(.)='Add to cart']` |
| 3 | Sort dropdown | `select.product_sort_container` | `//select[@data-test='product-sort-container']` |
| 4 | All product images | `img.inventory_item_img` | `//img[contains(@class,'inventory_item_img')]` |
| 5 | Items priced "$15.99" | `.inventory_item_price` + filter | `//div[@class='inventory_item'][.//div[contains(@class,'inventory_item_price') and contains(normalize-space(.),'$15.99')]]` |
| 6 | Add-to-cart for Backpack | `button[data-test="add-to-cart-sauce-labs-backpack"]` | `//div[...Backpack...]//button[normalize-space(.)='Add to cart']` |
| 7 | Remove button for Onesie | `button[data-test="remove-sauce-labs-onesie"]` | `//div[...Onesie...]//button[normalize-space(.)='Remove']` |
| 8 | data-test starts with "add-to-cart" | `button[data-test^="add-to-cart"]` | `//button[starts-with(@data-test,'add-to-cart')]` |
| 9 | Names NOT containing "Sauce Labs" | `.inventory_item_name` + filter | `//div[contains(@class,'inventory_item_name') and not(contains(.,'Sauce Labs'))]` |
| 10 | Image by partial alt text | `img.inventory_item_img[alt*="Backpack"]` | `//img[contains(@class,'inventory_item_img') and contains(@alt,'Backpack')]` |

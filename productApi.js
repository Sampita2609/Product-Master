let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { data } = require("./productData.js");

app.get("/shops", function (req, res) {
  let shops = data.shops;
  res.send(shops);
});
app.post("/shops", function (req, res) {
  let maxId = data.shops.reduce(
    (acc, curr) => (curr.shopId > acc ? curr.shopId : acc),
    0
  );
  let newId = maxId + 1;
  let body = req.body;
  let item = { shopId: newId, ...body };
  data.shops.push(item);
  res.send(item);
});

app.get("/products", function (req, res) {
  let products = data.products;
  res.send(products);
});
app.post("/products", function (req, res) {
  let maxId = data.products.reduce(
    (acc, curr) => (curr.productId > acc ? curr.productId : acc),
    0
  );
  let newId = maxId + 1;
  let body = req.body;
  let item = { productId: newId, ...body };
  data.products.push(item);
  res.send(item);
});
app.put("/products/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  let index = data.products.findIndex((pr) => pr.productId === id);
  if (index >= 0) {
    data.products[index] = { productId: id, ...body };
    res.send({ productId: id, ...body });
  } else res.status(404).send("No Product Found");
});
app.get("/products/:id",function(req,res){
    let id=req.params.id;
    let item=data.products.find((pr)=>pr.productId===+id);
    if(id>=0) res.send(item);
    else res.status(404).send("No Product Found");
})
app.get("/purchases", function (req, res) {
  let shop = req.query.shop;
  let product = req.query.product;
  let sort = req.query.sort;
  let arr1 = data.purchases;
  if (shop) arr1 = arr1.filter((pr) => pr.shopId === +shop[2]);

  if (product) {
    let ids2 = product.split(",");
    arr1 = arr1.filter((pr) => ids2.find((id) => +id[2] === pr.productid));
  }
  if (sort === "QtyAsc")
    arr1 = arr1.sort((pr1, pr2) => pr1.quantity - pr2.quantity);
  if (sort === "QtyDesc")
    arr1 = arr1.sort((pr1, pr2) => pr2.quantity - pr1.quantity);
  if (sort === "ValueAsc")
    arr1 = arr1.sort(
      (pr1, pr2) => pr1.price * pr1.quantity - pr2.price * pr2.quantity
    );
  if (sort === "ValueDesc")
    arr1 = arr1.sort(
      (pr1, pr2) => pr2.price * pr2.quantity - pr1.price * pr1.quantity
    );
    let shops=data.shops;
    let products=data.products;
  res.send({arr:arr1,shops:shops,products:products});
});
app.post("/purchases", function (req, res) {
  let maxId = data.purchases.reduce(
    (acc, curr) => (curr.purchaseId > acc ? curr.purchaseId : acc),
    0
  );
  let newId = maxId + 1;
  let body = req.body;
  let item = { purchaseId: newId, ...body };
  res.send(item);
});
app.get("/purchases/shops/:id", function (req, res) {
  let id = +req.params.id;
  if (id > 0) {
    let arr = data.purchases.filter((pr) => pr.shopId === id);
    res.send(arr);
  } else res.status(404).send("Shop not Found");
});
app.get("/purchases/products/:id", function (req, res) {
  let id = +req.params.id;
  if(id>0){
  let arr = data.purchases.filter((pr) => pr.productid === id);
  res.send(arr);
  }
  else res.status(404).send("Product Not Found")
});
app.get("/totalPurchase/shop/:id", function (req, res) {
  id = +req.params.id;
  if (id > 0) {
    let arr = data.purchases.filter((pr) => pr.shopId === id);
  }
});

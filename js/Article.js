/**
 * ID: the unique identifier of an product so we can easily find it back
 * Name: the product title
 * Price: obviously
 * Description: a small description of what this product contains
 */
function Article(id, name, price, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
}

Article.prototype.setID = function(id){this.id = id;};
Article.prototype.getID = function(){return this.id;};

Article.prototype.setName = function(name){this.name = name;};
Article.prototype.getName = function(){return this.name;};

Article.prototype.setPrice = function(price){this.price = price;};
Article.prototype.getPrice = function(){return this.price;};

Article.prototype.setDescription = function(description){this.description = description;};
Article.prototype.getDescription = function(){return this.description;};

Article.prototype.changePriceAmount = function(changeAmount){
    var newPrice = this.getPrice() + changeAmount;
    this.setPrice(newPrice);
};

Article.prototype.changePricePercentage = function(changePercentage) {
    var newPrice = this.getPrice() * ((100+changePercentage)/100);
    this.setPrice(newPrice);
}


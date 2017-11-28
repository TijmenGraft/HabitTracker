/**
 * Firstname: firstname obviously
 * Middlename: tussenvoegsel in dutch
 * Surname: surname obviously
 * Age: the age of the person
 * Gender: gender of the person
 * Bank: the amount of points this person has
 * Articles: the articles already bought by this person
 */
function Person(firstName, middleName, surname, age, gender, bank, articles) {
    this.firstName = firstname;
    this.middleName = middlename;
    this.surName = surname;
    this.age = age;
    this.gender = gender;
    this.categoryList = [];
    this.bank = bank;
    this.articles = articles;
}

Person.prototype.setFirstName = function(firstName){this.firstName = firstName;};
Person.prototype.getFirstName = function(){return this.firstName;};

Person.prototype.setMiddleName = function(middleName){this.middleName = middleName;};
Person.prototype.getMiddleName = function(){return this.middleName;};

Person.prototype.setSurName = function(surname){this.surname = surname;};
Person.prototype.getSurName = function(){return this.surname;};

Person.prototype.setAge = function(age){this.age = age;};
Person.prototype.getAge = function(){return this.age;};

Person.prototype.setGender = function(gender){this.gender = gender;};
Person.prototype.getGender = function(){return this.gender;};

Person.prototype.setCategoryList = function(categoryList){this.categoryList = categoryList;};
Person.prototype.getCategoryList = function(){return this.categoryList;};

Person.prototype.setBank = function(bank){this.bank = bank;};
Person.prototype.getBank = function(){return this.bank;};

Person.prototype.setArticles = function(articles){this.articles = articles;};
Person.prototype.getArticles = function(){return this.articles;};

Person.prototype.addHabitList = function(a){
    if(a instanceof HabitList) {
        this.getCategoryList().push(a);
    }
};

Person.prototype.addArticle = function(a) {
    if(a instanceof Article) {
        this.getArticles().push(a);
    }
}

Person.prototype.purchaseArticle = function(price, article) {
    if(price < this.getBank()) {
        var result = this.getBank() - price;
        this.setBank(result);
        this.addArticle(article);
    }
}
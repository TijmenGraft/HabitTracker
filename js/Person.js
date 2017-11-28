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
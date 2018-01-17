const mysql = require('mysql-promise')();

var articalArr = [];

mysql.configure({
    host: "localhost",
    user: "root",
    password: "Kungfu1998",
    database: "habitdatabase"
});

(function setUp() {
	var _function = async function(articalArr) {
		let query = "SELECT a.article_id, a.article_name, a.article_description, a.article_price, ac.category_name FROM article AS a JOIN article_category AS ac ON a.category_id = ac.category_id ORDER BY a.category_id";
		let result = mysql.query(query);
		console.log(result);
	}
})();

module.exports = {
	articles: articalArr
}
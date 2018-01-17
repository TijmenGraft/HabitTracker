const mysql = require('mysql-promise')();

var articalArr = [];

mysql.configure({
    host: "localhost",
    user: "root",
    password: "Kungfu1998",
    database: "habitdatabase"
});

// var exposeArticles = function(articalArr) {
// 	// articalArr = articalArr;
// }

(function setUp() {
	console.log('Setting up shop');
	var _function = async function(articalArr) {
		let query = "SELECT a.article_id, a.article_name, a.article_description, a.article_price, ac.category_name FROM article AS a JOIN article_category AS ac ON a.category_id = ac.category_id ORDER BY a.category_id";
		let result = await mysql.query(query);
		result[0].forEach(function(article){
			articalArr.push({
				id: article.article_id,
				name: article.article_name,
				description: article.article_description,
				category: article.category_name
			})
		});
		// done(articalArr);
	}
	_function(articalArr);
})();

module.exports = {
	articles: articalArr
}
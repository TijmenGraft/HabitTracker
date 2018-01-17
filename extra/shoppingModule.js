const mysql = require('mysql-promise')();

var articalArr = [];

mysql.configure({
    host: "localhost",
    user: "root",
    password: "Kungfu1998",
    database: "habitdatabase"
});

(function setUp() {
	console.log('Setting up shop');
	let query = "SELECT a.article_id, a.article_name, a.article_description, a.article_price, ac.category_name FROM article AS a JOIN article_category AS ac ON a.category_id = ac.category_id ORDER BY a.category_id";
	mysql.query(query, function(err,result) {
		if(err) {
			console.log(err);
		}
		result.forEach(function(article){
			articalArr.push({
				id: article.article_id,
				name: article.article_name,
				description: article.article_description,
				category: article.category_name,
				src: article.article_id + '_' + article.category_name + '.jpg'
			})
		});
	})
})();

module.exports = {
	articles: articalArr
}
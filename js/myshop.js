	document.addEventListener("deviceready", init, false);
    window.addEventListener('load', init, false);
	
	var db;
	 
	function init() {
        db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		db.transaction(function (tx) {            
			tx.executeSql('CREATE TABLE IF NOT EXISTS User (UserId INTEGER PRIMARY KEY AUTOINCREMENT, Email text, Password text, Name text)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS Category (CategoryId INTEGER PRIMARY KEY AUTOINCREMENT, Name text, Desc text)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS Product (ProductId INTEGER PRIMARY KEY AUTOINCREMENT, Name text, Image text, Price DECIMAL(10, 5), AvailableQty INTEGER, CategoryId INTEGER, FOREIGN KEY(CategoryId) REFERENCES Category(CategoryId))');
			tx.executeSql('CREATE TABLE IF NOT EXISTS Cart (CartId INTEGER PRIMARY KEY AUTOINCREMENT,UserId INTEGER, ProductId INTEGER, Qty INTEGER, Price DECIMAL(10, 5), SubTotal DECIMAL(10, 5), Total DECIMAL(10, 5), FOREIGN KEY(UserId) REFERENCES User(UserId), FOREIGN KEY(ProductId) REFERENCES Product(ProductId))');
		}, errorCB, successCB);
		
		//Insert Initial Values To Run The Application
		const statements = [
		'INSERT OR REPLACE INTO User(UserId,Email,Password,Name) VALUES (1,"stevemiller@canada.ca", "steve@123", "Steve Miller");',
		
		'INSERT OR REPLACE INTO Category(CategoryId,Name,Desc) VALUES (1,"Electronics", "Electronic Items")',
		'INSERT OR REPLACE INTO Category(CategoryId,Name,Desc) VALUES (2,"Clothings", "Apparal and Clothing Items")',
		'INSERT OR REPLACE INTO Category(CategoryId,Name,Desc) VALUES (3,"Sports", "Sports Products")',
		
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(1,"iPhone 12","Images/iPhone12.png",560,100,1)',
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(2,"Samsung S3","Images/SamsungS3.png",360,130,1)',
		
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(3,"T-Shirt","Images/Tshirt.png",560,100,2)',
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(4,"Jeans","Images/Jeans.png",560,100,2)',
		
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(5,"Baseball Gloves","Images/baseball-glove.jpg",160,100,3)',
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(6,"Boxing Gloves","Images/boxinggloves.jpg",860,100,3)',
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(7,"Football","Images/football.jpg",120,100,3)',
		'INSERT OR REPLACE INTO Product(ProductId,Name,Image,Price,AvailableQty,CategoryId) VALUES(8,"Gym Machine","Images/sportsbag.jpg",160,100,3)',
		
		'INSERT OR REPLACE INTO Cart(CartId,UserId,ProductId,Qty,Price,SubTotal,Total) VALUES(1,1,1,1,560,560,560)',
		'INSERT OR REPLACE INTO Cart(CartId,UserId,ProductId,Qty,Price,SubTotal,Total) VALUES(1,1,2,1,360,360,360)'];
		
		db.transaction(function (tx) {  
			for (const stmt of statements) {
				tx.executeSql(stmt);
			}
		}, errorCB, successCB);
		
		//Login
		//login('stevemiller@canada.ca','steve@123');
		
		//Register
		//register('riteshtandon23@gmail.com','tandon','Ritesh Tandon');
		
		//My Profile
		//getMyProfile(2);
		
		//Update profile
		//setMyProfile('vedanshtandon20@gmail.com','Vedansh Tandon');
		
		//Get Products By Category
		//getProductsByCategory(1);
		
		//Get User Cart
		//getCart(1);
		
		//Search Items
		//searchItem('Samsung')
	}

	function errorCB(err) {
		alert(err);
		console.log(err);
		//alert("Error processing SQL: "+err.code);
	}

	function successCB() {
		
	}
	
	function getCategories(){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var sql = 'select CategoryId,Name,Desc from Category';
		var userId;
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[],
			function(err,results) {
				//console.log(results);
				if((results.rows.length)>0){
					var h='';
					for(i=0;i<results.rows.length;i++){
						h+='<button type="button" style="margin-left:5px" onclick="clearGrid();getProductsByCategory('+results.rows[i].CategoryId+',\''+results.rows[i].Name+'\');" class="btn btn-warning">'+results.rows[i].Name+'</button>';
						getProductsByCategory(results.rows[i].CategoryId,results.rows[i].Name);
					}
					$(".categories").html(h);
				}else{
					errorCB("There are no categories available.");
				}
			});
		});
	}
	
	function login(username,pwd){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var sql = 'select UserId,Name from User where Email=? and Password=?';

		var userId;
		db.transaction(function (tx) {
			var d=tx.executeSql(sql,[username,pwd],
			function(err,results) {
				console.log(results);
				if((results.rows.length)>0){
					if(results.rows[0].UserId){
						localStorage.setItem("username", results.rows[0].Name);
						localStorage.setItem("userid", results.rows[0].UserId);
						window.location.href='dashboard.html';
					}else{
						errorCB("Invalid Login or Password!");
					}
				}else{
					alert("Invalid Login or Password!");
				}
			});
		});
	}
	
	function register(username,pwd,name){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var sql='INSERT OR REPLACE INTO User(Email,Password,Name) VALUES (?,?,?)';
		var userId;
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[username,pwd,name],
			function(err,results) {
				//console.log(results);
				if((results.rowsAffected)>0){
					userId=results.insertId;
					window.location.href="login.html";
				}else{
					alert("Oops Some Error Has Occurred!");
				}
			});
		}, errorCB, successCB);
	}
	
	function getMyProfile(userId){
		
		userId=localStorage.getItem("userid");
		
		if(userId==undefined)
			window.location.href="login.html";
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var sql = 'select UserId,Email,Name,Password from User where UserId=?';
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[userId],
			function(err,results) {
				if((results.rows.length)>0){
					//console.log(results);
					if(results.rows[0].UserId){
						//alert("Profile loaded Successfully!");
						$(".username").text(localStorage.getItem("username"));
						$("#txtName").val(results.rows[0].Name);
						$("#txtEmail").val(results.rows[0].Email);
						$("#txtPassword").val(results.rows[0].Password);
						$("#btnEditProfile").attr('data-value',results.rows[0].UserId);
					}else{
						alert("Profile not loaded");
					}
				}else{
					alert("Invalid Profile!");
				}
			});
		}, errorCB, successCB);
	}
	
	function setMyProfile(Email,Password,Name){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var userId=localStorage.getItem("userid");
		var sql = 'update User set Email=?,Name=?,Password=? where UserId=?';
		
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[Email,Name,Password,userId],
			function(err,results) {
			//console.log(results);
				if((results.rowsAffected)>0){
					alert("Profile updated Successfully!");
				}else{
					alert("Oops there was a problem!");
				}
			});
		}, errorCB, successCB);
	}
	
	function getProductsByCategory(categoryId,categoryName){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var json=new Array();
		var sql = 'select ProductId,Name,Image,Price,AvailableQty,CategoryId from Product where CategoryId=?';
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[categoryId],
			function(err,results) {
				if((results.rows.length)>0){
					//console.log(results);
					for(i=0;i<results.rows.length;i++){
						var p=results.rows[i];
						json.push({"ProductId":p.ProductId,"Name":p.Name,"Image":p.Image,"Price":p.Price,"AvailableQty":p.AvailableQty,"CategoryId":p.CategoryId});
					}
					
					//Load data in the html grid
					populateGrid(results,categoryName);
					
				}else{
					alert("No Products are available in this category");
				}
				//console.log(json);
			});
		}, errorCB, successCB);
	}
	
	function getCart(userId){
		
		$(".cartdetail").html('');
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var json=new Array();
		var sql = 'select Cart.CartId,Cart.UserId,Cart.ProductId,Cart.Qty,Cart.Price,Cart.SubTotal,Cart.Total,Product.Name,Product.Image from Cart inner join Product on Cart.ProductId=Product.ProductId where Cart.UserId=?';
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[userId],
			function(err,results) {
				if((results.rows.length)>0){
					
					//console.log(results);
					for(i=0;i<results.rows.length;i++){
						var p=results.rows[i];
						json.push({"UserId":p.UserId,"ProductId":p.ProductId,"ProductName":p.Name,"ProductImage":p.Image,"Qty":p.Qty,"Price":p.Price,"SubTotal":p.SubTotal,"Total":p.Total});
					}
					
					var total=0;
					var subtotal=0;
					
					var h='';
					for(i=0;i<json.length;i++){
						h+='<div class="cart-details">';
							h+='<div class="col s6">';
								h+='<img width="200px" height="200px" src="'+json[i].ProductImage+'" />';
							h+='</div>';
							h+='<div class="col s6">';
								h+='<div style="margin-top:20px"><h6><strong>'+json[i].ProductName+'</strong></h6></div>';
								h+='<div style="margin-top:10px"><h6>$ '+json[i].Price+'</h6></div>';
								h+='<div style="margin-top:20px">';
									h+='<input type="number" disabled style="width:20%" value="1"></input>';
									//h+='<div>';
										//h+='<button class="btn btn-default">+</button>';
										//h+='<button class="btn btn-default" style="margin-left:10px">-</button>';
									//h+='</div>';
								h+='</div>';
								h+='<div style="margin-top:10px">';
									h+='<button data-value="'+json[i].ProductId+'" onclick="removeItemFromCart(this)" class="btn btn-danger btnRemoveFromCart">Remove From Cart</button>';
								h+='</div>';
							h+='</div>';
						h+='</div>';
						
						subtotal+=json[i].SubTotal;
						total+=json[i].Total;
					}
					
					
					$(".subtotal").text("$ "+subtotal);
					$(".total").text("$ "+total);
					$(".cartdetail").html(h);
					
				}else{
					$(".subtotal").text("$ 0");
					$(".total").text("$ 0");
					alert("No Products are available in the cart");
				}
				//console.log(json);
			});
		}, errorCB, successCB);
	}
	
	function addToCart(productId,price){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var sql='',isInsert=true;
		var qty=1;
		var userId=localStorage.getItem("userid");
		
		sql = 'select count(ProductId) as TotalCount from Cart where UserId=? and ProductId=?';
		
		db.transaction(function (tx) {
		  var r=tx.executeSql(sql,[userId,productId],
			function(err,results) {
				
				//if(err)
				//console.log(err);	
				
				//console.log(results);
				
				if((results.rows.length)>0){
					qty=results.rows[0].TotalCount;
					isInsert=false;
				}
				
				if(isInsert==false && qty>0){
					qty=qty+1;
					//If item already exists in the cart then update it
					sql='Update Cart set Qty=?,Price=?,SubTotal=?,Total=? Where UserId=? and ProductId=?';
				}
				else{
					//else insert it in the cart table
					sql='INSERT OR REPLACE INTO Cart(Qty,Price,SubTotal,Total,UserId,ProductId) VALUES(?,?,?,?,?,?)';
					if(qty==0)
						qty=1;
				}
				
				if(userId==undefined){
					alert('You are not logged In');
					return;
				}
				
				db.transaction(function (tx) {
					userId=tx.executeSql(sql,[qty,price,(qty*price),(qty*price),userId,productId],
					function(err,results) {
						if((results.rowsAffected)>0){
							//console.log(results);
							for(i=0;i<results.rows.length;i++){
								var p=results.rows[i];
								json.push({"UserId":p.UserId,"ProductId":p.ProductId,"Qty":p.Qty,"SubTotal":p.SubTotal,"Total":p.Total});
							}
							
							//Update Quantity
							var sql = 'update Product set AvailableQty=AvailableQty-1 where ProductId=?';
				
							db.transaction(function (tx) {
								var d=tx.executeSql(sql,[productId],
								function(err,results) {
									
								});
							}, errorCB, successCB);
									
									alert('Added To Cart');
								}else{
									alert("Oops there was a problem saving this item in the cart");
								}
								//console.log(json);
							});
				}, errorCB, successCB);
						
					});
				});
	}
	
	function removeFromCart(productId){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var userId=localStorage.getItem("userid");
		var sql = 'delete from Cart where UserId=? and ProductId=?';
		
		db.transaction(function (tx) {
			var d=tx.executeSql(sql,[userId,productId],
			function(err,results) {
				if((results.rowsAffected)>0){
					alert("Item Removed From Cart Successfully!");
					
					//Update Quantity
					var sql = 'update Product set AvailableQty=AvailableQty+1 where ProductId=?';
		
					db.transaction(function (tx) {
						var d=tx.executeSql(sql,[productId],
						function(err,results) {
							
						});
					}, errorCB, successCB);
					
				}else{
					alert("Oops there was a problem!");
				}
			});
		}, errorCB, successCB);
		
	
	}
	
	function searchItem(searchText){
		
		$(".related-product").html('');
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);
		
		var json=new Array();
		var sql = "select ProductId,Name,Image,Price,AvailableQty,CategoryId from Product where Name like '%' || ? || '%'";
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[searchText],
			function(err,results) {
				if((results.rows.length)>0){
					console.log(results);
					for(i=0;i<results.rows.length;i++){
						var p=results.rows[i];
						json.push({"ProductId":p.ProductId,"Name":p.Name,"Image":p.Image,"Price":p.Price,"AvailableQty":p.AvailableQty,"CategoryId":p.CategoryId});
					}
					
					//Load html grid
					populateGrid(results,'');
					
				}else{
					alert("No Products are available in this category");
				}
				//console.log(json);
			});
		}, errorCB, successCB);
	}
	
	function populateGrid(results,categoryName){
		var h='<h5>'+categoryName+'</h5><div class="row nomar-bottom-lc">';
					for(i=0;i<results.rows.length;i++){
						h+='<div style="cursor:pointer" class="col s6">';
                              h+='<div onclick="callproductDetail('+results.rows[i].ProductId+')" class="related-product-content">';
                                 h+='<img height="200px" width="100px" src="'+results.rows[i].Image+'" alt="">';
                                 h+='<div class="product-cart">';
                                    h+='<ul class="i-pro-bottom">';
                                       h+='<li><a data-value="'+results.rows[i].ProductId+'" data-value-price="'+results.rows[i].Price+'" class="btnAddToCart"><i class="fa fa-shopping-cart"></i><span>ADD TO CART</span></a></li>';
                                    h+='</ul>';
                                 h+='</div>';
                                 h+='<div class="product-details">';
                                    h+='<h5><a href="">'+results.rows[i].Name+'</a></h5>';
                                    h+='<h4><a href="">$'+results.rows[i].Price+'</a></h4>';
                                 h+='</div>';
                              h+='</div>';
                           h+='</div>';
						
						if(i%2==0){
							//start a new div row
							h+='<div class="row nomar-bottom-lc">'
						}
					}
					h+='</div>';
					
					$(".related-product").append(h);
	}
	
	function callproductDetail(productId){
		localStorage.setItem("productId",productId);
		window.location.href='single-product.html';
	}
	
	function productDetail(productId){
		
		if(db==undefined)
			db = window.openDatabase("Shopping", "2.0", "ShoppingDB", 2*1024*1024);

		var sql = "select ProductId,Name,Image,Price,AvailableQty,CategoryId from Product where ProductId=?";
		db.transaction(function (tx) {
			userId=tx.executeSql(sql,[productId],
			function(err,results) {
				if((results.rows.length)>0){
					$(".productImage").attr('src',results.rows[0].Image);
					$(".productName").text(results.rows[0].Name);
					$(".productPrice").text("$ "+results.rows[0].Price);
					$(".productQty").text(results.rows[0].AvailableQty);
					$(".btnAddToCart").attr("data-value",results.rows[0].ProductId);
					$(".btnAddToCart").attr("data-value-price",results.rows[0].Price);
				}else{
					alert("No Products Detail Is Available");
				}
				//console.log(json);
			});
		}, errorCB, successCB);
	}
	
	function clearGrid(){
		$(".related-product").html('');
	}
	
	function clearRegister(){
		$("#txtName").val('');
		$("#txtEmail").val('');
		$("#txtPassword").val('');
	}
	
	//Login Page
	$("#btnLogin").click(function(e){
		if($("#txtEmail").val().trim()==''){
			errorCB('Please Enter Email');
			e.preventDefault();
			return false;
		}else if($("#txtPassword").val().trim()==''){
			errorCB('Please Enter Password');
			e.preventDefault();
			return false;
		}
		login($("#txtEmail").val(),$("#txtPassword").val());
		e.preventDefault();
	});
	
	//Register Page
	$("#btnRegister").click(function(e){
		if($("#txtName").val().trim()==''){
			errorCB('Please Enter Name');
			e.preventDefault();
			return false;
		}else if($("#txtEmail").val().trim()==''){
			errorCB('Please Enter Email');
			e.preventDefault();
			return false;
		}else if($("#txtPassword").val().trim()==''){
			errorCB('Please Enter Password');
			e.preventDefault();
			return false;
		}
		register($("#txtEmail").val(),$("#txtPassword").val(),$("#txtName").val());
		e.preventDefault();
	});
	
	//Save Profile
	$("#btnSaveProfile").click(function(e){
		if($("#txtName").val().trim()==''){
			errorCB('Please Enter Name');
			e.preventDefault();
			return false;
		}else if($("#txtEmail").val().trim()==''){
			errorCB('Please Enter Email');
			e.preventDefault();
			return false;
		}else if($("#txtPassword").val().trim()==''){
			errorCB('Please Enter Password');
			e.preventDefault();
			return false;
		}
		setMyProfile($("#txtEmail").val(),$("#txtPassword").val(),$("#txtName").val());
		e.preventDefault();
	});
	
	//Search
	$("#btnSearch").click(function(e){
		searchItem($("#txtSearchText").val());
	});	
	
	//Add To CART
	$(".btnAddToCart").click(function(e){
		var productId=$(this).attr('data-value');
		var price=$(this).attr('data-value-price');
		addToCart(productId,price);
		productDetail(productId);
	});
	
	
	//Remove From CART
	function removeItemFromCart(e){
		var r=confirm('Are you sure you want to remove this item?');
		if(r){
			var productId=$(e).attr('data-value');
			var userId=localStorage.getItem("userid");
			removeFromCart(productId);
			getCart(userId);
		}
	}   

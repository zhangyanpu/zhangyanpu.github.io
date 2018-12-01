;
(function (Vue) {
	// 注册一个全局自定义指令 `v-focus` 
	// 什么时候使用自定义指令：需要进行底层DOM操作的时候
	//定义指令的时候 不要加v-前缀
	Vue.directive('focus', {
		// 当被绑定的元素插入到 DOM 中时……
		inserted: function (el) {
			// 聚焦元素
			console.log(el);
			//打印<input placeholder="What needs to be done?" class="new-todo">
			el.focus();
		}
	});

	/* 注意全局自定义指令必须定义在vue实例化的前面，所有的dom元素都能引用
	而局部自定义指令必须定义在vue实例化的里面，只有在接管的dom元素范围内可以引用*/
	/* 注意Vue允许写原生js代码，但是Vue提倡用自定义指令对dom进行底层操作
	不要出现如document.getElementById('txt').focus()裸奔代码 */

	Vue.directive('auto-active', {
		// 当被绑定的元素插入到 DOM 中时……
		inserted: function (el) {
			console.log(el);
			var links = el.getElementsByTagName("a");
			links = Array.from(links); //es6语法把伪数组转化为真正的数组
			links.forEach(function (link) {
				link.onclick = function () {
					links.forEach(function (link) {
						link.className = "";
					});
					this.className = "selected";
				}
			});

		}
	});
	// 注意大小写
	'use strict';

	// Your starting point. Enjoy the ride!
	/* new Vue({
		el: "#todoapp",
		data: {
			msg: "hellow"
		}
	});
	//1.测试vue包是否正确下载和引用 */
	var todos = [{
			id: 1,
			title: "预习",
			completed: false
		},
		{
			id: 2,
			title: "睡觉",
			completed: true
		},
		{
			id: 3,
			title: "LOV",
			completed: false
		},
	];
	var app = new Vue({
		el: "#todoapp",
		data: {


			//第八大步，筛选数据
			/* filterStat:"active",
			刷新网页，让它显示未完成数据 */
			filterStat: "all",
			//刷新网页让它显示所有数据
			// 第七大步，编辑任务项
			currentItem: false,
			// 第一大步，数据列表渲染 （对data属性的处理）
			// todos,
			/* 末尾一步 4*/
			// 从本地读取数据 字符串----->数组  JSON.parse()
			/* 注意若无增加或删除元素时，没有本地存储，则为空字符串*/
			todos:JSON.parse(window.localStorage.getItem("todos")||"[]")
			// isseen:false
			// leftNum:todos.length
			/*//显示所有未完成的任务数方法1：该方法缺点，由于静态属性，当页面第一次刷新，只执行一次，故定义为
			方法
			leftNum: todos.filter(item=>!item.completed).length */

		},
		/* 注意不要把todos数组定义在vue实例化对象内，
			只有将todos的数组定义为全局变量，才能在实例化vue对象中引用
			todos.length, */
			/* 末尾一步 3*/
			/* 计算属性computed确实有watch功能，但是计算属性一般用于需要返回数据的功能
			watch一般用于定义自己的业务功能，它不是让你去模板绑定，纯粹让你监视这个成员的
			改变，可以自定义一些业务功能 */
		watch: {
			/* todos:function(newVal,oldVal)
			{
				// watch默认只监视一层，仅监视删除或增加的元素，即增删元素时
				执行该函数,我们需要它深度监视，监视修改的元素，即修改元素时，也能
				本地存储
				// console.log(this.todos);
				// window.localStorage.setItem("todos",JSON.stringify(newVal));
				与下行代码等价 
				window.localStorage.setItem("todos",JSON.stringify(this.todos));

			} */
			todos: {
				handler:function (newVal, oldVal) {
					window.localStorage.setItem("todos", JSON.stringify(this.todos));

				},
				deep:true
			}
		},
		/* 第六大步，显示所有未完成的任务数
		//显示所有未完成的任务数方法3(完美版) */
		computed: {
			/* 定义计算属性 leftNum本质上是一个函数 但是使用的时候当属性用，即在模板中
				用leftNum属性，如<strong>{{leftNum}}</strong> item left</span>代码，
				不能用leftNum()函数调用  计算属性（函数的返回值）依赖data中completed个数的数据，假如数据（
			   如改变了任务项的completed的真假值，或者，新增了并改变任务项的个数）一变,计算属性会重新执行，
			   但是会缓存,后面假如有再次用到的话  直接用之前缓存结果 */
			leftNum: function () {
				console.log("hehe");
				return this.todos.filter(item => !item.completed).length;
			},
			/*//vue官网-->列表渲染-->过滤排序结果-->创建返回过滤或排序数组的计算属性的api
				   all 返回所有的todos
				   active 返回所有completed为false
				   completed 返回所有completed为true
				*/
			filterTodos: function () {
				if (this.filterStat == "all") {
					return this.todos;
				} else if (this.filterStat == "active") {
					return this.todos.filter(item => !item.completed);
				} else {
					return this.todos.filter(item => item.completed);
				}
			},
			// // 第九大步 全选联动效果
			toggleAllStat: function () {
				/*  有一个item.completed的值为false，则返回false，（
				包含两种情况，1 取消选中已添加任务项的复选框
				2新添加了任务项并增加任务项的个数） */
				return this.todos.every(item => item.completed);
			}
		},
		methods: {
			// 第二大步，添加任务 （对方法属性的处理）
			// addTodo:function(){
			// addTodo:()=>console.log(this)//箭头函数中的this指window对象
			addTodo(event) {
				//es6语法
				// console.log(this);//this指vue实例化对象addTodo
				// 1.获取用户输入的任务
				//console.log(event);
				// if(event.keyCode==13){
				/* 4.用if语句的dom的方法实现按回车键把输入的任务添加到任务列表中
				而不是按键弹起就触发事件 ,用vue方法改进，直接在@keyup.enter="addTodo"
				加enter属性*/
				var title = event.target.value.trim()
				// trim() 函数返回去掉开头和结尾空格后的字符串。
				// console.log(title);
				/*5.当输入的内容为空格时，不能添加空任务 用if语句处理输入的数据不能为空格 */
				if (title == "") {
					return;
				}
				/* 完善功能，当数组为空时，不能添加数据，故需完善 
				// var id=this.todos[this.todos.length-1].id+1*/
				var lastTodo = this.todos[this.todos.length - 1];
				var id = lastTodo ? lastTodo.id + 1 : 1;
				// console.log(id);
				/* 2.将输入的任务，弹起键盘后，添加到任务列表中
				( 把用户的任务添加到todos数组中) */
				this.todos.push({
					id,
					title,
					completed: false
				});
				/*3.添加完成后 清空文本框的值 */
				event.target.value = "";
				/* 持久化todos
				本地存储，存储的是字符串（存到本地磁盘，刷新页面时，重新读上一次保存的数据，
				相当于小型数据库） */
				// 数组--->字符串，JSON.stringify()
				/* 当增加一条数据时，控制台--->Application--->localstorage
				--->file//--->key:todos  value:hello */
				// window.localStorage.setItem("todos","hello");
				/* 增加一条数据，刷新页面时，重新读上一下保存在
				todos数组里面的所有数据 */
				/* 末尾一步，2 增加或删除元素时，原始方法本地存储，再用watch
				改进优化代码 */
				// window.localStorage.setItem("todos",JSON.stringify(this.todos));


			},
			/* 第三大步 标记所有任务完成，或所有未完成 */
			toggleAll(event) {
				//console.log(111);//测试事件是否绑定成功
				//    console.log(event.target.checked);//选中打印true
				var completed = event.target.checked;
				/* es6语法，当函数的参数只要一个时，省小括号，当执行体只有
				一条语句时，省大括号 */
				/* this.todos.forEach( function(element){
     element.completed=completed;
	}); */
				this.todos.forEach(element =>
					element.completed = completed
				);

			},
			/* 第四大步 删除单个任务项
			注意若removeTodo函数手动传了形参，则默认event事件实参就不起效，必须加
			$event,event事件才能生效，给button标签绑定click事件 */
			removeTodo(index, $event) {
				// console.log(0);
				// this.todos.splice(0,1);
				// console.log(index);
				console.log($event);
				this.todos.splice(index, 1);
				/* 末尾一步 1*/
				/* 删除数组里面的元素时，本地存储剩下的元素 */
				// window.localStorage.setItem("todos",JSON.stringify(this.todos));
			},
			/* 第五大步 删除所有已完成的任务 */
			removeCompleted() {
				// console.log(0);
				//想办法把todos中完成的任务删除
				/* this.todos.forEach(function(item,index){
					if(item.completed){
						// this.todos.splice(index,1);//报错 this.todos为定义
						// console.log(this);//this未定义，普通函数中的this指window对象
						//把vue的实例化对象赋给一个变量
						app.todos.splice(index,1); 
						}
				});
						//此方法有问题，删除元素不彻底，不能用es6的forEach语法，在遍历数组中删除
						数组的元素，因为index索引值，是系统设置好的，无法index--.
						手动控制，*/
				/* // 可行的方案，但复杂
					for(let i=0; i<this.todos.length; i++) {
						if(app.todos[i].completed) {
							this.todos.splice(i,1);
							i--;
						}
					} */
				/* app.todos=app.todos.filter(function(item){
					return !item.completed;
				}); */
				this.todos = this.todos.filter(item => !item.completed);



			},
			/* //显示所有未完成的任务数方法2
			采用的普通方法，模板中用函数调用，返回结果作用于模板，一旦视图发生改变，则
				该方法会被重新调用，只要绑定该方法的地方都会执行
				leftNum() {
					console.log("haha");
					// console.log(this.todos);//检验this是否为vue实例化对象
					return  this.todos.filter(item=>!item.completed).length;
				}
				*/
			// 保存编辑 按回车或失去焦点
			saveEdit(item, index, event) {
				/* 函数的形参任意设置，故$event可以改为event,一般与
				函数模板语法@keyup.enter="saveEdit(item,index,$event)"保持一致,
				而函数模板语法的参数必须与v-for="(item,index) of todos"保持一致 */
				// 1 拿到文本框的值
				var editText = event.target.value.trim();
				//2 对文本框进行非空校验
				if (!editText.length) {
					// 字符串有length属性
					// 从todos数组中删除该元素
					return this.todos.splice(index, 1);
					// return作用仅仅是退出函数体
				}
				// 测试删除功能
				// 假如文本框值不是空 直接修改当前任务项标题
				item.title = editText;
				// 测试保存功能		
				// 3对非空数据按回车保存后 去除editing样式
				this.currentItem = null;
			}
		},
		// 自定义局部指令
		directives: {
			// 指令名称 可以驼峰式命名 也可以为字符串（当有连接符，要加双引号）但视图中使用指令统一用v-editing-focus
			editingFocus: {
				/* 钩子函数
				bind: function(el) {
				   console.log(el.parentElement);  
				},//bind找不到父亲元素，只调用一次，指令第一次绑定到元素时调用。
				//注意虽然在一个label元素上加了自定义局部指令，但由于循环，打印
				三条记录
				inserted: function (el) {
					console.log(el.parentElement);
					//inserted能找到父亲元素，被绑定元素插入父节点时调用
				},*/
				update: function (el, binding) {
					/* var editObj=el.parentElement.parentElement.getElementsByClassName("edit")[0];
					console.log(editObj);
					//打印三个input元素,虽然有最终效果，
					//但是为三个input元素同时加focus，不合逻辑，需改进
					editObj.focus();
					//el：指令所绑定的元素，可以用来直接操作 DOM  */
					/* //方法比较复杂
					console.log(binding.value);//true
					if(binding.value){
						var editObj=el.parentElement.parentElement.getElementsByClassName("edit")[0];
						console.log(editObj);//打印一个input
						editObj.focus();	
					} */
					if (binding.value) {
						console.log(el);
						el.focus();
					}
					//console.log(binding.value);											
					/* if(binding.value) {
						el.focus();		
					}	 */
					//console.log("update");//更新局部页面时调用	
				}
				/*,
				componentUpdated:function() {
					console.log("componentUpdated");  
					//更新局部页面时调用	
				},
				unbind:function() {
					console.log("unbind");  
				  }*/
			}
		}
	});
	// console.log(app.addTodo);
	/* 八 2 */
	window.onhashchange = function () {
		// console.log(window.location.hash);
		/* #/
		   #/active
		   #/completed */
		//    console.log(window.location.hash.substr(2));
		var hash = window.location.hash.substr(2) || "all";
		//    console.log(hash);
		app.filterStat = hash;
	}

})(Vue); // 注意大小写

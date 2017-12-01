var interval = null
	var Node = function(object) {
		for (var key in object)
		{
			this[key] = object[key];
		}
	};
	var NodeList = function(k) {
		this.nodes = [];
		this.k = k;
	};
	NodeList.prototype.add = function(node){
		this.nodes.push(node)
	}
	NodeList.prototype.calculateRanges = function() {
		this.areas = {min: 1000000, max: 0};
		this.rooms = {min: 1000000, max: 0};
		for (var i in this.nodes)
		{
			if (this.nodes[i].rooms < this.rooms.min)
			{
				this.rooms.min = this.nodes[i].rooms;
			}

			if (this.nodes[i].rooms > this.rooms.max)
			{
				this.rooms.max = this.nodes[i].rooms;
			}

			if (this.nodes[i].area < this.areas.min)
			{
				this.areas.min = this.nodes[i].area;
			}

			if (this.nodes[i].area > this.areas.max)
			{
				this.areas.max = this.nodes[i].area;
			}
		}

	};
	NodeList.prototype.determineUnknown = function() {

		this.calculateRanges();

		/*
		 * Loop through our nodes and look for unknown types.
		 */
		for (var i in this.nodes)
		{

			if ( ! this.nodes[i].type)
			{
				/*
				 * If the node is an unknown type, clone the nodes list and then measure distances.
				 */
				
				/* Clone nodes */
				this.nodes[i].neighbors = [];
				for (var j in this.nodes)
				{
					if ( ! this.nodes[j].type)
						continue;
					this.nodes[i].neighbors.push( new Node(this.nodes[j]) );
				}

				/* Measure distances */
				this.nodes[i].measureDistances(this.areas, this.rooms);

				/* Sort by distance */
				this.nodes[i].sortByDistance();

				/* Guess type */
				console.log(this.nodes[i].guessType(this.k));
				data.push({area: this.nodes[i].area, rooms: this.nodes[i].rooms, type: this.nodes[i].guess.type})

			}
		}
	};
	Node.prototype.measureDistances = function(area_range_obj, rooms_range_obj) {
		var rooms_range = rooms_range_obj.max - rooms_range_obj.min;
		var area_range  = area_range_obj.max  - area_range_obj.min;

		for (var i in this.neighbors)
		{
			/* Just shortcut syntax */
			var neighbor = this.neighbors[i];

			var delta_rooms = neighbor.rooms - this.rooms;
			delta_rooms = (delta_rooms ) / rooms_range;

			var delta_area  = neighbor.area  - this.area;
			delta_area = (delta_area ) / area_range;

			neighbor.distance = Math.sqrt( delta_rooms*delta_rooms + delta_area*delta_area );
		}
	};
	Node.prototype.sortByDistance = function() {
		this.neighbors.sort(function (a, b) {
			return a.distance - b.distance;
		});
	};
	Node.prototype.guessType = function(k) {
		var types = {};

		for (var i in this.neighbors.slice(0, k))
		{
			var neighbor = this.neighbors[i];

			if ( ! types[neighbor.type] )
			{
				types[neighbor.type] = 0;
			}

			types[neighbor.type] += 1;
		}

		var guess = {type: false, count: 0};
		for (var type in types)
		{
			if (types[type] > guess.count)
			{
				guess.type = type;
				guess.count = types[type];
			}
		}

		this.guess = guess;

		return types;
	};
	NodeList.prototype.draw = function(canvas_id) {
		var rooms_range = this.rooms.max - this.rooms.min;
		var areas_range = this.areas.max - this.areas.min;

		var canvas = document.getElementById(canvas_id);
		console.log(canvas)
		var ctx = canvas.getContext("2d");
		var width = 400;
		var height = 400;
		ctx.clearRect(0,0,width, height);

		for (var i in this.nodes)
		{
			ctx.save();

			switch (this.nodes[i].type)
			{
				case 'turquesa':
					ctx.fillStyle = '#1abc9c';
					break;
				case 'esmeralda':
					ctx.fillStyle = '#2ecc71';
					break;
				case 'lightblue':
					ctx.fillStyle = '#3498db';
					break;
				case 'lightpurple':
					ctx.fillStyle = '#9b59b6';
					break;
				case 'almostblack':
					ctx.fillStyle = '#34495e';
					break;
				case 'greensea':
					ctx.fillStyle = '#16a085';
					break;
				case 'darkgreen':
					ctx.fillStyle = '#27ae60';
					break;
				case 'belizehole':
					ctx.fillStyle = '#2980b9';
					break;
				case 'darpurple':
					ctx.fillStyle = '#8e44ad';
					break;
				case 'midnigth':
					ctx.fillStyle = '#2c3e50';
					break;
				case 'sunflower':
					ctx.fillStyle = '#f1c40f';
					break;
				case 'carrot':
					ctx.fillStyle = '#e67e22';
					break;
				case 'allizarin':
					ctx.fillStyle = '#e74c3c';
					break;
				case 'clouds':
					ctx.fillStyle = '#ecf0f1';
					break;
				case 'concrete':
					ctx.fillStyle = '#95a5a6';
					break;
				case 'orange':
					ctx.fillStyle = '#f39c12';
					break;
				case 'pumpkin':
					ctx.fillStyle = '#d35400';
					break;
				case 'darred':
					ctx.fillStyle = '#c0392b';
					break;
				case 'silver':
					ctx.fillStyle = '#bdc3c7';
					break;
				case 'darkgray':
					ctx.fillStyle = '#7f8c8d';
					break;
				default:
					ctx.fillStyle = '#666666';
			}
			var padding = 40;
			var x_shift_pct = (width  - padding) / width;
			var y_shift_pct = (height - padding) / height;

			var x = (this.nodes[i].rooms - this.rooms.min) * (width  / rooms_range) * x_shift_pct + (padding / 2);
			var y = (this.nodes[i].area  - this.areas.min) * (height / areas_range) * y_shift_pct + (padding / 2);
			y = Math.abs(y - height);


			ctx.translate(x, y);
			ctx.beginPath();

			// switch (this.nodes[i].type)
			// {
			// 	case 'turquesa':
					ctx.arc(0, 0, 5, 0, Math.PI*2, true);
			// 		break;
			// 	case 'green':
			// 		ctx.fillRect(0, 0, 10, 10)
			// 		break;
			// 	case 'blue':
			// 		ctx.moveTo(0, 0);
			// 		ctx.lineTo(-5, 10);
			// 		ctx.lineTo(5, 10);
			// 		break;
			// 	default:
			// 		ctx.arc(0, 0, 5, 0, Math.PI*2, true);
			// }

			ctx.fill();
			ctx.closePath();

			if ( ! this.nodes[i].type )
			{
				switch (this.nodes[i].type)
			{
				case 'turquesa':
					ctx.strokeStyle = '#1abc9c';
					break;
				case 'esmeralda':
					ctx.strokeStyle = '#2ecc71';
					break;
				case 'lightblue':
					ctx.strokeStyle = '#3498db';
					break;
				case 'lightpurple':
					ctx.strokeStyle = '#9b59b6';
					break;
				case 'almostblack':
					ctx.strokeStyle = '#34495e';
					break;
				case 'greensea':
					ctx.strokeStyle = '#16a085';
					break;
				case 'darkgreen':
					ctx.strokeStyle = '#27ae60';
					break;
				case 'belizehole':
					ctx.strokeStyle = '#2980b9';
					break;
				case 'darpurple':
					ctx.strokeStyle = '#8e44ad';
					break;
				case 'midnigth':
					ctx.strokeStyle = '#2c3e50';
					break;
				case 'sunflower':
					ctx.strokeStyle = '#f1c40f';
					break;
				case 'carrot':
					ctx.strokeStyle = '#e67e22';
					break;
				case 'allizarin':
					ctx.strokeStyle = '#e74c3c';
					break;
				case 'clouds':
					ctx.strokeStyle = '#ecf0f1';
					break;
				case 'concrete':
					ctx.strokeStyle = '#95a5a6';
					break;
				case 'orange':
					ctx.strokeStyle = '#f39c12';
					break;
				case 'pumpkin':
					ctx.strokeStyle = '#d35400';
					break;
				case 'darred':
					ctx.strokeStyle = '#c0392b';
					break;
				case 'silver':
					ctx.strokeStyle = '#bdc3c7';
					break;
				case 'darkgray':
					ctx.strokeStyle = '#7f8c8d';
					break;
				default:
					ctx.strokeStyle = '#666666';
			}

				var radius = this.nodes[i].neighbors[this.k - 1].distance * width;
				radius *= x_shift_pct;
				ctx.beginPath();
				ctx.arc(0, 0, radius, 0, Math.PI*2, true);
				ctx.stroke();
				ctx.closePath();

			}

			ctx.restore();

		}

	};

	var run = function() {
		nodes = new NodeList(5);
		for (var i in data)
		{
			nodes.add( new Node(data[i]) );
		}
		var random_rooms = Math.round( Math.random() * 2000 );
		var random_area = Math.round( Math.random() * 2000 );
		nodes.add( new Node({rooms: random_rooms, area: random_area, type: false}) );

		nodes.determineUnknown();
		nodes.draw("canvas");
	};
	var data = []
	createData = function(){
		let types = ['turquesa','esmeralda',' lightblue','lightpurple','almostblack','greensea','darkgreen','belizehole',
		'darpurple','midnigth','sunflower','carrot','allizarin','clouds','concrete','orange','pumpkin','darred','silver','darkgray']
		for(var i = 0; i < 20; i++){
			for(var ct = 0; ct < 2; ct++){
				var random_rooms = Math.round( Math.random() * 2000 );
				var random_area = Math.round( Math.random() * 2000 );
				data.push({type: types[i], area: random_area, rooms: random_rooms})
			}
		}
	}

	createData()
	run()
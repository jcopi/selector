var getSlicePath = function (angle, radius) {
	var length = 2 * radius;
	var corners = [P(length, 0), P(length, length), P(0, length), P(0, 0)];
	var initial = P(radius, 0);
	var path = [initial];

	var cornerCount = Math.round((angle / 90) % 4);
	for (var i = 0; i < cornerCount; i++) path.push(corners[i]);
	var x,y, rad = angle * (Math.PI / 180);
	if (cornerCount === 0) {
		y = 0;
		x = radius + (radius * Math.tan(rad));
	} else if (cornerCount === 1) {
		x = length;
		if (angle != 90) y = radius - (radius / Math.tan(rad));
		else y = radius;
	} else if (cornerCount === 2) {
		y = length;
		if (angle != 180) x = radius - (radius * Math.tan(rad));
		else x = radius;
	} else if (cornerCount === 3) {
		x = 0;
		if (angle != 270) y = radius + (radius / Math.tan(rad));
		else y = radius;
	} else if (cornerCount === 4) {
		y = 0;
		if (angle != 360) x = radius + (radius * Math.tan(rad));
		else x = radius;
	}
	path.push(P(x, y));
	path.push(P(radius, radius))

	return path;
}
var P = function (x,y) {
	return ({
		"x":x,
		"y":y
	});
}

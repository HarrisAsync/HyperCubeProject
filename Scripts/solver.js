"use strict";

//const { default: Decimal } = require('decimal.js');
//let math = require('mathjs')

const config = {
    number: 'BigNumber',
    precision: 200
};
const ROUNDING_PRECISION = config.precision - 50;
if (ROUNDING_PRECISION < 0) {
    throw new RangeError("ROUND_PRECISION must bee greater or equal to zero");
}

math.config(config);

const bignumber = math.bignumber;
const matrix = math.matrix;

//const TRIANGLE_UNIT_HEIGHT = math.divide(math.sqrt(bignumber("3")), bignumber("2"));

const GRADIENTS = {
    major_diag: math.tan(math.unit(120, "deg")),
    anti_diag: math.tan(math.unit(-120, "deg")),
    flat: bignumber("0"),
    is_valid(direction) {
        return (direction === this.major_diag || direction === this.anti_diag || direction === this.flat);
    },
    validate(direction) {
        if (!this.is_valid(direction)) {
            throw new TypeError("Gradient is not a valid gradient");
        }
    }
}

const ENTRY = {
    top_left: new Object(),
    bottom_right: new Object(),
    is_valid(entry) {
        return (entry === this.top_left || entry === this.bottom_right);
    },
    validate(entry) {
        if (!this.is_valid(entry)) {
            throw new TypeError("Entry is not a valid entry");
        }
    }
}

class Point {
    constructor(x = bignumber(0), y = bignumber(0)) {
        if (!(Decimal.isDecimal(x) && Decimal.isDecimal(y))) {
            throw new TypeError("Values must be of datatype: math.bignumber");
        }

        if (!(x.isFinite() && y.isFinite())) {
            throw new RangeError("Values can not be infinite");
        }

        this._x = x;
        this._y = y;
    }
    map(func) {
        return new Point(func(this.x), func(this.y));
    }
    get magntitude() {
        return math.sqrt(math.add(math.pow(this._x, "2"), math.pow(this._y, "2")));
    }
    get array() {
        return [this._x, this._y];
    }
    set array(new_val) {
        this._x = bignumber(new_val[0]);
        this._y = bignumber(new_val[1]);
    }
    get x() {
        return this._x;
    }
    set x(new_val) {
        this._x = bignumber(new_val);
    }
    get y() {
        return this._y;
    }
    set y(new_val) {
        this._y = bignumber(new_val);
    }
    normalize(length = bignumber("1")) {
        if (!Decimal.isDecimal(length)) {
            throw "Length needs to be of type: math.bignumber";
        }
        let normalise_val = (x) => math.multiply(math.divide(x, this.magntitude), length);
        let new_point = new Point(normalise_val(this._x), normalise_val(this._y));

        return new_point;
    }
    static add(point_1, point_2) {
        return new Point(math.add(point_1.x, point_2.x), math.add(point_1.y, point_2.y));
    }
    static subtract(point_1, point_2) {
        return new Point(math.subtract(point_1.x, point_2.x), math.subtract(point_1.y, point_2.y));
    }
    multiply(value) {
        if (!Decimal.isDecimal(value)) {
            throw "value needs to be of type: math.bignumber";
        }
        return new Point(math.multiply(this.x, value), math.multiply(this.y, value));
    }
    clone() {
        return new Point(this.x, this.y);
    }
    get angle() {
        let unit_vector = this.normalize();
        return math.atan(math.divide(unit_vector.y, unit_vector.x));
    }
    set angle(new_angle) {
        let magnitude = this.magntitude;

        this.x = math.multiply(math.cos(new_angle), magnitude);
        this.y = math.multiply(math.sin(new_angle), magnitude);
    }
    map(func) {
        return new Point(func(this.x), func(this.y));
    }
    eq(other_point) {
        return this.x.eq(other_point.x) && this.y.eq(other_point.y);
    }
    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}

class Linear_equation {
    constructor(gradient = 0, intercept = 0) {
        this._gradient = new bignumber(gradient);
        this._intercept = new bignumber(intercept);
    }
    get gradient() {
        return this._gradient;
    }
    set gradient(new_val) {
        this._gradient = new bignumber(new_val);
    }
    get intercept() {
        return this._intercept;
    }
    set intercept(new_val) {
        this._intercept = new bignumber(new_val);
    }
    calc(x_val) {
        return math.add(math.multiply(this._gradient, x_val), this._intercept);
    }
    get matrix_form() {
        return [this._gradient.negated(), new bignumber(1)];
    }
    get column_value() {
        return this._intercept;
    }
    toString() {
        return `y = ${this._gradient} * x + ${this._intercept}`;
    }
    static intersect(equation_1, equation_2) {
        if (!(equation_1 instanceof this && equation_2 instanceof this)) {
            throw new TypeError("Equations not of linear equation type")
        }

        let variable_matrix = [equation_1.matrix_form, equation_2.matrix_form];
        let constant_matrix = [equation_1.column_value, equation_2.column_value];
        let solution = math.lusolve(variable_matrix, constant_matrix);

        let formatted_solution = new Point(bignumber(solution[0][0]), bignumber(solution[1][0]));

        // Returns a the datatype: number if answers are zero.
        return formatted_solution;
    }
    from_points(var_1, var_2, var_3, var_4) {
        let point_1, point_2;

        if (var_3 == undefined && var_4 == undefined) {
            // Two points are given
            let is_matrix = (x) => math.typeOf(x) == "Array" && math.size(x) == 2;

            if (is_matrix(var_1) && is_matrix(var_2)) {
                function generate_point(variable) {
                    return new Point(variable[0], variable[1]);
                };

                point_1 = generate_point(var_1);
                point_2 = generate_point(var_2);
            } else if (var_1 instanceof Point && var_2 instanceof Point) {
                point_1 = var_1;
                point_2 = var_2;
            } else {
                throw new TypeError("Incorrect datatype given!");
            }
        } else {
            // Two pairs of x and y values are given
            let x_1 = var_1;
            let y_1 = var_2;
            let x_2 = var_3;
            let y_2 = var_4;

            if (Decimal.isDecimal(x_1) && Decimal.isDecimal(y_1) && Decimal.isDecimal(x_2) && Decimal.isDecimal(y_2)) {
                throw new TypeError("Please supply only math.bignumber!");
            }

            point_1 = new Point(x_1, y_1);
            point_2 = new Point(x_2, y_2);
        }

        let delta_y = math.subtract(point_2.y, point_1.y);
        let delta_x = math.subtract(point_2.x, point_1.x);

        let gradient = math.divide(delta_y, delta_x);
        let intercept = math.add(math.multiply(gradient.negated(), point_1.x), point_1.y);

        this._gradient = gradient;
        this._intercept = intercept;

        return this;
    }
    from_gradient_point(gradient, point) {
        if (!(Decimal.isDecimal(gradient))) {
            throw new TypeError("gradient must be of datatype: math.bignumber");
        }

        if (!(point instanceof Point)) {
            throw new TypeError("point must be instance of Point");
        }

        this._gradient = gradient;
        this._intercept = math.add(math.multiply(gradient.negated(), point.x), point.y);

        return this;
    }
}

class Wall {
    constructor(endpoint_1, endpoint_2, reflection_direction, range_checker = (x, y) => true) {
        GRADIENTS.validate(reflection_direction);

        if (!(endpoint_1 instanceof Point && endpoint_2 instanceof Point)) {
            throw new TypeError("Endpoints must be of type: Point");
        }

        this._equation = new Linear_equation().from_points(endpoint_1, endpoint_2);
        this._reflection_direction = reflection_direction;

        this._range_checker = range_checker;

        //this._x_range = [math.min(endpoint_1.x, endpoint_2.x), math.max(endpoint_1.x, endpoint_2.x)];
        //this._y_range = [math.min(endpoint_1.y, endpoint_2.y), math.max(endpoint_1.y, endpoint_2.y)];
    }
    set range_checker(new_val) {
        this._range_checker = new_val;
    }
    get range_checker() {
        return this._range_checker;
    }
    get equation() {
        return this._equation;
    }
    get reflection_direction() {
        return this._reflection_direction;
    }
    collide(laser) {
        if (!(laser instanceof Laser)) {
            throw new TypeError("Laser not correct datatype");
        }
        let intersection = Linear_equation.intersect(this.equation, laser.equation);

        if (this.range_checker(intersection.x, intersection.y)) {
            // Is within range
            return intersection;
        } else {
            // Is not within range
            return false;
        }
    }
}

class Table {
    constructor(tile_width, tile_height, entry) {
        if (!(Decimal.isDecimal(tile_width) && Decimal.isDecimal(tile_height))) {
            throw new TypeError("Values need to be of type: math.bignumber");
        }
        let range_check = (x) => bignumber(0).lt(x) && x.isFinite();
        if (!(range_check(tile_width) && range_check(tile_height))) {
            throw new RangeError("Values must be greater than 0 and not infinity");
        }

        this.entry = entry;
        this._tile_width = tile_width;
        this._tile_height = tile_height;

        // Cos 30 degrees
        let cos_constant = math.divide(math.sqrt(bignumber(3)), bignumber(2));
        // Sin 30 degrees
        let sin_constant = math.divide(bignumber(1), bignumber(2));

        // How much the top side is shifted to the right by 
        let top_x_shift = math.multiply(this.tile_height, sin_constant);

        // Compute bounding height and width values
        this._actual_height = math.multiply(this.tile_height, cos_constant);
        this._actual_width = math.add(this._tile_width, top_x_shift);

        this._coordinates = {
            top_left: new Point(top_x_shift, this._actual_height),
            top_right: new Point(this._actual_width, this._actual_height),
            bottom_left: new Point(bignumber("0"), bignumber("0")),
            bottom_right: new Point(this._tile_width, bignumber("0")),
        }

        let coordinates = this._coordinates;
        let round = (val, mode) => bignumber(val.toPrecision(Table.ROUNDING_PRECISION, mode));

        this._possible_reflections_map = new Map();

        if (this.entry === ENTRY.bottom_right) {
            this._walls = {
                left: new Wall(this.coordinates.top_left, this.coordinates.bottom_left, GRADIENTS.flat),
                right: new Wall(this.coordinates.top_right, this.coordinates.bottom_right, GRADIENTS.major_diag),
                bottom: new Wall(this.coordinates.bottom_left, this.coordinates.bottom_right, GRADIENTS.major_diag),
                top: new Wall(this.coordinates.top_left, this.coordinates.top_right, GRADIENTS.anti_diag),
            }

            this._walls.left.range_checker = (x, y) => {
                return round(x, Decimal.ROUND_UP).lt(coordinates.top_left.x);
            }

            this._walls.top.range_checker = (x, y) => {
                return coordinates.top_left.x.lt(round(x, Decimal.ROUND_DOWN));
            }

            // ORDER MATTERS
            this._possible_reflections_map.set(GRADIENTS.major_diag, [this._walls.left, this._walls.top]);
            this._possible_reflections_map.set(GRADIENTS.anti_diag, [this._walls.bottom]);
            this._possible_reflections_map.set(GRADIENTS.flat, [this._walls.right]);
        } else {
            this._walls = {
                left: new Wall(this.coordinates.top_left, this.coordinates.bottom_left, GRADIENTS.major_diag),
                right: new Wall(this.coordinates.top_right, this.coordinates.bottom_right, GRADIENTS.flat),
                bottom: new Wall(this.coordinates.bottom_left, this.coordinates.bottom_right, GRADIENTS.anti_diag),
                top: new Wall(this.coordinates.top_left, this.coordinates.top_right, GRADIENTS.major_diag),
            }

            this._walls.bottom.range_checker = (x, y) => {
                return round(x, Decimal.ROUND_UP).lt(coordinates.bottom_right.x);
            }

            this._walls.right.range_checker = (x, y) => {
                return coordinates.bottom_right.x.lt(round(x, Decimal.ROUND_DOWN));
            }

            // ORDER MATTERS
            this._possible_reflections_map.set(GRADIENTS.major_diag, [this._walls.bottom, this._walls.right]);
            this._possible_reflections_map.set(GRADIENTS.anti_diag, [this._walls.top]);
            this._possible_reflections_map.set(GRADIENTS.flat, [this._walls.left]);
        }
    }
    get entry() {
        return this._entry;
    }
    set entry(new_val) {
        ENTRY.validate(new_val);
        this._entry = new_val;
    }
    static get ROUNDING_PRECISION() {
        return ROUNDING_PRECISION;
    }
    get_possible_collisions(direction) {
        GRADIENTS.validate(direction);
        return this._possible_reflections_map.get(direction);
    }
    get walls() {
        return this._walls;
    }
    _validate_num(value) {
        if (Decimal.isDecimal(value) && (bignumber(0).lt(value) && value.isFinite())) {
            return true;
        } else {
            throw new RangeError("Value not in correct bounds");
        }
    }
    get tile_width() {
        return this._tile_width;
    }
    get tile_height() {
        return this._tile_height;
    }
    get actual_height() {
        return this._actual_height;
    }
    get actual_width() {
        return this._actual_width;
    }
    get coordinates() {
        return this._coordinates;
    }
    toString() {
        let coords = this.coordinates;
        return `Top-left: ${coords.top_left.toString()}, Top-right: ${coords.top_right.toString()}, Bottom-left: ${coords.bottom_left.toString()}, Bottom-right: ${coords.bottom_right.toString()}`;
    }
}

class Laser {
    constructor(table, target = bignumber(0)) {
        this.gradient = GRADIENTS.major_diag;
        this.table = table;

        if (!(Decimal.isDecimal(target))) {
            throw new TypeError("Target needs to be of datatype: bignumber");
        }

        this._target = target;
        let point;
        if (table.entry === ENTRY.bottom_right) {
            point = table.coordinates.bottom_right;
            this._exit = table.coordinates.top_right;
        } else {
            point = table.coordinates.top_left;
            this._exit = table.coordinates.bottom_right;
        }

        this.equation = new Linear_equation().from_gradient_point(this.gradient, point);
        this._path = [point];
    }
    get exit() {
        return this._exit;
    }
    get target() {
        return this._target;
    }
    get equation() {
        return this._equation;
    }
    set equation(new_value) {
        if (!(new_value instanceof Linear_equation)) {
            throw new TypeError("New value must be instance of Linear equation");
        }
        this._equation = new_value;
    }
    get table() {
        return this._table;
    }
    set table(new_value) {
        if (!(new_value instanceof Table)) {
            throw new TypeError("New value must be instance of Table");
        }
        this._table = new_value;
    }
    get gradient() {
        return this._gradient;
    }
    set gradient(new_gradient) {
        GRADIENTS.validate(new_gradient);
        this._gradient = new_gradient;
    }
    number_of_bounces() {
        return this._path.length - 1;
    }
    add_point(point) {
        if (!(point instanceof Point)) {
            throw new TypeError("point must be instance of: Point");
        }
        this._path.push(point);
    }
    get path() {
        return this._path;
    }
    get state() {
        return this._state;
    }
    set state(new_value) {
        GRADIENTS.validate(new_value);
        this._state = new_value;
    }
    collide(number_of_bounces) {
        for (let count = 0; count < number_of_bounces; count++) {
            let has_collided = false;
            for (let wall of this.table.get_possible_collisions(this.gradient)) {
                let collision_result = wall.collide(this);
                if (collision_result instanceof Point) {
                    let round = (num) => bignumber(num.toPrecision(Table.ROUNDING_PRECISION));
                    if (collision_result.map(round).eq(new Point(this.target, bignumber(0)))) {
                        if (!(this.path[this.path.length - 1].eq(collision_result))) {
                            this.path.push(collision_result);
                        }
                        return true;
                    }

                    this.gradient = wall.reflection_direction;
                    this.add_point(collision_result);
                    this.equation = new Linear_equation().from_gradient_point(this.gradient, collision_result);
                    has_collided = true;
                    break;
                }
            }
            if (has_collided === false) {
                if (!(this.path[this.path.length - 1].eq(this.exit))) {
                    this.path.push(this.exit);
                }
                return true;
            }
        }
        return false;
    }
}

function solve_billards(width, length, number_of_bounces, target = bignumber(0)) {
    let t0 = performance.now()

    let table = new Table(width, length, ENTRY.top_left);
    let laser = new Laser(GRADIENTS.major_diag, ENTRY.top_left, table, target);
    laser.collide(number_of_bounces);

    /*
    let abe = "[";
    for (let point of laser.path) {
        abe += (`[${point.x}, ${point.y}],`)
    }
    abe += "]";
    console.log(abe);
    */

    let t1 = performance.now()

    console.log(`Solving took: ${(math.round(t1 - t0))} milliseconds`);

    return laser.path;
}

/*
const { performance } = require('perf_hooks');

let t0 = performance.now()

let result = solve_billards(bignumber(5), bignumber(3), 100);

let t1 = performance.now()

console.log(t1 - t0);
console.log(result)

let line_a = new Linear_equation();
let line_b = new Linear_equation();

line_a.from_points([bignumber(0), bignumber(0)], [bignumber(2), bignumber(2)]);
line_b.from_points(bignumber(-1), bignumber(-1), bignumber(-2), bignumber(-2))

console.log((Linear_equation.intersect(line_a, line_b)));
*/
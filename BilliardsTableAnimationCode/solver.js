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

const DIRECTIONS = {
    diagonal_up: math.tan(math.unit(120, "deg")),
    diagonal_down: math.tan(math.unit(-120, "deg")),
    straight_right: bignumber("0"),
    is_valid(direction) {
        return (direction === this.diagonal_up || direction === this.diagonal_down || direction === this.straight_right);
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
        if (!DIRECTIONS.is_valid(reflection_direction)) {
            throw new TypeError("Reflection state is not the correct reference");
        }
        if (!(endpoint_1 instanceof Point && endpoint_2 instanceof Point)) {
            throw new TypeError("Endpoints must be of type: Point");
        }

        this._equation = new Linear_equation().from_points(endpoint_1, endpoint_2);
        this._reflection_direction = reflection_direction;

        this._range_checker = range_checker;

        //this._x_range = [math.min(endpoint_1.x, endpoint_2.x), math.max(endpoint_1.x, endpoint_2.x)];
        //this._y_range = [math.min(endpoint_1.y, endpoint_2.y), math.max(endpoint_1.y, endpoint_2.y)];
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
    constructor(tile_width, tile_height) {
        if (!(Decimal.isDecimal(tile_width) && Decimal.isDecimal(tile_height))) {
            throw new TypeError("Values need to be of type: math.bignumber");
        }
        let range_check = (x) => bignumber(0).lt(x) && x.isFinite();
        if (!(range_check(tile_width) && range_check(tile_height))) {
            throw new RangeError("Values must be greater than 0 and not infinity");
        }

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

        this._walls = {
            left: new Wall(this.coordinates.top_left, this.coordinates.bottom_left, DIRECTIONS.straight_right, (x, y) => {
                return round(x, Decimal.ROUND_UP).lt(coordinates.top_left.x);
            }),
            right: new Wall(this.coordinates.top_right, this.coordinates.bottom_right, DIRECTIONS.diagonal_up),
            bottom: new Wall(this.coordinates.bottom_left, this.coordinates.bottom_right, DIRECTIONS.diagonal_up),
            top: new Wall(this.coordinates.top_left, this.coordinates.top_right, DIRECTIONS.diagonal_down, (x, y) => {
                return coordinates.top_left.x.lt(round(x, Decimal.ROUND_DOWN));
            }),
        }

        this._possible_reflections_map = new Map();
        // ORDER MATTERS
        this._possible_reflections_map.set(DIRECTIONS.diagonal_up, [this._walls.left, this._walls.top]);
        this._possible_reflections_map.set(DIRECTIONS.diagonal_down, [this._walls.bottom]);
        this._possible_reflections_map.set(DIRECTIONS.straight_right, [this._walls.right]);
    }
    static get ROUNDING_PRECISION() {
        return ROUNDING_PRECISION;
    }
    get_possible_collisions(direction) {
        if (!DIRECTIONS.is_valid(direction)) {
            throw new TypeError("Direction needs to be a valid direction");
        }
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
    constructor(direction, point, table, target = bignumber(0)) {
        this.direction = direction;
        this.table = table;
        
        if (!(Decimal.isDecimal(target))) {
            throw new TypeError("Target needs to be of datatype: bignumber");
        }

        this._target = target;
        this.equation = new Linear_equation().from_gradient_point(this.direction, point);
        this._path = [point];
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
    get direction() {
        return this._direction;
    }
    set direction(new_direction) {
        if (!DIRECTIONS.is_valid(new_direction)) {
            throw new TypeError("New value must be from direction")
        }
        this._direction = new_direction;
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
        if (!DIRECTIONS.is_valid(new_value)) {
            throw new RangeError("state must point to correct object from STATES constant");
        }
        this._state = new_value;
    }
    collide(number_of_bounces) {
        for (let count = 0; count < number_of_bounces; count++) {
            let has_collided = false;
            for (let wall of this.table.get_possible_collisions(this.direction)) {
                let collision_result = wall.collide(this);
                if (collision_result instanceof Point) {
                    let round = (num) => bignumber(num.toPrecision(Table.ROUNDING_PRECISION));
                    if (collision_result.map(round).eq(new Point(this.target, bignumber(0)))) {
                        if (!(this.path[this.path.length - 1].eq(collision_result))) {
                            this.path.push(collision_result);
                        }
                        return true;
                    }

                    this.direction = wall.reflection_direction;
                    this.add_point(collision_result);
                    this.equation = new Linear_equation().from_gradient_point(this.direction, collision_result);
                    has_collided = true;
                    break;
                }
            }
            if (has_collided === false) {
                if (!(this.path[this.path.length - 1].eq(this.table.coordinates.top_left))) {
                    this.path.push(this.table.coordinates.top_left);
                }
                return true;
            }
        }
        return false;
    }
}

function solve_billards(width, length, number_of_bounces, target = bignumber(0)) {
    let t0 = performance.now()

    let table = new Table(width, length);
    let laser = new Laser(DIRECTIONS.diagonal_up, table.coordinates.bottom_right, table, target);
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
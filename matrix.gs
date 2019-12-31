
function filterMatrixBlanks(M) {

    var filtered = [];
    for( var i = 0; i < M.length; i++){
        for( var j = 0; j < M[i].length; j++ ) {
            if (typeof(M[i][j]) == "number") {
                if ( j == 0 ) {
                    filtered[i] = [];
                }
                filtered[i][j] = M[i][j];
            }
        }
    }

    //return "Filtered rows = " + filtered.length + ", cols = " + filtered[0].length;   //filtered;
    return filtered;

}


/**
 *  Helper function to initialize arrays without using Arrays.fill
 *
 */
function init_array(rows, cols, value) {

    result = [];

    //init the grid matrix
    for ( var i = 0; i < rows; i++ ) {
        result[i] = [];
        for (var j = 0; j < cols; j++) {
            result[i][j] = value;
        }
    }
    return result;
}



/**
 * Print a matrix nicely for the console.
 *
 * @param  {Array} matrix  The m x n matrix to output.  Matrices are simple 2 dimensional arrays.
 */
// Print a matrix formatted nicely
function pretty_print_matrix(mat) {
    for ( var i = 0; i < mat.length; i++) {
        process.stdout.write("[ ");
        for ( var j = 0; j < mat[i].length; j ++) {
            if ( j != 0) {
                process.stdout.write(", ");
            }
            process.stdout.write( " " + mat[i][j] + " ");
        }
        process.stdout.write("] \n");
    }
}

/**
 *  Extract a column vector at column index x from the matrix.
 *
 * @param  {[][]} matrix  The m x n matrix to output.  Matrices are simple 2 dimensional arrays.
 * @param  {Number} x     The column index to extract
 * @return {[][]}         The column vector of the matrix (one element per row)
 */
function column(mat, x) {
    //var col = new Array(mat.length).fill(0).map( function() { new Array(1).fill(0) });
    var col = init_array(mat.length, 1, 1    );

    for (var i = 0; i < mat.length; i ++) {
        col[i][0] = mat[i][x];
    }
    return col;
}

/**
 *  Multiply 2 matrices together.  Note matrices must be compatible, n == r.  Output is a m x s matrix.
 *
 * @param  {[][]} m1  An m x n matrix
 * @param  {[][]} m2  An r x s matrix
 * @return {[][]}     The output product
 */
function multiply_matrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }

    // If the result is a scalar dot product, just return the scalar value
    // This simplifies the results with vector dot products
    if (result.length == 1 && result[0].length == 1) {
        return result[0][0];
    }
    return result;
}

/**
 *  Multiple a matrix and a simple scalar value
 *
 * @param  {[][]} m    An m x n matrix
 * @param  {Number} s  The scalar to multiply the entries by
 * @return {[][]}      The output product
 */
function multiply_matrix_scalar(m, s) {
    var result = [];
    for (var i = 0; i < m.length; i++) {
        result[i] = [];
        for (var j = 0; j < m[0].length; j++) {
            result[i][j] = m[i][j] * s;
        }
    }
    return result;
}

/**
 *  Transpose a matrix
 *
 * @param  {[][]} matrix   An m x n matrix
 * @return {[][]}          The output matrix with rows and columns transposed
 */
function transpose(matrix) {
//    return matrix[0].map(  function(col, i) { matrix.map(function(row) { row[i] } ) });
//    return matrix[0].map((col, i) => matrix.map(row => row[i]));
    var newArray = [];
    for(var i = 0; i < matrix[0].length; i++){
        newArray.push([]);
    };

    for(var i = 0; i < matrix.length; i++){
        for(var j = 0; j < matrix[0].length; j++){
            newArray[j].push(matrix[i][j]);
        };
    };

    return newArray;
}


/**
 *  deep copy an array object with nested elements
 *
 * @param  {Object}   The object to copy
 * @return {Object}   The copied output object
 */
function deep_copy(a) {
    return JSON.parse(JSON.stringify(a));
}


/**
 *  Sum the squared differences of 2 vectors
 *
 * @param  {[][]} v1   An m x 1 vector
 * @param  {[][]} v2   An m x 1 vector
 * @return {Number}    The sum of the squared differences
 */
function squared_difference(v1, v2) {
    var sum = 0.0;
    for (var i = 0; i < v1.length; i ++) {
        sum = sum + Math.pow( v1[i] - v2[i], 2 );
    }
    return sum;
}


/**
 *  Subtract matrices A - B  Note matrices must be compatible equal sizes
 *
 * @param  {[][]} m1  An m x n matrix
 * @param  {[][]} m2  An r x s matrix
 * @return {[][]}     The output difference
 */
function subtract_matrices(A,B) {
    var result = [];
    for (var i = 0; i < A.length; i++) {
        result[i] = [];
        for (var j = 0; j < A[0].length; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
}

//
/**
 *  Utility function to simplify a vector into a standard array
 *
 * @param  {[][]} v1   An m x 1 vector
 * @return {Array}    A simple array of the vector values
 */
function flatten_vector(v) {
    var v_new = [];
    for (var i = 0; i < v.length; i++) {
        v_new[i] = v[i][0];
    }
    return v_new;
}

/**
 *  Normalize a vector, divide by the length
 *
 * @param v
 * @return {*[][]}
 */
function normalize_vector(v) {
    var len = Math.sqrt( multiply_matrices(transpose(v), v));
    var unit_vector = multiply_matrix_scalar(v, 1.0 / len);
    return unit_vector;
}

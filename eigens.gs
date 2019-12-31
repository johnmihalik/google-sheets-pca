/**
 * A self contained implementation of eigendecompostiion using the power iteration method and
 * shifting by deflation.  This implementation uses a simple array based matrix implementation
 * to allow this code to be embedded without external dependencies.
 *
 *   See:  https://en.wikipedia.org/wiki/Power_iteration
 */


function calcEigens() {

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.getRange('Portfolio!C20:L29').copyTo(ss.getRange('PCA!C101:C111'), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);

}

/**
 *  Compute the eigenvalue and eigenvector decomposition of a matrix.  The matrix must be symetric.
 *
 *  @return {Array[]} A 2 dimensional array.  The first row are the eigenvalues followed by colummns of the cooresponding eigenvectors.
 *
 *  @customfunction
 */
function eigens(input) {

    try {

        var M = filterMatrixBlanks(input);

        var E = __eigens(M, 0.001, 100);

        var eigenvalues = E[0];
        var eigenvectors = E[1];

        // Format the output as a M+1 x M multi-dimensional array
        var out = [];

        // The eigenvalues form the first row.
        out[0] = E[0];

        // The subsequent columns under each eigenvalue are the eigenvectors
        eigenvectors = transpose(eigenvectors);
        for (var i = 0; i < eigenvectors.length; i++ ) {
            out[i+1] = eigenvectors[i];
        }

        return out;

    } catch( ex ) {
        return "Error: " + ex;
    }

}


/**
 *  Compute the eigenvalues of a matrix.  The matrix must be symetric.
 *
 *  @return {Array} The eigenvalues of the matrix.
 *
 *  @customfunction
 */
function eigenvalues(input) {

    try {

        var E = eigens(input)
        return E[0];

    } catch( ex ) {
        return "Error: " + ex;
    }

}


/**
 *  Compute the eigenvectors of a matrix.  The matrix must be symetric.
 *
 *  @return {Array[]} The eigenvectors of the matrix as column vectors.
 *
 *  @customfunction
 */
function eigenvectors(input) {

    try {

        var E = eigens(input)
        return E.slice(1);

    } catch( ex ) {
        return "Error: " + ex;
    }

}



/**
 *  Power Iteration algorithm for eigenvector decomposition.  Computes the greatest eigenvalue of
 *  the input matrix and its corresponding eigenvector.  Input matrix MUST be diagonalizable.
 *
 *  See: https://en.wikipedia.org/wiki/Power_iteration
 *
 *
 * @param  {[][]} M   An m x n matrix
 * @param  {Number}   The convergence tolerance
 * @param  {Number}   The maximum iteration to allow before convergence
 * @return {[]}       An array with the eigenvalue and the eigenvector
 */
function power_iteration(M, tolerance, max_iterations) {

    var rank = M.length;

    // Initialize the first guess pf the eigenvector to a row vector of the sqrt of the rank
    //var eigenvector = new Array(rank).fill(0).map( function() {new Array(1).fill(Math.sqrt(rank)) });
    var eigenvector = init_array(rank,1,Math.sqrt(rank));

    // Compute the corresponding eigenvalue
    var eigenvalue = eigenvalue_of_vector(M, eigenvector);

    var epsilon = 1.0;
    var iterations = 0;
    do {

        var old_eigenvalue = deep_copy(eigenvalue);

        // Multiply the Matrix M by the guessed eigenveector
        var Mv = multiply_matrices(M,eigenvector);

        // Normalize the eigenvector to unit length
        eigenvector = normalize_vector(Mv);

        // Calculate the associated eigenvalue with the eigenvector (transpose(v) * M * v)
        eigenvalue = eigenvalue_of_vector(M, eigenvector);

        // Calculate the epsilon of the differences
        epsilon = Math.abs( eigenvalue - old_eigenvalue);
        iterations++;

    } while (epsilon > tolerance && iterations < max_iterations);

    return [eigenvalue, eigenvector];
}

/**
 *  Compute all of the eigenvectors/values for a given matrix.  Uses shifting deflation
 *  with power iteration.
 *
 *  See: http://mlwiki.org/index.php/Power_Iteration#Finding_Other_Eigenvectors
 *
 *
 * @param  {[][]} M   An m x n matrix
 * @param  {Number}   The convergence tolerance
 * @param  {Number}   The maximum iteration to allow before convergence
 * @return {[]}       An array with the eigenvalues and the eigenvectors
 */
function __eigens(M, tolerance, max_iterations) {

    var eigenvalues = [];
    var eigenvectors = [];

    for (var i = 0; i < M.length; i++ ) {

        // Compute the remaining most prominent eigenvector of the matrix M
        var result = power_iteration(M, tolerance, max_iterations);

        // Separate the eigenvalue and vector from the return array
        var eigenvalue = result[0];
        var eigenvector = result[1];

        eigenvalues[i] = eigenvalue;

        // Compress the eigenvector to a simple array for eas of manipulation
        eigenvectors[i] = flatten_vector(eigenvector);

        // Now remove or peel off the last eigenvector
        M = shift_deflate(M, eigenvalue, eigenvector);
    }

    return [eigenvalues, eigenvectors];
}


/**
 *   Uses deflation to compute remaining eigenvectors.  At each iteration the most
 *   prominent eigenvector is computed.  This eigenvectors contribution is then
 *   removed from the original input matrix iteratively until all eigenvectors have
 *   been computed.
 *
 *   See: https://math.stackexchange.com/questions/768882/power-method-for-finding-all-eigenvectors
 *
 * @param  {[][]} m1  An m x n matrix
 * @param  {[][]} m2  An r x s matrix
 * @return {[][]}     The output difference
 */
function shift_deflate(M, eigenvalue, eigenvector)  {
    var len = Math.sqrt( multiply_matrices(transpose(eigenvector), eigenvector)  );
    var U = multiply_matrix_scalar(eigenvector, 1.0/len);
    var delta = multiply_matrix_scalar( multiply_matrices(U, transpose(U)) , eigenvalue);
    var M_new = subtract_matrices(M, delta);
    return M_new;
}

/**
 *  Computes the eigenvalue for the input eigenvector.
 *
 *     lambda = transpose(v) * M * v
 *
 * @param M
 * @param eigenvector
 * @return {*[][]}
 */
function eigenvalue_of_vector(M, eigenvector) {
    // Xt * M * x
    ev = multiply_matrices( multiply_matrices(transpose(eigenvector), M ), eigenvector);
    return ev;
}



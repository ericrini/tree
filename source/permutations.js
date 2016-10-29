/**
 * All permutations of "abc".
 *
 * a        b        c
 * b c      a c      a b
 * c  b     c   a    b   a
 *
 */
function permutations(string) {
    var result = [];

    for (var i = 0; i < string.length; i++) {
        var next = string.slice(i, i + 1);
        var remaining = string.slice(0, i) + string.slice(i + 1);
        var remainingPermutations = permutations(remaining);

        if (remainingPermutations.length === 0) {
            result.push(next);
        }
        else {
            for (var j = 0; j < remainingPermutations.length; j++) {
                result.push(next + remainingPermutations[j])
            }
        }
    }

    return result;
}
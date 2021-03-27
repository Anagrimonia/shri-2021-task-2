"use strict";
exports.__esModule = true;
function wordEnd(n, word, end1, end2, end3) {
    if (Number(String(n).length) > 2)
        n = n % 100;
    if (n == 11 || n == 12 || n == 13 || n == 14)
        return word + end3;
    else {
        switch (n % 10) {
            case 1:
                return word + end1;
                break;
            case 2:
            case 3:
            case 4:
                return word + end2;
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0:
                return word + end3;
                break;
        }
    }
    return "";
}
exports["default"] = wordEnd;

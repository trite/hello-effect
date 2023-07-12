"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var Function_1 = require("@effect/data/Function");
var Effect = require("@effect/io/Effect");
var Exit = require("@effect/io/Exit");
var Random = require("@effect/io/Random");
var Cause = require("@effect/io/Cause");
var divide = function (a, b) {
    return b === 0
        ? Effect.fail(new Error('Cannot divide by zero'))
        : Effect.succeed(a / b);
};
var log2 = function (msg) {
    return function (a) {
        return Effect.sync(function () { return console.log(msg, a); });
    };
};
// const getRandom = (): Effect.Effect<never, never, number> =>
//   Effect.sync(() => Math.random());
var pipeStyleProgram = (0, Function_1.pipe)(Random.next, Effect.tap(log2('Initial random value: ')), Effect.map(function (x) { return Math.floor(x * 10); }), Effect.tap(log2('*10 and rounded down: ')), Effect.flatMap(function (x) { return divide(10, x); }));
var doNotationProgram = Effect.gen(function (_) {
    var random, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [5 /*yield**/, __values(_(Random.next))];
            case 1:
                random = _a.sent();
                return [5 /*yield**/, __values(_(log2('Initial random value: ')(random)))];
            case 2:
                _a.sent();
                return [5 /*yield**/, __values(_(Effect.sync(function () { return Math.floor(random * 10); })))];
            case 3:
                x = _a.sent();
                return [5 /*yield**/, __values(_(log2('*10 and rounded down: ')(x)))];
            case 4:
                _a.sent();
                return [5 /*yield**/, __values(_(divide(10, x)))];
            case 5: return [2 /*return*/, _a.sent()];
        }
    });
});
function runLog(effect) {
    return (0, Function_1.pipe)(effect, Effect.runSyncExit, Exit.match({
        onFailure: function (err) { return console.log("Failed with ".concat(Cause.pretty(err))); },
        // onFailure: (err) => Effect.logCause(err),
        onSuccess: function (val) {
            return console.log("Succeeded dividing 10 by last result: ".concat(val));
        },
    }));
}
// This can only be false
var test1ValueFalse = false;
var test1ValueTrue = true;
// Can be true or false
var test2ValueFalse = false;
var test2ValueTrue = true;
/* --- These are equivalent to one another, just different styles: --- */
// Pipe-style may be familiar to those with a pipe-style FP language background
// Also likely familiar to anyone used to Unix/Windows shell/bash/PS
// runLog(pipeStyleProgram);
// Do-notation will be familiar to folks who come from a Haskell background
// It can also feel more familiar to anyone used to imperative languages
// runLog(doNotationProgram);

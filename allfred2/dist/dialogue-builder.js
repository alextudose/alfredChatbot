"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var builder = require("claudia-bot-builder");
var Pause = builder.fbTemplate.Pause;
var List = builder.fbTemplate.List;
var Button = builder.fbTemplate.Button;
var Attachment = builder.fbTemplate.Attachment;
var ChatAction = builder.fbTemplate.ChatAction;
var altfred_smart_1 = require("./altfred-smart");
var isUrl = require('./utils/is-url');
var breakText = require('./utils/breaktext');
exports.defaultAction = Symbol("a default action");
exports.location = Symbol("a location");
exports.onText = Symbol("a typed response");
exports.onLocation = Symbol("a location");
exports.onImage = Symbol("an image");
exports.onAudio = Symbol("a voice recording");
exports.onVideo = Symbol("a video");
exports.onFile = Symbol("a file");
var ordinals = ['first', 'second', 'third', 'forth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
var UnexpectedInputError = (function () {
    function UnexpectedInputError(message, repeatQuestion) {
        if (repeatQuestion === void 0) { repeatQuestion = true; }
        this.message = message;
        this.repeatQuestion = repeatQuestion;
    }
    return UnexpectedInputError;
}());
exports.UnexpectedInputError = UnexpectedInputError;
var UndefinedHandlerError = (function (_super) {
    __extends(UndefinedHandlerError, _super);
    function UndefinedHandlerError(handler) {
        var _this = this;
        var keys = Object.getOwnPropertySymbols(handler).map(function (symbol) { return /Symbol\((.*)\)/.exec(symbol.toString())[1]; });
        _this = _super.call(this, "Sorry, I didn't quite catch that" + (keys.length === 0 ? '' : ", I was expecting " + keys.join(' or '))) || this;
        return _this;
    }
    return UndefinedHandlerError;
}(UnexpectedInputError));
var Directive = (function () {
    function Directive(text) {
        this.text = text;
    }
    Directive.prototype.toString = function () {
        return this.text;
    };
    return Directive;
}());
exports.Directive = Directive;
var Expect = (function (_super) {
    __extends(Expect, _super);
    function Expect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Expect;
}(Directive));
exports.Expect = Expect;
var Goto = (function (_super) {
    __extends(Goto, _super);
    function Goto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Goto;
}(Directive));
exports.Goto = Goto;
var BaseTemplate = (function () {
    function BaseTemplate() {
        this.template = {};
    }
    BaseTemplate.prototype.getReadingDuration = function () { return this.template.text.match(/\w+/g).length * 250; };
    BaseTemplate.prototype.setBaseUrl = function (url) { return this; };
    BaseTemplate.prototype.setNotificationType = function (type) {
        if (type !== 'REGULAR' && type !== 'SILENT_PUSH' && type !== 'NO_PUSH')
            throw new Error('Notification type must be one of REGULAR, SILENT_PUSH, or NO_PUSH');
        this.template.notification_type = type;
        return this;
    };
    BaseTemplate.prototype.addQuickReply = function (text, payload, imageUrl) {
        if (!text || !payload)
            throw new Error('Both text and payload are required for a quick reply');
        if (payload.length > 1000)
            throw new Error('Payload can not be more than 1000 characters long');
        if (imageUrl && !isUrl(imageUrl))
            throw new Error('Image has a bad url');
        if (!this.template.quick_replies)
            this.template.quick_replies = [];
        if (this.template.quick_replies.length === 11)
            throw new Error('There can not be more than 11 quick replies');
        if (text.length > 20)
            text = breakText(text, 20)[0];
        var quickReply = {
            content_type: 'text',
            title: text,
            payload: payload,
        };
        if (imageUrl)
            quickReply.image_url = imageUrl;
        this.template.quick_replies.push(quickReply);
        return this;
    };
    BaseTemplate.prototype.addQuickReplyLocation = function () {
        if (!this.template.quick_replies)
            this.template.quick_replies = [];
        if (this.template.quick_replies.length === 11)
            throw new Error('There can not be more than 11 quick replies');
        var quickReply = {
            content_type: 'location'
        };
        this.template.quick_replies.push(quickReply);
        return this;
    };
    BaseTemplate.prototype.get = function () {
        return this.template;
    };
    return BaseTemplate;
}());
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(text) {
        var _this = _super.call(this) || this;
        if (!text)
            throw new Error('Text is required for text template');
        _this.template = {
            text: text
        };
        return _this;
    }
    return Text;
}(BaseTemplate));
var Ask = (function (_super) {
    __extends(Ask, _super);
    function Ask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Ask;
}(Text));
function say(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Text(String.raw.apply(String, [template].concat(substitutions)).replace(/([\s]) +/g, '$1'));
}
exports.say = say;
function ask(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Ask(String.raw.apply(String, [template].concat(substitutions)).replace(/([\s]) +/g, '$1'));
}
exports.ask = ask;
function expect(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Expect(String.raw.apply(String, [template].concat(substitutions)));
}
exports.expect = expect;
function goto(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Goto(String.raw.apply(String, [template].concat(substitutions)));
}
exports.goto = goto;
function audio(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Attachment(String.raw.apply(String, [template].concat(substitutions)), 'audio');
}
exports.audio = audio;
function video(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Attachment(String.raw.apply(String, [template].concat(substitutions)), 'video');
}
exports.video = video;
function image(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Attachment(String.raw.apply(String, [template].concat(substitutions)), 'image');
}
exports.image = image;
function file(template) {
    var substitutions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        substitutions[_i - 1] = arguments[_i];
    }
    return new Attachment(String.raw.apply(String, [template].concat(substitutions)), 'file');
}
exports.file = file;
function buttons(id, text, handler) {
    var buttons = new Button(text);
    buttons.identifier = "buttons '" + id + "'";
    buttons.postbacks = [];
    Object.keys(handler).forEach(function (key, i) {
        var payload = "'" + key + "' button in buttons '" + id + "'";
        buttons.addButton(key, payload).postbacks.push([payload, handler[key]]);
    });
    return buttons;
}
exports.buttons = buttons;
function list(id, type, bubbles, handler) {
    var list = new List(type);
    list.identifier = "list '" + id + "'";
    list.postbacks = [];
    bubbles.forEach(function (bubble, index) {
        var title = bubble[0], subtitle = bubble[1], image = bubble[2], handler = bubble[3];
        list.addBubble(title, subtitle);
        if (image)
            list.addImage(image);
        if (handler[exports.defaultAction]) {
            var payload = "default action of " + ordinals[index] + " bubble of list '" + id + "'";
            list.addDefaultAction(payload).postbacks.push([payload, handler[exports.defaultAction]]);
        }
        Object.keys(handler).forEach(function (key, i) {
            var payload = "'" + key + "' button in " + ordinals[index] + " bubble of list '" + id + "'";
            list.addButton(key, payload).postbacks.push([payload, handler[key]]);
        });
    });
    Object.keys(handler).forEach(function (key, i) {
        var payload = "'" + key + "' button in list '" + id + "'";
        list.addListButton(key, payload).postbacks.push([payload, handler[key]]);
    });
    return list;
}
exports.list = list;
function dialogue(name, script) {
    var builder = script;
    builder.dialogueName = name;
    return builder;
}
exports.dialogue = dialogue;
var Dialogue = (function () {
    function Dialogue(builder, storage, logger) {
        var context = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            context[_i - 3] = arguments[_i];
        }
        var _this = this;
        this.build = function () { return _this.script = builder.apply(void 0, context); };
        this.build();
        this.handlers = new Map();
        this.logger = logger;
        var templates = new Set();
        var labels = new Map();
        var expects = new Map();
        var gotos = [];
        for (var line = 0; line < this.script.length; line++) {
            var value = this.script[line];
            if (value instanceof Expect) {
                if (expects.has(value.toString()))
                    throw new Error("Duplicate expect statement found on line " + line + ": expect `" + value + "`");
                expects.set(value.toString(), line);
                var handler = this.script[++line];
                if (!handler || handler instanceof Directive || handler instanceof BaseTemplate)
                    throw new Error("Expect statement must be followed by a response handler on line " + line + ": expect `" + value + "`");
                if (handler.hasOwnProperty(exports.location) && handler.hasOwnProperty(exports.onLocation))
                    throw new Error("Both location and onLocation implemented in the same response handler on line " + line + ": expect `" + value + "`");
            }
            else if (typeof value === 'string') {
                var label = value.startsWith('!') ? value.substring(1) : value;
                if (labels.has(label))
                    throw new Error("Duplicate label found on line " + line + ": '" + value + "'");
                labels.set(label, line);
            }
            else if (value instanceof Goto) {
                gotos.push({ line: line, label: value.toString() });
            }
            else if (value instanceof BaseTemplate) {
                if (templates.has(value.identifier))
                    throw new Error("Duplicate identifier found on line " + line + " for " + value.identifier);
                if (value.identifier)
                    templates.add(value.identifier);
                (value.postbacks || []).forEach(function (p) { return _this.handlers.set(p[0], p[1]); });
            }
            else if (value !== null) {
                throw new Error("Response handler must be preceded by an expect statement on line " + JSON.stringify(this.script, null, 2));
            }
        }
        if (labels.size == this.script.length)
            throw new Error('Dialogue cannot be empty');
        var goto = gotos.find(function (g) { return !labels.has(g.label); });
        if (goto)
            new Error("Could not find label referenced on line " + goto.line + ": goto `" + goto.label + "`");
        this.state = new State(storage, this.logger, expects, labels);
    }
    Dialogue.prototype.execute = function (directive) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.state.retrieveState()];
                    case 1:
                        _a.sent();
                        this.state.jump(directive, "Dialogue.execute(" + directive.constructor.name.toLowerCase() + " `" + directive.toString() + "`)");
                        return [2];
                }
            });
        });
    };
    Dialogue.prototype.setKeywordHandler = function (keywords, handler) {
        var _this = this;
        var keys = keywords instanceof Array ? keywords : [keywords];
        var undo = function () {
            _this.outputFilter = function (o) { return o instanceof Ask; };
            _this.state.undo(2);
        };
        var h = handler === 'restart' ? function () { return _this.state.restart(); } : handler === 'undo' ? undo : handler;
        keys.forEach(function (k) { return _this.handlers.set("keyword '" + k.toLowerCase() + "'", h); });
    };
    Dialogue.prototype.process = function (message, processor) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var output, payload, line, processResponse_1, e_1, data, i, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.state.retrieveState()];
                    case 1:
                        _a.sent();
                        this.logger.info(message);
                        output = [];
                        if (!message.originalRequest.postback) return [3, 2];
                        payload = message.originalRequest.postback.payload;
                        processor.consumePostback(payload) || processor.consumeKeyword(payload)
                            || this.logger.info("Postback received with unknown payload '" + payload + "'");
                        return [3, 7];
                    case 2:
                        if (!!processor.consumeKeyword(message.text)) return [3, 7];
                        line = this.state.startLine;
                        if (!(line > 0)) return [3, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 7]);
                        processResponse_1 = function (line) { return __awaiter(_this, void 0, void 0, function () {
                            var result, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4, processor.consumeResponse(this.script[line - 1])];
                                    case 1:
                                        result = _b.sent();
                                        if (!(result instanceof Directive))
                                            return [2];
                                        line = this.state.jump(result, "expect `" + this.script[line - 2].toString() + "`");
                                        _a = result instanceof Expect;
                                        if (!_a) return [3, 3];
                                        return [4, processResponse_1(line)];
                                    case 2:
                                        _a = (_b.sent());
                                        _b.label = 3;
                                    case 3:
                                        _a;
                                        return [2];
                                }
                            });
                        }); };
                        return [4, processResponse_1(line)];
                    case 4:
                        _a.sent();
                        return [3, 7];
                    case 5:
                        e_1 = _a.sent();
                        if (!(e_1 instanceof UnexpectedInputError)) {
                            throw e_1;
                        }
                        this.state.undo(1);
                        return [4, altfred_smart_1.default(message.text)];
                    case 6:
                        data = _a.sent();
                        this.logger.info(data);
                        output.push(new Text(data.receiver));
                        this.outputFilter = function (o) { return e_1.repeatQuestion ? o instanceof Ask : false; };
                        return [3, 7];
                    case 7:
                        if (this.state.isComplete) {
                            throw [];
                        }
                        this.build();
                        i = this.state.startLine;
                        _a.label = 8;
                    case 8:
                        if (!(i < this.script.length)) return [3, 14];
                        element = this.script[i];
                        if (!(element instanceof BaseTemplate)) return [3, 9];
                        if (!this.outputFilter || this.outputFilter(element))
                            output.push(element);
                        return [3, 13];
                    case 9:
                        if (!(element instanceof Goto)) return [3, 10];
                        i = this.state.jump(element, i) - 1;
                        return [3, 13];
                    case 10:
                        if (!(typeof element === 'string')) return [3, 11];
                        if (element.startsWith('!'))
                            return [3, 14];
                        return [3, 13];
                    case 11:
                        if (!(element instanceof Expect)) return [3, 13];
                        return [4, this.state.complete(element)];
                    case 12:
                        _a.sent();
                        return [2, output.length == 0 ? [] :
                                processor.addQuickReplies(output[output.length - 1], this.script[i + 1])
                                    .insertPauses(output).map(function (e) { return e.get(); })];
                    case 13:
                        i++;
                        return [3, 8];
                    case 14: return [4, this.state.complete()];
                    case 15:
                        _a.sent();
                        return [2, output.length == 0 ? [] : processor.insertPauses(output).map(function (e) { return e.get(); })];
                }
            });
        });
    };
    Dialogue.prototype.consume = function (message, apiRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, this.process(message, {
                        consumeKeyword: function (keyword) {
                            return this.consumePostback("keyword '" + keyword.toLowerCase() + "'");
                        },
                        consumePostback: function (identifier) {
                            var handler = _this.handlers.get(identifier);
                            if (!handler)
                                return false;
                            var goto = handler();
                            goto instanceof Goto && _this.state.jump(goto, identifier);
                            return true;
                        },
                        consumeResponse: function (handler) {
                            if (Object.getOwnPropertyNames(handler).length == 0 && Object.getOwnPropertySymbols(handler).length == 0)
                                return;
                            var handle = function (handler, invoke) {
                                var keys = [];
                                for (var _i = 2; _i < arguments.length; _i++) {
                                    keys[_i - 2] = arguments[_i];
                                }
                                keys = keys.filter(function (key) { return handler.hasOwnProperty(key); });
                                if (keys.length == 0)
                                    throw new UndefinedHandlerError(handler);
                                return handler[keys[0]] ? invoke(handler[keys[0]]) : undefined;
                            };
                            var _loop_1 = function (attachment) {
                                switch (attachment.type) {
                                    case 'location':
                                        var invoke = function (m) { return m(attachment.payload.coordinates.lat, attachment.payload.coordinates.long, attachment.payload.title, attachment.payload.url); };
                                        return { value: handle(handler, invoke, exports.location, exports.onLocation, exports.defaultAction) };
                                    case 'image': return { value: handle(handler, function (m) { return m(attachment.payload.url); }, exports.onImage, exports.defaultAction) };
                                    case 'audio': return { value: handle(handler, function (m) { return m(attachment.payload.url); }, exports.onAudio, exports.defaultAction) };
                                    case 'video': return { value: handle(handler, function (m) { return m(attachment.payload.url); }, exports.onVideo, exports.defaultAction) };
                                    case 'file': return { value: handle(handler, function (m) { return m(attachment.payload.url); }, exports.onFile, exports.defaultAction) };
                                    default:
                                        throw new Error("Unsupported attachment type '" + attachment.type + "'");
                                }
                            };
                            for (var _i = 0, _a = message.originalRequest.message.attachments || []; _i < _a.length; _i++) {
                                var attachment = _a[_i];
                                var state_1 = _loop_1(attachment);
                                if (typeof state_1 === "object")
                                    return state_1.value;
                            }
                            return handle(handler, function (m) { return m(message.text); }, message.text, exports.onText, exports.defaultAction);
                        },
                        addQuickReplies: function (message, handler) {
                            if (handler[exports.location])
                                message.addQuickReplyLocation();
                            Object.keys(handler).forEach(function (key) { return message.addQuickReply(key, key); });
                            return this;
                        },
                        insertPauses: function (output) {
                            var remaining = Math.min(10 * 1000, apiRequest.lambdaContext.getRemainingTimeInMillis() - 2);
                            var factor = Math.min(1, remaining / output.reduce(function (total, o) { return total + o.getReadingDuration(); }, 0));
                            var messages = [];
                            output.forEach(function (message) { return messages.push(message.setBaseUrl(_this.baseUrl).setNotificationType('NO_PUSH'), new ChatAction('typing_on'), new Pause(message.getReadingDuration() * factor)); });
                            messages.length -= 2;
                            return messages;
                        }
                    })];
            });
        });
    };
    return Dialogue;
}());
exports.Dialogue = Dialogue;
var State = (function () {
    function State(storage, logger, expects, labels) {
        this.storage = storage;
        this.logger = logger;
        this.expects = expects;
        this.labels = labels;
        this.jumpCount = 0;
    }
    State.prototype.retrieveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        _b = this.state;
                        if (_b) return [3, 2];
                        return [4, this.storage.retrieve()];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a.state = _b || [];
                        return [2];
                }
            });
        });
    };
    Object.defineProperty(State.prototype, "isComplete", {
        get: function () {
            assert(this.state);
            return this.state[0] && this.state[0].type === 'complete';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "startLine", {
        get: function () {
            assert(this.state);
            switch (this.state[0] && this.state[0].type) {
                case 'expect':
                    return this.expects.get(this.state[0].name) + 2 || 0;
                case 'label':
                    return this.labels.get(this.state[0].name) + 1 || 0;
                case 'complete':
                    return -1;
                case undefined:
                    return 0;
                default:
                    throw new Error("Unexpected type " + this.state[0].type);
            }
        },
        enumerable: true,
        configurable: true
    });
    State.prototype.jump = function (location, lineOrIdentifier) {
        assert(this.state);
        if (++this.jumpCount > 10)
            throw new Error("Endless loop detected " + (typeof lineOrIdentifier == 'number' ? 'on line' : 'by') + " " + lineOrIdentifier + ": " + location.constructor.name.toLowerCase() + " `" + location.toString() + "`");
        if (location instanceof Expect) {
            if (!this.expects.has(location.toString()))
                throw new Error("Could not find expect referenced " + (typeof lineOrIdentifier == 'number' ? 'on line' : 'by') + " " + lineOrIdentifier + ": expect `" + location.toString() + "`");
            var count = this.state.findIndex(function (s) { return s.type === 'expect' && s.name === location.toString(); }) + 1;
            this.state.splice(0, count, { type: 'expect', name: location.toString() });
        }
        else {
            var label = location.toString().startsWith('!') ? location.toString().substring(1) : location.toString();
            if (!this.labels.has(label))
                throw new Error("Could not find label referenced " + (typeof lineOrIdentifier == 'number' ? 'on line' : 'by') + " " + lineOrIdentifier + ": goto `" + location.toString() + "`");
            this.logger.info("Jumping to label '" + label + "' from " + (typeof lineOrIdentifier == 'number' ? 'line' : '') + " " + lineOrIdentifier + ": goto `" + location.toString() + "`");
            if (this.isComplete)
                this.state.shift();
            this.state.unshift({ type: 'label', name: label });
        }
        return this.startLine;
    };
    State.prototype.complete = function (expect) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert(this.state);
                        this.state.unshift(expect ? { type: 'expect', name: expect.toString() } : { type: 'complete' });
                        return [4, this.storage.store(this.state)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    State.prototype.restart = function () {
        assert(this.state);
        this.state.length = 0;
    };
    State.prototype.undo = function (steps) {
        var _this = this;
        assert(this.state);
        this.state.splice(0, this.state.findIndex(function (s, i) { return (i + 1 >= steps && s.type === 'expect') || i + 1 === _this.state.length; }) + 1);
    };
    return State;
}());

import {
  __commonJS,
  __export,
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/events/events.js
var require_events = __commonJS({
  "node_modules/events/events.js"(exports, module) {
    "use strict";
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter2() {
      EventEmitter2.init.call(this);
    }
    module.exports = EventEmitter2;
    module.exports.once = once;
    EventEmitter2.EventEmitter = EventEmitter2;
    EventEmitter2.prototype._events = void 0;
    EventEmitter2.prototype._eventsCount = 0;
    EventEmitter2.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter2.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter2.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter2.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter2.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
    EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state3 = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state3);
      wrapped.listener = listener;
      state3.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter2.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter2.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter2.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter2.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter2.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// node_modules/@azure/core-rest-pipeline/dist/browser/pipeline.js
var ValidPhaseNames = /* @__PURE__ */ new Set(["Deserialize", "Serialize", "Retry", "Sign"]);
var HttpPipeline = class _HttpPipeline {
  constructor(policies) {
    var _a3;
    this._policies = [];
    this._policies = (_a3 = policies === null || policies === void 0 ? void 0 : policies.slice(0)) !== null && _a3 !== void 0 ? _a3 : [];
    this._orderedPolicies = void 0;
  }
  addPolicy(policy, options = {}) {
    if (options.phase && options.afterPhase) {
      throw new Error("Policies inside a phase cannot specify afterPhase.");
    }
    if (options.phase && !ValidPhaseNames.has(options.phase)) {
      throw new Error(`Invalid phase name: ${options.phase}`);
    }
    if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase)) {
      throw new Error(`Invalid afterPhase name: ${options.afterPhase}`);
    }
    this._policies.push({
      policy,
      options
    });
    this._orderedPolicies = void 0;
  }
  removePolicy(options) {
    const removedPolicies = [];
    this._policies = this._policies.filter((policyDescriptor) => {
      if (options.name && policyDescriptor.policy.name === options.name || options.phase && policyDescriptor.options.phase === options.phase) {
        removedPolicies.push(policyDescriptor.policy);
        return false;
      } else {
        return true;
      }
    });
    this._orderedPolicies = void 0;
    return removedPolicies;
  }
  sendRequest(httpClient, request) {
    const policies = this.getOrderedPolicies();
    const pipeline = policies.reduceRight((next, policy) => {
      return (req) => {
        return policy.sendRequest(req, next);
      };
    }, (req) => httpClient.sendRequest(req));
    return pipeline(request);
  }
  getOrderedPolicies() {
    if (!this._orderedPolicies) {
      this._orderedPolicies = this.orderPolicies();
    }
    return this._orderedPolicies;
  }
  clone() {
    return new _HttpPipeline(this._policies);
  }
  static create() {
    return new _HttpPipeline();
  }
  orderPolicies() {
    const result = [];
    const policyMap = /* @__PURE__ */ new Map();
    function createPhase(name) {
      return {
        name,
        policies: /* @__PURE__ */ new Set(),
        hasRun: false,
        hasAfterPolicies: false
      };
    }
    const serializePhase = createPhase("Serialize");
    const noPhase = createPhase("None");
    const deserializePhase = createPhase("Deserialize");
    const retryPhase = createPhase("Retry");
    const signPhase = createPhase("Sign");
    const orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase, signPhase];
    function getPhase(phase) {
      if (phase === "Retry") {
        return retryPhase;
      } else if (phase === "Serialize") {
        return serializePhase;
      } else if (phase === "Deserialize") {
        return deserializePhase;
      } else if (phase === "Sign") {
        return signPhase;
      } else {
        return noPhase;
      }
    }
    for (const descriptor of this._policies) {
      const policy = descriptor.policy;
      const options = descriptor.options;
      const policyName = policy.name;
      if (policyMap.has(policyName)) {
        throw new Error("Duplicate policy names not allowed in pipeline");
      }
      const node = {
        policy,
        dependsOn: /* @__PURE__ */ new Set(),
        dependants: /* @__PURE__ */ new Set()
      };
      if (options.afterPhase) {
        node.afterPhase = getPhase(options.afterPhase);
        node.afterPhase.hasAfterPolicies = true;
      }
      policyMap.set(policyName, node);
      const phase = getPhase(options.phase);
      phase.policies.add(node);
    }
    for (const descriptor of this._policies) {
      const { policy, options } = descriptor;
      const policyName = policy.name;
      const node = policyMap.get(policyName);
      if (!node) {
        throw new Error(`Missing node for policy ${policyName}`);
      }
      if (options.afterPolicies) {
        for (const afterPolicyName of options.afterPolicies) {
          const afterNode = policyMap.get(afterPolicyName);
          if (afterNode) {
            node.dependsOn.add(afterNode);
            afterNode.dependants.add(node);
          }
        }
      }
      if (options.beforePolicies) {
        for (const beforePolicyName of options.beforePolicies) {
          const beforeNode = policyMap.get(beforePolicyName);
          if (beforeNode) {
            beforeNode.dependsOn.add(node);
            node.dependants.add(beforeNode);
          }
        }
      }
    }
    function walkPhase(phase) {
      phase.hasRun = true;
      for (const node of phase.policies) {
        if (node.afterPhase && (!node.afterPhase.hasRun || node.afterPhase.policies.size)) {
          continue;
        }
        if (node.dependsOn.size === 0) {
          result.push(node.policy);
          for (const dependant of node.dependants) {
            dependant.dependsOn.delete(node);
          }
          policyMap.delete(node.policy.name);
          phase.policies.delete(node);
        }
      }
    }
    function walkPhases() {
      for (const phase of orderedPhases) {
        walkPhase(phase);
        if (phase.policies.size > 0 && phase !== noPhase) {
          if (!noPhase.hasRun) {
            walkPhase(noPhase);
          }
          return;
        }
        if (phase.hasAfterPolicies) {
          walkPhase(noPhase);
        }
      }
    }
    let iteration = 0;
    while (policyMap.size > 0) {
      iteration++;
      const initialResultLength = result.length;
      walkPhases();
      if (result.length <= initialResultLength && iteration > 1) {
        throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
      }
    }
    return result;
  }
};
function createEmptyPipeline() {
  return HttpPipeline.create();
}

// node_modules/@azure/logger/dist/browser/log.common.js
function log(...args) {
  if (args.length > 0) {
    const firstArg = String(args[0]);
    if (firstArg.includes(":error")) {
      console.error(...args);
    } else if (firstArg.includes(":warning")) {
      console.warn(...args);
    } else if (firstArg.includes(":info")) {
      console.info(...args);
    } else if (firstArg.includes(":verbose")) {
      console.debug(...args);
    } else {
      console.debug(...args);
    }
  }
}

// node_modules/@azure/logger/dist/browser/debug.js
var debugEnvVariable = typeof process !== "undefined" && process.env && process.env.DEBUG || void 0;
var enabledString;
var enabledNamespaces = [];
var skippedNamespaces = [];
var debuggers = [];
if (debugEnvVariable) {
  enable(debugEnvVariable);
}
var debugObj = Object.assign((namespace) => {
  return createDebugger(namespace);
}, {
  enable,
  enabled,
  disable,
  log
});
function enable(namespaces) {
  enabledString = namespaces;
  enabledNamespaces = [];
  skippedNamespaces = [];
  const wildcard = /\*/g;
  const namespaceList = namespaces.split(",").map((ns) => ns.trim().replace(wildcard, ".*?"));
  for (const ns of namespaceList) {
    if (ns.startsWith("-")) {
      skippedNamespaces.push(new RegExp(`^${ns.substr(1)}$`));
    } else {
      enabledNamespaces.push(new RegExp(`^${ns}$`));
    }
  }
  for (const instance of debuggers) {
    instance.enabled = enabled(instance.namespace);
  }
}
function enabled(namespace) {
  if (namespace.endsWith("*")) {
    return true;
  }
  for (const skipped of skippedNamespaces) {
    if (skipped.test(namespace)) {
      return false;
    }
  }
  for (const enabledNamespace of enabledNamespaces) {
    if (enabledNamespace.test(namespace)) {
      return true;
    }
  }
  return false;
}
function disable() {
  const result = enabledString || "";
  enable("");
  return result;
}
function createDebugger(namespace) {
  const newDebugger = Object.assign(debug, {
    enabled: enabled(namespace),
    destroy,
    log: debugObj.log,
    namespace,
    extend
  });
  function debug(...args) {
    if (!newDebugger.enabled) {
      return;
    }
    if (args.length > 0) {
      args[0] = `${namespace} ${args[0]}`;
    }
    newDebugger.log(...args);
  }
  debuggers.push(newDebugger);
  return newDebugger;
}
function destroy() {
  const index = debuggers.indexOf(this);
  if (index >= 0) {
    debuggers.splice(index, 1);
    return true;
  }
  return false;
}
function extend(namespace) {
  const newDebugger = createDebugger(`${this.namespace}:${namespace}`);
  newDebugger.log = this.log;
  return newDebugger;
}
var debug_default = debugObj;

// node_modules/@azure/logger/dist/browser/index.js
var registeredLoggers = /* @__PURE__ */ new Set();
var logLevelFromEnv = typeof process !== "undefined" && process.env && process.env.AZURE_LOG_LEVEL || void 0;
var azureLogLevel;
var AzureLogger = debug_default("azure");
AzureLogger.log = (...args) => {
  debug_default.log(...args);
};
var AZURE_LOG_LEVELS = ["verbose", "info", "warning", "error"];
if (logLevelFromEnv) {
  if (isAzureLogLevel(logLevelFromEnv)) {
    setLogLevel(logLevelFromEnv);
  } else {
    console.error(`AZURE_LOG_LEVEL set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${AZURE_LOG_LEVELS.join(", ")}.`);
  }
}
function setLogLevel(level) {
  if (level && !isAzureLogLevel(level)) {
    throw new Error(`Unknown log level '${level}'. Acceptable values: ${AZURE_LOG_LEVELS.join(",")}`);
  }
  azureLogLevel = level;
  const enabledNamespaces2 = [];
  for (const logger5 of registeredLoggers) {
    if (shouldEnable(logger5)) {
      enabledNamespaces2.push(logger5.namespace);
    }
  }
  debug_default.enable(enabledNamespaces2.join(","));
}
var levelMap = {
  verbose: 400,
  info: 300,
  warning: 200,
  error: 100
};
function createClientLogger(namespace) {
  const clientRootLogger = AzureLogger.extend(namespace);
  patchLogMethod(AzureLogger, clientRootLogger);
  return {
    error: createLogger(clientRootLogger, "error"),
    warning: createLogger(clientRootLogger, "warning"),
    info: createLogger(clientRootLogger, "info"),
    verbose: createLogger(clientRootLogger, "verbose")
  };
}
function patchLogMethod(parent, child) {
  child.log = (...args) => {
    parent.log(...args);
  };
}
function createLogger(parent, level) {
  const logger5 = Object.assign(parent.extend(level), {
    level
  });
  patchLogMethod(parent, logger5);
  if (shouldEnable(logger5)) {
    const enabledNamespaces2 = debug_default.disable();
    debug_default.enable(enabledNamespaces2 + "," + logger5.namespace);
  }
  registeredLoggers.add(logger5);
  return logger5;
}
function shouldEnable(logger5) {
  return Boolean(azureLogLevel && levelMap[logger5.level] <= levelMap[azureLogLevel]);
}
function isAzureLogLevel(logLevel) {
  return AZURE_LOG_LEVELS.includes(logLevel);
}

// node_modules/@azure/core-rest-pipeline/dist/browser/log.js
var logger = createClientLogger("core-rest-pipeline");

// node_modules/@azure/abort-controller/dist/browser/AbortError.js
var AbortError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AbortError";
  }
};

// node_modules/@azure/core-util/dist/browser/createAbortablePromise.js
function createAbortablePromise(buildPromise, options) {
  const { cleanupBeforeAbort, abortSignal, abortErrorMsg } = options !== null && options !== void 0 ? options : {};
  return new Promise((resolve, reject) => {
    function rejectOnAbort() {
      reject(new AbortError(abortErrorMsg !== null && abortErrorMsg !== void 0 ? abortErrorMsg : "The operation was aborted."));
    }
    function removeListeners() {
      abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.removeEventListener("abort", onAbort);
    }
    function onAbort() {
      cleanupBeforeAbort === null || cleanupBeforeAbort === void 0 ? void 0 : cleanupBeforeAbort();
      removeListeners();
      rejectOnAbort();
    }
    if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
      return rejectOnAbort();
    }
    try {
      buildPromise((x) => {
        removeListeners();
        resolve(x);
      }, (x) => {
        removeListeners();
        reject(x);
      });
    } catch (err) {
      reject(err);
    }
    abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener("abort", onAbort);
  });
}

// node_modules/@azure/core-util/dist/browser/random.js
function getRandomIntegerInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const offset = Math.floor(Math.random() * (max - min + 1));
  return offset + min;
}

// node_modules/@azure/core-util/dist/browser/delay.js
var StandardAbortMessage = "The delay was aborted.";
function delay(timeInMs, options) {
  let token;
  const { abortSignal, abortErrorMsg } = options !== null && options !== void 0 ? options : {};
  return createAbortablePromise((resolve) => {
    token = setTimeout(resolve, timeInMs);
  }, {
    cleanupBeforeAbort: () => clearTimeout(token),
    abortSignal,
    abortErrorMsg: abortErrorMsg !== null && abortErrorMsg !== void 0 ? abortErrorMsg : StandardAbortMessage
  });
}
function calculateRetryDelay(retryAttempt, config) {
  const exponentialDelay = config.retryDelayInMs * Math.pow(2, retryAttempt);
  const clampedDelay = Math.min(config.maxRetryDelayInMs, exponentialDelay);
  const retryAfterInMs = clampedDelay / 2 + getRandomIntegerInclusive(0, clampedDelay / 2);
  return { retryAfterInMs };
}

// node_modules/@azure/core-util/dist/browser/object.js
function isObject(input) {
  return typeof input === "object" && input !== null && !Array.isArray(input) && !(input instanceof RegExp) && !(input instanceof Date);
}

// node_modules/@azure/core-util/dist/browser/error.js
function isError(e) {
  if (isObject(e)) {
    const hasName = typeof e.name === "string";
    const hasMessage = typeof e.message === "string";
    return hasName && hasMessage;
  }
  return false;
}
function getErrorMessage(e) {
  if (isError(e)) {
    return e.message;
  } else {
    let stringified;
    try {
      if (typeof e === "object" && e) {
        stringified = JSON.stringify(e);
      } else {
        stringified = String(e);
      }
    } catch (err) {
      stringified = "[unable to stringify input]";
    }
    return `Unknown error ${stringified}`;
  }
}

// node_modules/@azure/core-util/dist/browser/bytesEncoding.common.js
function stringToUint8Array(value, format) {
  switch (format) {
    case "utf-8":
      return utf8StringToUint8Array(value);
    case "base64":
      return base64ToUint8Array(value);
    case "base64url":
      return base64UrlToUint8Array(value);
    case "hex":
      return hexStringToUint8Array(value);
  }
}
function utf8StringToUint8Array(value) {
  return new TextEncoder().encode(value);
}
function base64ToUint8Array(value) {
  return new Uint8Array([...atob(value)].map((x) => x.charCodeAt(0)));
}
function base64UrlToUint8Array(value) {
  const base64String = value.replace(/-/g, "+").replace(/_/g, "/");
  return base64ToUint8Array(base64String);
}
var hexDigits = new Set("0123456789abcdefABCDEF");
function hexStringToUint8Array(value) {
  const bytes = new Uint8Array(value.length / 2);
  for (let i = 0; i < value.length / 2; ++i) {
    const highNibble = value[2 * i];
    const lowNibble = value[2 * i + 1];
    if (!hexDigits.has(highNibble) || !hexDigits.has(lowNibble)) {
      return bytes.slice(0, i);
    }
    bytes[i] = parseInt(`${highNibble}${lowNibble}`, 16);
  }
  return bytes;
}

// node_modules/@azure/core-util/dist/browser/uuidUtils.common.js
function generateUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    const randomNumber = Math.floor(Math.random() * 16);
    if (i === 12) {
      uuid += "4";
    } else if (i === 16) {
      uuid += randomNumber & 3 | 8;
    } else {
      uuid += randomNumber.toString(16);
    }
    if (i === 7 || i === 11 || i === 15 || i === 19) {
      uuid += "-";
    }
  }
  return uuid;
}

// node_modules/@azure/core-util/dist/browser/uuidUtils.js
var _a;
var uuidFunction = typeof ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || _a === void 0 ? void 0 : _a.randomUUID) === "function" ? globalThis.crypto.randomUUID.bind(globalThis.crypto) : generateUUID;
function randomUUID() {
  return uuidFunction();
}

// node_modules/@azure/core-util/dist/browser/checkEnvironment.js
var _a2;
var _b;
var _c;
var _d;
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
var isWebWorker = typeof self === "object" && typeof (self === null || self === void 0 ? void 0 : self.importScripts) === "function" && (((_a2 = self.constructor) === null || _a2 === void 0 ? void 0 : _a2.name) === "DedicatedWorkerGlobalScope" || ((_b = self.constructor) === null || _b === void 0 ? void 0 : _b.name) === "ServiceWorkerGlobalScope" || ((_c = self.constructor) === null || _c === void 0 ? void 0 : _c.name) === "SharedWorkerGlobalScope");
var isDeno = typeof Deno !== "undefined" && typeof Deno.version !== "undefined" && typeof Deno.version.deno !== "undefined";
var isBun = typeof Bun !== "undefined" && typeof Bun.version !== "undefined";
var isNodeLike = typeof globalThis.process !== "undefined" && Boolean(globalThis.process.version) && Boolean((_d = globalThis.process.versions) === null || _d === void 0 ? void 0 : _d.node);
var isNode = isNodeLike;
var isReactNative = typeof navigator !== "undefined" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative";

// node_modules/@azure/core-rest-pipeline/dist/browser/util/sanitizer.js
var RedactedString = "REDACTED";
var defaultAllowedHeaderNames = [
  "x-ms-client-request-id",
  "x-ms-return-client-request-id",
  "x-ms-useragent",
  "x-ms-correlation-request-id",
  "x-ms-request-id",
  "client-request-id",
  "ms-cv",
  "return-client-request-id",
  "traceparent",
  "Access-Control-Allow-Credentials",
  "Access-Control-Allow-Headers",
  "Access-Control-Allow-Methods",
  "Access-Control-Allow-Origin",
  "Access-Control-Expose-Headers",
  "Access-Control-Max-Age",
  "Access-Control-Request-Headers",
  "Access-Control-Request-Method",
  "Origin",
  "Accept",
  "Accept-Encoding",
  "Cache-Control",
  "Connection",
  "Content-Length",
  "Content-Type",
  "Date",
  "ETag",
  "Expires",
  "If-Match",
  "If-Modified-Since",
  "If-None-Match",
  "If-Unmodified-Since",
  "Last-Modified",
  "Pragma",
  "Request-Id",
  "Retry-After",
  "Server",
  "Transfer-Encoding",
  "User-Agent",
  "WWW-Authenticate"
];
var defaultAllowedQueryParameters = ["api-version"];
var Sanitizer = class {
  constructor({ additionalAllowedHeaderNames: allowedHeaderNames = [], additionalAllowedQueryParameters: allowedQueryParameters = [] } = {}) {
    allowedHeaderNames = defaultAllowedHeaderNames.concat(allowedHeaderNames);
    allowedQueryParameters = defaultAllowedQueryParameters.concat(allowedQueryParameters);
    this.allowedHeaderNames = new Set(allowedHeaderNames.map((n) => n.toLowerCase()));
    this.allowedQueryParameters = new Set(allowedQueryParameters.map((p) => p.toLowerCase()));
  }
  sanitize(obj) {
    const seen = /* @__PURE__ */ new Set();
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Error) {
        return Object.assign(Object.assign({}, value), { name: value.name, message: value.message });
      }
      if (key === "headers") {
        return this.sanitizeHeaders(value);
      } else if (key === "url") {
        return this.sanitizeUrl(value);
      } else if (key === "query") {
        return this.sanitizeQuery(value);
      } else if (key === "body") {
        return void 0;
      } else if (key === "response") {
        return void 0;
      } else if (key === "operationSpec") {
        return void 0;
      } else if (Array.isArray(value) || isObject(value)) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    }, 2);
  }
  sanitizeUrl(value) {
    if (typeof value !== "string" || value === null || value === "") {
      return value;
    }
    const url2 = new URL(value);
    if (!url2.search) {
      return value;
    }
    for (const [key] of url2.searchParams) {
      if (!this.allowedQueryParameters.has(key.toLowerCase())) {
        url2.searchParams.set(key, RedactedString);
      }
    }
    return url2.toString();
  }
  sanitizeHeaders(obj) {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      if (this.allowedHeaderNames.has(key.toLowerCase())) {
        sanitized[key] = obj[key];
      } else {
        sanitized[key] = RedactedString;
      }
    }
    return sanitized;
  }
  sanitizeQuery(value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    const sanitized = {};
    for (const k of Object.keys(value)) {
      if (this.allowedQueryParameters.has(k.toLowerCase())) {
        sanitized[k] = value[k];
      } else {
        sanitized[k] = RedactedString;
      }
    }
    return sanitized;
  }
};

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/logPolicy.js
var logPolicyName = "logPolicy";
function logPolicy(options = {}) {
  var _a3;
  const logger5 = (_a3 = options.logger) !== null && _a3 !== void 0 ? _a3 : logger.info;
  const sanitizer = new Sanitizer({
    additionalAllowedHeaderNames: options.additionalAllowedHeaderNames,
    additionalAllowedQueryParameters: options.additionalAllowedQueryParameters
  });
  return {
    name: logPolicyName,
    async sendRequest(request, next) {
      if (!logger5.enabled) {
        return next(request);
      }
      logger5(`Request: ${sanitizer.sanitize(request)}`);
      const response = await next(request);
      logger5(`Response status code: ${response.status}`);
      logger5(`Headers: ${sanitizer.sanitize(response.headers)}`);
      return response;
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/redirectPolicy.js
var redirectPolicyName = "redirectPolicy";
var allowedRedirect = ["GET", "HEAD"];
function redirectPolicy(options = {}) {
  const { maxRetries = 20 } = options;
  return {
    name: redirectPolicyName,
    async sendRequest(request, next) {
      const response = await next(request);
      return handleRedirect(next, response, maxRetries);
    }
  };
}
async function handleRedirect(next, response, maxRetries, currentRetries = 0) {
  const { request, status, headers } = response;
  const locationHeader = headers.get("location");
  if (locationHeader && (status === 300 || status === 301 && allowedRedirect.includes(request.method) || status === 302 && allowedRedirect.includes(request.method) || status === 303 && request.method === "POST" || status === 307) && currentRetries < maxRetries) {
    const url2 = new URL(locationHeader, request.url);
    request.url = url2.toString();
    if (status === 303) {
      request.method = "GET";
      request.headers.delete("Content-Length");
      delete request.body;
    }
    request.headers.delete("Authorization");
    const res = await next(request);
    return handleRedirect(next, res, maxRetries, currentRetries + 1);
  }
  return response;
}

// node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgentPlatform.js
function getHeaderName() {
  return "x-ms-useragent";
}
function getBrowserInfo(userAgent) {
  const browserRegexes = [
    { name: "Firefox", regex: /Firefox\/([\d.]+)/ },
    { name: "Safari", regex: /Version\/([\d.]+).*Safari/ }
  ];
  for (const browser of browserRegexes) {
    const match = userAgent.match(browser.regex);
    if (match) {
      return { brand: browser.name, version: match[1] };
    }
  }
  return void 0;
}
function getBrandVersionString(brands) {
  const brandOrder = ["Google Chrome", "Microsoft Edge", "Opera", "Brave", "Chromium"];
  for (const brand of brandOrder) {
    const foundBrand = brands.find((b) => b.brand === brand);
    if (foundBrand) {
      return foundBrand;
    }
  }
  return void 0;
}
async function setPlatformSpecificData(map) {
  const localNavigator = globalThis.navigator;
  let osPlatform = "unknown";
  if (localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.userAgentData) {
    const entropyValues = await localNavigator.userAgentData.getHighEntropyValues([
      "architecture",
      "platformVersion"
    ]);
    osPlatform = `${entropyValues.architecture}-${entropyValues.platform}-${entropyValues.platformVersion}`;
    const brand = getBrandVersionString(localNavigator.userAgentData.brands);
    if (brand) {
      map.set(brand.brand, brand.version);
    }
  } else if (localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.platform) {
    osPlatform = localNavigator.platform;
    const brand = getBrowserInfo(localNavigator.userAgent);
    if (brand) {
      map.set(brand.brand, brand.version);
    }
  } else if (typeof globalThis.EdgeRuntime === "string") {
    map.set("EdgeRuntime", globalThis.EdgeRuntime);
  }
  map.set("OS", osPlatform);
}

// node_modules/@azure/core-rest-pipeline/dist/browser/constants.js
var SDK_VERSION = "1.18.2";
var DEFAULT_RETRY_POLICY_COUNT = 3;

// node_modules/@azure/core-rest-pipeline/dist/browser/util/userAgent.js
function getUserAgentString(telemetryInfo) {
  const parts = [];
  for (const [key, value] of telemetryInfo) {
    const token = value ? `${key}/${value}` : key;
    parts.push(token);
  }
  return parts.join(" ");
}
function getUserAgentHeaderName() {
  return getHeaderName();
}
async function getUserAgentValue(prefix2) {
  const runtimeInfo = /* @__PURE__ */ new Map();
  runtimeInfo.set("core-rest-pipeline", SDK_VERSION);
  await setPlatformSpecificData(runtimeInfo);
  const defaultAgent = getUserAgentString(runtimeInfo);
  const userAgentValue = prefix2 ? `${prefix2} ${defaultAgent}` : defaultAgent;
  return userAgentValue;
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/userAgentPolicy.js
var UserAgentHeaderName = getUserAgentHeaderName();
var userAgentPolicyName = "userAgentPolicy";
function userAgentPolicy(options = {}) {
  const userAgentValue = getUserAgentValue(options.userAgentPrefix);
  return {
    name: userAgentPolicyName,
    async sendRequest(request, next) {
      if (!request.headers.has(UserAgentHeaderName)) {
        request.headers.set(UserAgentHeaderName, await userAgentValue);
      }
      return next(request);
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/util/typeGuards.js
function isNodeReadableStream(x) {
  return Boolean(x && typeof x["pipe"] === "function");
}
function isWebReadableStream(x) {
  return Boolean(x && typeof x.getReader === "function" && typeof x.tee === "function");
}
function isBlob(x) {
  return typeof x.stream === "function";
}

// node_modules/@azure/core-rest-pipeline/dist/browser/util/file.js
var rawContent = Symbol("rawContent");
function hasRawContent(x) {
  return typeof x[rawContent] === "function";
}
function getRawContent(blob) {
  if (hasRawContent(blob)) {
    return blob[rawContent]();
  } else {
    return blob.stream();
  }
}

// node_modules/@azure/core-rest-pipeline/dist/browser/util/concat.common.js
function drain(stream) {
  return new Response(stream).blob();
}
async function toBlobPart(source) {
  if (source instanceof Blob || source instanceof Uint8Array) {
    return source;
  }
  if (isWebReadableStream(source)) {
    return drain(source);
  }
  const rawContent2 = getRawContent(source);
  if (isNodeReadableStream(rawContent2)) {
    throw new Error("Encountered unexpected type. In the browser, `concat` supports Web ReadableStream, Blob, Uint8Array, and files created using `createFile` only.");
  }
  return toBlobPart(rawContent2);
}
async function concat(sources) {
  const parts = [];
  for (const source of sources) {
    parts.push(await toBlobPart(typeof source === "function" ? source() : source));
  }
  return new Blob(parts);
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/multipartPolicy.js
function generateBoundary() {
  return `----AzSDKFormBoundary${randomUUID()}`;
}
function encodeHeaders(headers) {
  let result = "";
  for (const [key, value] of headers) {
    result += `${key}: ${value}\r
`;
  }
  return result;
}
function getLength(source) {
  if (source instanceof Uint8Array) {
    return source.byteLength;
  } else if (isBlob(source)) {
    return source.size === -1 ? void 0 : source.size;
  } else {
    return void 0;
  }
}
function getTotalLength(sources) {
  let total = 0;
  for (const source of sources) {
    const partLength = getLength(source);
    if (partLength === void 0) {
      return void 0;
    } else {
      total += partLength;
    }
  }
  return total;
}
async function buildRequestBody(request, parts, boundary) {
  const sources = [
    stringToUint8Array(`--${boundary}`, "utf-8"),
    ...parts.flatMap((part) => [
      stringToUint8Array("\r\n", "utf-8"),
      stringToUint8Array(encodeHeaders(part.headers), "utf-8"),
      stringToUint8Array("\r\n", "utf-8"),
      part.body,
      stringToUint8Array(`\r
--${boundary}`, "utf-8")
    ]),
    stringToUint8Array("--\r\n\r\n", "utf-8")
  ];
  const contentLength2 = getTotalLength(sources);
  if (contentLength2) {
    request.headers.set("Content-Length", contentLength2);
  }
  request.body = await concat(sources);
}
var multipartPolicyName = "multipartPolicy";
var maxBoundaryLength = 70;
var validBoundaryCharacters = new Set(`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?`);
function assertValidBoundary(boundary) {
  if (boundary.length > maxBoundaryLength) {
    throw new Error(`Multipart boundary "${boundary}" exceeds maximum length of 70 characters`);
  }
  if (Array.from(boundary).some((x) => !validBoundaryCharacters.has(x))) {
    throw new Error(`Multipart boundary "${boundary}" contains invalid characters`);
  }
}
function multipartPolicy() {
  return {
    name: multipartPolicyName,
    async sendRequest(request, next) {
      var _a3;
      if (!request.multipartBody) {
        return next(request);
      }
      if (request.body) {
        throw new Error("multipartBody and regular body cannot be set at the same time");
      }
      let boundary = request.multipartBody.boundary;
      const contentTypeHeader = (_a3 = request.headers.get("Content-Type")) !== null && _a3 !== void 0 ? _a3 : "multipart/mixed";
      const parsedHeader = contentTypeHeader.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
      if (!parsedHeader) {
        throw new Error(`Got multipart request body, but content-type header was not multipart: ${contentTypeHeader}`);
      }
      const [, contentType2, parsedBoundary] = parsedHeader;
      if (parsedBoundary && boundary && parsedBoundary !== boundary) {
        throw new Error(`Multipart boundary was specified as ${parsedBoundary} in the header, but got ${boundary} in the request body`);
      }
      boundary !== null && boundary !== void 0 ? boundary : boundary = parsedBoundary;
      if (boundary) {
        assertValidBoundary(boundary);
      } else {
        boundary = generateBoundary();
      }
      request.headers.set("Content-Type", `${contentType2}; boundary=${boundary}`);
      await buildRequestBody(request, request.multipartBody.parts, boundary);
      request.multipartBody = void 0;
      return next(request);
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/decompressResponsePolicy.js
var decompressResponsePolicyName = "decompressResponsePolicy";
function decompressResponsePolicy() {
  throw new Error("decompressResponsePolicy is not supported in browser environment");
}

// node_modules/@azure/core-rest-pipeline/dist/browser/util/helpers.js
var StandardAbortMessage2 = "The operation was aborted.";
function delay2(delayInMs, value, options) {
  return new Promise((resolve, reject) => {
    let timer = void 0;
    let onAborted = void 0;
    const rejectOnAbort = () => {
      return reject(new AbortError((options === null || options === void 0 ? void 0 : options.abortErrorMsg) ? options === null || options === void 0 ? void 0 : options.abortErrorMsg : StandardAbortMessage2));
    };
    const removeListeners = () => {
      if ((options === null || options === void 0 ? void 0 : options.abortSignal) && onAborted) {
        options.abortSignal.removeEventListener("abort", onAborted);
      }
    };
    onAborted = () => {
      if (timer) {
        clearTimeout(timer);
      }
      removeListeners();
      return rejectOnAbort();
    };
    if ((options === null || options === void 0 ? void 0 : options.abortSignal) && options.abortSignal.aborted) {
      return rejectOnAbort();
    }
    timer = setTimeout(() => {
      removeListeners();
      resolve(value);
    }, delayInMs);
    if (options === null || options === void 0 ? void 0 : options.abortSignal) {
      options.abortSignal.addEventListener("abort", onAborted);
    }
  });
}
function parseHeaderValueAsNumber(response, headerName) {
  const value = response.headers.get(headerName);
  if (!value)
    return;
  const valueAsNum = Number(value);
  if (Number.isNaN(valueAsNum))
    return;
  return valueAsNum;
}

// node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/throttlingRetryStrategy.js
var RetryAfterHeader = "Retry-After";
var AllRetryAfterHeaders = ["retry-after-ms", "x-ms-retry-after-ms", RetryAfterHeader];
function getRetryAfterInMs(response) {
  if (!(response && [429, 503].includes(response.status)))
    return void 0;
  try {
    for (const header of AllRetryAfterHeaders) {
      const retryAfterValue = parseHeaderValueAsNumber(response, header);
      if (retryAfterValue === 0 || retryAfterValue) {
        const multiplyingFactor = header === RetryAfterHeader ? 1e3 : 1;
        return retryAfterValue * multiplyingFactor;
      }
    }
    const retryAfterHeader = response.headers.get(RetryAfterHeader);
    if (!retryAfterHeader)
      return;
    const date = Date.parse(retryAfterHeader);
    const diff = date - Date.now();
    return Number.isFinite(diff) ? Math.max(0, diff) : void 0;
  } catch (_a3) {
    return void 0;
  }
}
function isThrottlingRetryResponse(response) {
  return Number.isFinite(getRetryAfterInMs(response));
}
function throttlingRetryStrategy() {
  return {
    name: "throttlingRetryStrategy",
    retry({ response }) {
      const retryAfterInMs = getRetryAfterInMs(response);
      if (!Number.isFinite(retryAfterInMs)) {
        return { skipStrategy: true };
      }
      return {
        retryAfterInMs
      };
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/retryStrategies/exponentialRetryStrategy.js
var DEFAULT_CLIENT_RETRY_INTERVAL = 1e3;
var DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1e3 * 64;
function exponentialRetryStrategy(options = {}) {
  var _a3, _b2;
  const retryInterval = (_a3 = options.retryDelayInMs) !== null && _a3 !== void 0 ? _a3 : DEFAULT_CLIENT_RETRY_INTERVAL;
  const maxRetryInterval = (_b2 = options.maxRetryDelayInMs) !== null && _b2 !== void 0 ? _b2 : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
  return {
    name: "exponentialRetryStrategy",
    retry({ retryCount, response, responseError }) {
      const matchedSystemError = isSystemError(responseError);
      const ignoreSystemErrors = matchedSystemError && options.ignoreSystemErrors;
      const isExponential = isExponentialRetryResponse(response);
      const ignoreExponentialResponse = isExponential && options.ignoreHttpStatusCodes;
      const unknownResponse = response && (isThrottlingRetryResponse(response) || !isExponential);
      if (unknownResponse || ignoreExponentialResponse || ignoreSystemErrors) {
        return { skipStrategy: true };
      }
      if (responseError && !matchedSystemError && !isExponential) {
        return { errorToThrow: responseError };
      }
      return calculateRetryDelay(retryCount, {
        retryDelayInMs: retryInterval,
        maxRetryDelayInMs: maxRetryInterval
      });
    }
  };
}
function isExponentialRetryResponse(response) {
  return Boolean(response && response.status !== void 0 && (response.status >= 500 || response.status === 408) && response.status !== 501 && response.status !== 505);
}
function isSystemError(err) {
  if (!err) {
    return false;
  }
  return err.code === "ETIMEDOUT" || err.code === "ESOCKETTIMEDOUT" || err.code === "ECONNREFUSED" || err.code === "ECONNRESET" || err.code === "ENOENT" || err.code === "ENOTFOUND";
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/retryPolicy.js
var retryPolicyLogger = createClientLogger("core-rest-pipeline retryPolicy");
var retryPolicyName = "retryPolicy";
function retryPolicy(strategies, options = { maxRetries: DEFAULT_RETRY_POLICY_COUNT }) {
  const logger5 = options.logger || retryPolicyLogger;
  return {
    name: retryPolicyName,
    async sendRequest(request, next) {
      var _a3, _b2;
      let response;
      let responseError;
      let retryCount = -1;
      retryRequest: while (true) {
        retryCount += 1;
        response = void 0;
        responseError = void 0;
        try {
          logger5.info(`Retry ${retryCount}: Attempting to send request`, request.requestId);
          response = await next(request);
          logger5.info(`Retry ${retryCount}: Received a response from request`, request.requestId);
        } catch (e) {
          logger5.error(`Retry ${retryCount}: Received an error from request`, request.requestId);
          responseError = e;
          if (!e || responseError.name !== "RestError") {
            throw e;
          }
          response = responseError.response;
        }
        if ((_a3 = request.abortSignal) === null || _a3 === void 0 ? void 0 : _a3.aborted) {
          logger5.error(`Retry ${retryCount}: Request aborted.`);
          const abortError = new AbortError();
          throw abortError;
        }
        if (retryCount >= ((_b2 = options.maxRetries) !== null && _b2 !== void 0 ? _b2 : DEFAULT_RETRY_POLICY_COUNT)) {
          logger5.info(`Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`);
          if (responseError) {
            throw responseError;
          } else if (response) {
            return response;
          } else {
            throw new Error("Maximum retries reached with no response or error to throw");
          }
        }
        logger5.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);
        strategiesLoop: for (const strategy of strategies) {
          const strategyLogger = strategy.logger || retryPolicyLogger;
          strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);
          const modifiers = strategy.retry({
            retryCount,
            response,
            responseError
          });
          if (modifiers.skipStrategy) {
            strategyLogger.info(`Retry ${retryCount}: Skipped.`);
            continue strategiesLoop;
          }
          const { errorToThrow, retryAfterInMs, redirectTo } = modifiers;
          if (errorToThrow) {
            strategyLogger.error(`Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`, errorToThrow);
            throw errorToThrow;
          }
          if (retryAfterInMs || retryAfterInMs === 0) {
            strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`);
            await delay2(retryAfterInMs, void 0, { abortSignal: request.abortSignal });
            continue retryRequest;
          }
          if (redirectTo) {
            strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`);
            request.url = redirectTo;
            continue retryRequest;
          }
        }
        if (responseError) {
          logger5.info(`None of the retry strategies could work with the received error. Throwing it.`);
          throw responseError;
        }
        if (response) {
          logger5.info(`None of the retry strategies could work with the received response. Returning it.`);
          return response;
        }
      }
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/defaultRetryPolicy.js
var defaultRetryPolicyName = "defaultRetryPolicy";
function defaultRetryPolicy(options = {}) {
  var _a3;
  return {
    name: defaultRetryPolicyName,
    sendRequest: retryPolicy([throttlingRetryStrategy(), exponentialRetryStrategy(options)], {
      maxRetries: (_a3 = options.maxRetries) !== null && _a3 !== void 0 ? _a3 : DEFAULT_RETRY_POLICY_COUNT
    }).sendRequest
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/httpHeaders.js
function normalizeName(name) {
  return name.toLowerCase();
}
function* headerIterator(map) {
  for (const entry of map.values()) {
    yield [entry.name, entry.value];
  }
}
var HttpHeadersImpl = class {
  constructor(rawHeaders) {
    this._headersMap = /* @__PURE__ */ new Map();
    if (rawHeaders) {
      for (const headerName of Object.keys(rawHeaders)) {
        this.set(headerName, rawHeaders[headerName]);
      }
    }
  }
  /**
   * Set a header in this collection with the provided name and value. The name is
   * case-insensitive.
   * @param name - The name of the header to set. This value is case-insensitive.
   * @param value - The value of the header to set.
   */
  set(name, value) {
    this._headersMap.set(normalizeName(name), { name, value: String(value).trim() });
  }
  /**
   * Get the header value for the provided header name, or undefined if no header exists in this
   * collection with the provided name.
   * @param name - The name of the header. This value is case-insensitive.
   */
  get(name) {
    var _a3;
    return (_a3 = this._headersMap.get(normalizeName(name))) === null || _a3 === void 0 ? void 0 : _a3.value;
  }
  /**
   * Get whether or not this header collection contains a header entry for the provided header name.
   * @param name - The name of the header to set. This value is case-insensitive.
   */
  has(name) {
    return this._headersMap.has(normalizeName(name));
  }
  /**
   * Remove the header with the provided headerName.
   * @param name - The name of the header to remove.
   */
  delete(name) {
    this._headersMap.delete(normalizeName(name));
  }
  /**
   * Get the JSON object representation of this HTTP header collection.
   */
  toJSON(options = {}) {
    const result = {};
    if (options.preserveCase) {
      for (const entry of this._headersMap.values()) {
        result[entry.name] = entry.value;
      }
    } else {
      for (const [normalizedName, entry] of this._headersMap) {
        result[normalizedName] = entry.value;
      }
    }
    return result;
  }
  /**
   * Get the string representation of this HTTP header collection.
   */
  toString() {
    return JSON.stringify(this.toJSON({ preserveCase: true }));
  }
  /**
   * Iterate over tuples of header [name, value] pairs.
   */
  [Symbol.iterator]() {
    return headerIterator(this._headersMap);
  }
};
function createHttpHeaders(rawHeaders) {
  return new HttpHeadersImpl(rawHeaders);
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/formDataPolicy.js
var formDataPolicyName = "formDataPolicy";
function formDataToFormDataMap(formData) {
  var _a3;
  const formDataMap = {};
  for (const [key, value] of formData.entries()) {
    (_a3 = formDataMap[key]) !== null && _a3 !== void 0 ? _a3 : formDataMap[key] = [];
    formDataMap[key].push(value);
  }
  return formDataMap;
}
function formDataPolicy() {
  return {
    name: formDataPolicyName,
    async sendRequest(request, next) {
      if (isNodeLike && typeof FormData !== "undefined" && request.body instanceof FormData) {
        request.formData = formDataToFormDataMap(request.body);
        request.body = void 0;
      }
      if (request.formData) {
        const contentType2 = request.headers.get("Content-Type");
        if (contentType2 && contentType2.indexOf("application/x-www-form-urlencoded") !== -1) {
          request.body = wwwFormUrlEncode(request.formData);
        } else {
          await prepareFormData(request.formData, request);
        }
        request.formData = void 0;
      }
      return next(request);
    }
  };
}
function wwwFormUrlEncode(formData) {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(formData)) {
    if (Array.isArray(value)) {
      for (const subValue of value) {
        urlSearchParams.append(key, subValue.toString());
      }
    } else {
      urlSearchParams.append(key, value.toString());
    }
  }
  return urlSearchParams.toString();
}
async function prepareFormData(formData, request) {
  const contentType2 = request.headers.get("Content-Type");
  if (contentType2 && !contentType2.startsWith("multipart/form-data")) {
    return;
  }
  request.headers.set("Content-Type", contentType2 !== null && contentType2 !== void 0 ? contentType2 : "multipart/form-data");
  const parts = [];
  for (const [fieldName, values] of Object.entries(formData)) {
    for (const value of Array.isArray(values) ? values : [values]) {
      if (typeof value === "string") {
        parts.push({
          headers: createHttpHeaders({
            "Content-Disposition": `form-data; name="${fieldName}"`
          }),
          body: stringToUint8Array(value, "utf-8")
        });
      } else if (value === void 0 || value === null || typeof value !== "object") {
        throw new Error(`Unexpected value for key ${fieldName}: ${value}. Value should be serialized to string first.`);
      } else {
        const fileName = value.name || "blob";
        const headers = createHttpHeaders();
        headers.set("Content-Disposition", `form-data; name="${fieldName}"; filename="${fileName}"`);
        headers.set("Content-Type", value.type || "application/octet-stream");
        parts.push({
          headers,
          body: value
        });
      }
    }
  }
  request.multipartBody = { parts };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/proxyPolicy.common.js
var errorMessage = "proxyPolicy is not supported in browser environment";
function getDefaultProxySettings() {
  throw new Error(errorMessage);
}
function proxyPolicy() {
  throw new Error(errorMessage);
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/setClientRequestIdPolicy.js
var setClientRequestIdPolicyName = "setClientRequestIdPolicy";
function setClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
  return {
    name: setClientRequestIdPolicyName,
    async sendRequest(request, next) {
      if (!request.headers.has(requestIdHeaderName)) {
        request.headers.set(requestIdHeaderName, request.requestId);
      }
      return next(request);
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/tlsPolicy.js
var tlsPolicyName = "tlsPolicy";
function tlsPolicy(tlsSettings) {
  return {
    name: tlsPolicyName,
    sendRequest: async (req, next) => {
      if (!req.tlsSettings) {
        req.tlsSettings = tlsSettings;
      }
      return next(req);
    }
  };
}

// node_modules/@azure/core-tracing/dist/browser/tracingContext.js
var knownContextKeys = {
  span: Symbol.for("@azure/core-tracing span"),
  namespace: Symbol.for("@azure/core-tracing namespace")
};
function createTracingContext(options = {}) {
  let context = new TracingContextImpl(options.parentContext);
  if (options.span) {
    context = context.setValue(knownContextKeys.span, options.span);
  }
  if (options.namespace) {
    context = context.setValue(knownContextKeys.namespace, options.namespace);
  }
  return context;
}
var TracingContextImpl = class _TracingContextImpl {
  constructor(initialContext) {
    this._contextMap = initialContext instanceof _TracingContextImpl ? new Map(initialContext._contextMap) : /* @__PURE__ */ new Map();
  }
  setValue(key, value) {
    const newContext = new _TracingContextImpl(this);
    newContext._contextMap.set(key, value);
    return newContext;
  }
  getValue(key) {
    return this._contextMap.get(key);
  }
  deleteValue(key) {
    const newContext = new _TracingContextImpl(this);
    newContext._contextMap.delete(key);
    return newContext;
  }
};

// node_modules/@azure/core-tracing/dist/browser/state.js
var state = {
  instrumenterImplementation: void 0
};

// node_modules/@azure/core-tracing/dist/browser/instrumenter.js
function createDefaultTracingSpan() {
  return {
    end: () => {
    },
    isRecording: () => false,
    recordException: () => {
    },
    setAttribute: () => {
    },
    setStatus: () => {
    },
    addEvent: () => {
    }
  };
}
function createDefaultInstrumenter() {
  return {
    createRequestHeaders: () => {
      return {};
    },
    parseTraceparentHeader: () => {
      return void 0;
    },
    startSpan: (_name, spanOptions) => {
      return {
        span: createDefaultTracingSpan(),
        tracingContext: createTracingContext({ parentContext: spanOptions.tracingContext })
      };
    },
    withContext(_context, callback, ...callbackArgs) {
      return callback(...callbackArgs);
    }
  };
}
function getInstrumenter() {
  if (!state.instrumenterImplementation) {
    state.instrumenterImplementation = createDefaultInstrumenter();
  }
  return state.instrumenterImplementation;
}

// node_modules/@azure/core-tracing/dist/browser/tracingClient.js
function createTracingClient(options) {
  const { namespace, packageName, packageVersion } = options;
  function startSpan(name, operationOptions, spanOptions) {
    var _a3;
    const startSpanResult = getInstrumenter().startSpan(name, Object.assign(Object.assign({}, spanOptions), { packageName, packageVersion, tracingContext: (_a3 = operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions) === null || _a3 === void 0 ? void 0 : _a3.tracingContext }));
    let tracingContext = startSpanResult.tracingContext;
    const span = startSpanResult.span;
    if (!tracingContext.getValue(knownContextKeys.namespace)) {
      tracingContext = tracingContext.setValue(knownContextKeys.namespace, namespace);
    }
    span.setAttribute("az.namespace", tracingContext.getValue(knownContextKeys.namespace));
    const updatedOptions = Object.assign({}, operationOptions, {
      tracingOptions: Object.assign(Object.assign({}, operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions), { tracingContext })
    });
    return {
      span,
      updatedOptions
    };
  }
  async function withSpan(name, operationOptions, callback, spanOptions) {
    const { span, updatedOptions } = startSpan(name, operationOptions, spanOptions);
    try {
      const result = await withContext(updatedOptions.tracingOptions.tracingContext, () => Promise.resolve(callback(updatedOptions, span)));
      span.setStatus({ status: "success" });
      return result;
    } catch (err) {
      span.setStatus({ status: "error", error: err });
      throw err;
    } finally {
      span.end();
    }
  }
  function withContext(context, callback, ...callbackArgs) {
    return getInstrumenter().withContext(context, callback, ...callbackArgs);
  }
  function parseTraceparentHeader(traceparentHeader) {
    return getInstrumenter().parseTraceparentHeader(traceparentHeader);
  }
  function createRequestHeaders(tracingContext) {
    return getInstrumenter().createRequestHeaders(tracingContext);
  }
  return {
    startSpan,
    withSpan,
    withContext,
    parseTraceparentHeader,
    createRequestHeaders
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/util/inspect.common.js
var custom = {};

// node_modules/@azure/core-rest-pipeline/dist/browser/restError.js
var errorSanitizer = new Sanitizer();
var RestError = class _RestError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "RestError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    Object.defineProperty(this, "request", { value: options.request, enumerable: false });
    Object.defineProperty(this, "response", { value: options.response, enumerable: false });
    Object.setPrototypeOf(this, _RestError.prototype);
  }
  /**
   * Logging method for util.inspect in Node
   */
  [custom]() {
    return `RestError: ${this.message} 
 ${errorSanitizer.sanitize(Object.assign(Object.assign({}, this), { request: this.request, response: this.response }))}`;
  }
};
RestError.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
RestError.PARSE_ERROR = "PARSE_ERROR";
function isRestError(e) {
  if (e instanceof RestError) {
    return true;
  }
  return isError(e) && e.name === "RestError";
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/tracingPolicy.js
var tracingPolicyName = "tracingPolicy";
function tracingPolicy(options = {}) {
  const userAgentPromise = getUserAgentValue(options.userAgentPrefix);
  const sanitizer = new Sanitizer({
    additionalAllowedQueryParameters: options.additionalAllowedQueryParameters
  });
  const tracingClient2 = tryCreateTracingClient();
  return {
    name: tracingPolicyName,
    async sendRequest(request, next) {
      var _a3;
      if (!tracingClient2) {
        return next(request);
      }
      const userAgent = await userAgentPromise;
      const spanAttributes = {
        "http.url": sanitizer.sanitizeUrl(request.url),
        "http.method": request.method,
        "http.user_agent": userAgent,
        requestId: request.requestId
      };
      if (userAgent) {
        spanAttributes["http.user_agent"] = userAgent;
      }
      const { span, tracingContext } = (_a3 = tryCreateSpan(tracingClient2, request, spanAttributes)) !== null && _a3 !== void 0 ? _a3 : {};
      if (!span || !tracingContext) {
        return next(request);
      }
      try {
        const response = await tracingClient2.withContext(tracingContext, next, request);
        tryProcessResponse(span, response);
        return response;
      } catch (err) {
        tryProcessError(span, err);
        throw err;
      }
    }
  };
}
function tryCreateTracingClient() {
  try {
    return createTracingClient({
      namespace: "",
      packageName: "@azure/core-rest-pipeline",
      packageVersion: SDK_VERSION
    });
  } catch (e) {
    logger.warning(`Error when creating the TracingClient: ${getErrorMessage(e)}`);
    return void 0;
  }
}
function tryCreateSpan(tracingClient2, request, spanAttributes) {
  try {
    const { span, updatedOptions } = tracingClient2.startSpan(`HTTP ${request.method}`, { tracingOptions: request.tracingOptions }, {
      spanKind: "client",
      spanAttributes
    });
    if (!span.isRecording()) {
      span.end();
      return void 0;
    }
    const headers = tracingClient2.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
    for (const [key, value] of Object.entries(headers)) {
      request.headers.set(key, value);
    }
    return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
  } catch (e) {
    logger.warning(`Skipping creating a tracing span due to an error: ${getErrorMessage(e)}`);
    return void 0;
  }
}
function tryProcessError(span, error) {
  try {
    span.setStatus({
      status: "error",
      error: isError(error) ? error : void 0
    });
    if (isRestError(error) && error.statusCode) {
      span.setAttribute("http.status_code", error.statusCode);
    }
    span.end();
  } catch (e) {
    logger.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
  }
}
function tryProcessResponse(span, response) {
  try {
    span.setAttribute("http.status_code", response.status);
    const serviceRequestId = response.headers.get("x-ms-request-id");
    if (serviceRequestId) {
      span.setAttribute("serviceRequestId", serviceRequestId);
    }
    if (response.status >= 400) {
      span.setStatus({
        status: "error"
      });
    }
    span.end();
  } catch (e) {
    logger.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
  }
}

// node_modules/@azure/core-rest-pipeline/dist/browser/createPipelineFromOptions.js
function createPipelineFromOptions(options) {
  var _a3;
  const pipeline = createEmptyPipeline();
  if (isNodeLike) {
    if (options.tlsOptions) {
      pipeline.addPolicy(tlsPolicy(options.tlsOptions));
    }
    pipeline.addPolicy(proxyPolicy(options.proxyOptions));
    pipeline.addPolicy(decompressResponsePolicy());
  }
  pipeline.addPolicy(formDataPolicy(), { beforePolicies: [multipartPolicyName] });
  pipeline.addPolicy(userAgentPolicy(options.userAgentOptions));
  pipeline.addPolicy(setClientRequestIdPolicy((_a3 = options.telemetryOptions) === null || _a3 === void 0 ? void 0 : _a3.clientRequestIdHeaderName));
  pipeline.addPolicy(multipartPolicy(), { afterPhase: "Deserialize" });
  pipeline.addPolicy(defaultRetryPolicy(options.retryOptions), { phase: "Retry" });
  pipeline.addPolicy(tracingPolicy(Object.assign(Object.assign({}, options.userAgentOptions), options.loggingOptions)), {
    afterPhase: "Retry"
  });
  if (isNodeLike) {
    pipeline.addPolicy(redirectPolicy(options.redirectOptions), { afterPhase: "Retry" });
  }
  pipeline.addPolicy(logPolicy(options.loggingOptions), { afterPhase: "Sign" });
  return pipeline;
}

// node_modules/@azure/core-rest-pipeline/dist/browser/fetchHttpClient.js
function isBlob2(body2) {
  return (typeof Blob === "function" || typeof Blob === "object") && body2 instanceof Blob;
}
var FetchHttpClient = class {
  /**
   * Makes a request over an underlying transport layer and returns the response.
   * @param request - The request to be made.
   */
  async sendRequest(request) {
    const url2 = new URL(request.url);
    const isInsecure = url2.protocol !== "https:";
    if (isInsecure && !request.allowInsecureConnection) {
      throw new Error(`Cannot connect to ${request.url} while allowInsecureConnection is false.`);
    }
    if (request.proxySettings) {
      throw new Error("HTTP proxy is not supported in browser environment");
    }
    try {
      return await makeRequest(request);
    } catch (e) {
      throw getError(e, request);
    }
  }
};
async function makeRequest(request) {
  const { abortController, abortControllerCleanup } = setupAbortSignal(request);
  try {
    const headers = buildFetchHeaders(request.headers);
    const { streaming, body: requestBody } = buildRequestBody2(request);
    const requestInit = Object.assign(Object.assign({ body: requestBody, method: request.method, headers, signal: abortController.signal }, "credentials" in Request.prototype ? { credentials: request.withCredentials ? "include" : "same-origin" } : {}), "cache" in Request.prototype ? { cache: "no-store" } : {});
    if (streaming) {
      requestInit.duplex = "half";
    }
    const response = await fetch(request.url, requestInit);
    if (isBlob2(request.body) && request.onUploadProgress) {
      request.onUploadProgress({ loadedBytes: request.body.size });
    }
    return buildPipelineResponse(response, request, abortControllerCleanup);
  } catch (e) {
    abortControllerCleanup === null || abortControllerCleanup === void 0 ? void 0 : abortControllerCleanup();
    throw e;
  }
}
async function buildPipelineResponse(httpResponse, request, abortControllerCleanup) {
  var _a3, _b2;
  const headers = buildPipelineHeaders(httpResponse);
  const response = {
    request,
    headers,
    status: httpResponse.status
  };
  const bodyStream = isWebReadableStream(httpResponse.body) ? buildBodyStream(httpResponse.body, {
    onProgress: request.onDownloadProgress,
    onEnd: abortControllerCleanup
  }) : httpResponse.body;
  if (
    // Value of POSITIVE_INFINITY in streamResponseStatusCodes is considered as any status code
    ((_a3 = request.streamResponseStatusCodes) === null || _a3 === void 0 ? void 0 : _a3.has(Number.POSITIVE_INFINITY)) || ((_b2 = request.streamResponseStatusCodes) === null || _b2 === void 0 ? void 0 : _b2.has(response.status))
  ) {
    if (request.enableBrowserStreams) {
      response.browserStreamBody = bodyStream !== null && bodyStream !== void 0 ? bodyStream : void 0;
    } else {
      const responseStream = new Response(bodyStream);
      response.blobBody = responseStream.blob();
      abortControllerCleanup === null || abortControllerCleanup === void 0 ? void 0 : abortControllerCleanup();
    }
  } else {
    const responseStream = new Response(bodyStream);
    response.bodyAsText = await responseStream.text();
    abortControllerCleanup === null || abortControllerCleanup === void 0 ? void 0 : abortControllerCleanup();
  }
  return response;
}
function setupAbortSignal(request) {
  const abortController = new AbortController();
  let abortControllerCleanup;
  let abortListener;
  if (request.abortSignal) {
    if (request.abortSignal.aborted) {
      throw new AbortError("The operation was aborted.");
    }
    abortListener = (event) => {
      if (event.type === "abort") {
        abortController.abort();
      }
    };
    request.abortSignal.addEventListener("abort", abortListener);
    abortControllerCleanup = () => {
      var _a3;
      if (abortListener) {
        (_a3 = request.abortSignal) === null || _a3 === void 0 ? void 0 : _a3.removeEventListener("abort", abortListener);
      }
    };
  }
  if (request.timeout > 0) {
    setTimeout(() => {
      abortController.abort();
    }, request.timeout);
  }
  return { abortController, abortControllerCleanup };
}
function getError(e, request) {
  var _a3;
  if (e && (e === null || e === void 0 ? void 0 : e.name) === "AbortError") {
    return e;
  } else {
    return new RestError(`Error sending request: ${e.message}`, {
      code: (_a3 = e === null || e === void 0 ? void 0 : e.code) !== null && _a3 !== void 0 ? _a3 : RestError.REQUEST_SEND_ERROR,
      request
    });
  }
}
function buildFetchHeaders(pipelineHeaders) {
  const headers = new Headers();
  for (const [name, value] of pipelineHeaders) {
    headers.append(name, value);
  }
  return headers;
}
function buildPipelineHeaders(httpResponse) {
  const responseHeaders = createHttpHeaders();
  for (const [name, value] of httpResponse.headers) {
    responseHeaders.set(name, value);
  }
  return responseHeaders;
}
function buildRequestBody2(request) {
  const body2 = typeof request.body === "function" ? request.body() : request.body;
  if (isNodeReadableStream(body2)) {
    throw new Error("Node streams are not supported in browser environment.");
  }
  return isWebReadableStream(body2) ? { streaming: true, body: buildBodyStream(body2, { onProgress: request.onUploadProgress }) } : { streaming: false, body: body2 };
}
function buildBodyStream(readableStream, options = {}) {
  let loadedBytes = 0;
  const { onProgress, onEnd } = options;
  if (isTransformStreamSupported(readableStream)) {
    return readableStream.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        if (chunk === null) {
          controller.terminate();
          return;
        }
        controller.enqueue(chunk);
        loadedBytes += chunk.length;
        if (onProgress) {
          onProgress({ loadedBytes });
        }
      },
      flush() {
        onEnd === null || onEnd === void 0 ? void 0 : onEnd();
      }
    }));
  } else {
    const reader = readableStream.getReader();
    return new ReadableStream({
      async pull(controller) {
        var _a3;
        const { done, value } = await reader.read();
        if (done || !value) {
          onEnd === null || onEnd === void 0 ? void 0 : onEnd();
          controller.close();
          reader.releaseLock();
          return;
        }
        loadedBytes += (_a3 = value === null || value === void 0 ? void 0 : value.length) !== null && _a3 !== void 0 ? _a3 : 0;
        controller.enqueue(value);
        if (onProgress) {
          onProgress({ loadedBytes });
        }
      },
      cancel(reason) {
        onEnd === null || onEnd === void 0 ? void 0 : onEnd();
        return reader.cancel(reason);
      }
    });
  }
}
function createFetchHttpClient() {
  return new FetchHttpClient();
}
function isTransformStreamSupported(readableStream) {
  return readableStream.pipeThrough !== void 0 && self.TransformStream !== void 0;
}

// node_modules/@azure/core-rest-pipeline/dist/browser/defaultHttpClient.js
function createDefaultHttpClient() {
  return createFetchHttpClient();
}

// node_modules/@azure/core-rest-pipeline/dist/browser/pipelineRequest.js
var PipelineRequestImpl = class {
  constructor(options) {
    var _a3, _b2, _c2, _d2, _e, _f, _g;
    this.url = options.url;
    this.body = options.body;
    this.headers = (_a3 = options.headers) !== null && _a3 !== void 0 ? _a3 : createHttpHeaders();
    this.method = (_b2 = options.method) !== null && _b2 !== void 0 ? _b2 : "GET";
    this.timeout = (_c2 = options.timeout) !== null && _c2 !== void 0 ? _c2 : 0;
    this.multipartBody = options.multipartBody;
    this.formData = options.formData;
    this.disableKeepAlive = (_d2 = options.disableKeepAlive) !== null && _d2 !== void 0 ? _d2 : false;
    this.proxySettings = options.proxySettings;
    this.streamResponseStatusCodes = options.streamResponseStatusCodes;
    this.withCredentials = (_e = options.withCredentials) !== null && _e !== void 0 ? _e : false;
    this.abortSignal = options.abortSignal;
    this.tracingOptions = options.tracingOptions;
    this.onUploadProgress = options.onUploadProgress;
    this.onDownloadProgress = options.onDownloadProgress;
    this.requestId = options.requestId || randomUUID();
    this.allowInsecureConnection = (_f = options.allowInsecureConnection) !== null && _f !== void 0 ? _f : false;
    this.enableBrowserStreams = (_g = options.enableBrowserStreams) !== null && _g !== void 0 ? _g : false;
  }
};
function createPipelineRequest(options) {
  return new PipelineRequestImpl(options);
}

// node_modules/@azure/core-rest-pipeline/dist/browser/util/tokenCycler.js
var DEFAULT_CYCLER_OPTIONS = {
  forcedRefreshWindowInMs: 1e3,
  // Force waiting for a refresh 1s before the token expires
  retryIntervalInMs: 3e3,
  // Allow refresh attempts every 3s
  refreshWindowInMs: 1e3 * 60 * 2
  // Start refreshing 2m before expiry
};
async function beginRefresh(getAccessToken, retryIntervalInMs, refreshTimeout) {
  async function tryGetAccessToken() {
    if (Date.now() < refreshTimeout) {
      try {
        return await getAccessToken();
      } catch (_a3) {
        return null;
      }
    } else {
      const finalToken = await getAccessToken();
      if (finalToken === null) {
        throw new Error("Failed to refresh access token.");
      }
      return finalToken;
    }
  }
  let token = await tryGetAccessToken();
  while (token === null) {
    await delay2(retryIntervalInMs);
    token = await tryGetAccessToken();
  }
  return token;
}
function createTokenCycler(credential, tokenCyclerOptions) {
  let refreshWorker = null;
  let token = null;
  let tenantId;
  const options = Object.assign(Object.assign({}, DEFAULT_CYCLER_OPTIONS), tokenCyclerOptions);
  const cycler = {
    /**
     * Produces true if a refresh job is currently in progress.
     */
    get isRefreshing() {
      return refreshWorker !== null;
    },
    /**
     * Produces true if the cycler SHOULD refresh (we are within the refresh
     * window and not already refreshing)
     */
    get shouldRefresh() {
      var _a3;
      if (cycler.isRefreshing) {
        return false;
      }
      if ((token === null || token === void 0 ? void 0 : token.refreshAfterTimestamp) && token.refreshAfterTimestamp < Date.now()) {
        return true;
      }
      return ((_a3 = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a3 !== void 0 ? _a3 : 0) - options.refreshWindowInMs < Date.now();
    },
    /**
     * Produces true if the cycler MUST refresh (null or nearly-expired
     * token).
     */
    get mustRefresh() {
      return token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now();
    }
  };
  function refresh(scopes, getTokenOptions) {
    var _a3;
    if (!cycler.isRefreshing) {
      const tryGetAccessToken = () => credential.getToken(scopes, getTokenOptions);
      refreshWorker = beginRefresh(
        tryGetAccessToken,
        options.retryIntervalInMs,
        // If we don't have a token, then we should timeout immediately
        (_a3 = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a3 !== void 0 ? _a3 : Date.now()
      ).then((_token) => {
        refreshWorker = null;
        token = _token;
        tenantId = getTokenOptions.tenantId;
        return token;
      }).catch((reason) => {
        refreshWorker = null;
        token = null;
        tenantId = void 0;
        throw reason;
      });
    }
    return refreshWorker;
  }
  return async (scopes, tokenOptions) => {
    const hasClaimChallenge = Boolean(tokenOptions.claims);
    const tenantIdChanged = tenantId !== tokenOptions.tenantId;
    if (hasClaimChallenge) {
      token = null;
    }
    const mustRefresh = tenantIdChanged || hasClaimChallenge || cycler.mustRefresh;
    if (mustRefresh) {
      return refresh(scopes, tokenOptions);
    }
    if (cycler.shouldRefresh) {
      refresh(scopes, tokenOptions);
    }
    return token;
  };
}

// node_modules/@azure/core-rest-pipeline/dist/browser/policies/bearerTokenAuthenticationPolicy.js
var bearerTokenAuthenticationPolicyName = "bearerTokenAuthenticationPolicy";
async function trySendRequest(request, next) {
  try {
    return [await next(request), void 0];
  } catch (e) {
    if (isRestError(e) && e.response) {
      return [e.response, e];
    } else {
      throw e;
    }
  }
}
async function defaultAuthorizeRequest(options) {
  const { scopes, getAccessToken, request } = options;
  const getTokenOptions = {
    abortSignal: request.abortSignal,
    tracingOptions: request.tracingOptions,
    enableCae: true
  };
  const accessToken = await getAccessToken(scopes, getTokenOptions);
  if (accessToken) {
    options.request.headers.set("Authorization", `Bearer ${accessToken.token}`);
  }
}
function isChallengeResponse(response) {
  return response.status === 401 && response.headers.has("WWW-Authenticate");
}
async function authorizeRequestOnCaeChallenge(onChallengeOptions, caeClaims) {
  var _a3;
  const { scopes } = onChallengeOptions;
  const accessToken = await onChallengeOptions.getAccessToken(scopes, {
    enableCae: true,
    claims: caeClaims
  });
  if (!accessToken) {
    return false;
  }
  onChallengeOptions.request.headers.set("Authorization", `${(_a3 = accessToken.tokenType) !== null && _a3 !== void 0 ? _a3 : "Bearer"} ${accessToken.token}`);
  return true;
}
function bearerTokenAuthenticationPolicy(options) {
  var _a3, _b2, _c2;
  const { credential, scopes, challengeCallbacks } = options;
  const logger5 = options.logger || logger;
  const callbacks = {
    authorizeRequest: (_b2 = (_a3 = challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequest) === null || _a3 === void 0 ? void 0 : _a3.bind(challengeCallbacks)) !== null && _b2 !== void 0 ? _b2 : defaultAuthorizeRequest,
    authorizeRequestOnChallenge: (_c2 = challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequestOnChallenge) === null || _c2 === void 0 ? void 0 : _c2.bind(challengeCallbacks)
  };
  const getAccessToken = credential ? createTokenCycler(
    credential
    /* , options */
  ) : () => Promise.resolve(null);
  return {
    name: bearerTokenAuthenticationPolicyName,
    /**
     * If there's no challenge parameter:
     * - It will try to retrieve the token using the cache, or the credential's getToken.
     * - Then it will try the next policy with or without the retrieved token.
     *
     * It uses the challenge parameters to:
     * - Skip a first attempt to get the token from the credential if there's no cached token,
     *   since it expects the token to be retrievable only after the challenge.
     * - Prepare the outgoing request if the `prepareRequest` method has been provided.
     * - Send an initial request to receive the challenge if it fails.
     * - Process a challenge if the response contains it.
     * - Retrieve a token with the challenge information, then re-send the request.
     */
    async sendRequest(request, next) {
      if (!request.url.toLowerCase().startsWith("https://")) {
        throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
      }
      await callbacks.authorizeRequest({
        scopes: Array.isArray(scopes) ? scopes : [scopes],
        request,
        getAccessToken,
        logger: logger5
      });
      let response;
      let error;
      let shouldSendRequest;
      [response, error] = await trySendRequest(request, next);
      if (isChallengeResponse(response)) {
        let claims = getCaeChallengeClaims(response.headers.get("WWW-Authenticate"));
        if (claims) {
          let parsedClaim;
          try {
            parsedClaim = atob(claims);
          } catch (e) {
            logger5.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`);
            return response;
          }
          shouldSendRequest = await authorizeRequestOnCaeChallenge({
            scopes: Array.isArray(scopes) ? scopes : [scopes],
            response,
            request,
            getAccessToken,
            logger: logger5
          }, parsedClaim);
          if (shouldSendRequest) {
            [response, error] = await trySendRequest(request, next);
          }
        } else if (callbacks.authorizeRequestOnChallenge) {
          shouldSendRequest = await callbacks.authorizeRequestOnChallenge({
            scopes: Array.isArray(scopes) ? scopes : [scopes],
            request,
            response,
            getAccessToken,
            logger: logger5
          });
          if (shouldSendRequest) {
            [response, error] = await trySendRequest(request, next);
          }
          if (isChallengeResponse(response)) {
            claims = getCaeChallengeClaims(response.headers.get("WWW-Authenticate"));
            if (claims) {
              let parsedClaim;
              try {
                parsedClaim = atob(claims);
              } catch (e) {
                logger5.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`);
                return response;
              }
              shouldSendRequest = await authorizeRequestOnCaeChallenge({
                scopes: Array.isArray(scopes) ? scopes : [scopes],
                response,
                request,
                getAccessToken,
                logger: logger5
              }, parsedClaim);
              if (shouldSendRequest) {
                [response, error] = await trySendRequest(request, next);
              }
            }
          }
        }
      }
      if (error) {
        throw error;
      } else {
        return response;
      }
    }
  };
}
function parseChallenges(challenges) {
  const challengeRegex = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g;
  const paramRegex = /(\w+)="([^"]*)"/g;
  const parsedChallenges = [];
  let match;
  while ((match = challengeRegex.exec(challenges)) !== null) {
    const scheme = match[1];
    const paramsString = match[2];
    const params = {};
    let paramMatch;
    while ((paramMatch = paramRegex.exec(paramsString)) !== null) {
      params[paramMatch[1]] = paramMatch[2];
    }
    parsedChallenges.push({ scheme, params });
  }
  return parsedChallenges;
}
function getCaeChallengeClaims(challenges) {
  var _a3;
  if (!challenges) {
    return;
  }
  const parsedChallenges = parseChallenges(challenges);
  return (_a3 = parsedChallenges.find((x) => x.scheme === "Bearer" && x.params.claims && x.params.error === "insufficient_claims")) === null || _a3 === void 0 ? void 0 : _a3.params.claims;
}

// node_modules/tslib/tslib.es6.mjs
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}

// node_modules/@azure/core-auth/dist/browser/tokenCredential.js
function isTokenCredential(credential) {
  const castCredential = credential;
  return castCredential && typeof castCredential.getToken === "function" && (castCredential.signRequest === void 0 || castCredential.getToken.length > 0);
}

// node_modules/@azure/core-http-compat/dist/browser/policies/disableKeepAlivePolicy.js
var disableKeepAlivePolicyName = "DisableKeepAlivePolicy";
function createDisableKeepAlivePolicy() {
  return {
    name: disableKeepAlivePolicyName,
    async sendRequest(request, next) {
      request.disableKeepAlive = true;
      return next(request);
    }
  };
}
function pipelineContainsDisableKeepAlivePolicy(pipeline) {
  return pipeline.getOrderedPolicies().some((policy) => policy.name === disableKeepAlivePolicyName);
}

// node_modules/@azure/core-client/dist/browser/base64.js
function encodeByteArray(value) {
  let str = "";
  for (let i = 0; i < value.length; i++) {
    str += String.fromCharCode(value[i]);
  }
  return btoa(str);
}
function decodeString(value) {
  const byteString = atob(value);
  const arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    arr[i] = byteString.charCodeAt(i);
  }
  return arr;
}

// node_modules/@azure/core-client/dist/browser/interfaces.js
var XML_ATTRKEY = "$";
var XML_CHARKEY = "_";

// node_modules/@azure/core-client/dist/browser/utils.js
function isPrimitiveBody(value, mapperTypeName) {
  return mapperTypeName !== "Composite" && mapperTypeName !== "Dictionary" && (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || (mapperTypeName === null || mapperTypeName === void 0 ? void 0 : mapperTypeName.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i)) !== null || value === void 0 || value === null);
}
var validateISODuration = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
function isDuration(value) {
  return validateISODuration.test(value);
}
var validUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
function isValidUuid(uuid) {
  return validUuidRegex.test(uuid);
}
function handleNullableResponseAndWrappableBody(responseObject) {
  const combinedHeadersAndBody = Object.assign(Object.assign({}, responseObject.headers), responseObject.body);
  if (responseObject.hasNullableType && Object.getOwnPropertyNames(combinedHeadersAndBody).length === 0) {
    return responseObject.shouldWrapBody ? { body: null } : null;
  } else {
    return responseObject.shouldWrapBody ? Object.assign(Object.assign({}, responseObject.headers), { body: responseObject.body }) : combinedHeadersAndBody;
  }
}
function flattenResponse(fullResponse, responseSpec) {
  var _a3, _b2;
  const parsedHeaders = fullResponse.parsedHeaders;
  if (fullResponse.request.method === "HEAD") {
    return Object.assign(Object.assign({}, parsedHeaders), { body: fullResponse.parsedBody });
  }
  const bodyMapper = responseSpec && responseSpec.bodyMapper;
  const isNullable = Boolean(bodyMapper === null || bodyMapper === void 0 ? void 0 : bodyMapper.nullable);
  const expectedBodyTypeName = bodyMapper === null || bodyMapper === void 0 ? void 0 : bodyMapper.type.name;
  if (expectedBodyTypeName === "Stream") {
    return Object.assign(Object.assign({}, parsedHeaders), { blobBody: fullResponse.blobBody, readableStreamBody: fullResponse.readableStreamBody });
  }
  const modelProperties = expectedBodyTypeName === "Composite" && bodyMapper.type.modelProperties || {};
  const isPageableResponse = Object.keys(modelProperties).some((k) => modelProperties[k].serializedName === "");
  if (expectedBodyTypeName === "Sequence" || isPageableResponse) {
    const arrayResponse = (_a3 = fullResponse.parsedBody) !== null && _a3 !== void 0 ? _a3 : [];
    for (const key of Object.keys(modelProperties)) {
      if (modelProperties[key].serializedName) {
        arrayResponse[key] = (_b2 = fullResponse.parsedBody) === null || _b2 === void 0 ? void 0 : _b2[key];
      }
    }
    if (parsedHeaders) {
      for (const key of Object.keys(parsedHeaders)) {
        arrayResponse[key] = parsedHeaders[key];
      }
    }
    return isNullable && !fullResponse.parsedBody && !parsedHeaders && Object.getOwnPropertyNames(modelProperties).length === 0 ? null : arrayResponse;
  }
  return handleNullableResponseAndWrappableBody({
    body: fullResponse.parsedBody,
    headers: parsedHeaders,
    hasNullableType: isNullable,
    shouldWrapBody: isPrimitiveBody(fullResponse.parsedBody, expectedBodyTypeName)
  });
}

// node_modules/@azure/core-client/dist/browser/serializer.js
var SerializerImpl = class {
  constructor(modelMappers = {}, isXML = false) {
    this.modelMappers = modelMappers;
    this.isXML = isXML;
  }
  /**
   * @deprecated Removing the constraints validation on client side.
   */
  validateConstraints(mapper, value, objectName) {
    const failValidation = (constraintName, constraintValue) => {
      throw new Error(`"${objectName}" with value "${value}" should satisfy the constraint "${constraintName}": ${constraintValue}.`);
    };
    if (mapper.constraints && value !== void 0 && value !== null) {
      const { ExclusiveMaximum, ExclusiveMinimum, InclusiveMaximum, InclusiveMinimum, MaxItems, MaxLength, MinItems, MinLength, MultipleOf, Pattern, UniqueItems } = mapper.constraints;
      if (ExclusiveMaximum !== void 0 && value >= ExclusiveMaximum) {
        failValidation("ExclusiveMaximum", ExclusiveMaximum);
      }
      if (ExclusiveMinimum !== void 0 && value <= ExclusiveMinimum) {
        failValidation("ExclusiveMinimum", ExclusiveMinimum);
      }
      if (InclusiveMaximum !== void 0 && value > InclusiveMaximum) {
        failValidation("InclusiveMaximum", InclusiveMaximum);
      }
      if (InclusiveMinimum !== void 0 && value < InclusiveMinimum) {
        failValidation("InclusiveMinimum", InclusiveMinimum);
      }
      if (MaxItems !== void 0 && value.length > MaxItems) {
        failValidation("MaxItems", MaxItems);
      }
      if (MaxLength !== void 0 && value.length > MaxLength) {
        failValidation("MaxLength", MaxLength);
      }
      if (MinItems !== void 0 && value.length < MinItems) {
        failValidation("MinItems", MinItems);
      }
      if (MinLength !== void 0 && value.length < MinLength) {
        failValidation("MinLength", MinLength);
      }
      if (MultipleOf !== void 0 && value % MultipleOf !== 0) {
        failValidation("MultipleOf", MultipleOf);
      }
      if (Pattern) {
        const pattern = typeof Pattern === "string" ? new RegExp(Pattern) : Pattern;
        if (typeof value !== "string" || value.match(pattern) === null) {
          failValidation("Pattern", Pattern);
        }
      }
      if (UniqueItems && value.some((item, i, ar) => ar.indexOf(item) !== i)) {
        failValidation("UniqueItems", UniqueItems);
      }
    }
  }
  /**
   * Serialize the given object based on its metadata defined in the mapper
   *
   * @param mapper - The mapper which defines the metadata of the serializable object
   *
   * @param object - A valid Javascript object to be serialized
   *
   * @param objectName - Name of the serialized object
   *
   * @param options - additional options to serialization
   *
   * @returns A valid serialized Javascript object
   */
  serialize(mapper, object, objectName, options = { xml: {} }) {
    var _a3, _b2, _c2;
    const updatedOptions = {
      xml: {
        rootName: (_a3 = options.xml.rootName) !== null && _a3 !== void 0 ? _a3 : "",
        includeRoot: (_b2 = options.xml.includeRoot) !== null && _b2 !== void 0 ? _b2 : false,
        xmlCharKey: (_c2 = options.xml.xmlCharKey) !== null && _c2 !== void 0 ? _c2 : XML_CHARKEY
      }
    };
    let payload = {};
    const mapperType = mapper.type.name;
    if (!objectName) {
      objectName = mapper.serializedName;
    }
    if (mapperType.match(/^Sequence$/i) !== null) {
      payload = [];
    }
    if (mapper.isConstant) {
      object = mapper.defaultValue;
    }
    const { required, nullable } = mapper;
    if (required && nullable && object === void 0) {
      throw new Error(`${objectName} cannot be undefined.`);
    }
    if (required && !nullable && (object === void 0 || object === null)) {
      throw new Error(`${objectName} cannot be null or undefined.`);
    }
    if (!required && nullable === false && object === null) {
      throw new Error(`${objectName} cannot be null.`);
    }
    if (object === void 0 || object === null) {
      payload = object;
    } else {
      if (mapperType.match(/^any$/i) !== null) {
        payload = object;
      } else if (mapperType.match(/^(Number|String|Boolean|Object|Stream|Uuid)$/i) !== null) {
        payload = serializeBasicTypes(mapperType, objectName, object);
      } else if (mapperType.match(/^Enum$/i) !== null) {
        const enumMapper = mapper;
        payload = serializeEnumType(objectName, enumMapper.type.allowedValues, object);
      } else if (mapperType.match(/^(Date|DateTime|TimeSpan|DateTimeRfc1123|UnixTime)$/i) !== null) {
        payload = serializeDateTypes(mapperType, object, objectName);
      } else if (mapperType.match(/^ByteArray$/i) !== null) {
        payload = serializeByteArrayType(objectName, object);
      } else if (mapperType.match(/^Base64Url$/i) !== null) {
        payload = serializeBase64UrlType(objectName, object);
      } else if (mapperType.match(/^Sequence$/i) !== null) {
        payload = serializeSequenceType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
      } else if (mapperType.match(/^Dictionary$/i) !== null) {
        payload = serializeDictionaryType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
      } else if (mapperType.match(/^Composite$/i) !== null) {
        payload = serializeCompositeType(this, mapper, object, objectName, Boolean(this.isXML), updatedOptions);
      }
    }
    return payload;
  }
  /**
   * Deserialize the given object based on its metadata defined in the mapper
   *
   * @param mapper - The mapper which defines the metadata of the serializable object
   *
   * @param responseBody - A valid Javascript entity to be deserialized
   *
   * @param objectName - Name of the deserialized object
   *
   * @param options - Controls behavior of XML parser and builder.
   *
   * @returns A valid deserialized Javascript object
   */
  deserialize(mapper, responseBody, objectName, options = { xml: {} }) {
    var _a3, _b2, _c2, _d2;
    const updatedOptions = {
      xml: {
        rootName: (_a3 = options.xml.rootName) !== null && _a3 !== void 0 ? _a3 : "",
        includeRoot: (_b2 = options.xml.includeRoot) !== null && _b2 !== void 0 ? _b2 : false,
        xmlCharKey: (_c2 = options.xml.xmlCharKey) !== null && _c2 !== void 0 ? _c2 : XML_CHARKEY
      },
      ignoreUnknownProperties: (_d2 = options.ignoreUnknownProperties) !== null && _d2 !== void 0 ? _d2 : false
    };
    if (responseBody === void 0 || responseBody === null) {
      if (this.isXML && mapper.type.name === "Sequence" && !mapper.xmlIsWrapped) {
        responseBody = [];
      }
      if (mapper.defaultValue !== void 0) {
        responseBody = mapper.defaultValue;
      }
      return responseBody;
    }
    let payload;
    const mapperType = mapper.type.name;
    if (!objectName) {
      objectName = mapper.serializedName;
    }
    if (mapperType.match(/^Composite$/i) !== null) {
      payload = deserializeCompositeType(this, mapper, responseBody, objectName, updatedOptions);
    } else {
      if (this.isXML) {
        const xmlCharKey = updatedOptions.xml.xmlCharKey;
        if (responseBody[XML_ATTRKEY] !== void 0 && responseBody[xmlCharKey] !== void 0) {
          responseBody = responseBody[xmlCharKey];
        }
      }
      if (mapperType.match(/^Number$/i) !== null) {
        payload = parseFloat(responseBody);
        if (isNaN(payload)) {
          payload = responseBody;
        }
      } else if (mapperType.match(/^Boolean$/i) !== null) {
        if (responseBody === "true") {
          payload = true;
        } else if (responseBody === "false") {
          payload = false;
        } else {
          payload = responseBody;
        }
      } else if (mapperType.match(/^(String|Enum|Object|Stream|Uuid|TimeSpan|any)$/i) !== null) {
        payload = responseBody;
      } else if (mapperType.match(/^(Date|DateTime|DateTimeRfc1123)$/i) !== null) {
        payload = new Date(responseBody);
      } else if (mapperType.match(/^UnixTime$/i) !== null) {
        payload = unixTimeToDate(responseBody);
      } else if (mapperType.match(/^ByteArray$/i) !== null) {
        payload = decodeString(responseBody);
      } else if (mapperType.match(/^Base64Url$/i) !== null) {
        payload = base64UrlToByteArray(responseBody);
      } else if (mapperType.match(/^Sequence$/i) !== null) {
        payload = deserializeSequenceType(this, mapper, responseBody, objectName, updatedOptions);
      } else if (mapperType.match(/^Dictionary$/i) !== null) {
        payload = deserializeDictionaryType(this, mapper, responseBody, objectName, updatedOptions);
      }
    }
    if (mapper.isConstant) {
      payload = mapper.defaultValue;
    }
    return payload;
  }
};
function createSerializer(modelMappers = {}, isXML = false) {
  return new SerializerImpl(modelMappers, isXML);
}
function trimEnd(str, ch) {
  let len = str.length;
  while (len - 1 >= 0 && str[len - 1] === ch) {
    --len;
  }
  return str.substr(0, len);
}
function bufferToBase64Url(buffer) {
  if (!buffer) {
    return void 0;
  }
  if (!(buffer instanceof Uint8Array)) {
    throw new Error(`Please provide an input of type Uint8Array for converting to Base64Url.`);
  }
  const str = encodeByteArray(buffer);
  return trimEnd(str, "=").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64UrlToByteArray(str) {
  if (!str) {
    return void 0;
  }
  if (str && typeof str.valueOf() !== "string") {
    throw new Error("Please provide an input of type string for converting to Uint8Array");
  }
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  return decodeString(str);
}
function splitSerializeName(prop) {
  const classes = [];
  let partialclass = "";
  if (prop) {
    const subwords = prop.split(".");
    for (const item of subwords) {
      if (item.charAt(item.length - 1) === "\\") {
        partialclass += item.substr(0, item.length - 1) + ".";
      } else {
        partialclass += item;
        classes.push(partialclass);
        partialclass = "";
      }
    }
  }
  return classes;
}
function dateToUnixTime(d) {
  if (!d) {
    return void 0;
  }
  if (typeof d.valueOf() === "string") {
    d = new Date(d);
  }
  return Math.floor(d.getTime() / 1e3);
}
function unixTimeToDate(n) {
  if (!n) {
    return void 0;
  }
  return new Date(n * 1e3);
}
function serializeBasicTypes(typeName, objectName, value) {
  if (value !== null && value !== void 0) {
    if (typeName.match(/^Number$/i) !== null) {
      if (typeof value !== "number") {
        throw new Error(`${objectName} with value ${value} must be of type number.`);
      }
    } else if (typeName.match(/^String$/i) !== null) {
      if (typeof value.valueOf() !== "string") {
        throw new Error(`${objectName} with value "${value}" must be of type string.`);
      }
    } else if (typeName.match(/^Uuid$/i) !== null) {
      if (!(typeof value.valueOf() === "string" && isValidUuid(value))) {
        throw new Error(`${objectName} with value "${value}" must be of type string and a valid uuid.`);
      }
    } else if (typeName.match(/^Boolean$/i) !== null) {
      if (typeof value !== "boolean") {
        throw new Error(`${objectName} with value ${value} must be of type boolean.`);
      }
    } else if (typeName.match(/^Stream$/i) !== null) {
      const objectType = typeof value;
      if (objectType !== "string" && typeof value.pipe !== "function" && // NodeJS.ReadableStream
      typeof value.tee !== "function" && // browser ReadableStream
      !(value instanceof ArrayBuffer) && !ArrayBuffer.isView(value) && // File objects count as a type of Blob, so we want to use instanceof explicitly
      !((typeof Blob === "function" || typeof Blob === "object") && value instanceof Blob) && objectType !== "function") {
        throw new Error(`${objectName} must be a string, Blob, ArrayBuffer, ArrayBufferView, ReadableStream, or () => ReadableStream.`);
      }
    }
  }
  return value;
}
function serializeEnumType(objectName, allowedValues, value) {
  if (!allowedValues) {
    throw new Error(`Please provide a set of allowedValues to validate ${objectName} as an Enum Type.`);
  }
  const isPresent = allowedValues.some((item) => {
    if (typeof item.valueOf() === "string") {
      return item.toLowerCase() === value.toLowerCase();
    }
    return item === value;
  });
  if (!isPresent) {
    throw new Error(`${value} is not a valid value for ${objectName}. The valid values are: ${JSON.stringify(allowedValues)}.`);
  }
  return value;
}
function serializeByteArrayType(objectName, value) {
  if (value !== void 0 && value !== null) {
    if (!(value instanceof Uint8Array)) {
      throw new Error(`${objectName} must be of type Uint8Array.`);
    }
    value = encodeByteArray(value);
  }
  return value;
}
function serializeBase64UrlType(objectName, value) {
  if (value !== void 0 && value !== null) {
    if (!(value instanceof Uint8Array)) {
      throw new Error(`${objectName} must be of type Uint8Array.`);
    }
    value = bufferToBase64Url(value);
  }
  return value;
}
function serializeDateTypes(typeName, value, objectName) {
  if (value !== void 0 && value !== null) {
    if (typeName.match(/^Date$/i) !== null) {
      if (!(value instanceof Date || typeof value.valueOf() === "string" && !isNaN(Date.parse(value)))) {
        throw new Error(`${objectName} must be an instanceof Date or a string in ISO8601 format.`);
      }
      value = value instanceof Date ? value.toISOString().substring(0, 10) : new Date(value).toISOString().substring(0, 10);
    } else if (typeName.match(/^DateTime$/i) !== null) {
      if (!(value instanceof Date || typeof value.valueOf() === "string" && !isNaN(Date.parse(value)))) {
        throw new Error(`${objectName} must be an instanceof Date or a string in ISO8601 format.`);
      }
      value = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
    } else if (typeName.match(/^DateTimeRfc1123$/i) !== null) {
      if (!(value instanceof Date || typeof value.valueOf() === "string" && !isNaN(Date.parse(value)))) {
        throw new Error(`${objectName} must be an instanceof Date or a string in RFC-1123 format.`);
      }
      value = value instanceof Date ? value.toUTCString() : new Date(value).toUTCString();
    } else if (typeName.match(/^UnixTime$/i) !== null) {
      if (!(value instanceof Date || typeof value.valueOf() === "string" && !isNaN(Date.parse(value)))) {
        throw new Error(`${objectName} must be an instanceof Date or a string in RFC-1123/ISO8601 format for it to be serialized in UnixTime/Epoch format.`);
      }
      value = dateToUnixTime(value);
    } else if (typeName.match(/^TimeSpan$/i) !== null) {
      if (!isDuration(value)) {
        throw new Error(`${objectName} must be a string in ISO 8601 format. Instead was "${value}".`);
      }
    }
  }
  return value;
}
function serializeSequenceType(serializer2, mapper, object, objectName, isXml, options) {
  var _a3;
  if (!Array.isArray(object)) {
    throw new Error(`${objectName} must be of type Array.`);
  }
  let elementType = mapper.type.element;
  if (!elementType || typeof elementType !== "object") {
    throw new Error(`element" metadata for an Array must be defined in the mapper and it must of type "object" in ${objectName}.`);
  }
  if (elementType.type.name === "Composite" && elementType.type.className) {
    elementType = (_a3 = serializer2.modelMappers[elementType.type.className]) !== null && _a3 !== void 0 ? _a3 : elementType;
  }
  const tempArray = [];
  for (let i = 0; i < object.length; i++) {
    const serializedValue = serializer2.serialize(elementType, object[i], objectName, options);
    if (isXml && elementType.xmlNamespace) {
      const xmlnsKey = elementType.xmlNamespacePrefix ? `xmlns:${elementType.xmlNamespacePrefix}` : "xmlns";
      if (elementType.type.name === "Composite") {
        tempArray[i] = Object.assign({}, serializedValue);
        tempArray[i][XML_ATTRKEY] = { [xmlnsKey]: elementType.xmlNamespace };
      } else {
        tempArray[i] = {};
        tempArray[i][options.xml.xmlCharKey] = serializedValue;
        tempArray[i][XML_ATTRKEY] = { [xmlnsKey]: elementType.xmlNamespace };
      }
    } else {
      tempArray[i] = serializedValue;
    }
  }
  return tempArray;
}
function serializeDictionaryType(serializer2, mapper, object, objectName, isXml, options) {
  if (typeof object !== "object") {
    throw new Error(`${objectName} must be of type object.`);
  }
  const valueType = mapper.type.value;
  if (!valueType || typeof valueType !== "object") {
    throw new Error(`"value" metadata for a Dictionary must be defined in the mapper and it must of type "object" in ${objectName}.`);
  }
  const tempDictionary = {};
  for (const key of Object.keys(object)) {
    const serializedValue = serializer2.serialize(valueType, object[key], objectName, options);
    tempDictionary[key] = getXmlObjectValue(valueType, serializedValue, isXml, options);
  }
  if (isXml && mapper.xmlNamespace) {
    const xmlnsKey = mapper.xmlNamespacePrefix ? `xmlns:${mapper.xmlNamespacePrefix}` : "xmlns";
    const result = tempDictionary;
    result[XML_ATTRKEY] = { [xmlnsKey]: mapper.xmlNamespace };
    return result;
  }
  return tempDictionary;
}
function resolveAdditionalProperties(serializer2, mapper, objectName) {
  const additionalProperties = mapper.type.additionalProperties;
  if (!additionalProperties && mapper.type.className) {
    const modelMapper = resolveReferencedMapper(serializer2, mapper, objectName);
    return modelMapper === null || modelMapper === void 0 ? void 0 : modelMapper.type.additionalProperties;
  }
  return additionalProperties;
}
function resolveReferencedMapper(serializer2, mapper, objectName) {
  const className = mapper.type.className;
  if (!className) {
    throw new Error(`Class name for model "${objectName}" is not provided in the mapper "${JSON.stringify(mapper, void 0, 2)}".`);
  }
  return serializer2.modelMappers[className];
}
function resolveModelProperties(serializer2, mapper, objectName) {
  let modelProps = mapper.type.modelProperties;
  if (!modelProps) {
    const modelMapper = resolveReferencedMapper(serializer2, mapper, objectName);
    if (!modelMapper) {
      throw new Error(`mapper() cannot be null or undefined for model "${mapper.type.className}".`);
    }
    modelProps = modelMapper === null || modelMapper === void 0 ? void 0 : modelMapper.type.modelProperties;
    if (!modelProps) {
      throw new Error(`modelProperties cannot be null or undefined in the mapper "${JSON.stringify(modelMapper)}" of type "${mapper.type.className}" for object "${objectName}".`);
    }
  }
  return modelProps;
}
function serializeCompositeType(serializer2, mapper, object, objectName, isXml, options) {
  if (getPolymorphicDiscriminatorRecursively(serializer2, mapper)) {
    mapper = getPolymorphicMapper(serializer2, mapper, object, "clientName");
  }
  if (object !== void 0 && object !== null) {
    const payload = {};
    const modelProps = resolveModelProperties(serializer2, mapper, objectName);
    for (const key of Object.keys(modelProps)) {
      const propertyMapper = modelProps[key];
      if (propertyMapper.readOnly) {
        continue;
      }
      let propName;
      let parentObject = payload;
      if (serializer2.isXML) {
        if (propertyMapper.xmlIsWrapped) {
          propName = propertyMapper.xmlName;
        } else {
          propName = propertyMapper.xmlElementName || propertyMapper.xmlName;
        }
      } else {
        const paths = splitSerializeName(propertyMapper.serializedName);
        propName = paths.pop();
        for (const pathName of paths) {
          const childObject = parentObject[pathName];
          if ((childObject === void 0 || childObject === null) && (object[key] !== void 0 && object[key] !== null || propertyMapper.defaultValue !== void 0)) {
            parentObject[pathName] = {};
          }
          parentObject = parentObject[pathName];
        }
      }
      if (parentObject !== void 0 && parentObject !== null) {
        if (isXml && mapper.xmlNamespace) {
          const xmlnsKey = mapper.xmlNamespacePrefix ? `xmlns:${mapper.xmlNamespacePrefix}` : "xmlns";
          parentObject[XML_ATTRKEY] = Object.assign(Object.assign({}, parentObject[XML_ATTRKEY]), { [xmlnsKey]: mapper.xmlNamespace });
        }
        const propertyObjectName = propertyMapper.serializedName !== "" ? objectName + "." + propertyMapper.serializedName : objectName;
        let toSerialize = object[key];
        const polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer2, mapper);
        if (polymorphicDiscriminator && polymorphicDiscriminator.clientName === key && (toSerialize === void 0 || toSerialize === null)) {
          toSerialize = mapper.serializedName;
        }
        const serializedValue = serializer2.serialize(propertyMapper, toSerialize, propertyObjectName, options);
        if (serializedValue !== void 0 && propName !== void 0 && propName !== null) {
          const value = getXmlObjectValue(propertyMapper, serializedValue, isXml, options);
          if (isXml && propertyMapper.xmlIsAttribute) {
            parentObject[XML_ATTRKEY] = parentObject[XML_ATTRKEY] || {};
            parentObject[XML_ATTRKEY][propName] = serializedValue;
          } else if (isXml && propertyMapper.xmlIsWrapped) {
            parentObject[propName] = { [propertyMapper.xmlElementName]: value };
          } else {
            parentObject[propName] = value;
          }
        }
      }
    }
    const additionalPropertiesMapper = resolveAdditionalProperties(serializer2, mapper, objectName);
    if (additionalPropertiesMapper) {
      const propNames = Object.keys(modelProps);
      for (const clientPropName in object) {
        const isAdditionalProperty = propNames.every((pn) => pn !== clientPropName);
        if (isAdditionalProperty) {
          payload[clientPropName] = serializer2.serialize(additionalPropertiesMapper, object[clientPropName], objectName + '["' + clientPropName + '"]', options);
        }
      }
    }
    return payload;
  }
  return object;
}
function getXmlObjectValue(propertyMapper, serializedValue, isXml, options) {
  if (!isXml || !propertyMapper.xmlNamespace) {
    return serializedValue;
  }
  const xmlnsKey = propertyMapper.xmlNamespacePrefix ? `xmlns:${propertyMapper.xmlNamespacePrefix}` : "xmlns";
  const xmlNamespace = { [xmlnsKey]: propertyMapper.xmlNamespace };
  if (["Composite"].includes(propertyMapper.type.name)) {
    if (serializedValue[XML_ATTRKEY]) {
      return serializedValue;
    } else {
      const result2 = Object.assign({}, serializedValue);
      result2[XML_ATTRKEY] = xmlNamespace;
      return result2;
    }
  }
  const result = {};
  result[options.xml.xmlCharKey] = serializedValue;
  result[XML_ATTRKEY] = xmlNamespace;
  return result;
}
function isSpecialXmlProperty(propertyName, options) {
  return [XML_ATTRKEY, options.xml.xmlCharKey].includes(propertyName);
}
function deserializeCompositeType(serializer2, mapper, responseBody, objectName, options) {
  var _a3, _b2;
  const xmlCharKey = (_a3 = options.xml.xmlCharKey) !== null && _a3 !== void 0 ? _a3 : XML_CHARKEY;
  if (getPolymorphicDiscriminatorRecursively(serializer2, mapper)) {
    mapper = getPolymorphicMapper(serializer2, mapper, responseBody, "serializedName");
  }
  const modelProps = resolveModelProperties(serializer2, mapper, objectName);
  let instance = {};
  const handledPropertyNames = [];
  for (const key of Object.keys(modelProps)) {
    const propertyMapper = modelProps[key];
    const paths = splitSerializeName(modelProps[key].serializedName);
    handledPropertyNames.push(paths[0]);
    const { serializedName, xmlName, xmlElementName } = propertyMapper;
    let propertyObjectName = objectName;
    if (serializedName !== "" && serializedName !== void 0) {
      propertyObjectName = objectName + "." + serializedName;
    }
    const headerCollectionPrefix = propertyMapper.headerCollectionPrefix;
    if (headerCollectionPrefix) {
      const dictionary = {};
      for (const headerKey of Object.keys(responseBody)) {
        if (headerKey.startsWith(headerCollectionPrefix)) {
          dictionary[headerKey.substring(headerCollectionPrefix.length)] = serializer2.deserialize(propertyMapper.type.value, responseBody[headerKey], propertyObjectName, options);
        }
        handledPropertyNames.push(headerKey);
      }
      instance[key] = dictionary;
    } else if (serializer2.isXML) {
      if (propertyMapper.xmlIsAttribute && responseBody[XML_ATTRKEY]) {
        instance[key] = serializer2.deserialize(propertyMapper, responseBody[XML_ATTRKEY][xmlName], propertyObjectName, options);
      } else if (propertyMapper.xmlIsMsText) {
        if (responseBody[xmlCharKey] !== void 0) {
          instance[key] = responseBody[xmlCharKey];
        } else if (typeof responseBody === "string") {
          instance[key] = responseBody;
        }
      } else {
        const propertyName = xmlElementName || xmlName || serializedName;
        if (propertyMapper.xmlIsWrapped) {
          const wrapped = responseBody[xmlName];
          const elementList = (_b2 = wrapped === null || wrapped === void 0 ? void 0 : wrapped[xmlElementName]) !== null && _b2 !== void 0 ? _b2 : [];
          instance[key] = serializer2.deserialize(propertyMapper, elementList, propertyObjectName, options);
          handledPropertyNames.push(xmlName);
        } else {
          const property = responseBody[propertyName];
          instance[key] = serializer2.deserialize(propertyMapper, property, propertyObjectName, options);
          handledPropertyNames.push(propertyName);
        }
      }
    } else {
      let propertyInstance;
      let res = responseBody;
      let steps = 0;
      for (const item of paths) {
        if (!res)
          break;
        steps++;
        res = res[item];
      }
      if (res === null && steps < paths.length) {
        res = void 0;
      }
      propertyInstance = res;
      const polymorphicDiscriminator = mapper.type.polymorphicDiscriminator;
      if (polymorphicDiscriminator && key === polymorphicDiscriminator.clientName && (propertyInstance === void 0 || propertyInstance === null)) {
        propertyInstance = mapper.serializedName;
      }
      let serializedValue;
      if (Array.isArray(responseBody[key]) && modelProps[key].serializedName === "") {
        propertyInstance = responseBody[key];
        const arrayInstance = serializer2.deserialize(propertyMapper, propertyInstance, propertyObjectName, options);
        for (const [k, v] of Object.entries(instance)) {
          if (!Object.prototype.hasOwnProperty.call(arrayInstance, k)) {
            arrayInstance[k] = v;
          }
        }
        instance = arrayInstance;
      } else if (propertyInstance !== void 0 || propertyMapper.defaultValue !== void 0) {
        serializedValue = serializer2.deserialize(propertyMapper, propertyInstance, propertyObjectName, options);
        instance[key] = serializedValue;
      }
    }
  }
  const additionalPropertiesMapper = mapper.type.additionalProperties;
  if (additionalPropertiesMapper) {
    const isAdditionalProperty = (responsePropName) => {
      for (const clientPropName in modelProps) {
        const paths = splitSerializeName(modelProps[clientPropName].serializedName);
        if (paths[0] === responsePropName) {
          return false;
        }
      }
      return true;
    };
    for (const responsePropName in responseBody) {
      if (isAdditionalProperty(responsePropName)) {
        instance[responsePropName] = serializer2.deserialize(additionalPropertiesMapper, responseBody[responsePropName], objectName + '["' + responsePropName + '"]', options);
      }
    }
  } else if (responseBody && !options.ignoreUnknownProperties) {
    for (const key of Object.keys(responseBody)) {
      if (instance[key] === void 0 && !handledPropertyNames.includes(key) && !isSpecialXmlProperty(key, options)) {
        instance[key] = responseBody[key];
      }
    }
  }
  return instance;
}
function deserializeDictionaryType(serializer2, mapper, responseBody, objectName, options) {
  const value = mapper.type.value;
  if (!value || typeof value !== "object") {
    throw new Error(`"value" metadata for a Dictionary must be defined in the mapper and it must of type "object" in ${objectName}`);
  }
  if (responseBody) {
    const tempDictionary = {};
    for (const key of Object.keys(responseBody)) {
      tempDictionary[key] = serializer2.deserialize(value, responseBody[key], objectName, options);
    }
    return tempDictionary;
  }
  return responseBody;
}
function deserializeSequenceType(serializer2, mapper, responseBody, objectName, options) {
  var _a3;
  let element = mapper.type.element;
  if (!element || typeof element !== "object") {
    throw new Error(`element" metadata for an Array must be defined in the mapper and it must of type "object" in ${objectName}`);
  }
  if (responseBody) {
    if (!Array.isArray(responseBody)) {
      responseBody = [responseBody];
    }
    if (element.type.name === "Composite" && element.type.className) {
      element = (_a3 = serializer2.modelMappers[element.type.className]) !== null && _a3 !== void 0 ? _a3 : element;
    }
    const tempArray = [];
    for (let i = 0; i < responseBody.length; i++) {
      tempArray[i] = serializer2.deserialize(element, responseBody[i], `${objectName}[${i}]`, options);
    }
    return tempArray;
  }
  return responseBody;
}
function getIndexDiscriminator(discriminators, discriminatorValue, typeName) {
  const typeNamesToCheck = [typeName];
  while (typeNamesToCheck.length) {
    const currentName = typeNamesToCheck.shift();
    const indexDiscriminator = discriminatorValue === currentName ? discriminatorValue : currentName + "." + discriminatorValue;
    if (Object.prototype.hasOwnProperty.call(discriminators, indexDiscriminator)) {
      return discriminators[indexDiscriminator];
    } else {
      for (const [name, mapper] of Object.entries(discriminators)) {
        if (name.startsWith(currentName + ".") && mapper.type.uberParent === currentName && mapper.type.className) {
          typeNamesToCheck.push(mapper.type.className);
        }
      }
    }
  }
  return void 0;
}
function getPolymorphicMapper(serializer2, mapper, object, polymorphicPropertyName) {
  var _a3;
  const polymorphicDiscriminator = getPolymorphicDiscriminatorRecursively(serializer2, mapper);
  if (polymorphicDiscriminator) {
    let discriminatorName = polymorphicDiscriminator[polymorphicPropertyName];
    if (discriminatorName) {
      if (polymorphicPropertyName === "serializedName") {
        discriminatorName = discriminatorName.replace(/\\/gi, "");
      }
      const discriminatorValue = object[discriminatorName];
      const typeName = (_a3 = mapper.type.uberParent) !== null && _a3 !== void 0 ? _a3 : mapper.type.className;
      if (typeof discriminatorValue === "string" && typeName) {
        const polymorphicMapper = getIndexDiscriminator(serializer2.modelMappers.discriminators, discriminatorValue, typeName);
        if (polymorphicMapper) {
          mapper = polymorphicMapper;
        }
      }
    }
  }
  return mapper;
}
function getPolymorphicDiscriminatorRecursively(serializer2, mapper) {
  return mapper.type.polymorphicDiscriminator || getPolymorphicDiscriminatorSafely(serializer2, mapper.type.uberParent) || getPolymorphicDiscriminatorSafely(serializer2, mapper.type.className);
}
function getPolymorphicDiscriminatorSafely(serializer2, typeName) {
  return typeName && serializer2.modelMappers[typeName] && serializer2.modelMappers[typeName].type.polymorphicDiscriminator;
}
var MapperTypeNames = {
  Base64Url: "Base64Url",
  Boolean: "Boolean",
  ByteArray: "ByteArray",
  Composite: "Composite",
  Date: "Date",
  DateTime: "DateTime",
  DateTimeRfc1123: "DateTimeRfc1123",
  Dictionary: "Dictionary",
  Enum: "Enum",
  Number: "Number",
  Object: "Object",
  Sequence: "Sequence",
  String: "String",
  Stream: "Stream",
  TimeSpan: "TimeSpan",
  UnixTime: "UnixTime"
};

// node_modules/@azure/core-client/dist/browser/state.js
var state2 = {
  operationRequestMap: /* @__PURE__ */ new WeakMap()
};

// node_modules/@azure/core-client/dist/browser/operationHelpers.js
function getOperationArgumentValueFromParameter(operationArguments, parameter, fallbackObject) {
  let parameterPath = parameter.parameterPath;
  const parameterMapper = parameter.mapper;
  let value;
  if (typeof parameterPath === "string") {
    parameterPath = [parameterPath];
  }
  if (Array.isArray(parameterPath)) {
    if (parameterPath.length > 0) {
      if (parameterMapper.isConstant) {
        value = parameterMapper.defaultValue;
      } else {
        let propertySearchResult = getPropertyFromParameterPath(operationArguments, parameterPath);
        if (!propertySearchResult.propertyFound && fallbackObject) {
          propertySearchResult = getPropertyFromParameterPath(fallbackObject, parameterPath);
        }
        let useDefaultValue = false;
        if (!propertySearchResult.propertyFound) {
          useDefaultValue = parameterMapper.required || parameterPath[0] === "options" && parameterPath.length === 2;
        }
        value = useDefaultValue ? parameterMapper.defaultValue : propertySearchResult.propertyValue;
      }
    }
  } else {
    if (parameterMapper.required) {
      value = {};
    }
    for (const propertyName in parameterPath) {
      const propertyMapper = parameterMapper.type.modelProperties[propertyName];
      const propertyPath = parameterPath[propertyName];
      const propertyValue = getOperationArgumentValueFromParameter(operationArguments, {
        parameterPath: propertyPath,
        mapper: propertyMapper
      }, fallbackObject);
      if (propertyValue !== void 0) {
        if (!value) {
          value = {};
        }
        value[propertyName] = propertyValue;
      }
    }
  }
  return value;
}
function getPropertyFromParameterPath(parent, parameterPath) {
  const result = { propertyFound: false };
  let i = 0;
  for (; i < parameterPath.length; ++i) {
    const parameterPathPart = parameterPath[i];
    if (parent && parameterPathPart in parent) {
      parent = parent[parameterPathPart];
    } else {
      break;
    }
  }
  if (i === parameterPath.length) {
    result.propertyValue = parent;
    result.propertyFound = true;
  }
  return result;
}
var originalRequestSymbol = Symbol.for("@azure/core-client original request");
function hasOriginalRequest(request) {
  return originalRequestSymbol in request;
}
function getOperationRequestInfo(request) {
  if (hasOriginalRequest(request)) {
    return getOperationRequestInfo(request[originalRequestSymbol]);
  }
  let info = state2.operationRequestMap.get(request);
  if (!info) {
    info = {};
    state2.operationRequestMap.set(request, info);
  }
  return info;
}

// node_modules/@azure/core-client/dist/browser/deserializationPolicy.js
var defaultJsonContentTypes = ["application/json", "text/json"];
var defaultXmlContentTypes = ["application/xml", "application/atom+xml"];
var deserializationPolicyName = "deserializationPolicy";
function deserializationPolicy(options = {}) {
  var _a3, _b2, _c2, _d2, _e, _f, _g;
  const jsonContentTypes = (_b2 = (_a3 = options.expectedContentTypes) === null || _a3 === void 0 ? void 0 : _a3.json) !== null && _b2 !== void 0 ? _b2 : defaultJsonContentTypes;
  const xmlContentTypes = (_d2 = (_c2 = options.expectedContentTypes) === null || _c2 === void 0 ? void 0 : _c2.xml) !== null && _d2 !== void 0 ? _d2 : defaultXmlContentTypes;
  const parseXML2 = options.parseXML;
  const serializerOptions = options.serializerOptions;
  const updatedOptions = {
    xml: {
      rootName: (_e = serializerOptions === null || serializerOptions === void 0 ? void 0 : serializerOptions.xml.rootName) !== null && _e !== void 0 ? _e : "",
      includeRoot: (_f = serializerOptions === null || serializerOptions === void 0 ? void 0 : serializerOptions.xml.includeRoot) !== null && _f !== void 0 ? _f : false,
      xmlCharKey: (_g = serializerOptions === null || serializerOptions === void 0 ? void 0 : serializerOptions.xml.xmlCharKey) !== null && _g !== void 0 ? _g : XML_CHARKEY
    }
  };
  return {
    name: deserializationPolicyName,
    async sendRequest(request, next) {
      const response = await next(request);
      return deserializeResponseBody(jsonContentTypes, xmlContentTypes, response, updatedOptions, parseXML2);
    }
  };
}
function getOperationResponseMap(parsedResponse) {
  let result;
  const request = parsedResponse.request;
  const operationInfo = getOperationRequestInfo(request);
  const operationSpec = operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo.operationSpec;
  if (operationSpec) {
    if (!(operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo.operationResponseGetter)) {
      result = operationSpec.responses[parsedResponse.status];
    } else {
      result = operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo.operationResponseGetter(operationSpec, parsedResponse);
    }
  }
  return result;
}
function shouldDeserializeResponse(parsedResponse) {
  const request = parsedResponse.request;
  const operationInfo = getOperationRequestInfo(request);
  const shouldDeserialize = operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo.shouldDeserialize;
  let result;
  if (shouldDeserialize === void 0) {
    result = true;
  } else if (typeof shouldDeserialize === "boolean") {
    result = shouldDeserialize;
  } else {
    result = shouldDeserialize(parsedResponse);
  }
  return result;
}
async function deserializeResponseBody(jsonContentTypes, xmlContentTypes, response, options, parseXML2) {
  const parsedResponse = await parse(jsonContentTypes, xmlContentTypes, response, options, parseXML2);
  if (!shouldDeserializeResponse(parsedResponse)) {
    return parsedResponse;
  }
  const operationInfo = getOperationRequestInfo(parsedResponse.request);
  const operationSpec = operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo.operationSpec;
  if (!operationSpec || !operationSpec.responses) {
    return parsedResponse;
  }
  const responseSpec = getOperationResponseMap(parsedResponse);
  const { error, shouldReturnResponse } = handleErrorResponse(parsedResponse, operationSpec, responseSpec, options);
  if (error) {
    throw error;
  } else if (shouldReturnResponse) {
    return parsedResponse;
  }
  if (responseSpec) {
    if (responseSpec.bodyMapper) {
      let valueToDeserialize = parsedResponse.parsedBody;
      if (operationSpec.isXML && responseSpec.bodyMapper.type.name === MapperTypeNames.Sequence) {
        valueToDeserialize = typeof valueToDeserialize === "object" ? valueToDeserialize[responseSpec.bodyMapper.xmlElementName] : [];
      }
      try {
        parsedResponse.parsedBody = operationSpec.serializer.deserialize(responseSpec.bodyMapper, valueToDeserialize, "operationRes.parsedBody", options);
      } catch (deserializeError) {
        const restError = new RestError(`Error ${deserializeError} occurred in deserializing the responseBody - ${parsedResponse.bodyAsText}`, {
          statusCode: parsedResponse.status,
          request: parsedResponse.request,
          response: parsedResponse
        });
        throw restError;
      }
    } else if (operationSpec.httpMethod === "HEAD") {
      parsedResponse.parsedBody = response.status >= 200 && response.status < 300;
    }
    if (responseSpec.headersMapper) {
      parsedResponse.parsedHeaders = operationSpec.serializer.deserialize(responseSpec.headersMapper, parsedResponse.headers.toJSON(), "operationRes.parsedHeaders", { xml: {}, ignoreUnknownProperties: true });
    }
  }
  return parsedResponse;
}
function isOperationSpecEmpty(operationSpec) {
  const expectedStatusCodes = Object.keys(operationSpec.responses);
  return expectedStatusCodes.length === 0 || expectedStatusCodes.length === 1 && expectedStatusCodes[0] === "default";
}
function handleErrorResponse(parsedResponse, operationSpec, responseSpec, options) {
  var _a3;
  const isSuccessByStatus = 200 <= parsedResponse.status && parsedResponse.status < 300;
  const isExpectedStatusCode = isOperationSpecEmpty(operationSpec) ? isSuccessByStatus : !!responseSpec;
  if (isExpectedStatusCode) {
    if (responseSpec) {
      if (!responseSpec.isError) {
        return { error: null, shouldReturnResponse: false };
      }
    } else {
      return { error: null, shouldReturnResponse: false };
    }
  }
  const errorResponseSpec = responseSpec !== null && responseSpec !== void 0 ? responseSpec : operationSpec.responses.default;
  const initialErrorMessage = ((_a3 = parsedResponse.request.streamResponseStatusCodes) === null || _a3 === void 0 ? void 0 : _a3.has(parsedResponse.status)) ? `Unexpected status code: ${parsedResponse.status}` : parsedResponse.bodyAsText;
  const error = new RestError(initialErrorMessage, {
    statusCode: parsedResponse.status,
    request: parsedResponse.request,
    response: parsedResponse
  });
  if (!errorResponseSpec) {
    throw error;
  }
  const defaultBodyMapper = errorResponseSpec.bodyMapper;
  const defaultHeadersMapper = errorResponseSpec.headersMapper;
  try {
    if (parsedResponse.parsedBody) {
      const parsedBody = parsedResponse.parsedBody;
      let deserializedError;
      if (defaultBodyMapper) {
        let valueToDeserialize = parsedBody;
        if (operationSpec.isXML && defaultBodyMapper.type.name === MapperTypeNames.Sequence) {
          valueToDeserialize = [];
          const elementName = defaultBodyMapper.xmlElementName;
          if (typeof parsedBody === "object" && elementName) {
            valueToDeserialize = parsedBody[elementName];
          }
        }
        deserializedError = operationSpec.serializer.deserialize(defaultBodyMapper, valueToDeserialize, "error.response.parsedBody", options);
      }
      const internalError = parsedBody.error || deserializedError || parsedBody;
      error.code = internalError.code;
      if (internalError.message) {
        error.message = internalError.message;
      }
      if (defaultBodyMapper) {
        error.response.parsedBody = deserializedError;
      }
    }
    if (parsedResponse.headers && defaultHeadersMapper) {
      error.response.parsedHeaders = operationSpec.serializer.deserialize(defaultHeadersMapper, parsedResponse.headers.toJSON(), "operationRes.parsedHeaders");
    }
  } catch (defaultError) {
    error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody - "${parsedResponse.bodyAsText}" for the default response.`;
  }
  return { error, shouldReturnResponse: false };
}
async function parse(jsonContentTypes, xmlContentTypes, operationResponse, opts, parseXML2) {
  var _a3;
  if (!((_a3 = operationResponse.request.streamResponseStatusCodes) === null || _a3 === void 0 ? void 0 : _a3.has(operationResponse.status)) && operationResponse.bodyAsText) {
    const text = operationResponse.bodyAsText;
    const contentType2 = operationResponse.headers.get("Content-Type") || "";
    const contentComponents = !contentType2 ? [] : contentType2.split(";").map((component) => component.toLowerCase());
    try {
      if (contentComponents.length === 0 || contentComponents.some((component) => jsonContentTypes.indexOf(component) !== -1)) {
        operationResponse.parsedBody = JSON.parse(text);
        return operationResponse;
      } else if (contentComponents.some((component) => xmlContentTypes.indexOf(component) !== -1)) {
        if (!parseXML2) {
          throw new Error("Parsing XML not supported.");
        }
        const body2 = await parseXML2(text, opts.xml);
        operationResponse.parsedBody = body2;
        return operationResponse;
      }
    } catch (err) {
      const msg = `Error "${err}" occurred while parsing the response body - ${operationResponse.bodyAsText}.`;
      const errCode = err.code || RestError.PARSE_ERROR;
      const e = new RestError(msg, {
        code: errCode,
        statusCode: operationResponse.status,
        request: operationResponse.request,
        response: operationResponse
      });
      throw e;
    }
  }
  return operationResponse;
}

// node_modules/@azure/core-client/dist/browser/interfaceHelpers.js
function getStreamingResponseStatusCodes(operationSpec) {
  const result = /* @__PURE__ */ new Set();
  for (const statusCode in operationSpec.responses) {
    const operationResponse = operationSpec.responses[statusCode];
    if (operationResponse.bodyMapper && operationResponse.bodyMapper.type.name === MapperTypeNames.Stream) {
      result.add(Number(statusCode));
    }
  }
  return result;
}
function getPathStringFromParameter(parameter) {
  const { parameterPath, mapper } = parameter;
  let result;
  if (typeof parameterPath === "string") {
    result = parameterPath;
  } else if (Array.isArray(parameterPath)) {
    result = parameterPath.join(".");
  } else {
    result = mapper.serializedName;
  }
  return result;
}

// node_modules/@azure/core-client/dist/browser/serializationPolicy.js
var serializationPolicyName = "serializationPolicy";
function serializationPolicy(options = {}) {
  const stringifyXML2 = options.stringifyXML;
  return {
    name: serializationPolicyName,
    async sendRequest(request, next) {
      const operationInfo = getOperationRequestInfo(request);
      const operationSpec = operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo.operationSpec;
      const operationArguments = operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo.operationArguments;
      if (operationSpec && operationArguments) {
        serializeHeaders(request, operationArguments, operationSpec);
        serializeRequestBody(request, operationArguments, operationSpec, stringifyXML2);
      }
      return next(request);
    }
  };
}
function serializeHeaders(request, operationArguments, operationSpec) {
  var _a3, _b2;
  if (operationSpec.headerParameters) {
    for (const headerParameter of operationSpec.headerParameters) {
      let headerValue = getOperationArgumentValueFromParameter(operationArguments, headerParameter);
      if (headerValue !== null && headerValue !== void 0 || headerParameter.mapper.required) {
        headerValue = operationSpec.serializer.serialize(headerParameter.mapper, headerValue, getPathStringFromParameter(headerParameter));
        const headerCollectionPrefix = headerParameter.mapper.headerCollectionPrefix;
        if (headerCollectionPrefix) {
          for (const key of Object.keys(headerValue)) {
            request.headers.set(headerCollectionPrefix + key, headerValue[key]);
          }
        } else {
          request.headers.set(headerParameter.mapper.serializedName || getPathStringFromParameter(headerParameter), headerValue);
        }
      }
    }
  }
  const customHeaders = (_b2 = (_a3 = operationArguments.options) === null || _a3 === void 0 ? void 0 : _a3.requestOptions) === null || _b2 === void 0 ? void 0 : _b2.customHeaders;
  if (customHeaders) {
    for (const customHeaderName of Object.keys(customHeaders)) {
      request.headers.set(customHeaderName, customHeaders[customHeaderName]);
    }
  }
}
function serializeRequestBody(request, operationArguments, operationSpec, stringifyXML2 = function() {
  throw new Error("XML serialization unsupported!");
}) {
  var _a3, _b2, _c2, _d2, _e;
  const serializerOptions = (_a3 = operationArguments.options) === null || _a3 === void 0 ? void 0 : _a3.serializerOptions;
  const updatedOptions = {
    xml: {
      rootName: (_b2 = serializerOptions === null || serializerOptions === void 0 ? void 0 : serializerOptions.xml.rootName) !== null && _b2 !== void 0 ? _b2 : "",
      includeRoot: (_c2 = serializerOptions === null || serializerOptions === void 0 ? void 0 : serializerOptions.xml.includeRoot) !== null && _c2 !== void 0 ? _c2 : false,
      xmlCharKey: (_d2 = serializerOptions === null || serializerOptions === void 0 ? void 0 : serializerOptions.xml.xmlCharKey) !== null && _d2 !== void 0 ? _d2 : XML_CHARKEY
    }
  };
  const xmlCharKey = updatedOptions.xml.xmlCharKey;
  if (operationSpec.requestBody && operationSpec.requestBody.mapper) {
    request.body = getOperationArgumentValueFromParameter(operationArguments, operationSpec.requestBody);
    const bodyMapper = operationSpec.requestBody.mapper;
    const { required, serializedName, xmlName, xmlElementName, xmlNamespace, xmlNamespacePrefix, nullable } = bodyMapper;
    const typeName = bodyMapper.type.name;
    try {
      if (request.body !== void 0 && request.body !== null || nullable && request.body === null || required) {
        const requestBodyParameterPathString = getPathStringFromParameter(operationSpec.requestBody);
        request.body = operationSpec.serializer.serialize(bodyMapper, request.body, requestBodyParameterPathString, updatedOptions);
        const isStream = typeName === MapperTypeNames.Stream;
        if (operationSpec.isXML) {
          const xmlnsKey = xmlNamespacePrefix ? `xmlns:${xmlNamespacePrefix}` : "xmlns";
          const value = getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, request.body, updatedOptions);
          if (typeName === MapperTypeNames.Sequence) {
            request.body = stringifyXML2(prepareXMLRootList(value, xmlElementName || xmlName || serializedName, xmlnsKey, xmlNamespace), { rootName: xmlName || serializedName, xmlCharKey });
          } else if (!isStream) {
            request.body = stringifyXML2(value, {
              rootName: xmlName || serializedName,
              xmlCharKey
            });
          }
        } else if (typeName === MapperTypeNames.String && (((_e = operationSpec.contentType) === null || _e === void 0 ? void 0 : _e.match("text/plain")) || operationSpec.mediaType === "text")) {
          return;
        } else if (!isStream) {
          request.body = JSON.stringify(request.body);
        }
      }
    } catch (error) {
      throw new Error(`Error "${error.message}" occurred in serializing the payload - ${JSON.stringify(serializedName, void 0, "  ")}.`);
    }
  } else if (operationSpec.formDataParameters && operationSpec.formDataParameters.length > 0) {
    request.formData = {};
    for (const formDataParameter of operationSpec.formDataParameters) {
      const formDataParameterValue = getOperationArgumentValueFromParameter(operationArguments, formDataParameter);
      if (formDataParameterValue !== void 0 && formDataParameterValue !== null) {
        const formDataParameterPropertyName = formDataParameter.mapper.serializedName || getPathStringFromParameter(formDataParameter);
        request.formData[formDataParameterPropertyName] = operationSpec.serializer.serialize(formDataParameter.mapper, formDataParameterValue, getPathStringFromParameter(formDataParameter), updatedOptions);
      }
    }
  }
}
function getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, serializedValue, options) {
  if (xmlNamespace && !["Composite", "Sequence", "Dictionary"].includes(typeName)) {
    const result = {};
    result[options.xml.xmlCharKey] = serializedValue;
    result[XML_ATTRKEY] = { [xmlnsKey]: xmlNamespace };
    return result;
  }
  return serializedValue;
}
function prepareXMLRootList(obj, elementName, xmlNamespaceKey, xmlNamespace) {
  if (!Array.isArray(obj)) {
    obj = [obj];
  }
  if (!xmlNamespaceKey || !xmlNamespace) {
    return { [elementName]: obj };
  }
  const result = { [elementName]: obj };
  result[XML_ATTRKEY] = { [xmlNamespaceKey]: xmlNamespace };
  return result;
}

// node_modules/@azure/core-client/dist/browser/pipeline.js
function createClientPipeline(options = {}) {
  const pipeline = createPipelineFromOptions(options !== null && options !== void 0 ? options : {});
  if (options.credentialOptions) {
    pipeline.addPolicy(bearerTokenAuthenticationPolicy({
      credential: options.credentialOptions.credential,
      scopes: options.credentialOptions.credentialScopes
    }));
  }
  pipeline.addPolicy(serializationPolicy(options.serializationOptions), { phase: "Serialize" });
  pipeline.addPolicy(deserializationPolicy(options.deserializationOptions), {
    phase: "Deserialize"
  });
  return pipeline;
}

// node_modules/@azure/core-client/dist/browser/httpClientCache.js
var cachedHttpClient;
function getCachedDefaultHttpClient() {
  if (!cachedHttpClient) {
    cachedHttpClient = createDefaultHttpClient();
  }
  return cachedHttpClient;
}

// node_modules/@azure/core-client/dist/browser/urlHelpers.js
var CollectionFormatToDelimiterMap = {
  CSV: ",",
  SSV: " ",
  Multi: "Multi",
  TSV: "	",
  Pipes: "|"
};
function getRequestUrl(baseUri, operationSpec, operationArguments, fallbackObject) {
  const urlReplacements = calculateUrlReplacements(operationSpec, operationArguments, fallbackObject);
  let isAbsolutePath = false;
  let requestUrl = replaceAll(baseUri, urlReplacements);
  if (operationSpec.path) {
    let path = replaceAll(operationSpec.path, urlReplacements);
    if (operationSpec.path === "/{nextLink}" && path.startsWith("/")) {
      path = path.substring(1);
    }
    if (isAbsoluteUrl(path)) {
      requestUrl = path;
      isAbsolutePath = true;
    } else {
      requestUrl = appendPath(requestUrl, path);
    }
  }
  const { queryParams, sequenceParams } = calculateQueryParameters(operationSpec, operationArguments, fallbackObject);
  requestUrl = appendQueryParams(requestUrl, queryParams, sequenceParams, isAbsolutePath);
  return requestUrl;
}
function replaceAll(input, replacements) {
  let result = input;
  for (const [searchValue, replaceValue] of replacements) {
    result = result.split(searchValue).join(replaceValue);
  }
  return result;
}
function calculateUrlReplacements(operationSpec, operationArguments, fallbackObject) {
  var _a3;
  const result = /* @__PURE__ */ new Map();
  if ((_a3 = operationSpec.urlParameters) === null || _a3 === void 0 ? void 0 : _a3.length) {
    for (const urlParameter of operationSpec.urlParameters) {
      let urlParameterValue = getOperationArgumentValueFromParameter(operationArguments, urlParameter, fallbackObject);
      const parameterPathString = getPathStringFromParameter(urlParameter);
      urlParameterValue = operationSpec.serializer.serialize(urlParameter.mapper, urlParameterValue, parameterPathString);
      if (!urlParameter.skipEncoding) {
        urlParameterValue = encodeURIComponent(urlParameterValue);
      }
      result.set(`{${urlParameter.mapper.serializedName || parameterPathString}}`, urlParameterValue);
    }
  }
  return result;
}
function isAbsoluteUrl(url2) {
  return url2.includes("://");
}
function appendPath(url2, pathToAppend) {
  if (!pathToAppend) {
    return url2;
  }
  const parsedUrl = new URL(url2);
  let newPath = parsedUrl.pathname;
  if (!newPath.endsWith("/")) {
    newPath = `${newPath}/`;
  }
  if (pathToAppend.startsWith("/")) {
    pathToAppend = pathToAppend.substring(1);
  }
  const searchStart = pathToAppend.indexOf("?");
  if (searchStart !== -1) {
    const path = pathToAppend.substring(0, searchStart);
    const search = pathToAppend.substring(searchStart + 1);
    newPath = newPath + path;
    if (search) {
      parsedUrl.search = parsedUrl.search ? `${parsedUrl.search}&${search}` : search;
    }
  } else {
    newPath = newPath + pathToAppend;
  }
  parsedUrl.pathname = newPath;
  return parsedUrl.toString();
}
function calculateQueryParameters(operationSpec, operationArguments, fallbackObject) {
  var _a3;
  const result = /* @__PURE__ */ new Map();
  const sequenceParams = /* @__PURE__ */ new Set();
  if ((_a3 = operationSpec.queryParameters) === null || _a3 === void 0 ? void 0 : _a3.length) {
    for (const queryParameter of operationSpec.queryParameters) {
      if (queryParameter.mapper.type.name === "Sequence" && queryParameter.mapper.serializedName) {
        sequenceParams.add(queryParameter.mapper.serializedName);
      }
      let queryParameterValue = getOperationArgumentValueFromParameter(operationArguments, queryParameter, fallbackObject);
      if (queryParameterValue !== void 0 && queryParameterValue !== null || queryParameter.mapper.required) {
        queryParameterValue = operationSpec.serializer.serialize(queryParameter.mapper, queryParameterValue, getPathStringFromParameter(queryParameter));
        const delimiter2 = queryParameter.collectionFormat ? CollectionFormatToDelimiterMap[queryParameter.collectionFormat] : "";
        if (Array.isArray(queryParameterValue)) {
          queryParameterValue = queryParameterValue.map((item) => {
            if (item === null || item === void 0) {
              return "";
            }
            return item;
          });
        }
        if (queryParameter.collectionFormat === "Multi" && queryParameterValue.length === 0) {
          continue;
        } else if (Array.isArray(queryParameterValue) && (queryParameter.collectionFormat === "SSV" || queryParameter.collectionFormat === "TSV")) {
          queryParameterValue = queryParameterValue.join(delimiter2);
        }
        if (!queryParameter.skipEncoding) {
          if (Array.isArray(queryParameterValue)) {
            queryParameterValue = queryParameterValue.map((item) => {
              return encodeURIComponent(item);
            });
          } else {
            queryParameterValue = encodeURIComponent(queryParameterValue);
          }
        }
        if (Array.isArray(queryParameterValue) && (queryParameter.collectionFormat === "CSV" || queryParameter.collectionFormat === "Pipes")) {
          queryParameterValue = queryParameterValue.join(delimiter2);
        }
        result.set(queryParameter.mapper.serializedName || getPathStringFromParameter(queryParameter), queryParameterValue);
      }
    }
  }
  return {
    queryParams: result,
    sequenceParams
  };
}
function simpleParseQueryParams(queryString) {
  const result = /* @__PURE__ */ new Map();
  if (!queryString || queryString[0] !== "?") {
    return result;
  }
  queryString = queryString.slice(1);
  const pairs = queryString.split("&");
  for (const pair of pairs) {
    const [name, value] = pair.split("=", 2);
    const existingValue = result.get(name);
    if (existingValue) {
      if (Array.isArray(existingValue)) {
        existingValue.push(value);
      } else {
        result.set(name, [existingValue, value]);
      }
    } else {
      result.set(name, value);
    }
  }
  return result;
}
function appendQueryParams(url2, queryParams, sequenceParams, noOverwrite = false) {
  if (queryParams.size === 0) {
    return url2;
  }
  const parsedUrl = new URL(url2);
  const combinedParams = simpleParseQueryParams(parsedUrl.search);
  for (const [name, value] of queryParams) {
    const existingValue = combinedParams.get(name);
    if (Array.isArray(existingValue)) {
      if (Array.isArray(value)) {
        existingValue.push(...value);
        const valueSet = new Set(existingValue);
        combinedParams.set(name, Array.from(valueSet));
      } else {
        existingValue.push(value);
      }
    } else if (existingValue) {
      if (Array.isArray(value)) {
        value.unshift(existingValue);
      } else if (sequenceParams.has(name)) {
        combinedParams.set(name, [existingValue, value]);
      }
      if (!noOverwrite) {
        combinedParams.set(name, value);
      }
    } else {
      combinedParams.set(name, value);
    }
  }
  const searchPieces = [];
  for (const [name, value] of combinedParams) {
    if (typeof value === "string") {
      searchPieces.push(`${name}=${value}`);
    } else if (Array.isArray(value)) {
      for (const subValue of value) {
        searchPieces.push(`${name}=${subValue}`);
      }
    } else {
      searchPieces.push(`${name}=${value}`);
    }
  }
  parsedUrl.search = searchPieces.length ? `?${searchPieces.join("&")}` : "";
  return parsedUrl.toString();
}

// node_modules/@azure/core-client/dist/browser/log.js
var logger2 = createClientLogger("core-client");

// node_modules/@azure/core-client/dist/browser/serviceClient.js
var ServiceClient = class {
  /**
   * The ServiceClient constructor
   * @param credential - The credentials used for authentication with the service.
   * @param options - The service client options that govern the behavior of the client.
   */
  constructor(options = {}) {
    var _a3, _b2;
    this._requestContentType = options.requestContentType;
    this._endpoint = (_a3 = options.endpoint) !== null && _a3 !== void 0 ? _a3 : options.baseUri;
    if (options.baseUri) {
      logger2.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
    }
    this._allowInsecureConnection = options.allowInsecureConnection;
    this._httpClient = options.httpClient || getCachedDefaultHttpClient();
    this.pipeline = options.pipeline || createDefaultPipeline(options);
    if ((_b2 = options.additionalPolicies) === null || _b2 === void 0 ? void 0 : _b2.length) {
      for (const { policy, position } of options.additionalPolicies) {
        const afterPhase = position === "perRetry" ? "Sign" : void 0;
        this.pipeline.addPolicy(policy, {
          afterPhase
        });
      }
    }
  }
  /**
   * Send the provided httpRequest.
   */
  async sendRequest(request) {
    return this.pipeline.sendRequest(this._httpClient, request);
  }
  /**
   * Send an HTTP request that is populated using the provided OperationSpec.
   * @typeParam T - The typed result of the request, based on the OperationSpec.
   * @param operationArguments - The arguments that the HTTP request's templated values will be populated from.
   * @param operationSpec - The OperationSpec to use to populate the httpRequest.
   */
  async sendOperationRequest(operationArguments, operationSpec) {
    const endpoint = operationSpec.baseUrl || this._endpoint;
    if (!endpoint) {
      throw new Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
    }
    const url2 = getRequestUrl(endpoint, operationSpec, operationArguments, this);
    const request = createPipelineRequest({
      url: url2
    });
    request.method = operationSpec.httpMethod;
    const operationInfo = getOperationRequestInfo(request);
    operationInfo.operationSpec = operationSpec;
    operationInfo.operationArguments = operationArguments;
    const contentType2 = operationSpec.contentType || this._requestContentType;
    if (contentType2 && operationSpec.requestBody) {
      request.headers.set("Content-Type", contentType2);
    }
    const options = operationArguments.options;
    if (options) {
      const requestOptions = options.requestOptions;
      if (requestOptions) {
        if (requestOptions.timeout) {
          request.timeout = requestOptions.timeout;
        }
        if (requestOptions.onUploadProgress) {
          request.onUploadProgress = requestOptions.onUploadProgress;
        }
        if (requestOptions.onDownloadProgress) {
          request.onDownloadProgress = requestOptions.onDownloadProgress;
        }
        if (requestOptions.shouldDeserialize !== void 0) {
          operationInfo.shouldDeserialize = requestOptions.shouldDeserialize;
        }
        if (requestOptions.allowInsecureConnection) {
          request.allowInsecureConnection = true;
        }
      }
      if (options.abortSignal) {
        request.abortSignal = options.abortSignal;
      }
      if (options.tracingOptions) {
        request.tracingOptions = options.tracingOptions;
      }
    }
    if (this._allowInsecureConnection) {
      request.allowInsecureConnection = true;
    }
    if (request.streamResponseStatusCodes === void 0) {
      request.streamResponseStatusCodes = getStreamingResponseStatusCodes(operationSpec);
    }
    try {
      const rawResponse = await this.sendRequest(request);
      const flatResponse = flattenResponse(rawResponse, operationSpec.responses[rawResponse.status]);
      if (options === null || options === void 0 ? void 0 : options.onResponse) {
        options.onResponse(rawResponse, flatResponse);
      }
      return flatResponse;
    } catch (error) {
      if (typeof error === "object" && (error === null || error === void 0 ? void 0 : error.response)) {
        const rawResponse = error.response;
        const flatResponse = flattenResponse(rawResponse, operationSpec.responses[error.statusCode] || operationSpec.responses["default"]);
        error.details = flatResponse;
        if (options === null || options === void 0 ? void 0 : options.onResponse) {
          options.onResponse(rawResponse, flatResponse, error);
        }
      }
      throw error;
    }
  }
};
function createDefaultPipeline(options) {
  const credentialScopes = getCredentialScopes(options);
  const credentialOptions = options.credential && credentialScopes ? { credentialScopes, credential: options.credential } : void 0;
  return createClientPipeline(Object.assign(Object.assign({}, options), { credentialOptions }));
}
function getCredentialScopes(options) {
  if (options.credentialScopes) {
    return options.credentialScopes;
  }
  if (options.endpoint) {
    return `${options.endpoint}/.default`;
  }
  if (options.baseUri) {
    return `${options.baseUri}/.default`;
  }
  if (options.credential && !options.credentialScopes) {
    throw new Error(`When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy`);
  }
  return void 0;
}

// node_modules/@azure/core-client/dist/browser/authorizeRequestOnTenantChallenge.js
var Constants = {
  DefaultScope: "/.default",
  /**
   * Defines constants for use with HTTP headers.
   */
  HeaderConstants: {
    /**
     * The Authorization header.
     */
    AUTHORIZATION: "authorization"
  }
};
function isUuid(text) {
  return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(text);
}
var authorizeRequestOnTenantChallenge = async (challengeOptions) => {
  const requestOptions = requestToOptions(challengeOptions.request);
  const challenge = getChallenge(challengeOptions.response);
  if (challenge) {
    const challengeInfo = parseChallenge(challenge);
    const challengeScopes = buildScopes(challengeOptions, challengeInfo);
    const tenantId = extractTenantId(challengeInfo);
    if (!tenantId) {
      return false;
    }
    const accessToken = await challengeOptions.getAccessToken(challengeScopes, Object.assign(Object.assign({}, requestOptions), { tenantId }));
    if (!accessToken) {
      return false;
    }
    challengeOptions.request.headers.set(Constants.HeaderConstants.AUTHORIZATION, `Bearer ${accessToken.token}`);
    return true;
  }
  return false;
};
function extractTenantId(challengeInfo) {
  const parsedAuthUri = new URL(challengeInfo.authorization_uri);
  const pathSegments = parsedAuthUri.pathname.split("/");
  const tenantId = pathSegments[1];
  if (tenantId && isUuid(tenantId)) {
    return tenantId;
  }
  return void 0;
}
function buildScopes(challengeOptions, challengeInfo) {
  if (!challengeInfo.resource_id) {
    return challengeOptions.scopes;
  }
  const challengeScopes = new URL(challengeInfo.resource_id);
  challengeScopes.pathname = Constants.DefaultScope;
  let scope = challengeScopes.toString();
  if (scope === "https://disk.azure.com/.default") {
    scope = "https://disk.azure.com//.default";
  }
  return [scope];
}
function getChallenge(response) {
  const challenge = response.headers.get("WWW-Authenticate");
  if (response.status === 401 && challenge) {
    return challenge;
  }
  return;
}
function parseChallenge(challenge) {
  const bearerChallenge = challenge.slice("Bearer ".length);
  const challengeParts = `${bearerChallenge.trim()} `.split(" ").filter((x) => x);
  const keyValuePairs = challengeParts.map((keyValue) => (([key, value]) => ({ [key]: value }))(keyValue.trim().split("=")));
  return keyValuePairs.reduce((a, b) => Object.assign(Object.assign({}, a), b), {});
}
function requestToOptions(request) {
  return {
    abortSignal: request.abortSignal,
    requestOptions: {
      timeout: request.timeout
    },
    tracingOptions: request.tracingOptions
  };
}

// node_modules/@azure/core-http-compat/dist/browser/util.js
var originalRequestSymbol2 = Symbol("Original PipelineRequest");
var originalClientRequestSymbol = Symbol.for("@azure/core-client original request");
function toPipelineRequest(webResource, options = {}) {
  const compatWebResource = webResource;
  const request = compatWebResource[originalRequestSymbol2];
  const headers = createHttpHeaders(webResource.headers.toJson({ preserveCase: true }));
  if (request) {
    request.headers = headers;
    return request;
  } else {
    const newRequest = createPipelineRequest({
      url: webResource.url,
      method: webResource.method,
      headers,
      withCredentials: webResource.withCredentials,
      timeout: webResource.timeout,
      requestId: webResource.requestId,
      abortSignal: webResource.abortSignal,
      body: webResource.body,
      formData: webResource.formData,
      disableKeepAlive: !!webResource.keepAlive,
      onDownloadProgress: webResource.onDownloadProgress,
      onUploadProgress: webResource.onUploadProgress,
      proxySettings: webResource.proxySettings,
      streamResponseStatusCodes: webResource.streamResponseStatusCodes
    });
    if (options.originalRequest) {
      newRequest[originalClientRequestSymbol] = options.originalRequest;
    }
    return newRequest;
  }
}
function toWebResourceLike(request, options) {
  var _a3;
  const originalRequest = (_a3 = options === null || options === void 0 ? void 0 : options.originalRequest) !== null && _a3 !== void 0 ? _a3 : request;
  const webResource = {
    url: request.url,
    method: request.method,
    headers: toHttpHeadersLike(request.headers),
    withCredentials: request.withCredentials,
    timeout: request.timeout,
    requestId: request.headers.get("x-ms-client-request-id") || request.requestId,
    abortSignal: request.abortSignal,
    body: request.body,
    formData: request.formData,
    keepAlive: !!request.disableKeepAlive,
    onDownloadProgress: request.onDownloadProgress,
    onUploadProgress: request.onUploadProgress,
    proxySettings: request.proxySettings,
    streamResponseStatusCodes: request.streamResponseStatusCodes,
    clone() {
      throw new Error("Cannot clone a non-proxied WebResourceLike");
    },
    prepare() {
      throw new Error("WebResourceLike.prepare() is not supported by @azure/core-http-compat");
    },
    validateRequestProperties() {
    }
  };
  if (options === null || options === void 0 ? void 0 : options.createProxy) {
    return new Proxy(webResource, {
      get(target, prop, receiver) {
        if (prop === originalRequestSymbol2) {
          return request;
        } else if (prop === "clone") {
          return () => {
            return toWebResourceLike(toPipelineRequest(webResource, { originalRequest }), {
              createProxy: true,
              originalRequest
            });
          };
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        if (prop === "keepAlive") {
          request.disableKeepAlive = !value;
        }
        const passThroughProps = [
          "url",
          "method",
          "withCredentials",
          "timeout",
          "requestId",
          "abortSignal",
          "body",
          "formData",
          "onDownloadProgress",
          "onUploadProgress",
          "proxySettings",
          "streamResponseStatusCodes"
        ];
        if (typeof prop === "string" && passThroughProps.includes(prop)) {
          request[prop] = value;
        }
        return Reflect.set(target, prop, value, receiver);
      }
    });
  } else {
    return webResource;
  }
}
function toHttpHeadersLike(headers) {
  return new HttpHeaders(headers.toJSON({ preserveCase: true }));
}
function getHeaderKey(headerName) {
  return headerName.toLowerCase();
}
var HttpHeaders = class _HttpHeaders {
  constructor(rawHeaders) {
    this._headersMap = {};
    if (rawHeaders) {
      for (const headerName in rawHeaders) {
        this.set(headerName, rawHeaders[headerName]);
      }
    }
  }
  /**
   * Set a header in this collection with the provided name and value. The name is
   * case-insensitive.
   * @param headerName - The name of the header to set. This value is case-insensitive.
   * @param headerValue - The value of the header to set.
   */
  set(headerName, headerValue) {
    this._headersMap[getHeaderKey(headerName)] = {
      name: headerName,
      value: headerValue.toString()
    };
  }
  /**
   * Get the header value for the provided header name, or undefined if no header exists in this
   * collection with the provided name.
   * @param headerName - The name of the header.
   */
  get(headerName) {
    const header = this._headersMap[getHeaderKey(headerName)];
    return !header ? void 0 : header.value;
  }
  /**
   * Get whether or not this header collection contains a header entry for the provided header name.
   */
  contains(headerName) {
    return !!this._headersMap[getHeaderKey(headerName)];
  }
  /**
   * Remove the header with the provided headerName. Return whether or not the header existed and
   * was removed.
   * @param headerName - The name of the header to remove.
   */
  remove(headerName) {
    const result = this.contains(headerName);
    delete this._headersMap[getHeaderKey(headerName)];
    return result;
  }
  /**
   * Get the headers that are contained this collection as an object.
   */
  rawHeaders() {
    return this.toJson({ preserveCase: true });
  }
  /**
   * Get the headers that are contained in this collection as an array.
   */
  headersArray() {
    const headers = [];
    for (const headerKey in this._headersMap) {
      headers.push(this._headersMap[headerKey]);
    }
    return headers;
  }
  /**
   * Get the header names that are contained in this collection.
   */
  headerNames() {
    const headerNames = [];
    const headers = this.headersArray();
    for (let i = 0; i < headers.length; ++i) {
      headerNames.push(headers[i].name);
    }
    return headerNames;
  }
  /**
   * Get the header values that are contained in this collection.
   */
  headerValues() {
    const headerValues = [];
    const headers = this.headersArray();
    for (let i = 0; i < headers.length; ++i) {
      headerValues.push(headers[i].value);
    }
    return headerValues;
  }
  /**
   * Get the JSON object representation of this HTTP header collection.
   */
  toJson(options = {}) {
    const result = {};
    if (options.preserveCase) {
      for (const headerKey in this._headersMap) {
        const header = this._headersMap[headerKey];
        result[header.name] = header.value;
      }
    } else {
      for (const headerKey in this._headersMap) {
        const header = this._headersMap[headerKey];
        result[getHeaderKey(header.name)] = header.value;
      }
    }
    return result;
  }
  /**
   * Get the string representation of this HTTP header collection.
   */
  toString() {
    return JSON.stringify(this.toJson({ preserveCase: true }));
  }
  /**
   * Create a deep clone/copy of this HttpHeaders collection.
   */
  clone() {
    const resultPreservingCasing = {};
    for (const headerKey in this._headersMap) {
      const header = this._headersMap[headerKey];
      resultPreservingCasing[header.name] = header.value;
    }
    return new _HttpHeaders(resultPreservingCasing);
  }
};

// node_modules/@azure/core-http-compat/dist/browser/response.js
var originalResponse = Symbol("Original FullOperationResponse");
function toCompatResponse(response, options) {
  let request = toWebResourceLike(response.request);
  let headers = toHttpHeadersLike(response.headers);
  if (options === null || options === void 0 ? void 0 : options.createProxy) {
    return new Proxy(response, {
      get(target, prop, receiver) {
        if (prop === "headers") {
          return headers;
        } else if (prop === "request") {
          return request;
        } else if (prop === originalResponse) {
          return response;
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        if (prop === "headers") {
          headers = value;
        } else if (prop === "request") {
          request = value;
        }
        return Reflect.set(target, prop, value, receiver);
      }
    });
  } else {
    return Object.assign(Object.assign({}, response), {
      request,
      headers
    });
  }
}
function toPipelineResponse(compatResponse) {
  const extendedCompatResponse = compatResponse;
  const response = extendedCompatResponse[originalResponse];
  const headers = createHttpHeaders(compatResponse.headers.toJson({ preserveCase: true }));
  if (response) {
    response.headers = headers;
    return response;
  } else {
    return Object.assign(Object.assign({}, compatResponse), { headers, request: toPipelineRequest(compatResponse.request) });
  }
}

// node_modules/@azure/core-http-compat/dist/browser/extendedClient.js
var ExtendedServiceClient = class extends ServiceClient {
  constructor(options) {
    var _a3, _b2;
    super(options);
    if (((_a3 = options.keepAliveOptions) === null || _a3 === void 0 ? void 0 : _a3.enable) === false && !pipelineContainsDisableKeepAlivePolicy(this.pipeline)) {
      this.pipeline.addPolicy(createDisableKeepAlivePolicy());
    }
    if (((_b2 = options.redirectOptions) === null || _b2 === void 0 ? void 0 : _b2.handleRedirects) === false) {
      this.pipeline.removePolicy({
        name: redirectPolicyName
      });
    }
  }
  /**
   * Compatible send operation request function.
   *
   * @param operationArguments - Operation arguments
   * @param operationSpec - Operation Spec
   * @returns
   */
  async sendOperationRequest(operationArguments, operationSpec) {
    var _a3;
    const userProvidedCallBack = (_a3 = operationArguments === null || operationArguments === void 0 ? void 0 : operationArguments.options) === null || _a3 === void 0 ? void 0 : _a3.onResponse;
    let lastResponse;
    function onResponse(rawResponse, flatResponse, error) {
      lastResponse = rawResponse;
      if (userProvidedCallBack) {
        userProvidedCallBack(rawResponse, flatResponse, error);
      }
    }
    operationArguments.options = Object.assign(Object.assign({}, operationArguments.options), { onResponse });
    const result = await super.sendOperationRequest(operationArguments, operationSpec);
    if (lastResponse) {
      Object.defineProperty(result, "_response", {
        value: toCompatResponse(lastResponse)
      });
    }
    return result;
  }
};

// node_modules/@azure/core-http-compat/dist/browser/policies/requestPolicyFactoryPolicy.js
var HttpPipelineLogLevel;
(function(HttpPipelineLogLevel2) {
  HttpPipelineLogLevel2[HttpPipelineLogLevel2["ERROR"] = 1] = "ERROR";
  HttpPipelineLogLevel2[HttpPipelineLogLevel2["INFO"] = 3] = "INFO";
  HttpPipelineLogLevel2[HttpPipelineLogLevel2["OFF"] = 0] = "OFF";
  HttpPipelineLogLevel2[HttpPipelineLogLevel2["WARNING"] = 2] = "WARNING";
})(HttpPipelineLogLevel || (HttpPipelineLogLevel = {}));
var mockRequestPolicyOptions = {
  log(_logLevel, _message) {
  },
  shouldLog(_logLevel) {
    return false;
  }
};
var requestPolicyFactoryPolicyName = "RequestPolicyFactoryPolicy";
function createRequestPolicyFactoryPolicy(factories) {
  const orderedFactories = factories.slice().reverse();
  return {
    name: requestPolicyFactoryPolicyName,
    async sendRequest(request, next) {
      let httpPipeline = {
        async sendRequest(httpRequest) {
          const response2 = await next(toPipelineRequest(httpRequest));
          return toCompatResponse(response2, { createProxy: true });
        }
      };
      for (const factory of orderedFactories) {
        httpPipeline = factory.create(httpPipeline, mockRequestPolicyOptions);
      }
      const webResourceLike = toWebResourceLike(request, { createProxy: true });
      const response = await httpPipeline.sendRequest(webResourceLike);
      return toPipelineResponse(response);
    }
  };
}

// node_modules/@azure/core-http-compat/dist/browser/httpClientAdapter.js
function convertHttpClient(requestPolicyClient) {
  return {
    sendRequest: async (request) => {
      const response = await requestPolicyClient.sendRequest(toWebResourceLike(request, { createProxy: true }));
      return toPipelineResponse(response);
    }
  };
}

// node_modules/@azure/core-xml/dist/browser/xml.common.js
var XML_ATTRKEY2 = "$";
var XML_CHARKEY2 = "_";

// node_modules/@azure/core-xml/dist/browser/xml.js
if (!document || !DOMParser || !Node || !XMLSerializer) {
  throw new Error(`This library depends on the following DOM objects: ["document", "DOMParser", "Node", "XMLSerializer"] to parse XML, but some of these are undefined. You may provide a polyfill to make these globally available in order to support your environment. For more information, please refer to https://aka.ms/azsdk/js/web-workers. `);
}
var ttPolicy;
try {
  if (typeof self.trustedTypes !== "undefined") {
    ttPolicy = self.trustedTypes.createPolicy("@azure/core-xml#xml.browser", {
      createHTML: (s) => s
    });
  }
} catch (e) {
  console.warn('Could not create trusted types policy "@azure/core-xml#xml.browser"');
}
var doc = document.implementation.createDocument(null, null, null);
var parser = new DOMParser();
function parseXML(str, opts = {}) {
  var _a3, _b2, _c2, _d2, _e, _f;
  try {
    const updatedOptions = {
      rootName: (_a3 = opts.rootName) !== null && _a3 !== void 0 ? _a3 : "",
      includeRoot: (_b2 = opts.includeRoot) !== null && _b2 !== void 0 ? _b2 : false,
      xmlCharKey: (_c2 = opts.xmlCharKey) !== null && _c2 !== void 0 ? _c2 : XML_CHARKEY2,
      cdataPropName: (_d2 = opts.cdataPropName) !== null && _d2 !== void 0 ? _d2 : "__cdata",
      stopNodes: (_e = opts.stopNodes) !== null && _e !== void 0 ? _e : []
    };
    const dom = parser.parseFromString((_f = ttPolicy === null || ttPolicy === void 0 ? void 0 : ttPolicy.createHTML(str)) !== null && _f !== void 0 ? _f : str, "application/xml");
    throwIfError(dom);
    let obj;
    if (updatedOptions.includeRoot) {
      obj = domToObject(dom, updatedOptions);
    } else {
      obj = domToObject(dom.childNodes[0], updatedOptions);
    }
    return Promise.resolve(obj);
  } catch (err) {
    return Promise.reject(err);
  }
}
var errorNS;
function getErrorNamespace() {
  var _a3, _b2;
  if (errorNS === void 0) {
    try {
      const invalidXML = (_a3 = ttPolicy === null || ttPolicy === void 0 ? void 0 : ttPolicy.createHTML("INVALID")) !== null && _a3 !== void 0 ? _a3 : "INVALID";
      errorNS = (_b2 = parser.parseFromString(invalidXML, "text/xml").getElementsByTagName("parsererror")[0].namespaceURI) !== null && _b2 !== void 0 ? _b2 : "";
    } catch (ignored) {
      errorNS = "";
    }
  }
  return errorNS;
}
function throwIfError(dom) {
  const parserErrors = dom.getElementsByTagName("parsererror");
  if (parserErrors.length > 0 && getErrorNamespace()) {
    for (let i = 0; i < parserErrors.length; i++) {
      if (parserErrors[i].namespaceURI === errorNS) {
        throw new Error(parserErrors[i].innerHTML);
      }
    }
  }
}
function isElement(node) {
  return !!node.attributes;
}
function asElementWithAttributes(node) {
  return isElement(node) && node.hasAttributes() ? node : void 0;
}
function domToObject(node, options) {
  var _a3;
  let result = {};
  const childNodeCount = node.childNodes.length;
  const firstChildNode = node.childNodes[0];
  const onlyChildTextValue = firstChildNode && childNodeCount === 1 && firstChildNode.nodeType === Node.TEXT_NODE && firstChildNode.nodeValue || void 0;
  const elementWithAttributes = asElementWithAttributes(node);
  if (elementWithAttributes) {
    result[XML_ATTRKEY2] = {};
    for (let i = 0; i < elementWithAttributes.attributes.length; i++) {
      const attr = elementWithAttributes.attributes[i];
      result[XML_ATTRKEY2][attr.nodeName] = attr.nodeValue;
    }
    if (onlyChildTextValue) {
      result[options.xmlCharKey] = onlyChildTextValue;
    }
  } else if (childNodeCount === 0) {
    result = "";
  } else if (onlyChildTextValue) {
    result = onlyChildTextValue;
  }
  if (!onlyChildTextValue) {
    for (let i = 0; i < childNodeCount; i++) {
      const child = node.childNodes[i];
      if ((child === null || child === void 0 ? void 0 : child.nodeType) === Node.CDATA_SECTION_NODE) {
        result = child.textContent;
      } else if (((_a3 = child === null || child === void 0 ? void 0 : child.firstChild) === null || _a3 === void 0 ? void 0 : _a3.nodeType) === Node.CDATA_SECTION_NODE) {
        result[child.nodeName] = child.textContent;
      } else if (child.nodeType !== Node.TEXT_NODE) {
        const childObject = domToObject(child, options);
        if (!result[child.nodeName]) {
          result[child.nodeName] = childObject;
        } else if (Array.isArray(result[child.nodeName])) {
          result[child.nodeName].push(childObject);
        } else {
          result[child.nodeName] = [result[child.nodeName], childObject];
        }
      }
    }
  }
  return result;
}
var serializer = new XMLSerializer();
function stringifyXML(content, opts = {}) {
  var _a3, _b2, _c2, _d2, _e;
  const updatedOptions = {
    rootName: (_a3 = opts.rootName) !== null && _a3 !== void 0 ? _a3 : "root",
    includeRoot: (_b2 = opts.includeRoot) !== null && _b2 !== void 0 ? _b2 : false,
    xmlCharKey: (_c2 = opts.xmlCharKey) !== null && _c2 !== void 0 ? _c2 : XML_CHARKEY2,
    cdataPropName: (_d2 = opts.cdataPropName) !== null && _d2 !== void 0 ? _d2 : "__cdata",
    stopNodes: (_e = opts.stopNodes) !== null && _e !== void 0 ? _e : []
  };
  const dom = buildNode(content, updatedOptions.rootName, updatedOptions)[0];
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + serializer.serializeToString(dom).replace(/ xmlns=""/g, "");
}
function buildAttributes(attrs) {
  const result = [];
  for (const key of Object.keys(attrs)) {
    const attr = doc.createAttribute(key);
    attr.value = attrs[key].toString();
    result.push(attr);
  }
  return result;
}
function buildNode(obj, elementName, options) {
  var _a3;
  if (obj === void 0 || obj === null || typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    const elem = doc.createElement(elementName);
    elem.textContent = obj === void 0 || obj === null ? "" : obj.toString();
    return [elem];
  } else if (Array.isArray(obj)) {
    const result = [];
    for (const arrayElem of obj) {
      for (const child of buildNode(arrayElem, elementName, options)) {
        result.push(child);
      }
    }
    return result;
  } else if (typeof obj === "object") {
    let elem;
    if ((_a3 = obj[XML_ATTRKEY2]) === null || _a3 === void 0 ? void 0 : _a3["xmlns"]) {
      elem = doc.createElementNS(obj[XML_ATTRKEY2]["xmlns"], elementName);
    } else {
      elem = doc.createElement(elementName);
    }
    for (const key of Object.keys(obj)) {
      if (key === XML_ATTRKEY2) {
        for (const attr of buildAttributes(obj[key])) {
          elem.attributes.setNamedItem(attr);
        }
      } else if (key === options.xmlCharKey) {
        elem.textContent = obj[key].toString();
      } else if (key === options.cdataPropName) {
        const cdataElement = doc.createCDATASection(obj[key].toString());
        elem.appendChild(cdataElement);
      } else {
        for (const child of buildNode(obj[key], key, options)) {
          elem.appendChild(child);
        }
      }
    }
    return [elem];
  } else {
    throw new Error(`Illegal value passed to buildObject: ${obj}`);
  }
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/log.js
var logger3 = createClientLogger("storage-blob");

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/RequestPolicy.js
var BaseRequestPolicy = class {
  /**
   * The main method to implement that manipulates a request/response.
   */
  constructor(_nextPolicy, _options) {
    this._nextPolicy = _nextPolicy;
    this._options = _options;
  }
  /**
   * Get whether or not a log with the provided log level should be logged.
   * @param logLevel - The log level of the log that will be logged.
   * @returns Whether or not a log with the provided log level should be logged.
   */
  shouldLog(logLevel) {
    return this._options.shouldLog(logLevel);
  }
  /**
   * Attempt to log the provided message to the provided logger. If no logger was provided or if
   * the log level does not meat the logger's threshold, then nothing will be logged.
   * @param logLevel - The log level of this log.
   * @param message - The message of this log.
   */
  log(logLevel, message) {
    this._options.log(logLevel, message);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/utils/constants.js
var SDK_VERSION2 = "12.26.0";
var SERVICE_VERSION = "2025-01-05";
var BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES = 256 * 1024 * 1024;
var BLOCK_BLOB_MAX_STAGE_BLOCK_BYTES = 4e3 * 1024 * 1024;
var BLOCK_BLOB_MAX_BLOCKS = 5e4;
var DEFAULT_BLOCK_BUFFER_SIZE_BYTES = 8 * 1024 * 1024;
var DEFAULT_BLOB_DOWNLOAD_BLOCK_BYTES = 4 * 1024 * 1024;
var DEFAULT_MAX_DOWNLOAD_RETRY_REQUESTS = 5;
var REQUEST_TIMEOUT = 100 * 1e3;
var StorageOAuthScopes = "https://storage.azure.com/.default";
var URLConstants = {
  Parameters: {
    FORCE_BROWSER_NO_CACHE: "_",
    SIGNATURE: "sig",
    SNAPSHOT: "snapshot",
    VERSIONID: "versionid",
    TIMEOUT: "timeout"
  }
};
var HTTPURLConnection = {
  HTTP_ACCEPTED: 202,
  HTTP_CONFLICT: 409,
  HTTP_NOT_FOUND: 404,
  HTTP_PRECON_FAILED: 412,
  HTTP_RANGE_NOT_SATISFIABLE: 416
};
var HeaderConstants = {
  AUTHORIZATION: "Authorization",
  AUTHORIZATION_SCHEME: "Bearer",
  CONTENT_ENCODING: "Content-Encoding",
  CONTENT_ID: "Content-ID",
  CONTENT_LANGUAGE: "Content-Language",
  CONTENT_LENGTH: "Content-Length",
  CONTENT_MD5: "Content-Md5",
  CONTENT_TRANSFER_ENCODING: "Content-Transfer-Encoding",
  CONTENT_TYPE: "Content-Type",
  COOKIE: "Cookie",
  DATE: "date",
  IF_MATCH: "if-match",
  IF_MODIFIED_SINCE: "if-modified-since",
  IF_NONE_MATCH: "if-none-match",
  IF_UNMODIFIED_SINCE: "if-unmodified-since",
  PREFIX_FOR_STORAGE: "x-ms-",
  RANGE: "Range",
  USER_AGENT: "User-Agent",
  X_MS_CLIENT_REQUEST_ID: "x-ms-client-request-id",
  X_MS_COPY_SOURCE: "x-ms-copy-source",
  X_MS_DATE: "x-ms-date",
  X_MS_ERROR_CODE: "x-ms-error-code",
  X_MS_VERSION: "x-ms-version",
  X_MS_CopySourceErrorCode: "x-ms-copy-source-error-code"
};
var ETagNone = "";
var ETagAny = "*";
var SIZE_1_MB = 1 * 1024 * 1024;
var BATCH_MAX_REQUEST = 256;
var BATCH_MAX_PAYLOAD_IN_BYTES = 4 * SIZE_1_MB;
var HTTP_LINE_ENDING = "\r\n";
var HTTP_VERSION_1_1 = "HTTP/1.1";
var EncryptionAlgorithmAES25 = "AES256";
var DevelopmentConnectionString = `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;`;
var StorageBlobLoggingAllowedHeaderNames = [
  "Access-Control-Allow-Origin",
  "Cache-Control",
  "Content-Length",
  "Content-Type",
  "Date",
  "Request-Id",
  "traceparent",
  "Transfer-Encoding",
  "User-Agent",
  "x-ms-client-request-id",
  "x-ms-date",
  "x-ms-error-code",
  "x-ms-request-id",
  "x-ms-return-client-request-id",
  "x-ms-version",
  "Accept-Ranges",
  "Content-Disposition",
  "Content-Encoding",
  "Content-Language",
  "Content-MD5",
  "Content-Range",
  "ETag",
  "Last-Modified",
  "Server",
  "Vary",
  "x-ms-content-crc64",
  "x-ms-copy-action",
  "x-ms-copy-completion-time",
  "x-ms-copy-id",
  "x-ms-copy-progress",
  "x-ms-copy-status",
  "x-ms-has-immutability-policy",
  "x-ms-has-legal-hold",
  "x-ms-lease-state",
  "x-ms-lease-status",
  "x-ms-range",
  "x-ms-request-server-encrypted",
  "x-ms-server-encrypted",
  "x-ms-snapshot",
  "x-ms-source-range",
  "If-Match",
  "If-Modified-Since",
  "If-None-Match",
  "If-Unmodified-Since",
  "x-ms-access-tier",
  "x-ms-access-tier-change-time",
  "x-ms-access-tier-inferred",
  "x-ms-account-kind",
  "x-ms-archive-status",
  "x-ms-blob-append-offset",
  "x-ms-blob-cache-control",
  "x-ms-blob-committed-block-count",
  "x-ms-blob-condition-appendpos",
  "x-ms-blob-condition-maxsize",
  "x-ms-blob-content-disposition",
  "x-ms-blob-content-encoding",
  "x-ms-blob-content-language",
  "x-ms-blob-content-length",
  "x-ms-blob-content-md5",
  "x-ms-blob-content-type",
  "x-ms-blob-public-access",
  "x-ms-blob-sequence-number",
  "x-ms-blob-type",
  "x-ms-copy-destination-snapshot",
  "x-ms-creation-time",
  "x-ms-default-encryption-scope",
  "x-ms-delete-snapshots",
  "x-ms-delete-type-permanent",
  "x-ms-deny-encryption-scope-override",
  "x-ms-encryption-algorithm",
  "x-ms-if-sequence-number-eq",
  "x-ms-if-sequence-number-le",
  "x-ms-if-sequence-number-lt",
  "x-ms-incremental-copy",
  "x-ms-lease-action",
  "x-ms-lease-break-period",
  "x-ms-lease-duration",
  "x-ms-lease-id",
  "x-ms-lease-time",
  "x-ms-page-write",
  "x-ms-proposed-lease-id",
  "x-ms-range-get-content-md5",
  "x-ms-rehydrate-priority",
  "x-ms-sequence-number-action",
  "x-ms-sku-name",
  "x-ms-source-content-md5",
  "x-ms-source-if-match",
  "x-ms-source-if-modified-since",
  "x-ms-source-if-none-match",
  "x-ms-source-if-unmodified-since",
  "x-ms-tag-count",
  "x-ms-encryption-key-sha256",
  "x-ms-copy-source-error-code",
  "x-ms-copy-source-status-code",
  "x-ms-if-tags",
  "x-ms-source-if-tags"
];
var StorageBlobLoggingAllowedQueryParameters = [
  "comp",
  "maxresults",
  "rscc",
  "rscd",
  "rsce",
  "rscl",
  "rsct",
  "se",
  "si",
  "sip",
  "sp",
  "spr",
  "sr",
  "srt",
  "ss",
  "st",
  "sv",
  "include",
  "marker",
  "prefix",
  "copyid",
  "restype",
  "blockid",
  "blocklisttype",
  "delimiter",
  "prevsnapshot",
  "ske",
  "skoid",
  "sks",
  "skt",
  "sktid",
  "skv",
  "snapshot"
];
var BlobUsesCustomerSpecifiedEncryptionMsg = "BlobUsesCustomerSpecifiedEncryption";
var BlobDoesNotUseCustomerSpecifiedEncryption = "BlobDoesNotUseCustomerSpecifiedEncryption";
var PathStylePorts = [
  "10000",
  "10001",
  "10002",
  "10003",
  "10004",
  "10100",
  "10101",
  "10102",
  "10103",
  "10104",
  "11000",
  "11001",
  "11002",
  "11003",
  "11004",
  "11100",
  "11101",
  "11102",
  "11103",
  "11104"
];

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/utils/utils.common.js
function escapeURLPath(url2) {
  const urlParsed = new URL(url2);
  let path = urlParsed.pathname;
  path = path || "/";
  path = escape(path);
  urlParsed.pathname = path;
  return urlParsed.toString();
}
function getProxyUriFromDevConnString(connectionString) {
  let proxyUri = "";
  if (connectionString.search("DevelopmentStorageProxyUri=") !== -1) {
    const matchCredentials = connectionString.split(";");
    for (const element of matchCredentials) {
      if (element.trim().startsWith("DevelopmentStorageProxyUri=")) {
        proxyUri = element.trim().match("DevelopmentStorageProxyUri=(.*)")[1];
      }
    }
  }
  return proxyUri;
}
function getValueInConnString(connectionString, argument) {
  const elements = connectionString.split(";");
  for (const element of elements) {
    if (element.trim().startsWith(argument)) {
      return element.trim().match(argument + "=(.*)")[1];
    }
  }
  return "";
}
function extractConnectionStringParts(connectionString) {
  let proxyUri = "";
  if (connectionString.startsWith("UseDevelopmentStorage=true")) {
    proxyUri = getProxyUriFromDevConnString(connectionString);
    connectionString = DevelopmentConnectionString;
  }
  let blobEndpoint = getValueInConnString(connectionString, "BlobEndpoint");
  blobEndpoint = blobEndpoint.endsWith("/") ? blobEndpoint.slice(0, -1) : blobEndpoint;
  if (connectionString.search("DefaultEndpointsProtocol=") !== -1 && connectionString.search("AccountKey=") !== -1) {
    let defaultEndpointsProtocol = "";
    let accountName = "";
    let accountKey = Buffer.from("accountKey", "base64");
    let endpointSuffix = "";
    accountName = getValueInConnString(connectionString, "AccountName");
    accountKey = Buffer.from(getValueInConnString(connectionString, "AccountKey"), "base64");
    if (!blobEndpoint) {
      defaultEndpointsProtocol = getValueInConnString(connectionString, "DefaultEndpointsProtocol");
      const protocol = defaultEndpointsProtocol.toLowerCase();
      if (protocol !== "https" && protocol !== "http") {
        throw new Error("Invalid DefaultEndpointsProtocol in the provided Connection String. Expecting 'https' or 'http'");
      }
      endpointSuffix = getValueInConnString(connectionString, "EndpointSuffix");
      if (!endpointSuffix) {
        throw new Error("Invalid EndpointSuffix in the provided Connection String");
      }
      blobEndpoint = `${defaultEndpointsProtocol}://${accountName}.blob.${endpointSuffix}`;
    }
    if (!accountName) {
      throw new Error("Invalid AccountName in the provided Connection String");
    } else if (accountKey.length === 0) {
      throw new Error("Invalid AccountKey in the provided Connection String");
    }
    return {
      kind: "AccountConnString",
      url: blobEndpoint,
      accountName,
      accountKey,
      proxyUri
    };
  } else {
    let accountSas = getValueInConnString(connectionString, "SharedAccessSignature");
    let accountName = getValueInConnString(connectionString, "AccountName");
    if (!accountName) {
      accountName = getAccountNameFromUrl(blobEndpoint);
    }
    if (!blobEndpoint) {
      throw new Error("Invalid BlobEndpoint in the provided SAS Connection String");
    } else if (!accountSas) {
      throw new Error("Invalid SharedAccessSignature in the provided SAS Connection String");
    }
    if (accountSas.startsWith("?")) {
      accountSas = accountSas.substring(1);
    }
    return { kind: "SASConnString", url: blobEndpoint, accountName, accountSas };
  }
}
function escape(text) {
  return encodeURIComponent(text).replace(/%2F/g, "/").replace(/'/g, "%27").replace(/\+/g, "%20").replace(/%25/g, "%");
}
function appendToURLPath(url2, name) {
  const urlParsed = new URL(url2);
  let path = urlParsed.pathname;
  path = path ? path.endsWith("/") ? `${path}${name}` : `${path}/${name}` : name;
  urlParsed.pathname = path;
  return urlParsed.toString();
}
function setURLParameter(url2, name, value) {
  const urlParsed = new URL(url2);
  const encodedName = encodeURIComponent(name);
  const encodedValue = value ? encodeURIComponent(value) : void 0;
  const searchString = urlParsed.search === "" ? "?" : urlParsed.search;
  const searchPieces = [];
  for (const pair of searchString.slice(1).split("&")) {
    if (pair) {
      const [key] = pair.split("=", 2);
      if (key !== encodedName) {
        searchPieces.push(pair);
      }
    }
  }
  if (encodedValue) {
    searchPieces.push(`${encodedName}=${encodedValue}`);
  }
  urlParsed.search = searchPieces.length ? `?${searchPieces.join("&")}` : "";
  return urlParsed.toString();
}
function getURLParameter(url2, name) {
  var _a3;
  const urlParsed = new URL(url2);
  return (_a3 = urlParsed.searchParams.get(name)) !== null && _a3 !== void 0 ? _a3 : void 0;
}
function setURLHost(url2, host) {
  const urlParsed = new URL(url2);
  urlParsed.hostname = host;
  return urlParsed.toString();
}
function getURLPath(url2) {
  try {
    const urlParsed = new URL(url2);
    return urlParsed.pathname;
  } catch (e) {
    return void 0;
  }
}
function getURLScheme(url2) {
  try {
    const urlParsed = new URL(url2);
    return urlParsed.protocol.endsWith(":") ? urlParsed.protocol.slice(0, -1) : urlParsed.protocol;
  } catch (e) {
    return void 0;
  }
}
function getURLPathAndQuery(url2) {
  const urlParsed = new URL(url2);
  const pathString = urlParsed.pathname;
  if (!pathString) {
    throw new RangeError("Invalid url without valid path.");
  }
  let queryString = urlParsed.search || "";
  queryString = queryString.trim();
  if (queryString !== "") {
    queryString = queryString.startsWith("?") ? queryString : `?${queryString}`;
  }
  return `${pathString}${queryString}`;
}
function appendToURLQuery(url2, queryParts) {
  const urlParsed = new URL(url2);
  let query = urlParsed.search;
  if (query) {
    query += "&" + queryParts;
  } else {
    query = queryParts;
  }
  urlParsed.search = query;
  return urlParsed.toString();
}
function truncatedISO8061Date(date, withMilliseconds = true) {
  const dateString = date.toISOString();
  return withMilliseconds ? dateString.substring(0, dateString.length - 1) + "0000Z" : dateString.substring(0, dateString.length - 5) + "Z";
}
function base64encode(content) {
  return !isNode ? btoa(content) : Buffer.from(content).toString("base64");
}
function generateBlockID(blockIDPrefix, blockIndex) {
  const maxSourceStringLength = 48;
  const maxBlockIndexLength = 6;
  const maxAllowedBlockIDPrefixLength = maxSourceStringLength - maxBlockIndexLength;
  if (blockIDPrefix.length > maxAllowedBlockIDPrefixLength) {
    blockIDPrefix = blockIDPrefix.slice(0, maxAllowedBlockIDPrefixLength);
  }
  const res = blockIDPrefix + padStart(blockIndex.toString(), maxSourceStringLength - blockIDPrefix.length, "0");
  return base64encode(res);
}
async function delay3(timeInMs, aborter, abortError) {
  return new Promise((resolve, reject) => {
    let timeout;
    const abortHandler = () => {
      if (timeout !== void 0) {
        clearTimeout(timeout);
      }
      reject(abortError);
    };
    const resolveHandler = () => {
      if (aborter !== void 0) {
        aborter.removeEventListener("abort", abortHandler);
      }
      resolve();
    };
    timeout = setTimeout(resolveHandler, timeInMs);
    if (aborter !== void 0) {
      aborter.addEventListener("abort", abortHandler);
    }
  });
}
function padStart(currentString, targetLength, padString = " ") {
  if (String.prototype.padStart) {
    return currentString.padStart(targetLength, padString);
  }
  padString = padString || " ";
  if (currentString.length > targetLength) {
    return currentString;
  } else {
    targetLength = targetLength - currentString.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + currentString;
  }
}
function iEqual(str1, str2) {
  return str1.toLocaleLowerCase() === str2.toLocaleLowerCase();
}
function getAccountNameFromUrl(url2) {
  const parsedUrl = new URL(url2);
  let accountName;
  try {
    if (parsedUrl.hostname.split(".")[1] === "blob") {
      accountName = parsedUrl.hostname.split(".")[0];
    } else if (isIpEndpointStyle(parsedUrl)) {
      accountName = parsedUrl.pathname.split("/")[1];
    } else {
      accountName = "";
    }
    return accountName;
  } catch (error) {
    throw new Error("Unable to extract accountName with provided information.");
  }
}
function isIpEndpointStyle(parsedUrl) {
  const host = parsedUrl.host;
  return /^.*:.*:.*$|^(localhost|host.docker.internal)(:[0-9]+)?$|^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}(:[0-9]+)?$/.test(host) || Boolean(parsedUrl.port) && PathStylePorts.includes(parsedUrl.port);
}
function toBlobTagsString(tags2) {
  if (tags2 === void 0) {
    return void 0;
  }
  const tagPairs = [];
  for (const key in tags2) {
    if (Object.prototype.hasOwnProperty.call(tags2, key)) {
      const value = tags2[key];
      tagPairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return tagPairs.join("&");
}
function toBlobTags(tags2) {
  if (tags2 === void 0) {
    return void 0;
  }
  const res = {
    blobTagSet: []
  };
  for (const key in tags2) {
    if (Object.prototype.hasOwnProperty.call(tags2, key)) {
      const value = tags2[key];
      res.blobTagSet.push({
        key,
        value
      });
    }
  }
  return res;
}
function toTags(tags2) {
  if (tags2 === void 0) {
    return void 0;
  }
  const res = {};
  for (const blobTag of tags2.blobTagSet) {
    res[blobTag.key] = blobTag.value;
  }
  return res;
}
function toQuerySerialization(textConfiguration) {
  if (textConfiguration === void 0) {
    return void 0;
  }
  switch (textConfiguration.kind) {
    case "csv":
      return {
        format: {
          type: "delimited",
          delimitedTextConfiguration: {
            columnSeparator: textConfiguration.columnSeparator || ",",
            fieldQuote: textConfiguration.fieldQuote || "",
            recordSeparator: textConfiguration.recordSeparator,
            escapeChar: textConfiguration.escapeCharacter || "",
            headersPresent: textConfiguration.hasHeaders || false
          }
        }
      };
    case "json":
      return {
        format: {
          type: "json",
          jsonTextConfiguration: {
            recordSeparator: textConfiguration.recordSeparator
          }
        }
      };
    case "arrow":
      return {
        format: {
          type: "arrow",
          arrowConfiguration: {
            schema: textConfiguration.schema
          }
        }
      };
    case "parquet":
      return {
        format: {
          type: "parquet"
        }
      };
    default:
      throw Error("Invalid BlobQueryTextConfiguration.");
  }
}
function parseObjectReplicationRecord(objectReplicationRecord) {
  if (!objectReplicationRecord) {
    return void 0;
  }
  if ("policy-id" in objectReplicationRecord) {
    return void 0;
  }
  const orProperties = [];
  for (const key in objectReplicationRecord) {
    const ids = key.split("_");
    const policyPrefix = "or-";
    if (ids[0].startsWith(policyPrefix)) {
      ids[0] = ids[0].substring(policyPrefix.length);
    }
    const rule = {
      ruleId: ids[1],
      replicationStatus: objectReplicationRecord[key]
    };
    const policyIndex = orProperties.findIndex((policy) => policy.policyId === ids[0]);
    if (policyIndex > -1) {
      orProperties[policyIndex].rules.push(rule);
    } else {
      orProperties.push({
        policyId: ids[0],
        rules: [rule]
      });
    }
  }
  return orProperties;
}
function httpAuthorizationToString(httpAuthorization) {
  return httpAuthorization ? httpAuthorization.scheme + " " + httpAuthorization.value : void 0;
}
function BlobNameToString(name) {
  if (name.encoded) {
    return decodeURIComponent(name.content);
  } else {
    return name.content;
  }
}
function ConvertInternalResponseOfListBlobFlat(internalResponse) {
  return Object.assign(Object.assign({}, internalResponse), { segment: {
    blobItems: internalResponse.segment.blobItems.map((blobItemInteral) => {
      const blobItem = Object.assign(Object.assign({}, blobItemInteral), { name: BlobNameToString(blobItemInteral.name) });
      return blobItem;
    })
  } });
}
function ConvertInternalResponseOfListBlobHierarchy(internalResponse) {
  var _a3;
  return Object.assign(Object.assign({}, internalResponse), { segment: {
    blobPrefixes: (_a3 = internalResponse.segment.blobPrefixes) === null || _a3 === void 0 ? void 0 : _a3.map((blobPrefixInternal) => {
      const blobPrefix = Object.assign(Object.assign({}, blobPrefixInternal), { name: BlobNameToString(blobPrefixInternal.name) });
      return blobPrefix;
    }),
    blobItems: internalResponse.segment.blobItems.map((blobItemInteral) => {
      const blobItem = Object.assign(Object.assign({}, blobItemInteral), { name: BlobNameToString(blobItemInteral.name) });
      return blobItem;
    })
  } });
}
function* ExtractPageRangeInfoItems(getPageRangesSegment) {
  let pageRange = [];
  let clearRange = [];
  if (getPageRangesSegment.pageRange)
    pageRange = getPageRangesSegment.pageRange;
  if (getPageRangesSegment.clearRange)
    clearRange = getPageRangesSegment.clearRange;
  let pageRangeIndex = 0;
  let clearRangeIndex = 0;
  while (pageRangeIndex < pageRange.length && clearRangeIndex < clearRange.length) {
    if (pageRange[pageRangeIndex].start < clearRange[clearRangeIndex].start) {
      yield {
        start: pageRange[pageRangeIndex].start,
        end: pageRange[pageRangeIndex].end,
        isClear: false
      };
      ++pageRangeIndex;
    } else {
      yield {
        start: clearRange[clearRangeIndex].start,
        end: clearRange[clearRangeIndex].end,
        isClear: true
      };
      ++clearRangeIndex;
    }
  }
  for (; pageRangeIndex < pageRange.length; ++pageRangeIndex) {
    yield {
      start: pageRange[pageRangeIndex].start,
      end: pageRange[pageRangeIndex].end,
      isClear: false
    };
  }
  for (; clearRangeIndex < clearRange.length; ++clearRangeIndex) {
    yield {
      start: clearRange[clearRangeIndex].start,
      end: clearRange[clearRangeIndex].end,
      isClear: true
    };
  }
}
function EscapePath(blobName) {
  const split = blobName.split("/");
  for (let i = 0; i < split.length; i++) {
    split[i] = encodeURIComponent(split[i]);
  }
  return split.join("/");
}
function assertResponse(response) {
  if (`_response` in response) {
    return response;
  }
  throw new TypeError(`Unexpected response object ${response}`);
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/StorageRetryPolicy.js
var StorageRetryPolicyType;
(function(StorageRetryPolicyType3) {
  StorageRetryPolicyType3[StorageRetryPolicyType3["EXPONENTIAL"] = 0] = "EXPONENTIAL";
  StorageRetryPolicyType3[StorageRetryPolicyType3["FIXED"] = 1] = "FIXED";
})(StorageRetryPolicyType || (StorageRetryPolicyType = {}));
var DEFAULT_RETRY_OPTIONS = {
  maxRetryDelayInMs: 120 * 1e3,
  maxTries: 4,
  retryDelayInMs: 4 * 1e3,
  retryPolicyType: StorageRetryPolicyType.EXPONENTIAL,
  secondaryHost: "",
  tryTimeoutInMs: void 0
  // Use server side default timeout strategy
};
var RETRY_ABORT_ERROR = new AbortError("The operation was aborted.");
var StorageRetryPolicy = class extends BaseRequestPolicy {
  /**
   * Creates an instance of RetryPolicy.
   *
   * @param nextPolicy -
   * @param options -
   * @param retryOptions -
   */
  constructor(nextPolicy, options, retryOptions = DEFAULT_RETRY_OPTIONS) {
    super(nextPolicy, options);
    this.retryOptions = {
      retryPolicyType: retryOptions.retryPolicyType ? retryOptions.retryPolicyType : DEFAULT_RETRY_OPTIONS.retryPolicyType,
      maxTries: retryOptions.maxTries && retryOptions.maxTries >= 1 ? Math.floor(retryOptions.maxTries) : DEFAULT_RETRY_OPTIONS.maxTries,
      tryTimeoutInMs: retryOptions.tryTimeoutInMs && retryOptions.tryTimeoutInMs >= 0 ? retryOptions.tryTimeoutInMs : DEFAULT_RETRY_OPTIONS.tryTimeoutInMs,
      retryDelayInMs: retryOptions.retryDelayInMs && retryOptions.retryDelayInMs >= 0 ? Math.min(retryOptions.retryDelayInMs, retryOptions.maxRetryDelayInMs ? retryOptions.maxRetryDelayInMs : DEFAULT_RETRY_OPTIONS.maxRetryDelayInMs) : DEFAULT_RETRY_OPTIONS.retryDelayInMs,
      maxRetryDelayInMs: retryOptions.maxRetryDelayInMs && retryOptions.maxRetryDelayInMs >= 0 ? retryOptions.maxRetryDelayInMs : DEFAULT_RETRY_OPTIONS.maxRetryDelayInMs,
      secondaryHost: retryOptions.secondaryHost ? retryOptions.secondaryHost : DEFAULT_RETRY_OPTIONS.secondaryHost
    };
  }
  /**
   * Sends request.
   *
   * @param request -
   */
  async sendRequest(request) {
    return this.attemptSendRequest(request, false, 1);
  }
  /**
   * Decide and perform next retry. Won't mutate request parameter.
   *
   * @param request -
   * @param secondaryHas404 -  If attempt was against the secondary & it returned a StatusNotFound (404), then
   *                                   the resource was not found. This may be due to replication delay. So, in this
   *                                   case, we'll never try the secondary again for this operation.
   * @param attempt -           How many retries has been attempted to performed, starting from 1, which includes
   *                                   the attempt will be performed by this method call.
   */
  async attemptSendRequest(request, secondaryHas404, attempt) {
    const newRequest = request.clone();
    const isPrimaryRetry = secondaryHas404 || !this.retryOptions.secondaryHost || !(request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") || attempt % 2 === 1;
    if (!isPrimaryRetry) {
      newRequest.url = setURLHost(newRequest.url, this.retryOptions.secondaryHost);
    }
    if (this.retryOptions.tryTimeoutInMs) {
      newRequest.url = setURLParameter(newRequest.url, URLConstants.Parameters.TIMEOUT, Math.floor(this.retryOptions.tryTimeoutInMs / 1e3).toString());
    }
    let response;
    try {
      logger3.info(`RetryPolicy: =====> Try=${attempt} ${isPrimaryRetry ? "Primary" : "Secondary"}`);
      response = await this._nextPolicy.sendRequest(newRequest);
      if (!this.shouldRetry(isPrimaryRetry, attempt, response)) {
        return response;
      }
      secondaryHas404 = secondaryHas404 || !isPrimaryRetry && response.status === 404;
    } catch (err) {
      logger3.error(`RetryPolicy: Caught error, message: ${err.message}, code: ${err.code}`);
      if (!this.shouldRetry(isPrimaryRetry, attempt, response, err)) {
        throw err;
      }
    }
    await this.delay(isPrimaryRetry, attempt, request.abortSignal);
    return this.attemptSendRequest(request, secondaryHas404, ++attempt);
  }
  /**
   * Decide whether to retry according to last HTTP response and retry counters.
   *
   * @param isPrimaryRetry -
   * @param attempt -
   * @param response -
   * @param err -
   */
  shouldRetry(isPrimaryRetry, attempt, response, err) {
    if (attempt >= this.retryOptions.maxTries) {
      logger3.info(`RetryPolicy: Attempt(s) ${attempt} >= maxTries ${this.retryOptions.maxTries}, no further try.`);
      return false;
    }
    const retriableErrors2 = [
      "ETIMEDOUT",
      "ESOCKETTIMEDOUT",
      "ECONNREFUSED",
      "ECONNRESET",
      "ENOENT",
      "ENOTFOUND",
      "TIMEOUT",
      "EPIPE",
      "REQUEST_SEND_ERROR"
      // For default xhr based http client provided in ms-rest-js
    ];
    if (err) {
      for (const retriableError of retriableErrors2) {
        if (err.name.toUpperCase().includes(retriableError) || err.message.toUpperCase().includes(retriableError) || err.code && err.code.toString().toUpperCase() === retriableError) {
          logger3.info(`RetryPolicy: Network error ${retriableError} found, will retry.`);
          return true;
        }
      }
    }
    if (response || err) {
      const statusCode = response ? response.status : err ? err.statusCode : 0;
      if (!isPrimaryRetry && statusCode === 404) {
        logger3.info(`RetryPolicy: Secondary access with 404, will retry.`);
        return true;
      }
      if (statusCode === 503 || statusCode === 500) {
        logger3.info(`RetryPolicy: Will retry for status code ${statusCode}.`);
        return true;
      }
    }
    if ((err === null || err === void 0 ? void 0 : err.code) === "PARSE_ERROR" && (err === null || err === void 0 ? void 0 : err.message.startsWith(`Error "Error: Unclosed root tag`))) {
      logger3.info("RetryPolicy: Incomplete XML response likely due to service timeout, will retry.");
      return true;
    }
    return false;
  }
  /**
   * Delay a calculated time between retries.
   *
   * @param isPrimaryRetry -
   * @param attempt -
   * @param abortSignal -
   */
  async delay(isPrimaryRetry, attempt, abortSignal) {
    let delayTimeInMs = 0;
    if (isPrimaryRetry) {
      switch (this.retryOptions.retryPolicyType) {
        case StorageRetryPolicyType.EXPONENTIAL:
          delayTimeInMs = Math.min((Math.pow(2, attempt - 1) - 1) * this.retryOptions.retryDelayInMs, this.retryOptions.maxRetryDelayInMs);
          break;
        case StorageRetryPolicyType.FIXED:
          delayTimeInMs = this.retryOptions.retryDelayInMs;
          break;
      }
    } else {
      delayTimeInMs = Math.random() * 1e3;
    }
    logger3.info(`RetryPolicy: Delay for ${delayTimeInMs}ms`);
    return delay3(delayTimeInMs, abortSignal, RETRY_ABORT_ERROR);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/StorageRetryPolicyFactory.js
var StorageRetryPolicyFactory = class {
  /**
   * Creates an instance of StorageRetryPolicyFactory.
   * @param retryOptions -
   */
  constructor(retryOptions) {
    this.retryOptions = retryOptions;
  }
  /**
   * Creates a StorageRetryPolicy object.
   *
   * @param nextPolicy -
   * @param options -
   */
  create(nextPolicy, options) {
    return new StorageRetryPolicy(nextPolicy, options, this.retryOptions);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/credentials/StorageSharedKeyCredential.browser.js
var StorageSharedKeyCredential = class {
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/CredentialPolicy.js
var CredentialPolicy = class extends BaseRequestPolicy {
  /**
   * Sends out request.
   *
   * @param request -
   */
  sendRequest(request) {
    return this._nextPolicy.sendRequest(this.signRequest(request));
  }
  /**
   * Child classes must implement this method with request signing. This method
   * will be executed in {@link sendRequest}.
   *
   * @param request -
   */
  signRequest(request) {
    return request;
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/AnonymousCredentialPolicy.js
var AnonymousCredentialPolicy = class extends CredentialPolicy {
  /**
   * Creates an instance of AnonymousCredentialPolicy.
   * @param nextPolicy -
   * @param options -
   */
  // The base class has a protected constructor. Adding a public one to enable constructing of this class.
  /* eslint-disable-next-line @typescript-eslint/no-useless-constructor*/
  constructor(nextPolicy, options) {
    super(nextPolicy, options);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/credentials/Credential.js
var Credential = class {
  /**
   * Creates a RequestPolicy object.
   *
   * @param _nextPolicy -
   * @param _options -
   */
  create(_nextPolicy, _options) {
    throw new Error("Method should be implemented in children classes.");
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/credentials/AnonymousCredential.js
var AnonymousCredential = class extends Credential {
  /**
   * Creates an {@link AnonymousCredentialPolicy} object.
   *
   * @param nextPolicy -
   * @param options -
   */
  create(nextPolicy, options) {
    return new AnonymousCredentialPolicy(nextPolicy, options);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/utils/cache.js
var _defaultHttpClient;
function getCachedDefaultHttpClient2() {
  if (!_defaultHttpClient) {
    _defaultHttpClient = createDefaultHttpClient();
  }
  return _defaultHttpClient;
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/StorageBrowserPolicyV2.js
var storageBrowserPolicyName = "storageBrowserPolicy";
function storageBrowserPolicy() {
  return {
    name: storageBrowserPolicyName,
    async sendRequest(request, next) {
      if (isNode) {
        return next(request);
      }
      if (request.method === "GET" || request.method === "HEAD") {
        request.url = setURLParameter(request.url, URLConstants.Parameters.FORCE_BROWSER_NO_CACHE, (/* @__PURE__ */ new Date()).getTime().toString());
      }
      request.headers.delete(HeaderConstants.COOKIE);
      request.headers.delete(HeaderConstants.CONTENT_LENGTH);
      return next(request);
    }
  };
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/StorageRetryPolicyV2.js
var storageRetryPolicyName = "storageRetryPolicy";
var StorageRetryPolicyType2;
(function(StorageRetryPolicyType3) {
  StorageRetryPolicyType3[StorageRetryPolicyType3["EXPONENTIAL"] = 0] = "EXPONENTIAL";
  StorageRetryPolicyType3[StorageRetryPolicyType3["FIXED"] = 1] = "FIXED";
})(StorageRetryPolicyType2 || (StorageRetryPolicyType2 = {}));
var DEFAULT_RETRY_OPTIONS2 = {
  maxRetryDelayInMs: 120 * 1e3,
  maxTries: 4,
  retryDelayInMs: 4 * 1e3,
  retryPolicyType: StorageRetryPolicyType2.EXPONENTIAL,
  secondaryHost: "",
  tryTimeoutInMs: void 0
  // Use server side default timeout strategy
};
var retriableErrors = [
  "ETIMEDOUT",
  "ESOCKETTIMEDOUT",
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOENT",
  "ENOTFOUND",
  "TIMEOUT",
  "EPIPE",
  "REQUEST_SEND_ERROR"
];
var RETRY_ABORT_ERROR2 = new AbortError("The operation was aborted.");
function storageRetryPolicy(options = {}) {
  var _a3, _b2, _c2, _d2, _e, _f;
  const retryPolicyType = (_a3 = options.retryPolicyType) !== null && _a3 !== void 0 ? _a3 : DEFAULT_RETRY_OPTIONS2.retryPolicyType;
  const maxTries = (_b2 = options.maxTries) !== null && _b2 !== void 0 ? _b2 : DEFAULT_RETRY_OPTIONS2.maxTries;
  const retryDelayInMs = (_c2 = options.retryDelayInMs) !== null && _c2 !== void 0 ? _c2 : DEFAULT_RETRY_OPTIONS2.retryDelayInMs;
  const maxRetryDelayInMs = (_d2 = options.maxRetryDelayInMs) !== null && _d2 !== void 0 ? _d2 : DEFAULT_RETRY_OPTIONS2.maxRetryDelayInMs;
  const secondaryHost = (_e = options.secondaryHost) !== null && _e !== void 0 ? _e : DEFAULT_RETRY_OPTIONS2.secondaryHost;
  const tryTimeoutInMs = (_f = options.tryTimeoutInMs) !== null && _f !== void 0 ? _f : DEFAULT_RETRY_OPTIONS2.tryTimeoutInMs;
  function shouldRetry({ isPrimaryRetry, attempt, response, error }) {
    var _a4, _b3;
    if (attempt >= maxTries) {
      logger3.info(`RetryPolicy: Attempt(s) ${attempt} >= maxTries ${maxTries}, no further try.`);
      return false;
    }
    if (error) {
      for (const retriableError of retriableErrors) {
        if (error.name.toUpperCase().includes(retriableError) || error.message.toUpperCase().includes(retriableError) || error.code && error.code.toString().toUpperCase() === retriableError) {
          logger3.info(`RetryPolicy: Network error ${retriableError} found, will retry.`);
          return true;
        }
      }
      if ((error === null || error === void 0 ? void 0 : error.code) === "PARSE_ERROR" && (error === null || error === void 0 ? void 0 : error.message.startsWith(`Error "Error: Unclosed root tag`))) {
        logger3.info("RetryPolicy: Incomplete XML response likely due to service timeout, will retry.");
        return true;
      }
    }
    if (response || error) {
      const statusCode = (_b3 = (_a4 = response === null || response === void 0 ? void 0 : response.status) !== null && _a4 !== void 0 ? _a4 : error === null || error === void 0 ? void 0 : error.statusCode) !== null && _b3 !== void 0 ? _b3 : 0;
      if (!isPrimaryRetry && statusCode === 404) {
        logger3.info(`RetryPolicy: Secondary access with 404, will retry.`);
        return true;
      }
      if (statusCode === 503 || statusCode === 500) {
        logger3.info(`RetryPolicy: Will retry for status code ${statusCode}.`);
        return true;
      }
    }
    return false;
  }
  function calculateDelay(isPrimaryRetry, attempt) {
    let delayTimeInMs = 0;
    if (isPrimaryRetry) {
      switch (retryPolicyType) {
        case StorageRetryPolicyType2.EXPONENTIAL:
          delayTimeInMs = Math.min((Math.pow(2, attempt - 1) - 1) * retryDelayInMs, maxRetryDelayInMs);
          break;
        case StorageRetryPolicyType2.FIXED:
          delayTimeInMs = retryDelayInMs;
          break;
      }
    } else {
      delayTimeInMs = Math.random() * 1e3;
    }
    logger3.info(`RetryPolicy: Delay for ${delayTimeInMs}ms`);
    return delayTimeInMs;
  }
  return {
    name: storageRetryPolicyName,
    async sendRequest(request, next) {
      if (tryTimeoutInMs) {
        request.url = setURLParameter(request.url, URLConstants.Parameters.TIMEOUT, String(Math.floor(tryTimeoutInMs / 1e3)));
      }
      const primaryUrl = request.url;
      const secondaryUrl = secondaryHost ? setURLHost(request.url, secondaryHost) : void 0;
      let secondaryHas404 = false;
      let attempt = 1;
      let retryAgain = true;
      let response;
      let error;
      while (retryAgain) {
        const isPrimaryRetry = secondaryHas404 || !secondaryUrl || !["GET", "HEAD", "OPTIONS"].includes(request.method) || attempt % 2 === 1;
        request.url = isPrimaryRetry ? primaryUrl : secondaryUrl;
        response = void 0;
        error = void 0;
        try {
          logger3.info(`RetryPolicy: =====> Try=${attempt} ${isPrimaryRetry ? "Primary" : "Secondary"}`);
          response = await next(request);
          secondaryHas404 = secondaryHas404 || !isPrimaryRetry && response.status === 404;
        } catch (e) {
          if (isRestError(e)) {
            logger3.error(`RetryPolicy: Caught error, message: ${e.message}, code: ${e.code}`);
            error = e;
          } else {
            logger3.error(`RetryPolicy: Caught error, message: ${getErrorMessage(e)}`);
            throw e;
          }
        }
        retryAgain = shouldRetry({ isPrimaryRetry, attempt, response, error });
        if (retryAgain) {
          await delay3(calculateDelay(isPrimaryRetry, attempt), request.abortSignal, RETRY_ABORT_ERROR2);
        }
        attempt++;
      }
      if (response) {
        return response;
      }
      throw error !== null && error !== void 0 ? error : new RestError("RetryPolicy failed without known error.");
    }
  };
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/StorageSharedKeyCredentialPolicyV2.browser.js
var storageSharedKeyCredentialPolicyName = "storageSharedKeyCredentialPolicy";
function storageSharedKeyCredentialPolicy(_options) {
  return {
    name: storageSharedKeyCredentialPolicyName,
    async sendRequest(request, next) {
      return next(request);
    }
  };
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/StorageBrowserPolicy.js
var StorageBrowserPolicy = class extends BaseRequestPolicy {
  /**
   * Creates an instance of StorageBrowserPolicy.
   * @param nextPolicy -
   * @param options -
   */
  // The base class has a protected constructor. Adding a public one to enable constructing of this class.
  /* eslint-disable-next-line @typescript-eslint/no-useless-constructor*/
  constructor(nextPolicy, options) {
    super(nextPolicy, options);
  }
  /**
   * Sends out request.
   *
   * @param request -
   */
  async sendRequest(request) {
    if (isNode) {
      return this._nextPolicy.sendRequest(request);
    }
    if (request.method.toUpperCase() === "GET" || request.method.toUpperCase() === "HEAD") {
      request.url = setURLParameter(request.url, URLConstants.Parameters.FORCE_BROWSER_NO_CACHE, (/* @__PURE__ */ new Date()).getTime().toString());
    }
    request.headers.remove(HeaderConstants.COOKIE);
    request.headers.remove(HeaderConstants.CONTENT_LENGTH);
    return this._nextPolicy.sendRequest(request);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/StorageBrowserPolicyFactory.js
var StorageBrowserPolicyFactory = class {
  /**
   * Creates a StorageBrowserPolicyFactory object.
   *
   * @param nextPolicy -
   * @param options -
   */
  create(nextPolicy, options) {
    return new StorageBrowserPolicy(nextPolicy, options);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/policies/StorageCorrectContentLengthPolicy.browser.js
var storageCorrectContentLengthPolicyName = "StorageCorrectContentLengthPolicy";
function storageCorrectContentLengthPolicy() {
  return {
    name: storageCorrectContentLengthPolicyName,
    async sendRequest(request, next) {
      return next(request);
    }
  };
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/Pipeline.js
function isPipelineLike(pipeline) {
  if (!pipeline || typeof pipeline !== "object") {
    return false;
  }
  const castPipeline = pipeline;
  return Array.isArray(castPipeline.factories) && typeof castPipeline.options === "object" && typeof castPipeline.toServiceClientOptions === "function";
}
var Pipeline = class {
  /**
   * Creates an instance of Pipeline. Customize HTTPClient by implementing IHttpClient interface.
   *
   * @param factories -
   * @param options -
   */
  constructor(factories, options = {}) {
    this.factories = factories;
    this.options = options;
  }
  /**
   * Transfer Pipeline object to ServiceClientOptions object which is required by
   * ServiceClient constructor.
   *
   * @returns The ServiceClientOptions object from this Pipeline.
   */
  toServiceClientOptions() {
    return {
      httpClient: this.options.httpClient,
      requestPolicyFactories: this.factories
    };
  }
};
function newPipeline(credential, pipelineOptions = {}) {
  if (!credential) {
    credential = new AnonymousCredential();
  }
  const pipeline = new Pipeline([], pipelineOptions);
  pipeline._credential = credential;
  return pipeline;
}
function processDownlevelPipeline(pipeline) {
  const knownFactoryFunctions = [
    isAnonymousCredential,
    isStorageSharedKeyCredential,
    isCoreHttpBearerTokenFactory,
    isStorageBrowserPolicyFactory,
    isStorageRetryPolicyFactory,
    isStorageTelemetryPolicyFactory,
    isCoreHttpPolicyFactory
  ];
  if (pipeline.factories.length) {
    const novelFactories = pipeline.factories.filter((factory) => {
      return !knownFactoryFunctions.some((knownFactory) => knownFactory(factory));
    });
    if (novelFactories.length) {
      const hasInjector = novelFactories.some((factory) => isInjectorPolicyFactory(factory));
      return {
        wrappedPolicies: createRequestPolicyFactoryPolicy(novelFactories),
        afterRetry: hasInjector
      };
    }
  }
  return void 0;
}
function getCoreClientOptions(pipeline) {
  var _a3;
  const _b2 = pipeline.options, { httpClient: v1Client } = _b2, restOptions = __rest(_b2, ["httpClient"]);
  let httpClient = pipeline._coreHttpClient;
  if (!httpClient) {
    httpClient = v1Client ? convertHttpClient(v1Client) : getCachedDefaultHttpClient2();
    pipeline._coreHttpClient = httpClient;
  }
  let corePipeline = pipeline._corePipeline;
  if (!corePipeline) {
    const packageDetails = `azsdk-js-azure-storage-blob/${SDK_VERSION2}`;
    const userAgentPrefix = restOptions.userAgentOptions && restOptions.userAgentOptions.userAgentPrefix ? `${restOptions.userAgentOptions.userAgentPrefix} ${packageDetails}` : `${packageDetails}`;
    corePipeline = createClientPipeline(Object.assign(Object.assign({}, restOptions), { loggingOptions: {
      additionalAllowedHeaderNames: StorageBlobLoggingAllowedHeaderNames,
      additionalAllowedQueryParameters: StorageBlobLoggingAllowedQueryParameters,
      logger: logger3.info
    }, userAgentOptions: {
      userAgentPrefix
    }, serializationOptions: {
      stringifyXML,
      serializerOptions: {
        xml: {
          // Use customized XML char key of "#" so we can deserialize metadata
          // with "_" key
          xmlCharKey: "#"
        }
      }
    }, deserializationOptions: {
      parseXML,
      serializerOptions: {
        xml: {
          // Use customized XML char key of "#" so we can deserialize metadata
          // with "_" key
          xmlCharKey: "#"
        }
      }
    } }));
    corePipeline.removePolicy({ phase: "Retry" });
    corePipeline.removePolicy({ name: decompressResponsePolicyName });
    corePipeline.addPolicy(storageCorrectContentLengthPolicy());
    corePipeline.addPolicy(storageRetryPolicy(restOptions.retryOptions), { phase: "Retry" });
    corePipeline.addPolicy(storageBrowserPolicy());
    const downlevelResults = processDownlevelPipeline(pipeline);
    if (downlevelResults) {
      corePipeline.addPolicy(downlevelResults.wrappedPolicies, downlevelResults.afterRetry ? { afterPhase: "Retry" } : void 0);
    }
    const credential = getCredentialFromPipeline(pipeline);
    if (isTokenCredential(credential)) {
      corePipeline.addPolicy(bearerTokenAuthenticationPolicy({
        credential,
        scopes: (_a3 = restOptions.audience) !== null && _a3 !== void 0 ? _a3 : StorageOAuthScopes,
        challengeCallbacks: { authorizeRequestOnChallenge: authorizeRequestOnTenantChallenge }
      }), { phase: "Sign" });
    } else if (credential instanceof StorageSharedKeyCredential) {
      corePipeline.addPolicy(storageSharedKeyCredentialPolicy({
        accountName: credential.accountName,
        accountKey: credential.accountKey
      }), { phase: "Sign" });
    }
    pipeline._corePipeline = corePipeline;
  }
  return Object.assign(Object.assign({}, restOptions), { allowInsecureConnection: true, httpClient, pipeline: corePipeline });
}
function getCredentialFromPipeline(pipeline) {
  if (pipeline._credential) {
    return pipeline._credential;
  }
  let credential = new AnonymousCredential();
  for (const factory of pipeline.factories) {
    if (isTokenCredential(factory.credential)) {
      credential = factory.credential;
    } else if (isStorageSharedKeyCredential(factory)) {
      return factory;
    }
  }
  return credential;
}
function isStorageSharedKeyCredential(factory) {
  if (factory instanceof StorageSharedKeyCredential) {
    return true;
  }
  return factory.constructor.name === "StorageSharedKeyCredential";
}
function isAnonymousCredential(factory) {
  if (factory instanceof AnonymousCredential) {
    return true;
  }
  return factory.constructor.name === "AnonymousCredential";
}
function isCoreHttpBearerTokenFactory(factory) {
  return isTokenCredential(factory.credential);
}
function isStorageBrowserPolicyFactory(factory) {
  if (factory instanceof StorageBrowserPolicyFactory) {
    return true;
  }
  return factory.constructor.name === "StorageBrowserPolicyFactory";
}
function isStorageRetryPolicyFactory(factory) {
  if (factory instanceof StorageRetryPolicyFactory) {
    return true;
  }
  return factory.constructor.name === "StorageRetryPolicyFactory";
}
function isStorageTelemetryPolicyFactory(factory) {
  return factory.constructor.name === "TelemetryPolicyFactory";
}
function isInjectorPolicyFactory(factory) {
  return factory.constructor.name === "InjectorPolicyFactory";
}
function isCoreHttpPolicyFactory(factory) {
  const knownPolicies = [
    "GenerateClientRequestIdPolicy",
    "TracingPolicy",
    "LogPolicy",
    "ProxyPolicy",
    "DisableResponseDecompressionPolicy",
    "KeepAlivePolicy",
    "DeserializationPolicy"
  ];
  const mockHttpClient = {
    sendRequest: async (request) => {
      return {
        request,
        headers: request.headers.clone(),
        status: 500
      };
    }
  };
  const mockRequestPolicyOptions2 = {
    log(_logLevel, _message) {
    },
    shouldLog(_logLevel) {
      return false;
    }
  };
  const policyInstance = factory.create(mockHttpClient, mockRequestPolicyOptions2);
  const policyName = policyInstance.constructor.name;
  return knownPolicies.some((knownPolicyName) => {
    return policyName.startsWith(knownPolicyName);
  });
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/models/index.js
var KnownEncryptionAlgorithmType;
(function(KnownEncryptionAlgorithmType3) {
  KnownEncryptionAlgorithmType3["AES256"] = "AES256";
})(KnownEncryptionAlgorithmType || (KnownEncryptionAlgorithmType = {}));
var KnownBlobExpiryOptions;
(function(KnownBlobExpiryOptions2) {
  KnownBlobExpiryOptions2["NeverExpire"] = "NeverExpire";
  KnownBlobExpiryOptions2["RelativeToCreation"] = "RelativeToCreation";
  KnownBlobExpiryOptions2["RelativeToNow"] = "RelativeToNow";
  KnownBlobExpiryOptions2["Absolute"] = "Absolute";
})(KnownBlobExpiryOptions || (KnownBlobExpiryOptions = {}));
var KnownStorageErrorCode;
(function(KnownStorageErrorCode2) {
  KnownStorageErrorCode2["AccountAlreadyExists"] = "AccountAlreadyExists";
  KnownStorageErrorCode2["AccountBeingCreated"] = "AccountBeingCreated";
  KnownStorageErrorCode2["AccountIsDisabled"] = "AccountIsDisabled";
  KnownStorageErrorCode2["AuthenticationFailed"] = "AuthenticationFailed";
  KnownStorageErrorCode2["AuthorizationFailure"] = "AuthorizationFailure";
  KnownStorageErrorCode2["ConditionHeadersNotSupported"] = "ConditionHeadersNotSupported";
  KnownStorageErrorCode2["ConditionNotMet"] = "ConditionNotMet";
  KnownStorageErrorCode2["EmptyMetadataKey"] = "EmptyMetadataKey";
  KnownStorageErrorCode2["InsufficientAccountPermissions"] = "InsufficientAccountPermissions";
  KnownStorageErrorCode2["InternalError"] = "InternalError";
  KnownStorageErrorCode2["InvalidAuthenticationInfo"] = "InvalidAuthenticationInfo";
  KnownStorageErrorCode2["InvalidHeaderValue"] = "InvalidHeaderValue";
  KnownStorageErrorCode2["InvalidHttpVerb"] = "InvalidHttpVerb";
  KnownStorageErrorCode2["InvalidInput"] = "InvalidInput";
  KnownStorageErrorCode2["InvalidMd5"] = "InvalidMd5";
  KnownStorageErrorCode2["InvalidMetadata"] = "InvalidMetadata";
  KnownStorageErrorCode2["InvalidQueryParameterValue"] = "InvalidQueryParameterValue";
  KnownStorageErrorCode2["InvalidRange"] = "InvalidRange";
  KnownStorageErrorCode2["InvalidResourceName"] = "InvalidResourceName";
  KnownStorageErrorCode2["InvalidUri"] = "InvalidUri";
  KnownStorageErrorCode2["InvalidXmlDocument"] = "InvalidXmlDocument";
  KnownStorageErrorCode2["InvalidXmlNodeValue"] = "InvalidXmlNodeValue";
  KnownStorageErrorCode2["Md5Mismatch"] = "Md5Mismatch";
  KnownStorageErrorCode2["MetadataTooLarge"] = "MetadataTooLarge";
  KnownStorageErrorCode2["MissingContentLengthHeader"] = "MissingContentLengthHeader";
  KnownStorageErrorCode2["MissingRequiredQueryParameter"] = "MissingRequiredQueryParameter";
  KnownStorageErrorCode2["MissingRequiredHeader"] = "MissingRequiredHeader";
  KnownStorageErrorCode2["MissingRequiredXmlNode"] = "MissingRequiredXmlNode";
  KnownStorageErrorCode2["MultipleConditionHeadersNotSupported"] = "MultipleConditionHeadersNotSupported";
  KnownStorageErrorCode2["OperationTimedOut"] = "OperationTimedOut";
  KnownStorageErrorCode2["OutOfRangeInput"] = "OutOfRangeInput";
  KnownStorageErrorCode2["OutOfRangeQueryParameterValue"] = "OutOfRangeQueryParameterValue";
  KnownStorageErrorCode2["RequestBodyTooLarge"] = "RequestBodyTooLarge";
  KnownStorageErrorCode2["ResourceTypeMismatch"] = "ResourceTypeMismatch";
  KnownStorageErrorCode2["RequestUrlFailedToParse"] = "RequestUrlFailedToParse";
  KnownStorageErrorCode2["ResourceAlreadyExists"] = "ResourceAlreadyExists";
  KnownStorageErrorCode2["ResourceNotFound"] = "ResourceNotFound";
  KnownStorageErrorCode2["ServerBusy"] = "ServerBusy";
  KnownStorageErrorCode2["UnsupportedHeader"] = "UnsupportedHeader";
  KnownStorageErrorCode2["UnsupportedXmlNode"] = "UnsupportedXmlNode";
  KnownStorageErrorCode2["UnsupportedQueryParameter"] = "UnsupportedQueryParameter";
  KnownStorageErrorCode2["UnsupportedHttpVerb"] = "UnsupportedHttpVerb";
  KnownStorageErrorCode2["AppendPositionConditionNotMet"] = "AppendPositionConditionNotMet";
  KnownStorageErrorCode2["BlobAlreadyExists"] = "BlobAlreadyExists";
  KnownStorageErrorCode2["BlobImmutableDueToPolicy"] = "BlobImmutableDueToPolicy";
  KnownStorageErrorCode2["BlobNotFound"] = "BlobNotFound";
  KnownStorageErrorCode2["BlobOverwritten"] = "BlobOverwritten";
  KnownStorageErrorCode2["BlobTierInadequateForContentLength"] = "BlobTierInadequateForContentLength";
  KnownStorageErrorCode2["BlobUsesCustomerSpecifiedEncryption"] = "BlobUsesCustomerSpecifiedEncryption";
  KnownStorageErrorCode2["BlockCountExceedsLimit"] = "BlockCountExceedsLimit";
  KnownStorageErrorCode2["BlockListTooLong"] = "BlockListTooLong";
  KnownStorageErrorCode2["CannotChangeToLowerTier"] = "CannotChangeToLowerTier";
  KnownStorageErrorCode2["CannotVerifyCopySource"] = "CannotVerifyCopySource";
  KnownStorageErrorCode2["ContainerAlreadyExists"] = "ContainerAlreadyExists";
  KnownStorageErrorCode2["ContainerBeingDeleted"] = "ContainerBeingDeleted";
  KnownStorageErrorCode2["ContainerDisabled"] = "ContainerDisabled";
  KnownStorageErrorCode2["ContainerNotFound"] = "ContainerNotFound";
  KnownStorageErrorCode2["ContentLengthLargerThanTierLimit"] = "ContentLengthLargerThanTierLimit";
  KnownStorageErrorCode2["CopyAcrossAccountsNotSupported"] = "CopyAcrossAccountsNotSupported";
  KnownStorageErrorCode2["CopyIdMismatch"] = "CopyIdMismatch";
  KnownStorageErrorCode2["FeatureVersionMismatch"] = "FeatureVersionMismatch";
  KnownStorageErrorCode2["IncrementalCopyBlobMismatch"] = "IncrementalCopyBlobMismatch";
  KnownStorageErrorCode2["IncrementalCopyOfEarlierVersionSnapshotNotAllowed"] = "IncrementalCopyOfEarlierVersionSnapshotNotAllowed";
  KnownStorageErrorCode2["IncrementalCopySourceMustBeSnapshot"] = "IncrementalCopySourceMustBeSnapshot";
  KnownStorageErrorCode2["InfiniteLeaseDurationRequired"] = "InfiniteLeaseDurationRequired";
  KnownStorageErrorCode2["InvalidBlobOrBlock"] = "InvalidBlobOrBlock";
  KnownStorageErrorCode2["InvalidBlobTier"] = "InvalidBlobTier";
  KnownStorageErrorCode2["InvalidBlobType"] = "InvalidBlobType";
  KnownStorageErrorCode2["InvalidBlockId"] = "InvalidBlockId";
  KnownStorageErrorCode2["InvalidBlockList"] = "InvalidBlockList";
  KnownStorageErrorCode2["InvalidOperation"] = "InvalidOperation";
  KnownStorageErrorCode2["InvalidPageRange"] = "InvalidPageRange";
  KnownStorageErrorCode2["InvalidSourceBlobType"] = "InvalidSourceBlobType";
  KnownStorageErrorCode2["InvalidSourceBlobUrl"] = "InvalidSourceBlobUrl";
  KnownStorageErrorCode2["InvalidVersionForPageBlobOperation"] = "InvalidVersionForPageBlobOperation";
  KnownStorageErrorCode2["LeaseAlreadyPresent"] = "LeaseAlreadyPresent";
  KnownStorageErrorCode2["LeaseAlreadyBroken"] = "LeaseAlreadyBroken";
  KnownStorageErrorCode2["LeaseIdMismatchWithBlobOperation"] = "LeaseIdMismatchWithBlobOperation";
  KnownStorageErrorCode2["LeaseIdMismatchWithContainerOperation"] = "LeaseIdMismatchWithContainerOperation";
  KnownStorageErrorCode2["LeaseIdMismatchWithLeaseOperation"] = "LeaseIdMismatchWithLeaseOperation";
  KnownStorageErrorCode2["LeaseIdMissing"] = "LeaseIdMissing";
  KnownStorageErrorCode2["LeaseIsBreakingAndCannotBeAcquired"] = "LeaseIsBreakingAndCannotBeAcquired";
  KnownStorageErrorCode2["LeaseIsBreakingAndCannotBeChanged"] = "LeaseIsBreakingAndCannotBeChanged";
  KnownStorageErrorCode2["LeaseIsBrokenAndCannotBeRenewed"] = "LeaseIsBrokenAndCannotBeRenewed";
  KnownStorageErrorCode2["LeaseLost"] = "LeaseLost";
  KnownStorageErrorCode2["LeaseNotPresentWithBlobOperation"] = "LeaseNotPresentWithBlobOperation";
  KnownStorageErrorCode2["LeaseNotPresentWithContainerOperation"] = "LeaseNotPresentWithContainerOperation";
  KnownStorageErrorCode2["LeaseNotPresentWithLeaseOperation"] = "LeaseNotPresentWithLeaseOperation";
  KnownStorageErrorCode2["MaxBlobSizeConditionNotMet"] = "MaxBlobSizeConditionNotMet";
  KnownStorageErrorCode2["NoAuthenticationInformation"] = "NoAuthenticationInformation";
  KnownStorageErrorCode2["NoPendingCopyOperation"] = "NoPendingCopyOperation";
  KnownStorageErrorCode2["OperationNotAllowedOnIncrementalCopyBlob"] = "OperationNotAllowedOnIncrementalCopyBlob";
  KnownStorageErrorCode2["PendingCopyOperation"] = "PendingCopyOperation";
  KnownStorageErrorCode2["PreviousSnapshotCannotBeNewer"] = "PreviousSnapshotCannotBeNewer";
  KnownStorageErrorCode2["PreviousSnapshotNotFound"] = "PreviousSnapshotNotFound";
  KnownStorageErrorCode2["PreviousSnapshotOperationNotSupported"] = "PreviousSnapshotOperationNotSupported";
  KnownStorageErrorCode2["SequenceNumberConditionNotMet"] = "SequenceNumberConditionNotMet";
  KnownStorageErrorCode2["SequenceNumberIncrementTooLarge"] = "SequenceNumberIncrementTooLarge";
  KnownStorageErrorCode2["SnapshotCountExceeded"] = "SnapshotCountExceeded";
  KnownStorageErrorCode2["SnapshotOperationRateExceeded"] = "SnapshotOperationRateExceeded";
  KnownStorageErrorCode2["SnapshotsPresent"] = "SnapshotsPresent";
  KnownStorageErrorCode2["SourceConditionNotMet"] = "SourceConditionNotMet";
  KnownStorageErrorCode2["SystemInUse"] = "SystemInUse";
  KnownStorageErrorCode2["TargetConditionNotMet"] = "TargetConditionNotMet";
  KnownStorageErrorCode2["UnauthorizedBlobOverwrite"] = "UnauthorizedBlobOverwrite";
  KnownStorageErrorCode2["BlobBeingRehydrated"] = "BlobBeingRehydrated";
  KnownStorageErrorCode2["BlobArchived"] = "BlobArchived";
  KnownStorageErrorCode2["BlobNotArchived"] = "BlobNotArchived";
  KnownStorageErrorCode2["AuthorizationSourceIPMismatch"] = "AuthorizationSourceIPMismatch";
  KnownStorageErrorCode2["AuthorizationProtocolMismatch"] = "AuthorizationProtocolMismatch";
  KnownStorageErrorCode2["AuthorizationPermissionMismatch"] = "AuthorizationPermissionMismatch";
  KnownStorageErrorCode2["AuthorizationServiceMismatch"] = "AuthorizationServiceMismatch";
  KnownStorageErrorCode2["AuthorizationResourceTypeMismatch"] = "AuthorizationResourceTypeMismatch";
  KnownStorageErrorCode2["BlobAccessTierNotSupportedForAccountType"] = "BlobAccessTierNotSupportedForAccountType";
})(KnownStorageErrorCode || (KnownStorageErrorCode = {}));

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/models/mappers.js
var mappers_exports = {};
__export(mappers_exports, {
  AccessPolicy: () => AccessPolicy,
  AppendBlobAppendBlockExceptionHeaders: () => AppendBlobAppendBlockExceptionHeaders,
  AppendBlobAppendBlockFromUrlExceptionHeaders: () => AppendBlobAppendBlockFromUrlExceptionHeaders,
  AppendBlobAppendBlockFromUrlHeaders: () => AppendBlobAppendBlockFromUrlHeaders,
  AppendBlobAppendBlockHeaders: () => AppendBlobAppendBlockHeaders,
  AppendBlobCreateExceptionHeaders: () => AppendBlobCreateExceptionHeaders,
  AppendBlobCreateHeaders: () => AppendBlobCreateHeaders,
  AppendBlobSealExceptionHeaders: () => AppendBlobSealExceptionHeaders,
  AppendBlobSealHeaders: () => AppendBlobSealHeaders,
  ArrowConfiguration: () => ArrowConfiguration,
  ArrowField: () => ArrowField,
  BlobAbortCopyFromURLExceptionHeaders: () => BlobAbortCopyFromURLExceptionHeaders,
  BlobAbortCopyFromURLHeaders: () => BlobAbortCopyFromURLHeaders,
  BlobAcquireLeaseExceptionHeaders: () => BlobAcquireLeaseExceptionHeaders,
  BlobAcquireLeaseHeaders: () => BlobAcquireLeaseHeaders,
  BlobBreakLeaseExceptionHeaders: () => BlobBreakLeaseExceptionHeaders,
  BlobBreakLeaseHeaders: () => BlobBreakLeaseHeaders,
  BlobChangeLeaseExceptionHeaders: () => BlobChangeLeaseExceptionHeaders,
  BlobChangeLeaseHeaders: () => BlobChangeLeaseHeaders,
  BlobCopyFromURLExceptionHeaders: () => BlobCopyFromURLExceptionHeaders,
  BlobCopyFromURLHeaders: () => BlobCopyFromURLHeaders,
  BlobCreateSnapshotExceptionHeaders: () => BlobCreateSnapshotExceptionHeaders,
  BlobCreateSnapshotHeaders: () => BlobCreateSnapshotHeaders,
  BlobDeleteExceptionHeaders: () => BlobDeleteExceptionHeaders,
  BlobDeleteHeaders: () => BlobDeleteHeaders,
  BlobDeleteImmutabilityPolicyExceptionHeaders: () => BlobDeleteImmutabilityPolicyExceptionHeaders,
  BlobDeleteImmutabilityPolicyHeaders: () => BlobDeleteImmutabilityPolicyHeaders,
  BlobDownloadExceptionHeaders: () => BlobDownloadExceptionHeaders,
  BlobDownloadHeaders: () => BlobDownloadHeaders,
  BlobFlatListSegment: () => BlobFlatListSegment,
  BlobGetAccountInfoExceptionHeaders: () => BlobGetAccountInfoExceptionHeaders,
  BlobGetAccountInfoHeaders: () => BlobGetAccountInfoHeaders,
  BlobGetPropertiesExceptionHeaders: () => BlobGetPropertiesExceptionHeaders,
  BlobGetPropertiesHeaders: () => BlobGetPropertiesHeaders,
  BlobGetTagsExceptionHeaders: () => BlobGetTagsExceptionHeaders,
  BlobGetTagsHeaders: () => BlobGetTagsHeaders,
  BlobHierarchyListSegment: () => BlobHierarchyListSegment,
  BlobItemInternal: () => BlobItemInternal,
  BlobName: () => BlobName,
  BlobPrefix: () => BlobPrefix,
  BlobPropertiesInternal: () => BlobPropertiesInternal,
  BlobQueryExceptionHeaders: () => BlobQueryExceptionHeaders,
  BlobQueryHeaders: () => BlobQueryHeaders,
  BlobReleaseLeaseExceptionHeaders: () => BlobReleaseLeaseExceptionHeaders,
  BlobReleaseLeaseHeaders: () => BlobReleaseLeaseHeaders,
  BlobRenewLeaseExceptionHeaders: () => BlobRenewLeaseExceptionHeaders,
  BlobRenewLeaseHeaders: () => BlobRenewLeaseHeaders,
  BlobServiceProperties: () => BlobServiceProperties,
  BlobServiceStatistics: () => BlobServiceStatistics,
  BlobSetExpiryExceptionHeaders: () => BlobSetExpiryExceptionHeaders,
  BlobSetExpiryHeaders: () => BlobSetExpiryHeaders,
  BlobSetHttpHeadersExceptionHeaders: () => BlobSetHttpHeadersExceptionHeaders,
  BlobSetHttpHeadersHeaders: () => BlobSetHttpHeadersHeaders,
  BlobSetImmutabilityPolicyExceptionHeaders: () => BlobSetImmutabilityPolicyExceptionHeaders,
  BlobSetImmutabilityPolicyHeaders: () => BlobSetImmutabilityPolicyHeaders,
  BlobSetLegalHoldExceptionHeaders: () => BlobSetLegalHoldExceptionHeaders,
  BlobSetLegalHoldHeaders: () => BlobSetLegalHoldHeaders,
  BlobSetMetadataExceptionHeaders: () => BlobSetMetadataExceptionHeaders,
  BlobSetMetadataHeaders: () => BlobSetMetadataHeaders,
  BlobSetTagsExceptionHeaders: () => BlobSetTagsExceptionHeaders,
  BlobSetTagsHeaders: () => BlobSetTagsHeaders,
  BlobSetTierExceptionHeaders: () => BlobSetTierExceptionHeaders,
  BlobSetTierHeaders: () => BlobSetTierHeaders,
  BlobStartCopyFromURLExceptionHeaders: () => BlobStartCopyFromURLExceptionHeaders,
  BlobStartCopyFromURLHeaders: () => BlobStartCopyFromURLHeaders,
  BlobTag: () => BlobTag,
  BlobTags: () => BlobTags,
  BlobUndeleteExceptionHeaders: () => BlobUndeleteExceptionHeaders,
  BlobUndeleteHeaders: () => BlobUndeleteHeaders,
  Block: () => Block,
  BlockBlobCommitBlockListExceptionHeaders: () => BlockBlobCommitBlockListExceptionHeaders,
  BlockBlobCommitBlockListHeaders: () => BlockBlobCommitBlockListHeaders,
  BlockBlobGetBlockListExceptionHeaders: () => BlockBlobGetBlockListExceptionHeaders,
  BlockBlobGetBlockListHeaders: () => BlockBlobGetBlockListHeaders,
  BlockBlobPutBlobFromUrlExceptionHeaders: () => BlockBlobPutBlobFromUrlExceptionHeaders,
  BlockBlobPutBlobFromUrlHeaders: () => BlockBlobPutBlobFromUrlHeaders,
  BlockBlobStageBlockExceptionHeaders: () => BlockBlobStageBlockExceptionHeaders,
  BlockBlobStageBlockFromURLExceptionHeaders: () => BlockBlobStageBlockFromURLExceptionHeaders,
  BlockBlobStageBlockFromURLHeaders: () => BlockBlobStageBlockFromURLHeaders,
  BlockBlobStageBlockHeaders: () => BlockBlobStageBlockHeaders,
  BlockBlobUploadExceptionHeaders: () => BlockBlobUploadExceptionHeaders,
  BlockBlobUploadHeaders: () => BlockBlobUploadHeaders,
  BlockList: () => BlockList,
  BlockLookupList: () => BlockLookupList,
  ClearRange: () => ClearRange,
  ContainerAcquireLeaseExceptionHeaders: () => ContainerAcquireLeaseExceptionHeaders,
  ContainerAcquireLeaseHeaders: () => ContainerAcquireLeaseHeaders,
  ContainerBreakLeaseExceptionHeaders: () => ContainerBreakLeaseExceptionHeaders,
  ContainerBreakLeaseHeaders: () => ContainerBreakLeaseHeaders,
  ContainerChangeLeaseExceptionHeaders: () => ContainerChangeLeaseExceptionHeaders,
  ContainerChangeLeaseHeaders: () => ContainerChangeLeaseHeaders,
  ContainerCreateExceptionHeaders: () => ContainerCreateExceptionHeaders,
  ContainerCreateHeaders: () => ContainerCreateHeaders,
  ContainerDeleteExceptionHeaders: () => ContainerDeleteExceptionHeaders,
  ContainerDeleteHeaders: () => ContainerDeleteHeaders,
  ContainerFilterBlobsExceptionHeaders: () => ContainerFilterBlobsExceptionHeaders,
  ContainerFilterBlobsHeaders: () => ContainerFilterBlobsHeaders,
  ContainerGetAccessPolicyExceptionHeaders: () => ContainerGetAccessPolicyExceptionHeaders,
  ContainerGetAccessPolicyHeaders: () => ContainerGetAccessPolicyHeaders,
  ContainerGetAccountInfoExceptionHeaders: () => ContainerGetAccountInfoExceptionHeaders,
  ContainerGetAccountInfoHeaders: () => ContainerGetAccountInfoHeaders,
  ContainerGetPropertiesExceptionHeaders: () => ContainerGetPropertiesExceptionHeaders,
  ContainerGetPropertiesHeaders: () => ContainerGetPropertiesHeaders,
  ContainerItem: () => ContainerItem,
  ContainerListBlobFlatSegmentExceptionHeaders: () => ContainerListBlobFlatSegmentExceptionHeaders,
  ContainerListBlobFlatSegmentHeaders: () => ContainerListBlobFlatSegmentHeaders,
  ContainerListBlobHierarchySegmentExceptionHeaders: () => ContainerListBlobHierarchySegmentExceptionHeaders,
  ContainerListBlobHierarchySegmentHeaders: () => ContainerListBlobHierarchySegmentHeaders,
  ContainerProperties: () => ContainerProperties,
  ContainerReleaseLeaseExceptionHeaders: () => ContainerReleaseLeaseExceptionHeaders,
  ContainerReleaseLeaseHeaders: () => ContainerReleaseLeaseHeaders,
  ContainerRenameExceptionHeaders: () => ContainerRenameExceptionHeaders,
  ContainerRenameHeaders: () => ContainerRenameHeaders,
  ContainerRenewLeaseExceptionHeaders: () => ContainerRenewLeaseExceptionHeaders,
  ContainerRenewLeaseHeaders: () => ContainerRenewLeaseHeaders,
  ContainerRestoreExceptionHeaders: () => ContainerRestoreExceptionHeaders,
  ContainerRestoreHeaders: () => ContainerRestoreHeaders,
  ContainerSetAccessPolicyExceptionHeaders: () => ContainerSetAccessPolicyExceptionHeaders,
  ContainerSetAccessPolicyHeaders: () => ContainerSetAccessPolicyHeaders,
  ContainerSetMetadataExceptionHeaders: () => ContainerSetMetadataExceptionHeaders,
  ContainerSetMetadataHeaders: () => ContainerSetMetadataHeaders,
  ContainerSubmitBatchExceptionHeaders: () => ContainerSubmitBatchExceptionHeaders,
  ContainerSubmitBatchHeaders: () => ContainerSubmitBatchHeaders,
  CorsRule: () => CorsRule,
  DelimitedTextConfiguration: () => DelimitedTextConfiguration,
  FilterBlobItem: () => FilterBlobItem,
  FilterBlobSegment: () => FilterBlobSegment,
  GeoReplication: () => GeoReplication,
  JsonTextConfiguration: () => JsonTextConfiguration,
  KeyInfo: () => KeyInfo,
  ListBlobsFlatSegmentResponse: () => ListBlobsFlatSegmentResponse,
  ListBlobsHierarchySegmentResponse: () => ListBlobsHierarchySegmentResponse,
  ListContainersSegmentResponse: () => ListContainersSegmentResponse,
  Logging: () => Logging,
  Metrics: () => Metrics,
  PageBlobClearPagesExceptionHeaders: () => PageBlobClearPagesExceptionHeaders,
  PageBlobClearPagesHeaders: () => PageBlobClearPagesHeaders,
  PageBlobCopyIncrementalExceptionHeaders: () => PageBlobCopyIncrementalExceptionHeaders,
  PageBlobCopyIncrementalHeaders: () => PageBlobCopyIncrementalHeaders,
  PageBlobCreateExceptionHeaders: () => PageBlobCreateExceptionHeaders,
  PageBlobCreateHeaders: () => PageBlobCreateHeaders,
  PageBlobGetPageRangesDiffExceptionHeaders: () => PageBlobGetPageRangesDiffExceptionHeaders,
  PageBlobGetPageRangesDiffHeaders: () => PageBlobGetPageRangesDiffHeaders,
  PageBlobGetPageRangesExceptionHeaders: () => PageBlobGetPageRangesExceptionHeaders,
  PageBlobGetPageRangesHeaders: () => PageBlobGetPageRangesHeaders,
  PageBlobResizeExceptionHeaders: () => PageBlobResizeExceptionHeaders,
  PageBlobResizeHeaders: () => PageBlobResizeHeaders,
  PageBlobUpdateSequenceNumberExceptionHeaders: () => PageBlobUpdateSequenceNumberExceptionHeaders,
  PageBlobUpdateSequenceNumberHeaders: () => PageBlobUpdateSequenceNumberHeaders,
  PageBlobUploadPagesExceptionHeaders: () => PageBlobUploadPagesExceptionHeaders,
  PageBlobUploadPagesFromURLExceptionHeaders: () => PageBlobUploadPagesFromURLExceptionHeaders,
  PageBlobUploadPagesFromURLHeaders: () => PageBlobUploadPagesFromURLHeaders,
  PageBlobUploadPagesHeaders: () => PageBlobUploadPagesHeaders,
  PageList: () => PageList,
  PageRange: () => PageRange,
  QueryFormat: () => QueryFormat,
  QueryRequest: () => QueryRequest,
  QuerySerialization: () => QuerySerialization,
  RetentionPolicy: () => RetentionPolicy,
  ServiceFilterBlobsExceptionHeaders: () => ServiceFilterBlobsExceptionHeaders,
  ServiceFilterBlobsHeaders: () => ServiceFilterBlobsHeaders,
  ServiceGetAccountInfoExceptionHeaders: () => ServiceGetAccountInfoExceptionHeaders,
  ServiceGetAccountInfoHeaders: () => ServiceGetAccountInfoHeaders,
  ServiceGetPropertiesExceptionHeaders: () => ServiceGetPropertiesExceptionHeaders,
  ServiceGetPropertiesHeaders: () => ServiceGetPropertiesHeaders,
  ServiceGetStatisticsExceptionHeaders: () => ServiceGetStatisticsExceptionHeaders,
  ServiceGetStatisticsHeaders: () => ServiceGetStatisticsHeaders,
  ServiceGetUserDelegationKeyExceptionHeaders: () => ServiceGetUserDelegationKeyExceptionHeaders,
  ServiceGetUserDelegationKeyHeaders: () => ServiceGetUserDelegationKeyHeaders,
  ServiceListContainersSegmentExceptionHeaders: () => ServiceListContainersSegmentExceptionHeaders,
  ServiceListContainersSegmentHeaders: () => ServiceListContainersSegmentHeaders,
  ServiceSetPropertiesExceptionHeaders: () => ServiceSetPropertiesExceptionHeaders,
  ServiceSetPropertiesHeaders: () => ServiceSetPropertiesHeaders,
  ServiceSubmitBatchExceptionHeaders: () => ServiceSubmitBatchExceptionHeaders,
  ServiceSubmitBatchHeaders: () => ServiceSubmitBatchHeaders,
  SignedIdentifier: () => SignedIdentifier,
  StaticWebsite: () => StaticWebsite,
  StorageError: () => StorageError,
  UserDelegationKey: () => UserDelegationKey
});
var BlobServiceProperties = {
  serializedName: "BlobServiceProperties",
  xmlName: "StorageServiceProperties",
  type: {
    name: "Composite",
    className: "BlobServiceProperties",
    modelProperties: {
      blobAnalyticsLogging: {
        serializedName: "Logging",
        xmlName: "Logging",
        type: {
          name: "Composite",
          className: "Logging"
        }
      },
      hourMetrics: {
        serializedName: "HourMetrics",
        xmlName: "HourMetrics",
        type: {
          name: "Composite",
          className: "Metrics"
        }
      },
      minuteMetrics: {
        serializedName: "MinuteMetrics",
        xmlName: "MinuteMetrics",
        type: {
          name: "Composite",
          className: "Metrics"
        }
      },
      cors: {
        serializedName: "Cors",
        xmlName: "Cors",
        xmlIsWrapped: true,
        xmlElementName: "CorsRule",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "CorsRule"
            }
          }
        }
      },
      defaultServiceVersion: {
        serializedName: "DefaultServiceVersion",
        xmlName: "DefaultServiceVersion",
        type: {
          name: "String"
        }
      },
      deleteRetentionPolicy: {
        serializedName: "DeleteRetentionPolicy",
        xmlName: "DeleteRetentionPolicy",
        type: {
          name: "Composite",
          className: "RetentionPolicy"
        }
      },
      staticWebsite: {
        serializedName: "StaticWebsite",
        xmlName: "StaticWebsite",
        type: {
          name: "Composite",
          className: "StaticWebsite"
        }
      }
    }
  }
};
var Logging = {
  serializedName: "Logging",
  type: {
    name: "Composite",
    className: "Logging",
    modelProperties: {
      version: {
        serializedName: "Version",
        required: true,
        xmlName: "Version",
        type: {
          name: "String"
        }
      },
      deleteProperty: {
        serializedName: "Delete",
        required: true,
        xmlName: "Delete",
        type: {
          name: "Boolean"
        }
      },
      read: {
        serializedName: "Read",
        required: true,
        xmlName: "Read",
        type: {
          name: "Boolean"
        }
      },
      write: {
        serializedName: "Write",
        required: true,
        xmlName: "Write",
        type: {
          name: "Boolean"
        }
      },
      retentionPolicy: {
        serializedName: "RetentionPolicy",
        xmlName: "RetentionPolicy",
        type: {
          name: "Composite",
          className: "RetentionPolicy"
        }
      }
    }
  }
};
var RetentionPolicy = {
  serializedName: "RetentionPolicy",
  type: {
    name: "Composite",
    className: "RetentionPolicy",
    modelProperties: {
      enabled: {
        serializedName: "Enabled",
        required: true,
        xmlName: "Enabled",
        type: {
          name: "Boolean"
        }
      },
      days: {
        constraints: {
          InclusiveMinimum: 1
        },
        serializedName: "Days",
        xmlName: "Days",
        type: {
          name: "Number"
        }
      }
    }
  }
};
var Metrics = {
  serializedName: "Metrics",
  type: {
    name: "Composite",
    className: "Metrics",
    modelProperties: {
      version: {
        serializedName: "Version",
        xmlName: "Version",
        type: {
          name: "String"
        }
      },
      enabled: {
        serializedName: "Enabled",
        required: true,
        xmlName: "Enabled",
        type: {
          name: "Boolean"
        }
      },
      includeAPIs: {
        serializedName: "IncludeAPIs",
        xmlName: "IncludeAPIs",
        type: {
          name: "Boolean"
        }
      },
      retentionPolicy: {
        serializedName: "RetentionPolicy",
        xmlName: "RetentionPolicy",
        type: {
          name: "Composite",
          className: "RetentionPolicy"
        }
      }
    }
  }
};
var CorsRule = {
  serializedName: "CorsRule",
  type: {
    name: "Composite",
    className: "CorsRule",
    modelProperties: {
      allowedOrigins: {
        serializedName: "AllowedOrigins",
        required: true,
        xmlName: "AllowedOrigins",
        type: {
          name: "String"
        }
      },
      allowedMethods: {
        serializedName: "AllowedMethods",
        required: true,
        xmlName: "AllowedMethods",
        type: {
          name: "String"
        }
      },
      allowedHeaders: {
        serializedName: "AllowedHeaders",
        required: true,
        xmlName: "AllowedHeaders",
        type: {
          name: "String"
        }
      },
      exposedHeaders: {
        serializedName: "ExposedHeaders",
        required: true,
        xmlName: "ExposedHeaders",
        type: {
          name: "String"
        }
      },
      maxAgeInSeconds: {
        constraints: {
          InclusiveMinimum: 0
        },
        serializedName: "MaxAgeInSeconds",
        required: true,
        xmlName: "MaxAgeInSeconds",
        type: {
          name: "Number"
        }
      }
    }
  }
};
var StaticWebsite = {
  serializedName: "StaticWebsite",
  type: {
    name: "Composite",
    className: "StaticWebsite",
    modelProperties: {
      enabled: {
        serializedName: "Enabled",
        required: true,
        xmlName: "Enabled",
        type: {
          name: "Boolean"
        }
      },
      indexDocument: {
        serializedName: "IndexDocument",
        xmlName: "IndexDocument",
        type: {
          name: "String"
        }
      },
      errorDocument404Path: {
        serializedName: "ErrorDocument404Path",
        xmlName: "ErrorDocument404Path",
        type: {
          name: "String"
        }
      },
      defaultIndexDocumentPath: {
        serializedName: "DefaultIndexDocumentPath",
        xmlName: "DefaultIndexDocumentPath",
        type: {
          name: "String"
        }
      }
    }
  }
};
var StorageError = {
  serializedName: "StorageError",
  type: {
    name: "Composite",
    className: "StorageError",
    modelProperties: {
      message: {
        serializedName: "Message",
        xmlName: "Message",
        type: {
          name: "String"
        }
      },
      code: {
        serializedName: "Code",
        xmlName: "Code",
        type: {
          name: "String"
        }
      },
      authenticationErrorDetail: {
        serializedName: "AuthenticationErrorDetail",
        xmlName: "AuthenticationErrorDetail",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobServiceStatistics = {
  serializedName: "BlobServiceStatistics",
  xmlName: "StorageServiceStats",
  type: {
    name: "Composite",
    className: "BlobServiceStatistics",
    modelProperties: {
      geoReplication: {
        serializedName: "GeoReplication",
        xmlName: "GeoReplication",
        type: {
          name: "Composite",
          className: "GeoReplication"
        }
      }
    }
  }
};
var GeoReplication = {
  serializedName: "GeoReplication",
  type: {
    name: "Composite",
    className: "GeoReplication",
    modelProperties: {
      status: {
        serializedName: "Status",
        required: true,
        xmlName: "Status",
        type: {
          name: "Enum",
          allowedValues: ["live", "bootstrap", "unavailable"]
        }
      },
      lastSyncOn: {
        serializedName: "LastSyncTime",
        required: true,
        xmlName: "LastSyncTime",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var ListContainersSegmentResponse = {
  serializedName: "ListContainersSegmentResponse",
  xmlName: "EnumerationResults",
  type: {
    name: "Composite",
    className: "ListContainersSegmentResponse",
    modelProperties: {
      serviceEndpoint: {
        serializedName: "ServiceEndpoint",
        required: true,
        xmlName: "ServiceEndpoint",
        xmlIsAttribute: true,
        type: {
          name: "String"
        }
      },
      prefix: {
        serializedName: "Prefix",
        xmlName: "Prefix",
        type: {
          name: "String"
        }
      },
      marker: {
        serializedName: "Marker",
        xmlName: "Marker",
        type: {
          name: "String"
        }
      },
      maxPageSize: {
        serializedName: "MaxResults",
        xmlName: "MaxResults",
        type: {
          name: "Number"
        }
      },
      containerItems: {
        serializedName: "ContainerItems",
        required: true,
        xmlName: "Containers",
        xmlIsWrapped: true,
        xmlElementName: "Container",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "ContainerItem"
            }
          }
        }
      },
      continuationToken: {
        serializedName: "NextMarker",
        xmlName: "NextMarker",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerItem = {
  serializedName: "ContainerItem",
  xmlName: "Container",
  type: {
    name: "Composite",
    className: "ContainerItem",
    modelProperties: {
      name: {
        serializedName: "Name",
        required: true,
        xmlName: "Name",
        type: {
          name: "String"
        }
      },
      deleted: {
        serializedName: "Deleted",
        xmlName: "Deleted",
        type: {
          name: "Boolean"
        }
      },
      version: {
        serializedName: "Version",
        xmlName: "Version",
        type: {
          name: "String"
        }
      },
      properties: {
        serializedName: "Properties",
        xmlName: "Properties",
        type: {
          name: "Composite",
          className: "ContainerProperties"
        }
      },
      metadata: {
        serializedName: "Metadata",
        xmlName: "Metadata",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      }
    }
  }
};
var ContainerProperties = {
  serializedName: "ContainerProperties",
  type: {
    name: "Composite",
    className: "ContainerProperties",
    modelProperties: {
      lastModified: {
        serializedName: "Last-Modified",
        required: true,
        xmlName: "Last-Modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "Etag",
        required: true,
        xmlName: "Etag",
        type: {
          name: "String"
        }
      },
      leaseStatus: {
        serializedName: "LeaseStatus",
        xmlName: "LeaseStatus",
        type: {
          name: "Enum",
          allowedValues: ["locked", "unlocked"]
        }
      },
      leaseState: {
        serializedName: "LeaseState",
        xmlName: "LeaseState",
        type: {
          name: "Enum",
          allowedValues: [
            "available",
            "leased",
            "expired",
            "breaking",
            "broken"
          ]
        }
      },
      leaseDuration: {
        serializedName: "LeaseDuration",
        xmlName: "LeaseDuration",
        type: {
          name: "Enum",
          allowedValues: ["infinite", "fixed"]
        }
      },
      publicAccess: {
        serializedName: "PublicAccess",
        xmlName: "PublicAccess",
        type: {
          name: "Enum",
          allowedValues: ["container", "blob"]
        }
      },
      hasImmutabilityPolicy: {
        serializedName: "HasImmutabilityPolicy",
        xmlName: "HasImmutabilityPolicy",
        type: {
          name: "Boolean"
        }
      },
      hasLegalHold: {
        serializedName: "HasLegalHold",
        xmlName: "HasLegalHold",
        type: {
          name: "Boolean"
        }
      },
      defaultEncryptionScope: {
        serializedName: "DefaultEncryptionScope",
        xmlName: "DefaultEncryptionScope",
        type: {
          name: "String"
        }
      },
      preventEncryptionScopeOverride: {
        serializedName: "DenyEncryptionScopeOverride",
        xmlName: "DenyEncryptionScopeOverride",
        type: {
          name: "Boolean"
        }
      },
      deletedOn: {
        serializedName: "DeletedTime",
        xmlName: "DeletedTime",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      remainingRetentionDays: {
        serializedName: "RemainingRetentionDays",
        xmlName: "RemainingRetentionDays",
        type: {
          name: "Number"
        }
      },
      isImmutableStorageWithVersioningEnabled: {
        serializedName: "ImmutableStorageWithVersioningEnabled",
        xmlName: "ImmutableStorageWithVersioningEnabled",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var KeyInfo = {
  serializedName: "KeyInfo",
  type: {
    name: "Composite",
    className: "KeyInfo",
    modelProperties: {
      startsOn: {
        serializedName: "Start",
        required: true,
        xmlName: "Start",
        type: {
          name: "String"
        }
      },
      expiresOn: {
        serializedName: "Expiry",
        required: true,
        xmlName: "Expiry",
        type: {
          name: "String"
        }
      }
    }
  }
};
var UserDelegationKey = {
  serializedName: "UserDelegationKey",
  type: {
    name: "Composite",
    className: "UserDelegationKey",
    modelProperties: {
      signedObjectId: {
        serializedName: "SignedOid",
        required: true,
        xmlName: "SignedOid",
        type: {
          name: "String"
        }
      },
      signedTenantId: {
        serializedName: "SignedTid",
        required: true,
        xmlName: "SignedTid",
        type: {
          name: "String"
        }
      },
      signedStartsOn: {
        serializedName: "SignedStart",
        required: true,
        xmlName: "SignedStart",
        type: {
          name: "String"
        }
      },
      signedExpiresOn: {
        serializedName: "SignedExpiry",
        required: true,
        xmlName: "SignedExpiry",
        type: {
          name: "String"
        }
      },
      signedService: {
        serializedName: "SignedService",
        required: true,
        xmlName: "SignedService",
        type: {
          name: "String"
        }
      },
      signedVersion: {
        serializedName: "SignedVersion",
        required: true,
        xmlName: "SignedVersion",
        type: {
          name: "String"
        }
      },
      value: {
        serializedName: "Value",
        required: true,
        xmlName: "Value",
        type: {
          name: "String"
        }
      }
    }
  }
};
var FilterBlobSegment = {
  serializedName: "FilterBlobSegment",
  xmlName: "EnumerationResults",
  type: {
    name: "Composite",
    className: "FilterBlobSegment",
    modelProperties: {
      serviceEndpoint: {
        serializedName: "ServiceEndpoint",
        required: true,
        xmlName: "ServiceEndpoint",
        xmlIsAttribute: true,
        type: {
          name: "String"
        }
      },
      where: {
        serializedName: "Where",
        required: true,
        xmlName: "Where",
        type: {
          name: "String"
        }
      },
      blobs: {
        serializedName: "Blobs",
        required: true,
        xmlName: "Blobs",
        xmlIsWrapped: true,
        xmlElementName: "Blob",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "FilterBlobItem"
            }
          }
        }
      },
      continuationToken: {
        serializedName: "NextMarker",
        xmlName: "NextMarker",
        type: {
          name: "String"
        }
      }
    }
  }
};
var FilterBlobItem = {
  serializedName: "FilterBlobItem",
  xmlName: "Blob",
  type: {
    name: "Composite",
    className: "FilterBlobItem",
    modelProperties: {
      name: {
        serializedName: "Name",
        required: true,
        xmlName: "Name",
        type: {
          name: "String"
        }
      },
      containerName: {
        serializedName: "ContainerName",
        required: true,
        xmlName: "ContainerName",
        type: {
          name: "String"
        }
      },
      tags: {
        serializedName: "Tags",
        xmlName: "Tags",
        type: {
          name: "Composite",
          className: "BlobTags"
        }
      }
    }
  }
};
var BlobTags = {
  serializedName: "BlobTags",
  xmlName: "Tags",
  type: {
    name: "Composite",
    className: "BlobTags",
    modelProperties: {
      blobTagSet: {
        serializedName: "BlobTagSet",
        required: true,
        xmlName: "TagSet",
        xmlIsWrapped: true,
        xmlElementName: "Tag",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "BlobTag"
            }
          }
        }
      }
    }
  }
};
var BlobTag = {
  serializedName: "BlobTag",
  xmlName: "Tag",
  type: {
    name: "Composite",
    className: "BlobTag",
    modelProperties: {
      key: {
        serializedName: "Key",
        required: true,
        xmlName: "Key",
        type: {
          name: "String"
        }
      },
      value: {
        serializedName: "Value",
        required: true,
        xmlName: "Value",
        type: {
          name: "String"
        }
      }
    }
  }
};
var SignedIdentifier = {
  serializedName: "SignedIdentifier",
  xmlName: "SignedIdentifier",
  type: {
    name: "Composite",
    className: "SignedIdentifier",
    modelProperties: {
      id: {
        serializedName: "Id",
        required: true,
        xmlName: "Id",
        type: {
          name: "String"
        }
      },
      accessPolicy: {
        serializedName: "AccessPolicy",
        xmlName: "AccessPolicy",
        type: {
          name: "Composite",
          className: "AccessPolicy"
        }
      }
    }
  }
};
var AccessPolicy = {
  serializedName: "AccessPolicy",
  type: {
    name: "Composite",
    className: "AccessPolicy",
    modelProperties: {
      startsOn: {
        serializedName: "Start",
        xmlName: "Start",
        type: {
          name: "String"
        }
      },
      expiresOn: {
        serializedName: "Expiry",
        xmlName: "Expiry",
        type: {
          name: "String"
        }
      },
      permissions: {
        serializedName: "Permission",
        xmlName: "Permission",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ListBlobsFlatSegmentResponse = {
  serializedName: "ListBlobsFlatSegmentResponse",
  xmlName: "EnumerationResults",
  type: {
    name: "Composite",
    className: "ListBlobsFlatSegmentResponse",
    modelProperties: {
      serviceEndpoint: {
        serializedName: "ServiceEndpoint",
        required: true,
        xmlName: "ServiceEndpoint",
        xmlIsAttribute: true,
        type: {
          name: "String"
        }
      },
      containerName: {
        serializedName: "ContainerName",
        required: true,
        xmlName: "ContainerName",
        xmlIsAttribute: true,
        type: {
          name: "String"
        }
      },
      prefix: {
        serializedName: "Prefix",
        xmlName: "Prefix",
        type: {
          name: "String"
        }
      },
      marker: {
        serializedName: "Marker",
        xmlName: "Marker",
        type: {
          name: "String"
        }
      },
      maxPageSize: {
        serializedName: "MaxResults",
        xmlName: "MaxResults",
        type: {
          name: "Number"
        }
      },
      segment: {
        serializedName: "Segment",
        xmlName: "Blobs",
        type: {
          name: "Composite",
          className: "BlobFlatListSegment"
        }
      },
      continuationToken: {
        serializedName: "NextMarker",
        xmlName: "NextMarker",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobFlatListSegment = {
  serializedName: "BlobFlatListSegment",
  xmlName: "Blobs",
  type: {
    name: "Composite",
    className: "BlobFlatListSegment",
    modelProperties: {
      blobItems: {
        serializedName: "BlobItems",
        required: true,
        xmlName: "BlobItems",
        xmlElementName: "Blob",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "BlobItemInternal"
            }
          }
        }
      }
    }
  }
};
var BlobItemInternal = {
  serializedName: "BlobItemInternal",
  xmlName: "Blob",
  type: {
    name: "Composite",
    className: "BlobItemInternal",
    modelProperties: {
      name: {
        serializedName: "Name",
        xmlName: "Name",
        type: {
          name: "Composite",
          className: "BlobName"
        }
      },
      deleted: {
        serializedName: "Deleted",
        required: true,
        xmlName: "Deleted",
        type: {
          name: "Boolean"
        }
      },
      snapshot: {
        serializedName: "Snapshot",
        required: true,
        xmlName: "Snapshot",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "VersionId",
        xmlName: "VersionId",
        type: {
          name: "String"
        }
      },
      isCurrentVersion: {
        serializedName: "IsCurrentVersion",
        xmlName: "IsCurrentVersion",
        type: {
          name: "Boolean"
        }
      },
      properties: {
        serializedName: "Properties",
        xmlName: "Properties",
        type: {
          name: "Composite",
          className: "BlobPropertiesInternal"
        }
      },
      metadata: {
        serializedName: "Metadata",
        xmlName: "Metadata",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      blobTags: {
        serializedName: "BlobTags",
        xmlName: "Tags",
        type: {
          name: "Composite",
          className: "BlobTags"
        }
      },
      objectReplicationMetadata: {
        serializedName: "ObjectReplicationMetadata",
        xmlName: "OrMetadata",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      hasVersionsOnly: {
        serializedName: "HasVersionsOnly",
        xmlName: "HasVersionsOnly",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var BlobName = {
  serializedName: "BlobName",
  type: {
    name: "Composite",
    className: "BlobName",
    modelProperties: {
      encoded: {
        serializedName: "Encoded",
        xmlName: "Encoded",
        xmlIsAttribute: true,
        type: {
          name: "Boolean"
        }
      },
      content: {
        serializedName: "content",
        xmlName: "content",
        xmlIsMsText: true,
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobPropertiesInternal = {
  serializedName: "BlobPropertiesInternal",
  xmlName: "Properties",
  type: {
    name: "Composite",
    className: "BlobPropertiesInternal",
    modelProperties: {
      createdOn: {
        serializedName: "Creation-Time",
        xmlName: "Creation-Time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      lastModified: {
        serializedName: "Last-Modified",
        required: true,
        xmlName: "Last-Modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "Etag",
        required: true,
        xmlName: "Etag",
        type: {
          name: "String"
        }
      },
      contentLength: {
        serializedName: "Content-Length",
        xmlName: "Content-Length",
        type: {
          name: "Number"
        }
      },
      contentType: {
        serializedName: "Content-Type",
        xmlName: "Content-Type",
        type: {
          name: "String"
        }
      },
      contentEncoding: {
        serializedName: "Content-Encoding",
        xmlName: "Content-Encoding",
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        serializedName: "Content-Language",
        xmlName: "Content-Language",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "Content-MD5",
        xmlName: "Content-MD5",
        type: {
          name: "ByteArray"
        }
      },
      contentDisposition: {
        serializedName: "Content-Disposition",
        xmlName: "Content-Disposition",
        type: {
          name: "String"
        }
      },
      cacheControl: {
        serializedName: "Cache-Control",
        xmlName: "Cache-Control",
        type: {
          name: "String"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      blobType: {
        serializedName: "BlobType",
        xmlName: "BlobType",
        type: {
          name: "Enum",
          allowedValues: ["BlockBlob", "PageBlob", "AppendBlob"]
        }
      },
      leaseStatus: {
        serializedName: "LeaseStatus",
        xmlName: "LeaseStatus",
        type: {
          name: "Enum",
          allowedValues: ["locked", "unlocked"]
        }
      },
      leaseState: {
        serializedName: "LeaseState",
        xmlName: "LeaseState",
        type: {
          name: "Enum",
          allowedValues: [
            "available",
            "leased",
            "expired",
            "breaking",
            "broken"
          ]
        }
      },
      leaseDuration: {
        serializedName: "LeaseDuration",
        xmlName: "LeaseDuration",
        type: {
          name: "Enum",
          allowedValues: ["infinite", "fixed"]
        }
      },
      copyId: {
        serializedName: "CopyId",
        xmlName: "CopyId",
        type: {
          name: "String"
        }
      },
      copyStatus: {
        serializedName: "CopyStatus",
        xmlName: "CopyStatus",
        type: {
          name: "Enum",
          allowedValues: ["pending", "success", "aborted", "failed"]
        }
      },
      copySource: {
        serializedName: "CopySource",
        xmlName: "CopySource",
        type: {
          name: "String"
        }
      },
      copyProgress: {
        serializedName: "CopyProgress",
        xmlName: "CopyProgress",
        type: {
          name: "String"
        }
      },
      copyCompletedOn: {
        serializedName: "CopyCompletionTime",
        xmlName: "CopyCompletionTime",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      copyStatusDescription: {
        serializedName: "CopyStatusDescription",
        xmlName: "CopyStatusDescription",
        type: {
          name: "String"
        }
      },
      serverEncrypted: {
        serializedName: "ServerEncrypted",
        xmlName: "ServerEncrypted",
        type: {
          name: "Boolean"
        }
      },
      incrementalCopy: {
        serializedName: "IncrementalCopy",
        xmlName: "IncrementalCopy",
        type: {
          name: "Boolean"
        }
      },
      destinationSnapshot: {
        serializedName: "DestinationSnapshot",
        xmlName: "DestinationSnapshot",
        type: {
          name: "String"
        }
      },
      deletedOn: {
        serializedName: "DeletedTime",
        xmlName: "DeletedTime",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      remainingRetentionDays: {
        serializedName: "RemainingRetentionDays",
        xmlName: "RemainingRetentionDays",
        type: {
          name: "Number"
        }
      },
      accessTier: {
        serializedName: "AccessTier",
        xmlName: "AccessTier",
        type: {
          name: "Enum",
          allowedValues: [
            "P4",
            "P6",
            "P10",
            "P15",
            "P20",
            "P30",
            "P40",
            "P50",
            "P60",
            "P70",
            "P80",
            "Hot",
            "Cool",
            "Archive",
            "Cold"
          ]
        }
      },
      accessTierInferred: {
        serializedName: "AccessTierInferred",
        xmlName: "AccessTierInferred",
        type: {
          name: "Boolean"
        }
      },
      archiveStatus: {
        serializedName: "ArchiveStatus",
        xmlName: "ArchiveStatus",
        type: {
          name: "Enum",
          allowedValues: [
            "rehydrate-pending-to-hot",
            "rehydrate-pending-to-cool",
            "rehydrate-pending-to-cold"
          ]
        }
      },
      customerProvidedKeySha256: {
        serializedName: "CustomerProvidedKeySha256",
        xmlName: "CustomerProvidedKeySha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "EncryptionScope",
        xmlName: "EncryptionScope",
        type: {
          name: "String"
        }
      },
      accessTierChangedOn: {
        serializedName: "AccessTierChangeTime",
        xmlName: "AccessTierChangeTime",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      tagCount: {
        serializedName: "TagCount",
        xmlName: "TagCount",
        type: {
          name: "Number"
        }
      },
      expiresOn: {
        serializedName: "Expiry-Time",
        xmlName: "Expiry-Time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isSealed: {
        serializedName: "Sealed",
        xmlName: "Sealed",
        type: {
          name: "Boolean"
        }
      },
      rehydratePriority: {
        serializedName: "RehydratePriority",
        xmlName: "RehydratePriority",
        type: {
          name: "Enum",
          allowedValues: ["High", "Standard"]
        }
      },
      lastAccessedOn: {
        serializedName: "LastAccessTime",
        xmlName: "LastAccessTime",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyExpiresOn: {
        serializedName: "ImmutabilityPolicyUntilDate",
        xmlName: "ImmutabilityPolicyUntilDate",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyMode: {
        serializedName: "ImmutabilityPolicyMode",
        xmlName: "ImmutabilityPolicyMode",
        type: {
          name: "Enum",
          allowedValues: ["Mutable", "Unlocked", "Locked"]
        }
      },
      legalHold: {
        serializedName: "LegalHold",
        xmlName: "LegalHold",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var ListBlobsHierarchySegmentResponse = {
  serializedName: "ListBlobsHierarchySegmentResponse",
  xmlName: "EnumerationResults",
  type: {
    name: "Composite",
    className: "ListBlobsHierarchySegmentResponse",
    modelProperties: {
      serviceEndpoint: {
        serializedName: "ServiceEndpoint",
        required: true,
        xmlName: "ServiceEndpoint",
        xmlIsAttribute: true,
        type: {
          name: "String"
        }
      },
      containerName: {
        serializedName: "ContainerName",
        required: true,
        xmlName: "ContainerName",
        xmlIsAttribute: true,
        type: {
          name: "String"
        }
      },
      prefix: {
        serializedName: "Prefix",
        xmlName: "Prefix",
        type: {
          name: "String"
        }
      },
      marker: {
        serializedName: "Marker",
        xmlName: "Marker",
        type: {
          name: "String"
        }
      },
      maxPageSize: {
        serializedName: "MaxResults",
        xmlName: "MaxResults",
        type: {
          name: "Number"
        }
      },
      delimiter: {
        serializedName: "Delimiter",
        xmlName: "Delimiter",
        type: {
          name: "String"
        }
      },
      segment: {
        serializedName: "Segment",
        xmlName: "Blobs",
        type: {
          name: "Composite",
          className: "BlobHierarchyListSegment"
        }
      },
      continuationToken: {
        serializedName: "NextMarker",
        xmlName: "NextMarker",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobHierarchyListSegment = {
  serializedName: "BlobHierarchyListSegment",
  xmlName: "Blobs",
  type: {
    name: "Composite",
    className: "BlobHierarchyListSegment",
    modelProperties: {
      blobPrefixes: {
        serializedName: "BlobPrefixes",
        xmlName: "BlobPrefixes",
        xmlElementName: "BlobPrefix",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "BlobPrefix"
            }
          }
        }
      },
      blobItems: {
        serializedName: "BlobItems",
        required: true,
        xmlName: "BlobItems",
        xmlElementName: "Blob",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "BlobItemInternal"
            }
          }
        }
      }
    }
  }
};
var BlobPrefix = {
  serializedName: "BlobPrefix",
  type: {
    name: "Composite",
    className: "BlobPrefix",
    modelProperties: {
      name: {
        serializedName: "Name",
        xmlName: "Name",
        type: {
          name: "Composite",
          className: "BlobName"
        }
      }
    }
  }
};
var BlockLookupList = {
  serializedName: "BlockLookupList",
  xmlName: "BlockList",
  type: {
    name: "Composite",
    className: "BlockLookupList",
    modelProperties: {
      committed: {
        serializedName: "Committed",
        xmlName: "Committed",
        xmlElementName: "Committed",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      uncommitted: {
        serializedName: "Uncommitted",
        xmlName: "Uncommitted",
        xmlElementName: "Uncommitted",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      latest: {
        serializedName: "Latest",
        xmlName: "Latest",
        xmlElementName: "Latest",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      }
    }
  }
};
var BlockList = {
  serializedName: "BlockList",
  type: {
    name: "Composite",
    className: "BlockList",
    modelProperties: {
      committedBlocks: {
        serializedName: "CommittedBlocks",
        xmlName: "CommittedBlocks",
        xmlIsWrapped: true,
        xmlElementName: "Block",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Block"
            }
          }
        }
      },
      uncommittedBlocks: {
        serializedName: "UncommittedBlocks",
        xmlName: "UncommittedBlocks",
        xmlIsWrapped: true,
        xmlElementName: "Block",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Block"
            }
          }
        }
      }
    }
  }
};
var Block = {
  serializedName: "Block",
  type: {
    name: "Composite",
    className: "Block",
    modelProperties: {
      name: {
        serializedName: "Name",
        required: true,
        xmlName: "Name",
        type: {
          name: "String"
        }
      },
      size: {
        serializedName: "Size",
        required: true,
        xmlName: "Size",
        type: {
          name: "Number"
        }
      }
    }
  }
};
var PageList = {
  serializedName: "PageList",
  type: {
    name: "Composite",
    className: "PageList",
    modelProperties: {
      pageRange: {
        serializedName: "PageRange",
        xmlName: "PageRange",
        xmlElementName: "PageRange",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "PageRange"
            }
          }
        }
      },
      clearRange: {
        serializedName: "ClearRange",
        xmlName: "ClearRange",
        xmlElementName: "ClearRange",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "ClearRange"
            }
          }
        }
      },
      continuationToken: {
        serializedName: "NextMarker",
        xmlName: "NextMarker",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageRange = {
  serializedName: "PageRange",
  xmlName: "PageRange",
  type: {
    name: "Composite",
    className: "PageRange",
    modelProperties: {
      start: {
        serializedName: "Start",
        required: true,
        xmlName: "Start",
        type: {
          name: "Number"
        }
      },
      end: {
        serializedName: "End",
        required: true,
        xmlName: "End",
        type: {
          name: "Number"
        }
      }
    }
  }
};
var ClearRange = {
  serializedName: "ClearRange",
  xmlName: "ClearRange",
  type: {
    name: "Composite",
    className: "ClearRange",
    modelProperties: {
      start: {
        serializedName: "Start",
        required: true,
        xmlName: "Start",
        type: {
          name: "Number"
        }
      },
      end: {
        serializedName: "End",
        required: true,
        xmlName: "End",
        type: {
          name: "Number"
        }
      }
    }
  }
};
var QueryRequest = {
  serializedName: "QueryRequest",
  xmlName: "QueryRequest",
  type: {
    name: "Composite",
    className: "QueryRequest",
    modelProperties: {
      queryType: {
        serializedName: "QueryType",
        required: true,
        xmlName: "QueryType",
        type: {
          name: "String"
        }
      },
      expression: {
        serializedName: "Expression",
        required: true,
        xmlName: "Expression",
        type: {
          name: "String"
        }
      },
      inputSerialization: {
        serializedName: "InputSerialization",
        xmlName: "InputSerialization",
        type: {
          name: "Composite",
          className: "QuerySerialization"
        }
      },
      outputSerialization: {
        serializedName: "OutputSerialization",
        xmlName: "OutputSerialization",
        type: {
          name: "Composite",
          className: "QuerySerialization"
        }
      }
    }
  }
};
var QuerySerialization = {
  serializedName: "QuerySerialization",
  type: {
    name: "Composite",
    className: "QuerySerialization",
    modelProperties: {
      format: {
        serializedName: "Format",
        xmlName: "Format",
        type: {
          name: "Composite",
          className: "QueryFormat"
        }
      }
    }
  }
};
var QueryFormat = {
  serializedName: "QueryFormat",
  type: {
    name: "Composite",
    className: "QueryFormat",
    modelProperties: {
      type: {
        serializedName: "Type",
        required: true,
        xmlName: "Type",
        type: {
          name: "Enum",
          allowedValues: ["delimited", "json", "arrow", "parquet"]
        }
      },
      delimitedTextConfiguration: {
        serializedName: "DelimitedTextConfiguration",
        xmlName: "DelimitedTextConfiguration",
        type: {
          name: "Composite",
          className: "DelimitedTextConfiguration"
        }
      },
      jsonTextConfiguration: {
        serializedName: "JsonTextConfiguration",
        xmlName: "JsonTextConfiguration",
        type: {
          name: "Composite",
          className: "JsonTextConfiguration"
        }
      },
      arrowConfiguration: {
        serializedName: "ArrowConfiguration",
        xmlName: "ArrowConfiguration",
        type: {
          name: "Composite",
          className: "ArrowConfiguration"
        }
      },
      parquetTextConfiguration: {
        serializedName: "ParquetTextConfiguration",
        xmlName: "ParquetTextConfiguration",
        type: {
          name: "Dictionary",
          value: { type: { name: "any" } }
        }
      }
    }
  }
};
var DelimitedTextConfiguration = {
  serializedName: "DelimitedTextConfiguration",
  xmlName: "DelimitedTextConfiguration",
  type: {
    name: "Composite",
    className: "DelimitedTextConfiguration",
    modelProperties: {
      columnSeparator: {
        serializedName: "ColumnSeparator",
        xmlName: "ColumnSeparator",
        type: {
          name: "String"
        }
      },
      fieldQuote: {
        serializedName: "FieldQuote",
        xmlName: "FieldQuote",
        type: {
          name: "String"
        }
      },
      recordSeparator: {
        serializedName: "RecordSeparator",
        xmlName: "RecordSeparator",
        type: {
          name: "String"
        }
      },
      escapeChar: {
        serializedName: "EscapeChar",
        xmlName: "EscapeChar",
        type: {
          name: "String"
        }
      },
      headersPresent: {
        serializedName: "HeadersPresent",
        xmlName: "HasHeaders",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var JsonTextConfiguration = {
  serializedName: "JsonTextConfiguration",
  xmlName: "JsonTextConfiguration",
  type: {
    name: "Composite",
    className: "JsonTextConfiguration",
    modelProperties: {
      recordSeparator: {
        serializedName: "RecordSeparator",
        xmlName: "RecordSeparator",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ArrowConfiguration = {
  serializedName: "ArrowConfiguration",
  xmlName: "ArrowConfiguration",
  type: {
    name: "Composite",
    className: "ArrowConfiguration",
    modelProperties: {
      schema: {
        serializedName: "Schema",
        required: true,
        xmlName: "Schema",
        xmlIsWrapped: true,
        xmlElementName: "Field",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "ArrowField"
            }
          }
        }
      }
    }
  }
};
var ArrowField = {
  serializedName: "ArrowField",
  xmlName: "Field",
  type: {
    name: "Composite",
    className: "ArrowField",
    modelProperties: {
      type: {
        serializedName: "Type",
        required: true,
        xmlName: "Type",
        type: {
          name: "String"
        }
      },
      name: {
        serializedName: "Name",
        xmlName: "Name",
        type: {
          name: "String"
        }
      },
      precision: {
        serializedName: "Precision",
        xmlName: "Precision",
        type: {
          name: "Number"
        }
      },
      scale: {
        serializedName: "Scale",
        xmlName: "Scale",
        type: {
          name: "Number"
        }
      }
    }
  }
};
var ServiceSetPropertiesHeaders = {
  serializedName: "Service_setPropertiesHeaders",
  type: {
    name: "Composite",
    className: "ServiceSetPropertiesHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceSetPropertiesExceptionHeaders = {
  serializedName: "Service_setPropertiesExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceSetPropertiesExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetPropertiesHeaders = {
  serializedName: "Service_getPropertiesHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetPropertiesHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetPropertiesExceptionHeaders = {
  serializedName: "Service_getPropertiesExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetPropertiesExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetStatisticsHeaders = {
  serializedName: "Service_getStatisticsHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetStatisticsHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetStatisticsExceptionHeaders = {
  serializedName: "Service_getStatisticsExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetStatisticsExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceListContainersSegmentHeaders = {
  serializedName: "Service_listContainersSegmentHeaders",
  type: {
    name: "Composite",
    className: "ServiceListContainersSegmentHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceListContainersSegmentExceptionHeaders = {
  serializedName: "Service_listContainersSegmentExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceListContainersSegmentExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetUserDelegationKeyHeaders = {
  serializedName: "Service_getUserDelegationKeyHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetUserDelegationKeyHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetUserDelegationKeyExceptionHeaders = {
  serializedName: "Service_getUserDelegationKeyExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetUserDelegationKeyExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetAccountInfoHeaders = {
  serializedName: "Service_getAccountInfoHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetAccountInfoHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      skuName: {
        serializedName: "x-ms-sku-name",
        xmlName: "x-ms-sku-name",
        type: {
          name: "Enum",
          allowedValues: [
            "Standard_LRS",
            "Standard_GRS",
            "Standard_RAGRS",
            "Standard_ZRS",
            "Premium_LRS"
          ]
        }
      },
      accountKind: {
        serializedName: "x-ms-account-kind",
        xmlName: "x-ms-account-kind",
        type: {
          name: "Enum",
          allowedValues: [
            "Storage",
            "BlobStorage",
            "StorageV2",
            "FileStorage",
            "BlockBlobStorage"
          ]
        }
      },
      isHierarchicalNamespaceEnabled: {
        serializedName: "x-ms-is-hns-enabled",
        xmlName: "x-ms-is-hns-enabled",
        type: {
          name: "Boolean"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceGetAccountInfoExceptionHeaders = {
  serializedName: "Service_getAccountInfoExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceGetAccountInfoExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceSubmitBatchHeaders = {
  serializedName: "Service_submitBatchHeaders",
  type: {
    name: "Composite",
    className: "ServiceSubmitBatchHeaders",
    modelProperties: {
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceSubmitBatchExceptionHeaders = {
  serializedName: "Service_submitBatchExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceSubmitBatchExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceFilterBlobsHeaders = {
  serializedName: "Service_filterBlobsHeaders",
  type: {
    name: "Composite",
    className: "ServiceFilterBlobsHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ServiceFilterBlobsExceptionHeaders = {
  serializedName: "Service_filterBlobsExceptionHeaders",
  type: {
    name: "Composite",
    className: "ServiceFilterBlobsExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerCreateHeaders = {
  serializedName: "Container_createHeaders",
  type: {
    name: "Composite",
    className: "ContainerCreateHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerCreateExceptionHeaders = {
  serializedName: "Container_createExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerCreateExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerGetPropertiesHeaders = {
  serializedName: "Container_getPropertiesHeaders",
  type: {
    name: "Composite",
    className: "ContainerGetPropertiesHeaders",
    modelProperties: {
      metadata: {
        serializedName: "x-ms-meta",
        headerCollectionPrefix: "x-ms-meta-",
        xmlName: "x-ms-meta",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseDuration: {
        serializedName: "x-ms-lease-duration",
        xmlName: "x-ms-lease-duration",
        type: {
          name: "Enum",
          allowedValues: ["infinite", "fixed"]
        }
      },
      leaseState: {
        serializedName: "x-ms-lease-state",
        xmlName: "x-ms-lease-state",
        type: {
          name: "Enum",
          allowedValues: [
            "available",
            "leased",
            "expired",
            "breaking",
            "broken"
          ]
        }
      },
      leaseStatus: {
        serializedName: "x-ms-lease-status",
        xmlName: "x-ms-lease-status",
        type: {
          name: "Enum",
          allowedValues: ["locked", "unlocked"]
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobPublicAccess: {
        serializedName: "x-ms-blob-public-access",
        xmlName: "x-ms-blob-public-access",
        type: {
          name: "Enum",
          allowedValues: ["container", "blob"]
        }
      },
      hasImmutabilityPolicy: {
        serializedName: "x-ms-has-immutability-policy",
        xmlName: "x-ms-has-immutability-policy",
        type: {
          name: "Boolean"
        }
      },
      hasLegalHold: {
        serializedName: "x-ms-has-legal-hold",
        xmlName: "x-ms-has-legal-hold",
        type: {
          name: "Boolean"
        }
      },
      defaultEncryptionScope: {
        serializedName: "x-ms-default-encryption-scope",
        xmlName: "x-ms-default-encryption-scope",
        type: {
          name: "String"
        }
      },
      denyEncryptionScopeOverride: {
        serializedName: "x-ms-deny-encryption-scope-override",
        xmlName: "x-ms-deny-encryption-scope-override",
        type: {
          name: "Boolean"
        }
      },
      isImmutableStorageWithVersioningEnabled: {
        serializedName: "x-ms-immutable-storage-with-versioning-enabled",
        xmlName: "x-ms-immutable-storage-with-versioning-enabled",
        type: {
          name: "Boolean"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerGetPropertiesExceptionHeaders = {
  serializedName: "Container_getPropertiesExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerGetPropertiesExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerDeleteHeaders = {
  serializedName: "Container_deleteHeaders",
  type: {
    name: "Composite",
    className: "ContainerDeleteHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerDeleteExceptionHeaders = {
  serializedName: "Container_deleteExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerDeleteExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerSetMetadataHeaders = {
  serializedName: "Container_setMetadataHeaders",
  type: {
    name: "Composite",
    className: "ContainerSetMetadataHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerSetMetadataExceptionHeaders = {
  serializedName: "Container_setMetadataExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerSetMetadataExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerGetAccessPolicyHeaders = {
  serializedName: "Container_getAccessPolicyHeaders",
  type: {
    name: "Composite",
    className: "ContainerGetAccessPolicyHeaders",
    modelProperties: {
      blobPublicAccess: {
        serializedName: "x-ms-blob-public-access",
        xmlName: "x-ms-blob-public-access",
        type: {
          name: "Enum",
          allowedValues: ["container", "blob"]
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerGetAccessPolicyExceptionHeaders = {
  serializedName: "Container_getAccessPolicyExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerGetAccessPolicyExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerSetAccessPolicyHeaders = {
  serializedName: "Container_setAccessPolicyHeaders",
  type: {
    name: "Composite",
    className: "ContainerSetAccessPolicyHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerSetAccessPolicyExceptionHeaders = {
  serializedName: "Container_setAccessPolicyExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerSetAccessPolicyExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerRestoreHeaders = {
  serializedName: "Container_restoreHeaders",
  type: {
    name: "Composite",
    className: "ContainerRestoreHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerRestoreExceptionHeaders = {
  serializedName: "Container_restoreExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerRestoreExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerRenameHeaders = {
  serializedName: "Container_renameHeaders",
  type: {
    name: "Composite",
    className: "ContainerRenameHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerRenameExceptionHeaders = {
  serializedName: "Container_renameExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerRenameExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerSubmitBatchHeaders = {
  serializedName: "Container_submitBatchHeaders",
  type: {
    name: "Composite",
    className: "ContainerSubmitBatchHeaders",
    modelProperties: {
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerSubmitBatchExceptionHeaders = {
  serializedName: "Container_submitBatchExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerSubmitBatchExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerFilterBlobsHeaders = {
  serializedName: "Container_filterBlobsHeaders",
  type: {
    name: "Composite",
    className: "ContainerFilterBlobsHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var ContainerFilterBlobsExceptionHeaders = {
  serializedName: "Container_filterBlobsExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerFilterBlobsExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerAcquireLeaseHeaders = {
  serializedName: "Container_acquireLeaseHeaders",
  type: {
    name: "Composite",
    className: "ContainerAcquireLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseId: {
        serializedName: "x-ms-lease-id",
        xmlName: "x-ms-lease-id",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var ContainerAcquireLeaseExceptionHeaders = {
  serializedName: "Container_acquireLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerAcquireLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerReleaseLeaseHeaders = {
  serializedName: "Container_releaseLeaseHeaders",
  type: {
    name: "Composite",
    className: "ContainerReleaseLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var ContainerReleaseLeaseExceptionHeaders = {
  serializedName: "Container_releaseLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerReleaseLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerRenewLeaseHeaders = {
  serializedName: "Container_renewLeaseHeaders",
  type: {
    name: "Composite",
    className: "ContainerRenewLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseId: {
        serializedName: "x-ms-lease-id",
        xmlName: "x-ms-lease-id",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var ContainerRenewLeaseExceptionHeaders = {
  serializedName: "Container_renewLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerRenewLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerBreakLeaseHeaders = {
  serializedName: "Container_breakLeaseHeaders",
  type: {
    name: "Composite",
    className: "ContainerBreakLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseTime: {
        serializedName: "x-ms-lease-time",
        xmlName: "x-ms-lease-time",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var ContainerBreakLeaseExceptionHeaders = {
  serializedName: "Container_breakLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerBreakLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerChangeLeaseHeaders = {
  serializedName: "Container_changeLeaseHeaders",
  type: {
    name: "Composite",
    className: "ContainerChangeLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseId: {
        serializedName: "x-ms-lease-id",
        xmlName: "x-ms-lease-id",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var ContainerChangeLeaseExceptionHeaders = {
  serializedName: "Container_changeLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerChangeLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerListBlobFlatSegmentHeaders = {
  serializedName: "Container_listBlobFlatSegmentHeaders",
  type: {
    name: "Composite",
    className: "ContainerListBlobFlatSegmentHeaders",
    modelProperties: {
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerListBlobFlatSegmentExceptionHeaders = {
  serializedName: "Container_listBlobFlatSegmentExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerListBlobFlatSegmentExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerListBlobHierarchySegmentHeaders = {
  serializedName: "Container_listBlobHierarchySegmentHeaders",
  type: {
    name: "Composite",
    className: "ContainerListBlobHierarchySegmentHeaders",
    modelProperties: {
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerListBlobHierarchySegmentExceptionHeaders = {
  serializedName: "Container_listBlobHierarchySegmentExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerListBlobHierarchySegmentExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var ContainerGetAccountInfoHeaders = {
  serializedName: "Container_getAccountInfoHeaders",
  type: {
    name: "Composite",
    className: "ContainerGetAccountInfoHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      skuName: {
        serializedName: "x-ms-sku-name",
        xmlName: "x-ms-sku-name",
        type: {
          name: "Enum",
          allowedValues: [
            "Standard_LRS",
            "Standard_GRS",
            "Standard_RAGRS",
            "Standard_ZRS",
            "Premium_LRS"
          ]
        }
      },
      accountKind: {
        serializedName: "x-ms-account-kind",
        xmlName: "x-ms-account-kind",
        type: {
          name: "Enum",
          allowedValues: [
            "Storage",
            "BlobStorage",
            "StorageV2",
            "FileStorage",
            "BlockBlobStorage"
          ]
        }
      },
      isHierarchicalNamespaceEnabled: {
        serializedName: "x-ms-is-hns-enabled",
        xmlName: "x-ms-is-hns-enabled",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var ContainerGetAccountInfoExceptionHeaders = {
  serializedName: "Container_getAccountInfoExceptionHeaders",
  type: {
    name: "Composite",
    className: "ContainerGetAccountInfoExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobDownloadHeaders = {
  serializedName: "Blob_downloadHeaders",
  type: {
    name: "Composite",
    className: "BlobDownloadHeaders",
    modelProperties: {
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      createdOn: {
        serializedName: "x-ms-creation-time",
        xmlName: "x-ms-creation-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      metadata: {
        serializedName: "x-ms-meta",
        headerCollectionPrefix: "x-ms-meta-",
        xmlName: "x-ms-meta",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      objectReplicationPolicyId: {
        serializedName: "x-ms-or-policy-id",
        xmlName: "x-ms-or-policy-id",
        type: {
          name: "String"
        }
      },
      objectReplicationRules: {
        serializedName: "x-ms-or",
        headerCollectionPrefix: "x-ms-or-",
        xmlName: "x-ms-or",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      contentLength: {
        serializedName: "content-length",
        xmlName: "content-length",
        type: {
          name: "Number"
        }
      },
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      contentRange: {
        serializedName: "content-range",
        xmlName: "content-range",
        type: {
          name: "String"
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      contentEncoding: {
        serializedName: "content-encoding",
        xmlName: "content-encoding",
        type: {
          name: "String"
        }
      },
      cacheControl: {
        serializedName: "cache-control",
        xmlName: "cache-control",
        type: {
          name: "String"
        }
      },
      contentDisposition: {
        serializedName: "content-disposition",
        xmlName: "content-disposition",
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        serializedName: "content-language",
        xmlName: "content-language",
        type: {
          name: "String"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      blobType: {
        serializedName: "x-ms-blob-type",
        xmlName: "x-ms-blob-type",
        type: {
          name: "Enum",
          allowedValues: ["BlockBlob", "PageBlob", "AppendBlob"]
        }
      },
      copyCompletedOn: {
        serializedName: "x-ms-copy-completion-time",
        xmlName: "x-ms-copy-completion-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      copyStatusDescription: {
        serializedName: "x-ms-copy-status-description",
        xmlName: "x-ms-copy-status-description",
        type: {
          name: "String"
        }
      },
      copyId: {
        serializedName: "x-ms-copy-id",
        xmlName: "x-ms-copy-id",
        type: {
          name: "String"
        }
      },
      copyProgress: {
        serializedName: "x-ms-copy-progress",
        xmlName: "x-ms-copy-progress",
        type: {
          name: "String"
        }
      },
      copySource: {
        serializedName: "x-ms-copy-source",
        xmlName: "x-ms-copy-source",
        type: {
          name: "String"
        }
      },
      copyStatus: {
        serializedName: "x-ms-copy-status",
        xmlName: "x-ms-copy-status",
        type: {
          name: "Enum",
          allowedValues: ["pending", "success", "aborted", "failed"]
        }
      },
      leaseDuration: {
        serializedName: "x-ms-lease-duration",
        xmlName: "x-ms-lease-duration",
        type: {
          name: "Enum",
          allowedValues: ["infinite", "fixed"]
        }
      },
      leaseState: {
        serializedName: "x-ms-lease-state",
        xmlName: "x-ms-lease-state",
        type: {
          name: "Enum",
          allowedValues: [
            "available",
            "leased",
            "expired",
            "breaking",
            "broken"
          ]
        }
      },
      leaseStatus: {
        serializedName: "x-ms-lease-status",
        xmlName: "x-ms-lease-status",
        type: {
          name: "Enum",
          allowedValues: ["locked", "unlocked"]
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      isCurrentVersion: {
        serializedName: "x-ms-is-current-version",
        xmlName: "x-ms-is-current-version",
        type: {
          name: "Boolean"
        }
      },
      acceptRanges: {
        serializedName: "accept-ranges",
        xmlName: "accept-ranges",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobCommittedBlockCount: {
        serializedName: "x-ms-blob-committed-block-count",
        xmlName: "x-ms-blob-committed-block-count",
        type: {
          name: "Number"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-server-encrypted",
        xmlName: "x-ms-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      blobContentMD5: {
        serializedName: "x-ms-blob-content-md5",
        xmlName: "x-ms-blob-content-md5",
        type: {
          name: "ByteArray"
        }
      },
      tagCount: {
        serializedName: "x-ms-tag-count",
        xmlName: "x-ms-tag-count",
        type: {
          name: "Number"
        }
      },
      isSealed: {
        serializedName: "x-ms-blob-sealed",
        xmlName: "x-ms-blob-sealed",
        type: {
          name: "Boolean"
        }
      },
      lastAccessed: {
        serializedName: "x-ms-last-access-time",
        xmlName: "x-ms-last-access-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyExpiresOn: {
        serializedName: "x-ms-immutability-policy-until-date",
        xmlName: "x-ms-immutability-policy-until-date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyMode: {
        serializedName: "x-ms-immutability-policy-mode",
        xmlName: "x-ms-immutability-policy-mode",
        type: {
          name: "Enum",
          allowedValues: ["Mutable", "Unlocked", "Locked"]
        }
      },
      legalHold: {
        serializedName: "x-ms-legal-hold",
        xmlName: "x-ms-legal-hold",
        type: {
          name: "Boolean"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      },
      contentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      }
    }
  }
};
var BlobDownloadExceptionHeaders = {
  serializedName: "Blob_downloadExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobDownloadExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobGetPropertiesHeaders = {
  serializedName: "Blob_getPropertiesHeaders",
  type: {
    name: "Composite",
    className: "BlobGetPropertiesHeaders",
    modelProperties: {
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      createdOn: {
        serializedName: "x-ms-creation-time",
        xmlName: "x-ms-creation-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      metadata: {
        serializedName: "x-ms-meta",
        headerCollectionPrefix: "x-ms-meta-",
        xmlName: "x-ms-meta",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      objectReplicationPolicyId: {
        serializedName: "x-ms-or-policy-id",
        xmlName: "x-ms-or-policy-id",
        type: {
          name: "String"
        }
      },
      objectReplicationRules: {
        serializedName: "x-ms-or",
        headerCollectionPrefix: "x-ms-or-",
        xmlName: "x-ms-or",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      blobType: {
        serializedName: "x-ms-blob-type",
        xmlName: "x-ms-blob-type",
        type: {
          name: "Enum",
          allowedValues: ["BlockBlob", "PageBlob", "AppendBlob"]
        }
      },
      copyCompletedOn: {
        serializedName: "x-ms-copy-completion-time",
        xmlName: "x-ms-copy-completion-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      copyStatusDescription: {
        serializedName: "x-ms-copy-status-description",
        xmlName: "x-ms-copy-status-description",
        type: {
          name: "String"
        }
      },
      copyId: {
        serializedName: "x-ms-copy-id",
        xmlName: "x-ms-copy-id",
        type: {
          name: "String"
        }
      },
      copyProgress: {
        serializedName: "x-ms-copy-progress",
        xmlName: "x-ms-copy-progress",
        type: {
          name: "String"
        }
      },
      copySource: {
        serializedName: "x-ms-copy-source",
        xmlName: "x-ms-copy-source",
        type: {
          name: "String"
        }
      },
      copyStatus: {
        serializedName: "x-ms-copy-status",
        xmlName: "x-ms-copy-status",
        type: {
          name: "Enum",
          allowedValues: ["pending", "success", "aborted", "failed"]
        }
      },
      isIncrementalCopy: {
        serializedName: "x-ms-incremental-copy",
        xmlName: "x-ms-incremental-copy",
        type: {
          name: "Boolean"
        }
      },
      destinationSnapshot: {
        serializedName: "x-ms-copy-destination-snapshot",
        xmlName: "x-ms-copy-destination-snapshot",
        type: {
          name: "String"
        }
      },
      leaseDuration: {
        serializedName: "x-ms-lease-duration",
        xmlName: "x-ms-lease-duration",
        type: {
          name: "Enum",
          allowedValues: ["infinite", "fixed"]
        }
      },
      leaseState: {
        serializedName: "x-ms-lease-state",
        xmlName: "x-ms-lease-state",
        type: {
          name: "Enum",
          allowedValues: [
            "available",
            "leased",
            "expired",
            "breaking",
            "broken"
          ]
        }
      },
      leaseStatus: {
        serializedName: "x-ms-lease-status",
        xmlName: "x-ms-lease-status",
        type: {
          name: "Enum",
          allowedValues: ["locked", "unlocked"]
        }
      },
      contentLength: {
        serializedName: "content-length",
        xmlName: "content-length",
        type: {
          name: "Number"
        }
      },
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      contentEncoding: {
        serializedName: "content-encoding",
        xmlName: "content-encoding",
        type: {
          name: "String"
        }
      },
      contentDisposition: {
        serializedName: "content-disposition",
        xmlName: "content-disposition",
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        serializedName: "content-language",
        xmlName: "content-language",
        type: {
          name: "String"
        }
      },
      cacheControl: {
        serializedName: "cache-control",
        xmlName: "cache-control",
        type: {
          name: "String"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      acceptRanges: {
        serializedName: "accept-ranges",
        xmlName: "accept-ranges",
        type: {
          name: "String"
        }
      },
      blobCommittedBlockCount: {
        serializedName: "x-ms-blob-committed-block-count",
        xmlName: "x-ms-blob-committed-block-count",
        type: {
          name: "Number"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-server-encrypted",
        xmlName: "x-ms-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      accessTier: {
        serializedName: "x-ms-access-tier",
        xmlName: "x-ms-access-tier",
        type: {
          name: "String"
        }
      },
      accessTierInferred: {
        serializedName: "x-ms-access-tier-inferred",
        xmlName: "x-ms-access-tier-inferred",
        type: {
          name: "Boolean"
        }
      },
      archiveStatus: {
        serializedName: "x-ms-archive-status",
        xmlName: "x-ms-archive-status",
        type: {
          name: "String"
        }
      },
      accessTierChangedOn: {
        serializedName: "x-ms-access-tier-change-time",
        xmlName: "x-ms-access-tier-change-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      isCurrentVersion: {
        serializedName: "x-ms-is-current-version",
        xmlName: "x-ms-is-current-version",
        type: {
          name: "Boolean"
        }
      },
      tagCount: {
        serializedName: "x-ms-tag-count",
        xmlName: "x-ms-tag-count",
        type: {
          name: "Number"
        }
      },
      expiresOn: {
        serializedName: "x-ms-expiry-time",
        xmlName: "x-ms-expiry-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isSealed: {
        serializedName: "x-ms-blob-sealed",
        xmlName: "x-ms-blob-sealed",
        type: {
          name: "Boolean"
        }
      },
      rehydratePriority: {
        serializedName: "x-ms-rehydrate-priority",
        xmlName: "x-ms-rehydrate-priority",
        type: {
          name: "Enum",
          allowedValues: ["High", "Standard"]
        }
      },
      lastAccessed: {
        serializedName: "x-ms-last-access-time",
        xmlName: "x-ms-last-access-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyExpiresOn: {
        serializedName: "x-ms-immutability-policy-until-date",
        xmlName: "x-ms-immutability-policy-until-date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyMode: {
        serializedName: "x-ms-immutability-policy-mode",
        xmlName: "x-ms-immutability-policy-mode",
        type: {
          name: "Enum",
          allowedValues: ["Mutable", "Unlocked", "Locked"]
        }
      },
      legalHold: {
        serializedName: "x-ms-legal-hold",
        xmlName: "x-ms-legal-hold",
        type: {
          name: "Boolean"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobGetPropertiesExceptionHeaders = {
  serializedName: "Blob_getPropertiesExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobGetPropertiesExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobDeleteHeaders = {
  serializedName: "Blob_deleteHeaders",
  type: {
    name: "Composite",
    className: "BlobDeleteHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobDeleteExceptionHeaders = {
  serializedName: "Blob_deleteExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobDeleteExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobUndeleteHeaders = {
  serializedName: "Blob_undeleteHeaders",
  type: {
    name: "Composite",
    className: "BlobUndeleteHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobUndeleteExceptionHeaders = {
  serializedName: "Blob_undeleteExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobUndeleteExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetExpiryHeaders = {
  serializedName: "Blob_setExpiryHeaders",
  type: {
    name: "Composite",
    className: "BlobSetExpiryHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var BlobSetExpiryExceptionHeaders = {
  serializedName: "Blob_setExpiryExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobSetExpiryExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetHttpHeadersHeaders = {
  serializedName: "Blob_setHttpHeadersHeaders",
  type: {
    name: "Composite",
    className: "BlobSetHttpHeadersHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetHttpHeadersExceptionHeaders = {
  serializedName: "Blob_setHttpHeadersExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobSetHttpHeadersExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetImmutabilityPolicyHeaders = {
  serializedName: "Blob_setImmutabilityPolicyHeaders",
  type: {
    name: "Composite",
    className: "BlobSetImmutabilityPolicyHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyExpiry: {
        serializedName: "x-ms-immutability-policy-until-date",
        xmlName: "x-ms-immutability-policy-until-date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      immutabilityPolicyMode: {
        serializedName: "x-ms-immutability-policy-mode",
        xmlName: "x-ms-immutability-policy-mode",
        type: {
          name: "Enum",
          allowedValues: ["Mutable", "Unlocked", "Locked"]
        }
      }
    }
  }
};
var BlobSetImmutabilityPolicyExceptionHeaders = {
  serializedName: "Blob_setImmutabilityPolicyExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobSetImmutabilityPolicyExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobDeleteImmutabilityPolicyHeaders = {
  serializedName: "Blob_deleteImmutabilityPolicyHeaders",
  type: {
    name: "Composite",
    className: "BlobDeleteImmutabilityPolicyHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var BlobDeleteImmutabilityPolicyExceptionHeaders = {
  serializedName: "Blob_deleteImmutabilityPolicyExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobDeleteImmutabilityPolicyExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetLegalHoldHeaders = {
  serializedName: "Blob_setLegalHoldHeaders",
  type: {
    name: "Composite",
    className: "BlobSetLegalHoldHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      legalHold: {
        serializedName: "x-ms-legal-hold",
        xmlName: "x-ms-legal-hold",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var BlobSetLegalHoldExceptionHeaders = {
  serializedName: "Blob_setLegalHoldExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobSetLegalHoldExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetMetadataHeaders = {
  serializedName: "Blob_setMetadataHeaders",
  type: {
    name: "Composite",
    className: "BlobSetMetadataHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetMetadataExceptionHeaders = {
  serializedName: "Blob_setMetadataExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobSetMetadataExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobAcquireLeaseHeaders = {
  serializedName: "Blob_acquireLeaseHeaders",
  type: {
    name: "Composite",
    className: "BlobAcquireLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseId: {
        serializedName: "x-ms-lease-id",
        xmlName: "x-ms-lease-id",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var BlobAcquireLeaseExceptionHeaders = {
  serializedName: "Blob_acquireLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobAcquireLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobReleaseLeaseHeaders = {
  serializedName: "Blob_releaseLeaseHeaders",
  type: {
    name: "Composite",
    className: "BlobReleaseLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var BlobReleaseLeaseExceptionHeaders = {
  serializedName: "Blob_releaseLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobReleaseLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobRenewLeaseHeaders = {
  serializedName: "Blob_renewLeaseHeaders",
  type: {
    name: "Composite",
    className: "BlobRenewLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseId: {
        serializedName: "x-ms-lease-id",
        xmlName: "x-ms-lease-id",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var BlobRenewLeaseExceptionHeaders = {
  serializedName: "Blob_renewLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobRenewLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobChangeLeaseHeaders = {
  serializedName: "Blob_changeLeaseHeaders",
  type: {
    name: "Composite",
    className: "BlobChangeLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      leaseId: {
        serializedName: "x-ms-lease-id",
        xmlName: "x-ms-lease-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var BlobChangeLeaseExceptionHeaders = {
  serializedName: "Blob_changeLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobChangeLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobBreakLeaseHeaders = {
  serializedName: "Blob_breakLeaseHeaders",
  type: {
    name: "Composite",
    className: "BlobBreakLeaseHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      leaseTime: {
        serializedName: "x-ms-lease-time",
        xmlName: "x-ms-lease-time",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};
var BlobBreakLeaseExceptionHeaders = {
  serializedName: "Blob_breakLeaseExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobBreakLeaseExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobCreateSnapshotHeaders = {
  serializedName: "Blob_createSnapshotHeaders",
  type: {
    name: "Composite",
    className: "BlobCreateSnapshotHeaders",
    modelProperties: {
      snapshot: {
        serializedName: "x-ms-snapshot",
        xmlName: "x-ms-snapshot",
        type: {
          name: "String"
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobCreateSnapshotExceptionHeaders = {
  serializedName: "Blob_createSnapshotExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobCreateSnapshotExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobStartCopyFromURLHeaders = {
  serializedName: "Blob_startCopyFromURLHeaders",
  type: {
    name: "Composite",
    className: "BlobStartCopyFromURLHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      copyId: {
        serializedName: "x-ms-copy-id",
        xmlName: "x-ms-copy-id",
        type: {
          name: "String"
        }
      },
      copyStatus: {
        serializedName: "x-ms-copy-status",
        xmlName: "x-ms-copy-status",
        type: {
          name: "Enum",
          allowedValues: ["pending", "success", "aborted", "failed"]
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobStartCopyFromURLExceptionHeaders = {
  serializedName: "Blob_startCopyFromURLExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobStartCopyFromURLExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobCopyFromURLHeaders = {
  serializedName: "Blob_copyFromURLHeaders",
  type: {
    name: "Composite",
    className: "BlobCopyFromURLHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      copyId: {
        serializedName: "x-ms-copy-id",
        xmlName: "x-ms-copy-id",
        type: {
          name: "String"
        }
      },
      copyStatus: {
        defaultValue: "success",
        isConstant: true,
        serializedName: "x-ms-copy-status",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobCopyFromURLExceptionHeaders = {
  serializedName: "Blob_copyFromURLExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobCopyFromURLExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobAbortCopyFromURLHeaders = {
  serializedName: "Blob_abortCopyFromURLHeaders",
  type: {
    name: "Composite",
    className: "BlobAbortCopyFromURLHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobAbortCopyFromURLExceptionHeaders = {
  serializedName: "Blob_abortCopyFromURLExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobAbortCopyFromURLExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetTierHeaders = {
  serializedName: "Blob_setTierHeaders",
  type: {
    name: "Composite",
    className: "BlobSetTierHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetTierExceptionHeaders = {
  serializedName: "Blob_setTierExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobSetTierExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobGetAccountInfoHeaders = {
  serializedName: "Blob_getAccountInfoHeaders",
  type: {
    name: "Composite",
    className: "BlobGetAccountInfoHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      skuName: {
        serializedName: "x-ms-sku-name",
        xmlName: "x-ms-sku-name",
        type: {
          name: "Enum",
          allowedValues: [
            "Standard_LRS",
            "Standard_GRS",
            "Standard_RAGRS",
            "Standard_ZRS",
            "Premium_LRS"
          ]
        }
      },
      accountKind: {
        serializedName: "x-ms-account-kind",
        xmlName: "x-ms-account-kind",
        type: {
          name: "Enum",
          allowedValues: [
            "Storage",
            "BlobStorage",
            "StorageV2",
            "FileStorage",
            "BlockBlobStorage"
          ]
        }
      },
      isHierarchicalNamespaceEnabled: {
        serializedName: "x-ms-is-hns-enabled",
        xmlName: "x-ms-is-hns-enabled",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var BlobGetAccountInfoExceptionHeaders = {
  serializedName: "Blob_getAccountInfoExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobGetAccountInfoExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobQueryHeaders = {
  serializedName: "Blob_queryHeaders",
  type: {
    name: "Composite",
    className: "BlobQueryHeaders",
    modelProperties: {
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      metadata: {
        serializedName: "x-ms-meta",
        headerCollectionPrefix: "x-ms-meta-",
        xmlName: "x-ms-meta",
        type: {
          name: "Dictionary",
          value: { type: { name: "String" } }
        }
      },
      contentLength: {
        serializedName: "content-length",
        xmlName: "content-length",
        type: {
          name: "Number"
        }
      },
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      contentRange: {
        serializedName: "content-range",
        xmlName: "content-range",
        type: {
          name: "String"
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      contentEncoding: {
        serializedName: "content-encoding",
        xmlName: "content-encoding",
        type: {
          name: "String"
        }
      },
      cacheControl: {
        serializedName: "cache-control",
        xmlName: "cache-control",
        type: {
          name: "String"
        }
      },
      contentDisposition: {
        serializedName: "content-disposition",
        xmlName: "content-disposition",
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        serializedName: "content-language",
        xmlName: "content-language",
        type: {
          name: "String"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      blobType: {
        serializedName: "x-ms-blob-type",
        xmlName: "x-ms-blob-type",
        type: {
          name: "Enum",
          allowedValues: ["BlockBlob", "PageBlob", "AppendBlob"]
        }
      },
      copyCompletionTime: {
        serializedName: "x-ms-copy-completion-time",
        xmlName: "x-ms-copy-completion-time",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      copyStatusDescription: {
        serializedName: "x-ms-copy-status-description",
        xmlName: "x-ms-copy-status-description",
        type: {
          name: "String"
        }
      },
      copyId: {
        serializedName: "x-ms-copy-id",
        xmlName: "x-ms-copy-id",
        type: {
          name: "String"
        }
      },
      copyProgress: {
        serializedName: "x-ms-copy-progress",
        xmlName: "x-ms-copy-progress",
        type: {
          name: "String"
        }
      },
      copySource: {
        serializedName: "x-ms-copy-source",
        xmlName: "x-ms-copy-source",
        type: {
          name: "String"
        }
      },
      copyStatus: {
        serializedName: "x-ms-copy-status",
        xmlName: "x-ms-copy-status",
        type: {
          name: "Enum",
          allowedValues: ["pending", "success", "aborted", "failed"]
        }
      },
      leaseDuration: {
        serializedName: "x-ms-lease-duration",
        xmlName: "x-ms-lease-duration",
        type: {
          name: "Enum",
          allowedValues: ["infinite", "fixed"]
        }
      },
      leaseState: {
        serializedName: "x-ms-lease-state",
        xmlName: "x-ms-lease-state",
        type: {
          name: "Enum",
          allowedValues: [
            "available",
            "leased",
            "expired",
            "breaking",
            "broken"
          ]
        }
      },
      leaseStatus: {
        serializedName: "x-ms-lease-status",
        xmlName: "x-ms-lease-status",
        type: {
          name: "Enum",
          allowedValues: ["locked", "unlocked"]
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      acceptRanges: {
        serializedName: "accept-ranges",
        xmlName: "accept-ranges",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobCommittedBlockCount: {
        serializedName: "x-ms-blob-committed-block-count",
        xmlName: "x-ms-blob-committed-block-count",
        type: {
          name: "Number"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-server-encrypted",
        xmlName: "x-ms-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      blobContentMD5: {
        serializedName: "x-ms-blob-content-md5",
        xmlName: "x-ms-blob-content-md5",
        type: {
          name: "ByteArray"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      },
      contentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      }
    }
  }
};
var BlobQueryExceptionHeaders = {
  serializedName: "Blob_queryExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobQueryExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobGetTagsHeaders = {
  serializedName: "Blob_getTagsHeaders",
  type: {
    name: "Composite",
    className: "BlobGetTagsHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobGetTagsExceptionHeaders = {
  serializedName: "Blob_getTagsExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobGetTagsExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetTagsHeaders = {
  serializedName: "Blob_setTagsHeaders",
  type: {
    name: "Composite",
    className: "BlobSetTagsHeaders",
    modelProperties: {
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlobSetTagsExceptionHeaders = {
  serializedName: "Blob_setTagsExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlobSetTagsExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobCreateHeaders = {
  serializedName: "PageBlob_createHeaders",
  type: {
    name: "Composite",
    className: "PageBlobCreateHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobCreateExceptionHeaders = {
  serializedName: "PageBlob_createExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobCreateExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobUploadPagesHeaders = {
  serializedName: "PageBlob_uploadPagesHeaders",
  type: {
    name: "Composite",
    className: "PageBlobUploadPagesHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobUploadPagesExceptionHeaders = {
  serializedName: "PageBlob_uploadPagesExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobUploadPagesExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobClearPagesHeaders = {
  serializedName: "PageBlob_clearPagesHeaders",
  type: {
    name: "Composite",
    className: "PageBlobClearPagesHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobClearPagesExceptionHeaders = {
  serializedName: "PageBlob_clearPagesExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobClearPagesExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobUploadPagesFromURLHeaders = {
  serializedName: "PageBlob_uploadPagesFromURLHeaders",
  type: {
    name: "Composite",
    className: "PageBlobUploadPagesFromURLHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobUploadPagesFromURLExceptionHeaders = {
  serializedName: "PageBlob_uploadPagesFromURLExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobUploadPagesFromURLExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobGetPageRangesHeaders = {
  serializedName: "PageBlob_getPageRangesHeaders",
  type: {
    name: "Composite",
    className: "PageBlobGetPageRangesHeaders",
    modelProperties: {
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      blobContentLength: {
        serializedName: "x-ms-blob-content-length",
        xmlName: "x-ms-blob-content-length",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobGetPageRangesExceptionHeaders = {
  serializedName: "PageBlob_getPageRangesExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobGetPageRangesExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobGetPageRangesDiffHeaders = {
  serializedName: "PageBlob_getPageRangesDiffHeaders",
  type: {
    name: "Composite",
    className: "PageBlobGetPageRangesDiffHeaders",
    modelProperties: {
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      blobContentLength: {
        serializedName: "x-ms-blob-content-length",
        xmlName: "x-ms-blob-content-length",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobGetPageRangesDiffExceptionHeaders = {
  serializedName: "PageBlob_getPageRangesDiffExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobGetPageRangesDiffExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobResizeHeaders = {
  serializedName: "PageBlob_resizeHeaders",
  type: {
    name: "Composite",
    className: "PageBlobResizeHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobResizeExceptionHeaders = {
  serializedName: "PageBlob_resizeExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobResizeExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobUpdateSequenceNumberHeaders = {
  serializedName: "PageBlob_updateSequenceNumberHeaders",
  type: {
    name: "Composite",
    className: "PageBlobUpdateSequenceNumberHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobSequenceNumber: {
        serializedName: "x-ms-blob-sequence-number",
        xmlName: "x-ms-blob-sequence-number",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobUpdateSequenceNumberExceptionHeaders = {
  serializedName: "PageBlob_updateSequenceNumberExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobUpdateSequenceNumberExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobCopyIncrementalHeaders = {
  serializedName: "PageBlob_copyIncrementalHeaders",
  type: {
    name: "Composite",
    className: "PageBlobCopyIncrementalHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      copyId: {
        serializedName: "x-ms-copy-id",
        xmlName: "x-ms-copy-id",
        type: {
          name: "String"
        }
      },
      copyStatus: {
        serializedName: "x-ms-copy-status",
        xmlName: "x-ms-copy-status",
        type: {
          name: "Enum",
          allowedValues: ["pending", "success", "aborted", "failed"]
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var PageBlobCopyIncrementalExceptionHeaders = {
  serializedName: "PageBlob_copyIncrementalExceptionHeaders",
  type: {
    name: "Composite",
    className: "PageBlobCopyIncrementalExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var AppendBlobCreateHeaders = {
  serializedName: "AppendBlob_createHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobCreateHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var AppendBlobCreateExceptionHeaders = {
  serializedName: "AppendBlob_createExceptionHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobCreateExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var AppendBlobAppendBlockHeaders = {
  serializedName: "AppendBlob_appendBlockHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobAppendBlockHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobAppendOffset: {
        serializedName: "x-ms-blob-append-offset",
        xmlName: "x-ms-blob-append-offset",
        type: {
          name: "String"
        }
      },
      blobCommittedBlockCount: {
        serializedName: "x-ms-blob-committed-block-count",
        xmlName: "x-ms-blob-committed-block-count",
        type: {
          name: "Number"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var AppendBlobAppendBlockExceptionHeaders = {
  serializedName: "AppendBlob_appendBlockExceptionHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobAppendBlockExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var AppendBlobAppendBlockFromUrlHeaders = {
  serializedName: "AppendBlob_appendBlockFromUrlHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobAppendBlockFromUrlHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      blobAppendOffset: {
        serializedName: "x-ms-blob-append-offset",
        xmlName: "x-ms-blob-append-offset",
        type: {
          name: "String"
        }
      },
      blobCommittedBlockCount: {
        serializedName: "x-ms-blob-committed-block-count",
        xmlName: "x-ms-blob-committed-block-count",
        type: {
          name: "Number"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var AppendBlobAppendBlockFromUrlExceptionHeaders = {
  serializedName: "AppendBlob_appendBlockFromUrlExceptionHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobAppendBlockFromUrlExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var AppendBlobSealHeaders = {
  serializedName: "AppendBlob_sealHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobSealHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isSealed: {
        serializedName: "x-ms-blob-sealed",
        xmlName: "x-ms-blob-sealed",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};
var AppendBlobSealExceptionHeaders = {
  serializedName: "AppendBlob_sealExceptionHeaders",
  type: {
    name: "Composite",
    className: "AppendBlobSealExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobUploadHeaders = {
  serializedName: "BlockBlob_uploadHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobUploadHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobUploadExceptionHeaders = {
  serializedName: "BlockBlob_uploadExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobUploadExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobPutBlobFromUrlHeaders = {
  serializedName: "BlockBlob_putBlobFromUrlHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobPutBlobFromUrlHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobPutBlobFromUrlExceptionHeaders = {
  serializedName: "BlockBlob_putBlobFromUrlExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobPutBlobFromUrlExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobStageBlockHeaders = {
  serializedName: "BlockBlob_stageBlockHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobStageBlockHeaders",
    modelProperties: {
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobStageBlockExceptionHeaders = {
  serializedName: "BlockBlob_stageBlockExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobStageBlockExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobStageBlockFromURLHeaders = {
  serializedName: "BlockBlob_stageBlockFromURLHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobStageBlockFromURLHeaders",
    modelProperties: {
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobStageBlockFromURLExceptionHeaders = {
  serializedName: "BlockBlob_stageBlockFromURLExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobStageBlockFromURLExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobCommitBlockListHeaders = {
  serializedName: "BlockBlob_commitBlockListHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobCommitBlockListHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        xmlName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        xmlName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      versionId: {
        serializedName: "x-ms-version-id",
        xmlName: "x-ms-version-id",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        xmlName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      },
      encryptionKeySha256: {
        serializedName: "x-ms-encryption-key-sha256",
        xmlName: "x-ms-encryption-key-sha256",
        type: {
          name: "String"
        }
      },
      encryptionScope: {
        serializedName: "x-ms-encryption-scope",
        xmlName: "x-ms-encryption-scope",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobCommitBlockListExceptionHeaders = {
  serializedName: "BlockBlob_commitBlockListExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobCommitBlockListExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobGetBlockListHeaders = {
  serializedName: "BlockBlob_getBlockListHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobGetBlockListHeaders",
    modelProperties: {
      lastModified: {
        serializedName: "last-modified",
        xmlName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        xmlName: "etag",
        type: {
          name: "String"
        }
      },
      contentType: {
        serializedName: "content-type",
        xmlName: "content-type",
        type: {
          name: "String"
        }
      },
      blobContentLength: {
        serializedName: "x-ms-blob-content-length",
        xmlName: "x-ms-blob-content-length",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        xmlName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        xmlName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        xmlName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        xmlName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
var BlockBlobGetBlockListExceptionHeaders = {
  serializedName: "BlockBlob_getBlockListExceptionHeaders",
  type: {
    name: "Composite",
    className: "BlockBlobGetBlockListExceptionHeaders",
    modelProperties: {
      errorCode: {
        serializedName: "x-ms-error-code",
        xmlName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/models/parameters.js
var contentType = {
  parameterPath: ["options", "contentType"],
  mapper: {
    defaultValue: "application/xml",
    isConstant: true,
    serializedName: "Content-Type",
    type: {
      name: "String"
    }
  }
};
var blobServiceProperties = {
  parameterPath: "blobServiceProperties",
  mapper: BlobServiceProperties
};
var accept = {
  parameterPath: "accept",
  mapper: {
    defaultValue: "application/xml",
    isConstant: true,
    serializedName: "Accept",
    type: {
      name: "String"
    }
  }
};
var url = {
  parameterPath: "url",
  mapper: {
    serializedName: "url",
    required: true,
    xmlName: "url",
    type: {
      name: "String"
    }
  },
  skipEncoding: true
};
var restype = {
  parameterPath: "restype",
  mapper: {
    defaultValue: "service",
    isConstant: true,
    serializedName: "restype",
    type: {
      name: "String"
    }
  }
};
var comp = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "properties",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var timeoutInSeconds = {
  parameterPath: ["options", "timeoutInSeconds"],
  mapper: {
    constraints: {
      InclusiveMinimum: 0
    },
    serializedName: "timeout",
    xmlName: "timeout",
    type: {
      name: "Number"
    }
  }
};
var version = {
  parameterPath: "version",
  mapper: {
    defaultValue: "2025-01-05",
    isConstant: true,
    serializedName: "x-ms-version",
    type: {
      name: "String"
    }
  }
};
var requestId = {
  parameterPath: ["options", "requestId"],
  mapper: {
    serializedName: "x-ms-client-request-id",
    xmlName: "x-ms-client-request-id",
    type: {
      name: "String"
    }
  }
};
var accept1 = {
  parameterPath: "accept",
  mapper: {
    defaultValue: "application/xml",
    isConstant: true,
    serializedName: "Accept",
    type: {
      name: "String"
    }
  }
};
var comp1 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "stats",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var comp2 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "list",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var prefix = {
  parameterPath: ["options", "prefix"],
  mapper: {
    serializedName: "prefix",
    xmlName: "prefix",
    type: {
      name: "String"
    }
  }
};
var marker = {
  parameterPath: ["options", "marker"],
  mapper: {
    serializedName: "marker",
    xmlName: "marker",
    type: {
      name: "String"
    }
  }
};
var maxPageSize = {
  parameterPath: ["options", "maxPageSize"],
  mapper: {
    constraints: {
      InclusiveMinimum: 1
    },
    serializedName: "maxresults",
    xmlName: "maxresults",
    type: {
      name: "Number"
    }
  }
};
var include = {
  parameterPath: ["options", "include"],
  mapper: {
    serializedName: "include",
    xmlName: "include",
    xmlElementName: "ListContainersIncludeType",
    type: {
      name: "Sequence",
      element: {
        type: {
          name: "Enum",
          allowedValues: ["metadata", "deleted", "system"]
        }
      }
    }
  },
  collectionFormat: "CSV"
};
var keyInfo = {
  parameterPath: "keyInfo",
  mapper: KeyInfo
};
var comp3 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "userdelegationkey",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var restype1 = {
  parameterPath: "restype",
  mapper: {
    defaultValue: "account",
    isConstant: true,
    serializedName: "restype",
    type: {
      name: "String"
    }
  }
};
var body = {
  parameterPath: "body",
  mapper: {
    serializedName: "body",
    required: true,
    xmlName: "body",
    type: {
      name: "Stream"
    }
  }
};
var comp4 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "batch",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var contentLength = {
  parameterPath: "contentLength",
  mapper: {
    serializedName: "Content-Length",
    required: true,
    xmlName: "Content-Length",
    type: {
      name: "Number"
    }
  }
};
var multipartContentType = {
  parameterPath: "multipartContentType",
  mapper: {
    serializedName: "Content-Type",
    required: true,
    xmlName: "Content-Type",
    type: {
      name: "String"
    }
  }
};
var comp5 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "blobs",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var where = {
  parameterPath: ["options", "where"],
  mapper: {
    serializedName: "where",
    xmlName: "where",
    type: {
      name: "String"
    }
  }
};
var restype2 = {
  parameterPath: "restype",
  mapper: {
    defaultValue: "container",
    isConstant: true,
    serializedName: "restype",
    type: {
      name: "String"
    }
  }
};
var metadata = {
  parameterPath: ["options", "metadata"],
  mapper: {
    serializedName: "x-ms-meta",
    xmlName: "x-ms-meta",
    headerCollectionPrefix: "x-ms-meta-",
    type: {
      name: "Dictionary",
      value: { type: { name: "String" } }
    }
  }
};
var access = {
  parameterPath: ["options", "access"],
  mapper: {
    serializedName: "x-ms-blob-public-access",
    xmlName: "x-ms-blob-public-access",
    type: {
      name: "Enum",
      allowedValues: ["container", "blob"]
    }
  }
};
var defaultEncryptionScope = {
  parameterPath: [
    "options",
    "containerEncryptionScope",
    "defaultEncryptionScope"
  ],
  mapper: {
    serializedName: "x-ms-default-encryption-scope",
    xmlName: "x-ms-default-encryption-scope",
    type: {
      name: "String"
    }
  }
};
var preventEncryptionScopeOverride = {
  parameterPath: [
    "options",
    "containerEncryptionScope",
    "preventEncryptionScopeOverride"
  ],
  mapper: {
    serializedName: "x-ms-deny-encryption-scope-override",
    xmlName: "x-ms-deny-encryption-scope-override",
    type: {
      name: "Boolean"
    }
  }
};
var leaseId = {
  parameterPath: ["options", "leaseAccessConditions", "leaseId"],
  mapper: {
    serializedName: "x-ms-lease-id",
    xmlName: "x-ms-lease-id",
    type: {
      name: "String"
    }
  }
};
var ifModifiedSince = {
  parameterPath: ["options", "modifiedAccessConditions", "ifModifiedSince"],
  mapper: {
    serializedName: "If-Modified-Since",
    xmlName: "If-Modified-Since",
    type: {
      name: "DateTimeRfc1123"
    }
  }
};
var ifUnmodifiedSince = {
  parameterPath: ["options", "modifiedAccessConditions", "ifUnmodifiedSince"],
  mapper: {
    serializedName: "If-Unmodified-Since",
    xmlName: "If-Unmodified-Since",
    type: {
      name: "DateTimeRfc1123"
    }
  }
};
var comp6 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "metadata",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var comp7 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "acl",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var containerAcl = {
  parameterPath: ["options", "containerAcl"],
  mapper: {
    serializedName: "containerAcl",
    xmlName: "SignedIdentifiers",
    xmlIsWrapped: true,
    xmlElementName: "SignedIdentifier",
    type: {
      name: "Sequence",
      element: {
        type: {
          name: "Composite",
          className: "SignedIdentifier"
        }
      }
    }
  }
};
var comp8 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "undelete",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var deletedContainerName = {
  parameterPath: ["options", "deletedContainerName"],
  mapper: {
    serializedName: "x-ms-deleted-container-name",
    xmlName: "x-ms-deleted-container-name",
    type: {
      name: "String"
    }
  }
};
var deletedContainerVersion = {
  parameterPath: ["options", "deletedContainerVersion"],
  mapper: {
    serializedName: "x-ms-deleted-container-version",
    xmlName: "x-ms-deleted-container-version",
    type: {
      name: "String"
    }
  }
};
var comp9 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "rename",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var sourceContainerName = {
  parameterPath: "sourceContainerName",
  mapper: {
    serializedName: "x-ms-source-container-name",
    required: true,
    xmlName: "x-ms-source-container-name",
    type: {
      name: "String"
    }
  }
};
var sourceLeaseId = {
  parameterPath: ["options", "sourceLeaseId"],
  mapper: {
    serializedName: "x-ms-source-lease-id",
    xmlName: "x-ms-source-lease-id",
    type: {
      name: "String"
    }
  }
};
var comp10 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "lease",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var action = {
  parameterPath: "action",
  mapper: {
    defaultValue: "acquire",
    isConstant: true,
    serializedName: "x-ms-lease-action",
    type: {
      name: "String"
    }
  }
};
var duration = {
  parameterPath: ["options", "duration"],
  mapper: {
    serializedName: "x-ms-lease-duration",
    xmlName: "x-ms-lease-duration",
    type: {
      name: "Number"
    }
  }
};
var proposedLeaseId = {
  parameterPath: ["options", "proposedLeaseId"],
  mapper: {
    serializedName: "x-ms-proposed-lease-id",
    xmlName: "x-ms-proposed-lease-id",
    type: {
      name: "String"
    }
  }
};
var action1 = {
  parameterPath: "action",
  mapper: {
    defaultValue: "release",
    isConstant: true,
    serializedName: "x-ms-lease-action",
    type: {
      name: "String"
    }
  }
};
var leaseId1 = {
  parameterPath: "leaseId",
  mapper: {
    serializedName: "x-ms-lease-id",
    required: true,
    xmlName: "x-ms-lease-id",
    type: {
      name: "String"
    }
  }
};
var action2 = {
  parameterPath: "action",
  mapper: {
    defaultValue: "renew",
    isConstant: true,
    serializedName: "x-ms-lease-action",
    type: {
      name: "String"
    }
  }
};
var action3 = {
  parameterPath: "action",
  mapper: {
    defaultValue: "break",
    isConstant: true,
    serializedName: "x-ms-lease-action",
    type: {
      name: "String"
    }
  }
};
var breakPeriod = {
  parameterPath: ["options", "breakPeriod"],
  mapper: {
    serializedName: "x-ms-lease-break-period",
    xmlName: "x-ms-lease-break-period",
    type: {
      name: "Number"
    }
  }
};
var action4 = {
  parameterPath: "action",
  mapper: {
    defaultValue: "change",
    isConstant: true,
    serializedName: "x-ms-lease-action",
    type: {
      name: "String"
    }
  }
};
var proposedLeaseId1 = {
  parameterPath: "proposedLeaseId",
  mapper: {
    serializedName: "x-ms-proposed-lease-id",
    required: true,
    xmlName: "x-ms-proposed-lease-id",
    type: {
      name: "String"
    }
  }
};
var include1 = {
  parameterPath: ["options", "include"],
  mapper: {
    serializedName: "include",
    xmlName: "include",
    xmlElementName: "ListBlobsIncludeItem",
    type: {
      name: "Sequence",
      element: {
        type: {
          name: "Enum",
          allowedValues: [
            "copy",
            "deleted",
            "metadata",
            "snapshots",
            "uncommittedblobs",
            "versions",
            "tags",
            "immutabilitypolicy",
            "legalhold",
            "deletedwithversions"
          ]
        }
      }
    }
  },
  collectionFormat: "CSV"
};
var delimiter = {
  parameterPath: "delimiter",
  mapper: {
    serializedName: "delimiter",
    required: true,
    xmlName: "delimiter",
    type: {
      name: "String"
    }
  }
};
var snapshot = {
  parameterPath: ["options", "snapshot"],
  mapper: {
    serializedName: "snapshot",
    xmlName: "snapshot",
    type: {
      name: "String"
    }
  }
};
var versionId = {
  parameterPath: ["options", "versionId"],
  mapper: {
    serializedName: "versionid",
    xmlName: "versionid",
    type: {
      name: "String"
    }
  }
};
var range = {
  parameterPath: ["options", "range"],
  mapper: {
    serializedName: "x-ms-range",
    xmlName: "x-ms-range",
    type: {
      name: "String"
    }
  }
};
var rangeGetContentMD5 = {
  parameterPath: ["options", "rangeGetContentMD5"],
  mapper: {
    serializedName: "x-ms-range-get-content-md5",
    xmlName: "x-ms-range-get-content-md5",
    type: {
      name: "Boolean"
    }
  }
};
var rangeGetContentCRC64 = {
  parameterPath: ["options", "rangeGetContentCRC64"],
  mapper: {
    serializedName: "x-ms-range-get-content-crc64",
    xmlName: "x-ms-range-get-content-crc64",
    type: {
      name: "Boolean"
    }
  }
};
var encryptionKey = {
  parameterPath: ["options", "cpkInfo", "encryptionKey"],
  mapper: {
    serializedName: "x-ms-encryption-key",
    xmlName: "x-ms-encryption-key",
    type: {
      name: "String"
    }
  }
};
var encryptionKeySha256 = {
  parameterPath: ["options", "cpkInfo", "encryptionKeySha256"],
  mapper: {
    serializedName: "x-ms-encryption-key-sha256",
    xmlName: "x-ms-encryption-key-sha256",
    type: {
      name: "String"
    }
  }
};
var encryptionAlgorithm = {
  parameterPath: ["options", "cpkInfo", "encryptionAlgorithm"],
  mapper: {
    serializedName: "x-ms-encryption-algorithm",
    xmlName: "x-ms-encryption-algorithm",
    type: {
      name: "String"
    }
  }
};
var ifMatch = {
  parameterPath: ["options", "modifiedAccessConditions", "ifMatch"],
  mapper: {
    serializedName: "If-Match",
    xmlName: "If-Match",
    type: {
      name: "String"
    }
  }
};
var ifNoneMatch = {
  parameterPath: ["options", "modifiedAccessConditions", "ifNoneMatch"],
  mapper: {
    serializedName: "If-None-Match",
    xmlName: "If-None-Match",
    type: {
      name: "String"
    }
  }
};
var ifTags = {
  parameterPath: ["options", "modifiedAccessConditions", "ifTags"],
  mapper: {
    serializedName: "x-ms-if-tags",
    xmlName: "x-ms-if-tags",
    type: {
      name: "String"
    }
  }
};
var deleteSnapshots = {
  parameterPath: ["options", "deleteSnapshots"],
  mapper: {
    serializedName: "x-ms-delete-snapshots",
    xmlName: "x-ms-delete-snapshots",
    type: {
      name: "Enum",
      allowedValues: ["include", "only"]
    }
  }
};
var blobDeleteType = {
  parameterPath: ["options", "blobDeleteType"],
  mapper: {
    serializedName: "deletetype",
    xmlName: "deletetype",
    type: {
      name: "String"
    }
  }
};
var comp11 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "expiry",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var expiryOptions = {
  parameterPath: "expiryOptions",
  mapper: {
    serializedName: "x-ms-expiry-option",
    required: true,
    xmlName: "x-ms-expiry-option",
    type: {
      name: "String"
    }
  }
};
var expiresOn = {
  parameterPath: ["options", "expiresOn"],
  mapper: {
    serializedName: "x-ms-expiry-time",
    xmlName: "x-ms-expiry-time",
    type: {
      name: "String"
    }
  }
};
var blobCacheControl = {
  parameterPath: ["options", "blobHttpHeaders", "blobCacheControl"],
  mapper: {
    serializedName: "x-ms-blob-cache-control",
    xmlName: "x-ms-blob-cache-control",
    type: {
      name: "String"
    }
  }
};
var blobContentType = {
  parameterPath: ["options", "blobHttpHeaders", "blobContentType"],
  mapper: {
    serializedName: "x-ms-blob-content-type",
    xmlName: "x-ms-blob-content-type",
    type: {
      name: "String"
    }
  }
};
var blobContentMD5 = {
  parameterPath: ["options", "blobHttpHeaders", "blobContentMD5"],
  mapper: {
    serializedName: "x-ms-blob-content-md5",
    xmlName: "x-ms-blob-content-md5",
    type: {
      name: "ByteArray"
    }
  }
};
var blobContentEncoding = {
  parameterPath: ["options", "blobHttpHeaders", "blobContentEncoding"],
  mapper: {
    serializedName: "x-ms-blob-content-encoding",
    xmlName: "x-ms-blob-content-encoding",
    type: {
      name: "String"
    }
  }
};
var blobContentLanguage = {
  parameterPath: ["options", "blobHttpHeaders", "blobContentLanguage"],
  mapper: {
    serializedName: "x-ms-blob-content-language",
    xmlName: "x-ms-blob-content-language",
    type: {
      name: "String"
    }
  }
};
var blobContentDisposition = {
  parameterPath: ["options", "blobHttpHeaders", "blobContentDisposition"],
  mapper: {
    serializedName: "x-ms-blob-content-disposition",
    xmlName: "x-ms-blob-content-disposition",
    type: {
      name: "String"
    }
  }
};
var comp12 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "immutabilityPolicies",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var immutabilityPolicyExpiry = {
  parameterPath: ["options", "immutabilityPolicyExpiry"],
  mapper: {
    serializedName: "x-ms-immutability-policy-until-date",
    xmlName: "x-ms-immutability-policy-until-date",
    type: {
      name: "DateTimeRfc1123"
    }
  }
};
var immutabilityPolicyMode = {
  parameterPath: ["options", "immutabilityPolicyMode"],
  mapper: {
    serializedName: "x-ms-immutability-policy-mode",
    xmlName: "x-ms-immutability-policy-mode",
    type: {
      name: "Enum",
      allowedValues: ["Mutable", "Unlocked", "Locked"]
    }
  }
};
var comp13 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "legalhold",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var legalHold = {
  parameterPath: "legalHold",
  mapper: {
    serializedName: "x-ms-legal-hold",
    required: true,
    xmlName: "x-ms-legal-hold",
    type: {
      name: "Boolean"
    }
  }
};
var encryptionScope = {
  parameterPath: ["options", "encryptionScope"],
  mapper: {
    serializedName: "x-ms-encryption-scope",
    xmlName: "x-ms-encryption-scope",
    type: {
      name: "String"
    }
  }
};
var comp14 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "snapshot",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var tier = {
  parameterPath: ["options", "tier"],
  mapper: {
    serializedName: "x-ms-access-tier",
    xmlName: "x-ms-access-tier",
    type: {
      name: "Enum",
      allowedValues: [
        "P4",
        "P6",
        "P10",
        "P15",
        "P20",
        "P30",
        "P40",
        "P50",
        "P60",
        "P70",
        "P80",
        "Hot",
        "Cool",
        "Archive",
        "Cold"
      ]
    }
  }
};
var rehydratePriority = {
  parameterPath: ["options", "rehydratePriority"],
  mapper: {
    serializedName: "x-ms-rehydrate-priority",
    xmlName: "x-ms-rehydrate-priority",
    type: {
      name: "Enum",
      allowedValues: ["High", "Standard"]
    }
  }
};
var sourceIfModifiedSince = {
  parameterPath: [
    "options",
    "sourceModifiedAccessConditions",
    "sourceIfModifiedSince"
  ],
  mapper: {
    serializedName: "x-ms-source-if-modified-since",
    xmlName: "x-ms-source-if-modified-since",
    type: {
      name: "DateTimeRfc1123"
    }
  }
};
var sourceIfUnmodifiedSince = {
  parameterPath: [
    "options",
    "sourceModifiedAccessConditions",
    "sourceIfUnmodifiedSince"
  ],
  mapper: {
    serializedName: "x-ms-source-if-unmodified-since",
    xmlName: "x-ms-source-if-unmodified-since",
    type: {
      name: "DateTimeRfc1123"
    }
  }
};
var sourceIfMatch = {
  parameterPath: ["options", "sourceModifiedAccessConditions", "sourceIfMatch"],
  mapper: {
    serializedName: "x-ms-source-if-match",
    xmlName: "x-ms-source-if-match",
    type: {
      name: "String"
    }
  }
};
var sourceIfNoneMatch = {
  parameterPath: [
    "options",
    "sourceModifiedAccessConditions",
    "sourceIfNoneMatch"
  ],
  mapper: {
    serializedName: "x-ms-source-if-none-match",
    xmlName: "x-ms-source-if-none-match",
    type: {
      name: "String"
    }
  }
};
var sourceIfTags = {
  parameterPath: ["options", "sourceModifiedAccessConditions", "sourceIfTags"],
  mapper: {
    serializedName: "x-ms-source-if-tags",
    xmlName: "x-ms-source-if-tags",
    type: {
      name: "String"
    }
  }
};
var copySource = {
  parameterPath: "copySource",
  mapper: {
    serializedName: "x-ms-copy-source",
    required: true,
    xmlName: "x-ms-copy-source",
    type: {
      name: "String"
    }
  }
};
var blobTagsString = {
  parameterPath: ["options", "blobTagsString"],
  mapper: {
    serializedName: "x-ms-tags",
    xmlName: "x-ms-tags",
    type: {
      name: "String"
    }
  }
};
var sealBlob = {
  parameterPath: ["options", "sealBlob"],
  mapper: {
    serializedName: "x-ms-seal-blob",
    xmlName: "x-ms-seal-blob",
    type: {
      name: "Boolean"
    }
  }
};
var legalHold1 = {
  parameterPath: ["options", "legalHold"],
  mapper: {
    serializedName: "x-ms-legal-hold",
    xmlName: "x-ms-legal-hold",
    type: {
      name: "Boolean"
    }
  }
};
var xMsRequiresSync = {
  parameterPath: "xMsRequiresSync",
  mapper: {
    defaultValue: "true",
    isConstant: true,
    serializedName: "x-ms-requires-sync",
    type: {
      name: "String"
    }
  }
};
var sourceContentMD5 = {
  parameterPath: ["options", "sourceContentMD5"],
  mapper: {
    serializedName: "x-ms-source-content-md5",
    xmlName: "x-ms-source-content-md5",
    type: {
      name: "ByteArray"
    }
  }
};
var copySourceAuthorization = {
  parameterPath: ["options", "copySourceAuthorization"],
  mapper: {
    serializedName: "x-ms-copy-source-authorization",
    xmlName: "x-ms-copy-source-authorization",
    type: {
      name: "String"
    }
  }
};
var copySourceTags = {
  parameterPath: ["options", "copySourceTags"],
  mapper: {
    serializedName: "x-ms-copy-source-tag-option",
    xmlName: "x-ms-copy-source-tag-option",
    type: {
      name: "Enum",
      allowedValues: ["REPLACE", "COPY"]
    }
  }
};
var comp15 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "copy",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var copyActionAbortConstant = {
  parameterPath: "copyActionAbortConstant",
  mapper: {
    defaultValue: "abort",
    isConstant: true,
    serializedName: "x-ms-copy-action",
    type: {
      name: "String"
    }
  }
};
var copyId = {
  parameterPath: "copyId",
  mapper: {
    serializedName: "copyid",
    required: true,
    xmlName: "copyid",
    type: {
      name: "String"
    }
  }
};
var comp16 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "tier",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var tier1 = {
  parameterPath: "tier",
  mapper: {
    serializedName: "x-ms-access-tier",
    required: true,
    xmlName: "x-ms-access-tier",
    type: {
      name: "Enum",
      allowedValues: [
        "P4",
        "P6",
        "P10",
        "P15",
        "P20",
        "P30",
        "P40",
        "P50",
        "P60",
        "P70",
        "P80",
        "Hot",
        "Cool",
        "Archive",
        "Cold"
      ]
    }
  }
};
var queryRequest = {
  parameterPath: ["options", "queryRequest"],
  mapper: QueryRequest
};
var comp17 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "query",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var comp18 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "tags",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var tags = {
  parameterPath: ["options", "tags"],
  mapper: BlobTags
};
var transactionalContentMD5 = {
  parameterPath: ["options", "transactionalContentMD5"],
  mapper: {
    serializedName: "Content-MD5",
    xmlName: "Content-MD5",
    type: {
      name: "ByteArray"
    }
  }
};
var transactionalContentCrc64 = {
  parameterPath: ["options", "transactionalContentCrc64"],
  mapper: {
    serializedName: "x-ms-content-crc64",
    xmlName: "x-ms-content-crc64",
    type: {
      name: "ByteArray"
    }
  }
};
var blobType = {
  parameterPath: "blobType",
  mapper: {
    defaultValue: "PageBlob",
    isConstant: true,
    serializedName: "x-ms-blob-type",
    type: {
      name: "String"
    }
  }
};
var blobContentLength = {
  parameterPath: "blobContentLength",
  mapper: {
    serializedName: "x-ms-blob-content-length",
    required: true,
    xmlName: "x-ms-blob-content-length",
    type: {
      name: "Number"
    }
  }
};
var blobSequenceNumber = {
  parameterPath: ["options", "blobSequenceNumber"],
  mapper: {
    defaultValue: 0,
    serializedName: "x-ms-blob-sequence-number",
    xmlName: "x-ms-blob-sequence-number",
    type: {
      name: "Number"
    }
  }
};
var contentType1 = {
  parameterPath: ["options", "contentType"],
  mapper: {
    defaultValue: "application/octet-stream",
    isConstant: true,
    serializedName: "Content-Type",
    type: {
      name: "String"
    }
  }
};
var body1 = {
  parameterPath: "body",
  mapper: {
    serializedName: "body",
    required: true,
    xmlName: "body",
    type: {
      name: "Stream"
    }
  }
};
var accept2 = {
  parameterPath: "accept",
  mapper: {
    defaultValue: "application/xml",
    isConstant: true,
    serializedName: "Accept",
    type: {
      name: "String"
    }
  }
};
var comp19 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "page",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var pageWrite = {
  parameterPath: "pageWrite",
  mapper: {
    defaultValue: "update",
    isConstant: true,
    serializedName: "x-ms-page-write",
    type: {
      name: "String"
    }
  }
};
var ifSequenceNumberLessThanOrEqualTo = {
  parameterPath: [
    "options",
    "sequenceNumberAccessConditions",
    "ifSequenceNumberLessThanOrEqualTo"
  ],
  mapper: {
    serializedName: "x-ms-if-sequence-number-le",
    xmlName: "x-ms-if-sequence-number-le",
    type: {
      name: "Number"
    }
  }
};
var ifSequenceNumberLessThan = {
  parameterPath: [
    "options",
    "sequenceNumberAccessConditions",
    "ifSequenceNumberLessThan"
  ],
  mapper: {
    serializedName: "x-ms-if-sequence-number-lt",
    xmlName: "x-ms-if-sequence-number-lt",
    type: {
      name: "Number"
    }
  }
};
var ifSequenceNumberEqualTo = {
  parameterPath: [
    "options",
    "sequenceNumberAccessConditions",
    "ifSequenceNumberEqualTo"
  ],
  mapper: {
    serializedName: "x-ms-if-sequence-number-eq",
    xmlName: "x-ms-if-sequence-number-eq",
    type: {
      name: "Number"
    }
  }
};
var pageWrite1 = {
  parameterPath: "pageWrite",
  mapper: {
    defaultValue: "clear",
    isConstant: true,
    serializedName: "x-ms-page-write",
    type: {
      name: "String"
    }
  }
};
var sourceUrl = {
  parameterPath: "sourceUrl",
  mapper: {
    serializedName: "x-ms-copy-source",
    required: true,
    xmlName: "x-ms-copy-source",
    type: {
      name: "String"
    }
  }
};
var sourceRange = {
  parameterPath: "sourceRange",
  mapper: {
    serializedName: "x-ms-source-range",
    required: true,
    xmlName: "x-ms-source-range",
    type: {
      name: "String"
    }
  }
};
var sourceContentCrc64 = {
  parameterPath: ["options", "sourceContentCrc64"],
  mapper: {
    serializedName: "x-ms-source-content-crc64",
    xmlName: "x-ms-source-content-crc64",
    type: {
      name: "ByteArray"
    }
  }
};
var range1 = {
  parameterPath: "range",
  mapper: {
    serializedName: "x-ms-range",
    required: true,
    xmlName: "x-ms-range",
    type: {
      name: "String"
    }
  }
};
var comp20 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "pagelist",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var prevsnapshot = {
  parameterPath: ["options", "prevsnapshot"],
  mapper: {
    serializedName: "prevsnapshot",
    xmlName: "prevsnapshot",
    type: {
      name: "String"
    }
  }
};
var prevSnapshotUrl = {
  parameterPath: ["options", "prevSnapshotUrl"],
  mapper: {
    serializedName: "x-ms-previous-snapshot-url",
    xmlName: "x-ms-previous-snapshot-url",
    type: {
      name: "String"
    }
  }
};
var sequenceNumberAction = {
  parameterPath: "sequenceNumberAction",
  mapper: {
    serializedName: "x-ms-sequence-number-action",
    required: true,
    xmlName: "x-ms-sequence-number-action",
    type: {
      name: "Enum",
      allowedValues: ["max", "update", "increment"]
    }
  }
};
var comp21 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "incrementalcopy",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var blobType1 = {
  parameterPath: "blobType",
  mapper: {
    defaultValue: "AppendBlob",
    isConstant: true,
    serializedName: "x-ms-blob-type",
    type: {
      name: "String"
    }
  }
};
var comp22 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "appendblock",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var maxSize = {
  parameterPath: ["options", "appendPositionAccessConditions", "maxSize"],
  mapper: {
    serializedName: "x-ms-blob-condition-maxsize",
    xmlName: "x-ms-blob-condition-maxsize",
    type: {
      name: "Number"
    }
  }
};
var appendPosition = {
  parameterPath: [
    "options",
    "appendPositionAccessConditions",
    "appendPosition"
  ],
  mapper: {
    serializedName: "x-ms-blob-condition-appendpos",
    xmlName: "x-ms-blob-condition-appendpos",
    type: {
      name: "Number"
    }
  }
};
var sourceRange1 = {
  parameterPath: ["options", "sourceRange"],
  mapper: {
    serializedName: "x-ms-source-range",
    xmlName: "x-ms-source-range",
    type: {
      name: "String"
    }
  }
};
var comp23 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "seal",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var blobType2 = {
  parameterPath: "blobType",
  mapper: {
    defaultValue: "BlockBlob",
    isConstant: true,
    serializedName: "x-ms-blob-type",
    type: {
      name: "String"
    }
  }
};
var copySourceBlobProperties = {
  parameterPath: ["options", "copySourceBlobProperties"],
  mapper: {
    serializedName: "x-ms-copy-source-blob-properties",
    xmlName: "x-ms-copy-source-blob-properties",
    type: {
      name: "Boolean"
    }
  }
};
var comp24 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "block",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var blockId = {
  parameterPath: "blockId",
  mapper: {
    serializedName: "blockid",
    required: true,
    xmlName: "blockid",
    type: {
      name: "String"
    }
  }
};
var blocks = {
  parameterPath: "blocks",
  mapper: BlockLookupList
};
var comp25 = {
  parameterPath: "comp",
  mapper: {
    defaultValue: "blocklist",
    isConstant: true,
    serializedName: "comp",
    type: {
      name: "String"
    }
  }
};
var listType = {
  parameterPath: "listType",
  mapper: {
    defaultValue: "committed",
    serializedName: "blocklisttype",
    required: true,
    xmlName: "blocklisttype",
    type: {
      name: "Enum",
      allowedValues: ["committed", "uncommitted", "all"]
    }
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/operations/service.js
var ServiceImpl = class {
  /**
   * Initialize a new instance of the class Service class.
   * @param client Reference to the service client
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * Sets properties for a storage account's Blob service endpoint, including properties for Storage
   * Analytics and CORS (Cross-Origin Resource Sharing) rules
   * @param blobServiceProperties The StorageService properties.
   * @param options The options parameters.
   */
  setProperties(blobServiceProperties2, options) {
    return this.client.sendOperationRequest({ blobServiceProperties: blobServiceProperties2, options }, setPropertiesOperationSpec);
  }
  /**
   * gets the properties of a storage account's Blob service, including properties for Storage Analytics
   * and CORS (Cross-Origin Resource Sharing) rules.
   * @param options The options parameters.
   */
  getProperties(options) {
    return this.client.sendOperationRequest({ options }, getPropertiesOperationSpec);
  }
  /**
   * Retrieves statistics related to replication for the Blob service. It is only available on the
   * secondary location endpoint when read-access geo-redundant replication is enabled for the storage
   * account.
   * @param options The options parameters.
   */
  getStatistics(options) {
    return this.client.sendOperationRequest({ options }, getStatisticsOperationSpec);
  }
  /**
   * The List Containers Segment operation returns a list of the containers under the specified account
   * @param options The options parameters.
   */
  listContainersSegment(options) {
    return this.client.sendOperationRequest({ options }, listContainersSegmentOperationSpec);
  }
  /**
   * Retrieves a user delegation key for the Blob service. This is only a valid operation when using
   * bearer token authentication.
   * @param keyInfo Key information
   * @param options The options parameters.
   */
  getUserDelegationKey(keyInfo2, options) {
    return this.client.sendOperationRequest({ keyInfo: keyInfo2, options }, getUserDelegationKeyOperationSpec);
  }
  /**
   * Returns the sku name and account kind
   * @param options The options parameters.
   */
  getAccountInfo(options) {
    return this.client.sendOperationRequest({ options }, getAccountInfoOperationSpec);
  }
  /**
   * The Batch operation allows multiple API calls to be embedded into a single HTTP request.
   * @param contentLength The length of the request.
   * @param multipartContentType Required. The value of this header must be multipart/mixed with a batch
   *                             boundary. Example header value: multipart/mixed; boundary=batch_<GUID>
   * @param body Initial data
   * @param options The options parameters.
   */
  submitBatch(contentLength2, multipartContentType2, body2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, multipartContentType: multipartContentType2, body: body2, options }, submitBatchOperationSpec);
  }
  /**
   * The Filter Blobs operation enables callers to list blobs across all containers whose tags match a
   * given search expression.  Filter blobs searches across all containers within a storage account but
   * can be scoped within the expression to a single container.
   * @param options The options parameters.
   */
  filterBlobs(options) {
    return this.client.sendOperationRequest({ options }, filterBlobsOperationSpec);
  }
};
var xmlSerializer = createSerializer(
  mappers_exports,
  /* isXml */
  true
);
var setPropertiesOperationSpec = {
  path: "/",
  httpMethod: "PUT",
  responses: {
    202: {
      headersMapper: ServiceSetPropertiesHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceSetPropertiesExceptionHeaders
    }
  },
  requestBody: blobServiceProperties,
  queryParameters: [
    restype,
    comp,
    timeoutInSeconds
  ],
  urlParameters: [url],
  headerParameters: [
    contentType,
    accept,
    version,
    requestId
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer
};
var getPropertiesOperationSpec = {
  path: "/",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: BlobServiceProperties,
      headersMapper: ServiceGetPropertiesHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceGetPropertiesExceptionHeaders
    }
  },
  queryParameters: [
    restype,
    comp,
    timeoutInSeconds
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer
};
var getStatisticsOperationSpec = {
  path: "/",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: BlobServiceStatistics,
      headersMapper: ServiceGetStatisticsHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceGetStatisticsExceptionHeaders
    }
  },
  queryParameters: [
    restype,
    timeoutInSeconds,
    comp1
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer
};
var listContainersSegmentOperationSpec = {
  path: "/",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: ListContainersSegmentResponse,
      headersMapper: ServiceListContainersSegmentHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceListContainersSegmentExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    comp2,
    prefix,
    marker,
    maxPageSize,
    include
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer
};
var getUserDelegationKeyOperationSpec = {
  path: "/",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: UserDelegationKey,
      headersMapper: ServiceGetUserDelegationKeyHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceGetUserDelegationKeyExceptionHeaders
    }
  },
  requestBody: keyInfo,
  queryParameters: [
    restype,
    timeoutInSeconds,
    comp3
  ],
  urlParameters: [url],
  headerParameters: [
    contentType,
    accept,
    version,
    requestId
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer
};
var getAccountInfoOperationSpec = {
  path: "/",
  httpMethod: "GET",
  responses: {
    200: {
      headersMapper: ServiceGetAccountInfoHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceGetAccountInfoExceptionHeaders
    }
  },
  queryParameters: [
    comp,
    timeoutInSeconds,
    restype1
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer
};
var submitBatchOperationSpec = {
  path: "/",
  httpMethod: "POST",
  responses: {
    202: {
      bodyMapper: {
        type: { name: "Stream" },
        serializedName: "parsedResponse"
      },
      headersMapper: ServiceSubmitBatchHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceSubmitBatchExceptionHeaders
    }
  },
  requestBody: body,
  queryParameters: [timeoutInSeconds, comp4],
  urlParameters: [url],
  headerParameters: [
    accept,
    version,
    requestId,
    contentLength,
    multipartContentType
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer
};
var filterBlobsOperationSpec = {
  path: "/",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: FilterBlobSegment,
      headersMapper: ServiceFilterBlobsHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ServiceFilterBlobsExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    marker,
    maxPageSize,
    comp5,
    where
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/operations/container.js
var ContainerImpl = class {
  /**
   * Initialize a new instance of the class Container class.
   * @param client Reference to the service client
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * creates a new container under the specified account. If the container with the same name already
   * exists, the operation fails
   * @param options The options parameters.
   */
  create(options) {
    return this.client.sendOperationRequest({ options }, createOperationSpec);
  }
  /**
   * returns all user-defined metadata and system properties for the specified container. The data
   * returned does not include the container's list of blobs
   * @param options The options parameters.
   */
  getProperties(options) {
    return this.client.sendOperationRequest({ options }, getPropertiesOperationSpec2);
  }
  /**
   * operation marks the specified container for deletion. The container and any blobs contained within
   * it are later deleted during garbage collection
   * @param options The options parameters.
   */
  delete(options) {
    return this.client.sendOperationRequest({ options }, deleteOperationSpec);
  }
  /**
   * operation sets one or more user-defined name-value pairs for the specified container.
   * @param options The options parameters.
   */
  setMetadata(options) {
    return this.client.sendOperationRequest({ options }, setMetadataOperationSpec);
  }
  /**
   * gets the permissions for the specified container. The permissions indicate whether container data
   * may be accessed publicly.
   * @param options The options parameters.
   */
  getAccessPolicy(options) {
    return this.client.sendOperationRequest({ options }, getAccessPolicyOperationSpec);
  }
  /**
   * sets the permissions for the specified container. The permissions indicate whether blobs in a
   * container may be accessed publicly.
   * @param options The options parameters.
   */
  setAccessPolicy(options) {
    return this.client.sendOperationRequest({ options }, setAccessPolicyOperationSpec);
  }
  /**
   * Restores a previously-deleted container.
   * @param options The options parameters.
   */
  restore(options) {
    return this.client.sendOperationRequest({ options }, restoreOperationSpec);
  }
  /**
   * Renames an existing container.
   * @param sourceContainerName Required.  Specifies the name of the container to rename.
   * @param options The options parameters.
   */
  rename(sourceContainerName2, options) {
    return this.client.sendOperationRequest({ sourceContainerName: sourceContainerName2, options }, renameOperationSpec);
  }
  /**
   * The Batch operation allows multiple API calls to be embedded into a single HTTP request.
   * @param contentLength The length of the request.
   * @param multipartContentType Required. The value of this header must be multipart/mixed with a batch
   *                             boundary. Example header value: multipart/mixed; boundary=batch_<GUID>
   * @param body Initial data
   * @param options The options parameters.
   */
  submitBatch(contentLength2, multipartContentType2, body2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, multipartContentType: multipartContentType2, body: body2, options }, submitBatchOperationSpec2);
  }
  /**
   * The Filter Blobs operation enables callers to list blobs in a container whose tags match a given
   * search expression.  Filter blobs searches within the given container.
   * @param options The options parameters.
   */
  filterBlobs(options) {
    return this.client.sendOperationRequest({ options }, filterBlobsOperationSpec2);
  }
  /**
   * [Update] establishes and manages a lock on a container for delete operations. The lock duration can
   * be 15 to 60 seconds, or can be infinite
   * @param options The options parameters.
   */
  acquireLease(options) {
    return this.client.sendOperationRequest({ options }, acquireLeaseOperationSpec);
  }
  /**
   * [Update] establishes and manages a lock on a container for delete operations. The lock duration can
   * be 15 to 60 seconds, or can be infinite
   * @param leaseId Specifies the current lease ID on the resource.
   * @param options The options parameters.
   */
  releaseLease(leaseId2, options) {
    return this.client.sendOperationRequest({ leaseId: leaseId2, options }, releaseLeaseOperationSpec);
  }
  /**
   * [Update] establishes and manages a lock on a container for delete operations. The lock duration can
   * be 15 to 60 seconds, or can be infinite
   * @param leaseId Specifies the current lease ID on the resource.
   * @param options The options parameters.
   */
  renewLease(leaseId2, options) {
    return this.client.sendOperationRequest({ leaseId: leaseId2, options }, renewLeaseOperationSpec);
  }
  /**
   * [Update] establishes and manages a lock on a container for delete operations. The lock duration can
   * be 15 to 60 seconds, or can be infinite
   * @param options The options parameters.
   */
  breakLease(options) {
    return this.client.sendOperationRequest({ options }, breakLeaseOperationSpec);
  }
  /**
   * [Update] establishes and manages a lock on a container for delete operations. The lock duration can
   * be 15 to 60 seconds, or can be infinite
   * @param leaseId Specifies the current lease ID on the resource.
   * @param proposedLeaseId Proposed lease ID, in a GUID string format. The Blob service returns 400
   *                        (Invalid request) if the proposed lease ID is not in the correct format. See Guid Constructor
   *                        (String) for a list of valid GUID string formats.
   * @param options The options parameters.
   */
  changeLease(leaseId2, proposedLeaseId2, options) {
    return this.client.sendOperationRequest({ leaseId: leaseId2, proposedLeaseId: proposedLeaseId2, options }, changeLeaseOperationSpec);
  }
  /**
   * [Update] The List Blobs operation returns a list of the blobs under the specified container
   * @param options The options parameters.
   */
  listBlobFlatSegment(options) {
    return this.client.sendOperationRequest({ options }, listBlobFlatSegmentOperationSpec);
  }
  /**
   * [Update] The List Blobs operation returns a list of the blobs under the specified container
   * @param delimiter When the request includes this parameter, the operation returns a BlobPrefix
   *                  element in the response body that acts as a placeholder for all blobs whose names begin with the
   *                  same substring up to the appearance of the delimiter character. The delimiter may be a single
   *                  character or a string.
   * @param options The options parameters.
   */
  listBlobHierarchySegment(delimiter2, options) {
    return this.client.sendOperationRequest({ delimiter: delimiter2, options }, listBlobHierarchySegmentOperationSpec);
  }
  /**
   * Returns the sku name and account kind
   * @param options The options parameters.
   */
  getAccountInfo(options) {
    return this.client.sendOperationRequest({ options }, getAccountInfoOperationSpec2);
  }
};
var xmlSerializer2 = createSerializer(
  mappers_exports,
  /* isXml */
  true
);
var createOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: ContainerCreateHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerCreateExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, restype2],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    metadata,
    access,
    defaultEncryptionScope,
    preventEncryptionScopeOverride
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var getPropertiesOperationSpec2 = {
  path: "/{containerName}",
  httpMethod: "GET",
  responses: {
    200: {
      headersMapper: ContainerGetPropertiesHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerGetPropertiesExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, restype2],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var deleteOperationSpec = {
  path: "/{containerName}",
  httpMethod: "DELETE",
  responses: {
    202: {
      headersMapper: ContainerDeleteHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerDeleteExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, restype2],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var setMetadataOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: ContainerSetMetadataHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerSetMetadataExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp6
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    metadata,
    leaseId,
    ifModifiedSince
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var getAccessPolicyOperationSpec = {
  path: "/{containerName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: {
        type: {
          name: "Sequence",
          element: {
            type: { name: "Composite", className: "SignedIdentifier" }
          }
        },
        serializedName: "SignedIdentifiers",
        xmlName: "SignedIdentifiers",
        xmlIsWrapped: true,
        xmlElementName: "SignedIdentifier"
      },
      headersMapper: ContainerGetAccessPolicyHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerGetAccessPolicyExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp7
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var setAccessPolicyOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: ContainerSetAccessPolicyHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerSetAccessPolicyExceptionHeaders
    }
  },
  requestBody: containerAcl,
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp7
  ],
  urlParameters: [url],
  headerParameters: [
    contentType,
    accept,
    version,
    requestId,
    access,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer2
};
var restoreOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: ContainerRestoreHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerRestoreExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp8
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    deletedContainerName,
    deletedContainerVersion
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var renameOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: ContainerRenameHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerRenameExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp9
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    sourceContainerName,
    sourceLeaseId
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var submitBatchOperationSpec2 = {
  path: "/{containerName}",
  httpMethod: "POST",
  responses: {
    202: {
      bodyMapper: {
        type: { name: "Stream" },
        serializedName: "parsedResponse"
      },
      headersMapper: ContainerSubmitBatchHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerSubmitBatchExceptionHeaders
    }
  },
  requestBody: body,
  queryParameters: [
    timeoutInSeconds,
    comp4,
    restype2
  ],
  urlParameters: [url],
  headerParameters: [
    accept,
    version,
    requestId,
    contentLength,
    multipartContentType
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer2
};
var filterBlobsOperationSpec2 = {
  path: "/{containerName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: FilterBlobSegment,
      headersMapper: ContainerFilterBlobsHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerFilterBlobsExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    marker,
    maxPageSize,
    comp5,
    where,
    restype2
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var acquireLeaseOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: ContainerAcquireLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerAcquireLeaseExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp10
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    action,
    duration,
    proposedLeaseId
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var releaseLeaseOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: ContainerReleaseLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerReleaseLeaseExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp10
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    action1,
    leaseId1
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var renewLeaseOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: ContainerRenewLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerRenewLeaseExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp10
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    leaseId1,
    action2
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var breakLeaseOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    202: {
      headersMapper: ContainerBreakLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerBreakLeaseExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp10
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    action3,
    breakPeriod
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var changeLeaseOperationSpec = {
  path: "/{containerName}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: ContainerChangeLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerChangeLeaseExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    restype2,
    comp10
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    leaseId1,
    action4,
    proposedLeaseId1
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var listBlobFlatSegmentOperationSpec = {
  path: "/{containerName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: ListBlobsFlatSegmentResponse,
      headersMapper: ContainerListBlobFlatSegmentHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerListBlobFlatSegmentExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    comp2,
    prefix,
    marker,
    maxPageSize,
    restype2,
    include1
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var listBlobHierarchySegmentOperationSpec = {
  path: "/{containerName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: ListBlobsHierarchySegmentResponse,
      headersMapper: ContainerListBlobHierarchySegmentHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerListBlobHierarchySegmentExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    comp2,
    prefix,
    marker,
    maxPageSize,
    restype2,
    include1,
    delimiter
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer2
};
var getAccountInfoOperationSpec2 = {
  path: "/{containerName}",
  httpMethod: "GET",
  responses: {
    200: {
      headersMapper: ContainerGetAccountInfoHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: ContainerGetAccountInfoExceptionHeaders
    }
  },
  queryParameters: [
    comp,
    timeoutInSeconds,
    restype1
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer2
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/operations/blob.js
var BlobImpl = class {
  /**
   * Initialize a new instance of the class Blob class.
   * @param client Reference to the service client
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * The Download operation reads or downloads a blob from the system, including its metadata and
   * properties. You can also call Download to read a snapshot.
   * @param options The options parameters.
   */
  download(options) {
    return this.client.sendOperationRequest({ options }, downloadOperationSpec);
  }
  /**
   * The Get Properties operation returns all user-defined metadata, standard HTTP properties, and system
   * properties for the blob. It does not return the content of the blob.
   * @param options The options parameters.
   */
  getProperties(options) {
    return this.client.sendOperationRequest({ options }, getPropertiesOperationSpec3);
  }
  /**
   * If the storage account's soft delete feature is disabled then, when a blob is deleted, it is
   * permanently removed from the storage account. If the storage account's soft delete feature is
   * enabled, then, when a blob is deleted, it is marked for deletion and becomes inaccessible
   * immediately. However, the blob service retains the blob or snapshot for the number of days specified
   * by the DeleteRetentionPolicy section of [Storage service properties]
   * (Set-Blob-Service-Properties.md). After the specified number of days has passed, the blob's data is
   * permanently removed from the storage account. Note that you continue to be charged for the
   * soft-deleted blob's storage until it is permanently removed. Use the List Blobs API and specify the
   * "include=deleted" query parameter to discover which blobs and snapshots have been soft deleted. You
   * can then use the Undelete Blob API to restore a soft-deleted blob. All other operations on a
   * soft-deleted blob or snapshot causes the service to return an HTTP status code of 404
   * (ResourceNotFound).
   * @param options The options parameters.
   */
  delete(options) {
    return this.client.sendOperationRequest({ options }, deleteOperationSpec2);
  }
  /**
   * Undelete a blob that was previously soft deleted
   * @param options The options parameters.
   */
  undelete(options) {
    return this.client.sendOperationRequest({ options }, undeleteOperationSpec);
  }
  /**
   * Sets the time a blob will expire and be deleted.
   * @param expiryOptions Required. Indicates mode of the expiry time
   * @param options The options parameters.
   */
  setExpiry(expiryOptions2, options) {
    return this.client.sendOperationRequest({ expiryOptions: expiryOptions2, options }, setExpiryOperationSpec);
  }
  /**
   * The Set HTTP Headers operation sets system properties on the blob
   * @param options The options parameters.
   */
  setHttpHeaders(options) {
    return this.client.sendOperationRequest({ options }, setHttpHeadersOperationSpec);
  }
  /**
   * The Set Immutability Policy operation sets the immutability policy on the blob
   * @param options The options parameters.
   */
  setImmutabilityPolicy(options) {
    return this.client.sendOperationRequest({ options }, setImmutabilityPolicyOperationSpec);
  }
  /**
   * The Delete Immutability Policy operation deletes the immutability policy on the blob
   * @param options The options parameters.
   */
  deleteImmutabilityPolicy(options) {
    return this.client.sendOperationRequest({ options }, deleteImmutabilityPolicyOperationSpec);
  }
  /**
   * The Set Legal Hold operation sets a legal hold on the blob.
   * @param legalHold Specified if a legal hold should be set on the blob.
   * @param options The options parameters.
   */
  setLegalHold(legalHold2, options) {
    return this.client.sendOperationRequest({ legalHold: legalHold2, options }, setLegalHoldOperationSpec);
  }
  /**
   * The Set Blob Metadata operation sets user-defined metadata for the specified blob as one or more
   * name-value pairs
   * @param options The options parameters.
   */
  setMetadata(options) {
    return this.client.sendOperationRequest({ options }, setMetadataOperationSpec2);
  }
  /**
   * [Update] The Lease Blob operation establishes and manages a lock on a blob for write and delete
   * operations
   * @param options The options parameters.
   */
  acquireLease(options) {
    return this.client.sendOperationRequest({ options }, acquireLeaseOperationSpec2);
  }
  /**
   * [Update] The Lease Blob operation establishes and manages a lock on a blob for write and delete
   * operations
   * @param leaseId Specifies the current lease ID on the resource.
   * @param options The options parameters.
   */
  releaseLease(leaseId2, options) {
    return this.client.sendOperationRequest({ leaseId: leaseId2, options }, releaseLeaseOperationSpec2);
  }
  /**
   * [Update] The Lease Blob operation establishes and manages a lock on a blob for write and delete
   * operations
   * @param leaseId Specifies the current lease ID on the resource.
   * @param options The options parameters.
   */
  renewLease(leaseId2, options) {
    return this.client.sendOperationRequest({ leaseId: leaseId2, options }, renewLeaseOperationSpec2);
  }
  /**
   * [Update] The Lease Blob operation establishes and manages a lock on a blob for write and delete
   * operations
   * @param leaseId Specifies the current lease ID on the resource.
   * @param proposedLeaseId Proposed lease ID, in a GUID string format. The Blob service returns 400
   *                        (Invalid request) if the proposed lease ID is not in the correct format. See Guid Constructor
   *                        (String) for a list of valid GUID string formats.
   * @param options The options parameters.
   */
  changeLease(leaseId2, proposedLeaseId2, options) {
    return this.client.sendOperationRequest({ leaseId: leaseId2, proposedLeaseId: proposedLeaseId2, options }, changeLeaseOperationSpec2);
  }
  /**
   * [Update] The Lease Blob operation establishes and manages a lock on a blob for write and delete
   * operations
   * @param options The options parameters.
   */
  breakLease(options) {
    return this.client.sendOperationRequest({ options }, breakLeaseOperationSpec2);
  }
  /**
   * The Create Snapshot operation creates a read-only snapshot of a blob
   * @param options The options parameters.
   */
  createSnapshot(options) {
    return this.client.sendOperationRequest({ options }, createSnapshotOperationSpec);
  }
  /**
   * The Start Copy From URL operation copies a blob or an internet resource to a new blob.
   * @param copySource Specifies the name of the source page blob snapshot. This value is a URL of up to
   *                   2 KB in length that specifies a page blob snapshot. The value should be URL-encoded as it would
   *                   appear in a request URI. The source blob must either be public or must be authenticated via a shared
   *                   access signature.
   * @param options The options parameters.
   */
  startCopyFromURL(copySource2, options) {
    return this.client.sendOperationRequest({ copySource: copySource2, options }, startCopyFromURLOperationSpec);
  }
  /**
   * The Copy From URL operation copies a blob or an internet resource to a new blob. It will not return
   * a response until the copy is complete.
   * @param copySource Specifies the name of the source page blob snapshot. This value is a URL of up to
   *                   2 KB in length that specifies a page blob snapshot. The value should be URL-encoded as it would
   *                   appear in a request URI. The source blob must either be public or must be authenticated via a shared
   *                   access signature.
   * @param options The options parameters.
   */
  copyFromURL(copySource2, options) {
    return this.client.sendOperationRequest({ copySource: copySource2, options }, copyFromURLOperationSpec);
  }
  /**
   * The Abort Copy From URL operation aborts a pending Copy From URL operation, and leaves a destination
   * blob with zero length and full metadata.
   * @param copyId The copy identifier provided in the x-ms-copy-id header of the original Copy Blob
   *               operation.
   * @param options The options parameters.
   */
  abortCopyFromURL(copyId2, options) {
    return this.client.sendOperationRequest({ copyId: copyId2, options }, abortCopyFromURLOperationSpec);
  }
  /**
   * The Set Tier operation sets the tier on a blob. The operation is allowed on a page blob in a premium
   * storage account and on a block blob in a blob storage account (locally redundant storage only). A
   * premium page blob's tier determines the allowed size, IOPS, and bandwidth of the blob. A block
   * blob's tier determines Hot/Cool/Archive storage type. This operation does not update the blob's
   * ETag.
   * @param tier Indicates the tier to be set on the blob.
   * @param options The options parameters.
   */
  setTier(tier2, options) {
    return this.client.sendOperationRequest({ tier: tier2, options }, setTierOperationSpec);
  }
  /**
   * Returns the sku name and account kind
   * @param options The options parameters.
   */
  getAccountInfo(options) {
    return this.client.sendOperationRequest({ options }, getAccountInfoOperationSpec3);
  }
  /**
   * The Query operation enables users to select/project on blob data by providing simple query
   * expressions.
   * @param options The options parameters.
   */
  query(options) {
    return this.client.sendOperationRequest({ options }, queryOperationSpec);
  }
  /**
   * The Get Tags operation enables users to get the tags associated with a blob.
   * @param options The options parameters.
   */
  getTags(options) {
    return this.client.sendOperationRequest({ options }, getTagsOperationSpec);
  }
  /**
   * The Set Tags operation enables users to set tags on a blob.
   * @param options The options parameters.
   */
  setTags(options) {
    return this.client.sendOperationRequest({ options }, setTagsOperationSpec);
  }
};
var xmlSerializer3 = createSerializer(
  mappers_exports,
  /* isXml */
  true
);
var downloadOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: {
        type: { name: "Stream" },
        serializedName: "parsedResponse"
      },
      headersMapper: BlobDownloadHeaders
    },
    206: {
      bodyMapper: {
        type: { name: "Stream" },
        serializedName: "parsedResponse"
      },
      headersMapper: BlobDownloadHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobDownloadExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    range,
    rangeGetContentMD5,
    rangeGetContentCRC64,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var getPropertiesOperationSpec3 = {
  path: "/{containerName}/{blob}",
  httpMethod: "HEAD",
  responses: {
    200: {
      headersMapper: BlobGetPropertiesHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobGetPropertiesExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var deleteOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "DELETE",
  responses: {
    202: {
      headersMapper: BlobDeleteHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobDeleteExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId,
    blobDeleteType
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    ifMatch,
    ifNoneMatch,
    ifTags,
    deleteSnapshots
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var undeleteOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobUndeleteHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobUndeleteExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp8],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var setExpiryOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobSetExpiryHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobSetExpiryExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp11],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    expiryOptions,
    expiresOn
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var setHttpHeadersOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobSetHttpHeadersHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobSetHttpHeadersExceptionHeaders
    }
  },
  queryParameters: [comp, timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    ifMatch,
    ifNoneMatch,
    ifTags,
    blobCacheControl,
    blobContentType,
    blobContentMD5,
    blobContentEncoding,
    blobContentLanguage,
    blobContentDisposition
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var setImmutabilityPolicyOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobSetImmutabilityPolicyHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobSetImmutabilityPolicyExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId,
    comp12
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifUnmodifiedSince,
    immutabilityPolicyExpiry,
    immutabilityPolicyMode
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var deleteImmutabilityPolicyOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "DELETE",
  responses: {
    200: {
      headersMapper: BlobDeleteImmutabilityPolicyHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobDeleteImmutabilityPolicyExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId,
    comp12
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var setLegalHoldOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobSetLegalHoldHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobSetLegalHoldExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId,
    comp13
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    legalHold
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var setMetadataOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobSetMetadataHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobSetMetadataExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp6],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var acquireLeaseOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: BlobAcquireLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobAcquireLeaseExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp10],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    action,
    duration,
    proposedLeaseId,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var releaseLeaseOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobReleaseLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobReleaseLeaseExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp10],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    action1,
    leaseId1,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var renewLeaseOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobRenewLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobRenewLeaseExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp10],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    leaseId1,
    action2,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var changeLeaseOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobChangeLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobChangeLeaseExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp10],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    leaseId1,
    action4,
    proposedLeaseId1,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var breakLeaseOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    202: {
      headersMapper: BlobBreakLeaseHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobBreakLeaseExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp10],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    action3,
    breakPeriod,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var createSnapshotOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: BlobCreateSnapshotHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobCreateSnapshotExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp14],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var startCopyFromURLOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    202: {
      headersMapper: BlobStartCopyFromURLHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobStartCopyFromURLExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    ifMatch,
    ifNoneMatch,
    ifTags,
    immutabilityPolicyExpiry,
    immutabilityPolicyMode,
    tier,
    rehydratePriority,
    sourceIfModifiedSince,
    sourceIfUnmodifiedSince,
    sourceIfMatch,
    sourceIfNoneMatch,
    sourceIfTags,
    copySource,
    blobTagsString,
    sealBlob,
    legalHold1
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var copyFromURLOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    202: {
      headersMapper: BlobCopyFromURLHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobCopyFromURLExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    ifMatch,
    ifNoneMatch,
    ifTags,
    immutabilityPolicyExpiry,
    immutabilityPolicyMode,
    encryptionScope,
    tier,
    sourceIfModifiedSince,
    sourceIfUnmodifiedSince,
    sourceIfMatch,
    sourceIfNoneMatch,
    copySource,
    blobTagsString,
    legalHold1,
    xMsRequiresSync,
    sourceContentMD5,
    copySourceAuthorization,
    copySourceTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var abortCopyFromURLOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    204: {
      headersMapper: BlobAbortCopyFromURLHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobAbortCopyFromURLExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    comp15,
    copyId
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    copyActionAbortConstant
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var setTierOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: BlobSetTierHeaders
    },
    202: {
      headersMapper: BlobSetTierHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobSetTierExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId,
    comp16
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifTags,
    rehydratePriority,
    tier1
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var getAccountInfoOperationSpec3 = {
  path: "/{containerName}/{blob}",
  httpMethod: "GET",
  responses: {
    200: {
      headersMapper: BlobGetAccountInfoHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobGetAccountInfoExceptionHeaders
    }
  },
  queryParameters: [
    comp,
    timeoutInSeconds,
    restype1
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var queryOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: {
        type: { name: "Stream" },
        serializedName: "parsedResponse"
      },
      headersMapper: BlobQueryHeaders
    },
    206: {
      bodyMapper: {
        type: { name: "Stream" },
        serializedName: "parsedResponse"
      },
      headersMapper: BlobQueryHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobQueryExceptionHeaders
    }
  },
  requestBody: queryRequest,
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    comp17
  ],
  urlParameters: [url],
  headerParameters: [
    contentType,
    accept,
    version,
    requestId,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer3
};
var getTagsOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: BlobTags,
      headersMapper: BlobGetTagsHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobGetTagsExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    versionId,
    comp18
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer3
};
var setTagsOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    204: {
      headersMapper: BlobSetTagsHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlobSetTagsExceptionHeaders
    }
  },
  requestBody: tags,
  queryParameters: [
    timeoutInSeconds,
    versionId,
    comp18
  ],
  urlParameters: [url],
  headerParameters: [
    contentType,
    accept,
    version,
    requestId,
    leaseId,
    ifTags,
    transactionalContentMD5,
    transactionalContentCrc64
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer3
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/operations/pageBlob.js
var PageBlobImpl = class {
  /**
   * Initialize a new instance of the class PageBlob class.
   * @param client Reference to the service client
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * The Create operation creates a new page blob.
   * @param contentLength The length of the request.
   * @param blobContentLength This header specifies the maximum size for the page blob, up to 1 TB. The
   *                          page blob size must be aligned to a 512-byte boundary.
   * @param options The options parameters.
   */
  create(contentLength2, blobContentLength2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, blobContentLength: blobContentLength2, options }, createOperationSpec2);
  }
  /**
   * The Upload Pages operation writes a range of pages to a page blob
   * @param contentLength The length of the request.
   * @param body Initial data
   * @param options The options parameters.
   */
  uploadPages(contentLength2, body2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, body: body2, options }, uploadPagesOperationSpec);
  }
  /**
   * The Clear Pages operation clears a set of pages from a page blob
   * @param contentLength The length of the request.
   * @param options The options parameters.
   */
  clearPages(contentLength2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, options }, clearPagesOperationSpec);
  }
  /**
   * The Upload Pages operation writes a range of pages to a page blob where the contents are read from a
   * URL
   * @param sourceUrl Specify a URL to the copy source.
   * @param sourceRange Bytes of source data in the specified range. The length of this range should
   *                    match the ContentLength header and x-ms-range/Range destination range header.
   * @param contentLength The length of the request.
   * @param range The range of bytes to which the source range would be written. The range should be 512
   *              aligned and range-end is required.
   * @param options The options parameters.
   */
  uploadPagesFromURL(sourceUrl2, sourceRange2, contentLength2, range2, options) {
    return this.client.sendOperationRequest({ sourceUrl: sourceUrl2, sourceRange: sourceRange2, contentLength: contentLength2, range: range2, options }, uploadPagesFromURLOperationSpec);
  }
  /**
   * The Get Page Ranges operation returns the list of valid page ranges for a page blob or snapshot of a
   * page blob
   * @param options The options parameters.
   */
  getPageRanges(options) {
    return this.client.sendOperationRequest({ options }, getPageRangesOperationSpec);
  }
  /**
   * The Get Page Ranges Diff operation returns the list of valid page ranges for a page blob that were
   * changed between target blob and previous snapshot.
   * @param options The options parameters.
   */
  getPageRangesDiff(options) {
    return this.client.sendOperationRequest({ options }, getPageRangesDiffOperationSpec);
  }
  /**
   * Resize the Blob
   * @param blobContentLength This header specifies the maximum size for the page blob, up to 1 TB. The
   *                          page blob size must be aligned to a 512-byte boundary.
   * @param options The options parameters.
   */
  resize(blobContentLength2, options) {
    return this.client.sendOperationRequest({ blobContentLength: blobContentLength2, options }, resizeOperationSpec);
  }
  /**
   * Update the sequence number of the blob
   * @param sequenceNumberAction Required if the x-ms-blob-sequence-number header is set for the request.
   *                             This property applies to page blobs only. This property indicates how the service should modify the
   *                             blob's sequence number
   * @param options The options parameters.
   */
  updateSequenceNumber(sequenceNumberAction2, options) {
    return this.client.sendOperationRequest({ sequenceNumberAction: sequenceNumberAction2, options }, updateSequenceNumberOperationSpec);
  }
  /**
   * The Copy Incremental operation copies a snapshot of the source page blob to a destination page blob.
   * The snapshot is copied such that only the differential changes between the previously copied
   * snapshot are transferred to the destination. The copied snapshots are complete copies of the
   * original snapshot and can be read or copied from as usual. This API is supported since REST version
   * 2016-05-31.
   * @param copySource Specifies the name of the source page blob snapshot. This value is a URL of up to
   *                   2 KB in length that specifies a page blob snapshot. The value should be URL-encoded as it would
   *                   appear in a request URI. The source blob must either be public or must be authenticated via a shared
   *                   access signature.
   * @param options The options parameters.
   */
  copyIncremental(copySource2, options) {
    return this.client.sendOperationRequest({ copySource: copySource2, options }, copyIncrementalOperationSpec);
  }
};
var xmlSerializer4 = createSerializer(
  mappers_exports,
  /* isXml */
  true
);
var createOperationSpec2 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: PageBlobCreateHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobCreateExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    contentLength,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    blobCacheControl,
    blobContentType,
    blobContentMD5,
    blobContentEncoding,
    blobContentLanguage,
    blobContentDisposition,
    immutabilityPolicyExpiry,
    immutabilityPolicyMode,
    encryptionScope,
    tier,
    blobTagsString,
    legalHold1,
    blobType,
    blobContentLength,
    blobSequenceNumber
  ],
  isXML: true,
  serializer: xmlSerializer4
};
var uploadPagesOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: PageBlobUploadPagesHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobUploadPagesExceptionHeaders
    }
  },
  requestBody: body1,
  queryParameters: [timeoutInSeconds, comp19],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    contentLength,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    range,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope,
    transactionalContentMD5,
    transactionalContentCrc64,
    contentType1,
    accept2,
    pageWrite,
    ifSequenceNumberLessThanOrEqualTo,
    ifSequenceNumberLessThan,
    ifSequenceNumberEqualTo
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "binary",
  serializer: xmlSerializer4
};
var clearPagesOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: PageBlobClearPagesHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobClearPagesExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp19],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    contentLength,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    range,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope,
    ifSequenceNumberLessThanOrEqualTo,
    ifSequenceNumberLessThan,
    ifSequenceNumberEqualTo,
    pageWrite1
  ],
  isXML: true,
  serializer: xmlSerializer4
};
var uploadPagesFromURLOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: PageBlobUploadPagesFromURLHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobUploadPagesFromURLExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp19],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    contentLength,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope,
    sourceIfModifiedSince,
    sourceIfUnmodifiedSince,
    sourceIfMatch,
    sourceIfNoneMatch,
    sourceContentMD5,
    copySourceAuthorization,
    pageWrite,
    ifSequenceNumberLessThanOrEqualTo,
    ifSequenceNumberLessThan,
    ifSequenceNumberEqualTo,
    sourceUrl,
    sourceRange,
    sourceContentCrc64,
    range1
  ],
  isXML: true,
  serializer: xmlSerializer4
};
var getPageRangesOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: PageList,
      headersMapper: PageBlobGetPageRangesHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobGetPageRangesExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    marker,
    maxPageSize,
    snapshot,
    comp20
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    range,
    ifMatch,
    ifNoneMatch,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer4
};
var getPageRangesDiffOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: PageList,
      headersMapper: PageBlobGetPageRangesDiffHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobGetPageRangesDiffExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    marker,
    maxPageSize,
    snapshot,
    comp20,
    prevsnapshot
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    range,
    ifMatch,
    ifNoneMatch,
    ifTags,
    prevSnapshotUrl
  ],
  isXML: true,
  serializer: xmlSerializer4
};
var resizeOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: PageBlobResizeHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobResizeExceptionHeaders
    }
  },
  queryParameters: [comp, timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope,
    blobContentLength
  ],
  isXML: true,
  serializer: xmlSerializer4
};
var updateSequenceNumberOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: PageBlobUpdateSequenceNumberHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobUpdateSequenceNumberExceptionHeaders
    }
  },
  queryParameters: [comp, timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    ifMatch,
    ifNoneMatch,
    ifTags,
    blobSequenceNumber,
    sequenceNumberAction
  ],
  isXML: true,
  serializer: xmlSerializer4
};
var copyIncrementalOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    202: {
      headersMapper: PageBlobCopyIncrementalHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: PageBlobCopyIncrementalExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp21],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    ifModifiedSince,
    ifUnmodifiedSince,
    ifMatch,
    ifNoneMatch,
    ifTags,
    copySource
  ],
  isXML: true,
  serializer: xmlSerializer4
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/operations/appendBlob.js
var AppendBlobImpl = class {
  /**
   * Initialize a new instance of the class AppendBlob class.
   * @param client Reference to the service client
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * The Create Append Blob operation creates a new append blob.
   * @param contentLength The length of the request.
   * @param options The options parameters.
   */
  create(contentLength2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, options }, createOperationSpec3);
  }
  /**
   * The Append Block operation commits a new block of data to the end of an existing append blob. The
   * Append Block operation is permitted only if the blob was created with x-ms-blob-type set to
   * AppendBlob. Append Block is supported only on version 2015-02-21 version or later.
   * @param contentLength The length of the request.
   * @param body Initial data
   * @param options The options parameters.
   */
  appendBlock(contentLength2, body2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, body: body2, options }, appendBlockOperationSpec);
  }
  /**
   * The Append Block operation commits a new block of data to the end of an existing append blob where
   * the contents are read from a source url. The Append Block operation is permitted only if the blob
   * was created with x-ms-blob-type set to AppendBlob. Append Block is supported only on version
   * 2015-02-21 version or later.
   * @param sourceUrl Specify a URL to the copy source.
   * @param contentLength The length of the request.
   * @param options The options parameters.
   */
  appendBlockFromUrl(sourceUrl2, contentLength2, options) {
    return this.client.sendOperationRequest({ sourceUrl: sourceUrl2, contentLength: contentLength2, options }, appendBlockFromUrlOperationSpec);
  }
  /**
   * The Seal operation seals the Append Blob to make it read-only. Seal is supported only on version
   * 2019-12-12 version or later.
   * @param options The options parameters.
   */
  seal(options) {
    return this.client.sendOperationRequest({ options }, sealOperationSpec);
  }
};
var xmlSerializer5 = createSerializer(
  mappers_exports,
  /* isXml */
  true
);
var createOperationSpec3 = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: AppendBlobCreateHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: AppendBlobCreateExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    contentLength,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    blobCacheControl,
    blobContentType,
    blobContentMD5,
    blobContentEncoding,
    blobContentLanguage,
    blobContentDisposition,
    immutabilityPolicyExpiry,
    immutabilityPolicyMode,
    encryptionScope,
    blobTagsString,
    legalHold1,
    blobType1
  ],
  isXML: true,
  serializer: xmlSerializer5
};
var appendBlockOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: AppendBlobAppendBlockHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: AppendBlobAppendBlockExceptionHeaders
    }
  },
  requestBody: body1,
  queryParameters: [timeoutInSeconds, comp22],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    contentLength,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope,
    transactionalContentMD5,
    transactionalContentCrc64,
    contentType1,
    accept2,
    maxSize,
    appendPosition
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "binary",
  serializer: xmlSerializer5
};
var appendBlockFromUrlOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: AppendBlobAppendBlockFromUrlHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: AppendBlobAppendBlockFromUrlExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp22],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    contentLength,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    encryptionScope,
    sourceIfModifiedSince,
    sourceIfUnmodifiedSince,
    sourceIfMatch,
    sourceIfNoneMatch,
    sourceContentMD5,
    copySourceAuthorization,
    transactionalContentMD5,
    sourceUrl,
    sourceContentCrc64,
    maxSize,
    appendPosition,
    sourceRange1
  ],
  isXML: true,
  serializer: xmlSerializer5
};
var sealOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    200: {
      headersMapper: AppendBlobSealHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: AppendBlobSealExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds, comp23],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    ifMatch,
    ifNoneMatch,
    appendPosition
  ],
  isXML: true,
  serializer: xmlSerializer5
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/operations/blockBlob.js
var BlockBlobImpl = class {
  /**
   * Initialize a new instance of the class BlockBlob class.
   * @param client Reference to the service client
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * The Upload Block Blob operation updates the content of an existing block blob. Updating an existing
   * block blob overwrites any existing metadata on the blob. Partial updates are not supported with Put
   * Blob; the content of the existing blob is overwritten with the content of the new blob. To perform a
   * partial update of the content of a block blob, use the Put Block List operation.
   * @param contentLength The length of the request.
   * @param body Initial data
   * @param options The options parameters.
   */
  upload(contentLength2, body2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, body: body2, options }, uploadOperationSpec);
  }
  /**
   * The Put Blob from URL operation creates a new Block Blob where the contents of the blob are read
   * from a given URL.  This API is supported beginning with the 2020-04-08 version. Partial updates are
   * not supported with Put Blob from URL; the content of an existing blob is overwritten with the
   * content of the new blob.  To perform partial updates to a block blob’s contents using a source URL,
   * use the Put Block from URL API in conjunction with Put Block List.
   * @param contentLength The length of the request.
   * @param copySource Specifies the name of the source page blob snapshot. This value is a URL of up to
   *                   2 KB in length that specifies a page blob snapshot. The value should be URL-encoded as it would
   *                   appear in a request URI. The source blob must either be public or must be authenticated via a shared
   *                   access signature.
   * @param options The options parameters.
   */
  putBlobFromUrl(contentLength2, copySource2, options) {
    return this.client.sendOperationRequest({ contentLength: contentLength2, copySource: copySource2, options }, putBlobFromUrlOperationSpec);
  }
  /**
   * The Stage Block operation creates a new block to be committed as part of a blob
   * @param blockId A valid Base64 string value that identifies the block. Prior to encoding, the string
   *                must be less than or equal to 64 bytes in size. For a given blob, the length of the value specified
   *                for the blockid parameter must be the same size for each block.
   * @param contentLength The length of the request.
   * @param body Initial data
   * @param options The options parameters.
   */
  stageBlock(blockId2, contentLength2, body2, options) {
    return this.client.sendOperationRequest({ blockId: blockId2, contentLength: contentLength2, body: body2, options }, stageBlockOperationSpec);
  }
  /**
   * The Stage Block operation creates a new block to be committed as part of a blob where the contents
   * are read from a URL.
   * @param blockId A valid Base64 string value that identifies the block. Prior to encoding, the string
   *                must be less than or equal to 64 bytes in size. For a given blob, the length of the value specified
   *                for the blockid parameter must be the same size for each block.
   * @param contentLength The length of the request.
   * @param sourceUrl Specify a URL to the copy source.
   * @param options The options parameters.
   */
  stageBlockFromURL(blockId2, contentLength2, sourceUrl2, options) {
    return this.client.sendOperationRequest({ blockId: blockId2, contentLength: contentLength2, sourceUrl: sourceUrl2, options }, stageBlockFromURLOperationSpec);
  }
  /**
   * The Commit Block List operation writes a blob by specifying the list of block IDs that make up the
   * blob. In order to be written as part of a blob, a block must have been successfully written to the
   * server in a prior Put Block operation. You can call Put Block List to update a blob by uploading
   * only those blocks that have changed, then committing the new and existing blocks together. You can
   * do this by specifying whether to commit a block from the committed block list or from the
   * uncommitted block list, or to commit the most recently uploaded version of the block, whichever list
   * it may belong to.
   * @param blocks Blob Blocks.
   * @param options The options parameters.
   */
  commitBlockList(blocks2, options) {
    return this.client.sendOperationRequest({ blocks: blocks2, options }, commitBlockListOperationSpec);
  }
  /**
   * The Get Block List operation retrieves the list of blocks that have been uploaded as part of a block
   * blob
   * @param listType Specifies whether to return the list of committed blocks, the list of uncommitted
   *                 blocks, or both lists together.
   * @param options The options parameters.
   */
  getBlockList(listType2, options) {
    return this.client.sendOperationRequest({ listType: listType2, options }, getBlockListOperationSpec);
  }
};
var xmlSerializer6 = createSerializer(
  mappers_exports,
  /* isXml */
  true
);
var uploadOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: BlockBlobUploadHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlockBlobUploadExceptionHeaders
    }
  },
  requestBody: body1,
  queryParameters: [timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    contentLength,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    blobCacheControl,
    blobContentType,
    blobContentMD5,
    blobContentEncoding,
    blobContentLanguage,
    blobContentDisposition,
    immutabilityPolicyExpiry,
    immutabilityPolicyMode,
    encryptionScope,
    tier,
    blobTagsString,
    legalHold1,
    transactionalContentMD5,
    transactionalContentCrc64,
    contentType1,
    accept2,
    blobType2
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "binary",
  serializer: xmlSerializer6
};
var putBlobFromUrlOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: BlockBlobPutBlobFromUrlHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlockBlobPutBlobFromUrlExceptionHeaders
    }
  },
  queryParameters: [timeoutInSeconds],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    contentLength,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    blobCacheControl,
    blobContentType,
    blobContentMD5,
    blobContentEncoding,
    blobContentLanguage,
    blobContentDisposition,
    encryptionScope,
    tier,
    sourceIfModifiedSince,
    sourceIfUnmodifiedSince,
    sourceIfMatch,
    sourceIfNoneMatch,
    sourceIfTags,
    copySource,
    blobTagsString,
    sourceContentMD5,
    copySourceAuthorization,
    copySourceTags,
    transactionalContentMD5,
    blobType2,
    copySourceBlobProperties
  ],
  isXML: true,
  serializer: xmlSerializer6
};
var stageBlockOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: BlockBlobStageBlockHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlockBlobStageBlockExceptionHeaders
    }
  },
  requestBody: body1,
  queryParameters: [
    timeoutInSeconds,
    comp24,
    blockId
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    contentLength,
    leaseId,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    encryptionScope,
    transactionalContentMD5,
    transactionalContentCrc64,
    contentType1,
    accept2
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "binary",
  serializer: xmlSerializer6
};
var stageBlockFromURLOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: BlockBlobStageBlockFromURLHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlockBlobStageBlockFromURLExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    comp24,
    blockId
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    contentLength,
    leaseId,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    encryptionScope,
    sourceIfModifiedSince,
    sourceIfUnmodifiedSince,
    sourceIfMatch,
    sourceIfNoneMatch,
    sourceContentMD5,
    copySourceAuthorization,
    sourceUrl,
    sourceContentCrc64,
    sourceRange1
  ],
  isXML: true,
  serializer: xmlSerializer6
};
var commitBlockListOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "PUT",
  responses: {
    201: {
      headersMapper: BlockBlobCommitBlockListHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlockBlobCommitBlockListExceptionHeaders
    }
  },
  requestBody: blocks,
  queryParameters: [timeoutInSeconds, comp25],
  urlParameters: [url],
  headerParameters: [
    contentType,
    accept,
    version,
    requestId,
    metadata,
    leaseId,
    ifModifiedSince,
    ifUnmodifiedSince,
    encryptionKey,
    encryptionKeySha256,
    encryptionAlgorithm,
    ifMatch,
    ifNoneMatch,
    ifTags,
    blobCacheControl,
    blobContentType,
    blobContentMD5,
    blobContentEncoding,
    blobContentLanguage,
    blobContentDisposition,
    immutabilityPolicyExpiry,
    immutabilityPolicyMode,
    encryptionScope,
    tier,
    blobTagsString,
    legalHold1,
    transactionalContentMD5,
    transactionalContentCrc64
  ],
  isXML: true,
  contentType: "application/xml; charset=utf-8",
  mediaType: "xml",
  serializer: xmlSerializer6
};
var getBlockListOperationSpec = {
  path: "/{containerName}/{blob}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: BlockList,
      headersMapper: BlockBlobGetBlockListHeaders
    },
    default: {
      bodyMapper: StorageError,
      headersMapper: BlockBlobGetBlockListExceptionHeaders
    }
  },
  queryParameters: [
    timeoutInSeconds,
    snapshot,
    comp25,
    listType
  ],
  urlParameters: [url],
  headerParameters: [
    version,
    requestId,
    accept1,
    leaseId,
    ifTags
  ],
  isXML: true,
  serializer: xmlSerializer6
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generated/src/storageClient.js
var StorageClient = class extends ExtendedServiceClient {
  /**
   * Initializes a new instance of the StorageClient class.
   * @param url The URL of the service account, container, or blob that is the target of the desired
   *            operation.
   * @param options The parameter options
   */
  constructor(url2, options) {
    var _a3, _b2;
    if (url2 === void 0) {
      throw new Error("'url' cannot be null");
    }
    if (!options) {
      options = {};
    }
    const defaults = {
      requestContentType: "application/json; charset=utf-8"
    };
    const packageDetails = `azsdk-js-azure-storage-blob/12.26.0`;
    const userAgentPrefix = options.userAgentOptions && options.userAgentOptions.userAgentPrefix ? `${options.userAgentOptions.userAgentPrefix} ${packageDetails}` : `${packageDetails}`;
    const optionsWithDefaults = Object.assign(Object.assign(Object.assign({}, defaults), options), { userAgentOptions: {
      userAgentPrefix
    }, endpoint: (_b2 = (_a3 = options.endpoint) !== null && _a3 !== void 0 ? _a3 : options.baseUri) !== null && _b2 !== void 0 ? _b2 : "{url}" });
    super(optionsWithDefaults);
    this.url = url2;
    this.version = options.version || "2025-01-05";
    this.service = new ServiceImpl(this);
    this.container = new ContainerImpl(this);
    this.blob = new BlobImpl(this);
    this.pageBlob = new PageBlobImpl(this);
    this.appendBlob = new AppendBlobImpl(this);
    this.blockBlob = new BlockBlobImpl(this);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/StorageContextClient.js
var StorageContextClient = class extends StorageClient {
  async sendOperationRequest(operationArguments, operationSpec) {
    const operationSpecToSend = Object.assign({}, operationSpec);
    if (operationSpecToSend.path === "/{containerName}" || operationSpecToSend.path === "/{containerName}/{blob}") {
      operationSpecToSend.path = "";
    }
    return super.sendOperationRequest(operationArguments, operationSpecToSend);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/StorageClient.js
var StorageClient2 = class {
  /**
   * Creates an instance of StorageClient.
   * @param url - url to resource
   * @param pipeline - request policy pipeline.
   */
  constructor(url2, pipeline) {
    this.url = escapeURLPath(url2);
    this.accountName = getAccountNameFromUrl(url2);
    this.pipeline = pipeline;
    this.storageClientContext = new StorageContextClient(this.url, getCoreClientOptions(pipeline));
    this.isHttps = iEqual(getURLScheme(this.url) || "", "https");
    this.credential = getCredentialFromPipeline(pipeline);
    const storageClientContext = this.storageClientContext;
    storageClientContext.requestContentType = void 0;
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/utils/tracing.js
var tracingClient = createTracingClient({
  packageName: "@azure/storage-blob",
  packageVersion: SDK_VERSION2,
  namespace: "Microsoft.Storage"
});

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/BlobSASPermissions.js
var BlobSASPermissions = class _BlobSASPermissions {
  constructor() {
    this.read = false;
    this.add = false;
    this.create = false;
    this.write = false;
    this.delete = false;
    this.deleteVersion = false;
    this.tag = false;
    this.move = false;
    this.execute = false;
    this.setImmutabilityPolicy = false;
    this.permanentDelete = false;
  }
  /**
   * Creates a {@link BlobSASPermissions} from the specified permissions string. This method will throw an
   * Error if it encounters a character that does not correspond to a valid permission.
   *
   * @param permissions -
   */
  static parse(permissions) {
    const blobSASPermissions = new _BlobSASPermissions();
    for (const char of permissions) {
      switch (char) {
        case "r":
          blobSASPermissions.read = true;
          break;
        case "a":
          blobSASPermissions.add = true;
          break;
        case "c":
          blobSASPermissions.create = true;
          break;
        case "w":
          blobSASPermissions.write = true;
          break;
        case "d":
          blobSASPermissions.delete = true;
          break;
        case "x":
          blobSASPermissions.deleteVersion = true;
          break;
        case "t":
          blobSASPermissions.tag = true;
          break;
        case "m":
          blobSASPermissions.move = true;
          break;
        case "e":
          blobSASPermissions.execute = true;
          break;
        case "i":
          blobSASPermissions.setImmutabilityPolicy = true;
          break;
        case "y":
          blobSASPermissions.permanentDelete = true;
          break;
        default:
          throw new RangeError(`Invalid permission: ${char}`);
      }
    }
    return blobSASPermissions;
  }
  /**
   * Creates a {@link BlobSASPermissions} from a raw object which contains same keys as it
   * and boolean values for them.
   *
   * @param permissionLike -
   */
  static from(permissionLike) {
    const blobSASPermissions = new _BlobSASPermissions();
    if (permissionLike.read) {
      blobSASPermissions.read = true;
    }
    if (permissionLike.add) {
      blobSASPermissions.add = true;
    }
    if (permissionLike.create) {
      blobSASPermissions.create = true;
    }
    if (permissionLike.write) {
      blobSASPermissions.write = true;
    }
    if (permissionLike.delete) {
      blobSASPermissions.delete = true;
    }
    if (permissionLike.deleteVersion) {
      blobSASPermissions.deleteVersion = true;
    }
    if (permissionLike.tag) {
      blobSASPermissions.tag = true;
    }
    if (permissionLike.move) {
      blobSASPermissions.move = true;
    }
    if (permissionLike.execute) {
      blobSASPermissions.execute = true;
    }
    if (permissionLike.setImmutabilityPolicy) {
      blobSASPermissions.setImmutabilityPolicy = true;
    }
    if (permissionLike.permanentDelete) {
      blobSASPermissions.permanentDelete = true;
    }
    return blobSASPermissions;
  }
  /**
   * Converts the given permissions to a string. Using this method will guarantee the permissions are in an
   * order accepted by the service.
   *
   * @returns A string which represents the BlobSASPermissions
   */
  toString() {
    const permissions = [];
    if (this.read) {
      permissions.push("r");
    }
    if (this.add) {
      permissions.push("a");
    }
    if (this.create) {
      permissions.push("c");
    }
    if (this.write) {
      permissions.push("w");
    }
    if (this.delete) {
      permissions.push("d");
    }
    if (this.deleteVersion) {
      permissions.push("x");
    }
    if (this.tag) {
      permissions.push("t");
    }
    if (this.move) {
      permissions.push("m");
    }
    if (this.execute) {
      permissions.push("e");
    }
    if (this.setImmutabilityPolicy) {
      permissions.push("i");
    }
    if (this.permanentDelete) {
      permissions.push("y");
    }
    return permissions.join("");
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/ContainerSASPermissions.js
var ContainerSASPermissions = class _ContainerSASPermissions {
  constructor() {
    this.read = false;
    this.add = false;
    this.create = false;
    this.write = false;
    this.delete = false;
    this.deleteVersion = false;
    this.list = false;
    this.tag = false;
    this.move = false;
    this.execute = false;
    this.setImmutabilityPolicy = false;
    this.permanentDelete = false;
    this.filterByTags = false;
  }
  /**
   * Creates an {@link ContainerSASPermissions} from the specified permissions string. This method will throw an
   * Error if it encounters a character that does not correspond to a valid permission.
   *
   * @param permissions -
   */
  static parse(permissions) {
    const containerSASPermissions = new _ContainerSASPermissions();
    for (const char of permissions) {
      switch (char) {
        case "r":
          containerSASPermissions.read = true;
          break;
        case "a":
          containerSASPermissions.add = true;
          break;
        case "c":
          containerSASPermissions.create = true;
          break;
        case "w":
          containerSASPermissions.write = true;
          break;
        case "d":
          containerSASPermissions.delete = true;
          break;
        case "l":
          containerSASPermissions.list = true;
          break;
        case "t":
          containerSASPermissions.tag = true;
          break;
        case "x":
          containerSASPermissions.deleteVersion = true;
          break;
        case "m":
          containerSASPermissions.move = true;
          break;
        case "e":
          containerSASPermissions.execute = true;
          break;
        case "i":
          containerSASPermissions.setImmutabilityPolicy = true;
          break;
        case "y":
          containerSASPermissions.permanentDelete = true;
          break;
        case "f":
          containerSASPermissions.filterByTags = true;
          break;
        default:
          throw new RangeError(`Invalid permission ${char}`);
      }
    }
    return containerSASPermissions;
  }
  /**
   * Creates a {@link ContainerSASPermissions} from a raw object which contains same keys as it
   * and boolean values for them.
   *
   * @param permissionLike -
   */
  static from(permissionLike) {
    const containerSASPermissions = new _ContainerSASPermissions();
    if (permissionLike.read) {
      containerSASPermissions.read = true;
    }
    if (permissionLike.add) {
      containerSASPermissions.add = true;
    }
    if (permissionLike.create) {
      containerSASPermissions.create = true;
    }
    if (permissionLike.write) {
      containerSASPermissions.write = true;
    }
    if (permissionLike.delete) {
      containerSASPermissions.delete = true;
    }
    if (permissionLike.list) {
      containerSASPermissions.list = true;
    }
    if (permissionLike.deleteVersion) {
      containerSASPermissions.deleteVersion = true;
    }
    if (permissionLike.tag) {
      containerSASPermissions.tag = true;
    }
    if (permissionLike.move) {
      containerSASPermissions.move = true;
    }
    if (permissionLike.execute) {
      containerSASPermissions.execute = true;
    }
    if (permissionLike.setImmutabilityPolicy) {
      containerSASPermissions.setImmutabilityPolicy = true;
    }
    if (permissionLike.permanentDelete) {
      containerSASPermissions.permanentDelete = true;
    }
    if (permissionLike.filterByTags) {
      containerSASPermissions.filterByTags = true;
    }
    return containerSASPermissions;
  }
  /**
   * Converts the given permissions to a string. Using this method will guarantee the permissions are in an
   * order accepted by the service.
   *
   * The order of the characters should be as specified here to ensure correctness.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   */
  toString() {
    const permissions = [];
    if (this.read) {
      permissions.push("r");
    }
    if (this.add) {
      permissions.push("a");
    }
    if (this.create) {
      permissions.push("c");
    }
    if (this.write) {
      permissions.push("w");
    }
    if (this.delete) {
      permissions.push("d");
    }
    if (this.deleteVersion) {
      permissions.push("x");
    }
    if (this.list) {
      permissions.push("l");
    }
    if (this.tag) {
      permissions.push("t");
    }
    if (this.move) {
      permissions.push("m");
    }
    if (this.execute) {
      permissions.push("e");
    }
    if (this.setImmutabilityPolicy) {
      permissions.push("i");
    }
    if (this.permanentDelete) {
      permissions.push("y");
    }
    if (this.filterByTags) {
      permissions.push("f");
    }
    return permissions.join("");
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/credentials/UserDelegationKeyCredential.browser.js
var UserDelegationKeyCredential = class {
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/SasIPRange.js
function ipRangeToString(ipRange) {
  return ipRange.end ? `${ipRange.start}-${ipRange.end}` : ipRange.start;
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/SASQueryParameters.js
var SASProtocol;
(function(SASProtocol2) {
  SASProtocol2["Https"] = "https";
  SASProtocol2["HttpsAndHttp"] = "https,http";
})(SASProtocol || (SASProtocol = {}));
var SASQueryParameters = class {
  /**
   * Optional. IP range allowed for this SAS.
   *
   * @readonly
   */
  get ipRange() {
    if (this.ipRangeInner) {
      return {
        end: this.ipRangeInner.end,
        start: this.ipRangeInner.start
      };
    }
    return void 0;
  }
  constructor(version2, signature, permissionsOrOptions, services, resourceTypes, protocol, startsOn, expiresOn2, ipRange, identifier, resource, cacheControl, contentDisposition, contentEncoding, contentLanguage, contentType2, userDelegationKey, preauthorizedAgentObjectId, correlationId, encryptionScope2) {
    this.version = version2;
    this.signature = signature;
    if (permissionsOrOptions !== void 0 && typeof permissionsOrOptions !== "string") {
      this.permissions = permissionsOrOptions.permissions;
      this.services = permissionsOrOptions.services;
      this.resourceTypes = permissionsOrOptions.resourceTypes;
      this.protocol = permissionsOrOptions.protocol;
      this.startsOn = permissionsOrOptions.startsOn;
      this.expiresOn = permissionsOrOptions.expiresOn;
      this.ipRangeInner = permissionsOrOptions.ipRange;
      this.identifier = permissionsOrOptions.identifier;
      this.encryptionScope = permissionsOrOptions.encryptionScope;
      this.resource = permissionsOrOptions.resource;
      this.cacheControl = permissionsOrOptions.cacheControl;
      this.contentDisposition = permissionsOrOptions.contentDisposition;
      this.contentEncoding = permissionsOrOptions.contentEncoding;
      this.contentLanguage = permissionsOrOptions.contentLanguage;
      this.contentType = permissionsOrOptions.contentType;
      if (permissionsOrOptions.userDelegationKey) {
        this.signedOid = permissionsOrOptions.userDelegationKey.signedObjectId;
        this.signedTenantId = permissionsOrOptions.userDelegationKey.signedTenantId;
        this.signedStartsOn = permissionsOrOptions.userDelegationKey.signedStartsOn;
        this.signedExpiresOn = permissionsOrOptions.userDelegationKey.signedExpiresOn;
        this.signedService = permissionsOrOptions.userDelegationKey.signedService;
        this.signedVersion = permissionsOrOptions.userDelegationKey.signedVersion;
        this.preauthorizedAgentObjectId = permissionsOrOptions.preauthorizedAgentObjectId;
        this.correlationId = permissionsOrOptions.correlationId;
      }
    } else {
      this.services = services;
      this.resourceTypes = resourceTypes;
      this.expiresOn = expiresOn2;
      this.permissions = permissionsOrOptions;
      this.protocol = protocol;
      this.startsOn = startsOn;
      this.ipRangeInner = ipRange;
      this.encryptionScope = encryptionScope2;
      this.identifier = identifier;
      this.resource = resource;
      this.cacheControl = cacheControl;
      this.contentDisposition = contentDisposition;
      this.contentEncoding = contentEncoding;
      this.contentLanguage = contentLanguage;
      this.contentType = contentType2;
      if (userDelegationKey) {
        this.signedOid = userDelegationKey.signedObjectId;
        this.signedTenantId = userDelegationKey.signedTenantId;
        this.signedStartsOn = userDelegationKey.signedStartsOn;
        this.signedExpiresOn = userDelegationKey.signedExpiresOn;
        this.signedService = userDelegationKey.signedService;
        this.signedVersion = userDelegationKey.signedVersion;
        this.preauthorizedAgentObjectId = preauthorizedAgentObjectId;
        this.correlationId = correlationId;
      }
    }
  }
  /**
   * Encodes all SAS query parameters into a string that can be appended to a URL.
   *
   */
  toString() {
    const params = [
      "sv",
      "ss",
      "srt",
      "spr",
      "st",
      "se",
      "sip",
      "si",
      "ses",
      "skoid",
      // Signed object ID
      "sktid",
      // Signed tenant ID
      "skt",
      // Signed key start time
      "ske",
      // Signed key expiry time
      "sks",
      // Signed key service
      "skv",
      // Signed key version
      "sr",
      "sp",
      "sig",
      "rscc",
      "rscd",
      "rsce",
      "rscl",
      "rsct",
      "saoid",
      "scid"
    ];
    const queries = [];
    for (const param of params) {
      switch (param) {
        case "sv":
          this.tryAppendQueryParameter(queries, param, this.version);
          break;
        case "ss":
          this.tryAppendQueryParameter(queries, param, this.services);
          break;
        case "srt":
          this.tryAppendQueryParameter(queries, param, this.resourceTypes);
          break;
        case "spr":
          this.tryAppendQueryParameter(queries, param, this.protocol);
          break;
        case "st":
          this.tryAppendQueryParameter(queries, param, this.startsOn ? truncatedISO8061Date(this.startsOn, false) : void 0);
          break;
        case "se":
          this.tryAppendQueryParameter(queries, param, this.expiresOn ? truncatedISO8061Date(this.expiresOn, false) : void 0);
          break;
        case "sip":
          this.tryAppendQueryParameter(queries, param, this.ipRange ? ipRangeToString(this.ipRange) : void 0);
          break;
        case "si":
          this.tryAppendQueryParameter(queries, param, this.identifier);
          break;
        case "ses":
          this.tryAppendQueryParameter(queries, param, this.encryptionScope);
          break;
        case "skoid":
          this.tryAppendQueryParameter(queries, param, this.signedOid);
          break;
        case "sktid":
          this.tryAppendQueryParameter(queries, param, this.signedTenantId);
          break;
        case "skt":
          this.tryAppendQueryParameter(queries, param, this.signedStartsOn ? truncatedISO8061Date(this.signedStartsOn, false) : void 0);
          break;
        case "ske":
          this.tryAppendQueryParameter(queries, param, this.signedExpiresOn ? truncatedISO8061Date(this.signedExpiresOn, false) : void 0);
          break;
        case "sks":
          this.tryAppendQueryParameter(queries, param, this.signedService);
          break;
        case "skv":
          this.tryAppendQueryParameter(queries, param, this.signedVersion);
          break;
        case "sr":
          this.tryAppendQueryParameter(queries, param, this.resource);
          break;
        case "sp":
          this.tryAppendQueryParameter(queries, param, this.permissions);
          break;
        case "sig":
          this.tryAppendQueryParameter(queries, param, this.signature);
          break;
        case "rscc":
          this.tryAppendQueryParameter(queries, param, this.cacheControl);
          break;
        case "rscd":
          this.tryAppendQueryParameter(queries, param, this.contentDisposition);
          break;
        case "rsce":
          this.tryAppendQueryParameter(queries, param, this.contentEncoding);
          break;
        case "rscl":
          this.tryAppendQueryParameter(queries, param, this.contentLanguage);
          break;
        case "rsct":
          this.tryAppendQueryParameter(queries, param, this.contentType);
          break;
        case "saoid":
          this.tryAppendQueryParameter(queries, param, this.preauthorizedAgentObjectId);
          break;
        case "scid":
          this.tryAppendQueryParameter(queries, param, this.correlationId);
          break;
      }
    }
    return queries.join("&");
  }
  /**
   * A private helper method used to filter and append query key/value pairs into an array.
   *
   * @param queries -
   * @param key -
   * @param value -
   */
  tryAppendQueryParameter(queries, key, value) {
    if (!value) {
      return;
    }
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);
    if (key.length > 0 && value.length > 0) {
      queries.push(`${key}=${value}`);
    }
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/BlobSASSignatureValues.js
function generateBlobSASQueryParameters(blobSASSignatureValues, sharedKeyCredentialOrUserDelegationKey, accountName) {
  return generateBlobSASQueryParametersInternal(blobSASSignatureValues, sharedKeyCredentialOrUserDelegationKey, accountName).sasQueryParameters;
}
function generateBlobSASQueryParametersInternal(blobSASSignatureValues, sharedKeyCredentialOrUserDelegationKey, accountName) {
  const version2 = blobSASSignatureValues.version ? blobSASSignatureValues.version : SERVICE_VERSION;
  const sharedKeyCredential = sharedKeyCredentialOrUserDelegationKey instanceof StorageSharedKeyCredential ? sharedKeyCredentialOrUserDelegationKey : void 0;
  let userDelegationKeyCredential;
  if (sharedKeyCredential === void 0 && accountName !== void 0) {
    userDelegationKeyCredential = new UserDelegationKeyCredential(accountName, sharedKeyCredentialOrUserDelegationKey);
  }
  if (sharedKeyCredential === void 0 && userDelegationKeyCredential === void 0) {
    throw TypeError("Invalid sharedKeyCredential, userDelegationKey or accountName.");
  }
  if (version2 >= "2020-12-06") {
    if (sharedKeyCredential !== void 0) {
      return generateBlobSASQueryParameters20201206(blobSASSignatureValues, sharedKeyCredential);
    } else {
      return generateBlobSASQueryParametersUDK20201206(blobSASSignatureValues, userDelegationKeyCredential);
    }
  }
  if (version2 >= "2018-11-09") {
    if (sharedKeyCredential !== void 0) {
      return generateBlobSASQueryParameters20181109(blobSASSignatureValues, sharedKeyCredential);
    } else {
      if (version2 >= "2020-02-10") {
        return generateBlobSASQueryParametersUDK20200210(blobSASSignatureValues, userDelegationKeyCredential);
      } else {
        return generateBlobSASQueryParametersUDK20181109(blobSASSignatureValues, userDelegationKeyCredential);
      }
    }
  }
  if (version2 >= "2015-04-05") {
    if (sharedKeyCredential !== void 0) {
      return generateBlobSASQueryParameters20150405(blobSASSignatureValues, sharedKeyCredential);
    } else {
      throw new RangeError("'version' must be >= '2018-11-09' when generating user delegation SAS using user delegation key.");
    }
  }
  throw new RangeError("'version' must be >= '2015-04-05'.");
}
function generateBlobSASQueryParameters20150405(blobSASSignatureValues, sharedKeyCredential) {
  blobSASSignatureValues = SASSignatureValuesSanityCheckAndAutofill(blobSASSignatureValues);
  if (!blobSASSignatureValues.identifier && !(blobSASSignatureValues.permissions && blobSASSignatureValues.expiresOn)) {
    throw new RangeError("Must provide 'permissions' and 'expiresOn' for Blob SAS generation when 'identifier' is not provided.");
  }
  let resource = "c";
  if (blobSASSignatureValues.blobName) {
    resource = "b";
  }
  let verifiedPermissions;
  if (blobSASSignatureValues.permissions) {
    if (blobSASSignatureValues.blobName) {
      verifiedPermissions = BlobSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    } else {
      verifiedPermissions = ContainerSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    }
  }
  const stringToSign = [
    verifiedPermissions ? verifiedPermissions : "",
    blobSASSignatureValues.startsOn ? truncatedISO8061Date(blobSASSignatureValues.startsOn, false) : "",
    blobSASSignatureValues.expiresOn ? truncatedISO8061Date(blobSASSignatureValues.expiresOn, false) : "",
    getCanonicalName(sharedKeyCredential.accountName, blobSASSignatureValues.containerName, blobSASSignatureValues.blobName),
    blobSASSignatureValues.identifier,
    blobSASSignatureValues.ipRange ? ipRangeToString(blobSASSignatureValues.ipRange) : "",
    blobSASSignatureValues.protocol ? blobSASSignatureValues.protocol : "",
    blobSASSignatureValues.version,
    blobSASSignatureValues.cacheControl ? blobSASSignatureValues.cacheControl : "",
    blobSASSignatureValues.contentDisposition ? blobSASSignatureValues.contentDisposition : "",
    blobSASSignatureValues.contentEncoding ? blobSASSignatureValues.contentEncoding : "",
    blobSASSignatureValues.contentLanguage ? blobSASSignatureValues.contentLanguage : "",
    blobSASSignatureValues.contentType ? blobSASSignatureValues.contentType : ""
  ].join("\n");
  const signature = sharedKeyCredential.computeHMACSHA256(stringToSign);
  return {
    sasQueryParameters: new SASQueryParameters(blobSASSignatureValues.version, signature, verifiedPermissions, void 0, void 0, blobSASSignatureValues.protocol, blobSASSignatureValues.startsOn, blobSASSignatureValues.expiresOn, blobSASSignatureValues.ipRange, blobSASSignatureValues.identifier, resource, blobSASSignatureValues.cacheControl, blobSASSignatureValues.contentDisposition, blobSASSignatureValues.contentEncoding, blobSASSignatureValues.contentLanguage, blobSASSignatureValues.contentType),
    stringToSign
  };
}
function generateBlobSASQueryParameters20181109(blobSASSignatureValues, sharedKeyCredential) {
  blobSASSignatureValues = SASSignatureValuesSanityCheckAndAutofill(blobSASSignatureValues);
  if (!blobSASSignatureValues.identifier && !(blobSASSignatureValues.permissions && blobSASSignatureValues.expiresOn)) {
    throw new RangeError("Must provide 'permissions' and 'expiresOn' for Blob SAS generation when 'identifier' is not provided.");
  }
  let resource = "c";
  let timestamp = blobSASSignatureValues.snapshotTime;
  if (blobSASSignatureValues.blobName) {
    resource = "b";
    if (blobSASSignatureValues.snapshotTime) {
      resource = "bs";
    } else if (blobSASSignatureValues.versionId) {
      resource = "bv";
      timestamp = blobSASSignatureValues.versionId;
    }
  }
  let verifiedPermissions;
  if (blobSASSignatureValues.permissions) {
    if (blobSASSignatureValues.blobName) {
      verifiedPermissions = BlobSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    } else {
      verifiedPermissions = ContainerSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    }
  }
  const stringToSign = [
    verifiedPermissions ? verifiedPermissions : "",
    blobSASSignatureValues.startsOn ? truncatedISO8061Date(blobSASSignatureValues.startsOn, false) : "",
    blobSASSignatureValues.expiresOn ? truncatedISO8061Date(blobSASSignatureValues.expiresOn, false) : "",
    getCanonicalName(sharedKeyCredential.accountName, blobSASSignatureValues.containerName, blobSASSignatureValues.blobName),
    blobSASSignatureValues.identifier,
    blobSASSignatureValues.ipRange ? ipRangeToString(blobSASSignatureValues.ipRange) : "",
    blobSASSignatureValues.protocol ? blobSASSignatureValues.protocol : "",
    blobSASSignatureValues.version,
    resource,
    timestamp,
    blobSASSignatureValues.cacheControl ? blobSASSignatureValues.cacheControl : "",
    blobSASSignatureValues.contentDisposition ? blobSASSignatureValues.contentDisposition : "",
    blobSASSignatureValues.contentEncoding ? blobSASSignatureValues.contentEncoding : "",
    blobSASSignatureValues.contentLanguage ? blobSASSignatureValues.contentLanguage : "",
    blobSASSignatureValues.contentType ? blobSASSignatureValues.contentType : ""
  ].join("\n");
  const signature = sharedKeyCredential.computeHMACSHA256(stringToSign);
  return {
    sasQueryParameters: new SASQueryParameters(blobSASSignatureValues.version, signature, verifiedPermissions, void 0, void 0, blobSASSignatureValues.protocol, blobSASSignatureValues.startsOn, blobSASSignatureValues.expiresOn, blobSASSignatureValues.ipRange, blobSASSignatureValues.identifier, resource, blobSASSignatureValues.cacheControl, blobSASSignatureValues.contentDisposition, blobSASSignatureValues.contentEncoding, blobSASSignatureValues.contentLanguage, blobSASSignatureValues.contentType),
    stringToSign
  };
}
function generateBlobSASQueryParameters20201206(blobSASSignatureValues, sharedKeyCredential) {
  blobSASSignatureValues = SASSignatureValuesSanityCheckAndAutofill(blobSASSignatureValues);
  if (!blobSASSignatureValues.identifier && !(blobSASSignatureValues.permissions && blobSASSignatureValues.expiresOn)) {
    throw new RangeError("Must provide 'permissions' and 'expiresOn' for Blob SAS generation when 'identifier' is not provided.");
  }
  let resource = "c";
  let timestamp = blobSASSignatureValues.snapshotTime;
  if (blobSASSignatureValues.blobName) {
    resource = "b";
    if (blobSASSignatureValues.snapshotTime) {
      resource = "bs";
    } else if (blobSASSignatureValues.versionId) {
      resource = "bv";
      timestamp = blobSASSignatureValues.versionId;
    }
  }
  let verifiedPermissions;
  if (blobSASSignatureValues.permissions) {
    if (blobSASSignatureValues.blobName) {
      verifiedPermissions = BlobSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    } else {
      verifiedPermissions = ContainerSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    }
  }
  const stringToSign = [
    verifiedPermissions ? verifiedPermissions : "",
    blobSASSignatureValues.startsOn ? truncatedISO8061Date(blobSASSignatureValues.startsOn, false) : "",
    blobSASSignatureValues.expiresOn ? truncatedISO8061Date(blobSASSignatureValues.expiresOn, false) : "",
    getCanonicalName(sharedKeyCredential.accountName, blobSASSignatureValues.containerName, blobSASSignatureValues.blobName),
    blobSASSignatureValues.identifier,
    blobSASSignatureValues.ipRange ? ipRangeToString(blobSASSignatureValues.ipRange) : "",
    blobSASSignatureValues.protocol ? blobSASSignatureValues.protocol : "",
    blobSASSignatureValues.version,
    resource,
    timestamp,
    blobSASSignatureValues.encryptionScope,
    blobSASSignatureValues.cacheControl ? blobSASSignatureValues.cacheControl : "",
    blobSASSignatureValues.contentDisposition ? blobSASSignatureValues.contentDisposition : "",
    blobSASSignatureValues.contentEncoding ? blobSASSignatureValues.contentEncoding : "",
    blobSASSignatureValues.contentLanguage ? blobSASSignatureValues.contentLanguage : "",
    blobSASSignatureValues.contentType ? blobSASSignatureValues.contentType : ""
  ].join("\n");
  const signature = sharedKeyCredential.computeHMACSHA256(stringToSign);
  return {
    sasQueryParameters: new SASQueryParameters(blobSASSignatureValues.version, signature, verifiedPermissions, void 0, void 0, blobSASSignatureValues.protocol, blobSASSignatureValues.startsOn, blobSASSignatureValues.expiresOn, blobSASSignatureValues.ipRange, blobSASSignatureValues.identifier, resource, blobSASSignatureValues.cacheControl, blobSASSignatureValues.contentDisposition, blobSASSignatureValues.contentEncoding, blobSASSignatureValues.contentLanguage, blobSASSignatureValues.contentType, void 0, void 0, void 0, blobSASSignatureValues.encryptionScope),
    stringToSign
  };
}
function generateBlobSASQueryParametersUDK20181109(blobSASSignatureValues, userDelegationKeyCredential) {
  blobSASSignatureValues = SASSignatureValuesSanityCheckAndAutofill(blobSASSignatureValues);
  if (!blobSASSignatureValues.permissions || !blobSASSignatureValues.expiresOn) {
    throw new RangeError("Must provide 'permissions' and 'expiresOn' for Blob SAS generation when generating user delegation SAS.");
  }
  let resource = "c";
  let timestamp = blobSASSignatureValues.snapshotTime;
  if (blobSASSignatureValues.blobName) {
    resource = "b";
    if (blobSASSignatureValues.snapshotTime) {
      resource = "bs";
    } else if (blobSASSignatureValues.versionId) {
      resource = "bv";
      timestamp = blobSASSignatureValues.versionId;
    }
  }
  let verifiedPermissions;
  if (blobSASSignatureValues.permissions) {
    if (blobSASSignatureValues.blobName) {
      verifiedPermissions = BlobSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    } else {
      verifiedPermissions = ContainerSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    }
  }
  const stringToSign = [
    verifiedPermissions ? verifiedPermissions : "",
    blobSASSignatureValues.startsOn ? truncatedISO8061Date(blobSASSignatureValues.startsOn, false) : "",
    blobSASSignatureValues.expiresOn ? truncatedISO8061Date(blobSASSignatureValues.expiresOn, false) : "",
    getCanonicalName(userDelegationKeyCredential.accountName, blobSASSignatureValues.containerName, blobSASSignatureValues.blobName),
    userDelegationKeyCredential.userDelegationKey.signedObjectId,
    userDelegationKeyCredential.userDelegationKey.signedTenantId,
    userDelegationKeyCredential.userDelegationKey.signedStartsOn ? truncatedISO8061Date(userDelegationKeyCredential.userDelegationKey.signedStartsOn, false) : "",
    userDelegationKeyCredential.userDelegationKey.signedExpiresOn ? truncatedISO8061Date(userDelegationKeyCredential.userDelegationKey.signedExpiresOn, false) : "",
    userDelegationKeyCredential.userDelegationKey.signedService,
    userDelegationKeyCredential.userDelegationKey.signedVersion,
    blobSASSignatureValues.ipRange ? ipRangeToString(blobSASSignatureValues.ipRange) : "",
    blobSASSignatureValues.protocol ? blobSASSignatureValues.protocol : "",
    blobSASSignatureValues.version,
    resource,
    timestamp,
    blobSASSignatureValues.cacheControl,
    blobSASSignatureValues.contentDisposition,
    blobSASSignatureValues.contentEncoding,
    blobSASSignatureValues.contentLanguage,
    blobSASSignatureValues.contentType
  ].join("\n");
  const signature = userDelegationKeyCredential.computeHMACSHA256(stringToSign);
  return {
    sasQueryParameters: new SASQueryParameters(blobSASSignatureValues.version, signature, verifiedPermissions, void 0, void 0, blobSASSignatureValues.protocol, blobSASSignatureValues.startsOn, blobSASSignatureValues.expiresOn, blobSASSignatureValues.ipRange, blobSASSignatureValues.identifier, resource, blobSASSignatureValues.cacheControl, blobSASSignatureValues.contentDisposition, blobSASSignatureValues.contentEncoding, blobSASSignatureValues.contentLanguage, blobSASSignatureValues.contentType, userDelegationKeyCredential.userDelegationKey),
    stringToSign
  };
}
function generateBlobSASQueryParametersUDK20200210(blobSASSignatureValues, userDelegationKeyCredential) {
  blobSASSignatureValues = SASSignatureValuesSanityCheckAndAutofill(blobSASSignatureValues);
  if (!blobSASSignatureValues.permissions || !blobSASSignatureValues.expiresOn) {
    throw new RangeError("Must provide 'permissions' and 'expiresOn' for Blob SAS generation when generating user delegation SAS.");
  }
  let resource = "c";
  let timestamp = blobSASSignatureValues.snapshotTime;
  if (blobSASSignatureValues.blobName) {
    resource = "b";
    if (blobSASSignatureValues.snapshotTime) {
      resource = "bs";
    } else if (blobSASSignatureValues.versionId) {
      resource = "bv";
      timestamp = blobSASSignatureValues.versionId;
    }
  }
  let verifiedPermissions;
  if (blobSASSignatureValues.permissions) {
    if (blobSASSignatureValues.blobName) {
      verifiedPermissions = BlobSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    } else {
      verifiedPermissions = ContainerSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    }
  }
  const stringToSign = [
    verifiedPermissions ? verifiedPermissions : "",
    blobSASSignatureValues.startsOn ? truncatedISO8061Date(blobSASSignatureValues.startsOn, false) : "",
    blobSASSignatureValues.expiresOn ? truncatedISO8061Date(blobSASSignatureValues.expiresOn, false) : "",
    getCanonicalName(userDelegationKeyCredential.accountName, blobSASSignatureValues.containerName, blobSASSignatureValues.blobName),
    userDelegationKeyCredential.userDelegationKey.signedObjectId,
    userDelegationKeyCredential.userDelegationKey.signedTenantId,
    userDelegationKeyCredential.userDelegationKey.signedStartsOn ? truncatedISO8061Date(userDelegationKeyCredential.userDelegationKey.signedStartsOn, false) : "",
    userDelegationKeyCredential.userDelegationKey.signedExpiresOn ? truncatedISO8061Date(userDelegationKeyCredential.userDelegationKey.signedExpiresOn, false) : "",
    userDelegationKeyCredential.userDelegationKey.signedService,
    userDelegationKeyCredential.userDelegationKey.signedVersion,
    blobSASSignatureValues.preauthorizedAgentObjectId,
    void 0,
    // agentObjectId
    blobSASSignatureValues.correlationId,
    blobSASSignatureValues.ipRange ? ipRangeToString(blobSASSignatureValues.ipRange) : "",
    blobSASSignatureValues.protocol ? blobSASSignatureValues.protocol : "",
    blobSASSignatureValues.version,
    resource,
    timestamp,
    blobSASSignatureValues.cacheControl,
    blobSASSignatureValues.contentDisposition,
    blobSASSignatureValues.contentEncoding,
    blobSASSignatureValues.contentLanguage,
    blobSASSignatureValues.contentType
  ].join("\n");
  const signature = userDelegationKeyCredential.computeHMACSHA256(stringToSign);
  return {
    sasQueryParameters: new SASQueryParameters(blobSASSignatureValues.version, signature, verifiedPermissions, void 0, void 0, blobSASSignatureValues.protocol, blobSASSignatureValues.startsOn, blobSASSignatureValues.expiresOn, blobSASSignatureValues.ipRange, blobSASSignatureValues.identifier, resource, blobSASSignatureValues.cacheControl, blobSASSignatureValues.contentDisposition, blobSASSignatureValues.contentEncoding, blobSASSignatureValues.contentLanguage, blobSASSignatureValues.contentType, userDelegationKeyCredential.userDelegationKey, blobSASSignatureValues.preauthorizedAgentObjectId, blobSASSignatureValues.correlationId),
    stringToSign
  };
}
function generateBlobSASQueryParametersUDK20201206(blobSASSignatureValues, userDelegationKeyCredential) {
  blobSASSignatureValues = SASSignatureValuesSanityCheckAndAutofill(blobSASSignatureValues);
  if (!blobSASSignatureValues.permissions || !blobSASSignatureValues.expiresOn) {
    throw new RangeError("Must provide 'permissions' and 'expiresOn' for Blob SAS generation when generating user delegation SAS.");
  }
  let resource = "c";
  let timestamp = blobSASSignatureValues.snapshotTime;
  if (blobSASSignatureValues.blobName) {
    resource = "b";
    if (blobSASSignatureValues.snapshotTime) {
      resource = "bs";
    } else if (blobSASSignatureValues.versionId) {
      resource = "bv";
      timestamp = blobSASSignatureValues.versionId;
    }
  }
  let verifiedPermissions;
  if (blobSASSignatureValues.permissions) {
    if (blobSASSignatureValues.blobName) {
      verifiedPermissions = BlobSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    } else {
      verifiedPermissions = ContainerSASPermissions.parse(blobSASSignatureValues.permissions.toString()).toString();
    }
  }
  const stringToSign = [
    verifiedPermissions ? verifiedPermissions : "",
    blobSASSignatureValues.startsOn ? truncatedISO8061Date(blobSASSignatureValues.startsOn, false) : "",
    blobSASSignatureValues.expiresOn ? truncatedISO8061Date(blobSASSignatureValues.expiresOn, false) : "",
    getCanonicalName(userDelegationKeyCredential.accountName, blobSASSignatureValues.containerName, blobSASSignatureValues.blobName),
    userDelegationKeyCredential.userDelegationKey.signedObjectId,
    userDelegationKeyCredential.userDelegationKey.signedTenantId,
    userDelegationKeyCredential.userDelegationKey.signedStartsOn ? truncatedISO8061Date(userDelegationKeyCredential.userDelegationKey.signedStartsOn, false) : "",
    userDelegationKeyCredential.userDelegationKey.signedExpiresOn ? truncatedISO8061Date(userDelegationKeyCredential.userDelegationKey.signedExpiresOn, false) : "",
    userDelegationKeyCredential.userDelegationKey.signedService,
    userDelegationKeyCredential.userDelegationKey.signedVersion,
    blobSASSignatureValues.preauthorizedAgentObjectId,
    void 0,
    // agentObjectId
    blobSASSignatureValues.correlationId,
    blobSASSignatureValues.ipRange ? ipRangeToString(blobSASSignatureValues.ipRange) : "",
    blobSASSignatureValues.protocol ? blobSASSignatureValues.protocol : "",
    blobSASSignatureValues.version,
    resource,
    timestamp,
    blobSASSignatureValues.encryptionScope,
    blobSASSignatureValues.cacheControl,
    blobSASSignatureValues.contentDisposition,
    blobSASSignatureValues.contentEncoding,
    blobSASSignatureValues.contentLanguage,
    blobSASSignatureValues.contentType
  ].join("\n");
  const signature = userDelegationKeyCredential.computeHMACSHA256(stringToSign);
  return {
    sasQueryParameters: new SASQueryParameters(blobSASSignatureValues.version, signature, verifiedPermissions, void 0, void 0, blobSASSignatureValues.protocol, blobSASSignatureValues.startsOn, blobSASSignatureValues.expiresOn, blobSASSignatureValues.ipRange, blobSASSignatureValues.identifier, resource, blobSASSignatureValues.cacheControl, blobSASSignatureValues.contentDisposition, blobSASSignatureValues.contentEncoding, blobSASSignatureValues.contentLanguage, blobSASSignatureValues.contentType, userDelegationKeyCredential.userDelegationKey, blobSASSignatureValues.preauthorizedAgentObjectId, blobSASSignatureValues.correlationId, blobSASSignatureValues.encryptionScope),
    stringToSign
  };
}
function getCanonicalName(accountName, containerName, blobName) {
  const elements = [`/blob/${accountName}/${containerName}`];
  if (blobName) {
    elements.push(`/${blobName}`);
  }
  return elements.join("");
}
function SASSignatureValuesSanityCheckAndAutofill(blobSASSignatureValues) {
  const version2 = blobSASSignatureValues.version ? blobSASSignatureValues.version : SERVICE_VERSION;
  if (blobSASSignatureValues.snapshotTime && version2 < "2018-11-09") {
    throw RangeError("'version' must be >= '2018-11-09' when providing 'snapshotTime'.");
  }
  if (blobSASSignatureValues.blobName === void 0 && blobSASSignatureValues.snapshotTime) {
    throw RangeError("Must provide 'blobName' when providing 'snapshotTime'.");
  }
  if (blobSASSignatureValues.versionId && version2 < "2019-10-10") {
    throw RangeError("'version' must be >= '2019-10-10' when providing 'versionId'.");
  }
  if (blobSASSignatureValues.blobName === void 0 && blobSASSignatureValues.versionId) {
    throw RangeError("Must provide 'blobName' when providing 'versionId'.");
  }
  if (blobSASSignatureValues.permissions && blobSASSignatureValues.permissions.setImmutabilityPolicy && version2 < "2020-08-04") {
    throw RangeError("'version' must be >= '2020-08-04' when provided 'i' permission.");
  }
  if (blobSASSignatureValues.permissions && blobSASSignatureValues.permissions.deleteVersion && version2 < "2019-10-10") {
    throw RangeError("'version' must be >= '2019-10-10' when providing 'x' permission.");
  }
  if (blobSASSignatureValues.permissions && blobSASSignatureValues.permissions.permanentDelete && version2 < "2019-10-10") {
    throw RangeError("'version' must be >= '2019-10-10' when providing 'y' permission.");
  }
  if (blobSASSignatureValues.permissions && blobSASSignatureValues.permissions.tag && version2 < "2019-12-12") {
    throw RangeError("'version' must be >= '2019-12-12' when providing 't' permission.");
  }
  if (version2 < "2020-02-10" && blobSASSignatureValues.permissions && (blobSASSignatureValues.permissions.move || blobSASSignatureValues.permissions.execute)) {
    throw RangeError("'version' must be >= '2020-02-10' when providing the 'm' or 'e' permission.");
  }
  if (version2 < "2021-04-10" && blobSASSignatureValues.permissions && blobSASSignatureValues.permissions.filterByTags) {
    throw RangeError("'version' must be >= '2021-04-10' when providing the 'f' permission.");
  }
  if (version2 < "2020-02-10" && (blobSASSignatureValues.preauthorizedAgentObjectId || blobSASSignatureValues.correlationId)) {
    throw RangeError("'version' must be >= '2020-02-10' when providing 'preauthorizedAgentObjectId' or 'correlationId'.");
  }
  if (blobSASSignatureValues.encryptionScope && version2 < "2020-12-06") {
    throw RangeError("'version' must be >= '2020-12-06' when provided 'encryptionScope' in SAS.");
  }
  blobSASSignatureValues.version = version2;
  return blobSASSignatureValues;
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BlobLeaseClient.js
var BlobLeaseClient = class {
  /**
   * Gets the lease Id.
   *
   * @readonly
   */
  get leaseId() {
    return this._leaseId;
  }
  /**
   * Gets the url.
   *
   * @readonly
   */
  get url() {
    return this._url;
  }
  /**
   * Creates an instance of BlobLeaseClient.
   * @param client - The client to make the lease operation requests.
   * @param leaseId - Initial proposed lease id.
   */
  constructor(client, leaseId2) {
    const clientContext = client.storageClientContext;
    this._url = client.url;
    if (client.name === void 0) {
      this._isContainer = true;
      this._containerOrBlobOperation = clientContext.container;
    } else {
      this._isContainer = false;
      this._containerOrBlobOperation = clientContext.blob;
    }
    if (!leaseId2) {
      leaseId2 = randomUUID();
    }
    this._leaseId = leaseId2;
  }
  /**
   * Establishes and manages a lock on a container for delete operations, or on a blob
   * for write and delete operations.
   * The lock duration can be 15 to 60 seconds, or can be infinite.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-container
   * and
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-blob
   *
   * @param duration - Must be between 15 to 60 seconds, or infinite (-1)
   * @param options - option to configure lease management operations.
   * @returns Response data for acquire lease operation.
   */
  async acquireLease(duration2, options = {}) {
    var _a3, _b2, _c2, _d2, _e;
    if (this._isContainer && (((_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.ifMatch) && ((_b2 = options.conditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch) !== ETagNone || ((_c2 = options.conditions) === null || _c2 === void 0 ? void 0 : _c2.ifNoneMatch) && ((_d2 = options.conditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch) !== ETagNone || ((_e = options.conditions) === null || _e === void 0 ? void 0 : _e.tagConditions))) {
      throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
    }
    return tracingClient.withSpan("BlobLeaseClient-acquireLease", options, async (updatedOptions) => {
      var _a4;
      return assertResponse(await this._containerOrBlobOperation.acquireLease({
        abortSignal: options.abortSignal,
        duration: duration2,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a4 = options.conditions) === null || _a4 === void 0 ? void 0 : _a4.tagConditions }),
        proposedLeaseId: this._leaseId,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * To change the ID of the lease.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-container
   * and
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-blob
   *
   * @param proposedLeaseId - the proposed new lease Id.
   * @param options - option to configure lease management operations.
   * @returns Response data for change lease operation.
   */
  async changeLease(proposedLeaseId2, options = {}) {
    var _a3, _b2, _c2, _d2, _e;
    if (this._isContainer && (((_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.ifMatch) && ((_b2 = options.conditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch) !== ETagNone || ((_c2 = options.conditions) === null || _c2 === void 0 ? void 0 : _c2.ifNoneMatch) && ((_d2 = options.conditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch) !== ETagNone || ((_e = options.conditions) === null || _e === void 0 ? void 0 : _e.tagConditions))) {
      throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
    }
    return tracingClient.withSpan("BlobLeaseClient-changeLease", options, async (updatedOptions) => {
      var _a4;
      const response = assertResponse(await this._containerOrBlobOperation.changeLease(this._leaseId, proposedLeaseId2, {
        abortSignal: options.abortSignal,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a4 = options.conditions) === null || _a4 === void 0 ? void 0 : _a4.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
      this._leaseId = proposedLeaseId2;
      return response;
    });
  }
  /**
   * To free the lease if it is no longer needed so that another client may
   * immediately acquire a lease against the container or the blob.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-container
   * and
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-blob
   *
   * @param options - option to configure lease management operations.
   * @returns Response data for release lease operation.
   */
  async releaseLease(options = {}) {
    var _a3, _b2, _c2, _d2, _e;
    if (this._isContainer && (((_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.ifMatch) && ((_b2 = options.conditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch) !== ETagNone || ((_c2 = options.conditions) === null || _c2 === void 0 ? void 0 : _c2.ifNoneMatch) && ((_d2 = options.conditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch) !== ETagNone || ((_e = options.conditions) === null || _e === void 0 ? void 0 : _e.tagConditions))) {
      throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
    }
    return tracingClient.withSpan("BlobLeaseClient-releaseLease", options, async (updatedOptions) => {
      var _a4;
      return assertResponse(await this._containerOrBlobOperation.releaseLease(this._leaseId, {
        abortSignal: options.abortSignal,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a4 = options.conditions) === null || _a4 === void 0 ? void 0 : _a4.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * To renew the lease.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-container
   * and
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-blob
   *
   * @param options - Optional option to configure lease management operations.
   * @returns Response data for renew lease operation.
   */
  async renewLease(options = {}) {
    var _a3, _b2, _c2, _d2, _e;
    if (this._isContainer && (((_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.ifMatch) && ((_b2 = options.conditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch) !== ETagNone || ((_c2 = options.conditions) === null || _c2 === void 0 ? void 0 : _c2.ifNoneMatch) && ((_d2 = options.conditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch) !== ETagNone || ((_e = options.conditions) === null || _e === void 0 ? void 0 : _e.tagConditions))) {
      throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
    }
    return tracingClient.withSpan("BlobLeaseClient-renewLease", options, async (updatedOptions) => {
      var _a4;
      return this._containerOrBlobOperation.renewLease(this._leaseId, {
        abortSignal: options.abortSignal,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a4 = options.conditions) === null || _a4 === void 0 ? void 0 : _a4.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      });
    });
  }
  /**
   * To end the lease but ensure that another client cannot acquire a new lease
   * until the current lease period has expired.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-container
   * and
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/lease-blob
   *
   * @param breakPeriod - Break period
   * @param options - Optional options to configure lease management operations.
   * @returns Response data for break lease operation.
   */
  async breakLease(breakPeriod2, options = {}) {
    var _a3, _b2, _c2, _d2, _e;
    if (this._isContainer && (((_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.ifMatch) && ((_b2 = options.conditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch) !== ETagNone || ((_c2 = options.conditions) === null || _c2 === void 0 ? void 0 : _c2.ifNoneMatch) && ((_d2 = options.conditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch) !== ETagNone || ((_e = options.conditions) === null || _e === void 0 ? void 0 : _e.tagConditions))) {
      throw new RangeError("The IfMatch, IfNoneMatch and tags access conditions are ignored by the service. Values other than undefined or their default values are not acceptable.");
    }
    return tracingClient.withSpan("BlobLeaseClient-breakLease", options, async (updatedOptions) => {
      var _a4;
      const operationOptions = {
        abortSignal: options.abortSignal,
        breakPeriod: breakPeriod2,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a4 = options.conditions) === null || _a4 === void 0 ? void 0 : _a4.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      };
      return assertResponse(await this._containerOrBlobOperation.breakLease(operationOptions));
    });
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BlobDownloadResponse.browser.js
var BlobDownloadResponse = 1;

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BlobQueryResponse.browser.js
var BlobQueryResponse = class {
  /**
   * Indicates that the service supports
   * requests for partial file content.
   *
   * @readonly
   */
  get acceptRanges() {
    return this.originalResponse.acceptRanges;
  }
  /**
   * Returns if it was previously specified
   * for the file.
   *
   * @readonly
   */
  get cacheControl() {
    return this.originalResponse.cacheControl;
  }
  /**
   * Returns the value that was specified
   * for the 'x-ms-content-disposition' header and specifies how to process the
   * response.
   *
   * @readonly
   */
  get contentDisposition() {
    return this.originalResponse.contentDisposition;
  }
  /**
   * Returns the value that was specified
   * for the Content-Encoding request header.
   *
   * @readonly
   */
  get contentEncoding() {
    return this.originalResponse.contentEncoding;
  }
  /**
   * Returns the value that was specified
   * for the Content-Language request header.
   *
   * @readonly
   */
  get contentLanguage() {
    return this.originalResponse.contentLanguage;
  }
  /**
   * The current sequence number for a
   * page blob. This header is not returned for block blobs or append blobs.
   *
   * @readonly
   */
  get blobSequenceNumber() {
    return this.originalResponse.blobSequenceNumber;
  }
  /**
   * The blob's type. Possible values include:
   * 'BlockBlob', 'PageBlob', 'AppendBlob'.
   *
   * @readonly
   */
  get blobType() {
    return this.originalResponse.blobType;
  }
  /**
   * The number of bytes present in the
   * response body.
   *
   * @readonly
   */
  get contentLength() {
    return this.originalResponse.contentLength;
  }
  /**
   * If the file has an MD5 hash and the
   * request is to read the full file, this response header is returned so that
   * the client can check for message content integrity. If the request is to
   * read a specified range and the 'x-ms-range-get-content-md5' is set to
   * true, then the request returns an MD5 hash for the range, as long as the
   * range size is less than or equal to 4 MB. If neither of these sets of
   * conditions is true, then no value is returned for the 'Content-MD5'
   * header.
   *
   * @readonly
   */
  get contentMD5() {
    return this.originalResponse.contentMD5;
  }
  /**
   * Indicates the range of bytes returned if
   * the client requested a subset of the file by setting the Range request
   * header.
   *
   * @readonly
   */
  get contentRange() {
    return this.originalResponse.contentRange;
  }
  /**
   * The content type specified for the file.
   * The default content type is 'application/octet-stream'
   *
   * @readonly
   */
  get contentType() {
    return this.originalResponse.contentType;
  }
  /**
   * Conclusion time of the last attempted
   * Copy File operation where this file was the destination file. This value
   * can specify the time of a completed, aborted, or failed copy attempt.
   *
   * @readonly
   */
  get copyCompletedOn() {
    return void 0;
  }
  /**
   * String identifier for the last attempted Copy
   * File operation where this file was the destination file.
   *
   * @readonly
   */
  get copyId() {
    return this.originalResponse.copyId;
  }
  /**
   * Contains the number of bytes copied and
   * the total bytes in the source in the last attempted Copy File operation
   * where this file was the destination file. Can show between 0 and
   * Content-Length bytes copied.
   *
   * @readonly
   */
  get copyProgress() {
    return this.originalResponse.copyProgress;
  }
  /**
   * URL up to 2KB in length that specifies the
   * source file used in the last attempted Copy File operation where this file
   * was the destination file.
   *
   * @readonly
   */
  get copySource() {
    return this.originalResponse.copySource;
  }
  /**
   * State of the copy operation
   * identified by 'x-ms-copy-id'. Possible values include: 'pending',
   * 'success', 'aborted', 'failed'
   *
   * @readonly
   */
  get copyStatus() {
    return this.originalResponse.copyStatus;
  }
  /**
   * Only appears when
   * x-ms-copy-status is failed or pending. Describes cause of fatal or
   * non-fatal copy operation failure.
   *
   * @readonly
   */
  get copyStatusDescription() {
    return this.originalResponse.copyStatusDescription;
  }
  /**
   * When a blob is leased,
   * specifies whether the lease is of infinite or fixed duration. Possible
   * values include: 'infinite', 'fixed'.
   *
   * @readonly
   */
  get leaseDuration() {
    return this.originalResponse.leaseDuration;
  }
  /**
   * Lease state of the blob. Possible
   * values include: 'available', 'leased', 'expired', 'breaking', 'broken'.
   *
   * @readonly
   */
  get leaseState() {
    return this.originalResponse.leaseState;
  }
  /**
   * The current lease status of the
   * blob. Possible values include: 'locked', 'unlocked'.
   *
   * @readonly
   */
  get leaseStatus() {
    return this.originalResponse.leaseStatus;
  }
  /**
   * A UTC date/time value generated by the service that
   * indicates the time at which the response was initiated.
   *
   * @readonly
   */
  get date() {
    return this.originalResponse.date;
  }
  /**
   * The number of committed blocks
   * present in the blob. This header is returned only for append blobs.
   *
   * @readonly
   */
  get blobCommittedBlockCount() {
    return this.originalResponse.blobCommittedBlockCount;
  }
  /**
   * The ETag contains a value that you can use to
   * perform operations conditionally, in quotes.
   *
   * @readonly
   */
  get etag() {
    return this.originalResponse.etag;
  }
  /**
   * The error code.
   *
   * @readonly
   */
  get errorCode() {
    return this.originalResponse.errorCode;
  }
  /**
   * The value of this header is set to
   * true if the file data and application metadata are completely encrypted
   * using the specified algorithm. Otherwise, the value is set to false (when
   * the file is unencrypted, or if only parts of the file/application metadata
   * are encrypted).
   *
   * @readonly
   */
  get isServerEncrypted() {
    return this.originalResponse.isServerEncrypted;
  }
  /**
   * If the blob has a MD5 hash, and if
   * request contains range header (Range or x-ms-range), this response header
   * is returned with the value of the whole blob's MD5 value. This value may
   * or may not be equal to the value returned in Content-MD5 header, with the
   * latter calculated from the requested range.
   *
   * @readonly
   */
  get blobContentMD5() {
    return this.originalResponse.blobContentMD5;
  }
  /**
   * Returns the date and time the file was last
   * modified. Any operation that modifies the file or its properties updates
   * the last modified time.
   *
   * @readonly
   */
  get lastModified() {
    return this.originalResponse.lastModified;
  }
  /**
   * A name-value pair
   * to associate with a file storage object.
   *
   * @readonly
   */
  get metadata() {
    return this.originalResponse.metadata;
  }
  /**
   * This header uniquely identifies the request
   * that was made and can be used for troubleshooting the request.
   *
   * @readonly
   */
  get requestId() {
    return this.originalResponse.requestId;
  }
  /**
   * If a client request id header is sent in the request, this header will be present in the
   * response with the same value.
   *
   * @readonly
   */
  get clientRequestId() {
    return this.originalResponse.clientRequestId;
  }
  /**
   * Indicates the version of the File service used
   * to execute the request.
   *
   * @readonly
   */
  get version() {
    return this.originalResponse.version;
  }
  /**
   * The SHA-256 hash of the encryption key used to encrypt the blob. This value is only returned
   * when the blob was encrypted with a customer-provided key.
   *
   * @readonly
   */
  get encryptionKeySha256() {
    return this.originalResponse.encryptionKeySha256;
  }
  /**
   * If the request is to read a specified range and the x-ms-range-get-content-crc64 is set to
   * true, then the request returns a crc64 for the range, as long as the range size is less than
   * or equal to 4 MB. If both x-ms-range-get-content-crc64 & x-ms-range-get-content-md5 is
   * specified in the same request, it will fail with 400(Bad Request)
   */
  get contentCrc64() {
    return this.originalResponse.contentCrc64;
  }
  /**
   * The response body as a browser Blob.
   * Always undefined in node.js.
   *
   * @readonly
   */
  get blobBody() {
    throw Error(`Quick query in browser is not supported yet.`);
  }
  /**
   * The response body as a node.js Readable stream.
   * Always undefined in the browser.
   *
   * @readonly
   */
  get readableStreamBody() {
    return void 0;
  }
  /**
   * The HTTP response.
   */
  get _response() {
    return this.originalResponse._response;
  }
  /**
   * Creates an instance of BlobQueryResponse.
   *
   * @param originalResponse -
   * @param options -
   */
  constructor(originalResponse2, _options = {}) {
    this.originalResponse = originalResponse2;
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/models.js
var BlockBlobTier;
(function(BlockBlobTier2) {
  BlockBlobTier2["Hot"] = "Hot";
  BlockBlobTier2["Cool"] = "Cool";
  BlockBlobTier2["Cold"] = "Cold";
  BlockBlobTier2["Archive"] = "Archive";
})(BlockBlobTier || (BlockBlobTier = {}));
var PremiumPageBlobTier;
(function(PremiumPageBlobTier2) {
  PremiumPageBlobTier2["P4"] = "P4";
  PremiumPageBlobTier2["P6"] = "P6";
  PremiumPageBlobTier2["P10"] = "P10";
  PremiumPageBlobTier2["P15"] = "P15";
  PremiumPageBlobTier2["P20"] = "P20";
  PremiumPageBlobTier2["P30"] = "P30";
  PremiumPageBlobTier2["P40"] = "P40";
  PremiumPageBlobTier2["P50"] = "P50";
  PremiumPageBlobTier2["P60"] = "P60";
  PremiumPageBlobTier2["P70"] = "P70";
  PremiumPageBlobTier2["P80"] = "P80";
})(PremiumPageBlobTier || (PremiumPageBlobTier = {}));
function toAccessTier(tier2) {
  if (tier2 === void 0) {
    return void 0;
  }
  return tier2;
}
function ensureCpkIfSpecified(cpk, isHttps) {
  if (cpk && !isHttps) {
    throw new RangeError("Customer-provided encryption key must be used over HTTPS.");
  }
  if (cpk && !cpk.encryptionAlgorithm) {
    cpk.encryptionAlgorithm = EncryptionAlgorithmAES25;
  }
}
var StorageBlobAudience;
(function(StorageBlobAudience2) {
  StorageBlobAudience2["StorageOAuthScopes"] = "https://storage.azure.com/.default";
  StorageBlobAudience2["DiskComputeOAuthScopes"] = "https://disk.compute.azure.com/.default";
})(StorageBlobAudience || (StorageBlobAudience = {}));

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/PageBlobRangeResponse.js
function rangeResponseFromModel(response) {
  const pageRange = (response._response.parsedBody.pageRange || []).map((x) => ({
    offset: x.start,
    count: x.end - x.start
  }));
  const clearRange = (response._response.parsedBody.clearRange || []).map((x) => ({
    offset: x.start,
    count: x.end - x.start
  }));
  return Object.assign(Object.assign({}, response), {
    pageRange,
    clearRange,
    _response: Object.assign(Object.assign({}, response._response), { parsedBody: {
      pageRange,
      clearRange
    } })
  });
}

// node_modules/@azure/core-lro/dist/browser/logger.js
var logger4 = createClientLogger("core-lro");

// node_modules/@azure/core-lro/dist/browser/legacy/poller.js
var PollerStoppedError = class _PollerStoppedError extends Error {
  constructor(message) {
    super(message);
    this.name = "PollerStoppedError";
    Object.setPrototypeOf(this, _PollerStoppedError.prototype);
  }
};
var PollerCancelledError = class _PollerCancelledError extends Error {
  constructor(message) {
    super(message);
    this.name = "PollerCancelledError";
    Object.setPrototypeOf(this, _PollerCancelledError.prototype);
  }
};
var Poller = class {
  /**
   * A poller needs to be initialized by passing in at least the basic properties of the `PollOperation<TState, TResult>`.
   *
   * When writing an implementation of a Poller, this implementation needs to deal with the initialization
   * of any custom state beyond the basic definition of the poller. The basic poller assumes that the poller's
   * operation has already been defined, at least its basic properties. The code below shows how to approach
   * the definition of the constructor of a new custom poller.
   *
   * ```ts
   * export class MyPoller extends Poller<MyOperationState, string> {
   *   constructor({
   *     // Anything you might need outside of the basics
   *   }) {
   *     let state: MyOperationState = {
   *       privateProperty: private,
   *       publicProperty: public,
   *     };
   *
   *     const operation = {
   *       state,
   *       update,
   *       cancel,
   *       toString
   *     }
   *
   *     // Sending the operation to the parent's constructor.
   *     super(operation);
   *
   *     // You can assign more local properties here.
   *   }
   * }
   * ```
   *
   * Inside of this constructor, a new promise is created. This will be used to
   * tell the user when the poller finishes (see `pollUntilDone()`). The promise's
   * resolve and reject methods are also used internally to control when to resolve
   * or reject anyone waiting for the poller to finish.
   *
   * The constructor of a custom implementation of a poller is where any serialized version of
   * a previous poller's operation should be deserialized into the operation sent to the
   * base constructor. For example:
   *
   * ```ts
   * export class MyPoller extends Poller<MyOperationState, string> {
   *   constructor(
   *     baseOperation: string | undefined
   *   ) {
   *     let state: MyOperationState = {};
   *     if (baseOperation) {
   *       state = {
   *         ...JSON.parse(baseOperation).state,
   *         ...state
   *       };
   *     }
   *     const operation = {
   *       state,
   *       // ...
   *     }
   *     super(operation);
   *   }
   * }
   * ```
   *
   * @param operation - Must contain the basic properties of `PollOperation<State, TResult>`.
   */
  constructor(operation) {
    this.resolveOnUnsuccessful = false;
    this.stopped = true;
    this.pollProgressCallbacks = [];
    this.operation = operation;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.promise.catch(() => {
    });
  }
  /**
   * Starts a loop that will break only if the poller is done
   * or if the poller is stopped.
   */
  async startPolling(pollOptions = {}) {
    if (this.stopped) {
      this.stopped = false;
    }
    while (!this.isStopped() && !this.isDone()) {
      await this.poll(pollOptions);
      await this.delay();
    }
  }
  /**
   * pollOnce does one polling, by calling to the update method of the underlying
   * poll operation to make any relevant change effective.
   *
   * It only optionally receives an object with an abortSignal property, from \@azure/abort-controller's AbortSignalLike.
   *
   * @param options - Optional properties passed to the operation's update method.
   */
  async pollOnce(options = {}) {
    if (!this.isDone()) {
      this.operation = await this.operation.update({
        abortSignal: options.abortSignal,
        fireProgress: this.fireProgress.bind(this)
      });
    }
    this.processUpdatedState();
  }
  /**
   * fireProgress calls the functions passed in via onProgress the method of the poller.
   *
   * It loops over all of the callbacks received from onProgress, and executes them, sending them
   * the current operation state.
   *
   * @param state - The current operation state.
   */
  fireProgress(state3) {
    for (const callback of this.pollProgressCallbacks) {
      callback(state3);
    }
  }
  /**
   * Invokes the underlying operation's cancel method.
   */
  async cancelOnce(options = {}) {
    this.operation = await this.operation.cancel(options);
  }
  /**
   * Returns a promise that will resolve once a single polling request finishes.
   * It does this by calling the update method of the Poller's operation.
   *
   * It only optionally receives an object with an abortSignal property, from \@azure/abort-controller's AbortSignalLike.
   *
   * @param options - Optional properties passed to the operation's update method.
   */
  poll(options = {}) {
    if (!this.pollOncePromise) {
      this.pollOncePromise = this.pollOnce(options);
      const clearPollOncePromise = () => {
        this.pollOncePromise = void 0;
      };
      this.pollOncePromise.then(clearPollOncePromise, clearPollOncePromise).catch(this.reject);
    }
    return this.pollOncePromise;
  }
  processUpdatedState() {
    if (this.operation.state.error) {
      this.stopped = true;
      if (!this.resolveOnUnsuccessful) {
        this.reject(this.operation.state.error);
        throw this.operation.state.error;
      }
    }
    if (this.operation.state.isCancelled) {
      this.stopped = true;
      if (!this.resolveOnUnsuccessful) {
        const error = new PollerCancelledError("Operation was canceled");
        this.reject(error);
        throw error;
      }
    }
    if (this.isDone() && this.resolve) {
      this.resolve(this.getResult());
    }
  }
  /**
   * Returns a promise that will resolve once the underlying operation is completed.
   */
  async pollUntilDone(pollOptions = {}) {
    if (this.stopped) {
      this.startPolling(pollOptions).catch(this.reject);
    }
    this.processUpdatedState();
    return this.promise;
  }
  /**
   * Invokes the provided callback after each polling is completed,
   * sending the current state of the poller's operation.
   *
   * It returns a method that can be used to stop receiving updates on the given callback function.
   */
  onProgress(callback) {
    this.pollProgressCallbacks.push(callback);
    return () => {
      this.pollProgressCallbacks = this.pollProgressCallbacks.filter((c) => c !== callback);
    };
  }
  /**
   * Returns true if the poller has finished polling.
   */
  isDone() {
    const state3 = this.operation.state;
    return Boolean(state3.isCompleted || state3.isCancelled || state3.error);
  }
  /**
   * Stops the poller from continuing to poll.
   */
  stopPolling() {
    if (!this.stopped) {
      this.stopped = true;
      if (this.reject) {
        this.reject(new PollerStoppedError("This poller is already stopped"));
      }
    }
  }
  /**
   * Returns true if the poller is stopped.
   */
  isStopped() {
    return this.stopped;
  }
  /**
   * Attempts to cancel the underlying operation.
   *
   * It only optionally receives an object with an abortSignal property, from \@azure/abort-controller's AbortSignalLike.
   *
   * If it's called again before it finishes, it will throw an error.
   *
   * @param options - Optional properties passed to the operation's update method.
   */
  cancelOperation(options = {}) {
    if (!this.cancelPromise) {
      this.cancelPromise = this.cancelOnce(options);
    } else if (options.abortSignal) {
      throw new Error("A cancel request is currently pending");
    }
    return this.cancelPromise;
  }
  /**
   * Returns the state of the operation.
   *
   * Even though TState will be the same type inside any of the methods of any extension of the Poller class,
   * implementations of the pollers can customize what's shared with the public by writing their own
   * version of the `getOperationState` method, and by defining two types, one representing the internal state of the poller
   * and a public type representing a safe to share subset of the properties of the internal state.
   * Their definition of getOperationState can then return their public type.
   *
   * Example:
   *
   * ```ts
   * // Let's say we have our poller's operation state defined as:
   * interface MyOperationState extends PollOperationState<ResultType> {
   *   privateProperty?: string;
   *   publicProperty?: string;
   * }
   *
   * // To allow us to have a true separation of public and private state, we have to define another interface:
   * interface PublicState extends PollOperationState<ResultType> {
   *   publicProperty?: string;
   * }
   *
   * // Then, we define our Poller as follows:
   * export class MyPoller extends Poller<MyOperationState, ResultType> {
   *   // ... More content is needed here ...
   *
   *   public getOperationState(): PublicState {
   *     const state: PublicState = this.operation.state;
   *     return {
   *       // Properties from PollOperationState<TResult>
   *       isStarted: state.isStarted,
   *       isCompleted: state.isCompleted,
   *       isCancelled: state.isCancelled,
   *       error: state.error,
   *       result: state.result,
   *
   *       // The only other property needed by PublicState.
   *       publicProperty: state.publicProperty
   *     }
   *   }
   * }
   * ```
   *
   * You can see this in the tests of this repository, go to the file:
   * `../test/utils/testPoller.ts`
   * and look for the getOperationState implementation.
   */
  getOperationState() {
    return this.operation.state;
  }
  /**
   * Returns the result value of the operation,
   * regardless of the state of the poller.
   * It can return undefined or an incomplete form of the final TResult value
   * depending on the implementation.
   */
  getResult() {
    const state3 = this.operation.state;
    return state3.result;
  }
  /**
   * Returns a serialized version of the poller's operation
   * by invoking the operation's toString method.
   */
  toString() {
    return this.operation.toString();
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/pollers/BlobStartCopyFromUrlPoller.js
var BlobBeginCopyFromUrlPoller = class extends Poller {
  constructor(options) {
    const { blobClient, copySource: copySource2, intervalInMs = 15e3, onProgress, resumeFrom, startCopyFromURLOptions } = options;
    let state3;
    if (resumeFrom) {
      state3 = JSON.parse(resumeFrom).state;
    }
    const operation = makeBlobBeginCopyFromURLPollOperation(Object.assign(Object.assign({}, state3), {
      blobClient,
      copySource: copySource2,
      startCopyFromURLOptions
    }));
    super(operation);
    if (typeof onProgress === "function") {
      this.onProgress(onProgress);
    }
    this.intervalInMs = intervalInMs;
  }
  delay() {
    return delay(this.intervalInMs);
  }
};
var cancel = async function cancel2(options = {}) {
  const state3 = this.state;
  const { copyId: copyId2 } = state3;
  if (state3.isCompleted) {
    return makeBlobBeginCopyFromURLPollOperation(state3);
  }
  if (!copyId2) {
    state3.isCancelled = true;
    return makeBlobBeginCopyFromURLPollOperation(state3);
  }
  await state3.blobClient.abortCopyFromURL(copyId2, {
    abortSignal: options.abortSignal
  });
  state3.isCancelled = true;
  return makeBlobBeginCopyFromURLPollOperation(state3);
};
var update = async function update2(options = {}) {
  const state3 = this.state;
  const { blobClient, copySource: copySource2, startCopyFromURLOptions } = state3;
  if (!state3.isStarted) {
    state3.isStarted = true;
    const result = await blobClient.startCopyFromURL(copySource2, startCopyFromURLOptions);
    state3.copyId = result.copyId;
    if (result.copyStatus === "success") {
      state3.result = result;
      state3.isCompleted = true;
    }
  } else if (!state3.isCompleted) {
    try {
      const result = await state3.blobClient.getProperties({ abortSignal: options.abortSignal });
      const { copyStatus, copyProgress } = result;
      const prevCopyProgress = state3.copyProgress;
      if (copyProgress) {
        state3.copyProgress = copyProgress;
      }
      if (copyStatus === "pending" && copyProgress !== prevCopyProgress && typeof options.fireProgress === "function") {
        options.fireProgress(state3);
      } else if (copyStatus === "success") {
        state3.result = result;
        state3.isCompleted = true;
      } else if (copyStatus === "failed") {
        state3.error = new Error(`Blob copy failed with reason: "${result.copyStatusDescription || "unknown"}"`);
        state3.isCompleted = true;
      }
    } catch (err) {
      state3.error = err;
      state3.isCompleted = true;
    }
  }
  return makeBlobBeginCopyFromURLPollOperation(state3);
};
var toString = function toString2() {
  return JSON.stringify({ state: this.state }, (key, value) => {
    if (key === "blobClient") {
      return void 0;
    }
    return value;
  });
};
function makeBlobBeginCopyFromURLPollOperation(state3) {
  return {
    state: Object.assign({}, state3),
    cancel,
    toString,
    update
  };
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/Range.js
function rangeToString(iRange) {
  if (iRange.offset < 0) {
    throw new RangeError(`Range.offset cannot be smaller than 0.`);
  }
  if (iRange.count && iRange.count <= 0) {
    throw new RangeError(`Range.count must be larger than 0. Leave it undefined if you want a range from offset to the end.`);
  }
  return iRange.count ? `bytes=${iRange.offset}-${iRange.offset + iRange.count - 1}` : `bytes=${iRange.offset}-`;
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/utils/Batch.js
var import_events = __toESM(require_events());
var BatchStates;
(function(BatchStates2) {
  BatchStates2[BatchStates2["Good"] = 0] = "Good";
  BatchStates2[BatchStates2["Error"] = 1] = "Error";
})(BatchStates || (BatchStates = {}));
var Batch = class {
  /**
   * Creates an instance of Batch.
   * @param concurrency -
   */
  constructor(concurrency = 5) {
    this.actives = 0;
    this.completed = 0;
    this.offset = 0;
    this.operations = [];
    this.state = BatchStates.Good;
    if (concurrency < 1) {
      throw new RangeError("concurrency must be larger than 0");
    }
    this.concurrency = concurrency;
    this.emitter = new import_events.EventEmitter();
  }
  /**
   * Add a operation into queue.
   *
   * @param operation -
   */
  addOperation(operation) {
    this.operations.push(async () => {
      try {
        this.actives++;
        await operation();
        this.actives--;
        this.completed++;
        this.parallelExecute();
      } catch (error) {
        this.emitter.emit("error", error);
      }
    });
  }
  /**
   * Start execute operations in the queue.
   *
   */
  async do() {
    if (this.operations.length === 0) {
      return Promise.resolve();
    }
    this.parallelExecute();
    return new Promise((resolve, reject) => {
      this.emitter.on("finish", resolve);
      this.emitter.on("error", (error) => {
        this.state = BatchStates.Error;
        reject(error);
      });
    });
  }
  /**
   * Get next operation to be executed. Return null when reaching ends.
   *
   */
  nextOperation() {
    if (this.offset < this.operations.length) {
      return this.operations[this.offset++];
    }
    return null;
  }
  /**
   * Start execute operations. One one the most important difference between
   * this method with do() is that do() wraps as an sync method.
   *
   */
  parallelExecute() {
    if (this.state === BatchStates.Error) {
      return;
    }
    if (this.completed >= this.operations.length) {
      this.emitter.emit("finish");
      return;
    }
    while (this.actives < this.concurrency) {
      const operation = this.nextOperation();
      if (operation) {
        operation();
      } else {
        return;
      }
    }
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-common/src/BufferScheduler.browser.js
var BufferScheduler = class {
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/utils/utils.browser.js
async function blobToString(blob) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = (ev) => {
      resolve(ev.target.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(blob);
  });
}
function streamToBuffer() {
}
function readStreamToLocalFile() {
}
var fsStat = function stat() {
};
var fsCreateReadStream = function createReadStream() {
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/Clients.js
var BlobClient = class _BlobClient extends StorageClient2 {
  /**
   * The name of the blob.
   */
  get name() {
    return this._name;
  }
  /**
   * The name of the storage container the blob is associated with.
   */
  get containerName() {
    return this._containerName;
  }
  constructor(urlOrConnectionString, credentialOrPipelineOrContainerName, blobNameOrOptions, options) {
    options = options || {};
    let pipeline;
    let url2;
    if (isPipelineLike(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      pipeline = credentialOrPipelineOrContainerName;
    } else if (isNode && credentialOrPipelineOrContainerName instanceof StorageSharedKeyCredential || credentialOrPipelineOrContainerName instanceof AnonymousCredential || isTokenCredential(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      options = blobNameOrOptions;
      pipeline = newPipeline(credentialOrPipelineOrContainerName, options);
    } else if (!credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName !== "string") {
      url2 = urlOrConnectionString;
      if (blobNameOrOptions && typeof blobNameOrOptions !== "string") {
        options = blobNameOrOptions;
      }
      pipeline = newPipeline(new AnonymousCredential(), options);
    } else if (credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName === "string" && blobNameOrOptions && typeof blobNameOrOptions === "string") {
      const containerName = credentialOrPipelineOrContainerName;
      const blobName = blobNameOrOptions;
      const extractedCreds = extractConnectionStringParts(urlOrConnectionString);
      if (extractedCreds.kind === "AccountConnString") {
        if (isNode) {
          const sharedKeyCredential = new StorageSharedKeyCredential(extractedCreds.accountName, extractedCreds.accountKey);
          url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName));
          if (!options.proxyOptions) {
            options.proxyOptions = getDefaultProxySettings(extractedCreds.proxyUri);
          }
          pipeline = newPipeline(sharedKeyCredential, options);
        } else {
          throw new Error("Account connection string is only supported in Node.js environment");
        }
      } else if (extractedCreds.kind === "SASConnString") {
        url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName)) + "?" + extractedCreds.accountSas;
        pipeline = newPipeline(new AnonymousCredential(), options);
      } else {
        throw new Error("Connection string must be either an Account connection string or a SAS connection string");
      }
    } else {
      throw new Error("Expecting non-empty strings for containerName and blobName parameters");
    }
    super(url2, pipeline);
    ({ blobName: this._name, containerName: this._containerName } = this.getBlobAndContainerNamesFromUrl());
    this.blobContext = this.storageClientContext.blob;
    this._snapshot = getURLParameter(this.url, URLConstants.Parameters.SNAPSHOT);
    this._versionId = getURLParameter(this.url, URLConstants.Parameters.VERSIONID);
  }
  /**
   * Creates a new BlobClient object identical to the source but with the specified snapshot timestamp.
   * Provide "" will remove the snapshot and return a Client to the base blob.
   *
   * @param snapshot - The snapshot timestamp.
   * @returns A new BlobClient object identical to the source but with the specified snapshot timestamp
   */
  withSnapshot(snapshot2) {
    return new _BlobClient(setURLParameter(this.url, URLConstants.Parameters.SNAPSHOT, snapshot2.length === 0 ? void 0 : snapshot2), this.pipeline);
  }
  /**
   * Creates a new BlobClient object pointing to a version of this blob.
   * Provide "" will remove the versionId and return a Client to the base blob.
   *
   * @param versionId - The versionId.
   * @returns A new BlobClient object pointing to the version of this blob.
   */
  withVersion(versionId2) {
    return new _BlobClient(setURLParameter(this.url, URLConstants.Parameters.VERSIONID, versionId2.length === 0 ? void 0 : versionId2), this.pipeline);
  }
  /**
   * Creates a AppendBlobClient object.
   *
   */
  getAppendBlobClient() {
    return new AppendBlobClient(this.url, this.pipeline);
  }
  /**
   * Creates a BlockBlobClient object.
   *
   */
  getBlockBlobClient() {
    return new BlockBlobClient(this.url, this.pipeline);
  }
  /**
   * Creates a PageBlobClient object.
   *
   */
  getPageBlobClient() {
    return new PageBlobClient(this.url, this.pipeline);
  }
  /**
   * Reads or downloads a blob from the system, including its metadata and properties.
   * You can also call Get Blob to read a snapshot.
   *
   * * In Node.js, data returns in a Readable stream readableStreamBody
   * * In browsers, data returns in a promise blobBody
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-blob
   *
   * @param offset - From which position of the blob to download, greater than or equal to 0
   * @param count - How much data to be downloaded, greater than 0. Will download to the end when undefined
   * @param options - Optional options to Blob Download operation.
   *
   *
   * Example usage (Node.js):
   *
   * ```js
   * // Download and convert a blob to a string
   * const downloadBlockBlobResponse = await blobClient.download();
   * const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
   * console.log("Downloaded blob content:", downloaded.toString());
   *
   * async function streamToBuffer(readableStream) {
   * return new Promise((resolve, reject) => {
   * const chunks = [];
   * readableStream.on("data", (data) => {
   * chunks.push(data instanceof Buffer ? data : Buffer.from(data));
   * });
   * readableStream.on("end", () => {
   * resolve(Buffer.concat(chunks));
   * });
   * readableStream.on("error", reject);
   * });
   * }
   * ```
   *
   * Example usage (browser):
   *
   * ```js
   * // Download and convert a blob to a string
   * const downloadBlockBlobResponse = await blobClient.download();
   * const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
   * console.log(
   *   "Downloaded blob content",
   *   downloaded
   * );
   *
   * async function blobToString(blob: Blob): Promise<string> {
   *   const fileReader = new FileReader();
   *   return new Promise<string>((resolve, reject) => {
   *     fileReader.onloadend = (ev: any) => {
   *       resolve(ev.target!.result);
   *     };
   *     fileReader.onerror = reject;
   *     fileReader.readAsText(blob);
   *   });
   * }
   * ```
   */
  async download(offset = 0, count, options = {}) {
    options.conditions = options.conditions || {};
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlobClient-download", options, async (updatedOptions) => {
      var _a3;
      const res = assertResponse(await this.blobContext.download({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        requestOptions: {
          onDownloadProgress: isNode ? void 0 : options.onProgress
          // for Node.js, progress is reported by RetriableReadableStream
        },
        range: offset === 0 && !count ? void 0 : rangeToString({ offset, count }),
        rangeGetContentMD5: options.rangeGetContentMD5,
        rangeGetContentCRC64: options.rangeGetContentCrc64,
        snapshot: options.snapshot,
        cpkInfo: options.customerProvidedKey,
        tracingOptions: updatedOptions.tracingOptions
      }));
      const wrappedRes = Object.assign(Object.assign({}, res), { _response: res._response, objectReplicationDestinationPolicyId: res.objectReplicationPolicyId, objectReplicationSourceProperties: parseObjectReplicationRecord(res.objectReplicationRules) });
      if (!isNode) {
        return wrappedRes;
      }
      if (options.maxRetryRequests === void 0 || options.maxRetryRequests < 0) {
        options.maxRetryRequests = DEFAULT_MAX_DOWNLOAD_RETRY_REQUESTS;
      }
      if (res.contentLength === void 0) {
        throw new RangeError(`File download response doesn't contain valid content length header`);
      }
      if (!res.etag) {
        throw new RangeError(`File download response doesn't contain valid etag header`);
      }
      return new BlobDownloadResponse(wrappedRes, async (start) => {
        var _a4;
        const updatedDownloadOptions = {
          leaseAccessConditions: options.conditions,
          modifiedAccessConditions: {
            ifMatch: options.conditions.ifMatch || res.etag,
            ifModifiedSince: options.conditions.ifModifiedSince,
            ifNoneMatch: options.conditions.ifNoneMatch,
            ifUnmodifiedSince: options.conditions.ifUnmodifiedSince,
            ifTags: (_a4 = options.conditions) === null || _a4 === void 0 ? void 0 : _a4.tagConditions
          },
          range: rangeToString({
            count: offset + res.contentLength - start,
            offset: start
          }),
          rangeGetContentMD5: options.rangeGetContentMD5,
          rangeGetContentCRC64: options.rangeGetContentCrc64,
          snapshot: options.snapshot,
          cpkInfo: options.customerProvidedKey
        };
        return (await this.blobContext.download(Object.assign({ abortSignal: options.abortSignal }, updatedDownloadOptions))).readableStreamBody;
      }, offset, res.contentLength, {
        maxRetryRequests: options.maxRetryRequests,
        onProgress: options.onProgress
      });
    });
  }
  /**
   * Returns true if the Azure blob resource represented by this client exists; false otherwise.
   *
   * NOTE: use this function with care since an existing blob might be deleted by other clients or
   * applications. Vice versa new blobs might be added by other clients or applications after this
   * function completes.
   *
   * @param options - options to Exists operation.
   */
  async exists(options = {}) {
    return tracingClient.withSpan("BlobClient-exists", options, async (updatedOptions) => {
      try {
        ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
        await this.getProperties({
          abortSignal: options.abortSignal,
          customerProvidedKey: options.customerProvidedKey,
          conditions: options.conditions,
          tracingOptions: updatedOptions.tracingOptions
        });
        return true;
      } catch (e) {
        if (e.statusCode === 404) {
          return false;
        } else if (e.statusCode === 409 && (e.details.errorCode === BlobUsesCustomerSpecifiedEncryptionMsg || e.details.errorCode === BlobDoesNotUseCustomerSpecifiedEncryption)) {
          return true;
        }
        throw e;
      }
    });
  }
  /**
   * Returns all user-defined metadata, standard HTTP properties, and system properties
   * for the blob. It does not return the content of the blob.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-blob-properties
   *
   * WARNING: The `metadata` object returned in the response will have its keys in lowercase, even if
   * they originally contained uppercase characters. This differs from the metadata keys returned by
   * the methods of {@link ContainerClient} that list blobs using the `includeMetadata` option, which
   * will retain their original casing.
   *
   * @param options - Optional options to Get Properties operation.
   */
  async getProperties(options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlobClient-getProperties", options, async (updatedOptions) => {
      var _a3;
      const res = assertResponse(await this.blobContext.getProperties({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        cpkInfo: options.customerProvidedKey,
        tracingOptions: updatedOptions.tracingOptions
      }));
      return Object.assign(Object.assign({}, res), { _response: res._response, objectReplicationDestinationPolicyId: res.objectReplicationPolicyId, objectReplicationSourceProperties: parseObjectReplicationRecord(res.objectReplicationRules) });
    });
  }
  /**
   * Marks the specified blob or snapshot for deletion. The blob is later deleted
   * during garbage collection. Note that in order to delete a blob, you must delete
   * all of its snapshots. You can delete both at the same time with the Delete
   * Blob operation.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/delete-blob
   *
   * @param options - Optional options to Blob Delete operation.
   */
  async delete(options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("BlobClient-delete", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.blobContext.delete({
        abortSignal: options.abortSignal,
        deleteSnapshots: options.deleteSnapshots,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Marks the specified blob or snapshot for deletion if it exists. The blob is later deleted
   * during garbage collection. Note that in order to delete a blob, you must delete
   * all of its snapshots. You can delete both at the same time with the Delete
   * Blob operation.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/delete-blob
   *
   * @param options - Optional options to Blob Delete operation.
   */
  async deleteIfExists(options = {}) {
    return tracingClient.withSpan("BlobClient-deleteIfExists", options, async (updatedOptions) => {
      var _a3, _b2;
      try {
        const res = assertResponse(await this.delete(updatedOptions));
        return Object.assign(Object.assign({ succeeded: true }, res), { _response: res._response });
      } catch (e) {
        if (((_a3 = e.details) === null || _a3 === void 0 ? void 0 : _a3.errorCode) === "BlobNotFound") {
          return Object.assign(Object.assign({ succeeded: false }, (_b2 = e.response) === null || _b2 === void 0 ? void 0 : _b2.parsedHeaders), { _response: e.response });
        }
        throw e;
      }
    });
  }
  /**
   * Restores the contents and metadata of soft deleted blob and any associated
   * soft deleted snapshots. Undelete Blob is supported only on version 2017-07-29
   * or later.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/undelete-blob
   *
   * @param options - Optional options to Blob Undelete operation.
   */
  async undelete(options = {}) {
    return tracingClient.withSpan("BlobClient-undelete", options, async (updatedOptions) => {
      return assertResponse(await this.blobContext.undelete({
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Sets system properties on the blob.
   *
   * If no value provided, or no value provided for the specified blob HTTP headers,
   * these blob HTTP headers without a value will be cleared.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-blob-properties
   *
   * @param blobHTTPHeaders - If no value provided, or no value provided for
   *                                                   the specified blob HTTP headers, these blob HTTP
   *                                                   headers without a value will be cleared.
   *                                                   A common header to set is `blobContentType`
   *                                                   enabling the browser to provide functionality
   *                                                   based on file type.
   * @param options - Optional options to Blob Set HTTP Headers operation.
   */
  async setHTTPHeaders(blobHTTPHeaders, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlobClient-setHTTPHeaders", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.blobContext.setHttpHeaders({
        abortSignal: options.abortSignal,
        blobHttpHeaders: blobHTTPHeaders,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        // cpkInfo: options.customerProvidedKey, // CPK is not included in Swagger, should change this back when this issue is fixed in Swagger.
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Sets user-defined metadata for the specified blob as one or more name-value pairs.
   *
   * If no option provided, or no metadata defined in the parameter, the blob
   * metadata will be removed.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-blob-metadata
   *
   * @param metadata - Replace existing metadata with this value.
   *                               If no value provided the existing metadata will be removed.
   * @param options - Optional options to Set Metadata operation.
   */
  async setMetadata(metadata2, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlobClient-setMetadata", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.blobContext.setMetadata({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        metadata: metadata2,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Sets tags on the underlying blob.
   * A blob can have up to 10 tags. Tag keys must be between 1 and 128 characters.  Tag values must be between 0 and 256 characters.
   * Valid tag key and value characters include lower and upper case letters, digits (0-9),
   * space (' '), plus ('+'), minus ('-'), period ('.'), foward slash ('/'), colon (':'), equals ('='), and underscore ('_').
   *
   * @param tags -
   * @param options -
   */
  async setTags(tags2, options = {}) {
    return tracingClient.withSpan("BlobClient-setTags", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.blobContext.setTags({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions,
        tags: toBlobTags(tags2)
      }));
    });
  }
  /**
   * Gets the tags associated with the underlying blob.
   *
   * @param options -
   */
  async getTags(options = {}) {
    return tracingClient.withSpan("BlobClient-getTags", options, async (updatedOptions) => {
      var _a3;
      const response = assertResponse(await this.blobContext.getTags({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
      const wrappedResponse = Object.assign(Object.assign({}, response), { _response: response._response, tags: toTags({ blobTagSet: response.blobTagSet }) || {} });
      return wrappedResponse;
    });
  }
  /**
   * Get a {@link BlobLeaseClient} that manages leases on the blob.
   *
   * @param proposeLeaseId - Initial proposed lease Id.
   * @returns A new BlobLeaseClient object for managing leases on the blob.
   */
  getBlobLeaseClient(proposeLeaseId) {
    return new BlobLeaseClient(this, proposeLeaseId);
  }
  /**
   * Creates a read-only snapshot of a blob.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/snapshot-blob
   *
   * @param options - Optional options to the Blob Create Snapshot operation.
   */
  async createSnapshot(options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlobClient-createSnapshot", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.blobContext.createSnapshot({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        metadata: options.metadata,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Asynchronously copies a blob to a destination within the storage account.
   * This method returns a long running operation poller that allows you to wait
   * indefinitely until the copy is completed.
   * You can also cancel a copy before it is completed by calling `cancelOperation` on the poller.
   * Note that the onProgress callback will not be invoked if the operation completes in the first
   * request, and attempting to cancel a completed copy will result in an error being thrown.
   *
   * In version 2012-02-12 and later, the source for a Copy Blob operation can be
   * a committed blob in any Azure storage account.
   * Beginning with version 2015-02-21, the source for a Copy Blob operation can be
   * an Azure file in any Azure storage account.
   * Only storage accounts created on or after June 7th, 2012 allow the Copy Blob
   * operation to copy from another storage account.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/copy-blob
   *
   * Example using automatic polling:
   *
   * ```js
   * const copyPoller = await blobClient.beginCopyFromURL('url');
   * const result = await copyPoller.pollUntilDone();
   * ```
   *
   * Example using manual polling:
   *
   * ```js
   * const copyPoller = await blobClient.beginCopyFromURL('url');
   * while (!poller.isDone()) {
   *    await poller.poll();
   * }
   * const result = copyPoller.getResult();
   * ```
   *
   * Example using progress updates:
   *
   * ```js
   * const copyPoller = await blobClient.beginCopyFromURL('url', {
   *   onProgress(state) {
   *     console.log(`Progress: ${state.copyProgress}`);
   *   }
   * });
   * const result = await copyPoller.pollUntilDone();
   * ```
   *
   * Example using a changing polling interval (default 15 seconds):
   *
   * ```js
   * const copyPoller = await blobClient.beginCopyFromURL('url', {
   *   intervalInMs: 1000 // poll blob every 1 second for copy progress
   * });
   * const result = await copyPoller.pollUntilDone();
   * ```
   *
   * Example using copy cancellation:
   *
   * ```js
   * const copyPoller = await blobClient.beginCopyFromURL('url');
   * // cancel operation after starting it.
   * try {
   *   await copyPoller.cancelOperation();
   *   // calls to get the result now throw PollerCancelledError
   *   await copyPoller.getResult();
   * } catch (err) {
   *   if (err.name === 'PollerCancelledError') {
   *     console.log('The copy was cancelled.');
   *   }
   * }
   * ```
   *
   * @param copySource - url to the source Azure Blob/File.
   * @param options - Optional options to the Blob Start Copy From URL operation.
   */
  async beginCopyFromURL(copySource2, options = {}) {
    const client = {
      abortCopyFromURL: (...args) => this.abortCopyFromURL(...args),
      getProperties: (...args) => this.getProperties(...args),
      startCopyFromURL: (...args) => this.startCopyFromURL(...args)
    };
    const poller = new BlobBeginCopyFromUrlPoller({
      blobClient: client,
      copySource: copySource2,
      intervalInMs: options.intervalInMs,
      onProgress: options.onProgress,
      resumeFrom: options.resumeFrom,
      startCopyFromURLOptions: options
    });
    await poller.poll();
    return poller;
  }
  /**
   * Aborts a pending asynchronous Copy Blob operation, and leaves a destination blob with zero
   * length and full metadata. Version 2012-02-12 and newer.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/abort-copy-blob
   *
   * @param copyId - Id of the Copy From URL operation.
   * @param options - Optional options to the Blob Abort Copy From URL operation.
   */
  async abortCopyFromURL(copyId2, options = {}) {
    return tracingClient.withSpan("BlobClient-abortCopyFromURL", options, async (updatedOptions) => {
      return assertResponse(await this.blobContext.abortCopyFromURL(copyId2, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * The synchronous Copy From URL operation copies a blob or an internet resource to a new blob. It will not
   * return a response until the copy is complete.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/copy-blob-from-url
   *
   * @param copySource - The source URL to copy from, Shared Access Signature(SAS) maybe needed for authentication
   * @param options -
   */
  async syncCopyFromURL(copySource2, options = {}) {
    options.conditions = options.conditions || {};
    options.sourceConditions = options.sourceConditions || {};
    return tracingClient.withSpan("BlobClient-syncCopyFromURL", options, async (updatedOptions) => {
      var _a3, _b2, _c2, _d2, _e, _f, _g;
      return assertResponse(await this.blobContext.copyFromURL(copySource2, {
        abortSignal: options.abortSignal,
        metadata: options.metadata,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        sourceModifiedAccessConditions: {
          sourceIfMatch: (_b2 = options.sourceConditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch,
          sourceIfModifiedSince: (_c2 = options.sourceConditions) === null || _c2 === void 0 ? void 0 : _c2.ifModifiedSince,
          sourceIfNoneMatch: (_d2 = options.sourceConditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch,
          sourceIfUnmodifiedSince: (_e = options.sourceConditions) === null || _e === void 0 ? void 0 : _e.ifUnmodifiedSince
        },
        sourceContentMD5: options.sourceContentMD5,
        copySourceAuthorization: httpAuthorizationToString(options.sourceAuthorization),
        tier: toAccessTier(options.tier),
        blobTagsString: toBlobTagsString(options.tags),
        immutabilityPolicyExpiry: (_f = options.immutabilityPolicy) === null || _f === void 0 ? void 0 : _f.expiriesOn,
        immutabilityPolicyMode: (_g = options.immutabilityPolicy) === null || _g === void 0 ? void 0 : _g.policyMode,
        legalHold: options.legalHold,
        encryptionScope: options.encryptionScope,
        copySourceTags: options.copySourceTags,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Sets the tier on a blob. The operation is allowed on a page blob in a premium
   * storage account and on a block blob in a blob storage account (locally redundant
   * storage only). A premium page blob's tier determines the allowed size, IOPS,
   * and bandwidth of the blob. A block blob's tier determines Hot/Cool/Archive
   * storage type. This operation does not update the blob's ETag.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-blob-tier
   *
   * @param tier - The tier to be set on the blob. Valid values are Hot, Cool, or Archive.
   * @param options - Optional options to the Blob Set Tier operation.
   */
  async setAccessTier(tier2, options = {}) {
    return tracingClient.withSpan("BlobClient-setAccessTier", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.blobContext.setTier(toAccessTier(tier2), {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        rehydratePriority: options.rehydratePriority,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  async downloadToBuffer(param1, param2, param3, param4 = {}) {
    var _a3;
    let buffer;
    let offset = 0;
    let count = 0;
    let options = param4;
    if (param1 instanceof Buffer) {
      buffer = param1;
      offset = param2 || 0;
      count = typeof param3 === "number" ? param3 : 0;
    } else {
      offset = typeof param1 === "number" ? param1 : 0;
      count = typeof param2 === "number" ? param2 : 0;
      options = param3 || {};
    }
    let blockSize = (_a3 = options.blockSize) !== null && _a3 !== void 0 ? _a3 : 0;
    if (blockSize < 0) {
      throw new RangeError("blockSize option must be >= 0");
    }
    if (blockSize === 0) {
      blockSize = DEFAULT_BLOB_DOWNLOAD_BLOCK_BYTES;
    }
    if (offset < 0) {
      throw new RangeError("offset option must be >= 0");
    }
    if (count && count <= 0) {
      throw new RangeError("count option must be greater than 0");
    }
    if (!options.conditions) {
      options.conditions = {};
    }
    return tracingClient.withSpan("BlobClient-downloadToBuffer", options, async (updatedOptions) => {
      if (!count) {
        const response = await this.getProperties(Object.assign(Object.assign({}, options), { tracingOptions: updatedOptions.tracingOptions }));
        count = response.contentLength - offset;
        if (count < 0) {
          throw new RangeError(`offset ${offset} shouldn't be larger than blob size ${response.contentLength}`);
        }
      }
      if (!buffer) {
        try {
          buffer = Buffer.alloc(count);
        } catch (error) {
          throw new Error(`Unable to allocate the buffer of size: ${count}(in bytes). Please try passing your own buffer to the "downloadToBuffer" method or try using other methods like "download" or "downloadToFile".	 ${error.message}`);
        }
      }
      if (buffer.length < count) {
        throw new RangeError(`The buffer's size should be equal to or larger than the request count of bytes: ${count}`);
      }
      let transferProgress = 0;
      const batch = new Batch(options.concurrency);
      for (let off = offset; off < offset + count; off = off + blockSize) {
        batch.addOperation(async () => {
          let chunkEnd = offset + count;
          if (off + blockSize < chunkEnd) {
            chunkEnd = off + blockSize;
          }
          const response = await this.download(off, chunkEnd - off, {
            abortSignal: options.abortSignal,
            conditions: options.conditions,
            maxRetryRequests: options.maxRetryRequestsPerBlock,
            customerProvidedKey: options.customerProvidedKey,
            tracingOptions: updatedOptions.tracingOptions
          });
          const stream = response.readableStreamBody;
          await streamToBuffer(stream, buffer, off - offset, chunkEnd - offset);
          transferProgress += chunkEnd - off;
          if (options.onProgress) {
            options.onProgress({ loadedBytes: transferProgress });
          }
        });
      }
      await batch.do();
      return buffer;
    });
  }
  /**
   * ONLY AVAILABLE IN NODE.JS RUNTIME.
   *
   * Downloads an Azure Blob to a local file.
   * Fails if the the given file path already exits.
   * Offset and count are optional, pass 0 and undefined respectively to download the entire blob.
   *
   * @param filePath -
   * @param offset - From which position of the block blob to download.
   * @param count - How much data to be downloaded. Will download to the end when passing undefined.
   * @param options - Options to Blob download options.
   * @returns The response data for blob download operation,
   *                                                 but with readableStreamBody set to undefined since its
   *                                                 content is already read and written into a local file
   *                                                 at the specified path.
   */
  async downloadToFile(filePath, offset = 0, count, options = {}) {
    return tracingClient.withSpan("BlobClient-downloadToFile", options, async (updatedOptions) => {
      const response = await this.download(offset, count, Object.assign(Object.assign({}, options), { tracingOptions: updatedOptions.tracingOptions }));
      if (response.readableStreamBody) {
        await readStreamToLocalFile(response.readableStreamBody, filePath);
      }
      response.blobDownloadStream = void 0;
      return response;
    });
  }
  getBlobAndContainerNamesFromUrl() {
    let containerName;
    let blobName;
    try {
      const parsedUrl = new URL(this.url);
      if (parsedUrl.host.split(".")[1] === "blob") {
        const pathComponents = parsedUrl.pathname.match("/([^/]*)(/(.*))?");
        containerName = pathComponents[1];
        blobName = pathComponents[3];
      } else if (isIpEndpointStyle(parsedUrl)) {
        const pathComponents = parsedUrl.pathname.match("/([^/]*)/([^/]*)(/(.*))?");
        containerName = pathComponents[2];
        blobName = pathComponents[4];
      } else {
        const pathComponents = parsedUrl.pathname.match("/([^/]*)(/(.*))?");
        containerName = pathComponents[1];
        blobName = pathComponents[3];
      }
      containerName = decodeURIComponent(containerName);
      blobName = decodeURIComponent(blobName);
      blobName = blobName.replace(/\\/g, "/");
      if (!containerName) {
        throw new Error("Provided containerName is invalid.");
      }
      return { blobName, containerName };
    } catch (error) {
      throw new Error("Unable to extract blobName and containerName with provided information.");
    }
  }
  /**
   * Asynchronously copies a blob to a destination within the storage account.
   * In version 2012-02-12 and later, the source for a Copy Blob operation can be
   * a committed blob in any Azure storage account.
   * Beginning with version 2015-02-21, the source for a Copy Blob operation can be
   * an Azure file in any Azure storage account.
   * Only storage accounts created on or after June 7th, 2012 allow the Copy Blob
   * operation to copy from another storage account.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/copy-blob
   *
   * @param copySource - url to the source Azure Blob/File.
   * @param options - Optional options to the Blob Start Copy From URL operation.
   */
  async startCopyFromURL(copySource2, options = {}) {
    return tracingClient.withSpan("BlobClient-startCopyFromURL", options, async (updatedOptions) => {
      var _a3, _b2, _c2;
      options.conditions = options.conditions || {};
      options.sourceConditions = options.sourceConditions || {};
      return assertResponse(await this.blobContext.startCopyFromURL(copySource2, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        metadata: options.metadata,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        sourceModifiedAccessConditions: {
          sourceIfMatch: options.sourceConditions.ifMatch,
          sourceIfModifiedSince: options.sourceConditions.ifModifiedSince,
          sourceIfNoneMatch: options.sourceConditions.ifNoneMatch,
          sourceIfUnmodifiedSince: options.sourceConditions.ifUnmodifiedSince,
          sourceIfTags: options.sourceConditions.tagConditions
        },
        immutabilityPolicyExpiry: (_b2 = options.immutabilityPolicy) === null || _b2 === void 0 ? void 0 : _b2.expiriesOn,
        immutabilityPolicyMode: (_c2 = options.immutabilityPolicy) === null || _c2 === void 0 ? void 0 : _c2.policyMode,
        legalHold: options.legalHold,
        rehydratePriority: options.rehydratePriority,
        tier: toAccessTier(options.tier),
        blobTagsString: toBlobTagsString(options.tags),
        sealBlob: options.sealBlob,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Only available for BlobClient constructed with a shared key credential.
   *
   * Generates a Blob Service Shared Access Signature (SAS) URI based on the client properties
   * and parameters passed in. The SAS is signed by the shared key credential of the client.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateSasUrl(options) {
    return new Promise((resolve) => {
      if (!(this.credential instanceof StorageSharedKeyCredential)) {
        throw new RangeError("Can only generate the SAS when the client is initialized with a shared key credential");
      }
      const sas = generateBlobSASQueryParameters(Object.assign({ containerName: this._containerName, blobName: this._name, snapshotTime: this._snapshot, versionId: this._versionId }, options), this.credential).toString();
      resolve(appendToURLQuery(this.url, sas));
    });
  }
  /**
   * Only available for BlobClient constructed with a shared key credential.
   *
   * Generates string to sign for a Blob Service Shared Access Signature (SAS) URI based on
   * the client properties and parameters passed in. The SAS is signed by the shared key credential of the client.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  /* eslint-disable-next-line @azure/azure-sdk/ts-naming-options*/
  generateSasStringToSign(options) {
    if (!(this.credential instanceof StorageSharedKeyCredential)) {
      throw new RangeError("Can only generate the SAS when the client is initialized with a shared key credential");
    }
    return generateBlobSASQueryParametersInternal(Object.assign({ containerName: this._containerName, blobName: this._name, snapshotTime: this._snapshot, versionId: this._versionId }, options), this.credential).stringToSign;
  }
  /**
   *
   * Generates a Blob Service Shared Access Signature (SAS) URI based on
   * the client properties and parameters passed in. The SAS is signed by the input user delegation key.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @param userDelegationKey -  Return value of `blobServiceClient.getUserDelegationKey()`
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateUserDelegationSasUrl(options, userDelegationKey) {
    return new Promise((resolve) => {
      const sas = generateBlobSASQueryParameters(Object.assign({ containerName: this._containerName, blobName: this._name, snapshotTime: this._snapshot, versionId: this._versionId }, options), userDelegationKey, this.accountName).toString();
      resolve(appendToURLQuery(this.url, sas));
    });
  }
  /**
   * Only available for BlobClient constructed with a shared key credential.
   *
   * Generates string to sign for a Blob Service Shared Access Signature (SAS) URI based on
   * the client properties and parameters passed in. The SAS is signed by the input user delegation key.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @param userDelegationKey -  Return value of `blobServiceClient.getUserDelegationKey()`
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateUserDelegationSasStringToSign(options, userDelegationKey) {
    return generateBlobSASQueryParametersInternal(Object.assign({ containerName: this._containerName, blobName: this._name, snapshotTime: this._snapshot, versionId: this._versionId }, options), userDelegationKey, this.accountName).stringToSign;
  }
  /**
   * Delete the immutablility policy on the blob.
   *
   * @param options - Optional options to delete immutability policy on the blob.
   */
  async deleteImmutabilityPolicy(options = {}) {
    return tracingClient.withSpan("BlobClient-deleteImmutabilityPolicy", options, async (updatedOptions) => {
      return assertResponse(await this.blobContext.deleteImmutabilityPolicy({
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Set immutability policy on the blob.
   *
   * @param options - Optional options to set immutability policy on the blob.
   */
  async setImmutabilityPolicy(immutabilityPolicy, options = {}) {
    return tracingClient.withSpan("BlobClient-setImmutabilityPolicy", options, async (updatedOptions) => {
      return assertResponse(await this.blobContext.setImmutabilityPolicy({
        immutabilityPolicyExpiry: immutabilityPolicy.expiriesOn,
        immutabilityPolicyMode: immutabilityPolicy.policyMode,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Set legal hold on the blob.
   *
   * @param options - Optional options to set legal hold on the blob.
   */
  async setLegalHold(legalHoldEnabled, options = {}) {
    return tracingClient.withSpan("BlobClient-setLegalHold", options, async (updatedOptions) => {
      return assertResponse(await this.blobContext.setLegalHold(legalHoldEnabled, {
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * The Get Account Information operation returns the sku name and account kind
   * for the specified account.
   * The Get Account Information operation is available on service versions beginning
   * with version 2018-03-28.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-account-information
   *
   * @param options - Options to the Service Get Account Info operation.
   * @returns Response data for the Service Get Account Info operation.
   */
  async getAccountInfo(options = {}) {
    return tracingClient.withSpan("BlobClient-getAccountInfo", options, async (updatedOptions) => {
      return assertResponse(await this.blobContext.getAccountInfo({
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
};
var AppendBlobClient = class _AppendBlobClient extends BlobClient {
  constructor(urlOrConnectionString, credentialOrPipelineOrContainerName, blobNameOrOptions, options) {
    let pipeline;
    let url2;
    options = options || {};
    if (isPipelineLike(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      pipeline = credentialOrPipelineOrContainerName;
    } else if (isNode && credentialOrPipelineOrContainerName instanceof StorageSharedKeyCredential || credentialOrPipelineOrContainerName instanceof AnonymousCredential || isTokenCredential(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      options = blobNameOrOptions;
      pipeline = newPipeline(credentialOrPipelineOrContainerName, options);
    } else if (!credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName !== "string") {
      url2 = urlOrConnectionString;
      pipeline = newPipeline(new AnonymousCredential(), options);
    } else if (credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName === "string" && blobNameOrOptions && typeof blobNameOrOptions === "string") {
      const containerName = credentialOrPipelineOrContainerName;
      const blobName = blobNameOrOptions;
      const extractedCreds = extractConnectionStringParts(urlOrConnectionString);
      if (extractedCreds.kind === "AccountConnString") {
        if (isNode) {
          const sharedKeyCredential = new StorageSharedKeyCredential(extractedCreds.accountName, extractedCreds.accountKey);
          url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName));
          if (!options.proxyOptions) {
            options.proxyOptions = getDefaultProxySettings(extractedCreds.proxyUri);
          }
          pipeline = newPipeline(sharedKeyCredential, options);
        } else {
          throw new Error("Account connection string is only supported in Node.js environment");
        }
      } else if (extractedCreds.kind === "SASConnString") {
        url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName)) + "?" + extractedCreds.accountSas;
        pipeline = newPipeline(new AnonymousCredential(), options);
      } else {
        throw new Error("Connection string must be either an Account connection string or a SAS connection string");
      }
    } else {
      throw new Error("Expecting non-empty strings for containerName and blobName parameters");
    }
    super(url2, pipeline);
    this.appendBlobContext = this.storageClientContext.appendBlob;
  }
  /**
   * Creates a new AppendBlobClient object identical to the source but with the
   * specified snapshot timestamp.
   * Provide "" will remove the snapshot and return a Client to the base blob.
   *
   * @param snapshot - The snapshot timestamp.
   * @returns A new AppendBlobClient object identical to the source but with the specified snapshot timestamp.
   */
  withSnapshot(snapshot2) {
    return new _AppendBlobClient(setURLParameter(this.url, URLConstants.Parameters.SNAPSHOT, snapshot2.length === 0 ? void 0 : snapshot2), this.pipeline);
  }
  /**
   * Creates a 0-length append blob. Call AppendBlock to append data to an append blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-blob
   *
   * @param options - Options to the Append Block Create operation.
   *
   *
   * Example usage:
   *
   * ```js
   * const appendBlobClient = containerClient.getAppendBlobClient("<blob name>");
   * await appendBlobClient.create();
   * ```
   */
  async create(options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("AppendBlobClient-create", options, async (updatedOptions) => {
      var _a3, _b2, _c2;
      return assertResponse(await this.appendBlobContext.create(0, {
        abortSignal: options.abortSignal,
        blobHttpHeaders: options.blobHTTPHeaders,
        leaseAccessConditions: options.conditions,
        metadata: options.metadata,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        immutabilityPolicyExpiry: (_b2 = options.immutabilityPolicy) === null || _b2 === void 0 ? void 0 : _b2.expiriesOn,
        immutabilityPolicyMode: (_c2 = options.immutabilityPolicy) === null || _c2 === void 0 ? void 0 : _c2.policyMode,
        legalHold: options.legalHold,
        blobTagsString: toBlobTagsString(options.tags),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Creates a 0-length append blob. Call AppendBlock to append data to an append blob.
   * If the blob with the same name already exists, the content of the existing blob will remain unchanged.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-blob
   *
   * @param options -
   */
  async createIfNotExists(options = {}) {
    const conditions = { ifNoneMatch: ETagAny };
    return tracingClient.withSpan("AppendBlobClient-createIfNotExists", options, async (updatedOptions) => {
      var _a3, _b2;
      try {
        const res = assertResponse(await this.create(Object.assign(Object.assign({}, updatedOptions), { conditions })));
        return Object.assign(Object.assign({ succeeded: true }, res), { _response: res._response });
      } catch (e) {
        if (((_a3 = e.details) === null || _a3 === void 0 ? void 0 : _a3.errorCode) === "BlobAlreadyExists") {
          return Object.assign(Object.assign({ succeeded: false }, (_b2 = e.response) === null || _b2 === void 0 ? void 0 : _b2.parsedHeaders), { _response: e.response });
        }
        throw e;
      }
    });
  }
  /**
   * Seals the append blob, making it read only.
   *
   * @param options -
   */
  async seal(options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("AppendBlobClient-seal", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.appendBlobContext.seal({
        abortSignal: options.abortSignal,
        appendPositionAccessConditions: options.conditions,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Commits a new block of data to the end of the existing append blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/append-block
   *
   * @param body - Data to be appended.
   * @param contentLength - Length of the body in bytes.
   * @param options - Options to the Append Block operation.
   *
   *
   * Example usage:
   *
   * ```js
   * const content = "Hello World!";
   *
   * // Create a new append blob and append data to the blob.
   * const newAppendBlobClient = containerClient.getAppendBlobClient("<blob name>");
   * await newAppendBlobClient.create();
   * await newAppendBlobClient.appendBlock(content, content.length);
   *
   * // Append data to an existing append blob.
   * const existingAppendBlobClient = containerClient.getAppendBlobClient("<blob name>");
   * await existingAppendBlobClient.appendBlock(content, content.length);
   * ```
   */
  async appendBlock(body2, contentLength2, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("AppendBlobClient-appendBlock", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.appendBlobContext.appendBlock(contentLength2, body2, {
        abortSignal: options.abortSignal,
        appendPositionAccessConditions: options.conditions,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        requestOptions: {
          onUploadProgress: options.onProgress
        },
        transactionalContentMD5: options.transactionalContentMD5,
        transactionalContentCrc64: options.transactionalContentCrc64,
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * The Append Block operation commits a new block of data to the end of an existing append blob
   * where the contents are read from a source url.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/append-block-from-url
   *
   * @param sourceURL -
   *                 The url to the blob that will be the source of the copy. A source blob in the same storage account can
   *                 be authenticated via Shared Key. However, if the source is a blob in another account, the source blob
   *                 must either be public or must be authenticated via a shared access signature. If the source blob is
   *                 public, no authentication is required to perform the operation.
   * @param sourceOffset - Offset in source to be appended
   * @param count - Number of bytes to be appended as a block
   * @param options -
   */
  async appendBlockFromURL(sourceURL, sourceOffset, count, options = {}) {
    options.conditions = options.conditions || {};
    options.sourceConditions = options.sourceConditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("AppendBlobClient-appendBlockFromURL", options, async (updatedOptions) => {
      var _a3, _b2, _c2, _d2, _e;
      return assertResponse(await this.appendBlobContext.appendBlockFromUrl(sourceURL, 0, {
        abortSignal: options.abortSignal,
        sourceRange: rangeToString({ offset: sourceOffset, count }),
        sourceContentMD5: options.sourceContentMD5,
        sourceContentCrc64: options.sourceContentCrc64,
        leaseAccessConditions: options.conditions,
        appendPositionAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        sourceModifiedAccessConditions: {
          sourceIfMatch: (_b2 = options.sourceConditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch,
          sourceIfModifiedSince: (_c2 = options.sourceConditions) === null || _c2 === void 0 ? void 0 : _c2.ifModifiedSince,
          sourceIfNoneMatch: (_d2 = options.sourceConditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch,
          sourceIfUnmodifiedSince: (_e = options.sourceConditions) === null || _e === void 0 ? void 0 : _e.ifUnmodifiedSince
        },
        copySourceAuthorization: httpAuthorizationToString(options.sourceAuthorization),
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
};
var BlockBlobClient = class _BlockBlobClient extends BlobClient {
  constructor(urlOrConnectionString, credentialOrPipelineOrContainerName, blobNameOrOptions, options) {
    let pipeline;
    let url2;
    options = options || {};
    if (isPipelineLike(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      pipeline = credentialOrPipelineOrContainerName;
    } else if (isNode && credentialOrPipelineOrContainerName instanceof StorageSharedKeyCredential || credentialOrPipelineOrContainerName instanceof AnonymousCredential || isTokenCredential(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      options = blobNameOrOptions;
      pipeline = newPipeline(credentialOrPipelineOrContainerName, options);
    } else if (!credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName !== "string") {
      url2 = urlOrConnectionString;
      if (blobNameOrOptions && typeof blobNameOrOptions !== "string") {
        options = blobNameOrOptions;
      }
      pipeline = newPipeline(new AnonymousCredential(), options);
    } else if (credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName === "string" && blobNameOrOptions && typeof blobNameOrOptions === "string") {
      const containerName = credentialOrPipelineOrContainerName;
      const blobName = blobNameOrOptions;
      const extractedCreds = extractConnectionStringParts(urlOrConnectionString);
      if (extractedCreds.kind === "AccountConnString") {
        if (isNode) {
          const sharedKeyCredential = new StorageSharedKeyCredential(extractedCreds.accountName, extractedCreds.accountKey);
          url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName));
          if (!options.proxyOptions) {
            options.proxyOptions = getDefaultProxySettings(extractedCreds.proxyUri);
          }
          pipeline = newPipeline(sharedKeyCredential, options);
        } else {
          throw new Error("Account connection string is only supported in Node.js environment");
        }
      } else if (extractedCreds.kind === "SASConnString") {
        url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName)) + "?" + extractedCreds.accountSas;
        pipeline = newPipeline(new AnonymousCredential(), options);
      } else {
        throw new Error("Connection string must be either an Account connection string or a SAS connection string");
      }
    } else {
      throw new Error("Expecting non-empty strings for containerName and blobName parameters");
    }
    super(url2, pipeline);
    this.blockBlobContext = this.storageClientContext.blockBlob;
    this._blobContext = this.storageClientContext.blob;
  }
  /**
   * Creates a new BlockBlobClient object identical to the source but with the
   * specified snapshot timestamp.
   * Provide "" will remove the snapshot and return a URL to the base blob.
   *
   * @param snapshot - The snapshot timestamp.
   * @returns A new BlockBlobClient object identical to the source but with the specified snapshot timestamp.
   */
  withSnapshot(snapshot2) {
    return new _BlockBlobClient(setURLParameter(this.url, URLConstants.Parameters.SNAPSHOT, snapshot2.length === 0 ? void 0 : snapshot2), this.pipeline);
  }
  /**
   * ONLY AVAILABLE IN NODE.JS RUNTIME.
   *
   * Quick query for a JSON or CSV formatted blob.
   *
   * Example usage (Node.js):
   *
   * ```js
   * // Query and convert a blob to a string
   * const queryBlockBlobResponse = await blockBlobClient.query("select * from BlobStorage");
   * const downloaded = (await streamToBuffer(queryBlockBlobResponse.readableStreamBody)).toString();
   * console.log("Query blob content:", downloaded);
   *
   * async function streamToBuffer(readableStream) {
   *   return new Promise((resolve, reject) => {
   *     const chunks = [];
   *     readableStream.on("data", (data) => {
   *       chunks.push(data instanceof Buffer ? data : Buffer.from(data));
   *     });
   *     readableStream.on("end", () => {
   *       resolve(Buffer.concat(chunks));
   *     });
   *     readableStream.on("error", reject);
   *   });
   * }
   * ```
   *
   * @param query -
   * @param options -
   */
  async query(query, options = {}) {
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    if (!isNode) {
      throw new Error("This operation currently is only supported in Node.js.");
    }
    return tracingClient.withSpan("BlockBlobClient-query", options, async (updatedOptions) => {
      var _a3;
      const response = assertResponse(await this._blobContext.query({
        abortSignal: options.abortSignal,
        queryRequest: {
          queryType: "SQL",
          expression: query,
          inputSerialization: toQuerySerialization(options.inputTextConfiguration),
          outputSerialization: toQuerySerialization(options.outputTextConfiguration)
        },
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        cpkInfo: options.customerProvidedKey,
        tracingOptions: updatedOptions.tracingOptions
      }));
      return new BlobQueryResponse(response, {
        abortSignal: options.abortSignal,
        onProgress: options.onProgress,
        onError: options.onError
      });
    });
  }
  /**
   * Creates a new block blob, or updates the content of an existing block blob.
   * Updating an existing block blob overwrites any existing metadata on the blob.
   * Partial updates are not supported; the content of the existing blob is
   * overwritten with the new content. To perform a partial update of a block blob's,
   * use {@link stageBlock} and {@link commitBlockList}.
   *
   * This is a non-parallel uploading method, please use {@link uploadFile},
   * {@link uploadStream} or {@link uploadBrowserData} for better performance
   * with concurrency uploading.
   *
   * @see https://docs.microsoft.com/rest/api/storageservices/put-blob
   *
   * @param body - Blob, string, ArrayBuffer, ArrayBufferView or a function
   *                               which returns a new Readable stream whose offset is from data source beginning.
   * @param contentLength - Length of body in bytes. Use Buffer.byteLength() to calculate body length for a
   *                               string including non non-Base64/Hex-encoded characters.
   * @param options - Options to the Block Blob Upload operation.
   * @returns Response data for the Block Blob Upload operation.
   *
   * Example usage:
   *
   * ```js
   * const content = "Hello world!";
   * const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
   * ```
   */
  async upload(body2, contentLength2, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlockBlobClient-upload", options, async (updatedOptions) => {
      var _a3, _b2, _c2;
      return assertResponse(await this.blockBlobContext.upload(contentLength2, body2, {
        abortSignal: options.abortSignal,
        blobHttpHeaders: options.blobHTTPHeaders,
        leaseAccessConditions: options.conditions,
        metadata: options.metadata,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        requestOptions: {
          onUploadProgress: options.onProgress
        },
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        immutabilityPolicyExpiry: (_b2 = options.immutabilityPolicy) === null || _b2 === void 0 ? void 0 : _b2.expiriesOn,
        immutabilityPolicyMode: (_c2 = options.immutabilityPolicy) === null || _c2 === void 0 ? void 0 : _c2.policyMode,
        legalHold: options.legalHold,
        tier: toAccessTier(options.tier),
        blobTagsString: toBlobTagsString(options.tags),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Creates a new Block Blob where the contents of the blob are read from a given URL.
   * This API is supported beginning with the 2020-04-08 version. Partial updates
   * are not supported with Put Blob from URL; the content of an existing blob is overwritten with
   * the content of the new blob.  To perform partial updates to a block blob’s contents using a
   * source URL, use {@link stageBlockFromURL} and {@link commitBlockList}.
   *
   * @param sourceURL - Specifies the URL of the blob. The value
   *                           may be a URL of up to 2 KB in length that specifies a blob.
   *                           The value should be URL-encoded as it would appear
   *                           in a request URI. The source blob must either be public
   *                           or must be authenticated via a shared access signature.
   *                           If the source blob is public, no authentication is required
   *                           to perform the operation. Here are some examples of source object URLs:
   *                           - https://myaccount.blob.core.windows.net/mycontainer/myblob
   *                           - https://myaccount.blob.core.windows.net/mycontainer/myblob?snapshot=<DateTime>
   * @param options - Optional parameters.
   */
  async syncUploadFromURL(sourceURL, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlockBlobClient-syncUploadFromURL", options, async (updatedOptions) => {
      var _a3, _b2, _c2, _d2, _e, _f;
      return assertResponse(await this.blockBlobContext.putBlobFromUrl(0, sourceURL, Object.assign(Object.assign({}, options), { blobHttpHeaders: options.blobHTTPHeaders, leaseAccessConditions: options.conditions, modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }), sourceModifiedAccessConditions: {
        sourceIfMatch: (_b2 = options.sourceConditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch,
        sourceIfModifiedSince: (_c2 = options.sourceConditions) === null || _c2 === void 0 ? void 0 : _c2.ifModifiedSince,
        sourceIfNoneMatch: (_d2 = options.sourceConditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch,
        sourceIfUnmodifiedSince: (_e = options.sourceConditions) === null || _e === void 0 ? void 0 : _e.ifUnmodifiedSince,
        sourceIfTags: (_f = options.sourceConditions) === null || _f === void 0 ? void 0 : _f.tagConditions
      }, cpkInfo: options.customerProvidedKey, copySourceAuthorization: httpAuthorizationToString(options.sourceAuthorization), tier: toAccessTier(options.tier), blobTagsString: toBlobTagsString(options.tags), copySourceTags: options.copySourceTags, tracingOptions: updatedOptions.tracingOptions })));
    });
  }
  /**
   * Uploads the specified block to the block blob's "staging area" to be later
   * committed by a call to commitBlockList.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-block
   *
   * @param blockId - A 64-byte value that is base64-encoded
   * @param body - Data to upload to the staging area.
   * @param contentLength - Number of bytes to upload.
   * @param options - Options to the Block Blob Stage Block operation.
   * @returns Response data for the Block Blob Stage Block operation.
   */
  async stageBlock(blockId2, body2, contentLength2, options = {}) {
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlockBlobClient-stageBlock", options, async (updatedOptions) => {
      return assertResponse(await this.blockBlobContext.stageBlock(blockId2, contentLength2, body2, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        requestOptions: {
          onUploadProgress: options.onProgress
        },
        transactionalContentMD5: options.transactionalContentMD5,
        transactionalContentCrc64: options.transactionalContentCrc64,
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * The Stage Block From URL operation creates a new block to be committed as part
   * of a blob where the contents are read from a URL.
   * This API is available starting in version 2018-03-28.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/put-block-from-url
   *
   * @param blockId - A 64-byte value that is base64-encoded
   * @param sourceURL - Specifies the URL of the blob. The value
   *                           may be a URL of up to 2 KB in length that specifies a blob.
   *                           The value should be URL-encoded as it would appear
   *                           in a request URI. The source blob must either be public
   *                           or must be authenticated via a shared access signature.
   *                           If the source blob is public, no authentication is required
   *                           to perform the operation. Here are some examples of source object URLs:
   *                           - https://myaccount.blob.core.windows.net/mycontainer/myblob
   *                           - https://myaccount.blob.core.windows.net/mycontainer/myblob?snapshot=<DateTime>
   * @param offset - From which position of the blob to download, greater than or equal to 0
   * @param count - How much data to be downloaded, greater than 0. Will download to the end when undefined
   * @param options - Options to the Block Blob Stage Block From URL operation.
   * @returns Response data for the Block Blob Stage Block From URL operation.
   */
  async stageBlockFromURL(blockId2, sourceURL, offset = 0, count, options = {}) {
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlockBlobClient-stageBlockFromURL", options, async (updatedOptions) => {
      return assertResponse(await this.blockBlobContext.stageBlockFromURL(blockId2, 0, sourceURL, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        sourceContentMD5: options.sourceContentMD5,
        sourceContentCrc64: options.sourceContentCrc64,
        sourceRange: offset === 0 && !count ? void 0 : rangeToString({ offset, count }),
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        copySourceAuthorization: httpAuthorizationToString(options.sourceAuthorization),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Writes a blob by specifying the list of block IDs that make up the blob.
   * In order to be written as part of a blob, a block must have been successfully written
   * to the server in a prior {@link stageBlock} operation. You can call {@link commitBlockList} to
   * update a blob by uploading only those blocks that have changed, then committing the new and existing
   * blocks together. Any blocks not specified in the block list and permanently deleted.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-block-list
   *
   * @param blocks -  Array of 64-byte value that is base64-encoded
   * @param options - Options to the Block Blob Commit Block List operation.
   * @returns Response data for the Block Blob Commit Block List operation.
   */
  async commitBlockList(blocks2, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("BlockBlobClient-commitBlockList", options, async (updatedOptions) => {
      var _a3, _b2, _c2;
      return assertResponse(await this.blockBlobContext.commitBlockList({ latest: blocks2 }, {
        abortSignal: options.abortSignal,
        blobHttpHeaders: options.blobHTTPHeaders,
        leaseAccessConditions: options.conditions,
        metadata: options.metadata,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        immutabilityPolicyExpiry: (_b2 = options.immutabilityPolicy) === null || _b2 === void 0 ? void 0 : _b2.expiriesOn,
        immutabilityPolicyMode: (_c2 = options.immutabilityPolicy) === null || _c2 === void 0 ? void 0 : _c2.policyMode,
        legalHold: options.legalHold,
        tier: toAccessTier(options.tier),
        blobTagsString: toBlobTagsString(options.tags),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Returns the list of blocks that have been uploaded as part of a block blob
   * using the specified block list filter.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-block-list
   *
   * @param listType - Specifies whether to return the list of committed blocks,
   *                                        the list of uncommitted blocks, or both lists together.
   * @param options - Options to the Block Blob Get Block List operation.
   * @returns Response data for the Block Blob Get Block List operation.
   */
  async getBlockList(listType2, options = {}) {
    return tracingClient.withSpan("BlockBlobClient-getBlockList", options, async (updatedOptions) => {
      var _a3;
      const res = assertResponse(await this.blockBlobContext.getBlockList(listType2, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
      if (!res.committedBlocks) {
        res.committedBlocks = [];
      }
      if (!res.uncommittedBlocks) {
        res.uncommittedBlocks = [];
      }
      return res;
    });
  }
  // High level functions
  /**
   * Uploads a Buffer(Node.js)/Blob(browsers)/ArrayBuffer/ArrayBufferView object to a BlockBlob.
   *
   * When data length is no more than the specifiled {@link BlockBlobParallelUploadOptions.maxSingleShotSize} (default is
   * {@link BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES}), this method will use 1 {@link upload} call to finish the upload.
   * Otherwise, this method will call {@link stageBlock} to upload blocks, and finally call {@link commitBlockList}
   * to commit the block list.
   *
   * A common {@link BlockBlobParallelUploadOptions.blobHTTPHeaders} option to set is
   * `blobContentType`, enabling the browser to provide
   * functionality based on file type.
   *
   * @param data - Buffer(Node.js), Blob, ArrayBuffer or ArrayBufferView
   * @param options -
   */
  async uploadData(data, options = {}) {
    return tracingClient.withSpan("BlockBlobClient-uploadData", options, async (updatedOptions) => {
      if (isNode) {
        let buffer;
        if (data instanceof Buffer) {
          buffer = data;
        } else if (data instanceof ArrayBuffer) {
          buffer = Buffer.from(data);
        } else {
          data = data;
          buffer = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
        }
        return this.uploadSeekableInternal((offset, size) => buffer.slice(offset, offset + size), buffer.byteLength, updatedOptions);
      } else {
        const browserBlob = new Blob([data]);
        return this.uploadSeekableInternal((offset, size) => browserBlob.slice(offset, offset + size), browserBlob.size, updatedOptions);
      }
    });
  }
  /**
   * ONLY AVAILABLE IN BROWSERS.
   *
   * Uploads a browser Blob/File/ArrayBuffer/ArrayBufferView object to block blob.
   *
   * When buffer length lesser than or equal to 256MB, this method will use 1 upload call to finish the upload.
   * Otherwise, this method will call {@link stageBlock} to upload blocks, and finally call
   * {@link commitBlockList} to commit the block list.
   *
   * A common {@link BlockBlobParallelUploadOptions.blobHTTPHeaders} option to set is
   * `blobContentType`, enabling the browser to provide
   * functionality based on file type.
   *
   * @deprecated Use {@link uploadData} instead.
   *
   * @param browserData - Blob, File, ArrayBuffer or ArrayBufferView
   * @param options - Options to upload browser data.
   * @returns Response data for the Blob Upload operation.
   */
  async uploadBrowserData(browserData, options = {}) {
    return tracingClient.withSpan("BlockBlobClient-uploadBrowserData", options, async (updatedOptions) => {
      const browserBlob = new Blob([browserData]);
      return this.uploadSeekableInternal((offset, size) => browserBlob.slice(offset, offset + size), browserBlob.size, updatedOptions);
    });
  }
  /**
   *
   * Uploads data to block blob. Requires a bodyFactory as the data source,
   * which need to return a {@link HttpRequestBody} object with the offset and size provided.
   *
   * When data length is no more than the specified {@link BlockBlobParallelUploadOptions.maxSingleShotSize} (default is
   * {@link BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES}), this method will use 1 {@link upload} call to finish the upload.
   * Otherwise, this method will call {@link stageBlock} to upload blocks, and finally call {@link commitBlockList}
   * to commit the block list.
   *
   * @param bodyFactory -
   * @param size - size of the data to upload.
   * @param options - Options to Upload to Block Blob operation.
   * @returns Response data for the Blob Upload operation.
   */
  async uploadSeekableInternal(bodyFactory, size, options = {}) {
    var _a3, _b2;
    let blockSize = (_a3 = options.blockSize) !== null && _a3 !== void 0 ? _a3 : 0;
    if (blockSize < 0 || blockSize > BLOCK_BLOB_MAX_STAGE_BLOCK_BYTES) {
      throw new RangeError(`blockSize option must be >= 0 and <= ${BLOCK_BLOB_MAX_STAGE_BLOCK_BYTES}`);
    }
    const maxSingleShotSize = (_b2 = options.maxSingleShotSize) !== null && _b2 !== void 0 ? _b2 : BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES;
    if (maxSingleShotSize < 0 || maxSingleShotSize > BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES) {
      throw new RangeError(`maxSingleShotSize option must be >= 0 and <= ${BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES}`);
    }
    if (blockSize === 0) {
      if (size > BLOCK_BLOB_MAX_STAGE_BLOCK_BYTES * BLOCK_BLOB_MAX_BLOCKS) {
        throw new RangeError(`${size} is too larger to upload to a block blob.`);
      }
      if (size > maxSingleShotSize) {
        blockSize = Math.ceil(size / BLOCK_BLOB_MAX_BLOCKS);
        if (blockSize < DEFAULT_BLOB_DOWNLOAD_BLOCK_BYTES) {
          blockSize = DEFAULT_BLOB_DOWNLOAD_BLOCK_BYTES;
        }
      }
    }
    if (!options.blobHTTPHeaders) {
      options.blobHTTPHeaders = {};
    }
    if (!options.conditions) {
      options.conditions = {};
    }
    return tracingClient.withSpan("BlockBlobClient-uploadSeekableInternal", options, async (updatedOptions) => {
      if (size <= maxSingleShotSize) {
        return assertResponse(await this.upload(bodyFactory(0, size), size, updatedOptions));
      }
      const numBlocks = Math.floor((size - 1) / blockSize) + 1;
      if (numBlocks > BLOCK_BLOB_MAX_BLOCKS) {
        throw new RangeError(`The buffer's size is too big or the BlockSize is too small;the number of blocks must be <= ${BLOCK_BLOB_MAX_BLOCKS}`);
      }
      const blockList = [];
      const blockIDPrefix = randomUUID();
      let transferProgress = 0;
      const batch = new Batch(options.concurrency);
      for (let i = 0; i < numBlocks; i++) {
        batch.addOperation(async () => {
          const blockID = generateBlockID(blockIDPrefix, i);
          const start = blockSize * i;
          const end = i === numBlocks - 1 ? size : start + blockSize;
          const contentLength2 = end - start;
          blockList.push(blockID);
          await this.stageBlock(blockID, bodyFactory(start, contentLength2), contentLength2, {
            abortSignal: options.abortSignal,
            conditions: options.conditions,
            encryptionScope: options.encryptionScope,
            tracingOptions: updatedOptions.tracingOptions
          });
          transferProgress += contentLength2;
          if (options.onProgress) {
            options.onProgress({
              loadedBytes: transferProgress
            });
          }
        });
      }
      await batch.do();
      return this.commitBlockList(blockList, updatedOptions);
    });
  }
  /**
   * ONLY AVAILABLE IN NODE.JS RUNTIME.
   *
   * Uploads a local file in blocks to a block blob.
   *
   * When file size lesser than or equal to 256MB, this method will use 1 upload call to finish the upload.
   * Otherwise, this method will call stageBlock to upload blocks, and finally call commitBlockList
   * to commit the block list.
   *
   * @param filePath - Full path of local file
   * @param options - Options to Upload to Block Blob operation.
   * @returns Response data for the Blob Upload operation.
   */
  async uploadFile(filePath, options = {}) {
    return tracingClient.withSpan("BlockBlobClient-uploadFile", options, async (updatedOptions) => {
      const size = (await fsStat(filePath)).size;
      return this.uploadSeekableInternal((offset, count) => {
        return () => fsCreateReadStream(filePath, {
          autoClose: true,
          end: count ? offset + count - 1 : Infinity,
          start: offset
        });
      }, size, Object.assign(Object.assign({}, options), { tracingOptions: updatedOptions.tracingOptions }));
    });
  }
  /**
   * ONLY AVAILABLE IN NODE.JS RUNTIME.
   *
   * Uploads a Node.js Readable stream into block blob.
   *
   * PERFORMANCE IMPROVEMENT TIPS:
   * * Input stream highWaterMark is better to set a same value with bufferSize
   *    parameter, which will avoid Buffer.concat() operations.
   *
   * @param stream - Node.js Readable stream
   * @param bufferSize - Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB
   * @param maxConcurrency -  Max concurrency indicates the max number of buffers that can be allocated,
   *                                 positive correlation with max uploading concurrency. Default value is 5
   * @param options - Options to Upload Stream to Block Blob operation.
   * @returns Response data for the Blob Upload operation.
   */
  async uploadStream(stream, bufferSize = DEFAULT_BLOCK_BUFFER_SIZE_BYTES, maxConcurrency = 5, options = {}) {
    if (!options.blobHTTPHeaders) {
      options.blobHTTPHeaders = {};
    }
    if (!options.conditions) {
      options.conditions = {};
    }
    return tracingClient.withSpan("BlockBlobClient-uploadStream", options, async (updatedOptions) => {
      let blockNum = 0;
      const blockIDPrefix = randomUUID();
      let transferProgress = 0;
      const blockList = [];
      const scheduler = new BufferScheduler(
        stream,
        bufferSize,
        maxConcurrency,
        async (body2, length) => {
          const blockID = generateBlockID(blockIDPrefix, blockNum);
          blockList.push(blockID);
          blockNum++;
          await this.stageBlock(blockID, body2, length, {
            customerProvidedKey: options.customerProvidedKey,
            conditions: options.conditions,
            encryptionScope: options.encryptionScope,
            tracingOptions: updatedOptions.tracingOptions
          });
          transferProgress += length;
          if (options.onProgress) {
            options.onProgress({ loadedBytes: transferProgress });
          }
        },
        // concurrency should set a smaller value than maxConcurrency, which is helpful to
        // reduce the possibility when a outgoing handler waits for stream data, in
        // this situation, outgoing handlers are blocked.
        // Outgoing queue shouldn't be empty.
        Math.ceil(maxConcurrency / 4 * 3)
      );
      await scheduler.do();
      return assertResponse(await this.commitBlockList(blockList, Object.assign(Object.assign({}, options), { tracingOptions: updatedOptions.tracingOptions })));
    });
  }
};
var PageBlobClient = class _PageBlobClient extends BlobClient {
  constructor(urlOrConnectionString, credentialOrPipelineOrContainerName, blobNameOrOptions, options) {
    let pipeline;
    let url2;
    options = options || {};
    if (isPipelineLike(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      pipeline = credentialOrPipelineOrContainerName;
    } else if (isNode && credentialOrPipelineOrContainerName instanceof StorageSharedKeyCredential || credentialOrPipelineOrContainerName instanceof AnonymousCredential || isTokenCredential(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      options = blobNameOrOptions;
      pipeline = newPipeline(credentialOrPipelineOrContainerName, options);
    } else if (!credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName !== "string") {
      url2 = urlOrConnectionString;
      pipeline = newPipeline(new AnonymousCredential(), options);
    } else if (credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName === "string" && blobNameOrOptions && typeof blobNameOrOptions === "string") {
      const containerName = credentialOrPipelineOrContainerName;
      const blobName = blobNameOrOptions;
      const extractedCreds = extractConnectionStringParts(urlOrConnectionString);
      if (extractedCreds.kind === "AccountConnString") {
        if (isNode) {
          const sharedKeyCredential = new StorageSharedKeyCredential(extractedCreds.accountName, extractedCreds.accountKey);
          url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName));
          if (!options.proxyOptions) {
            options.proxyOptions = getDefaultProxySettings(extractedCreds.proxyUri);
          }
          pipeline = newPipeline(sharedKeyCredential, options);
        } else {
          throw new Error("Account connection string is only supported in Node.js environment");
        }
      } else if (extractedCreds.kind === "SASConnString") {
        url2 = appendToURLPath(appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)), encodeURIComponent(blobName)) + "?" + extractedCreds.accountSas;
        pipeline = newPipeline(new AnonymousCredential(), options);
      } else {
        throw new Error("Connection string must be either an Account connection string or a SAS connection string");
      }
    } else {
      throw new Error("Expecting non-empty strings for containerName and blobName parameters");
    }
    super(url2, pipeline);
    this.pageBlobContext = this.storageClientContext.pageBlob;
  }
  /**
   * Creates a new PageBlobClient object identical to the source but with the
   * specified snapshot timestamp.
   * Provide "" will remove the snapshot and return a Client to the base blob.
   *
   * @param snapshot - The snapshot timestamp.
   * @returns A new PageBlobClient object identical to the source but with the specified snapshot timestamp.
   */
  withSnapshot(snapshot2) {
    return new _PageBlobClient(setURLParameter(this.url, URLConstants.Parameters.SNAPSHOT, snapshot2.length === 0 ? void 0 : snapshot2), this.pipeline);
  }
  /**
   * Creates a page blob of the specified length. Call uploadPages to upload data
   * data to a page blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-blob
   *
   * @param size - size of the page blob.
   * @param options - Options to the Page Blob Create operation.
   * @returns Response data for the Page Blob Create operation.
   */
  async create(size, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("PageBlobClient-create", options, async (updatedOptions) => {
      var _a3, _b2, _c2;
      return assertResponse(await this.pageBlobContext.create(0, size, {
        abortSignal: options.abortSignal,
        blobHttpHeaders: options.blobHTTPHeaders,
        blobSequenceNumber: options.blobSequenceNumber,
        leaseAccessConditions: options.conditions,
        metadata: options.metadata,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        immutabilityPolicyExpiry: (_b2 = options.immutabilityPolicy) === null || _b2 === void 0 ? void 0 : _b2.expiriesOn,
        immutabilityPolicyMode: (_c2 = options.immutabilityPolicy) === null || _c2 === void 0 ? void 0 : _c2.policyMode,
        legalHold: options.legalHold,
        tier: toAccessTier(options.tier),
        blobTagsString: toBlobTagsString(options.tags),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Creates a page blob of the specified length. Call uploadPages to upload data
   * data to a page blob. If the blob with the same name already exists, the content
   * of the existing blob will remain unchanged.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-blob
   *
   * @param size - size of the page blob.
   * @param options -
   */
  async createIfNotExists(size, options = {}) {
    return tracingClient.withSpan("PageBlobClient-createIfNotExists", options, async (updatedOptions) => {
      var _a3, _b2;
      try {
        const conditions = { ifNoneMatch: ETagAny };
        const res = assertResponse(await this.create(size, Object.assign(Object.assign({}, options), { conditions, tracingOptions: updatedOptions.tracingOptions })));
        return Object.assign(Object.assign({ succeeded: true }, res), { _response: res._response });
      } catch (e) {
        if (((_a3 = e.details) === null || _a3 === void 0 ? void 0 : _a3.errorCode) === "BlobAlreadyExists") {
          return Object.assign(Object.assign({ succeeded: false }, (_b2 = e.response) === null || _b2 === void 0 ? void 0 : _b2.parsedHeaders), { _response: e.response });
        }
        throw e;
      }
    });
  }
  /**
   * Writes 1 or more pages to the page blob. The start and end offsets must be a multiple of 512.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-page
   *
   * @param body - Data to upload
   * @param offset - Offset of destination page blob
   * @param count - Content length of the body, also number of bytes to be uploaded
   * @param options - Options to the Page Blob Upload Pages operation.
   * @returns Response data for the Page Blob Upload Pages operation.
   */
  async uploadPages(body2, offset, count, options = {}) {
    options.conditions = options.conditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("PageBlobClient-uploadPages", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.pageBlobContext.uploadPages(count, body2, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        requestOptions: {
          onUploadProgress: options.onProgress
        },
        range: rangeToString({ offset, count }),
        sequenceNumberAccessConditions: options.conditions,
        transactionalContentMD5: options.transactionalContentMD5,
        transactionalContentCrc64: options.transactionalContentCrc64,
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * The Upload Pages operation writes a range of pages to a page blob where the
   * contents are read from a URL.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/put-page-from-url
   *
   * @param sourceURL - Specify a URL to the copy source, Shared Access Signature(SAS) maybe needed for authentication
   * @param sourceOffset - The source offset to copy from. Pass 0 to copy from the beginning of source page blob
   * @param destOffset - Offset of destination page blob
   * @param count - Number of bytes to be uploaded from source page blob
   * @param options -
   */
  async uploadPagesFromURL(sourceURL, sourceOffset, destOffset, count, options = {}) {
    options.conditions = options.conditions || {};
    options.sourceConditions = options.sourceConditions || {};
    ensureCpkIfSpecified(options.customerProvidedKey, this.isHttps);
    return tracingClient.withSpan("PageBlobClient-uploadPagesFromURL", options, async (updatedOptions) => {
      var _a3, _b2, _c2, _d2, _e;
      return assertResponse(await this.pageBlobContext.uploadPagesFromURL(sourceURL, rangeToString({ offset: sourceOffset, count }), 0, rangeToString({ offset: destOffset, count }), {
        abortSignal: options.abortSignal,
        sourceContentMD5: options.sourceContentMD5,
        sourceContentCrc64: options.sourceContentCrc64,
        leaseAccessConditions: options.conditions,
        sequenceNumberAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        sourceModifiedAccessConditions: {
          sourceIfMatch: (_b2 = options.sourceConditions) === null || _b2 === void 0 ? void 0 : _b2.ifMatch,
          sourceIfModifiedSince: (_c2 = options.sourceConditions) === null || _c2 === void 0 ? void 0 : _c2.ifModifiedSince,
          sourceIfNoneMatch: (_d2 = options.sourceConditions) === null || _d2 === void 0 ? void 0 : _d2.ifNoneMatch,
          sourceIfUnmodifiedSince: (_e = options.sourceConditions) === null || _e === void 0 ? void 0 : _e.ifUnmodifiedSince
        },
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        copySourceAuthorization: httpAuthorizationToString(options.sourceAuthorization),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Frees the specified pages from the page blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/put-page
   *
   * @param offset - Starting byte position of the pages to clear.
   * @param count - Number of bytes to clear.
   * @param options - Options to the Page Blob Clear Pages operation.
   * @returns Response data for the Page Blob Clear Pages operation.
   */
  async clearPages(offset = 0, count, options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("PageBlobClient-clearPages", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.pageBlobContext.clearPages(0, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        range: rangeToString({ offset, count }),
        sequenceNumberAccessConditions: options.conditions,
        cpkInfo: options.customerProvidedKey,
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Returns the list of valid page ranges for a page blob or snapshot of a page blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-page-ranges
   *
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param options - Options to the Page Blob Get Ranges operation.
   * @returns Response data for the Page Blob Get Ranges operation.
   */
  async getPageRanges(offset = 0, count, options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("PageBlobClient-getPageRanges", options, async (updatedOptions) => {
      var _a3;
      const response = assertResponse(await this.pageBlobContext.getPageRanges({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        range: rangeToString({ offset, count }),
        tracingOptions: updatedOptions.tracingOptions
      }));
      return rangeResponseFromModel(response);
    });
  }
  /**
   * getPageRangesSegment returns a single segment of page ranges starting from the
   * specified Marker. Use an empty Marker to start enumeration from the beginning.
   * After getting a segment, process it, and then call getPageRangesSegment again
   * (passing the the previously-returned Marker) to get the next segment.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-page-ranges
   *
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param marker - A string value that identifies the portion of the list to be returned with the next list operation.
   * @param options - Options to PageBlob Get Page Ranges Segment operation.
   */
  async listPageRangesSegment(offset = 0, count, marker2, options = {}) {
    return tracingClient.withSpan("PageBlobClient-getPageRangesSegment", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.pageBlobContext.getPageRanges({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        range: rangeToString({ offset, count }),
        marker: marker2,
        maxPageSize: options.maxPageSize,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Returns an AsyncIterableIterator for {@link PageBlobGetPageRangesResponseModel}
   *
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param marker - A string value that identifies the portion of
   *                          the get of page ranges to be returned with the next getting operation. The
   *                          operation returns the ContinuationToken value within the response body if the
   *                          getting operation did not return all page ranges remaining within the current page.
   *                          The ContinuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of get
   *                          items. The marker value is opaque to the client.
   * @param options - Options to List Page Ranges operation.
   */
  listPageRangeItemSegments() {
    return __asyncGenerator(this, arguments, function* listPageRangeItemSegments_1(offset = 0, count, marker2, options = {}) {
      let getPageRangeItemSegmentsResponse;
      if (!!marker2 || marker2 === void 0) {
        do {
          getPageRangeItemSegmentsResponse = yield __await(this.listPageRangesSegment(offset, count, marker2, options));
          marker2 = getPageRangeItemSegmentsResponse.continuationToken;
          yield yield __await(yield __await(getPageRangeItemSegmentsResponse));
        } while (marker2);
      }
    });
  }
  /**
   * Returns an AsyncIterableIterator of {@link PageRangeInfo} objects
   *
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param options - Options to List Page Ranges operation.
   */
  listPageRangeItems() {
    return __asyncGenerator(this, arguments, function* listPageRangeItems_1(offset = 0, count, options = {}) {
      var _a3, e_1, _b2, _c2;
      let marker2;
      try {
        for (var _d2 = true, _e = __asyncValues(this.listPageRangeItemSegments(offset, count, marker2, options)), _f; _f = yield __await(_e.next()), _a3 = _f.done, !_a3; _d2 = true) {
          _c2 = _f.value;
          _d2 = false;
          const getPageRangesSegment = _c2;
          yield __await(yield* __asyncDelegator(__asyncValues(ExtractPageRangeInfoItems(getPageRangesSegment))));
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_d2 && !_a3 && (_b2 = _e.return)) yield __await(_b2.call(_e));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
  /**
   * Returns an async iterable iterator to list of page ranges for a page blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-page-ranges
   *
   *  .byPage() returns an async iterable iterator to list of page ranges for a page blob.
   *
   * Example using `for await` syntax:
   *
   * ```js
   * // Get the pageBlobClient before you run these snippets,
   * // Can be obtained from `blobServiceClient.getContainerClient("<your-container-name>").getPageBlobClient("<your-blob-name>");`
   * let i = 1;
   * for await (const pageRange of pageBlobClient.listPageRanges()) {
   *   console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   * }
   * ```
   *
   * Example using `iter.next()`:
   *
   * ```js
   * let i = 1;
   * let iter = pageBlobClient.listPageRanges();
   * let pageRangeItem = await iter.next();
   * while (!pageRangeItem.done) {
   *   console.log(`Page range ${i++}: ${pageRangeItem.value.start} - ${pageRangeItem.value.end}, IsClear: ${pageRangeItem.value.isClear}`);
   *   pageRangeItem = await iter.next();
   * }
   * ```
   *
   * Example using `byPage()`:
   *
   * ```js
   * // passing optional maxPageSize in the page settings
   * let i = 1;
   * for await (const response of pageBlobClient.listPageRanges().byPage({ maxPageSize: 20 })) {
   *   for (const pageRange of response) {
   *     console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   *   }
   * }
   * ```
   *
   * Example using paging with a marker:
   *
   * ```js
   * let i = 1;
   * let iterator = pageBlobClient.listPageRanges().byPage({ maxPageSize: 2 });
   * let response = (await iterator.next()).value;
   *
   * // Prints 2 page ranges
   * for (const pageRange of response) {
   *   console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   * }
   *
   * // Gets next marker
   * let marker = response.continuationToken;
   *
   * // Passing next marker as continuationToken
   *
   * iterator = pageBlobClient.listPageRanges().byPage({ continuationToken: marker, maxPageSize: 10 });
   * response = (await iterator.next()).value;
   *
   * // Prints 10 page ranges
   * for (const blob of response) {
   *   console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   * }
   * ```
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param options - Options to the Page Blob Get Ranges operation.
   * @returns An asyncIterableIterator that supports paging.
   */
  listPageRanges(offset = 0, count, options = {}) {
    options.conditions = options.conditions || {};
    const iter = this.listPageRangeItems(offset, count, options);
    return {
      /**
       * The next method, part of the iteration protocol
       */
      next() {
        return iter.next();
      },
      /**
       * The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings = {}) => {
        return this.listPageRangeItemSegments(offset, count, settings.continuationToken, Object.assign({ maxPageSize: settings.maxPageSize }, options));
      }
    };
  }
  /**
   * Gets the collection of page ranges that differ between a specified snapshot and this page blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-page-ranges
   *
   * @param offset - Starting byte position of the page blob
   * @param count - Number of bytes to get ranges diff.
   * @param prevSnapshot - Timestamp of snapshot to retrieve the difference.
   * @param options - Options to the Page Blob Get Page Ranges Diff operation.
   * @returns Response data for the Page Blob Get Page Range Diff operation.
   */
  async getPageRangesDiff(offset, count, prevSnapshot, options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("PageBlobClient-getPageRangesDiff", options, async (updatedOptions) => {
      var _a3;
      const result = assertResponse(await this.pageBlobContext.getPageRangesDiff({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        prevsnapshot: prevSnapshot,
        range: rangeToString({ offset, count }),
        tracingOptions: updatedOptions.tracingOptions
      }));
      return rangeResponseFromModel(result);
    });
  }
  /**
   * getPageRangesDiffSegment returns a single segment of page ranges starting from the
   * specified Marker for difference between previous snapshot and the target page blob.
   * Use an empty Marker to start enumeration from the beginning.
   * After getting a segment, process it, and then call getPageRangesDiffSegment again
   * (passing the the previously-returned Marker) to get the next segment.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-page-ranges
   *
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param prevSnapshotOrUrl - Timestamp of snapshot to retrieve the difference or URL of snapshot to retrieve the difference.
   * @param marker - A string value that identifies the portion of the get to be returned with the next get operation.
   * @param options - Options to the Page Blob Get Page Ranges Diff operation.
   */
  async listPageRangesDiffSegment(offset, count, prevSnapshotOrUrl, marker2, options = {}) {
    return tracingClient.withSpan("PageBlobClient-getPageRangesDiffSegment", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.pageBlobContext.getPageRangesDiff({
        abortSignal: options === null || options === void 0 ? void 0 : options.abortSignal,
        leaseAccessConditions: options === null || options === void 0 ? void 0 : options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.conditions), { ifTags: (_a3 = options === null || options === void 0 ? void 0 : options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        prevsnapshot: prevSnapshotOrUrl,
        range: rangeToString({
          offset,
          count
        }),
        marker: marker2,
        maxPageSize: options === null || options === void 0 ? void 0 : options.maxPageSize,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Returns an AsyncIterableIterator for {@link PageBlobGetPageRangesDiffResponseModel}
   *
   *
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param prevSnapshotOrUrl - Timestamp of snapshot to retrieve the difference or URL of snapshot to retrieve the difference.
   * @param marker - A string value that identifies the portion of
   *                          the get of page ranges to be returned with the next getting operation. The
   *                          operation returns the ContinuationToken value within the response body if the
   *                          getting operation did not return all page ranges remaining within the current page.
   *                          The ContinuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of get
   *                          items. The marker value is opaque to the client.
   * @param options - Options to the Page Blob Get Page Ranges Diff operation.
   */
  listPageRangeDiffItemSegments(offset, count, prevSnapshotOrUrl, marker2, options) {
    return __asyncGenerator(this, arguments, function* listPageRangeDiffItemSegments_1() {
      let getPageRangeItemSegmentsResponse;
      if (!!marker2 || marker2 === void 0) {
        do {
          getPageRangeItemSegmentsResponse = yield __await(this.listPageRangesDiffSegment(offset, count, prevSnapshotOrUrl, marker2, options));
          marker2 = getPageRangeItemSegmentsResponse.continuationToken;
          yield yield __await(yield __await(getPageRangeItemSegmentsResponse));
        } while (marker2);
      }
    });
  }
  /**
   * Returns an AsyncIterableIterator of {@link PageRangeInfo} objects
   *
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param prevSnapshotOrUrl - Timestamp of snapshot to retrieve the difference or URL of snapshot to retrieve the difference.
   * @param options - Options to the Page Blob Get Page Ranges Diff operation.
   */
  listPageRangeDiffItems(offset, count, prevSnapshotOrUrl, options) {
    return __asyncGenerator(this, arguments, function* listPageRangeDiffItems_1() {
      var _a3, e_2, _b2, _c2;
      let marker2;
      try {
        for (var _d2 = true, _e = __asyncValues(this.listPageRangeDiffItemSegments(offset, count, prevSnapshotOrUrl, marker2, options)), _f; _f = yield __await(_e.next()), _a3 = _f.done, !_a3; _d2 = true) {
          _c2 = _f.value;
          _d2 = false;
          const getPageRangesSegment = _c2;
          yield __await(yield* __asyncDelegator(__asyncValues(ExtractPageRangeInfoItems(getPageRangesSegment))));
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (!_d2 && !_a3 && (_b2 = _e.return)) yield __await(_b2.call(_e));
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    });
  }
  /**
   * Returns an async iterable iterator to list of page ranges that differ between a specified snapshot and this page blob.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-page-ranges
   *
   *  .byPage() returns an async iterable iterator to list of page ranges that differ between a specified snapshot and this page blob.
   *
   * Example using `for await` syntax:
   *
   * ```js
   * // Get the pageBlobClient before you run these snippets,
   * // Can be obtained from `blobServiceClient.getContainerClient("<your-container-name>").getPageBlobClient("<your-blob-name>");`
   * let i = 1;
   * for await (const pageRange of pageBlobClient.listPageRangesDiff()) {
   *   console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   * }
   * ```
   *
   * Example using `iter.next()`:
   *
   * ```js
   * let i = 1;
   * let iter = pageBlobClient.listPageRangesDiff();
   * let pageRangeItem = await iter.next();
   * while (!pageRangeItem.done) {
   *   console.log(`Page range ${i++}: ${pageRangeItem.value.start} - ${pageRangeItem.value.end}, IsClear: ${pageRangeItem.value.isClear}`);
   *   pageRangeItem = await iter.next();
   * }
   * ```
   *
   * Example using `byPage()`:
   *
   * ```js
   * // passing optional maxPageSize in the page settings
   * let i = 1;
   * for await (const response of pageBlobClient.listPageRangesDiff().byPage({ maxPageSize: 20 })) {
   *   for (const pageRange of response) {
   *     console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   *   }
   * }
   * ```
   *
   * Example using paging with a marker:
   *
   * ```js
   * let i = 1;
   * let iterator = pageBlobClient.listPageRangesDiff().byPage({ maxPageSize: 2 });
   * let response = (await iterator.next()).value;
   *
   * // Prints 2 page ranges
   * for (const pageRange of response) {
   *   console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   * }
   *
   * // Gets next marker
   * let marker = response.continuationToken;
   *
   * // Passing next marker as continuationToken
   *
   * iterator = pageBlobClient.listPageRangesDiff().byPage({ continuationToken: marker, maxPageSize: 10 });
   * response = (await iterator.next()).value;
   *
   * // Prints 10 page ranges
   * for (const blob of response) {
   *   console.log(`Page range ${i++}: ${pageRange.start} - ${pageRange.end}`);
   * }
   * ```
   * @param offset - Starting byte position of the page ranges.
   * @param count - Number of bytes to get.
   * @param prevSnapshot - Timestamp of snapshot to retrieve the difference.
   * @param options - Options to the Page Blob Get Ranges operation.
   * @returns An asyncIterableIterator that supports paging.
   */
  listPageRangesDiff(offset, count, prevSnapshot, options = {}) {
    options.conditions = options.conditions || {};
    const iter = this.listPageRangeDiffItems(offset, count, prevSnapshot, Object.assign({}, options));
    return {
      /**
       * The next method, part of the iteration protocol
       */
      next() {
        return iter.next();
      },
      /**
       * The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings = {}) => {
        return this.listPageRangeDiffItemSegments(offset, count, prevSnapshot, settings.continuationToken, Object.assign({ maxPageSize: settings.maxPageSize }, options));
      }
    };
  }
  /**
   * Gets the collection of page ranges that differ between a specified snapshot and this page blob for managed disks.
   * @see https://docs.microsoft.com/rest/api/storageservices/get-page-ranges
   *
   * @param offset - Starting byte position of the page blob
   * @param count - Number of bytes to get ranges diff.
   * @param prevSnapshotUrl - URL of snapshot to retrieve the difference.
   * @param options - Options to the Page Blob Get Page Ranges Diff operation.
   * @returns Response data for the Page Blob Get Page Range Diff operation.
   */
  async getPageRangesDiffForManagedDisks(offset, count, prevSnapshotUrl2, options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("PageBlobClient-GetPageRangesDiffForManagedDisks", options, async (updatedOptions) => {
      var _a3;
      const response = assertResponse(await this.pageBlobContext.getPageRangesDiff({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        prevSnapshotUrl: prevSnapshotUrl2,
        range: rangeToString({ offset, count }),
        tracingOptions: updatedOptions.tracingOptions
      }));
      return rangeResponseFromModel(response);
    });
  }
  /**
   * Resizes the page blob to the specified size (which must be a multiple of 512).
   * @see https://docs.microsoft.com/rest/api/storageservices/set-blob-properties
   *
   * @param size - Target size
   * @param options - Options to the Page Blob Resize operation.
   * @returns Response data for the Page Blob Resize operation.
   */
  async resize(size, options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("PageBlobClient-resize", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.pageBlobContext.resize(size, {
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        encryptionScope: options.encryptionScope,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Sets a page blob's sequence number.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-blob-properties
   *
   * @param sequenceNumberAction - Indicates how the service should modify the blob's sequence number.
   * @param sequenceNumber - Required if sequenceNumberAction is max or update
   * @param options - Options to the Page Blob Update Sequence Number operation.
   * @returns Response data for the Page Blob Update Sequence Number operation.
   */
  async updateSequenceNumber(sequenceNumberAction2, sequenceNumber, options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("PageBlobClient-updateSequenceNumber", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.pageBlobContext.updateSequenceNumber(sequenceNumberAction2, {
        abortSignal: options.abortSignal,
        blobSequenceNumber: sequenceNumber,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Begins an operation to start an incremental copy from one page blob's snapshot to this page blob.
   * The snapshot is copied such that only the differential changes between the previously
   * copied snapshot are transferred to the destination.
   * The copied snapshots are complete copies of the original snapshot and can be read or copied from as usual.
   * @see https://docs.microsoft.com/rest/api/storageservices/incremental-copy-blob
   * @see https://docs.microsoft.com/en-us/azure/virtual-machines/windows/incremental-snapshots
   *
   * @param copySource - Specifies the name of the source page blob snapshot. For example,
   *                            https://myaccount.blob.core.windows.net/mycontainer/myblob?snapshot=<DateTime>
   * @param options - Options to the Page Blob Copy Incremental operation.
   * @returns Response data for the Page Blob Copy Incremental operation.
   */
  async startCopyIncremental(copySource2, options = {}) {
    return tracingClient.withSpan("PageBlobClient-startCopyIncremental", options, async (updatedOptions) => {
      var _a3;
      return assertResponse(await this.pageBlobContext.copyIncremental(copySource2, {
        abortSignal: options.abortSignal,
        modifiedAccessConditions: Object.assign(Object.assign({}, options.conditions), { ifTags: (_a3 = options.conditions) === null || _a3 === void 0 ? void 0 : _a3.tagConditions }),
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BatchUtils.browser.js
async function getBodyAsText(batchResponse) {
  const blob = await batchResponse.blobBody;
  return blobToString(blob);
}
function utf8ByteLength(str) {
  return new Blob([str]).size;
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BatchResponseParser.js
var HTTP_HEADER_DELIMITER = ": ";
var SPACE_DELIMITER = " ";
var NOT_FOUND = -1;
var BatchResponseParser = class {
  constructor(batchResponse, subRequests) {
    if (!batchResponse || !batchResponse.contentType) {
      throw new RangeError("batchResponse is malformed or doesn't contain valid content-type.");
    }
    if (!subRequests || subRequests.size === 0) {
      throw new RangeError("Invalid state: subRequests is not provided or size is 0.");
    }
    this.batchResponse = batchResponse;
    this.subRequests = subRequests;
    this.responseBatchBoundary = this.batchResponse.contentType.split("=")[1];
    this.perResponsePrefix = `--${this.responseBatchBoundary}${HTTP_LINE_ENDING}`;
    this.batchResponseEnding = `--${this.responseBatchBoundary}--`;
  }
  // For example of response, please refer to https://docs.microsoft.com/en-us/rest/api/storageservices/blob-batch#response
  async parseBatchResponse() {
    if (this.batchResponse._response.status !== HTTPURLConnection.HTTP_ACCEPTED) {
      throw new Error(`Invalid state: batch request failed with status: '${this.batchResponse._response.status}'.`);
    }
    const responseBodyAsText = await getBodyAsText(this.batchResponse);
    const subResponses = responseBodyAsText.split(this.batchResponseEnding)[0].split(this.perResponsePrefix).slice(1);
    const subResponseCount = subResponses.length;
    if (subResponseCount !== this.subRequests.size && subResponseCount !== 1) {
      throw new Error("Invalid state: sub responses' count is not equal to sub requests' count.");
    }
    const deserializedSubResponses = new Array(subResponseCount);
    let subResponsesSucceededCount = 0;
    let subResponsesFailedCount = 0;
    for (let index = 0; index < subResponseCount; index++) {
      const subResponse = subResponses[index];
      const deserializedSubResponse = {};
      deserializedSubResponse.headers = toHttpHeadersLike(createHttpHeaders());
      const responseLines = subResponse.split(`${HTTP_LINE_ENDING}`);
      let subRespHeaderStartFound = false;
      let subRespHeaderEndFound = false;
      let subRespFailed = false;
      let contentId = NOT_FOUND;
      for (const responseLine of responseLines) {
        if (!subRespHeaderStartFound) {
          if (responseLine.startsWith(HeaderConstants.CONTENT_ID)) {
            contentId = parseInt(responseLine.split(HTTP_HEADER_DELIMITER)[1]);
          }
          if (responseLine.startsWith(HTTP_VERSION_1_1)) {
            subRespHeaderStartFound = true;
            const tokens = responseLine.split(SPACE_DELIMITER);
            deserializedSubResponse.status = parseInt(tokens[1]);
            deserializedSubResponse.statusMessage = tokens.slice(2).join(SPACE_DELIMITER);
          }
          continue;
        }
        if (responseLine.trim() === "") {
          if (!subRespHeaderEndFound) {
            subRespHeaderEndFound = true;
          }
          continue;
        }
        if (!subRespHeaderEndFound) {
          if (responseLine.indexOf(HTTP_HEADER_DELIMITER) === -1) {
            throw new Error(`Invalid state: find non-empty line '${responseLine}' without HTTP header delimiter '${HTTP_HEADER_DELIMITER}'.`);
          }
          const tokens = responseLine.split(HTTP_HEADER_DELIMITER);
          deserializedSubResponse.headers.set(tokens[0], tokens[1]);
          if (tokens[0] === HeaderConstants.X_MS_ERROR_CODE) {
            deserializedSubResponse.errorCode = tokens[1];
            subRespFailed = true;
          }
        } else {
          if (!deserializedSubResponse.bodyAsText) {
            deserializedSubResponse.bodyAsText = "";
          }
          deserializedSubResponse.bodyAsText += responseLine;
        }
      }
      if (contentId !== NOT_FOUND && Number.isInteger(contentId) && contentId >= 0 && contentId < this.subRequests.size && deserializedSubResponses[contentId] === void 0) {
        deserializedSubResponse._request = this.subRequests.get(contentId);
        deserializedSubResponses[contentId] = deserializedSubResponse;
      } else {
        logger3.error(`subResponses[${index}] is dropped as the Content-ID is not found or invalid, Content-ID: ${contentId}`);
      }
      if (subRespFailed) {
        subResponsesFailedCount++;
      } else {
        subResponsesSucceededCount++;
      }
    }
    return {
      subResponses: deserializedSubResponses,
      subResponsesSucceededCount,
      subResponsesFailedCount
    };
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/utils/Mutex.js
var MutexLockStatus;
(function(MutexLockStatus2) {
  MutexLockStatus2[MutexLockStatus2["LOCKED"] = 0] = "LOCKED";
  MutexLockStatus2[MutexLockStatus2["UNLOCKED"] = 1] = "UNLOCKED";
})(MutexLockStatus || (MutexLockStatus = {}));
var Mutex = class {
  /**
   * Lock for a specific key. If the lock has been acquired by another customer, then
   * will wait until getting the lock.
   *
   * @param key - lock key
   */
  static async lock(key) {
    return new Promise((resolve) => {
      if (this.keys[key] === void 0 || this.keys[key] === MutexLockStatus.UNLOCKED) {
        this.keys[key] = MutexLockStatus.LOCKED;
        resolve();
      } else {
        this.onUnlockEvent(key, () => {
          this.keys[key] = MutexLockStatus.LOCKED;
          resolve();
        });
      }
    });
  }
  /**
   * Unlock a key.
   *
   * @param key -
   */
  static async unlock(key) {
    return new Promise((resolve) => {
      if (this.keys[key] === MutexLockStatus.LOCKED) {
        this.emitUnlockEvent(key);
      }
      delete this.keys[key];
      resolve();
    });
  }
  static onUnlockEvent(key, handler) {
    if (this.listeners[key] === void 0) {
      this.listeners[key] = [handler];
    } else {
      this.listeners[key].push(handler);
    }
  }
  static emitUnlockEvent(key) {
    if (this.listeners[key] !== void 0 && this.listeners[key].length > 0) {
      const handler = this.listeners[key].shift();
      setImmediate(() => {
        handler.call(this);
      });
    }
  }
};
Mutex.keys = {};
Mutex.listeners = {};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BlobBatch.js
var BlobBatch = class {
  constructor() {
    this.batch = "batch";
    this.batchRequest = new InnerBatchRequest();
  }
  /**
   * Get the value of Content-Type for a batch request.
   * The value must be multipart/mixed with a batch boundary.
   * Example: multipart/mixed; boundary=batch_a81786c8-e301-4e42-a729-a32ca24ae252
   */
  getMultiPartContentType() {
    return this.batchRequest.getMultipartContentType();
  }
  /**
   * Get assembled HTTP request body for sub requests.
   */
  getHttpRequestBody() {
    return this.batchRequest.getHttpRequestBody();
  }
  /**
   * Get sub requests that are added into the batch request.
   */
  getSubRequests() {
    return this.batchRequest.getSubRequests();
  }
  async addSubRequestInternal(subRequest, assembleSubRequestFunc) {
    await Mutex.lock(this.batch);
    try {
      this.batchRequest.preAddSubRequest(subRequest);
      await assembleSubRequestFunc();
      this.batchRequest.postAddSubRequest(subRequest);
    } finally {
      await Mutex.unlock(this.batch);
    }
  }
  setBatchType(batchType) {
    if (!this.batchType) {
      this.batchType = batchType;
    }
    if (this.batchType !== batchType) {
      throw new RangeError(`BlobBatch only supports one operation type per batch and it already is being used for ${this.batchType} operations.`);
    }
  }
  async deleteBlob(urlOrBlobClient, credentialOrOptions, options) {
    let url2;
    let credential;
    if (typeof urlOrBlobClient === "string" && (isNode && credentialOrOptions instanceof StorageSharedKeyCredential || credentialOrOptions instanceof AnonymousCredential || isTokenCredential(credentialOrOptions))) {
      url2 = urlOrBlobClient;
      credential = credentialOrOptions;
    } else if (urlOrBlobClient instanceof BlobClient) {
      url2 = urlOrBlobClient.url;
      credential = urlOrBlobClient.credential;
      options = credentialOrOptions;
    } else {
      throw new RangeError("Invalid arguments. Either url and credential, or BlobClient need be provided.");
    }
    if (!options) {
      options = {};
    }
    return tracingClient.withSpan("BatchDeleteRequest-addSubRequest", options, async (updatedOptions) => {
      this.setBatchType("delete");
      await this.addSubRequestInternal({
        url: url2,
        credential
      }, async () => {
        await new BlobClient(url2, this.batchRequest.createPipeline(credential)).delete(updatedOptions);
      });
    });
  }
  async setBlobAccessTier(urlOrBlobClient, credentialOrTier, tierOrOptions, options) {
    let url2;
    let credential;
    let tier2;
    if (typeof urlOrBlobClient === "string" && (isNode && credentialOrTier instanceof StorageSharedKeyCredential || credentialOrTier instanceof AnonymousCredential || isTokenCredential(credentialOrTier))) {
      url2 = urlOrBlobClient;
      credential = credentialOrTier;
      tier2 = tierOrOptions;
    } else if (urlOrBlobClient instanceof BlobClient) {
      url2 = urlOrBlobClient.url;
      credential = urlOrBlobClient.credential;
      tier2 = credentialOrTier;
      options = tierOrOptions;
    } else {
      throw new RangeError("Invalid arguments. Either url and credential, or BlobClient need be provided.");
    }
    if (!options) {
      options = {};
    }
    return tracingClient.withSpan("BatchSetTierRequest-addSubRequest", options, async (updatedOptions) => {
      this.setBatchType("setAccessTier");
      await this.addSubRequestInternal({
        url: url2,
        credential
      }, async () => {
        await new BlobClient(url2, this.batchRequest.createPipeline(credential)).setAccessTier(tier2, updatedOptions);
      });
    });
  }
};
var InnerBatchRequest = class {
  constructor() {
    this.operationCount = 0;
    this.body = "";
    const tempGuid = randomUUID();
    this.boundary = `batch_${tempGuid}`;
    this.subRequestPrefix = `--${this.boundary}${HTTP_LINE_ENDING}${HeaderConstants.CONTENT_TYPE}: application/http${HTTP_LINE_ENDING}${HeaderConstants.CONTENT_TRANSFER_ENCODING}: binary`;
    this.multipartContentType = `multipart/mixed; boundary=${this.boundary}`;
    this.batchRequestEnding = `--${this.boundary}--`;
    this.subRequests = /* @__PURE__ */ new Map();
  }
  /**
   * Create pipeline to assemble sub requests. The idea here is to use existing
   * credential and serialization/deserialization components, with additional policies to
   * filter unnecessary headers, assemble sub requests into request's body
   * and intercept request from going to wire.
   * @param credential -  Such as AnonymousCredential, StorageSharedKeyCredential or any credential from the `@azure/identity` package to authenticate requests to the service. You can also provide an object that implements the TokenCredential interface. If not specified, AnonymousCredential is used.
   */
  createPipeline(credential) {
    const corePipeline = createEmptyPipeline();
    corePipeline.addPolicy(serializationPolicy({
      stringifyXML,
      serializerOptions: {
        xml: {
          xmlCharKey: "#"
        }
      }
    }), { phase: "Serialize" });
    corePipeline.addPolicy(batchHeaderFilterPolicy());
    corePipeline.addPolicy(batchRequestAssemblePolicy(this), { afterPhase: "Sign" });
    if (isTokenCredential(credential)) {
      corePipeline.addPolicy(bearerTokenAuthenticationPolicy({
        credential,
        scopes: StorageOAuthScopes,
        challengeCallbacks: { authorizeRequestOnChallenge: authorizeRequestOnTenantChallenge }
      }), { phase: "Sign" });
    } else if (credential instanceof StorageSharedKeyCredential) {
      corePipeline.addPolicy(storageSharedKeyCredentialPolicy({
        accountName: credential.accountName,
        accountKey: credential.accountKey
      }), { phase: "Sign" });
    }
    const pipeline = new Pipeline([]);
    pipeline._credential = credential;
    pipeline._corePipeline = corePipeline;
    return pipeline;
  }
  appendSubRequestToBody(request) {
    this.body += [
      this.subRequestPrefix,
      // sub request constant prefix
      `${HeaderConstants.CONTENT_ID}: ${this.operationCount}`,
      // sub request's content ID
      "",
      // empty line after sub request's content ID
      `${request.method.toString()} ${getURLPathAndQuery(request.url)} ${HTTP_VERSION_1_1}${HTTP_LINE_ENDING}`
      // sub request start line with method
    ].join(HTTP_LINE_ENDING);
    for (const [name, value] of request.headers) {
      this.body += `${name}: ${value}${HTTP_LINE_ENDING}`;
    }
    this.body += HTTP_LINE_ENDING;
  }
  preAddSubRequest(subRequest) {
    if (this.operationCount >= BATCH_MAX_REQUEST) {
      throw new RangeError(`Cannot exceed ${BATCH_MAX_REQUEST} sub requests in a single batch`);
    }
    const path = getURLPath(subRequest.url);
    if (!path || path === "") {
      throw new RangeError(`Invalid url for sub request: '${subRequest.url}'`);
    }
  }
  postAddSubRequest(subRequest) {
    this.subRequests.set(this.operationCount, subRequest);
    this.operationCount++;
  }
  // Return the http request body with assembling the ending line to the sub request body.
  getHttpRequestBody() {
    return `${this.body}${this.batchRequestEnding}${HTTP_LINE_ENDING}`;
  }
  getMultipartContentType() {
    return this.multipartContentType;
  }
  getSubRequests() {
    return this.subRequests;
  }
};
function batchRequestAssemblePolicy(batchRequest) {
  return {
    name: "batchRequestAssemblePolicy",
    async sendRequest(request) {
      batchRequest.appendSubRequestToBody(request);
      return {
        request,
        status: 200,
        headers: createHttpHeaders()
      };
    }
  };
}
function batchHeaderFilterPolicy() {
  return {
    name: "batchHeaderFilterPolicy",
    async sendRequest(request, next) {
      let xMsHeaderName = "";
      for (const [name] of request.headers) {
        if (iEqual(name, HeaderConstants.X_MS_VERSION)) {
          xMsHeaderName = name;
        }
      }
      if (xMsHeaderName !== "") {
        request.headers.delete(xMsHeaderName);
      }
      return next(request);
    }
  };
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BlobBatchClient.js
var BlobBatchClient = class {
  constructor(url2, credentialOrPipeline, options) {
    let pipeline;
    if (isPipelineLike(credentialOrPipeline)) {
      pipeline = credentialOrPipeline;
    } else if (!credentialOrPipeline) {
      pipeline = newPipeline(new AnonymousCredential(), options);
    } else {
      pipeline = newPipeline(credentialOrPipeline, options);
    }
    const storageClientContext = new StorageContextClient(url2, getCoreClientOptions(pipeline));
    const path = getURLPath(url2);
    if (path && path !== "/") {
      this.serviceOrContainerContext = storageClientContext.container;
    } else {
      this.serviceOrContainerContext = storageClientContext.service;
    }
  }
  /**
   * Creates a {@link BlobBatch}.
   * A BlobBatch represents an aggregated set of operations on blobs.
   */
  createBatch() {
    return new BlobBatch();
  }
  async deleteBlobs(urlsOrBlobClients, credentialOrOptions, options) {
    const batch = new BlobBatch();
    for (const urlOrBlobClient of urlsOrBlobClients) {
      if (typeof urlOrBlobClient === "string") {
        await batch.deleteBlob(urlOrBlobClient, credentialOrOptions, options);
      } else {
        await batch.deleteBlob(urlOrBlobClient, credentialOrOptions);
      }
    }
    return this.submitBatch(batch);
  }
  async setBlobsAccessTier(urlsOrBlobClients, credentialOrTier, tierOrOptions, options) {
    const batch = new BlobBatch();
    for (const urlOrBlobClient of urlsOrBlobClients) {
      if (typeof urlOrBlobClient === "string") {
        await batch.setBlobAccessTier(urlOrBlobClient, credentialOrTier, tierOrOptions, options);
      } else {
        await batch.setBlobAccessTier(urlOrBlobClient, credentialOrTier, tierOrOptions);
      }
    }
    return this.submitBatch(batch);
  }
  /**
   * Submit batch request which consists of multiple subrequests.
   *
   * Get `blobBatchClient` and other details before running the snippets.
   * `blobServiceClient.getBlobBatchClient()` gives the `blobBatchClient`
   *
   * Example usage:
   *
   * ```js
   * let batchRequest = new BlobBatch();
   * await batchRequest.deleteBlob(urlInString0, credential0);
   * await batchRequest.deleteBlob(urlInString1, credential1, {
   *  deleteSnapshots: "include"
   * });
   * const batchResp = await blobBatchClient.submitBatch(batchRequest);
   * console.log(batchResp.subResponsesSucceededCount);
   * ```
   *
   * Example using a lease:
   *
   * ```js
   * let batchRequest = new BlobBatch();
   * await batchRequest.setBlobAccessTier(blockBlobClient0, "Cool");
   * await batchRequest.setBlobAccessTier(blockBlobClient1, "Cool", {
   *  conditions: { leaseId: leaseId }
   * });
   * const batchResp = await blobBatchClient.submitBatch(batchRequest);
   * console.log(batchResp.subResponsesSucceededCount);
   * ```
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/blob-batch
   *
   * @param batchRequest - A set of Delete or SetTier operations.
   * @param options -
   */
  async submitBatch(batchRequest, options = {}) {
    if (!batchRequest || batchRequest.getSubRequests().size === 0) {
      throw new RangeError("Batch request should contain one or more sub requests.");
    }
    return tracingClient.withSpan("BlobBatchClient-submitBatch", options, async (updatedOptions) => {
      const batchRequestBody = batchRequest.getHttpRequestBody();
      const rawBatchResponse = assertResponse(await this.serviceOrContainerContext.submitBatch(utf8ByteLength(batchRequestBody), batchRequest.getMultiPartContentType(), batchRequestBody, Object.assign({}, updatedOptions)));
      const batchResponseParser = new BatchResponseParser(rawBatchResponse, batchRequest.getSubRequests());
      const responseSummary = await batchResponseParser.parseBatchResponse();
      const res = {
        _response: rawBatchResponse._response,
        contentType: rawBatchResponse.contentType,
        errorCode: rawBatchResponse.errorCode,
        requestId: rawBatchResponse.requestId,
        clientRequestId: rawBatchResponse.clientRequestId,
        version: rawBatchResponse.version,
        subResponses: responseSummary.subResponses,
        subResponsesSucceededCount: responseSummary.subResponsesSucceededCount,
        subResponsesFailedCount: responseSummary.subResponsesFailedCount
      };
      return res;
    });
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/ContainerClient.js
var ContainerClient = class extends StorageClient2 {
  /**
   * The name of the container.
   */
  get containerName() {
    return this._containerName;
  }
  constructor(urlOrConnectionString, credentialOrPipelineOrContainerName, options) {
    let pipeline;
    let url2;
    options = options || {};
    if (isPipelineLike(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      pipeline = credentialOrPipelineOrContainerName;
    } else if (isNode && credentialOrPipelineOrContainerName instanceof StorageSharedKeyCredential || credentialOrPipelineOrContainerName instanceof AnonymousCredential || isTokenCredential(credentialOrPipelineOrContainerName)) {
      url2 = urlOrConnectionString;
      pipeline = newPipeline(credentialOrPipelineOrContainerName, options);
    } else if (!credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName !== "string") {
      url2 = urlOrConnectionString;
      pipeline = newPipeline(new AnonymousCredential(), options);
    } else if (credentialOrPipelineOrContainerName && typeof credentialOrPipelineOrContainerName === "string") {
      const containerName = credentialOrPipelineOrContainerName;
      const extractedCreds = extractConnectionStringParts(urlOrConnectionString);
      if (extractedCreds.kind === "AccountConnString") {
        if (isNode) {
          const sharedKeyCredential = new StorageSharedKeyCredential(extractedCreds.accountName, extractedCreds.accountKey);
          url2 = appendToURLPath(extractedCreds.url, encodeURIComponent(containerName));
          if (!options.proxyOptions) {
            options.proxyOptions = getDefaultProxySettings(extractedCreds.proxyUri);
          }
          pipeline = newPipeline(sharedKeyCredential, options);
        } else {
          throw new Error("Account connection string is only supported in Node.js environment");
        }
      } else if (extractedCreds.kind === "SASConnString") {
        url2 = appendToURLPath(extractedCreds.url, encodeURIComponent(containerName)) + "?" + extractedCreds.accountSas;
        pipeline = newPipeline(new AnonymousCredential(), options);
      } else {
        throw new Error("Connection string must be either an Account connection string or a SAS connection string");
      }
    } else {
      throw new Error("Expecting non-empty strings for containerName parameter");
    }
    super(url2, pipeline);
    this._containerName = this.getContainerNameFromUrl();
    this.containerContext = this.storageClientContext.container;
  }
  /**
   * Creates a new container under the specified account. If the container with
   * the same name already exists, the operation fails.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/create-container
   * Naming rules: @see https://learn.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata
   *
   * @param options - Options to Container Create operation.
   *
   *
   * Example usage:
   *
   * ```js
   * const containerClient = blobServiceClient.getContainerClient("<container name>");
   * const createContainerResponse = await containerClient.create();
   * console.log("Container was created successfully", createContainerResponse.requestId);
   * ```
   */
  async create(options = {}) {
    return tracingClient.withSpan("ContainerClient-create", options, async (updatedOptions) => {
      return assertResponse(await this.containerContext.create(updatedOptions));
    });
  }
  /**
   * Creates a new container under the specified account. If the container with
   * the same name already exists, it is not changed.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/create-container
   * Naming rules: @see https://learn.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata
   *
   * @param options -
   */
  async createIfNotExists(options = {}) {
    return tracingClient.withSpan("ContainerClient-createIfNotExists", options, async (updatedOptions) => {
      var _a3, _b2;
      try {
        const res = await this.create(updatedOptions);
        return Object.assign(Object.assign({ succeeded: true }, res), { _response: res._response });
      } catch (e) {
        if (((_a3 = e.details) === null || _a3 === void 0 ? void 0 : _a3.errorCode) === "ContainerAlreadyExists") {
          return Object.assign(Object.assign({ succeeded: false }, (_b2 = e.response) === null || _b2 === void 0 ? void 0 : _b2.parsedHeaders), { _response: e.response });
        } else {
          throw e;
        }
      }
    });
  }
  /**
   * Returns true if the Azure container resource represented by this client exists; false otherwise.
   *
   * NOTE: use this function with care since an existing container might be deleted by other clients or
   * applications. Vice versa new containers with the same name might be added by other clients or
   * applications after this function completes.
   *
   * @param options -
   */
  async exists(options = {}) {
    return tracingClient.withSpan("ContainerClient-exists", options, async (updatedOptions) => {
      try {
        await this.getProperties({
          abortSignal: options.abortSignal,
          tracingOptions: updatedOptions.tracingOptions
        });
        return true;
      } catch (e) {
        if (e.statusCode === 404) {
          return false;
        }
        throw e;
      }
    });
  }
  /**
   * Creates a {@link BlobClient}
   *
   * @param blobName - A blob name
   * @returns A new BlobClient object for the given blob name.
   */
  getBlobClient(blobName) {
    return new BlobClient(appendToURLPath(this.url, EscapePath(blobName)), this.pipeline);
  }
  /**
   * Creates an {@link AppendBlobClient}
   *
   * @param blobName - An append blob name
   */
  getAppendBlobClient(blobName) {
    return new AppendBlobClient(appendToURLPath(this.url, EscapePath(blobName)), this.pipeline);
  }
  /**
   * Creates a {@link BlockBlobClient}
   *
   * @param blobName - A block blob name
   *
   *
   * Example usage:
   *
   * ```js
   * const content = "Hello world!";
   *
   * const blockBlobClient = containerClient.getBlockBlobClient("<blob name>");
   * const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
   * ```
   */
  getBlockBlobClient(blobName) {
    return new BlockBlobClient(appendToURLPath(this.url, EscapePath(blobName)), this.pipeline);
  }
  /**
   * Creates a {@link PageBlobClient}
   *
   * @param blobName - A page blob name
   */
  getPageBlobClient(blobName) {
    return new PageBlobClient(appendToURLPath(this.url, EscapePath(blobName)), this.pipeline);
  }
  /**
   * Returns all user-defined metadata and system properties for the specified
   * container. The data returned does not include the container's list of blobs.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-container-properties
   *
   * WARNING: The `metadata` object returned in the response will have its keys in lowercase, even if
   * they originally contained uppercase characters. This differs from the metadata keys returned by
   * the `listContainers` method of {@link BlobServiceClient} using the `includeMetadata` option, which
   * will retain their original casing.
   *
   * @param options - Options to Container Get Properties operation.
   */
  async getProperties(options = {}) {
    if (!options.conditions) {
      options.conditions = {};
    }
    return tracingClient.withSpan("ContainerClient-getProperties", options, async (updatedOptions) => {
      return assertResponse(await this.containerContext.getProperties(Object.assign(Object.assign({ abortSignal: options.abortSignal }, options.conditions), { tracingOptions: updatedOptions.tracingOptions })));
    });
  }
  /**
   * Marks the specified container for deletion. The container and any blobs
   * contained within it are later deleted during garbage collection.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/delete-container
   *
   * @param options - Options to Container Delete operation.
   */
  async delete(options = {}) {
    if (!options.conditions) {
      options.conditions = {};
    }
    return tracingClient.withSpan("ContainerClient-delete", options, async (updatedOptions) => {
      return assertResponse(await this.containerContext.delete({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: options.conditions,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Marks the specified container for deletion if it exists. The container and any blobs
   * contained within it are later deleted during garbage collection.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/delete-container
   *
   * @param options - Options to Container Delete operation.
   */
  async deleteIfExists(options = {}) {
    return tracingClient.withSpan("ContainerClient-deleteIfExists", options, async (updatedOptions) => {
      var _a3, _b2;
      try {
        const res = await this.delete(updatedOptions);
        return Object.assign(Object.assign({ succeeded: true }, res), { _response: res._response });
      } catch (e) {
        if (((_a3 = e.details) === null || _a3 === void 0 ? void 0 : _a3.errorCode) === "ContainerNotFound") {
          return Object.assign(Object.assign({ succeeded: false }, (_b2 = e.response) === null || _b2 === void 0 ? void 0 : _b2.parsedHeaders), { _response: e.response });
        }
        throw e;
      }
    });
  }
  /**
   * Sets one or more user-defined name-value pairs for the specified container.
   *
   * If no option provided, or no metadata defined in the parameter, the container
   * metadata will be removed.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-container-metadata
   *
   * @param metadata - Replace existing metadata with this value.
   *                            If no value provided the existing metadata will be removed.
   * @param options - Options to Container Set Metadata operation.
   */
  async setMetadata(metadata2, options = {}) {
    if (!options.conditions) {
      options.conditions = {};
    }
    if (options.conditions.ifUnmodifiedSince) {
      throw new RangeError("the IfUnmodifiedSince must have their default values because they are ignored by the blob service");
    }
    return tracingClient.withSpan("ContainerClient-setMetadata", options, async (updatedOptions) => {
      return assertResponse(await this.containerContext.setMetadata({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        metadata: metadata2,
        modifiedAccessConditions: options.conditions,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Gets the permissions for the specified container. The permissions indicate
   * whether container data may be accessed publicly.
   *
   * WARNING: JavaScript Date will potentially lose precision when parsing startsOn and expiresOn strings.
   * For example, new Date("2018-12-31T03:44:23.8827891Z").toISOString() will get "2018-12-31T03:44:23.882Z".
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-container-acl
   *
   * @param options - Options to Container Get Access Policy operation.
   */
  async getAccessPolicy(options = {}) {
    if (!options.conditions) {
      options.conditions = {};
    }
    return tracingClient.withSpan("ContainerClient-getAccessPolicy", options, async (updatedOptions) => {
      const response = assertResponse(await this.containerContext.getAccessPolicy({
        abortSignal: options.abortSignal,
        leaseAccessConditions: options.conditions,
        tracingOptions: updatedOptions.tracingOptions
      }));
      const res = {
        _response: response._response,
        blobPublicAccess: response.blobPublicAccess,
        date: response.date,
        etag: response.etag,
        errorCode: response.errorCode,
        lastModified: response.lastModified,
        requestId: response.requestId,
        clientRequestId: response.clientRequestId,
        signedIdentifiers: [],
        version: response.version
      };
      for (const identifier of response) {
        let accessPolicy = void 0;
        if (identifier.accessPolicy) {
          accessPolicy = {
            permissions: identifier.accessPolicy.permissions
          };
          if (identifier.accessPolicy.expiresOn) {
            accessPolicy.expiresOn = new Date(identifier.accessPolicy.expiresOn);
          }
          if (identifier.accessPolicy.startsOn) {
            accessPolicy.startsOn = new Date(identifier.accessPolicy.startsOn);
          }
        }
        res.signedIdentifiers.push({
          accessPolicy,
          id: identifier.id
        });
      }
      return res;
    });
  }
  /**
   * Sets the permissions for the specified container. The permissions indicate
   * whether blobs in a container may be accessed publicly.
   *
   * When you set permissions for a container, the existing permissions are replaced.
   * If no access or containerAcl provided, the existing container ACL will be
   * removed.
   *
   * When you establish a stored access policy on a container, it may take up to 30 seconds to take effect.
   * During this interval, a shared access signature that is associated with the stored access policy will
   * fail with status code 403 (Forbidden), until the access policy becomes active.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-container-acl
   *
   * @param access - The level of public access to data in the container.
   * @param containerAcl - Array of elements each having a unique Id and details of the access policy.
   * @param options - Options to Container Set Access Policy operation.
   */
  async setAccessPolicy(access2, containerAcl2, options = {}) {
    options.conditions = options.conditions || {};
    return tracingClient.withSpan("ContainerClient-setAccessPolicy", options, async (updatedOptions) => {
      const acl = [];
      for (const identifier of containerAcl2 || []) {
        acl.push({
          accessPolicy: {
            expiresOn: identifier.accessPolicy.expiresOn ? truncatedISO8061Date(identifier.accessPolicy.expiresOn) : "",
            permissions: identifier.accessPolicy.permissions,
            startsOn: identifier.accessPolicy.startsOn ? truncatedISO8061Date(identifier.accessPolicy.startsOn) : ""
          },
          id: identifier.id
        });
      }
      return assertResponse(await this.containerContext.setAccessPolicy({
        abortSignal: options.abortSignal,
        access: access2,
        containerAcl: acl,
        leaseAccessConditions: options.conditions,
        modifiedAccessConditions: options.conditions,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Get a {@link BlobLeaseClient} that manages leases on the container.
   *
   * @param proposeLeaseId - Initial proposed lease Id.
   * @returns A new BlobLeaseClient object for managing leases on the container.
   */
  getBlobLeaseClient(proposeLeaseId) {
    return new BlobLeaseClient(this, proposeLeaseId);
  }
  /**
   * Creates a new block blob, or updates the content of an existing block blob.
   *
   * Updating an existing block blob overwrites any existing metadata on the blob.
   * Partial updates are not supported; the content of the existing blob is
   * overwritten with the new content. To perform a partial update of a block blob's,
   * use {@link BlockBlobClient.stageBlock} and {@link BlockBlobClient.commitBlockList}.
   *
   * This is a non-parallel uploading method, please use {@link BlockBlobClient.uploadFile},
   * {@link BlockBlobClient.uploadStream} or {@link BlockBlobClient.uploadBrowserData} for better
   * performance with concurrency uploading.
   *
   * @see https://docs.microsoft.com/rest/api/storageservices/put-blob
   *
   * @param blobName - Name of the block blob to create or update.
   * @param body - Blob, string, ArrayBuffer, ArrayBufferView or a function
   *                               which returns a new Readable stream whose offset is from data source beginning.
   * @param contentLength - Length of body in bytes. Use Buffer.byteLength() to calculate body length for a
   *                               string including non non-Base64/Hex-encoded characters.
   * @param options - Options to configure the Block Blob Upload operation.
   * @returns Block Blob upload response data and the corresponding BlockBlobClient instance.
   */
  async uploadBlockBlob(blobName, body2, contentLength2, options = {}) {
    return tracingClient.withSpan("ContainerClient-uploadBlockBlob", options, async (updatedOptions) => {
      const blockBlobClient = this.getBlockBlobClient(blobName);
      const response = await blockBlobClient.upload(body2, contentLength2, updatedOptions);
      return {
        blockBlobClient,
        response
      };
    });
  }
  /**
   * Marks the specified blob or snapshot for deletion. The blob is later deleted
   * during garbage collection. Note that in order to delete a blob, you must delete
   * all of its snapshots. You can delete both at the same time with the Delete
   * Blob operation.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/delete-blob
   *
   * @param blobName -
   * @param options - Options to Blob Delete operation.
   * @returns Block blob deletion response data.
   */
  async deleteBlob(blobName, options = {}) {
    return tracingClient.withSpan("ContainerClient-deleteBlob", options, async (updatedOptions) => {
      let blobClient = this.getBlobClient(blobName);
      if (options.versionId) {
        blobClient = blobClient.withVersion(options.versionId);
      }
      return blobClient.delete(updatedOptions);
    });
  }
  /**
   * listBlobFlatSegment returns a single segment of blobs starting from the
   * specified Marker. Use an empty Marker to start enumeration from the beginning.
   * After getting a segment, process it, and then call listBlobsFlatSegment again
   * (passing the the previously-returned Marker) to get the next segment.
   * @see https://docs.microsoft.com/rest/api/storageservices/list-blobs
   *
   * @param marker - A string value that identifies the portion of the list to be returned with the next list operation.
   * @param options - Options to Container List Blob Flat Segment operation.
   */
  async listBlobFlatSegment(marker2, options = {}) {
    return tracingClient.withSpan("ContainerClient-listBlobFlatSegment", options, async (updatedOptions) => {
      const response = assertResponse(await this.containerContext.listBlobFlatSegment(Object.assign(Object.assign({ marker: marker2 }, options), { tracingOptions: updatedOptions.tracingOptions })));
      const wrappedResponse = Object.assign(Object.assign({}, response), { _response: Object.assign(Object.assign({}, response._response), { parsedBody: ConvertInternalResponseOfListBlobFlat(response._response.parsedBody) }), segment: Object.assign(Object.assign({}, response.segment), { blobItems: response.segment.blobItems.map((blobItemInternal) => {
        const blobItem = Object.assign(Object.assign({}, blobItemInternal), { name: BlobNameToString(blobItemInternal.name), tags: toTags(blobItemInternal.blobTags), objectReplicationSourceProperties: parseObjectReplicationRecord(blobItemInternal.objectReplicationMetadata) });
        return blobItem;
      }) }) });
      return wrappedResponse;
    });
  }
  /**
   * listBlobHierarchySegment returns a single segment of blobs starting from
   * the specified Marker. Use an empty Marker to start enumeration from the
   * beginning. After getting a segment, process it, and then call listBlobsHierarchicalSegment
   * again (passing the the previously-returned Marker) to get the next segment.
   * @see https://docs.microsoft.com/rest/api/storageservices/list-blobs
   *
   * @param delimiter - The character or string used to define the virtual hierarchy
   * @param marker - A string value that identifies the portion of the list to be returned with the next list operation.
   * @param options - Options to Container List Blob Hierarchy Segment operation.
   */
  async listBlobHierarchySegment(delimiter2, marker2, options = {}) {
    return tracingClient.withSpan("ContainerClient-listBlobHierarchySegment", options, async (updatedOptions) => {
      var _a3;
      const response = assertResponse(await this.containerContext.listBlobHierarchySegment(delimiter2, Object.assign(Object.assign({ marker: marker2 }, options), { tracingOptions: updatedOptions.tracingOptions })));
      const wrappedResponse = Object.assign(Object.assign({}, response), { _response: Object.assign(Object.assign({}, response._response), { parsedBody: ConvertInternalResponseOfListBlobHierarchy(response._response.parsedBody) }), segment: Object.assign(Object.assign({}, response.segment), { blobItems: response.segment.blobItems.map((blobItemInternal) => {
        const blobItem = Object.assign(Object.assign({}, blobItemInternal), { name: BlobNameToString(blobItemInternal.name), tags: toTags(blobItemInternal.blobTags), objectReplicationSourceProperties: parseObjectReplicationRecord(blobItemInternal.objectReplicationMetadata) });
        return blobItem;
      }), blobPrefixes: (_a3 = response.segment.blobPrefixes) === null || _a3 === void 0 ? void 0 : _a3.map((blobPrefixInternal) => {
        const blobPrefix = Object.assign(Object.assign({}, blobPrefixInternal), { name: BlobNameToString(blobPrefixInternal.name) });
        return blobPrefix;
      }) }) });
      return wrappedResponse;
    });
  }
  /**
   * Returns an AsyncIterableIterator for ContainerListBlobFlatSegmentResponse
   *
   * @param marker - A string value that identifies the portion of
   *                          the list of blobs to be returned with the next listing operation. The
   *                          operation returns the ContinuationToken value within the response body if the
   *                          listing operation did not return all blobs remaining to be listed
   *                          with the current page. The ContinuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of list
   *                          items. The marker value is opaque to the client.
   * @param options - Options to list blobs operation.
   */
  listSegments(marker_1) {
    return __asyncGenerator(this, arguments, function* listSegments_1(marker2, options = {}) {
      let listBlobsFlatSegmentResponse;
      if (!!marker2 || marker2 === void 0) {
        do {
          listBlobsFlatSegmentResponse = yield __await(this.listBlobFlatSegment(marker2, options));
          marker2 = listBlobsFlatSegmentResponse.continuationToken;
          yield yield __await(yield __await(listBlobsFlatSegmentResponse));
        } while (marker2);
      }
    });
  }
  /**
   * Returns an AsyncIterableIterator of {@link BlobItem} objects
   *
   * @param options - Options to list blobs operation.
   */
  listItems() {
    return __asyncGenerator(this, arguments, function* listItems_1(options = {}) {
      var _a3, e_1, _b2, _c2;
      let marker2;
      try {
        for (var _d2 = true, _e = __asyncValues(this.listSegments(marker2, options)), _f; _f = yield __await(_e.next()), _a3 = _f.done, !_a3; _d2 = true) {
          _c2 = _f.value;
          _d2 = false;
          const listBlobsFlatSegmentResponse = _c2;
          yield __await(yield* __asyncDelegator(__asyncValues(listBlobsFlatSegmentResponse.segment.blobItems)));
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_d2 && !_a3 && (_b2 = _e.return)) yield __await(_b2.call(_e));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
  /**
   * Returns an async iterable iterator to list all the blobs
   * under the specified account.
   *
   * .byPage() returns an async iterable iterator to list the blobs in pages.
   *
   * Example using `for await` syntax:
   *
   * ```js
   * // Get the containerClient before you run these snippets,
   * // Can be obtained from `blobServiceClient.getContainerClient("<your-container-name>");`
   * let i = 1;
   * for await (const blob of containerClient.listBlobsFlat()) {
   *   console.log(`Blob ${i++}: ${blob.name}`);
   * }
   * ```
   *
   * Example using `iter.next()`:
   *
   * ```js
   * let i = 1;
   * let iter = containerClient.listBlobsFlat();
   * let blobItem = await iter.next();
   * while (!blobItem.done) {
   *   console.log(`Blob ${i++}: ${blobItem.value.name}`);
   *   blobItem = await iter.next();
   * }
   * ```
   *
   * Example using `byPage()`:
   *
   * ```js
   * // passing optional maxPageSize in the page settings
   * let i = 1;
   * for await (const response of containerClient.listBlobsFlat().byPage({ maxPageSize: 20 })) {
   *   for (const blob of response.segment.blobItems) {
   *     console.log(`Blob ${i++}: ${blob.name}`);
   *   }
   * }
   * ```
   *
   * Example using paging with a marker:
   *
   * ```js
   * let i = 1;
   * let iterator = containerClient.listBlobsFlat().byPage({ maxPageSize: 2 });
   * let response = (await iterator.next()).value;
   *
   * // Prints 2 blob names
   * for (const blob of response.segment.blobItems) {
   *   console.log(`Blob ${i++}: ${blob.name}`);
   * }
   *
   * // Gets next marker
   * let marker = response.continuationToken;
   *
   * // Passing next marker as continuationToken
   *
   * iterator = containerClient.listBlobsFlat().byPage({ continuationToken: marker, maxPageSize: 10 });
   * response = (await iterator.next()).value;
   *
   * // Prints 10 blob names
   * for (const blob of response.segment.blobItems) {
   *   console.log(`Blob ${i++}: ${blob.name}`);
   * }
   * ```
   *
   * @param options - Options to list blobs.
   * @returns An asyncIterableIterator that supports paging.
   */
  listBlobsFlat(options = {}) {
    const include2 = [];
    if (options.includeCopy) {
      include2.push("copy");
    }
    if (options.includeDeleted) {
      include2.push("deleted");
    }
    if (options.includeMetadata) {
      include2.push("metadata");
    }
    if (options.includeSnapshots) {
      include2.push("snapshots");
    }
    if (options.includeVersions) {
      include2.push("versions");
    }
    if (options.includeUncommitedBlobs) {
      include2.push("uncommittedblobs");
    }
    if (options.includeTags) {
      include2.push("tags");
    }
    if (options.includeDeletedWithVersions) {
      include2.push("deletedwithversions");
    }
    if (options.includeImmutabilityPolicy) {
      include2.push("immutabilitypolicy");
    }
    if (options.includeLegalHold) {
      include2.push("legalhold");
    }
    if (options.prefix === "") {
      options.prefix = void 0;
    }
    const updatedOptions = Object.assign(Object.assign({}, options), include2.length > 0 ? { include: include2 } : {});
    const iter = this.listItems(updatedOptions);
    return {
      /**
       * The next method, part of the iteration protocol
       */
      next() {
        return iter.next();
      },
      /**
       * The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings = {}) => {
        return this.listSegments(settings.continuationToken, Object.assign({ maxPageSize: settings.maxPageSize }, updatedOptions));
      }
    };
  }
  /**
   * Returns an AsyncIterableIterator for ContainerListBlobHierarchySegmentResponse
   *
   * @param delimiter - The character or string used to define the virtual hierarchy
   * @param marker - A string value that identifies the portion of
   *                          the list of blobs to be returned with the next listing operation. The
   *                          operation returns the ContinuationToken value within the response body if the
   *                          listing operation did not return all blobs remaining to be listed
   *                          with the current page. The ContinuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of list
   *                          items. The marker value is opaque to the client.
   * @param options - Options to list blobs operation.
   */
  listHierarchySegments(delimiter_1, marker_1) {
    return __asyncGenerator(this, arguments, function* listHierarchySegments_1(delimiter2, marker2, options = {}) {
      let listBlobsHierarchySegmentResponse;
      if (!!marker2 || marker2 === void 0) {
        do {
          listBlobsHierarchySegmentResponse = yield __await(this.listBlobHierarchySegment(delimiter2, marker2, options));
          marker2 = listBlobsHierarchySegmentResponse.continuationToken;
          yield yield __await(yield __await(listBlobsHierarchySegmentResponse));
        } while (marker2);
      }
    });
  }
  /**
   * Returns an AsyncIterableIterator for {@link BlobPrefix} and {@link BlobItem} objects.
   *
   * @param delimiter - The character or string used to define the virtual hierarchy
   * @param options - Options to list blobs operation.
   */
  listItemsByHierarchy(delimiter_1) {
    return __asyncGenerator(this, arguments, function* listItemsByHierarchy_1(delimiter2, options = {}) {
      var _a3, e_2, _b2, _c2;
      let marker2;
      try {
        for (var _d2 = true, _e = __asyncValues(this.listHierarchySegments(delimiter2, marker2, options)), _f; _f = yield __await(_e.next()), _a3 = _f.done, !_a3; _d2 = true) {
          _c2 = _f.value;
          _d2 = false;
          const listBlobsHierarchySegmentResponse = _c2;
          const segment = listBlobsHierarchySegmentResponse.segment;
          if (segment.blobPrefixes) {
            for (const prefix2 of segment.blobPrefixes) {
              yield yield __await(Object.assign({ kind: "prefix" }, prefix2));
            }
          }
          for (const blob of segment.blobItems) {
            yield yield __await(Object.assign({ kind: "blob" }, blob));
          }
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (!_d2 && !_a3 && (_b2 = _e.return)) yield __await(_b2.call(_e));
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    });
  }
  /**
   * Returns an async iterable iterator to list all the blobs by hierarchy.
   * under the specified account.
   *
   * .byPage() returns an async iterable iterator to list the blobs by hierarchy in pages.
   *
   * Example using `for await` syntax:
   *
   * ```js
   * for await (const item of containerClient.listBlobsByHierarchy("/")) {
   *   if (item.kind === "prefix") {
   *     console.log(`\tBlobPrefix: ${item.name}`);
   *   } else {
   *     console.log(`\tBlobItem: name - ${item.name}`);
   *   }
   * }
   * ```
   *
   * Example using `iter.next()`:
   *
   * ```js
   * let iter = containerClient.listBlobsByHierarchy("/", { prefix: "prefix1/" });
   * let entity = await iter.next();
   * while (!entity.done) {
   *   let item = entity.value;
   *   if (item.kind === "prefix") {
   *     console.log(`\tBlobPrefix: ${item.name}`);
   *   } else {
   *     console.log(`\tBlobItem: name - ${item.name}`);
   *   }
   *   entity = await iter.next();
   * }
   * ```
   *
   * Example using `byPage()`:
   *
   * ```js
   * console.log("Listing blobs by hierarchy by page");
   * for await (const response of containerClient.listBlobsByHierarchy("/").byPage()) {
   *   const segment = response.segment;
   *   if (segment.blobPrefixes) {
   *     for (const prefix of segment.blobPrefixes) {
   *       console.log(`\tBlobPrefix: ${prefix.name}`);
   *     }
   *   }
   *   for (const blob of response.segment.blobItems) {
   *     console.log(`\tBlobItem: name - ${blob.name}`);
   *   }
   * }
   * ```
   *
   * Example using paging with a max page size:
   *
   * ```js
   * console.log("Listing blobs by hierarchy by page, specifying a prefix and a max page size");
   *
   * let i = 1;
   * for await (const response of containerClient
   *   .listBlobsByHierarchy("/", { prefix: "prefix2/sub1/" })
   *   .byPage({ maxPageSize: 2 })) {
   *   console.log(`Page ${i++}`);
   *   const segment = response.segment;
   *
   *   if (segment.blobPrefixes) {
   *     for (const prefix of segment.blobPrefixes) {
   *       console.log(`\tBlobPrefix: ${prefix.name}`);
   *     }
   *   }
   *
   *   for (const blob of response.segment.blobItems) {
   *     console.log(`\tBlobItem: name - ${blob.name}`);
   *   }
   * }
   * ```
   *
   * @param delimiter - The character or string used to define the virtual hierarchy
   * @param options - Options to list blobs operation.
   */
  listBlobsByHierarchy(delimiter2, options = {}) {
    if (delimiter2 === "") {
      throw new RangeError("delimiter should contain one or more characters");
    }
    const include2 = [];
    if (options.includeCopy) {
      include2.push("copy");
    }
    if (options.includeDeleted) {
      include2.push("deleted");
    }
    if (options.includeMetadata) {
      include2.push("metadata");
    }
    if (options.includeSnapshots) {
      include2.push("snapshots");
    }
    if (options.includeVersions) {
      include2.push("versions");
    }
    if (options.includeUncommitedBlobs) {
      include2.push("uncommittedblobs");
    }
    if (options.includeTags) {
      include2.push("tags");
    }
    if (options.includeDeletedWithVersions) {
      include2.push("deletedwithversions");
    }
    if (options.includeImmutabilityPolicy) {
      include2.push("immutabilitypolicy");
    }
    if (options.includeLegalHold) {
      include2.push("legalhold");
    }
    if (options.prefix === "") {
      options.prefix = void 0;
    }
    const updatedOptions = Object.assign(Object.assign({}, options), include2.length > 0 ? { include: include2 } : {});
    const iter = this.listItemsByHierarchy(delimiter2, updatedOptions);
    return {
      /**
       * The next method, part of the iteration protocol
       */
      async next() {
        return iter.next();
      },
      /**
       * The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings = {}) => {
        return this.listHierarchySegments(delimiter2, settings.continuationToken, Object.assign({ maxPageSize: settings.maxPageSize }, updatedOptions));
      }
    };
  }
  /**
   * The Filter Blobs operation enables callers to list blobs in the container whose tags
   * match a given search expression.
   *
   * @param tagFilterSqlExpression - The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                        The given expression must evaluate to true for a blob to be returned in the results.
   *                                        The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                        however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param marker - A string value that identifies the portion of
   *                          the list of blobs to be returned with the next listing operation. The
   *                          operation returns the continuationToken value within the response body if the
   *                          listing operation did not return all blobs remaining to be listed
   *                          with the current page. The continuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of list
   *                          items. The marker value is opaque to the client.
   * @param options - Options to find blobs by tags.
   */
  async findBlobsByTagsSegment(tagFilterSqlExpression, marker2, options = {}) {
    return tracingClient.withSpan("ContainerClient-findBlobsByTagsSegment", options, async (updatedOptions) => {
      const response = assertResponse(await this.containerContext.filterBlobs({
        abortSignal: options.abortSignal,
        where: tagFilterSqlExpression,
        marker: marker2,
        maxPageSize: options.maxPageSize,
        tracingOptions: updatedOptions.tracingOptions
      }));
      const wrappedResponse = Object.assign(Object.assign({}, response), { _response: response._response, blobs: response.blobs.map((blob) => {
        var _a3;
        let tagValue = "";
        if (((_a3 = blob.tags) === null || _a3 === void 0 ? void 0 : _a3.blobTagSet.length) === 1) {
          tagValue = blob.tags.blobTagSet[0].value;
        }
        return Object.assign(Object.assign({}, blob), { tags: toTags(blob.tags), tagValue });
      }) });
      return wrappedResponse;
    });
  }
  /**
   * Returns an AsyncIterableIterator for ContainerFindBlobsByTagsSegmentResponse.
   *
   * @param tagFilterSqlExpression -  The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                         The given expression must evaluate to true for a blob to be returned in the results.
   *                                         The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                         however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param marker - A string value that identifies the portion of
   *                          the list of blobs to be returned with the next listing operation. The
   *                          operation returns the continuationToken value within the response body if the
   *                          listing operation did not return all blobs remaining to be listed
   *                          with the current page. The continuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of list
   *                          items. The marker value is opaque to the client.
   * @param options - Options to find blobs by tags.
   */
  findBlobsByTagsSegments(tagFilterSqlExpression_1, marker_1) {
    return __asyncGenerator(this, arguments, function* findBlobsByTagsSegments_1(tagFilterSqlExpression, marker2, options = {}) {
      let response;
      if (!!marker2 || marker2 === void 0) {
        do {
          response = yield __await(this.findBlobsByTagsSegment(tagFilterSqlExpression, marker2, options));
          response.blobs = response.blobs || [];
          marker2 = response.continuationToken;
          yield yield __await(response);
        } while (marker2);
      }
    });
  }
  /**
   * Returns an AsyncIterableIterator for blobs.
   *
   * @param tagFilterSqlExpression -  The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                         The given expression must evaluate to true for a blob to be returned in the results.
   *                                         The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                         however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param options - Options to findBlobsByTagsItems.
   */
  findBlobsByTagsItems(tagFilterSqlExpression_1) {
    return __asyncGenerator(this, arguments, function* findBlobsByTagsItems_1(tagFilterSqlExpression, options = {}) {
      var _a3, e_3, _b2, _c2;
      let marker2;
      try {
        for (var _d2 = true, _e = __asyncValues(this.findBlobsByTagsSegments(tagFilterSqlExpression, marker2, options)), _f; _f = yield __await(_e.next()), _a3 = _f.done, !_a3; _d2 = true) {
          _c2 = _f.value;
          _d2 = false;
          const segment = _c2;
          yield __await(yield* __asyncDelegator(__asyncValues(segment.blobs)));
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (!_d2 && !_a3 && (_b2 = _e.return)) yield __await(_b2.call(_e));
        } finally {
          if (e_3) throw e_3.error;
        }
      }
    });
  }
  /**
   * Returns an async iterable iterator to find all blobs with specified tag
   * under the specified container.
   *
   * .byPage() returns an async iterable iterator to list the blobs in pages.
   *
   * Example using `for await` syntax:
   *
   * ```js
   * let i = 1;
   * for await (const blob of containerClient.findBlobsByTags("tagkey='tagvalue'")) {
   *   console.log(`Blob ${i++}: ${blob.name}`);
   * }
   * ```
   *
   * Example using `iter.next()`:
   *
   * ```js
   * let i = 1;
   * const iter = containerClient.findBlobsByTags("tagkey='tagvalue'");
   * let blobItem = await iter.next();
   * while (!blobItem.done) {
   *   console.log(`Blob ${i++}: ${blobItem.value.name}`);
   *   blobItem = await iter.next();
   * }
   * ```
   *
   * Example using `byPage()`:
   *
   * ```js
   * // passing optional maxPageSize in the page settings
   * let i = 1;
   * for await (const response of containerClient.findBlobsByTags("tagkey='tagvalue'").byPage({ maxPageSize: 20 })) {
   *   if (response.blobs) {
   *     for (const blob of response.blobs) {
   *       console.log(`Blob ${i++}: ${blob.name}`);
   *     }
   *   }
   * }
   * ```
   *
   * Example using paging with a marker:
   *
   * ```js
   * let i = 1;
   * let iterator = containerClient.findBlobsByTags("tagkey='tagvalue'").byPage({ maxPageSize: 2 });
   * let response = (await iterator.next()).value;
   *
   * // Prints 2 blob names
   * if (response.blobs) {
   *   for (const blob of response.blobs) {
   *     console.log(`Blob ${i++}: ${blob.name}`);
   *   }
   * }
   *
   * // Gets next marker
   * let marker = response.continuationToken;
   * // Passing next marker as continuationToken
   * iterator = containerClient
   *   .findBlobsByTags("tagkey='tagvalue'")
   *   .byPage({ continuationToken: marker, maxPageSize: 10 });
   * response = (await iterator.next()).value;
   *
   * // Prints blob names
   * if (response.blobs) {
   *   for (const blob of response.blobs) {
   *      console.log(`Blob ${i++}: ${blob.name}`);
   *   }
   * }
   * ```
   *
   * @param tagFilterSqlExpression -  The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                         The given expression must evaluate to true for a blob to be returned in the results.
   *                                         The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                         however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param options - Options to find blobs by tags.
   */
  findBlobsByTags(tagFilterSqlExpression, options = {}) {
    const listSegmentOptions = Object.assign({}, options);
    const iter = this.findBlobsByTagsItems(tagFilterSqlExpression, listSegmentOptions);
    return {
      /**
       * The next method, part of the iteration protocol
       */
      next() {
        return iter.next();
      },
      /**
       * The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings = {}) => {
        return this.findBlobsByTagsSegments(tagFilterSqlExpression, settings.continuationToken, Object.assign({ maxPageSize: settings.maxPageSize }, listSegmentOptions));
      }
    };
  }
  /**
   * The Get Account Information operation returns the sku name and account kind
   * for the specified account.
   * The Get Account Information operation is available on service versions beginning
   * with version 2018-03-28.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-account-information
   *
   * @param options - Options to the Service Get Account Info operation.
   * @returns Response data for the Service Get Account Info operation.
   */
  async getAccountInfo(options = {}) {
    return tracingClient.withSpan("ContainerClient-getAccountInfo", options, async (updatedOptions) => {
      return assertResponse(await this.containerContext.getAccountInfo({
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  getContainerNameFromUrl() {
    let containerName;
    try {
      const parsedUrl = new URL(this.url);
      if (parsedUrl.hostname.split(".")[1] === "blob") {
        containerName = parsedUrl.pathname.split("/")[1];
      } else if (isIpEndpointStyle(parsedUrl)) {
        containerName = parsedUrl.pathname.split("/")[2];
      } else {
        containerName = parsedUrl.pathname.split("/")[1];
      }
      containerName = decodeURIComponent(containerName);
      if (!containerName) {
        throw new Error("Provided containerName is invalid.");
      }
      return containerName;
    } catch (error) {
      throw new Error("Unable to extract containerName with provided information.");
    }
  }
  /**
   * Only available for ContainerClient constructed with a shared key credential.
   *
   * Generates a Blob Container Service Shared Access Signature (SAS) URI based on the client properties
   * and parameters passed in. The SAS is signed by the shared key credential of the client.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateSasUrl(options) {
    return new Promise((resolve) => {
      if (!(this.credential instanceof StorageSharedKeyCredential)) {
        throw new RangeError("Can only generate the SAS when the client is initialized with a shared key credential");
      }
      const sas = generateBlobSASQueryParameters(Object.assign({ containerName: this._containerName }, options), this.credential).toString();
      resolve(appendToURLQuery(this.url, sas));
    });
  }
  /**
   * Only available for ContainerClient constructed with a shared key credential.
   *
   * Generates string to sign for a Blob Container Service Shared Access Signature (SAS) URI
   * based on the client properties and parameters passed in. The SAS is signed by the shared key credential of the client.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  /* eslint-disable-next-line @azure/azure-sdk/ts-naming-options*/
  generateSasStringToSign(options) {
    if (!(this.credential instanceof StorageSharedKeyCredential)) {
      throw new RangeError("Can only generate the SAS when the client is initialized with a shared key credential");
    }
    return generateBlobSASQueryParametersInternal(Object.assign({ containerName: this._containerName }, options), this.credential).stringToSign;
  }
  /**
   * Generates a Blob Container Service Shared Access Signature (SAS) URI based on the client properties
   * and parameters passed in. The SAS is signed by the input user delegation key.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @param userDelegationKey -  Return value of `blobServiceClient.getUserDelegationKey()`
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateUserDelegationSasUrl(options, userDelegationKey) {
    return new Promise((resolve) => {
      const sas = generateBlobSASQueryParameters(Object.assign({ containerName: this._containerName }, options), userDelegationKey, this.accountName).toString();
      resolve(appendToURLQuery(this.url, sas));
    });
  }
  /**
   * Generates string to sign for a Blob Container Service Shared Access Signature (SAS) URI
   * based on the client properties and parameters passed in. The SAS is signed by the input user delegation key.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-a-service-sas
   *
   * @param options - Optional parameters.
   * @param userDelegationKey -  Return value of `blobServiceClient.getUserDelegationKey()`
   * @returns The SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateUserDelegationSasStringToSign(options, userDelegationKey) {
    return generateBlobSASQueryParametersInternal(Object.assign({ containerName: this._containerName }, options), userDelegationKey, this.accountName).stringToSign;
  }
  /**
   * Creates a BlobBatchClient object to conduct batch operations.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/blob-batch
   *
   * @returns A new BlobBatchClient object for this container.
   */
  getBlobBatchClient() {
    return new BlobBatchClient(this.url, this.pipeline);
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/AccountSASPermissions.js
var AccountSASPermissions = class _AccountSASPermissions {
  constructor() {
    this.read = false;
    this.write = false;
    this.delete = false;
    this.deleteVersion = false;
    this.list = false;
    this.add = false;
    this.create = false;
    this.update = false;
    this.process = false;
    this.tag = false;
    this.filter = false;
    this.setImmutabilityPolicy = false;
    this.permanentDelete = false;
  }
  /**
   * Parse initializes the AccountSASPermissions fields from a string.
   *
   * @param permissions -
   */
  static parse(permissions) {
    const accountSASPermissions = new _AccountSASPermissions();
    for (const c of permissions) {
      switch (c) {
        case "r":
          accountSASPermissions.read = true;
          break;
        case "w":
          accountSASPermissions.write = true;
          break;
        case "d":
          accountSASPermissions.delete = true;
          break;
        case "x":
          accountSASPermissions.deleteVersion = true;
          break;
        case "l":
          accountSASPermissions.list = true;
          break;
        case "a":
          accountSASPermissions.add = true;
          break;
        case "c":
          accountSASPermissions.create = true;
          break;
        case "u":
          accountSASPermissions.update = true;
          break;
        case "p":
          accountSASPermissions.process = true;
          break;
        case "t":
          accountSASPermissions.tag = true;
          break;
        case "f":
          accountSASPermissions.filter = true;
          break;
        case "i":
          accountSASPermissions.setImmutabilityPolicy = true;
          break;
        case "y":
          accountSASPermissions.permanentDelete = true;
          break;
        default:
          throw new RangeError(`Invalid permission character: ${c}`);
      }
    }
    return accountSASPermissions;
  }
  /**
   * Creates a {@link AccountSASPermissions} from a raw object which contains same keys as it
   * and boolean values for them.
   *
   * @param permissionLike -
   */
  static from(permissionLike) {
    const accountSASPermissions = new _AccountSASPermissions();
    if (permissionLike.read) {
      accountSASPermissions.read = true;
    }
    if (permissionLike.write) {
      accountSASPermissions.write = true;
    }
    if (permissionLike.delete) {
      accountSASPermissions.delete = true;
    }
    if (permissionLike.deleteVersion) {
      accountSASPermissions.deleteVersion = true;
    }
    if (permissionLike.filter) {
      accountSASPermissions.filter = true;
    }
    if (permissionLike.tag) {
      accountSASPermissions.tag = true;
    }
    if (permissionLike.list) {
      accountSASPermissions.list = true;
    }
    if (permissionLike.add) {
      accountSASPermissions.add = true;
    }
    if (permissionLike.create) {
      accountSASPermissions.create = true;
    }
    if (permissionLike.update) {
      accountSASPermissions.update = true;
    }
    if (permissionLike.process) {
      accountSASPermissions.process = true;
    }
    if (permissionLike.setImmutabilityPolicy) {
      accountSASPermissions.setImmutabilityPolicy = true;
    }
    if (permissionLike.permanentDelete) {
      accountSASPermissions.permanentDelete = true;
    }
    return accountSASPermissions;
  }
  /**
   * Produces the SAS permissions string for an Azure Storage account.
   * Call this method to set AccountSASSignatureValues Permissions field.
   *
   * Using this method will guarantee the resource types are in
   * an order accepted by the service.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-an-account-sas
   *
   */
  toString() {
    const permissions = [];
    if (this.read) {
      permissions.push("r");
    }
    if (this.write) {
      permissions.push("w");
    }
    if (this.delete) {
      permissions.push("d");
    }
    if (this.deleteVersion) {
      permissions.push("x");
    }
    if (this.filter) {
      permissions.push("f");
    }
    if (this.tag) {
      permissions.push("t");
    }
    if (this.list) {
      permissions.push("l");
    }
    if (this.add) {
      permissions.push("a");
    }
    if (this.create) {
      permissions.push("c");
    }
    if (this.update) {
      permissions.push("u");
    }
    if (this.process) {
      permissions.push("p");
    }
    if (this.setImmutabilityPolicy) {
      permissions.push("i");
    }
    if (this.permanentDelete) {
      permissions.push("y");
    }
    return permissions.join("");
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/AccountSASResourceTypes.js
var AccountSASResourceTypes = class _AccountSASResourceTypes {
  constructor() {
    this.service = false;
    this.container = false;
    this.object = false;
  }
  /**
   * Creates an {@link AccountSASResourceTypes} from the specified resource types string. This method will throw an
   * Error if it encounters a character that does not correspond to a valid resource type.
   *
   * @param resourceTypes -
   */
  static parse(resourceTypes) {
    const accountSASResourceTypes = new _AccountSASResourceTypes();
    for (const c of resourceTypes) {
      switch (c) {
        case "s":
          accountSASResourceTypes.service = true;
          break;
        case "c":
          accountSASResourceTypes.container = true;
          break;
        case "o":
          accountSASResourceTypes.object = true;
          break;
        default:
          throw new RangeError(`Invalid resource type: ${c}`);
      }
    }
    return accountSASResourceTypes;
  }
  /**
   * Converts the given resource types to a string.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/constructing-an-account-sas
   *
   */
  toString() {
    const resourceTypes = [];
    if (this.service) {
      resourceTypes.push("s");
    }
    if (this.container) {
      resourceTypes.push("c");
    }
    if (this.object) {
      resourceTypes.push("o");
    }
    return resourceTypes.join("");
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/AccountSASServices.js
var AccountSASServices = class _AccountSASServices {
  constructor() {
    this.blob = false;
    this.file = false;
    this.queue = false;
    this.table = false;
  }
  /**
   * Creates an {@link AccountSASServices} from the specified services string. This method will throw an
   * Error if it encounters a character that does not correspond to a valid service.
   *
   * @param services -
   */
  static parse(services) {
    const accountSASServices = new _AccountSASServices();
    for (const c of services) {
      switch (c) {
        case "b":
          accountSASServices.blob = true;
          break;
        case "f":
          accountSASServices.file = true;
          break;
        case "q":
          accountSASServices.queue = true;
          break;
        case "t":
          accountSASServices.table = true;
          break;
        default:
          throw new RangeError(`Invalid service character: ${c}`);
      }
    }
    return accountSASServices;
  }
  /**
   * Converts the given services to a string.
   *
   */
  toString() {
    const services = [];
    if (this.blob) {
      services.push("b");
    }
    if (this.table) {
      services.push("t");
    }
    if (this.queue) {
      services.push("q");
    }
    if (this.file) {
      services.push("f");
    }
    return services.join("");
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/sas/AccountSASSignatureValues.js
function generateAccountSASQueryParameters(accountSASSignatureValues, sharedKeyCredential) {
  return generateAccountSASQueryParametersInternal(accountSASSignatureValues, sharedKeyCredential).sasQueryParameters;
}
function generateAccountSASQueryParametersInternal(accountSASSignatureValues, sharedKeyCredential) {
  const version2 = accountSASSignatureValues.version ? accountSASSignatureValues.version : SERVICE_VERSION;
  if (accountSASSignatureValues.permissions && accountSASSignatureValues.permissions.setImmutabilityPolicy && version2 < "2020-08-04") {
    throw RangeError("'version' must be >= '2020-08-04' when provided 'i' permission.");
  }
  if (accountSASSignatureValues.permissions && accountSASSignatureValues.permissions.deleteVersion && version2 < "2019-10-10") {
    throw RangeError("'version' must be >= '2019-10-10' when provided 'x' permission.");
  }
  if (accountSASSignatureValues.permissions && accountSASSignatureValues.permissions.permanentDelete && version2 < "2019-10-10") {
    throw RangeError("'version' must be >= '2019-10-10' when provided 'y' permission.");
  }
  if (accountSASSignatureValues.permissions && accountSASSignatureValues.permissions.tag && version2 < "2019-12-12") {
    throw RangeError("'version' must be >= '2019-12-12' when provided 't' permission.");
  }
  if (accountSASSignatureValues.permissions && accountSASSignatureValues.permissions.filter && version2 < "2019-12-12") {
    throw RangeError("'version' must be >= '2019-12-12' when provided 'f' permission.");
  }
  if (accountSASSignatureValues.encryptionScope && version2 < "2020-12-06") {
    throw RangeError("'version' must be >= '2020-12-06' when provided 'encryptionScope' in SAS.");
  }
  const parsedPermissions = AccountSASPermissions.parse(accountSASSignatureValues.permissions.toString());
  const parsedServices = AccountSASServices.parse(accountSASSignatureValues.services).toString();
  const parsedResourceTypes = AccountSASResourceTypes.parse(accountSASSignatureValues.resourceTypes).toString();
  let stringToSign;
  if (version2 >= "2020-12-06") {
    stringToSign = [
      sharedKeyCredential.accountName,
      parsedPermissions,
      parsedServices,
      parsedResourceTypes,
      accountSASSignatureValues.startsOn ? truncatedISO8061Date(accountSASSignatureValues.startsOn, false) : "",
      truncatedISO8061Date(accountSASSignatureValues.expiresOn, false),
      accountSASSignatureValues.ipRange ? ipRangeToString(accountSASSignatureValues.ipRange) : "",
      accountSASSignatureValues.protocol ? accountSASSignatureValues.protocol : "",
      version2,
      accountSASSignatureValues.encryptionScope ? accountSASSignatureValues.encryptionScope : "",
      ""
      // Account SAS requires an additional newline character
    ].join("\n");
  } else {
    stringToSign = [
      sharedKeyCredential.accountName,
      parsedPermissions,
      parsedServices,
      parsedResourceTypes,
      accountSASSignatureValues.startsOn ? truncatedISO8061Date(accountSASSignatureValues.startsOn, false) : "",
      truncatedISO8061Date(accountSASSignatureValues.expiresOn, false),
      accountSASSignatureValues.ipRange ? ipRangeToString(accountSASSignatureValues.ipRange) : "",
      accountSASSignatureValues.protocol ? accountSASSignatureValues.protocol : "",
      version2,
      ""
      // Account SAS requires an additional newline character
    ].join("\n");
  }
  const signature = sharedKeyCredential.computeHMACSHA256(stringToSign);
  return {
    sasQueryParameters: new SASQueryParameters(version2, signature, parsedPermissions.toString(), parsedServices, parsedResourceTypes, accountSASSignatureValues.protocol, accountSASSignatureValues.startsOn, accountSASSignatureValues.expiresOn, accountSASSignatureValues.ipRange, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, accountSASSignatureValues.encryptionScope),
    stringToSign
  };
}

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/BlobServiceClient.js
var BlobServiceClient = class _BlobServiceClient extends StorageClient2 {
  /**
   *
   * Creates an instance of BlobServiceClient from connection string.
   *
   * @param connectionString - Account connection string or a SAS connection string of an Azure storage account.
   *                                  [ Note - Account connection string can only be used in NODE.JS runtime. ]
   *                                  Account connection string example -
   *                                  `DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=accountKey;EndpointSuffix=core.windows.net`
   *                                  SAS connection string example -
   *                                  `BlobEndpoint=https://myaccount.blob.core.windows.net/;QueueEndpoint=https://myaccount.queue.core.windows.net/;FileEndpoint=https://myaccount.file.core.windows.net/;TableEndpoint=https://myaccount.table.core.windows.net/;SharedAccessSignature=sasString`
   * @param options - Optional. Options to configure the HTTP pipeline.
   */
  static fromConnectionString(connectionString, options) {
    options = options || {};
    const extractedCreds = extractConnectionStringParts(connectionString);
    if (extractedCreds.kind === "AccountConnString") {
      if (isNode) {
        const sharedKeyCredential = new StorageSharedKeyCredential(extractedCreds.accountName, extractedCreds.accountKey);
        if (!options.proxyOptions) {
          options.proxyOptions = getDefaultProxySettings(extractedCreds.proxyUri);
        }
        const pipeline = newPipeline(sharedKeyCredential, options);
        return new _BlobServiceClient(extractedCreds.url, pipeline);
      } else {
        throw new Error("Account connection string is only supported in Node.js environment");
      }
    } else if (extractedCreds.kind === "SASConnString") {
      const pipeline = newPipeline(new AnonymousCredential(), options);
      return new _BlobServiceClient(extractedCreds.url + "?" + extractedCreds.accountSas, pipeline);
    } else {
      throw new Error("Connection string must be either an Account connection string or a SAS connection string");
    }
  }
  constructor(url2, credentialOrPipeline, options) {
    let pipeline;
    if (isPipelineLike(credentialOrPipeline)) {
      pipeline = credentialOrPipeline;
    } else if (isNode && credentialOrPipeline instanceof StorageSharedKeyCredential || credentialOrPipeline instanceof AnonymousCredential || isTokenCredential(credentialOrPipeline)) {
      pipeline = newPipeline(credentialOrPipeline, options);
    } else {
      pipeline = newPipeline(new AnonymousCredential(), options);
    }
    super(url2, pipeline);
    this.serviceContext = this.storageClientContext.service;
  }
  /**
   * Creates a {@link ContainerClient} object
   *
   * @param containerName - A container name
   * @returns A new ContainerClient object for the given container name.
   *
   * Example usage:
   *
   * ```js
   * const containerClient = blobServiceClient.getContainerClient("<container name>");
   * ```
   */
  getContainerClient(containerName) {
    return new ContainerClient(appendToURLPath(this.url, encodeURIComponent(containerName)), this.pipeline);
  }
  /**
   * Create a Blob container. @see https://docs.microsoft.com/en-us/rest/api/storageservices/create-container
   *
   * @param containerName - Name of the container to create.
   * @param options - Options to configure Container Create operation.
   * @returns Container creation response and the corresponding container client.
   */
  async createContainer(containerName, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-createContainer", options, async (updatedOptions) => {
      const containerClient = this.getContainerClient(containerName);
      const containerCreateResponse = await containerClient.create(updatedOptions);
      return {
        containerClient,
        containerCreateResponse
      };
    });
  }
  /**
   * Deletes a Blob container.
   *
   * @param containerName - Name of the container to delete.
   * @param options - Options to configure Container Delete operation.
   * @returns Container deletion response.
   */
  async deleteContainer(containerName, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-deleteContainer", options, async (updatedOptions) => {
      const containerClient = this.getContainerClient(containerName);
      return containerClient.delete(updatedOptions);
    });
  }
  /**
   * Restore a previously deleted Blob container.
   * This API is only functional if Container Soft Delete is enabled for the storage account associated with the container.
   *
   * @param deletedContainerName - Name of the previously deleted container.
   * @param deletedContainerVersion - Version of the previously deleted container, used to uniquely identify the deleted container.
   * @param options - Options to configure Container Restore operation.
   * @returns Container deletion response.
   */
  async undeleteContainer(deletedContainerName2, deletedContainerVersion2, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-undeleteContainer", options, async (updatedOptions) => {
      const containerClient = this.getContainerClient(options.destinationContainerName || deletedContainerName2);
      const containerContext = containerClient["storageClientContext"].container;
      const containerUndeleteResponse = assertResponse(await containerContext.restore({
        deletedContainerName: deletedContainerName2,
        deletedContainerVersion: deletedContainerVersion2,
        tracingOptions: updatedOptions.tracingOptions
      }));
      return { containerClient, containerUndeleteResponse };
    });
  }
  /**
   * Rename an existing Blob Container.
   *
   * @param sourceContainerName - The name of the source container.
   * @param destinationContainerName - The new name of the container.
   * @param options - Options to configure Container Rename operation.
   */
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore Need to hide this interface for now. Make it public and turn on the live tests for it when the service is ready.
  async renameContainer(sourceContainerName2, destinationContainerName, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-renameContainer", options, async (updatedOptions) => {
      var _a3;
      const containerClient = this.getContainerClient(destinationContainerName);
      const containerContext = containerClient["storageClientContext"].container;
      const containerRenameResponse = assertResponse(await containerContext.rename(sourceContainerName2, Object.assign(Object.assign({}, updatedOptions), { sourceLeaseId: (_a3 = options.sourceCondition) === null || _a3 === void 0 ? void 0 : _a3.leaseId })));
      return { containerClient, containerRenameResponse };
    });
  }
  /**
   * Gets the properties of a storage account’s Blob service, including properties
   * for Storage Analytics and CORS (Cross-Origin Resource Sharing) rules.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-blob-service-properties
   *
   * @param options - Options to the Service Get Properties operation.
   * @returns Response data for the Service Get Properties operation.
   */
  async getProperties(options = {}) {
    return tracingClient.withSpan("BlobServiceClient-getProperties", options, async (updatedOptions) => {
      return assertResponse(await this.serviceContext.getProperties({
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Sets properties for a storage account’s Blob service endpoint, including properties
   * for Storage Analytics, CORS (Cross-Origin Resource Sharing) rules and soft delete settings.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-blob-service-properties
   *
   * @param properties -
   * @param options - Options to the Service Set Properties operation.
   * @returns Response data for the Service Set Properties operation.
   */
  async setProperties(properties, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-setProperties", options, async (updatedOptions) => {
      return assertResponse(await this.serviceContext.setProperties(properties, {
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Retrieves statistics related to replication for the Blob service. It is only
   * available on the secondary location endpoint when read-access geo-redundant
   * replication is enabled for the storage account.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-blob-service-stats
   *
   * @param options - Options to the Service Get Statistics operation.
   * @returns Response data for the Service Get Statistics operation.
   */
  async getStatistics(options = {}) {
    return tracingClient.withSpan("BlobServiceClient-getStatistics", options, async (updatedOptions) => {
      return assertResponse(await this.serviceContext.getStatistics({
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * The Get Account Information operation returns the sku name and account kind
   * for the specified account.
   * The Get Account Information operation is available on service versions beginning
   * with version 2018-03-28.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-account-information
   *
   * @param options - Options to the Service Get Account Info operation.
   * @returns Response data for the Service Get Account Info operation.
   */
  async getAccountInfo(options = {}) {
    return tracingClient.withSpan("BlobServiceClient-getAccountInfo", options, async (updatedOptions) => {
      return assertResponse(await this.serviceContext.getAccountInfo({
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
    });
  }
  /**
   * Returns a list of the containers under the specified account.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/list-containers2
   *
   * @param marker - A string value that identifies the portion of
   *                        the list of containers to be returned with the next listing operation. The
   *                        operation returns the continuationToken value within the response body if the
   *                        listing operation did not return all containers remaining to be listed
   *                        with the current page. The continuationToken value can be used as the value for
   *                        the marker parameter in a subsequent call to request the next page of list
   *                        items. The marker value is opaque to the client.
   * @param options - Options to the Service List Container Segment operation.
   * @returns Response data for the Service List Container Segment operation.
   */
  async listContainersSegment(marker2, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-listContainersSegment", options, async (updatedOptions) => {
      return assertResponse(await this.serviceContext.listContainersSegment(Object.assign(Object.assign({ abortSignal: options.abortSignal, marker: marker2 }, options), { include: typeof options.include === "string" ? [options.include] : options.include, tracingOptions: updatedOptions.tracingOptions })));
    });
  }
  /**
   * The Filter Blobs operation enables callers to list blobs across all containers whose tags
   * match a given search expression. Filter blobs searches across all containers within a
   * storage account but can be scoped within the expression to a single container.
   *
   * @param tagFilterSqlExpression - The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                        The given expression must evaluate to true for a blob to be returned in the results.
   *                                        The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                        however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param marker - A string value that identifies the portion of
   *                          the list of blobs to be returned with the next listing operation. The
   *                          operation returns the continuationToken value within the response body if the
   *                          listing operation did not return all blobs remaining to be listed
   *                          with the current page. The continuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of list
   *                          items. The marker value is opaque to the client.
   * @param options - Options to find blobs by tags.
   */
  async findBlobsByTagsSegment(tagFilterSqlExpression, marker2, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-findBlobsByTagsSegment", options, async (updatedOptions) => {
      const response = assertResponse(await this.serviceContext.filterBlobs({
        abortSignal: options.abortSignal,
        where: tagFilterSqlExpression,
        marker: marker2,
        maxPageSize: options.maxPageSize,
        tracingOptions: updatedOptions.tracingOptions
      }));
      const wrappedResponse = Object.assign(Object.assign({}, response), { _response: response._response, blobs: response.blobs.map((blob) => {
        var _a3;
        let tagValue = "";
        if (((_a3 = blob.tags) === null || _a3 === void 0 ? void 0 : _a3.blobTagSet.length) === 1) {
          tagValue = blob.tags.blobTagSet[0].value;
        }
        return Object.assign(Object.assign({}, blob), { tags: toTags(blob.tags), tagValue });
      }) });
      return wrappedResponse;
    });
  }
  /**
   * Returns an AsyncIterableIterator for ServiceFindBlobsByTagsSegmentResponse.
   *
   * @param tagFilterSqlExpression -  The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                         The given expression must evaluate to true for a blob to be returned in the results.
   *                                         The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                         however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param marker - A string value that identifies the portion of
   *                          the list of blobs to be returned with the next listing operation. The
   *                          operation returns the continuationToken value within the response body if the
   *                          listing operation did not return all blobs remaining to be listed
   *                          with the current page. The continuationToken value can be used as the value for
   *                          the marker parameter in a subsequent call to request the next page of list
   *                          items. The marker value is opaque to the client.
   * @param options - Options to find blobs by tags.
   */
  findBlobsByTagsSegments(tagFilterSqlExpression_1, marker_1) {
    return __asyncGenerator(this, arguments, function* findBlobsByTagsSegments_1(tagFilterSqlExpression, marker2, options = {}) {
      let response;
      if (!!marker2 || marker2 === void 0) {
        do {
          response = yield __await(this.findBlobsByTagsSegment(tagFilterSqlExpression, marker2, options));
          response.blobs = response.blobs || [];
          marker2 = response.continuationToken;
          yield yield __await(response);
        } while (marker2);
      }
    });
  }
  /**
   * Returns an AsyncIterableIterator for blobs.
   *
   * @param tagFilterSqlExpression -  The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                         The given expression must evaluate to true for a blob to be returned in the results.
   *                                         The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                         however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param options - Options to findBlobsByTagsItems.
   */
  findBlobsByTagsItems(tagFilterSqlExpression_1) {
    return __asyncGenerator(this, arguments, function* findBlobsByTagsItems_1(tagFilterSqlExpression, options = {}) {
      var _a3, e_1, _b2, _c2;
      let marker2;
      try {
        for (var _d2 = true, _e = __asyncValues(this.findBlobsByTagsSegments(tagFilterSqlExpression, marker2, options)), _f; _f = yield __await(_e.next()), _a3 = _f.done, !_a3; _d2 = true) {
          _c2 = _f.value;
          _d2 = false;
          const segment = _c2;
          yield __await(yield* __asyncDelegator(__asyncValues(segment.blobs)));
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_d2 && !_a3 && (_b2 = _e.return)) yield __await(_b2.call(_e));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
  /**
   * Returns an async iterable iterator to find all blobs with specified tag
   * under the specified account.
   *
   * .byPage() returns an async iterable iterator to list the blobs in pages.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-blob-service-properties
   *
   * Example using `for await` syntax:
   *
   * ```js
   * let i = 1;
   * for await (const blob of blobServiceClient.findBlobsByTags("tagkey='tagvalue'")) {
   *   console.log(`Blob ${i++}: ${container.name}`);
   * }
   * ```
   *
   * Example using `iter.next()`:
   *
   * ```js
   * let i = 1;
   * const iter = blobServiceClient.findBlobsByTags("tagkey='tagvalue'");
   * let blobItem = await iter.next();
   * while (!blobItem.done) {
   *   console.log(`Blob ${i++}: ${blobItem.value.name}`);
   *   blobItem = await iter.next();
   * }
   * ```
   *
   * Example using `byPage()`:
   *
   * ```js
   * // passing optional maxPageSize in the page settings
   * let i = 1;
   * for await (const response of blobServiceClient.findBlobsByTags("tagkey='tagvalue'").byPage({ maxPageSize: 20 })) {
   *   if (response.blobs) {
   *     for (const blob of response.blobs) {
   *       console.log(`Blob ${i++}: ${blob.name}`);
   *     }
   *   }
   * }
   * ```
   *
   * Example using paging with a marker:
   *
   * ```js
   * let i = 1;
   * let iterator = blobServiceClient.findBlobsByTags("tagkey='tagvalue'").byPage({ maxPageSize: 2 });
   * let response = (await iterator.next()).value;
   *
   * // Prints 2 blob names
   * if (response.blobs) {
   *   for (const blob of response.blobs) {
   *     console.log(`Blob ${i++}: ${blob.name}`);
   *   }
   * }
   *
   * // Gets next marker
   * let marker = response.continuationToken;
   * // Passing next marker as continuationToken
   * iterator = blobServiceClient
   *   .findBlobsByTags("tagkey='tagvalue'")
   *   .byPage({ continuationToken: marker, maxPageSize: 10 });
   * response = (await iterator.next()).value;
   *
   * // Prints blob names
   * if (response.blobs) {
   *   for (const blob of response.blobs) {
   *      console.log(`Blob ${i++}: ${blob.name}`);
   *   }
   * }
   * ```
   *
   * @param tagFilterSqlExpression -  The where parameter enables the caller to query blobs whose tags match a given expression.
   *                                         The given expression must evaluate to true for a blob to be returned in the results.
   *                                         The[OData - ABNF] filter syntax rule defines the formal grammar for the value of the where query parameter;
   *                                         however, only a subset of the OData filter syntax is supported in the Blob service.
   * @param options - Options to find blobs by tags.
   */
  findBlobsByTags(tagFilterSqlExpression, options = {}) {
    const listSegmentOptions = Object.assign({}, options);
    const iter = this.findBlobsByTagsItems(tagFilterSqlExpression, listSegmentOptions);
    return {
      /**
       * The next method, part of the iteration protocol
       */
      next() {
        return iter.next();
      },
      /**
       * The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings = {}) => {
        return this.findBlobsByTagsSegments(tagFilterSqlExpression, settings.continuationToken, Object.assign({ maxPageSize: settings.maxPageSize }, listSegmentOptions));
      }
    };
  }
  /**
   * Returns an AsyncIterableIterator for ServiceListContainersSegmentResponses
   *
   * @param marker - A string value that identifies the portion of
   *                        the list of containers to be returned with the next listing operation. The
   *                        operation returns the continuationToken value within the response body if the
   *                        listing operation did not return all containers remaining to be listed
   *                        with the current page. The continuationToken value can be used as the value for
   *                        the marker parameter in a subsequent call to request the next page of list
   *                        items. The marker value is opaque to the client.
   * @param options - Options to list containers operation.
   */
  listSegments(marker_1) {
    return __asyncGenerator(this, arguments, function* listSegments_1(marker2, options = {}) {
      let listContainersSegmentResponse;
      if (!!marker2 || marker2 === void 0) {
        do {
          listContainersSegmentResponse = yield __await(this.listContainersSegment(marker2, options));
          listContainersSegmentResponse.containerItems = listContainersSegmentResponse.containerItems || [];
          marker2 = listContainersSegmentResponse.continuationToken;
          yield yield __await(yield __await(listContainersSegmentResponse));
        } while (marker2);
      }
    });
  }
  /**
   * Returns an AsyncIterableIterator for Container Items
   *
   * @param options - Options to list containers operation.
   */
  listItems() {
    return __asyncGenerator(this, arguments, function* listItems_1(options = {}) {
      var _a3, e_2, _b2, _c2;
      let marker2;
      try {
        for (var _d2 = true, _e = __asyncValues(this.listSegments(marker2, options)), _f; _f = yield __await(_e.next()), _a3 = _f.done, !_a3; _d2 = true) {
          _c2 = _f.value;
          _d2 = false;
          const segment = _c2;
          yield __await(yield* __asyncDelegator(__asyncValues(segment.containerItems)));
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (!_d2 && !_a3 && (_b2 = _e.return)) yield __await(_b2.call(_e));
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    });
  }
  /**
   * Returns an async iterable iterator to list all the containers
   * under the specified account.
   *
   * .byPage() returns an async iterable iterator to list the containers in pages.
   *
   * Example using `for await` syntax:
   *
   * ```js
   * let i = 1;
   * for await (const container of blobServiceClient.listContainers()) {
   *   console.log(`Container ${i++}: ${container.name}`);
   * }
   * ```
   *
   * Example using `iter.next()`:
   *
   * ```js
   * let i = 1;
   * const iter = blobServiceClient.listContainers();
   * let containerItem = await iter.next();
   * while (!containerItem.done) {
   *   console.log(`Container ${i++}: ${containerItem.value.name}`);
   *   containerItem = await iter.next();
   * }
   * ```
   *
   * Example using `byPage()`:
   *
   * ```js
   * // passing optional maxPageSize in the page settings
   * let i = 1;
   * for await (const response of blobServiceClient.listContainers().byPage({ maxPageSize: 20 })) {
   *   if (response.containerItems) {
   *     for (const container of response.containerItems) {
   *       console.log(`Container ${i++}: ${container.name}`);
   *     }
   *   }
   * }
   * ```
   *
   * Example using paging with a marker:
   *
   * ```js
   * let i = 1;
   * let iterator = blobServiceClient.listContainers().byPage({ maxPageSize: 2 });
   * let response = (await iterator.next()).value;
   *
   * // Prints 2 container names
   * if (response.containerItems) {
   *   for (const container of response.containerItems) {
   *     console.log(`Container ${i++}: ${container.name}`);
   *   }
   * }
   *
   * // Gets next marker
   * let marker = response.continuationToken;
   * // Passing next marker as continuationToken
   * iterator = blobServiceClient
   *   .listContainers()
   *   .byPage({ continuationToken: marker, maxPageSize: 10 });
   * response = (await iterator.next()).value;
   *
   * // Prints 10 container names
   * if (response.containerItems) {
   *   for (const container of response.containerItems) {
   *      console.log(`Container ${i++}: ${container.name}`);
   *   }
   * }
   * ```
   *
   * @param options - Options to list containers.
   * @returns An asyncIterableIterator that supports paging.
   */
  listContainers(options = {}) {
    if (options.prefix === "") {
      options.prefix = void 0;
    }
    const include2 = [];
    if (options.includeDeleted) {
      include2.push("deleted");
    }
    if (options.includeMetadata) {
      include2.push("metadata");
    }
    if (options.includeSystem) {
      include2.push("system");
    }
    const listSegmentOptions = Object.assign(Object.assign({}, options), include2.length > 0 ? { include: include2 } : {});
    const iter = this.listItems(listSegmentOptions);
    return {
      /**
       * The next method, part of the iteration protocol
       */
      next() {
        return iter.next();
      },
      /**
       * The connection to the async iterator, part of the iteration protocol
       */
      [Symbol.asyncIterator]() {
        return this;
      },
      /**
       * Return an AsyncIterableIterator that works a page at a time
       */
      byPage: (settings = {}) => {
        return this.listSegments(settings.continuationToken, Object.assign({ maxPageSize: settings.maxPageSize }, listSegmentOptions));
      }
    };
  }
  /**
   * ONLY AVAILABLE WHEN USING BEARER TOKEN AUTHENTICATION (TokenCredential).
   *
   * Retrieves a user delegation key for the Blob service. This is only a valid operation when using
   * bearer token authentication.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-user-delegation-key
   *
   * @param startsOn -      The start time for the user delegation SAS. Must be within 7 days of the current time
   * @param expiresOn -     The end time for the user delegation SAS. Must be within 7 days of the current time
   */
  async getUserDelegationKey(startsOn, expiresOn2, options = {}) {
    return tracingClient.withSpan("BlobServiceClient-getUserDelegationKey", options, async (updatedOptions) => {
      const response = assertResponse(await this.serviceContext.getUserDelegationKey({
        startsOn: truncatedISO8061Date(startsOn, false),
        expiresOn: truncatedISO8061Date(expiresOn2, false)
      }, {
        abortSignal: options.abortSignal,
        tracingOptions: updatedOptions.tracingOptions
      }));
      const userDelegationKey = {
        signedObjectId: response.signedObjectId,
        signedTenantId: response.signedTenantId,
        signedStartsOn: new Date(response.signedStartsOn),
        signedExpiresOn: new Date(response.signedExpiresOn),
        signedService: response.signedService,
        signedVersion: response.signedVersion,
        value: response.value
      };
      const res = Object.assign({ _response: response._response, requestId: response.requestId, clientRequestId: response.clientRequestId, version: response.version, date: response.date, errorCode: response.errorCode }, userDelegationKey);
      return res;
    });
  }
  /**
   * Creates a BlobBatchClient object to conduct batch operations.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/blob-batch
   *
   * @returns A new BlobBatchClient object for this service.
   */
  getBlobBatchClient() {
    return new BlobBatchClient(this.url, this.pipeline);
  }
  /**
   * Only available for BlobServiceClient constructed with a shared key credential.
   *
   * Generates a Blob account Shared Access Signature (SAS) URI based on the client properties
   * and parameters passed in. The SAS is signed by the shared key credential of the client.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/create-account-sas
   *
   * @param expiresOn - Optional. The time at which the shared access signature becomes invalid. Default to an hour later if not provided.
   * @param permissions - Specifies the list of permissions to be associated with the SAS.
   * @param resourceTypes - Specifies the resource types associated with the shared access signature.
   * @param options - Optional parameters.
   * @returns An account SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateAccountSasUrl(expiresOn2, permissions = AccountSASPermissions.parse("r"), resourceTypes = "sco", options = {}) {
    if (!(this.credential instanceof StorageSharedKeyCredential)) {
      throw RangeError("Can only generate the account SAS when the client is initialized with a shared key credential");
    }
    if (expiresOn2 === void 0) {
      const now = /* @__PURE__ */ new Date();
      expiresOn2 = new Date(now.getTime() + 3600 * 1e3);
    }
    const sas = generateAccountSASQueryParameters(Object.assign({
      permissions,
      expiresOn: expiresOn2,
      resourceTypes,
      services: AccountSASServices.parse("b").toString()
    }, options), this.credential).toString();
    return appendToURLQuery(this.url, sas);
  }
  /**
   * Only available for BlobServiceClient constructed with a shared key credential.
   *
   * Generates string to sign for a Blob account Shared Access Signature (SAS) URI based on
   * the client properties and parameters passed in. The SAS is signed by the shared key credential of the client.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/create-account-sas
   *
   * @param expiresOn - Optional. The time at which the shared access signature becomes invalid. Default to an hour later if not provided.
   * @param permissions - Specifies the list of permissions to be associated with the SAS.
   * @param resourceTypes - Specifies the resource types associated with the shared access signature.
   * @param options - Optional parameters.
   * @returns An account SAS URI consisting of the URI to the resource represented by this client, followed by the generated SAS token.
   */
  generateSasStringToSign(expiresOn2, permissions = AccountSASPermissions.parse("r"), resourceTypes = "sco", options = {}) {
    if (!(this.credential instanceof StorageSharedKeyCredential)) {
      throw RangeError("Can only generate the account SAS when the client is initialized with a shared key credential");
    }
    if (expiresOn2 === void 0) {
      const now = /* @__PURE__ */ new Date();
      expiresOn2 = new Date(now.getTime() + 3600 * 1e3);
    }
    return generateAccountSASQueryParametersInternal(Object.assign({
      permissions,
      expiresOn: expiresOn2,
      resourceTypes,
      services: AccountSASServices.parse("b").toString()
    }, options), this.credential).stringToSign;
  }
};

// node_modules/@azure/storage-blob/dist-esm/storage-blob/src/generatedModels.js
var KnownEncryptionAlgorithmType2;
(function(KnownEncryptionAlgorithmType3) {
  KnownEncryptionAlgorithmType3["AES256"] = "AES256";
})(KnownEncryptionAlgorithmType2 || (KnownEncryptionAlgorithmType2 = {}));
export {
  AnonymousCredential,
  AnonymousCredentialPolicy,
  AppendBlobClient,
  BaseRequestPolicy,
  BlobBatch,
  BlobBatchClient,
  BlobClient,
  BlobLeaseClient,
  BlobServiceClient,
  BlockBlobClient,
  BlockBlobTier,
  ContainerClient,
  Credential,
  CredentialPolicy,
  KnownEncryptionAlgorithmType2 as KnownEncryptionAlgorithmType,
  PageBlobClient,
  Pipeline,
  PremiumPageBlobTier,
  RestError,
  StorageBrowserPolicy,
  StorageBrowserPolicyFactory,
  StorageOAuthScopes,
  StorageRetryPolicy,
  StorageRetryPolicyFactory,
  StorageRetryPolicyType,
  isPipelineLike,
  logger3 as logger,
  newPipeline
};
//# sourceMappingURL=@azure_storage-blob.js.map

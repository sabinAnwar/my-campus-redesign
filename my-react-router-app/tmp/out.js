var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.0";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React2 = require_react(), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React2 = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React2.react_stack_bottom_frame.bind(
        React2,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// app/routes/_app.courses.schedule.tsx
var import_react3 = __toESM(require_react(), 1);

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var import_react2 = __toESM(require_react());

// node_modules/lucide-react/dist/esm/shared/src/utils.js
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

// node_modules/lucide-react/dist/esm/Icon.js
var import_react = __toESM(require_react());

// node_modules/lucide-react/dist/esm/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// node_modules/lucide-react/dist/esm/Icon.js
var Icon = (0, import_react.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return (0, import_react.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var createLucideIcon = (iconName, iconNode) => {
  const Component = (0, import_react2.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react2.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};

// node_modules/lucide-react/dist/esm/icons/calendar-days.js
var CalendarDays = createLucideIcon("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
]);

// node_modules/lucide-react/dist/esm/icons/chevron-down.js
var ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);

// node_modules/lucide-react/dist/esm/icons/chevron-left.js
var ChevronLeft = createLucideIcon("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);

// node_modules/lucide-react/dist/esm/icons/chevron-right.js
var ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);

// node_modules/lucide-react/dist/esm/icons/clock.js
var Clock = createLucideIcon("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
]);

// node_modules/lucide-react/dist/esm/icons/grid-3x3.js
var Grid3x3 = createLucideIcon("Grid3x3", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
]);

// node_modules/lucide-react/dist/esm/icons/info.js
var Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);

// node_modules/lucide-react/dist/esm/icons/map-pin.js
var MapPin = createLucideIcon("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);

// node_modules/lucide-react/dist/esm/icons/video.js
var Video = createLucideIcon("Video", [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
]);

// app/routes/_app.courses.schedule.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var loader = async () => null;
var EVENTS = [
  {
    id: 1,
    title: "DSBEC01 - E-Commerce",
    type: "Lecture",
    date: "2026-01-06",
    time: "11:30",
    duration: "8 LE",
    location: "HH - Christoph-Probst-Weg 28 - 2.54 Jenischhaus",
    professor: "Klein, Holger",
    professorColor: "#3B82F6",
    mandatory: true,
    zoom: null,
    description: "Vorlesung in Pr\xE4senz"
  },
  {
    id: 2,
    title: "Praxis-Workshop (optional)",
    type: "Lab",
    date: "2026-01-06",
    time: "16:00",
    duration: "2h",
    location: "Online",
    professor: "Team Praxis",
    professorColor: "#10B981",
    mandatory: false,
    zoom: "https://zoom.us/j/333333333",
    description: "Optionaler Praxisblock mit \xDCbungen."
  }
];
var DEFAULT_PALETTE = {
  praxis: {
    label: "Praxiszeit",
    bg: "bg-emerald-100/80 dark:bg-emerald-900/20",
    text: "text-emerald-900 dark:text-emerald-100",
    ring: "ring-emerald-300/60 dark:ring-emerald-400/50"
  },
  vorlesung: {
    label: "Vorlesungstermine",
    bg: "bg-blue-100/80 dark:bg-blue-900/20",
    text: "text-blue-900 dark:text-blue-100",
    ring: "ring-blue-300/60 dark:ring-blue-400/50"
  },
  theoriephase: {
    label: "Theoriewoche",
    bg: "bg-fuchsia-100/80 dark:bg-fuchsia-900/20",
    text: "text-fuchsia-900 dark:text-fuchsia-100",
    ring: "ring-fuchsia-300/60 dark:ring-fuchsia-400/50"
  },
  klausurphase: {
    label: "Pr\xFCfungsphase",
    bg: "bg-rose-100/80 dark:bg-rose-900/20",
    text: "text-rose-900 dark:text-rose-100",
    ring: "ring-rose-300/60 dark:ring-rose-400/50"
  },
  nachpruefung: {
    label: "Nachpr\xFCfungsphase",
    bg: "bg-slate-200 dark:bg-slate-800/40",
    text: "text-slate-900 dark:text-slate-100",
    ring: "ring-slate-300/60 dark:ring-slate-500/50"
  },
  wochenende: {
    label: "Wochenenden (frei von Praxis)",
    bg: "bg-amber-100/80 dark:bg-amber-900/20",
    text: "text-amber-900 dark:text-amber-100",
    ring: "ring-amber-300/60 dark:ring-amber-400/50"
  },
  feiertag: {
    label: "Feiertag",
    bg: "bg-slate-700 text-white dark:bg-slate-800/70",
    text: "text-white",
    ring: "ring-slate-600/70"
  },
  urlaubstag: {
    label: "Urlaubstage / keine Praxis",
    bg: "bg-cyan-100/80 dark:bg-cyan-900/20",
    text: "text-cyan-900 dark:text-cyan-100",
    ring: "ring-cyan-300/60 dark:ring-cyan-400/50"
  }
};
var STUDY_PLANS = [
  {
    id: "ws25-26",
    label: "7. Semester (Blockmodell) Okt 2025 \u2013 M\xE4r 2026",
    description: "Angelehnt an den Plan im Screenshot, inkl. Theorie-/Pr\xFCfungsphasen.",
    autoWeekends: true,
    paletteOverrides: {
      theoriephase: {
        label: "Theoriewoche (Jan bis M\xE4r)",
        bg: "bg-fuchsia-300 dark:bg-fuchsia-900/50",
        text: "text-fuchsia-900 dark:text-fuchsia-100",
        ring: "ring-fuchsia-500/70 dark:ring-fuchsia-500/60"
      },
      praxis: {
        label: "Praxiswochen (Okt bis Dez)",
        bg: "bg-lime-300 dark:bg-lime-900/50",
        text: "text-lime-900 dark:text-lime-100",
        ring: "ring-lime-500/70 dark:ring-lime-500/60"
      },
      klausurphase: {
        label: "Pr\xFCfungswoche",
        bg: "bg-red-400 dark:bg-red-900/60",
        text: "text-red-50 dark:text-red-50",
        ring: "ring-red-500/70"
      },
      nachpruefung: {
        label: "Nachpr\xFCfungsphase",
        bg: "bg-slate-400 dark:bg-slate-800",
        text: "text-slate-900 dark:text-slate-100",
        ring: "ring-slate-500/70"
      },
      wochenende: {
        label: "Wochenenden (max. 2/Monat arbeiten)",
        bg: "bg-amber-300 dark:bg-amber-900/60",
        text: "text-amber-900 dark:text-amber-100",
        ring: "ring-amber-500/70"
      },
      urlaubstag: {
        label: "Urlaubstage",
        bg: "bg-cyan-300 dark:bg-cyan-900/50",
        text: "text-cyan-900 dark:text-cyan-100",
        ring: "ring-cyan-500/70"
      },
      feiertag: {
        label: "Nationaler Feiertag",
        bg: "bg-slate-800 text-white",
        text: "text-white",
        ring: "ring-slate-600/70"
      }
    },
    blocks: [
      { start: "2025-10-01", end: "2025-12-31", status: "praxis" },
      { start: "2026-01-01", end: "2026-03-31", status: "theoriephase" },
      { start: "2026-02-15", end: "2026-02-21", status: "klausurphase" },
      { start: "2026-03-10", end: "2026-03-20", status: "nachpruefung" },
      { start: "2025-12-24", end: "2025-12-26", status: "feiertag" },
      { start: "2025-12-27", end: "2025-12-31", status: "urlaubstag" }
    ]
  },
  {
    id: "ss26",
    label: "Sommersemester Beispiel 2026",
    description: "Abweichende Farben und Bl\xF6cke, falls sich der Plan \xE4ndert.",
    autoWeekends: true,
    paletteOverrides: {
      praxis: {
        label: "Praxisphase",
        bg: "bg-emerald-300 dark:bg-emerald-900/50",
        text: "text-emerald-900 dark:text-emerald-100",
        ring: "ring-emerald-500/70"
      },
      theoriephase: {
        label: "Theorieblock",
        bg: "bg-indigo-300 dark:bg-indigo-900/50",
        text: "text-indigo-900 dark:text-indigo-100",
        ring: "ring-indigo-500/70"
      },
      klausurphase: {
        label: "Pr\xFCfungen",
        bg: "bg-rose-400 dark:bg-rose-900/60",
        text: "text-rose-50 dark:text-rose-50",
        ring: "ring-rose-500/70"
      }
    },
    blocks: [
      { start: "2026-04-01", end: "2026-05-31", status: "theoriephase" },
      { start: "2026-06-01", end: "2026-07-31", status: "praxis" },
      { start: "2026-08-01", end: "2026-08-10", status: "klausurphase" },
      { start: "2026-08-20", end: "2026-08-31", status: "urlaubstag" }
    ]
  }
];
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
function addDays(date, delta) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}
function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function getMonthDays(month) {
  const days = [];
  const end = endOfMonth(month).getDate();
  for (let i = 1; i <= end; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  return days;
}
function expandBlocksToMap(blocks, autoWeekends) {
  const map = /* @__PURE__ */ new Map();
  blocks.forEach((b) => {
    const start = new Date(b.start);
    const end = new Date(b.end);
    for (let d = new Date(start); d.getTime() <= end.getTime(); d = addDays(d, 1)) {
      map.set(toISODate(d), b.status);
    }
  });
  if (autoWeekends) {
    const minStart = new Date(
      Math.min(...blocks.map((b) => new Date(b.start).getTime()))
    );
    const maxEnd = new Date(
      Math.max(...blocks.map((b) => new Date(b.end).getTime()))
    );
    for (let d = new Date(minStart); d.getTime() <= maxEnd.getTime(); d = addDays(d, 1)) {
      const iso = toISODate(d);
      if (!map.has(iso)) {
        const day = d.getDay();
        if (day === 0 || day === 6) {
          map.set(iso, "wochenende");
        }
      }
    }
  }
  return map;
}
function listMonthsForBlocks(blocks) {
  const starts = blocks.map((b) => new Date(b.start));
  const ends = blocks.map((b) => new Date(b.end));
  const minStart = startOfMonth(
    new Date(Math.min(...starts.map((d) => d.getTime())))
  );
  const maxEnd = endOfMonth(
    new Date(Math.max(...ends.map((d) => d.getTime())))
  );
  const months = [];
  let cursor = new Date(minStart);
  while (cursor.getFullYear() < maxEnd.getFullYear() || cursor.getFullYear() === maxEnd.getFullYear() && cursor.getMonth() <= maxEnd.getMonth()) {
    months.push(new Date(cursor));
    cursor = addMonths(cursor, 1);
  }
  return months;
}
function CourseScheduleEnhanced() {
  const today = /* @__PURE__ */ new Date();
  const [selectedPlanId, setSelectedPlanId] = (0, import_react3.useState)(
    STUDY_PLANS[0]?.id || ""
  );
  const selectedPlan = STUDY_PLANS.find((p) => p.id === selectedPlanId) || STUDY_PLANS[0];
  const paletteColors = (0, import_react3.useMemo)(
    () => ({ ...DEFAULT_PALETTE, ...selectedPlan?.paletteOverrides || {} }),
    [selectedPlan]
  );
  const statusMap = (0, import_react3.useMemo)(
    () => expandBlocksToMap(
      selectedPlan?.blocks || [],
      selectedPlan?.autoWeekends ?? true
    ),
    [selectedPlan]
  );
  const studyMonths = (0, import_react3.useMemo)(
    () => listMonthsForBlocks(selectedPlan?.blocks || []),
    [selectedPlan]
  );
  const studyYears = (0, import_react3.useMemo)(() => {
    const years = /* @__PURE__ */ new Set();
    studyMonths.forEach((m) => years.add(m.getFullYear()));
    return Array.from(years).sort();
  }, [studyMonths]);
  const todayISO = toISODate(today);
  const eventsByDate = (0, import_react3.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    EVENTS.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, []);
  const [selectedDate, setSelectedDate] = (0, import_react3.useState)(toISODate(today));
  const dayEvents = eventsByDate.get(selectedDate) || [];
  const mandatoryDayEvents = dayEvents.filter((e) => e.mandatory);
  const optionalDayEvents = dayEvents.filter((e) => !e.mandatory);
  const nextMandatoryEvent = (0, import_react3.useMemo)(() => {
    const sorted = [...EVENTS].filter((e) => e.mandatory).sort(
      (a, b) => (/* @__PURE__ */ new Date(`${a.date}T${a.time}`)).getTime() - (/* @__PURE__ */ new Date(`${b.date}T${b.time}`)).getTime()
    );
    return sorted.find((e) => /* @__PURE__ */ new Date(`${e.date}T${e.time}`) >= today) || sorted[0] || null;
  }, [today]);
  const [showLegend, setShowLegend] = (0, import_react3.useState)(true);
  const [viewMode, setViewMode] = (0, import_react3.useState)("multi");
  const monthList = studyMonths;
  const [currentMonthIdx, setCurrentMonthIdx] = (0, import_react3.useState)(0);
  (0, import_react3.useEffect)(() => {
    setCurrentMonthIdx(0);
  }, [selectedPlanId]);
  const selectedStatus = statusMap.get(selectedDate);
  const todayStatus = statusMap.get(todayISO);
  const getPalette = (status, plan) => {
    const palette = { ...DEFAULT_PALETTE, ...plan?.paletteOverrides || {} };
    return palette[status] || DEFAULT_PALETTE.praxis;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-8 space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 shadow-2xl", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative z-10 flex flex-wrap items-start gap-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-10 w-10 text-blue-200" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-blue-200/80", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-blue-400 animate-pulse" }),
              "Studienplan & Termine"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "text-3xl md:text-5xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200", children: "Dein Semester-Planer" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-blue-200/70 max-w-xl text-lg font-medium", children: "Behalte den \xDCberblick \xFCber alle Vorlesungen, Pr\xFCfungsphasen und Deadlines in einer modernen Ansicht." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rounded-2xl border border-white/40 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-4 sm:px-5 sm:py-5 shadow-xl ring-1 ring-black/5", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]", children: "Plan w\xE4hlen" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative group", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "select",
                {
                  value: selectedPlanId,
                  onChange: (e) => setSelectedPlanId(e.target.value),
                  className: "appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white shadow-sm hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer",
                  children: STUDY_PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: p.id, children: p.label }, p.id))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline-block", children: "W\xE4hle deinen Studienplan, dann Monatsansicht einstellen." })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/50 p-1 shadow-inner", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setViewMode("multi"),
                className: `flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${viewMode === "multi" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm ring-1 ring-black/5" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "h-3.5 w-3.5" }),
                  "Alle Monate"
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setViewMode("single"),
                className: `flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${viewMode === "single" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm ring-1 ring-black/5" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }),
                  "Monatsfokus"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                onClick: () => setCurrentMonthIdx((i) => Math.max(0, i - 1)),
                className: "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors",
                disabled: currentMonthIdx === 0,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xs text-center min-w-[120px]", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-bold text-slate-900 dark:text-white", children: monthList[currentMonthIdx] ? monthList[currentMonthIdx].toLocaleDateString("de-DE", {
                month: "long",
                year: "numeric"
              }) : "-" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-[10px] text-slate-500 font-medium", children: [
                "Monat ",
                currentMonthIdx + 1,
                " von ",
                monthList.length
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                onClick: () => setCurrentMonthIdx(
                  (i) => Math.min(monthList.length - 1, i + 1)
                ),
                className: "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors",
                disabled: currentMonthIdx >= monthList.length - 1,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 items-start", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "Studienplan" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-xl font-black text-slate-900 dark:text-white", children: selectedPlan?.label || "Studienplan" }),
            selectedPlan?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: selectedPlan.description }),
            studyYears.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 flex flex-wrap gap-2", children: studyYears.map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "span",
              {
                className: "px-3 py-1 rounded-full text-[12px] font-semibold bg-slate-900 text-white dark:bg-slate-700",
                children: [
                  "Jahr ",
                  year
                ]
              },
              year
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-8 w-8 text-blue-600" })
        ] }),
        viewMode === "multi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-3", children: studyMonths.map((month) => {
          const hideBadges = month.getFullYear() === 2026 && month.getMonth() === 4;
          const days = getMonthDays(month);
          const label = month.toLocaleDateString("de-DE", {
            month: "short",
            year: "numeric"
          });
          const monthNumber = month.getMonth() + 1;
          const year = month.getFullYear();
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: "border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "px-4 py-3 bg-slate-900 text-white text-sm font-semibold flex items-center justify-between", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-baseline gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-bold", children: label }) }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "px-3 py-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-7 text-[10px] font-bold text-slate-500 uppercase mb-2", children: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(
                    (d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center", children: d }, d)
                  ) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-7 gap-1", children: [
                    Array.from({
                      length: (new Date(
                        month.getFullYear(),
                        month.getMonth(),
                        1
                      ).getDay() + 6) % 7
                    }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `pad-${i}`)),
                    days.map((d) => {
                      const iso = toISODate(d);
                      const status = statusMap.get(iso);
                      const dayPalette = status ? paletteColors[status] : null;
                      const dayEvents2 = eventsByDate.get(iso) || [];
                      const optionalCount = dayEvents2.filter(
                        (e) => !e.mandatory
                      ).length;
                      const mandatoryCount = dayEvents2.filter(
                        (e) => e.mandatory
                      ).length;
                      const hasEvent = dayEvents2.length > 0;
                      const isSelected = iso === selectedDate;
                      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "div",
                        {
                          onClick: () => setSelectedDate(iso),
                          className: `text-center text-[11px] font-semibold rounded-md px-1.5 py-1 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-sm transition ${dayPalette ? `${dayPalette.bg} ${dayPalette.text} ring-1 ${dayPalette.ring}` : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"} ${isSelected ? "ring-2 ring-blue-500 shadow-md" : hasEvent ? "ring-1 ring-blue-300/60" : ""}`,
                          title: `${dayPalette?.label || "Kein Eintrag"}${hasEvent ? " \xB7 " + dayEvents2.length + " Termin(e)" : ""}`,
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-center gap-1", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.getDate() }),
                              hasEvent && !hideBadges && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] font-bold text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-full", children: dayEvents2.length })
                            ] }),
                            hasEvent && !hideBadges && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-1 flex justify-center gap-1", children: [
                              dayEvents2.slice(0, 4).map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "span",
                                {
                                  title: `${ev.time} \xB7 ${ev.title}`,
                                  className: "h-2.5 w-2.5 rounded-full ring-2 ring-white/80 dark:ring-slate-900/80 shadow inline-block",
                                  style: {
                                    backgroundColor: ev.professorColor
                                  }
                                },
                                `dot-${iso}-${ev.id}`
                              )),
                              dayEvents2.length > 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[9px] font-bold text-slate-600 dark:text-slate-300", children: [
                                "+",
                                dayEvents2.length - 4
                              ] })
                            ] })
                          ]
                        },
                        iso
                      );
                    })
                  ] })
                ] })
              ]
            },
            month.toISOString()
          );
        }) }),
        viewMode === "single" && monthList[currentMonthIdx] && (() => {
          const activeMonth = monthList[currentMonthIdx];
          const monthLabel = activeMonth.toLocaleDateString("de-DE", {
            month: "long",
            year: "numeric"
          });
          const hideBadges = activeMonth.getFullYear() === 2026 && activeMonth.getMonth() === 4;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-3 mb-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400", children: "Monatsansicht" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-lg font-black text-slate-900 dark:text-white", children: monthLabel }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Mit den Pfeilen bl\xE4tterst du Monat f\xFCr Monat." })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300", children: monthLabel })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center justify-between mb-2 gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    onClick: () => setCurrentMonthIdx((i) => Math.max(0, i - 1)),
                    className: "inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-semibold",
                    disabled: currentMonthIdx === 0,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }),
                      "Zur\xFCck"
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    onClick: () => setCurrentMonthIdx(
                      (i) => Math.min(monthList.length - 1, i + 1)
                    ),
                    className: "inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-semibold",
                    disabled: currentMonthIdx >= monthList.length - 1,
                    children: [
                      "Weiter",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: [
                "Monat ",
                currentMonthIdx + 1,
                " / ",
                monthList.length,
                " \u2013 Monat/Jahr klar markiert"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "px-4 py-3 bg-slate-900 text-white text-sm font-semibold flex items-center justify-between", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: monthList[currentMonthIdx].toLocaleDateString(
                "de-DE",
                {
                  month: "long",
                  year: "numeric"
                }
              ) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "px-3 py-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-7 text-[10px] font-bold text-slate-500 uppercase mb-2", children: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(
                  (d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center", children: d }, d)
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-7 gap-1", children: [
                  Array.from({
                    length: (new Date(
                      monthList[currentMonthIdx].getFullYear(),
                      monthList[currentMonthIdx].getMonth(),
                      1
                    ).getDay() + 6) % 7
                  }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `pad-single-${i}`)),
                  getMonthDays(monthList[currentMonthIdx]).map((d) => {
                    const iso = toISODate(d);
                    const status = statusMap.get(iso);
                    const dayPalette = status ? paletteColors[status] : null;
                    const dayEvents2 = eventsByDate.get(iso) || [];
                    const optionalCount = dayEvents2.filter(
                      (e) => !e.mandatory
                    ).length;
                    const mandatoryCount = dayEvents2.filter(
                      (e) => e.mandatory
                    ).length;
                    const hasEvent = dayEvents2.length > 0;
                    const isSelected = iso === selectedDate;
                    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        onClick: () => setSelectedDate(iso),
                        className: `text-center text-[11px] font-semibold rounded-md px-2 py-2 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-sm transition ${dayPalette ? `${dayPalette.bg} ${dayPalette.text} ring-1 ${dayPalette.ring}` : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"} ${isSelected ? "ring-2 ring-blue-500 shadow-md" : hasEvent ? "ring-1 ring-blue-300/60" : ""}`,
                        title: `${dayPalette?.label || "Kein Eintrag"}${hasEvent ? " \xB7 " + dayEvents2.length + " Termin(e)" : ""}`,
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between gap-1", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.getDate() }),
                            hasEvent && !hideBadges && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[9px] font-bold text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-full", children: dayEvents2.length })
                          ] }),
                          hasEvent && !hideBadges && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-1 flex justify-start flex-wrap gap-1", children: [
                            dayEvents2.slice(0, 4).map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "span",
                              {
                                title: `${ev.time} \xB7 ${ev.title}`,
                                className: "h-2.5 w-2.5 rounded-full ring-2 ring-white/80 dark:ring-slate-900/80 shadow inline-block",
                                style: {
                                  backgroundColor: ev.professorColor
                                }
                              },
                              `dot-single-${iso}-${ev.id}`
                            )),
                            dayEvents2.length > 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-[9px] font-bold text-slate-600 dark:text-slate-300", children: [
                              "+",
                              dayEvents2.length - 4
                            ] })
                          ] }),
                          hasEvent && !hideBadges && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-2 space-x-1 text-[9px] font-bold", children: [
                            mandatoryCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100", children: [
                              mandatoryCount,
                              "\xB7Pflicht"
                            ] }),
                            optionalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "px-1 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-100", children: [
                              optionalCount,
                              "\xB7Optional"
                            ] })
                          ] })
                        ]
                      },
                      iso
                    );
                  })
                ] })
              ] })
            ] })
          ] });
        })(),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-6 border-t border-slate-200 dark:border-slate-700 pt-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400", children: "Legende" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Farben f\xFCr Praxis, Vorlesungen und Pr\xFCfungsphasen." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: () => setShowLegend((v) => !v),
                className: "inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    ChevronDown,
                    {
                      className: `h-4 w-4 transition-transform ${showLegend ? "rotate-180" : ""}`
                    }
                  ),
                  showLegend ? "Verbergen" : "Anzeigen"
                ]
              }
            )
          ] }),
          showLegend && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: Object.entries(paletteColors).map(([key, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: "flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40 shadow-sm",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "span",
                  {
                    className: `h-5 w-5 mt-0.5 rounded-full ring-2 ${val.bg} ${val.ring}`,
                    "aria-hidden": true
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: val.label }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Termine und Phasen schnell erkennbar." })
                ] })
              ]
            },
            key
          )) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 gap-4 sticky top-6", children: [
        nextMandatoryEvent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rounded-2xl border border-blue-100 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-900/30 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-[11px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-200", children: "N\xE4chste Vorlesung / Termin" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: [
            new Date(nextMandatoryEvent.date).toLocaleDateString(
              "de-DE",
              {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              }
            ),
            " ",
            "\xB7 ",
            nextMandatoryEvent.time
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center justify-between mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "Termine am gew\xE4hlten Tag" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-lg font-black text-slate-900 dark:text-white", children: new Date(selectedDate).toLocaleDateString("de-DE", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            }) })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 mt-3", children: [
            mandatoryDayEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300", children: "Pflichttermine" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: mandatoryDayEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
                      e.time
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400", children: "\u2022" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold", children: e.title })
                  ]
                },
                `mini-m-${e.id}`
              )) })
            ] }),
            optionalDayEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300", children: "Optionale Termine" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: optionalDayEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
                      e.time
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400", children: "\u2022" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold", children: e.title })
                  ]
                },
                `mini-o-${e.id}`
              )) })
            ] }),
            mandatoryDayEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex flex-col gap-2 bg-emerald-50 dark:bg-emerald-900/20",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "span",
                      {
                        className: "inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold",
                        style: {
                          backgroundColor: e.professorColor + "20",
                          color: e.professorColor
                        },
                        children: e.type
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-500", children: "\u2022" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.time }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-500", children: "\u2022" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.duration }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100", children: "In Pr\xE4senz" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-base font-black text-slate-900 dark:text-white", children: e.title }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-slate-700 dark:text-slate-300 space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-blue-600 dark:text-blue-300" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: e.time }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-500", children: "\xB7" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.duration })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-300" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: e.location })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "span",
                        {
                          className: "h-3 w-3 rounded-full",
                          style: { backgroundColor: e.professorColor }
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.professor })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700", children: e.zoom ? "Hybrid/Online" : "In Pr\xE4senz" }),
                      e.zoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "a",
                        {
                          href: e.zoom,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "inline-flex items-center gap-1 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }),
                            "Zoom-Link"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xs text-slate-500", children: [
                      "Vorlesungsreihe: ",
                      e.title.split(" ").join("_")
                    ] })
                  ] })
                ]
              },
              `card-m-${e.id}`
            )),
            optionalDayEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "border border-sky-100 dark:border-sky-800 rounded-xl p-4 flex flex-col gap-2 bg-sky-50 dark:bg-sky-900/20",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "span",
                      {
                        className: "inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold",
                        style: {
                          backgroundColor: e.professorColor + "20",
                          color: e.professorColor
                        },
                        children: e.type
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-500", children: "\u2022" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.time }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-500", children: "\u2022" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.duration }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-100", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3 w-3" }),
                      "Optional"
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-base font-black text-slate-900 dark:text-white", children: e.title }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-slate-700 dark:text-slate-300 space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-blue-600 dark:text-blue-300" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: e.time }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-500", children: "\xB7" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.duration })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-300" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: e.location })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "span",
                        {
                          className: "h-3 w-3 rounded-full",
                          style: { backgroundColor: e.professorColor }
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.professor })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700", children: e.zoom ? "Hybrid/Online" : "In Pr\xE4senz" }),
                      e.zoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "a",
                        {
                          href: e.zoom,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "inline-flex items-center gap-1 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }),
                            "Zoom-Link"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xs text-slate-500", children: [
                      "Vorlesungsreihe: ",
                      e.title.split(" ").join("_")
                    ] })
                  ] })
                ]
              },
              `card-o-${e.id}`
            )),
            dayEvents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Keine Termine f\xFCr diesen Tag hinterlegt." })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  CourseScheduleEnhanced as default,
  loader
};
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/calendar-days.js:
lucide-react/dist/esm/icons/chevron-down.js:
lucide-react/dist/esm/icons/chevron-left.js:
lucide-react/dist/esm/icons/chevron-right.js:
lucide-react/dist/esm/icons/clock.js:
lucide-react/dist/esm/icons/grid-3x3.js:
lucide-react/dist/esm/icons/info.js:
lucide-react/dist/esm/icons/map-pin.js:
lucide-react/dist/esm/icons/video.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/

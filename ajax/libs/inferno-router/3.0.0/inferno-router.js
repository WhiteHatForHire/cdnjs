
/*!
 * Inferno.Router v3.0.0
 * (c) 2017 Dominic Gannaway'
 * Released under the MIT License.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('inferno-create-element'), require('inferno-component'), require('inferno')) :
	typeof define === 'function' && define.amd ? define(['exports', 'inferno-create-element', 'inferno-component', 'inferno'], factory) :
	(factory((global.Inferno = global.Inferno || {}, global.Inferno.Router = global.Inferno.Router || {}),global.Inferno.createElement,global.Inferno.Component,global.Inferno));
}(this, (function (exports,createElement,Component,Inferno) { 'use strict';

createElement = 'default' in createElement ? createElement['default'] : createElement;
Component = 'default' in Component ? Component['default'] : Component;
var Inferno__default = 'default' in Inferno ? Inferno['default'] : Inferno;

// This should be boolean and not reference to window.document
var isBrowser = !!(typeof window !== 'undefined' && window.document);
function toArray(children) {
    return isArray(children) ? children : (children ? [children] : children);
}
// this is MUCH faster than .constructor === Array and instanceof Array
// in Node 7 and the later versions of V8, slower in older versions though
var isArray = Array.isArray;





function isString(o) {
    return typeof o === 'string';
}







function combineFrom(first, second) {
    var out = {};
    if (first) {
        for (var key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (var key$1 in second) {
            out[key$1] = second[key$1];
        }
    }
    return out;
}

var emptyObject = {};
function decode(val) {
    return typeof val !== 'string' ? val : decodeURIComponent(val);
}
function isEmpty(children) {
    return !children || !(isArray(children) ? children : Object.keys(children)).length;
}
function flatten(oldArray) {
    var newArray = [];
    flattenArray(oldArray, newArray);
    return newArray;
}
function getURLString(location) {
    return isString(location) ? location : (location.pathname + location.search);
}
/**
 * Maps a querystring to an object
 * Supports arrays and utf-8 characters
 * @param search
 * @returns {any}
 */
function mapSearchParams(search) {
    if (search === '') {
        return {};
    }
    // Create an object with no prototype
    var map = Object.create(null);
    var fragments = search.split('&');
    for (var i = 0, len = fragments.length; i < len; i++) {
        var fragment = fragments[i];
        var ref = fragment.split('=').map(mapFragment).map(decodeURIComponent);
        var k = ref[0];
        var v = ref[1];
        if (map[k]) {
            map[k] = isArray(map[k]) ? map[k] : [map[k]];
            map[k].push(v);
        }
        else {
            map[k] = v;
        }
    }
    return map;
}
/**
 * Gets the relevant part of the URL for matching
 * @param fullURL
 * @param partURL
 * @returns {string}
 */
function toPartialURL(fullURL, partURL) {
    if (fullURL.indexOf(partURL) === 0) {
        return fullURL.substr(partURL.length);
    }
    return fullURL;
}
/**
 * Simulates ... operator by returning first argument
 * with the keys in the second argument excluded
 * @param _args
 * @param excluded
 * @returns {{}}
 */
function rest(_args, excluded) {
    var t = {};
    for (var p in _args) {
        if (excluded.indexOf(p) < 0) {
            t[p] = _args[p];
        }
    }
    return t;
}
/**
 * Sorts an array according to its `path` prop length
 * @param a
 * @param b
 * @returns {number}
 */
function pathRankSort(a, b) {
    var aAttr = a.props || emptyObject;
    var bAttr = b.props || emptyObject;
    var diff = rank(bAttr.path) - rank(aAttr.path);
    return diff || ((bAttr.path && aAttr.path) ? (bAttr.path.length - aAttr.path.length) : 0);
}
/**
 * Helper function for parsing querystring arrays
 */
function mapFragment(p, isVal) {
    return decodeURIComponent(isVal | 0 ? p : p.replace('[]', ''));
}
function strip(url) {
    return url.replace(/(^\/+|\/+$)/g, '');
}
function rank(url) {
    if ( url === void 0 ) url = '';

    return (strip(url).match(/\/+/g) || '').length;
}
function flattenArray(oldArray, newArray) {
    for (var i = 0, len = oldArray.length; i < len; i++) {
        var item = oldArray[i];
        if (isArray(item)) {
            flattenArray(item, newArray);
        }
        else {
            newArray.push(item);
        }
    }
}

var resolvedPromise = Promise.resolve();
var Route = (function (Component$$1) {
    function Route(props, context) {
        var this$1 = this;

        Component$$1.call(this, props, context);
        this._onComponentResolved = function (error, component) {
            this$1.setState({
                asyncComponent: component
            });
        };
        this.state = {
            asyncComponent: null
        };
    }

    if ( Component$$1 ) Route.__proto__ = Component$$1;
    Route.prototype = Object.create( Component$$1 && Component$$1.prototype );
    Route.prototype.constructor = Route;
    Route.prototype.componentWillMount = function componentWillMount () {
        var this$1 = this;

        var ref = this.props;
        var onEnter = ref.onEnter;
        var ref$1 = this.context;
        var router = ref$1.router;
        if (onEnter) {
            resolvedPromise.then(function () {
                onEnter({ props: this$1.props, router: router });
            });
        }
        var ref$2 = this.props;
        var getComponent = ref$2.getComponent;
        if (getComponent) {
            resolvedPromise.then(function () {
                getComponent({ props: this$1.props, router: router }, this$1._onComponentResolved);
            });
        }
    };
    Route.prototype.onLeave = function onLeave (trigger) {
        if ( trigger === void 0 ) trigger = false;

        var ref = this.props;
        var onLeave = ref.onLeave;
        var ref$1 = this.context;
        var router = ref$1.router;
        if (onLeave && trigger) {
            onLeave({ props: this.props, router: router });
        }
    };
    Route.prototype.onEnter = function onEnter (nextProps) {
        var onEnter = nextProps.onEnter;
        var ref = this.context;
        var router = ref.router;
        if (this.props.path !== nextProps.path && onEnter) {
            onEnter({ props: nextProps, router: router });
        }
    };
    Route.prototype.getComponent = function getComponent (nextProps) {
        var getComponent = nextProps.getComponent;
        var ref = this.context;
        var router = ref.router;
        if (this.props.path !== nextProps.path && getComponent) {
            getComponent({ props: nextProps, router: router }, this._onComponentResolved);
        }
    };
    Route.prototype.componentWillUnmount = function componentWillUnmount () {
        this.onLeave(true);
    };
    Route.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        this.getComponent(nextProps);
        this.onEnter(nextProps);
        this.onLeave(this.props.path !== nextProps.path);
    };
    Route.prototype.render = function render (_args) {
        var component = _args.component;
        var children = _args.children;
        var props = rest(_args, ['component', 'children', 'path', 'getComponent']);
        var ref = this.state;
        var asyncComponent = ref.asyncComponent;
        var resolvedComponent = component || asyncComponent;
        if (!resolvedComponent) {
            return !isArray(children) ? children : null;
        }
        return createElement(resolvedComponent, props, children);
    };

    return Route;
}(Component));

/**
 * Helper function for parsing plain route configurations
 * based on react-router createRoutes handler.
 *
 * currently supported keys:
 * - path
 * - component
 * - childRoutes
 * - indexRoute
 *
 * Usage example:
 * const routes = createRoutes([
 *  {
 *    path        : '/',
 *    component   : App,
 *    indexRoute  : {
 *      component     : Home,
 *    },
 *    childRoutes : [
 *      {
 *        path : 'films/',
 *        component : Films,
 *        childRoutes : {
 *          path : 'detail/:id',
 *          component : FilmDetail,
 *        }
 *      },
 *      {
 *        path : '/*',
 *        component : NoMatch
 *      }
 *    ]
 *  }
 * ]);
 *
 * Usage on Router JSX
 * <Router history={browserHistory} children={routes} />
 */
var handleIndexRoute = function (indexRouteNode) { return createElement(Route, indexRouteNode); };
var handleChildRoute = function (childRouteNode) { return handleRouteNode(childRouteNode); };
var handleChildRoutes = function (childRouteNodes) { return childRouteNodes.map(handleChildRoute); };
function handleRouteNode(routeConfigNode) {
    if (routeConfigNode.indexRoute && !routeConfigNode.childRoutes) {
        return createElement(Route, routeConfigNode);
    }
    // create deep copy of config
    var node = {};
    for (var key in routeConfigNode) {
        node[key] = routeConfigNode[key];
    }
    node.children = [];
    // handle index route config
    if (node.indexRoute) {
        node.children.push(handleIndexRoute(node.indexRoute));
        delete node.indexRoute;
    }
    // handle child routes config
    if (node.childRoutes) {
        var nodes = isArray(node.childRoutes) ? node.childRoutes : [node.childRoutes];
        (ref = node.children).push.apply(ref, handleChildRoutes(nodes));
        delete node.childRoutes;
    }
    // cleanup to match native rendered result
    if (node.children.length === 1) {
        node.children = node.children[0];
    }
    if ((isArray(node.children) && node.children.length === 0) ||
        (!isArray(node.children) && Object.keys(node.children).length === 0)) {
        delete node.children;
    }
    return createElement(Route, node);
    var ref;
}
var createRoutes = function (routeConfig) { return routeConfig.map(handleRouteNode); };

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        { t[p] = s[p]; } }
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        { for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) { if (e.indexOf(p[i]) < 0)
            { t[p[i]] = s[p[i]]; } } }
    return t;
};
function Link(props, ref) {
    var router = ref.router;

    var activeClassName = props.activeClassName;
    var activeStyle = props.activeStyle;
    var className = props.className;
    var onClick = props.onClick;
    var children = props.children;
    var to = props.to;
    var otherProps = __rest(props, ["activeClassName", "activeStyle", "className", "onClick", "children", "to"]);
    otherProps.href = isBrowser ? router.createHref({ pathname: to }) : router.location.baseUrl ? router.location.baseUrl + to : to;
    var classNm;
    if (className) {
        classNm = className;
    }
    if (router.location.pathname === to) {
        if (activeClassName) {
            classNm = (className ? className + ' ' : '') + activeClassName;
        }
        if (activeStyle) {
            otherProps.style = combineFrom(props.style, activeStyle);
        }
    }
    otherProps.onclick = function navigate(e) {
        if (e.button !== 0 || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
            return;
        }
        e.preventDefault();
        if (typeof onClick === 'function') {
            onClick(e);
        }
        router.push(to, e.target.textContent);
    };
    return Inferno.createVNode(2 /* HtmlElement */, 'a', classNm, children, otherProps);
}

function IndexLink(props) {
    props.to = '/';
    return Inferno.createVNode(8 /* ComponentFunction */, Link, null, null, props);
}

var IndexRoute = (function (Route$$1) {
    function IndexRoute(props, context) {
        Route$$1.call(this, props, context);
        props.path = '/';
    }

    if ( Route$$1 ) IndexRoute.__proto__ = Route$$1;
    IndexRoute.prototype = Object.create( Route$$1 && Route$$1.prototype );
    IndexRoute.prototype.constructor = IndexRoute;

    return IndexRoute;
}(Route));

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$4 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index$2 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (index$4(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!index$4(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!index$4(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (index$4(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index$2.parse = parse_1;
index$2.compile = compile_1;
index$2.tokensToFunction = tokensToFunction_1;
index$2.tokensToRegExp = tokensToRegExp_1;

var index$1 = createCommonjsModule(function (module) {
/**
 * Expose `pathToRegexp` as ES6 module
 */
module.exports = index$2;
module.exports.parse = index$2.parse;
module.exports.compile = index$2.compile;
module.exports.tokensToFunction = index$2.tokensToFunction;
module.exports.tokensToRegExp = index$2.tokensToRegExp;
module.exports['default'] = module.exports;
});

var cache = new Map();
/**
 * Returns a node containing only the matched components
 * @param routes
 * @param currentURL
 * @returns {*}
 */
function match(routes, currentURL) {
    var location = getURLString(currentURL);
    return matchRoutes(toArray(routes), encodeURI(location), '/');
}
/**
 * Go through every route and create a new node
 * with the matched components
 * @param _routes
 * @param currentURL
 * @param parentPath
 * @param redirect
 * @returns {object}
 */
function matchRoutes(_routes, currentURL, parentPath, redirect) {
    if ( currentURL === void 0 ) currentURL = '/';
    if ( parentPath === void 0 ) parentPath = '/';
    if ( redirect === void 0 ) redirect = false;

    var routes = isArray(_routes) ? flatten(_routes) : toArray(_routes);
    var ref = currentURL.split('?');
    var pathToMatch = ref[0]; if ( pathToMatch === void 0 ) pathToMatch = '/';
    var search = ref[1]; if ( search === void 0 ) search = '';
    var params = mapSearchParams(search);
    routes.sort(pathRankSort);
    for (var i = 0, len = routes.length; i < len; i++) {
        var route = routes[i];
        var props = route.props || emptyObject;
        var routePath = props.from || props.path || '/';
        var location = parentPath + toPartialURL(routePath, parentPath).replace(/\/\//g, '/');
        var isLast = isEmpty(props.children);
        var matchBase = matchPath(isLast, location, pathToMatch);
        if (matchBase) {
            var children = props.children;
            if (props.from) {
                redirect = props.to;
            }
            if (children) {
                var matchChild = matchRoutes(children, currentURL, location, redirect);
                if (matchChild) {
                    if (matchChild.redirect) {
                        return {
                            location: location,
                            redirect: matchChild.redirect
                        };
                    }
                    children = matchChild.matched;
                    var childProps = children.props.params;
                    for (var key in childProps) {
                        params[key] = childProps[key];
                    }
                }
                else {
                    children = null;
                }
            }
            var matched = Inferno__default.cloneVNode(route, {
                params: combineFrom(params, matchBase.params),
                children: children
            });
            return {
                location: location,
                redirect: redirect,
                matched: matched
            };
        }
    }
}
/**
 * Converts path to a regex, if a match is found then we extract params from it
 * @param end
 * @param routePath
 * @param pathToMatch
 * @returns {any}
 */
function matchPath(end, routePath, pathToMatch) {
    var key = routePath + "|" + end;
    var regexp = cache.get(key);
    if (regexp === void 0) {
        var keys = [];
        regexp = { pattern: index$1(routePath, keys, { end: end }), keys: keys };
        cache.set(key, regexp);
    }
    var m = regexp.pattern.exec(pathToMatch);
    if (!m) {
        return null;
    }
    var path = m[0];
    var params = Object.create(null);
    for (var i = 1, len = m.length; i < len; i += 1) {
        params[regexp.keys[i - 1].name] = decode(m[i]);
    }
    return {
        path: path === '' ? '/' : path,
        params: params
    };
}

var Redirect = (function (Route$$1) {
    function Redirect(props, context) {
        Route$$1.call(this, props, context);
        if (!props.to) {
            props.to = '/';
        }
    }

    if ( Route$$1 ) Redirect.__proto__ = Route$$1;
    Redirect.prototype = Object.create( Route$$1 && Route$$1.prototype );
    Redirect.prototype.constructor = Redirect;

    return Redirect;
}(Route));

var RouterContext = (function (Component$$1) {
    function RouterContext(props, context) {
        Component$$1.call(this, props, context);
        {
            if (!props.location || !props.matched) {
                throw new TypeError('"inferno-router" requires a "location" and "matched" props passed');
            }
        }
    }

    if ( Component$$1 ) RouterContext.__proto__ = Component$$1;
    RouterContext.prototype = Object.create( Component$$1 && Component$$1.prototype );
    RouterContext.prototype.constructor = RouterContext;
    RouterContext.prototype.getChildContext = function getChildContext () {
        return {
            router: this.props.router || {
                location: {
                    baseUrl: this.props.baseUrl,
                    pathname: this.props.location
                }
            }
        };
    };
    RouterContext.prototype.render = function render (props) {
        return props.matched;
    };

    return RouterContext;
}(Component));

function createrRouter(history) {
    if (!history) {
        throw new TypeError('Inferno: Error "inferno-router" requires a history prop passed');
    }
    return {
        createHref: history.createHref,
        listen: history.listen,
        push: history.push,
        replace: history.replace,
        isActive: function isActive(url) {
            return matchPath(true, url, this.url);
        },
        get location() {
            return history.location.pathname !== 'blank' ? history.location : {
                pathname: '/',
                search: ''
            };
        },
        get url() {
            return this.location.pathname + this.location.search;
        }
    };
}
var Router = (function (Component$$1) {
    function Router(props, context) {
        Component$$1.call(this, props, context);
        this.router = createrRouter(props.history);
        this.state = {
            url: props.url || this.router.url
        };
    }

    if ( Component$$1 ) Router.__proto__ = Component$$1;
    Router.prototype = Object.create( Component$$1 && Component$$1.prototype );
    Router.prototype.constructor = Router;
    Router.prototype.componentWillMount = function componentWillMount () {
        var this$1 = this;

        if (this.router) {
            this.unlisten = this.router.listen(function () {
                this$1.routeTo(this$1.router.url);
            });
        }
    };
    Router.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        var this$1 = this;

        this.setState({ url: nextProps.url }, this.props.onUpdate ? function () { return this$1.props.onUpdate(); } : void 0);
    };
    Router.prototype.componentWillUnmount = function componentWillUnmount () {
        if (this.unlisten) {
            this.unlisten();
        }
    };
    Router.prototype.routeTo = function routeTo (url) {
        var this$1 = this;

        this.setState({ url: url }, this.props.onUpdate ? function () { return this$1.props.onUpdate(); } : void 0);
    };
    Router.prototype.render = function render (props) {
        var this$1 = this;

        var hit = match(props.children, this.state.url);
        if (hit.redirect) {
            setTimeout(function () {
                this$1.router.replace(hit.redirect);
            }, 0);
            return null;
        }
        return Inferno.createVNode(4 /* ComponentClass */, RouterContext, null, null, {
            location: this.state.url,
            matched: hit.matched,
            router: this.router
        });
    };

    return Router;
}(Component));

var index = {
    Route: Route,
    IndexRoute: IndexRoute,
    Redirect: Redirect,
    IndexRedirect: Redirect,
    Router: Router,
    RouterContext: RouterContext,
    Link: Link,
    IndexLink: IndexLink,
    match: match,
    createRoutes: createRoutes
};

exports.Route = Route;
exports.IndexRoute = IndexRoute;
exports.Redirect = Redirect;
exports.IndexRedirect = Redirect;
exports.Router = Router;
exports.RouterContext = RouterContext;
exports.Link = Link;
exports.IndexLink = IndexLink;
exports.match = match;
exports.createRoutes = createRoutes;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));

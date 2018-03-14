# GLFW for Node.js

GLFW 3 crossplatform addon with minimized dependencies.


## Install

```
npm i -s glfw-raub
```

Note: as this is a compiled addon, compilation tools must be in place on your system.
Such as MSVS13 for Windows, where **ADMIN PRIVELEGED** `npm i -g windows-build-tools`
most probably helps.


## Usage

This is a rather low level interface, where most of the stuff is directly reflecting
GLFW interfaces. Do not expect much. See [GLFW Docs](http://www.glfw.org/docs/latest/group__window.html)
for useful info on what it does and doesn't.

As per this lib, 3 entities are exported: GLFW itself, and Window and Document classes.

```js
const glfw = require('glfw-raub');
const { Window, Document } = glfw;
```

Here `glfw` is a low level interface container, where all `glfw*` functions are accessible as
`glfw.*`. E.g. `glfwSetWindowTitle` -> `glfw.setWindowTitle`.

`glfw.createWindow(w, h, emitter, title, display)` - this function differs from GLFW Docs
signature due to JS specifics. Here `emitter` is any object having **BOUND** `emit()` method.
It will be used to transmit GLFW events.

----------


### GLFW events:

* `'window_pos'` - window moved
* `'resize'` - window frame resized
* `'framebuffer_resize'` - render-surface resized
* `'drop'` - drag-dropped some files on the window
* `'quit'` - window closed
* `'refresh'` - window needs to be redrawn
* `'iconified'` - window was iconified
* `'focused'` - focus gained/lost
* `'keyup'` - keyboard key up
* `'keydown'` - keyboard key down
* `'keypress'` - keyboard key pressed
* `'mousemove'` - mouse moved
* `'mouseenter'` - mouse entered/left the window
* `'mousedown'` - mouse button down
* `'mouseup'` - mouse button up
* `'click'` - mouse button clicked
* `'mousewheel'` - mouse wheel rotation


### class Window

`Window` is higher level js-wrapper around the above functions, which helps in managing window
instances. It basically has all the functionality where in GLFW Docs `window` parameter
is mentioned. E.g. `glfwSetWindowTitle(window, title)` -> `window.title = title`.

There are few simple rules for the above transformation to become intuitive:

* API is available if it has `window` parameter.
* All props start lowercase.
* Word "Window" is omitted.
* Whatever could have a `get/set` interface is made so.


Constructor:

* `Window({ title, width, height, display, vsync, fullscreen, msaa })`
	* `string title $PWD` - window title, takes current directory as default.
	* `number width 800` - window initial width.
	* `number height 600` - window initial height.
	* `number display undefined` - display id to open window on a specific display.
	* `boolean vsync false` - if vsync should be used.
	* `boolean fullscreen false` - if fullscreen should be used.
	* `number msaa 2` - multisample antialiasing level.
	* `boolean decorated true` - if window has borders (use `false` for borderless fullscreen).


Properties:

* `get number handle` - window pointer.
* `get string version` - OpenGL vendor info.
* `get number platformWindow` - window HWND pointer.
* `get number platformContext` - OpenGL context handle.
* `get {width, height} framebufferSize` - the size of allocated framebuffer.
* `get number currentContext` - what GLFW window is now current.
* `get number samples` - number of msaa samples passed to the constructor.

* `get/set number width|w` - window width.
* `get/set number height|h` - window height.
* `get/set [width, height] wh` - window width and height.
* `get/set {width, height} size` - window width and height.
* `get/set string title` - window title.
* `get/set {width, height, Buffer data} icon` - window icon in RGBA format. Consider
using [this Image implementation](https://github.com/raub/node-image).
* `get/set boolean shouldClose` - if window is going to be closed.
* `get/set number x` - window position X-coordinate on the screen.
* `get/set number y` - window position Y-coordinate on the screen.
* `get/set {x, y} pos` - where window is on the screen.
* `get/set {x, y} cursorPos` - where mouse is relative to the window.

---

Methods:

* `getKey(number key)` - `glfw.getKey(window, key)`.
* `getMouseButton(number button)` - `glfw.getMouseButton(window, button)`.
* `getWindowAttrib(number attrib)` - `glfw.getWindowAttrib(window, attrib)`.
* `setInputMode(number mode)` - `glfw.setInputMode(window, mode)`.
* `swapBuffers()` - `glfw.swapBuffers(window)`.
* `makeCurrent()` - `glfw.makeContextCurrent(window)`.
* `destroy()` - `glfw.destroyWindow(window)`.
* `iconify()` - `glfw.iconifyWindow(window)`.
* `restore()` - `glfw.restoreWindow(window)`.
* `hide()` - `glfw.hideWindow(window)`.
* `show()` - `glfw.showWindow(window)`.
* `on(string type, function cb)` - listen for window (GLFW) events.


----------

### class Document

`Document` extends `Window` to provide an additional web-style compatibility layer.
As name suggests, objects of such class will mimic the behavior and properties of
your typical browser `window.document`. But also it is a `Window`, at the same time.
And it is incomplete at this point: you still have to provide an `Image` class of
your choice and WebGL context (implementation). Two static methods are designated
for this:

* static setImage(Image) - for example,
[this Image implementation](https://github.com/raub/node-image)
is designed to fit perfectly. Also sets `global.HTMLImageElement`.

* static setWebgl(webgl) - for example,
[this WebGL implementation](https://github.com/raub/node-webgl)
is designed to fit perfectly.


Properties:

* `get body` - returns `this`.
* `get ratio/devicePixelRatio` - device pixel ratio, most likely to be 1.
* `get/set innerWidth/clientWidth` - window width.
* `get/set innerHeight/clientHeight` - window height.
* `get/set onkeydown` - browser-style event listening.
* `get/set onkeyup` - browser-style event listening.
* `get style` - mimic web-element `style` property.
* `get context` - returns `Document.webgl`, set through `Document.setWebgl`.


Methods:

* `getContext()` - returns `Document.webgl`, set through `Document.setWebgl`.
* `getElementById(id)` - returns `this`.
* `getElementsByTagName(tag)` - if contains 'canvas', returns `this`, otherwise `null`.
* `createElementNS(_0, name)` - returns the result of `createElement(name)`.
* `createElement(name)` - for `'canvas'` returns `this`; for `'image'` returns
`new Document.Image`, set through `Document.setImage`.
* `dispatchEvent(event)` - invokes `emit(event.type, event)`.
* `addEventListener(name, callback)` - adds event listener.
* `removeEventListener(name, callback)` - removes event listener.
* `requestAnimationFrame(cb)` - **BOUND** `requestAnimationFrame` method.

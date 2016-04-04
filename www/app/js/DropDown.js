/**
 *  Contains the class for the DropDown menu.
 *
 *  @name   DropDown.js
 */

/**
 *  This is the DropDown class it determines what content is
 *  displayed in the menu.
 *
 *  @class   DropDown
 */
function DropDown() {

    var _this = this;

    this.dropDownId = null; //  The dropDownId of the DropDown element
    this.navigationId = null; //  The navigationId of the DropDown element
    this.state = false; //  True for open, false for closed
    this.speed = 600; //  Speed of DropDown animation
    this.history = [];
    /**
     *  Initializes the DropDown menu, should be run on load.
     *
     *  Examples:
     *
     *      var dropDown = new DropDown();
     *      ...
     *      dropDown.init({
     *          {String} dropDownId: The DropDown id of the DropDown element,
     *          {String} navigationId: The navigation menu id of the DropDown element
     *      });
     *
     *  @method  DropDown.init
     *  @param  {Object}    Object  The initialization object
     */
    this.init = function (obj) {
        console.log('--- Initializing dropdown with:', obj);

        // Set values
        _this.dropDownId = dVar(obj.dropDownId, '');
        _this.navigationId = dVar(obj.navigationId, '');
        _this.speed = dVar(obj.speed, 600);

        _this.panel.set.fxCatalog();
        // Close on external click
        $(document)
            .mouseup(function (e) {
                if ((!$(_this.dropDownId)
                        .is(e.target) &&
                        $(_this.dropDownId)
                        .has(e.target)
                        .length === 0) &&
                    (!$(_this.navigationId)
                        .is(e.target) && $(_this.navigationId)
                        .has(e.target)
                        .length === 0)) {
                    _this.dropdown.close();
                }
            });
    };

    //  Keeps track of panel state history
    this.stateHistory = {
        /**
         *  Adds a non duplicate state.
         *
         *  @method DropDown.stateHistory.push
         *  @param  {String}    State to add
         */
        push: function (view) {
            console.log(_this.history);

            if (_this.history[_this.history.length - 1] === view) {
                console.log('Not pushing dupplicate');
            } else {
                _this.history.push(view);
            }

            console.log(_this.history);
        },

        /**
         *  Gets last state, and removes it. Always leaves the first state.
         *
         *  @method DropDown.stateHistory.pop
         *  @return {String}    The last state
         */
        pop: function () {
            console.log(_this.history);

            if (_this.history.length === 1) {
                ret = 'INIT';
            } else {
                ret = _this.history.pop();
            }

            console.log(_this.history);

            return ret;
        },

        /**
         *  Gets current state.
         *
         *  @method DropDown.stateHistory.top
         *  @return {String}    The current state.
         */
        top: function () {
            var popped;

            console.log(_this.history);

            popped = _this.history.pop();
            _this.history.push(popped);

            console.log(_this.history);

            return popped;
        },
        /**
         *  Gets all the stored states, where the index corresponds to the order.
         *
         *  @method DropDown.stateHistory.top
         *  @return {Array.String}    Array of states.
         */
        all: function () {
            return _this.history;
        }
    };

    //  DropDown
    this.dropdown = {
        /**
         *  Opens the DropDown menu
         *
         *  @method   DropDown.open
         */
        open: function () {
            console.log('  Opening "dropdown"');
            $(_this.dropDownId)
                .slideDown(_this.speed);
            _this.state = true;

        },

        /**
         *  Closes the DropDown menu
         *
         *  @method   DropDown.close
         */
        close: function () {
            console.log('  Closing "dropdown"');
            $(_this.dropDownId)
                .slideUp(_this.speed);
            _this.state = false;
        },

        /**
         *  Toggles the DropDown
         *
         *  @method  DropDown.toggle
         */
        toggle: function () {
            if (_this.state) {
                _this.dropdown.close();
            } else {
                _this.dropdown.open();
            }
        }
    };

    // Panel actions
    this.panel = {
        // setters
        set: {
            /**
             *  Adds effects to the fx catalog
             *
             *  Examples:
             *
             *      var dropDown = new DropDown();
             *      ...
             *      dropDown.panel.set.fxCatalog();
             *
             *  @method     DropDown.panel.set.fxCatalog
             */
            fxCatalog: function () {
                console.log('dropdown.panel.set.fxCatalog');
                var container = _this.dropDownId + ' .fx-catalog-panel .content';

                _this.panel.load({
                        url: '/api/get/doc/fx-catalog'
                    }, function () {
                        //  Clear catalog
                        $(container)
                            .html('');
                    },
                    function (data) {
                        //  sort FX catalog by name
                        data.sort(function (a, b) {
                            if (a.title < b.title) {
                                return -1;
                            }
                            if (a.title > b.title) {
                                return 1;
                            }
                            return 0;
                        });

                        //  add items to catalog
                        data.forEach(function (item) {
                            var classes = 'col-xs-4 col-sm-3 col-md-2 col-lg-2';
                            var title = '<span class="fx-catalog-panel-item-title">' + item.title + '</span>';
                            var url = item.image ? item.image : '';
                            var image = '<img class="fx-catalog-panel-item-image" src="' + url + '"/>';

                            var htmlObj = '<div class="square-wrapper ' + classes + '"><div id="effect-item-' + item.title + '" class="square-inner fx-catalog-panel-item">' + image + title + '</div></div>';
                            //  Add Element
                            $(container)
                                .append(htmlObj);

                            //  Add Handler
                            $('#effect-item-' + item.title)
                                .on('click', function () {
                                    console.log('#effect-item-' + item.title + ' was clicked');
                                    console.log(item);
                                    _this.panel.set.information(item);
                                    _this.panel.display.toggle(true, '.information-panel');
                                })
                                .mouseover(function () {
                                    console.log('#effect-item-' + item.title + ' was hovered');

                                })
                                .mouseleave(function () {
                                    console.log('#effect-item-' + item.title + ' was left');
                                    //_this.panel.display.toggle(false, '.information-panel');
                                });

                        });
                    },
                    function () {
                        var html = 'There was a problem loading the FX-Catalog.';

                        $(container)
                            .html(html);
                    });
            },

            /**
             *  Adds mixes to the mix catalog
             *
             *  Examples:
             *
             *      var dropDown = new DropDown();
             *      ...
             *      dropDown.panel.set.mixCatalog([{
             *              {String} title = The title of an mixObj,
             *              {String} date  = The date of a mixObj creation,
             *              {String} image = The URL to the icon image of an mixObj
             *          },
             *          ...
             *      ]);
             *
             *  @method     DropDown.panel.set.mixCatalog
             *  @param      {Array.mixObj}      json   An array of mixObjects
             */
            mixCatalog: function (json) {
                console.log('dropdown.panel.set.mixCatalog');
                //sort mix catalog by name
                json.sort(function (a, b) {
                    if (a.date < b.date) {
                        return -1;
                    }
                    if (a.date > b.date) {
                        return 1;
                    }
                    return 0;
                });

                // add items to catalog
                json.forEach(function (item) {
                    var htmlObj = item;
                    $(_this.dropDownId + ' .mix-catalog-panel')
                        .append(htmlObj);
                });
            },

            /**
             *  Sets the account panel information
             *
             *  Examples:
             *
             *      var dropDown = new DropDown();
             *      ...
             *      dropDown.panel.set.account();
             *
             *  @method DropDown.panel.set.account
             */
            account: function () {
                _this.panel.load({
                    url: '/api/post/find-user/',
                    method: 'POST',
                    data: {
                        id: ts.user_id
                    }
                }, function () {
                    console.log('MIX', ts);
                }, function (data) {
                    $(_this.dropDownId + ' .account-user-name')
                        .html(data.name);
                    $(_this.dropDownId + ' .account-user-email')
                        .html(data.email);
                }, function (data) {
                    $(_this.dropDownId + ' .account-user-name')
                        .html('Unknown user name');
                    $(_this.dropDownId + ' .account-user-email')
                        .html('Unknown user email');
                });
            },

            api: function () {
                _this.panel.load({
                    url: '/api/get/help/'
                }, function () {
                    $('#api')
                        .html('');
                }, function (data) {
                    data.forEach(function (item) {
                        var opt, params, desc, url, pn, pd, po;
                        pn = pd = po = params = desc = '';

                        item.param.forEach(function (param) {
                            for (var key in param) {
                                pn = key;
                                pd = param[key].desc;
                                po = '';
                                po = param[key].opt.join(' | ');

                                item.url = item.url.replace(key, '<span class="api-url-param">' + key + '</span>');

                                params += '<div class="api-row-tabbed"><span class="api-item-param">' +
                                    pn + '</span><span class="api-item-param-description">' +
                                    pd + '</span></div>';
                                if (po) {
                                    params += '<div class="api-row-options"><span class="api-item-param-options">' + po + '</span></div>';
                                }
                            }
                        });

                        url = '<div class="api-row"><span class="api-item-url">' + item.url + '</span></div>';
                        desc = '<div class="api-row-tabbed"><span class="api-item">' + item.desc + '</span></div>';
                        html = '<div class="panel-entry row form-group col-md-12 col-sm-12 col-xs-12">' + url + params + desc + '</div>';

                        $('#api')
                            .append(html);
                    });
                }, function () {
                    console.log('api-failed');
                });
            },
            /**
             *  Adds selected item descriptions, titles, images, etc
             *
             *  Examples:
             *
             *      var dropDown = new DropDown();
             *      ...
             *      dropDown.panel.set.information({
             *          {String}    title:   The title of the information being displayed
             *          {URL}       image:   The URL of an image to display
             *          {String}    desc:    The description of the content being displayed
             *      });
             *
             *  @method DropDown.panel.set.information
             *  @param  {Object}    obj     The selected item information object
             */
            information: function (obj) {
                console.log('dropdown.panel.set.information', obj);
                $(_this.dropDownId + ' .information-panel .information-title')
                    .html(obj.title);
                $(_this.dropDownId + ' .information-panel .information-desc')
                    .html(obj.desc);
                //$(_this.dropDownId + ' .information-panel-actions').html(obj.actions);
            }
        },

        /**
         *  Loads information for panels and handles succesful returns and failures. It is
         *  A modification of the $.ajax function
         *
         *  @method DropDown.panel.load
         *  @param  {Object}    options     an $.ajax settings object
         *  @param  {Function}  pre         the function to run before the ajax call
         *  @param  {Function}  success     the function to call after a succesful ajax call
         *  @param  {Function}  fail        the function to call after a failed ajax call
         */
        load: function (options, pre, success, fail) {
            console.log('dropdown.panel.load');
            pre();

            $.ajax(options)
                .done(success)
                .fail(fail);
        },

        //  Display methods
        display: {
            /**
             *  Displays or hides a panel from view.
             *
             *  @method DropDown.panel.display.toggle
             *  @param  {Boolean}   state           The display state of a panel
             *  @param  {String}    toggleClass     The panel class to control
             */
            toggle: function (state, toggleclass) {
                console.log('  Toggling display of', toggleclass, 'to', state);
                if (state) {
                    $(_this.dropDownId + ' ' + toggleclass)
                        .addClass('display');
                } else {
                    $(_this.dropDownId + ' ' + toggleclass)
                        .removeClass('display');
                }
            },
            /**
             *  Modify the display state of all panels
             *
             *  @method DropDown.panel.display.all
             *  @param  {Boolean}   state           The state to place all panels
             */
            all: function (state) {
                _this.panel.display.left(state);
                _this.panel.display.right(state);
            },
            /**
             *  Modify the display state of all left side panels
             *
             *  @method DropDown.panel.display.left
             *  @param  {Boolean}   state           The state to place left side panels
             */
            left: function (state) {
                _this.panel.display.toggle(state, '.account-panel');
                _this.panel.display.toggle(state, '.login-panel');
                _this.panel.display.toggle(state, '.register-panel');
                _this.panel.display.toggle(state, '.information-panel');
            },
            /**
             *  Modify the display state of all right side panels
             *
             *  @method DropDown.panel.display.right
             *  @param  {Boolean}   state           The state to place right side panels
             */
            right: function (state) {
                _this.panel.display.toggle(state, '.fx-catalog-panel');
                _this.panel.display.toggle(state, '.mix-catalog-panel');
                _this.panel.display.toggle(state, '.about-panel');
                _this.panel.display.toggle(state, '.contact-panel');
                _this.panel.display.toggle(state, '.api-panel');
                _this.panel.display.toggle(state, '.tutorial-panel');
            }
        },

        //  Wait Screens
        wait: {
            /**
             *  Start a wait screen. {Currently disabled}
             *
             *  @method DropDown.panel.display.wait.start
             *  @param  {Enum}   position   LEFT|RIGHT|ALL The wait screen(s) to start displaying.
             */
            start: function (position) {
                console.log('dropdown.panel.wait.start');
                return;
                /*switch(position){
                    case 'LEFT':
                        _this.panel.display.left(false);
                        _this.panel.display.toggle(true, '.wait-left-panel' );
                        return;
                    case 'RIGHT':
                        _this.panel.display.right(false);
                        _this.panel.display.toggle(true, '.wait-right-panel' );
                        return;
                    case 'ALL':
                        _this.panel.display.all(false);
                        _this.panel.display.toggle(true, '.wait-right-panel' );
                        _this.panel.display.toggle(true, '.wait-left-panel' );
                        return;
                }*/
            },
            /**
             *  Stop a wait screen. {Currently disabled}
             *
             *  @method DropDown.panel.display.wait.start
             *  @param  {Enum}   position   LEFT|RIGHT|ALL The wait screen(s) to stop displaying.
             */
            stop: function (position) {
                console.log('dropdown.panel.wait.stop');
                return;
                /*switch(position){
                    case 'LEFT':
                        _this.panel.display.toggle(false, '.wait-left-panel' );
                        return;
                    case 'RIGHT':
                        _this.panel.display.toggle(false, '.wait-right-panel' );
                        return;
                    case 'ALL':
                        _this.panel.display.toggle(false, '.wait-right-panel' );
                        _this.panel.display.toggle(false, '.wait-left-panel' );
                        return;
                }*/
            }
        }

    };

    //  Navigation Bar
    this.navigation = {
        //  Display Methods
        display: {
            /**
             *  Toggle the display of a navbar element
             *
             *  @method DropDown.navigation.display.toggle
             *  @param  {Boolean}   state       The display state to place a navbar element in
             *  @param  {String}    toggleClass The class of the navbar element to modify
             */
            toggle: function (state, toggleclass) {
                var selector = _this.navigationId + ' .container .navbar-right-links ' + toggleclass;
                if (state) {
                    $(selector)
                        .addClass('display');
                } else {
                    $(selector)
                        .removeClass('display');
                }
            },
            /**
             *  Toggle the display of all navbar elements
             *
             *  @method DropDown.navigation.display.all
             *  @param  {Boolean}   state       The display state to place all navbar element in
             */
            all: function (state) {
                _this.navigation.display.secured(state);
                _this.navigation.display.unsecured(state);
            },
            /**
             *  Toggle the display of all secured view navbar elements
             *  This is the logged in state
             *
             *  @method DropDown.navigation.display.secured
             *  @param  {Boolean}   state       The display state to place all secured view navbar element in
             */
            secured: function (state) {
                console.log('  Toggling display of "auth" to', state);
                _this.navigation.display.toggle(state, '.link-sign-out');
            },
            /**
             *  Toggle the display of all unsecured view navbar elements
             *  This is the logged out state
             *
             *  @method DropDown.navigation.display.unsecured
             *  @param  {Boolean}   state       The display state to place all unsecured view navbar element in
             */
            unsecured: function (state) {
                console.log('  Toggling display of "anon" to', state);
                _this.navigation.display.toggle(state, '.link-sign-in');
                _this.navigation.display.toggle(state, '.link-register');
            },
            /**
             *  Toggle the Logged in view state
             *
             *  @method DropDown.navigation.display.lock
             *  @param  {Boolean}   state       The state of the secured view
             */
            lock: function (state) {
                _this.navigation.display.secured(state);
                _this.navigation.display.unsecured(!state);
            }
        }
    };

    /**
     *  Makes the views that the dropdown manages
     *
     *  @method DropDown.show
     *  @param  {String}  view    The view to display
     *  @param  {String}  opt     Options to pass the views
     */
    this.show = function (view, opt) {

        //  Setting default variables
        opt = dVar(opt, false);

        console.log('--- Showing view:', view);

        //  Handling the opening and closing of the dropdown
        if (view === 'TOGGLE') {
            this.dropdown.toggle();
            return;
        }

        this.panel.display.toggle(false, '.api-panel');

        //  Switching views
        switch (view) {
        case 'ALL':
            this.stateHistory.push(view);

            this.panel.display.all(true);
            this.dropdown.open();
            return;

        case 'INIT':
            this.stateHistory.push(view);

            this.panel.display.all(false);

            this.panel.display.toggle(true, '.register-panel');
            this.panel.display.toggle(true, '.login-panel');

            this.panel.display.toggle(true, '.tutorial-panel');
            this.panel.display.toggle(true, '.about-panel');
            return;

        case 'LOGGED_OUT':
            this.stateHistory.push(view);

            this.panel.display.all(false);

            this.panel.display.toggle(true, '.login-panel');

            this.panel.display.toggle(true, '.tutorial-panel');
            this.panel.display.toggle(true, '.about-panel');
            return;

        case 'FX':
            this.stateHistory.push(view);

            this.panel.display.all(false);

            this.panel.display.toggle(true, '.fx-catalog-panel');

            this.dropdown.open();
            return;

        case 'MIX':
            this.stateHistory.push(view);

            this.panel.display.all(false);

            this.panel.set.account();

            this.panel.display.toggle(true, '.account-panel');
            this.panel.display.toggle(true, '.mix-catalog-panel');
            this.panel.display.toggle(true, '.tutorial-panel');

            this.dropdown.open();
            return;

        case 'LOGIN':
            this.stateHistory.push(view);

            this.panel.display.left(false);
            this.panel.display.toggle(true, '.login-panel');
            this.dropdown.open();
            return;

        case 'REGISTER':
            this.stateHistory.push(view);

            this.panel.display.left(false);
            this.panel.display.toggle(true, '.register-panel');
            this.dropdown.open();
            return;

        case 'API':
            this.stateHistory.push(view);

            this.panel.display.toggle(true, '.api-panel');
            this.dropdown.open();
            return;

        case 'RESET':
            this.panel.display.all(false);

            this.show(this.stateHistory.top());
            return;

        case 'BACK':
            this.stateHistory.pop();
            this.show(this.stateHistory.pop());
            return;
        }
    };
}
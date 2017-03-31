if ("undefined" == typeof jQuery) throw new Error("Human Components requires jQuery"); + function(t) {
    var e = function(e, n) {
        if ("undefined" == typeof HumanAPI) throw new Error("Anatomy Scanner Component requires the HumanAPI");
        if (this.$widget = t(e), this.$scanEls = t("[data-scantext]").filter("[data-target=" + e.id + "]"), this.config = n, this.initAPI(), n.focus) {
            var i = "click.human.anatomy-scanner.focus-" + e.id,
                o = "[data-target=" + e.id + "] [data-id]";
            this.bindFocus(i, o)
        }
    };
    e.DEFAULTS = {
        formatData: {
            prefix: "<em>",
            suffix: "</em>"
        },
        focus: {
            prefix: function(t) {
                return '<button class="anatomy-object" data-id="' + t + '">'
            },
            suffix: "</button>"
        },
        toStrip: /^left\s|right\s/i
    }, e.prototype.initAPI = function() {
        var e = this;
        this._human = new HumanAPI({
            iframeId: this.$widget[0].id,
            showLog: !1,
            humanLog: !1
        }), this._human.send("scene.info", function(o) {
            var a = n(o.objects, e.config.toStrip);
            e.formattedObjects = i(a), e.$scanEls.each(function() {
                var n = t(this),
                    i = e.scanText(n.html());
                n.html(i)
            })
        })
    }, e.prototype.bindFocus = function(e, n) {
        var i = this;
        t(document).off(e).on(e, n, function(e) {
            var n = t(this).attr("data-id");
            i._human.send("focus.focusObject", {
                objectId: n,
                flyTo: "object",
                select: !0,
                replace: !0,
                showLabel: !0
            }), i._human.send("scene.enableXray")
        })
    }, e.prototype.scanText = function(t) {
        for (var e, n, i = /<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>|[^\s<]+/gi, a = t.match(i), r = this.config.formatData, s = a, h = 0, u = [], c = [], f = 0; f < a.length; f++) c.push(o(a[f]));
        for (var f = 0; f < c.length; f++) h > 0 ? h-- : (u = c.slice(f), u[0][0].length >= 3 && (n = this.lookForMatch(u), n && (h = n.wordLength - 1, e = "function" == typeof r.prefix ? r.prefix(n.objectId) : r.prefix, s[f] = e + s[f], s[f + h] += r.suffix)));
        return s.join(" ")
    }, e.prototype.lookForMatch = function(t) {
        for (var e, n = 0, i = t[n][0], o = this.formattedObjects, a = !1;
             "undefined" != typeof o[i] && (o = o[i], o._id && (a = o._id), e = t[n][1], n++, !e && n < t.length);) i = t[n][0];
        var r = !!a && {
                objectId: a,
                wordLength: n
            };
        return r
    };
    var n = function(t, e) {
            var n, i = {};
            for (var o in t) t.hasOwnProperty(o) && (n = t[o], n.shown && (i[o] = n.name.replace(e, "")));
            return i
        },
        i = function(t) {
            var e, n, i, o = {};
            for (var a in t)
                if (t.hasOwnProperty(a)) {
                    for (n = t[a], i = n.toLowerCase().split(" "), e = o; i.length > 0;) {
                        var r = i.shift();
                        "undefined" == typeof e[r] && (e[r] = {}), e = e[r]
                    }
                    e._id = a
                }
            return o
        },
        o = function(t) {
            var e, n, i;
            return e = t.replace(/^[^a-zA-Z0-9]/, "").toLowerCase(), n = e.replace(/[\?!'"\*\-\.,:;\)]+$/g, ""), i = e !== n, [n, i]
        };
    t.fn.scanner = function(n) {
        return this.each(function() {
            var i = t(this),
                o = i.data("human.anatomy-scanner");
            if (i.is("iframe")) {
                var a = t.extend({}, e.DEFAULTS, n, "object" == typeof n && "focus" === n.formatData && {
                        formatData: e.DEFAULTS.focus,
                        focus: !0
                    });
                o || i.data("human.anatomy-scanner", new e(this, a))
            }
        })
    }
}(jQuery), + function(t) {
    var e = function(e) {
            this.$el = t(e), this.$widget = this.$el.find("iframe"), this.open = !1, this._curOffset = {}, this.$widget.css({
                width: (this.$widget.attr("width") || n.width) + "px",
                height: (this.$widget.attr("height") || n.height) + "px"
            }), this.$el.on("click", ".close-btn", t.proxy(this.hide, this)), this.$el.on("human.popup.hide", t.proxy(this.hide, this))
        },
        n = {
            location: "right",
            width: 300,
            height: 300,
            offsets: {
                top: {
                    left: -15,
                    top: -20
                },
                right: {
                    left: 35,
                    top: 30
                },
                bottom: {
                    left: -15,
                    top: 35
                },
                left: {
                    left: -20,
                    top: 30
                }
            }
        };
    e.prototype.toggle = function(t) {
        if (t.is(this.$curTrigger)) {
            var e = this.open ? "hide" : "show";
            this[e](t)
        } else this.show(t);
        this.$curTrigger = t
    }, e.prototype.show = function(e) {
        t(".human-popup").trigger("human.popup.hide"), t(document).on("click.human.popup.hide", t.proxy(function(e) {
            var n = t(e.target),
                i = "popup" === n.attr("data-trigger"),
                o = 1 === n.closest(".human-popup").length;
            i || o || this.$el.trigger("human.popup.hide")
        }, this)), this.open = !0;
        var n = i(e.attr("data-location"));
        this.$el.removeClass("top left bottom right").addClass(n + " popup-open");
        var o = {
            top: e[0].offsetTop,
            left: e[0].offsetLeft
        };
        this.decidePlacement(n, o), t(window).on("resize.human.popup", t.proxy(function(t) {
            this.decidePlacement(n, o)
        }, this))
    }, e.prototype.hide = function() {
        t(document).off("click.human.popup.hide"), t(window).off("resize.human.popup"), this.open = !1, this.$el.removeClass("popup-open")
    }, e.prototype.decidePlacement = function(t, e) {
        if (this._curOffset.top !== e.top || this._curOffset.left !== e.left) {
            this._curOffset = e;
            var i = this.$el[0].offsetWidth,
                o = this.$el[0].offsetHeight,
                a = n.offsets[t],
                r = {};
            switch (t) {
                case "top":
                    r = {
                        top: e.top - o + a.top,
                        left: e.left + a.left
                    };
                    break;
                case "bottom":
                    r = {
                        top: e.top + a.top,
                        left: e.left + a.left
                    };
                    break;
                case "left":
                    r = {
                        top: e.top - o + a.top,
                        left: e.left - i + a.left
                    };
                    break;
                default:
                    r = {
                        top: e.top - o + a.top,
                        left: e.left + a.left
                    }
            }
            var s = {
                top: Math.round(r.top) + "px",
                left: Math.round(r.left) + "px"
            };
            this.$el.css(s)
        }
    };
    var i = function(t) {
        return /^(top|right|bottom|left)$/.test(t) ? t : n.location
    };
    t(document).on("click.human.popup", '[data-trigger="popup"]', function(n) {
        var i = t(this),
            o = t("#" + i.attr("data-target"));
        if (o.hasClass("human-popup")) {
            var a = o.data("human.popup");
            a || o.data("human.popup", a = new e(o[0])), a.toggle(i)
        }
    })
}(jQuery), + function(t) {
    var e, n = function(e) {
        if ("undefined" == typeof HumanAPI) throw new Error("Tour Component requires the HumanAPI");
        this.$element = t(e), this.$widget = this.$element.find("iframe"), this.activeIndex = 0, this.initAPI()
    };
    n.prototype.initAPI = function() {
        var t = this,
            e = this.$element[0].id + "-embedded";
        this.$widget[0].id = e, this._human = new HumanAPI({
            iframeId: e,
            showLog: !1,
            humanLog: !1
        }), this._human.on("moduleActivated", function(e) {
            if (e.tags.indexOf("tour") > -1) {
                var n = "<h1>" + e.displayName + "</h1>";
                t.$element.find(".tour-header").append(n)
            }
        }), this._human.send("timeline.info", function(e) {
            t.chapters = e.chapters, t.buildChapters(), t.bindAPIHandlers()
        }), this.bindHandlers()
    }, n.prototype.buildChapters = function() {
        var e, n = "",
            i = '<div class="nav-container"><ul class="chapters-list"></ul></div>';
        t.each(this.chapters, function(t, i) {
            e = "<li>" + (t + 1) + "</li>", n += e
        }), this.$element.find(".tour-content").append(i);
        var o = this.$element.find(".chapters-list").html(n);
        this.$chapters = o.children()
    }, n.prototype.bindHandlers = function() {
        var t = this;
        this.$element.on("click.dismiss.human.tour", function(e) {
            e.target === e.currentTarget && t.hide()
        }), this.$element.find(".close-btn").on("click", function() {
            t.$element.trigger("click.dismiss.human.tour")
        })
    }, n.prototype.bindAPIHandlers = function() {
        var t = this,
            e = function() {
                t.$chapters.removeClass("active").eq(t.activeIndex).addClass("active")
            };
        e(this.chapters[this.activeIndex]), this._human.on("chapterActivated", function(n) {
            t.activeIndex = t.chapters.indexOf(n), e()
        }), this.$element.on("click", ".chapters-list li", function(n) {
            var i = t.activeIndex = t.$chapters.index(this),
                o = t.chapters[i];
            t._human.send("timeline.set", {
                chapterId: o
            }), e()
        })
    }, n.prototype.show = function() {
        e.addClass("tour-open"), this.$element.addClass("open"), t(document.body).append('<div class="human-tour-backdrop"></div>')
    }, n.prototype.hide = function() {
        e.removeClass("tour-open"), this.$element.removeClass("open"), t(".human-tour-backdrop").remove()
    }, t(document).on("click.human.tour", '[data-trigger="tour"]', function(i) {
        if (!e.hasClass("tour-open")) {
            var o = t("#" + t(this).attr("data-target"));
            if (o.hasClass("human-tour")) {
                var a = o.data("human.tour");
                a || o.data("human.tour", a = new n(o[0])), a.show()
            }
        }
    }), t(function() {
        e = t(document.body)
    })
}(jQuery);
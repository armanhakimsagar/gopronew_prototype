!(function() {
    var t = L.Marker.prototype._setPos;
    L.Marker.include({
        _updateImg: function(t, o, i) {
            o = L.point(i).divideBy(2)._subtract(L.point(o));
            var n = "";
            (n += " translate(" + -o.x + "px, " + -o.y + "px)"),
            (n += " rotate(" + this.options.iconAngle + "deg)"),
            (n += " translate(" + o.x + "px, " + o.y + "px)"),
            (t.style[L.DomUtil.TRANSFORM] += n),
            (t.style[L.DomUtil.TRANSFORM + "Origin"] = "50% 50%");
        },
        _getShortestEndDegree: function(t, o) {
            var i = Math.abs(o - t),
                n = o - t >= 0;
            if (180 >= i) return o;
            var s = t + (360 - i) * (n ? -1 : 1);
            return s;
        },
        setIconAngle: function(t) {
            (this.options.iconAngle = this._getShortestEndDegree(this.options.iconAngle || 0, t)), this._map && this.update();
        },
        _setPos: function(o) {
            if ((this._icon && (this._icon.style[L.DomUtil.TRANSFORM] = ""), this._shadow && (this._shadow.style[L.DomUtil.TRANSFORM] = ""), t.apply(this, [o]), this.options.iconAngle)) {
                var i,
                    n = new L.Icon.Default(),
                    s = this.options.icon.options.iconAnchor || n.options.iconAnchor,
                    e = this.options.icon.options.iconSize || n.options.iconSize;
                this._icon && ((i = this._icon), this._updateImg(i, s, e)),
                    this._shadow && (this.options.icon.options.shadowAnchor && (s = this.options.icon.options.shadowAnchor), (e = this.options.icon.options.shadowSize), (i = this._shadow), this._updateImg(i, s, e));
            }
        },
    });
})();
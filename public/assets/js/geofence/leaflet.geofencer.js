var GeofencingMap = function(a) { this.mapId = a, this.map = this.init() };
GeofencingMap.prototype = {
    init: function() {
        var a = "";
        a = "http://{s}.tiles.mapbox.com/v3/piratefsh.jl6ae25j/{z}/{x}/{y}.png";
        var b = "OpenStreetMap contributors",
            c = new L.TileLayer(a, { zoom: 9, maxZoom: 17, attribution: b }),
            d = new L.map(this.mapId, { contextmenu: !0 });
        return d.setView(new L.LatLng(23.8103, 90.4125), 6), d.addLayer(c), this.map = d, d
    }
};
var MultiPolygon = function(a, b) {
    this._map = a, this.zone_name = b, this._polygons = new Array, this._curr_polygon = -1, this.allow_dragging = !1, this._map.on("click", function(a) {
        var b = this._polygons[this._curr_polygon];
        b && !b.isSolid() && this._polygons[this._curr_polygon].createMarker(a.latlng)
    }, this)
};
MultiPolygon.prototype = {
    getMap: function() { return this.map },
    getPolygons: function() { return this._polygons },
    addPolygon: function(a, b, pk = null) {
        if (!(this._polygons[this._curr_polygon] && this._polygons[this._curr_polygon].getNumVertices() < 1)) {
            var c = new Polygon(this._map, "Area - " + parseInt(this._polygons.length + 1));
            for (var d in a) c.createMarker(a[d]);
            b && c.closeShape(), c.setOnPolygonCreate(this.create_polygons_callback), c.setAllowDragging(this.allow_dragging), this._polygons.push(c), this._curr_polygon = this._polygons.length - 1
        }
    },
    getPolygonCoordinates: function() {
        var a = new Array;
        for (var b in this._polygons) {
            var c = this._polygons[b];
            c.isSolid() && a.push(c.getCoordinates())
        }
        return a
    },
    deleteAllPolygons: function() {
        for (var a in this._polygons) this._polygons[a].clearAll();
        this._polygons = new Array
    },
    createNewPolygon: function() { this.addPolygon(), this._curr_polygon = this._polygons.length - 1 },
    setCreatePolygonsCallback: function(a) {
        this.create_polygons_callback = a;
        var b = this.getPolygons();
        for (var c in b) {
            var d = b[c];
            d.setOnPolygonCreate(a)
        }
    },
    setEditable: function(a) { this.allow_dragging = a; for (var b in this._polygons) this._polygons[b].setEditable(a) },
    setAllowDragging: function(a) { this.allow_dragging = a; for (var b in this._polygons) this._polygons[b].setAllowDragging(a) },
    selfIntersectingPolygons: function() { var a = new Array; for (var b in this._polygons) this._polygons[b].selfIntersects() && a.push(this._polygons[b]); return a }
};
var img_dir = "http://piratefsh.github.io/leaflet.geofencer/dist/images/",
    Polygon = function(a, b) { this.zone_name = b, this.id_counter = 0, this.map = a, this._markers = new Array, this._layers = (new L.LayerGroup).addTo(this.map), this.drag = !1, this.drag_end = !1, this.override_map_click = !1, this.shapeClosed = !1, this.polygon_layer = null, this.allow_dragging = !1, this.icon = { vertex: L.icon({ iconUrl: img_dir + "vertex.png", iconSize: [15, 15] }), active: L.icon({ iconUrl: img_dir + "vertex-active.png", iconSize: [18, 18] }), inactive: L.icon({ iconUrl: img_dir + "vertex-inactive.png", iconSize: [15, 15] }) }, this._setVertexCursor(!0) };
Polygon.prototype = {
    getNumVertices: function() { return this._markers.length / 2 },
    setName: function(a) { this.zone_name = a, this.popup && this.popup.setContent(a) },
    panToPolygon: function() { this.polygon_layer && this.map.fitBounds(this.polygon_layer.getBounds()) },
    clearAll: function() {
        var a = this.polygon_layer ? this.map.removeLayer(this.polygon_layer) : null;
        for (a = this.line_layer ? this.map.removeLayer(this.line_layer) : null, this._layers.clearLayers(); this._markers.length > 0;) this._markers.pop();
        this.map.closePopup(), this.shapeClosed = !1, this.override_map_click = !1
    },
    getCoordinates: function() { var a, b = new Array; for (var c in this._markers) a = this._markers[c], a.isActive() && b.push(a.getLatLng()); return b },
    isSolid: function() { return this.shapeClosed },
    enoughPointsToBeSolid: function() { return this.isSolid() ? this._markers.length / 2 >= 3 : this._markers.length >= 3 },
    isTriangle: function() { return this._markers.length / 2 == 3 },
    onChange: function(a) { this.polygon_layer.on("change", a) },
    buildMarker: function(a, b) {
        var c = this.zone_name + "_marker_" + this.id_counter++,
            d = new L.marker(a, { icon: this.icon[b], draggable: !0, contextmenu: !0, contextmenuItems: [{ text: "Delete", index: 0, callback: function() { this.deleteMarker(d) }, context: this }] });
        d._leaflet_id = c, d.type = b, d.on("dragstart", this.onMarkerDragStart, this), d.on("dragend", this.onMarkerDragEnd, this), d.on("mouseover", this.onMarkerMouseOver, this), d.on("mouseout", this.onMarkerMouseOut, this), d.on("drag", this.onMarkerDrag, this), d.on("click", this.onMarkerClick, this), d.isActive = function() { return "inactive" != d.type };
        var e = "<span>{{coords}}<span>";
        return e = e.replace(/{{coords}}/g, a.lat + "," + a.lng), d.bindPopup(e), d
    },
    buildMidpointMarker: function(a, b) { if (!a || !b) return null; var c, d, e; return c = (a.lat + b.lat) / 2, d = (a.lng + b.lng) / 2, e = L.latLng(c, d), this.buildMarker(e, "inactive") },
    addMarkerToLayer: function(a) { a.addTo(this._layers), this._markers.push(a) },
    equalMarkers: function(a, b) { var c, d; return a && b && (c = a.getLatLng(), d = b.getLatLng(), c && d) ? c.equals(d) : !1 },
    createMarker: function(a, b) {
        b || (b = "vertex");
        var c = this.buildMarker(a, b);
        this.addMarkerToLayer(c), this.updateMidpoints(), this._markers.length > 1 && this.updateShapes()
    },
    deleteMarker: function(a) {
        if (a.isActive() && !this.isTriangle() && this._markers.length > 0) {
            for (var a = a, b = a._leaflet_id, c = 0; c < this._markers.length; c++)
                if (this._markers[c]._leaflet_id == b) { this._markers.splice(c, 1); break }
            this.enoughPointsToBeSolid() || (this.shapeClosed = !1), this._layers.removeLayer(a), this.updateMidpoints(), this.updateShapes()
        }
    },
    updateMarkerType: function(a, b) { a.type = b, a.icon = this.icon[b], a.isActive() && (a.contextmenu = !0) },
    deleteMidpoints: function() {
        this._layers.eachLayer(function(a) {
            if (a.isActive());
            else { this._layers.removeLayer(a); { this._markers.splice(this._markers.indexOf(a), 1) } }
        }, this)
    },
    updateMidpoints: function() {
        if (this.deleteMidpoints(), this.isSolid() && !(this._markers.length < 2)) {
            for (var a, b, c, d, e, f, g = new Array, h = 0; h < this._markers.length; h++)
                if (c = this._markers[h], a ? (b = a.getLatLng(), d = c.getLatLng(), e = this.buildMidpointMarker(b, d), g.push(e)) : (a = c, f = c), g.push(c), a = c, h == this._markers.length - 1 && f && c) {
                    var i = this.buildMidpointMarker(c.getLatLng(), f.getLatLng());
                    g.push(i)
                }
            this._layers.clearLayers(), this._markers = new Array;
            for (var h in g) this.addMarkerToLayer(g[h]);
            this.createPolygon()
        }
    },
    onMarkerDragStart: function(a) { this.updateMarkerType(a.target, "vertex"), this.deleteMidpoints(), this.drag = !0 },
    onMarkerDragEnd: function() { this.drag = !1, this.override_map_click = !0, this.drag_end = !0, this.updateMidpoints() },
    onMarkerMouseOver: function(a) { a.target.setIcon(this.icon.active) },
    onMarkerMouseOut: function(a) { a.target.setIcon(this.icon[a.target.type]) },
    onMarkerDrag: function(a) {
        if (this._markers.length > 1)
            for (var b = a.target._leaflet_id, c = a.target.getLatLng(), d = 0; d < this._markers.length; d++)
                if (this._markers[d]._leaflet_id == b) { this._markers[d].setLatLng(c), this.updateShapes(); break }
    },
    onMarkerClick: function(a) { this.equalMarkers(this._markers[0], a.target) && this.closeShape() },
    createLine: function() {
        var a, b = new Array;
        for (var c in this._markers) a = this._markers[c], a.isActive && b.push(a.getLatLng());
        null != this.line_layer && this.map.removeLayer(this.line_layer), this.line_layer = new L.Polyline(b, { color: "#810541" }), this.map.addLayer(this.line_layer)
    },
    createPolygon: function() {
        for (var a, b = new Array, c = 0; c < this._markers.length; c++) a = this._markers[c].getLatLng(), b.push(a);
        null != this.polygon_layer && this.map.removeLayer(this.polygon_layer), this.polygon_layer = new L.Polygon(b, {
            color: "#810541",
            fillColor: "#D462FF",
            fillOpacity: .5,
            contextmenu: !0,
            contextmenuItems: [{
                text: "Save Area",
                index: 0,
                callback: function() {
                    $("#geofence_id").val(this.zone_id);
                    $("#geofence_name").val(this.zone_name);
                    var coordinate_box = this.line_layer._latlngs.toString().replace('LatLng', '');
                    coordinate_box = coordinate_box.replace(',LatLng', ',');
                    var arr = "";
                    for (var i = 0; i < this.line_layer._latlngs.length; i++) {
                        arr += this.line_layer._latlngs[i].lat + "," + this.line_layer._latlngs[i].lng ;
                        if (i < this.line_layer._latlngs.length - 1) {
                            arr += ",";
                        }
                    }
                    //console.log(arr);
                    $("#geofence_coordinates").html(arr);
                    $("#add_modal").modal('show');
                },
                context: this
            }, {
                text: "Delete Area",
                index: 1,
                callback: function() { /* this.clearAll() */
                    $("#remove_item").val(this.zone_id);
                    $("#remove_modal").modal('show');
                },
                context: this
            }]
        }), this.item_id = this.zone_name.trim(), this.polygon_layer.dragging = new L.Handler.PolyDrag(this.polygon_layer), this.map.addLayer(this.polygon_layer), this.polygon_layer.on("click", this.onPolygonClick, this), this.polygon_layer.on("dragstart", this.onPolygonDragStart, this), this.polygon_layer.on("dragend", this.onPolygonDragEnd, this), this.allow_dragging && this.polygon_layer.dragging.enable(), this.create_polygon_callback && this.create_polygon_callback(this)
    },
    setAllowDragging: function(a) { this.allow_dragging = a, this.polygon_layer && (a ? this.polygon_layer.dragging.enable() : this.polygon_layer.dragging.disable()) },
    openPopup: function() {
        if (this.polygon_layer) {
            var a = this.polygon_layer.getBounds().getCenter();
            this.popup = L.popup().setLatLng(a).setContent(this.zone_name).openOn(this.map)
        }
    },
    updateShapes: function() { this.isSolid() ? (this.map.removeLayer(this.line_layer), this.updatePolygon()) : (this.polygon_layer && this.map.removeLayer(this.polygon_layer), this.createLine()) },
    updatePolygon: function() { this.createPolygon() },
    updateMarkers: function(a) { if (null != this._layers) { for (var b, c = a.target._latlngs, d = new Array, e = 0; e < c.length; e++) b = this._markers[e], b._latlng = c[e], d.push(b); for (this._layers.clearLayers(); d.length > 0;) b = d.pop(), b.addTo(this._layers) } },
    closeShape: function() { this.enoughPointsToBeSolid() && (this._setVertexCursor(!1), this.shapeClosed = !0, this.updateMidpoints(), this.updateShapes()) },
    setOnPolygonCreate: function(a) { this.create_polygon_callback = a },
    onPolygonClick: function() {
        this.openPopup();
        console.log(this);
    },
    onPolygonDragStart: function() { this._layers && this._layers.clearLayers(), this.drag = !0 },
    onPolygonDragEnd: function(a) { this.updateMarkers(a), this.drag = !1, this.override_map_click = !0 },
    _setVertexCursor: function(a) { a ? $(".geofencer-map").css("cursor", "url(" + img_dir + "vertex-cursor.png) 7 7, auto") : $(".geofencer-map").css("cursor", "") },
    _thisToJTS: function() {
        for (var a = new Array, b = this.getCoordinates(), c = 0; c < b.length; c++) {
            var d = b[c];
            a.push(new jsts.geom.Coordinate(d.lat, d.lng))
        }
        return a.push(new jsts.geom.Coordinate(b[0].lat, b[0].lng)), a
    },
    selfIntersects: function() {
        var a = this._thisToJTS(),
            b = new jsts.geom.GeometryFactory,
            c = b.createLinearRing(a),
            d = b.createPolygon(c),
            e = new jsts.operation.IsSimpleOp(d);
        if (e.isSimpleLinearGeometry(d)) return !1;
        var f = new Array,
            g = new jsts.geomgraph.GeometryGraph(0, d),
            h = new jsts.operation.valid.ConsistentAreaTester(g),
            i = h.isNodeConsistentArea();
        if (!i) {
            var j = h.getInvalidPoint();
            f.push([j.x, j.y])
        }
        return f.length > 0
    },
    setEditable: function(a) { this.setAllowDragging(a), a ? this.map.addLayer(this._layers) : this.map.removeLayer(this._layers) }
};
define(function(require, exports, module) {
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (b, a) {
            window.setTimeout(b, 1000 / 60)
        }
    })();
    //mod对象
    var MSP = function (K) {
        var n = "css/img/A.png";
        var A = {
            skinURL: n,
            capeURL: null,
            distance: 35,
            canvasWidth: 300,
            canvasHeight: 500,
            container: []
        };
        $.extend(A, K);
        var B = new Image();
        var ae = new Image();
        var t = false; //初始化选择
        var ao = false; //初始化动作
        var M = false;
        var W = false; //初始化奔跑
        B.src = A.skinURL;
        if (A.capeURL) {
            ae.src = A.capeURL
        }
        var m = !!window.WebGLRenderingContext && (!!window.document.createElement("canvas").getContext("experimental-webgl") || !!window.document.createElement("canvas").getContext("webgl"));
        var U = $(A.container);
        var E = A.canvasWidth,
            R = A.canvasHeight;
        var p = 1 / 64;
        var q = 1 / 32;
        var am = window.document.createElement("canvas");
        var T = am.getContext("2d");
        var l = 8;
        var j = window.document.createElement("canvas");
        var x = j.getContext("2d");
        var f = window.document.createElement("canvas");
        var aa = f.getContext("2d");
        var Z = function (i, at) {
            if (m) {
                var au = new THREE.MeshLambertMaterial({
                    map: new THREE.Texture(i, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter, (at ? THREE.RGBAFormat : THREE.RGBFormat)),
                    transparent: at,
                    ambient: 16777215
                })
            } else {
                var au = new THREE.MeshBasicMaterial({
                    map: new THREE.Texture(i, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter, (at ? THREE.RGBAFormat : THREE.RGBFormat)),
                    transparent: at
                })
            }
            au.map.needsUpdate = true;
            return au
        };
        var ar = function (aB, ax, az, ay, aA, aw, au) {
            if (!au) {
                au = 0
            }
            var av = aB.geometry.faceVertexUvs[0][ax];
            var at = az;
            var i = ay;
            av[(0 + au) % 4].u = at * p;
            av[(0 + au) % 4].v = i * q;
            av[(1 + au) % 4].u = at * p;
            av[(1 + au) % 4].v = i * q + aw * q;
            av[(2 + au) % 4].u = at * p + aA * p;
            av[(2 + au) % 4].v = i * q + aw * q;
            av[(3 + au) % 4].u = at * p + aA * p;
            av[(3 + au) % 4].v = i * q
        };
        var af = function (ax, aw) {
            var au = new THREE.Object3D();
            var at = [];
            for (var av = 0; av < 6; av++) {
                var ay = new THREE.Mesh(new THREE.PlaneGeometry(ax, ax), aw);
                ay.doubleSided = true;
                au.add(ay);
                at.push(ay)
            }
            at[0].rotation.x = Math.PI / 2;
            at[0].rotation.z = -Math.PI / 2;
            at[0].position.x = ax / 2;
            at[1].rotation.x = Math.PI / 2;
            at[1].rotation.z = Math.PI / 2;
            at[1].position.x = -ax / 2;
            at[2].position.y = ax / 2;
            at[3].rotation.y = Math.PI;
            at[3].rotation.z = Math.PI;
            at[3].position.y = -ax / 2;
            at[4].rotation.x = Math.PI / 2;
            at[4].position.z = ax / 2;
            at[5].rotation.x = -Math.PI / 2;
            at[5].rotation.y = Math.PI;
            at[5].position.z = -ax / 2;
            return au
        };
        var ag = Z(j, false);
        var N = Z(j, true);
        var w = Z(f, false);
        var y = new THREE.PerspectiveCamera(A.distance, E / R, 1, 1000);
        y.position.z = 50;
        var J = new THREE.Scene();
        J.add(y);
        var ad = new THREE.DirectionalLight(16777215, 1);
        var ab = new THREE.DirectionalLight(6710886, 1);
        var H = new THREE.AmbientLight(5592405);
        ad.position.set(100, 120, 80);
        ab.position.set(-100, -40, -80);
        J.add(ad);
        J.add(ab);
        J.add(H);
        var F = new THREE.Object3D();
        var v = new THREE.Object3D();
        var c = new THREE.CubeGeometry(4, 12, 4);
        for (var ak = 0; ak < 8; ak += 1) {
            c.vertices[ak].y -= 6
        }
        var Q = new THREE.Mesh(c, ag);
        Q.position.z = -2;
        Q.position.y = -6;
        ar(Q, 0, 8, 20, -4, 12);
        ar(Q, 1, 16, 20, -4, 12);
        ar(Q, 2, 4, 16, 4, 4, 3);
        ar(Q, 3, 8, 20, 4, -4, 1);
        ar(Q, 4, 12, 20, -4, 12);
        ar(Q, 5, 4, 20, -4, 12);
        var o = new THREE.CubeGeometry(4, 12, 4);
        for (var ak = 0; ak < 8; ak += 1) {
            o.vertices[ak].y -= 6
        }
        var aq = new THREE.Mesh(o, ag);
        aq.position.z = 2;
        aq.position.y = -6;
        ar(aq, 0, 4, 20, 4, 12);
        ar(aq, 1, 12, 20, 4, 12);
        ar(aq, 2, 8, 16, -4, 4, 3);
        ar(aq, 3, 12, 20, -4, -4, 1);
        ar(aq, 4, 0, 20, 4, 12);
        ar(aq, 5, 8, 20, 4, 12);
        var ac = new THREE.CubeGeometry(4, 12, 8);
        var aj = new THREE.Mesh(ac, ag);
        ar(aj, 0, 20, 20, 8, 12);
        ar(aj, 1, 32, 20, 8, 12);
        ar(aj, 2, 20, 16, 8, 4, 1);
        ar(aj, 3, 28, 16, 8, 4, 3);
        ar(aj, 4, 16, 20, 4, 12);
        ar(aj, 5, 28, 20, 4, 12);
        v.add(aj);
        var s = new THREE.CubeGeometry(4, 12, 4);
        for (var ak = 0; ak < 8; ak += 1) {
            s.vertices[ak].y -= 4
        }
        var L = new THREE.Mesh(s, ag);
        L.position.z = -6;
        L.position.y = 4;
        L.rotation.x = Math.PI / 32;
        ar(L, 0, 48, 20, -4, 12);
        ar(L, 1, 56, 20, -4, 12);
        ar(L, 2, 48, 16, -4, 4, 1);
        ar(L, 3, 52, 16, -4, 4, 3);
        ar(L, 4, 52, 20, -4, 12);
        ar(L, 5, 44, 20, -4, 12);
        v.add(L);
        var D = new THREE.CubeGeometry(4, 12, 4);
        for (var ak = 0; ak < 8; ak += 1) {
            D.vertices[ak].y -= 4
        }
        var al = new THREE.Mesh(D, ag);
        al.position.z = 6;
        al.position.y = 4;
        al.rotation.x = -Math.PI / 32;
        ar(al, 0, 44, 20, 4, 12);
        ar(al, 1, 52, 20, 4, 12);
        ar(al, 2, 44, 16, 4, 4, 1);
        ar(al, 3, 48, 16, 4, 4, 3);
        ar(al, 4, 40, 20, 4, 12);
        ar(al, 5, 48, 20, 4, 12);
        v.add(al);
        var ai = new THREE.CubeGeometry(8, 8, 8);
        var I = new THREE.Mesh(ai, ag);
        I.position.y = 2;
        ar(I, 0, 8, 8, 8, 8);
        ar(I, 1, 24, 8, 8, 8);
        ar(I, 2, 8, 0, 8, 8, 1);
        ar(I, 3, 16, 0, 8, 8, 1);
        ar(I, 4, 0, 8, 8, 8);
        ar(I, 5, 16, 8, 8, 8);
        F.add(I);
        var P = af(9, N);
        P.position.y = 2;
        ar(P.children[0], 0, 32 + 8, 8, 8, 8);
        ar(P.children[1], 0, 32 + 24, 8, 8, 8);
        ar(P.children[2], 0, 32 + 8, 0, 8, 8, 1);
        ar(P.children[3], 0, 32 + 16, 0, 8, 8, 1);
        ar(P.children[4], 0, 32 + 0, 8, 8, 8);
        ar(P.children[5], 0, 32 + 16, 8, 8, 8);
        F.add(P);
        F.position.y = 8;
        var C = new THREE.Object3D();
        var d = new THREE.CubeGeometry(1, 16, 10);
        var O = new THREE.Mesh(d, w);
        O.position.y = -8;
        O.visible = false;
        ar(O, 0, 1, 1, 10, 16);
        ar(O, 1, 12, 1, 10, 16);
        ar(O, 2, 1, 0, 10, 1);
        ar(O, 3, 11, 0, 10, 1, 1);
        ar(O, 4, 0, 1, 1, 16);
        ar(O, 5, 11, 1, 1, 16);
        C.rotation.y = Math.PI;
        C.position.x = -2;
        C.position.y = 6;
        C.add(O);
        var b = new THREE.Object3D();
        b.add(Q);
        b.add(aq);
        b.add(v);
        b.add(F);
        b.add(C);
        b.position.y = 6;
        var z = new THREE.Object3D();
        z.add(b);
        J.add(z);
        var Y = 0;
        var X = 0.1;
        var ap = 0;
        var an = 0;
        var g = -140;
        var ah = false;
        var r = false;
        var e = 0;
        var u = true;
        var S = function () {
            requestAnimFrame(S, V.domElement);
            var i = g;
            var at = (Date.now() - h) / 1000;
            if (!r) {
                if (!M) {
                    X *= 0.97
                }
                if (t) {
                    g += 2
                }
            } else {
                g = Y
            }
            if (X > 500) {
                X = 500
            } else {
                if (X < -500) {
                    X = -500
                }
            }
            y.position.x = -Math.cos(g / (E / 2) + (Math.PI / 0.9));
            y.position.z = -Math.sin(g / (E / 2) + (Math.PI / 0.9));
            y.position.y = (X / (R / 2)) * 1.5 + 0.2;
            y.position.setLength(65);
            y.lookAt(new THREE.Vector3(0, -1.5, 0));
            if (!ao) {
                e += 0.01;
                F.rotation.y = Math.sin(at * 1.5) / 5;
                F.rotation.z = Math.sin(at) / 6;
                if (W) {
                    al.rotation.z = 2 * Math.cos(0.6662 * at * 10 + Math.PI);
                    al.rotation.x = 1 * (Math.cos(0.2812 * at * 10) - 1);
                    L.rotation.z = 2 * Math.cos(0.6662 * at * 10);
                    L.rotation.x = 1 * (Math.cos(0.2312 * at * 10) + 1);
                    aq.rotation.z = 1.4 * Math.cos(0.6662 * at * 10);
                    Q.rotation.z = 1.4 * Math.cos(0.6662 * at * 10 + Math.PI);
                    z.position.y = -6 + 1 * Math.cos(0.6662 * at * 10 * 2);
                    z.position.z = 0.15 * Math.cos(0.6662 * at * 10);
                    z.rotation.x = 0.01 * Math.cos(0.6662 * at * 10 + Math.PI);
                    C.rotation.z = 0.1 * Math.sin(0.6662 * at * 10 * 2) + Math.PI / 2.5
                } else {
                    L.rotation.z = -Math.sin(at * 3) / 2;
                    L.rotation.x = (Math.cos(at * 3) + Math.PI / 2) / 30;
                    al.rotation.z = Math.sin(at * 3) / 2;
                    al.rotation.x = -(Math.cos(at * 3) + Math.PI / 2) / 30;
                    Q.rotation.z = Math.sin(at * 3) / 3;
                    aq.rotation.z = -Math.sin(at * 3) / 3;
                    C.rotation.z = Math.sin(at * 2) / 15 + Math.PI / 15;
                    z.position.y = -6
                }
            }
            if (typeof wia === "undefined") {
                wia = 0
            }
            V.clear();
            V.render(J, y)
        };
        if (m) {
            var V = new THREE.WebGLRenderer({
                precision: 'mediump',
                antialias: true,
                preserveDrawingBuffer: true
            })
        } else {
            var V = new THREE.CanvasRenderer({
                antialias: true,
                preserveDrawingBuffer: true
            })
        }
        var k = V.domElement;
        V.setSize(E, R);
        U.append(k);
        var a = function (i) {
            if (r) {
                Y = (i.pageX - k.offsetLeft - ap);
                X = (i.pageY - k.offsetTop - an)
            }
        };
        k.addEventListener("mousedown", function (i) {
            i.preventDefault();
            if (i.which != 1) {
                return false
            }
            ap = (i.pageX - k.offsetLeft) - g;
            an = (i.pageY - k.offsetTop) - X;
            r = true;
            ah = true;
            a(i)
        }, false);
        window.addEventListener("mouseup", function (i) {
            r = false
        }, false);
        window.addEventListener("mousemove", a, false);
        k.addEventListener("mouseout", function (i) {
            ah = false
        }, false);
        var h = Date.now(),
            G = 0;
        S();
        B.onload = function () {
            j.width = B.width;
            j.height = B.height;
            x.clearRect(0, 0, 64, 32);
            x.drawImage(B, 0, 0);
            var at = x.getImageData(0, 0, 64, 32);
            var aA = at.data;
            T.clearRect(0, 0, B.width * l, B.height * l);
            T.save();
            var ax = true;
            var aw = [40, 0];
            var az = (aw[0] + aw[1] * 64) * 4;
            var ay = function (i, aB) {
                if (aA[(i + aB * 64) * 4 + 0] !== aA[az + 0] || aA[(i + aB * 64) * 4 + 1] !== aA[az + 1] || aA[(i + aB * 64) * 4 + 2] !== aA[az + 2] || aA[(i + aB * 64) * 4 + 3] !== aA[az + 3]) {
                    return true
                }
                return false
            };
            for (var av = 32; av < 64; av += 1) {
                for (var au = 8; au < 16; au += 1) {
                    if (ay(av, au)) {
                        ax = false;
                        break
                    }
                }
                if (!ax) {
                    break
                }
            }
            if (!ax) {
                for (var av = 40; av < 56; av += 1) {
                    for (var au = 0; au < 8; au += 1) {
                        if (ay(av, au)) {
                            ax = false;
                            break
                        }
                    }
                    if (!ax) {
                        break
                    }
                }
            }
            for (var av = 0; av < 64; av += 1) {
                for (var au = 0; au < 32; au += 1) {
                    if (ax && ((av >= 32 && av < 64 && au >= 8 && au < 16) || (av >= 40 && av < 56 && au >= 0 && au < 8))) {
                        aA[(av + au * 64) * 4 + 3] = 0
                    }
                    T.fillStyle = "rgba(" + aA[(av + au * 64) * 4 + 0] + ", " + aA[(av + au * 64) * 4 + 1] + ", " + aA[(av + au * 64) * 4 + 2] + ", " + aA[(av + au * 64) * 4 + 3] / 255 + ")";
                    T.fillRect(av * l, au * l, l, l)
                }
            }
            T.restore();
            x.putImageData(at, 0, 0);
            ag.map.needsUpdate = true;
            N.map.needsUpdate = true
        };
        B.onerror = function () {
            B.src = n
        };
        ae.onload = function () {
            f.width = ae.width;
            f.height = ae.height;
            aa.clearRect(0, 0, 64, 32);
            aa.drawImage(ae, 0, 0);
            O.visible = true;
            w.map.needsUpdate = true
        };
        ae.onerror = function () {
            O.visible = false
        };
        k.addEventListener("dragenter", function (i) {
            i.stopPropagation();
            i.preventDefault();
            k.className = "dragenter"
        }, false);
        k.addEventListener("dragleave", function (i) {
            i.stopPropagation();
            i.preventDefault();
            k.className = ""
        }, false);
        k.addEventListener("dragover", function (i) {
            i.stopPropagation();
            i.preventDefault()
        }, false);
        //设置参数
        this.setPara = function (i) {
            if (i) {
                if (typeof i.skinURL !== "undefined" && i.skinURL != B.src) {
                    B.src = i.skinURL
                }
                if (typeof i.capeURL !== "undefined" && i.capeURL != ae.src) {
                    ae.src = i.capeURL
                }
                if (typeof i.isShowingCape !== "undefined" && i.isShowingCape != O.visible) {
                    O.visible = i.isShowingCape
                }
                if (typeof i.isRotating !== "undefined" && i.isRotating != t) {
                    t = i.isRotating
                }
                if (typeof i.isPaused !== "undefined" && i.isPaused != ao) {
                    ao = i.isPaused;
                    if (ao) {
                        G = Date.now() - h
                    } else {
                        h = Date.now() - G
                    }
                }
                if (typeof i.isYfreezed !== "undefined" && i.isYfreezed != M) {
                    M = i.isYfreezed
                }
                if (typeof i.isRunning !== "undefined" && i.isRunning != W) {
                    W = i.isRunning
                }
            }
            return {
                skinURL: B.src,
                capeURL: ae.src,
                isShowingCape: O.visible,
                isRotating: t,
                isPaused: ao,
                isYfreezed: M,
                isRunning: W
            }
        };
        //重置mod的初始位置
        this.resetPos = function (i) {
            g = -140;
            X = 0;
            return this
        };
        //导出base64格式的png
        this.shot = function () {
            return V.domElement.toDataURL("image/png")
        };
        return this
    }
    return MSP;
});

// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @noframes
// ==/UserScript==

import html2canvas from "./html2canvas";
(function () {
  "use strict";

  // Your code here...
  // alert("Starting");
  // var html2canvasScript=document.createElement('script')
  // html2canvasScript.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"
  // document.head.append(html2canvasScript);
  var allButtons = document.querySelectorAll("button");
  var allLinks = document.querySelectorAll("a");
  const isRunning = () => {
    if (localStorage.getItem("running") == "true") return true;
    else false;
  };
  var ctime = 0;
  const timer = () => {
    setTimeout(() => {
      ctime = ctime + 1000;
      timer();
    }, 1000);
  };
  timer();

  // Making Monitoring Button
  var monitorbtn = document.createElement("div");
  monitorbtn.style.width = "50px";
  monitorbtn.style.height = "50px";
  monitorbtn.style.borderRadius = "50%";
  monitorbtn.style.position = "fixed";
  monitorbtn.style.backgroundColor = isRunning() ? "red" : "greenyellow";
  monitorbtn.style.zIndex = 1000000;
  monitorbtn.style.bottom = "20px";
  monitorbtn.style.right = "20px";
  document.body.appendChild(monitorbtn);

  // Adding Event Listner to The Monitoring Button
  monitorbtn.addEventListener("click", (ev) => {
    if (isRunning()) {
      console.log(JSON.parse(localStorage.getItem("data")));
      localStorage.setItem("running", "false");

      // ######### FOR SENDING DATA TO API #############

      // fetch('HereGoesTheApiLink', {
      //     method: 'POST',
      //     headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({data:localStorage.getItem('data')})
      // })
      // .then(response => response.json())
      // .then(response => console.log(JSON.stringify(response)))
    } else {
      localStorage.setItem("running", "true");
      localStorage.setItem("data", JSON.stringify([]));
    }
    monitorbtn.style.backgroundColor = isRunning() ? "red" : "greenyellow";

    ev.stopPropagation();
  });

  async function snapImage(x1, y1, x2, y2, e) {
    // console.log(x1, x2, y1, y2);
    var image = html2canvas(document.body).then(function (canvas) {
      // calc the size -- but no larger than the html2canvas size!
      var width = Math.min(canvas.width, Math.abs(x2 - x1));
      var height = Math.min(canvas.height, Math.abs(y2 - y1));
      // create a new avatarCanvas with the specified size
      var avatarCanvas = document.createElement("canvas");
      avatarCanvas.width = width;
      avatarCanvas.height = height;
      avatarCanvas.id = "avatarCanvas";
      // put avatarCanvas into document body
      // document.body.appendChild(avatarCanvas);
      // use the clipping version of drawImage to draw
      // a clipped portion of html2canvas's canvas onto avatarCanvas
      var avatarCtx = avatarCanvas.getContext("2d");
      avatarCtx.drawImage(canvas, x1, y1, width, height, 0, 0, width, height);
      // console.log(avatarCanvas.toDataURL())
      return avatarCanvas.toDataURL();
    });
    return image;
  }

  const addressClick = async (ev) => {
    // console.log("Click",ev.offsetX,ev.offsetY,ev);
    let x = ev.pageX,
      y = ev.pageY;
    var text = prompt("Type the Annotation");

    var annotation = document.createElement("div");
    annotation.innerHTML = text;
    annotation.style.backgroundColor = "rgb(248, 90, 90)";
    annotation.style.minHeight = "100px";
    annotation.style.minWidth = "100px";
    annotation.style.maxWidth = "200px";
    annotation.style.borderRadius = "50% 50% 0% 50%";
    annotation.style.padding = "35px";
    annotation.style.position = "absolute";
    annotation.style.transform = "translate(-100%, -100%)";
    annotation.style.top = y + "px";
    annotation.style.left = x + "px";
    // console.log(annotation);
    document.body.appendChild(annotation);

    var data = JSON.parse(localStorage.getItem("data"));
    let image = await snapImage(x - 400, y - 300, x + 400, y + 300);
    annotation.remove();

    data.push({
      addr: ev.view.location.href,
      action: "click",
      time: Date.now(),
      x,
      y,
      snapshot: image,
    });
    localStorage.setItem("data", JSON.stringify(data));
  };

  const onscroll = (ev) => {
    // console.log("Scroll",ev);
    var data = JSON.parse(localStorage.getItem("data"));
    data.push({
      addr: ev.target.location.href,
      action: "scroll",
      scrollTop: document.documentElement.scrollTop,
      time: Date.now(),
      timeStamp: ev.timeStamp,
    });
    localStorage.setItem("data", JSON.stringify(data));
  };

  const buttonClick = (ev) => {
    // console.log(ev.srcElement.type,ev)
    var data = JSON.parse(localStorage.getItem("data"));
    data.push({
      addr: ev.view.location.href,
      action: "buttonClick",
      type: ev.srcElement.type,
      time: Date.now(),
      timeStamp: ev.timeStamp,
    });
    localStorage.setItem("data", JSON.stringify(data));
    ev.stopPropagation();
  };

  const linkClick = (ev) => {
    // console.log(ev)
    var data = JSON.parse(localStorage.getItem("data"));

    data.push({
      addr: ev.view.location.href,
      action: "linkClick",
      time: Date.now(),
      href: ev.srcElement.href,
    });
    localStorage.setItem("data", JSON.stringify(data));
    ev.stopPropagation();
  };

  document.addEventListener("click", (ev) => {
    if (isRunning()) addressClick(ev);
  });

  document.addEventListener("scroll", (ev) => {
    onscroll(ev);
    // console.log(ev);
  });

  allButtons.forEach((e) => {
    e.addEventListener("click", (ev) => {
      buttonClick(ev);
    });
  });

  allLinks.forEach((e) => {
    e.addEventListener("click", (ev) => {
      linkClick(ev);
    });
  });
})();

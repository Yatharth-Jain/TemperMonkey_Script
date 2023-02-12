// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // alert("Starting");
    var allButtons=document.querySelectorAll("button")
    var allLinks=document.querySelectorAll("a")
    var window=document


    var clicks=[]
    var scrolls=[]
    var buttonClicks={}
    var linkClicks=[]

    const tabTime = Date.now();

    var ctime=0;
    const timer=()=>{
        setTimeout(()=>{
            ctime=ctime+1000;
            timer();
        },1000)
    }
    timer()

    var monitorbtn=document.createElement('div')

    monitorbtn.style.width='50px';
    monitorbtn.style.height='50px';
    monitorbtn.style.borderRadius='50%';
    monitorbtn.style.position='fixed';
    monitorbtn.style.backgroundColor=localStorage.getItem('running')=="true"?'red':'greenyellow';
    monitorbtn.style.zIndex=1000000;
    monitorbtn.style.bottom='20px';
    monitorbtn.style.right='20px';

    document.body.appendChild(monitorbtn)


    monitorbtn.addEventListener('click',(ev)=>{
        if(localStorage.getItem('running')=='true'){
            console.log(JSON.parse(localStorage.getItem('data')))
            localStorage.setItem('running','false')

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

        }
        else{
            localStorage.setItem('running','true')
            localStorage.setItem('data',JSON.stringify([]))
        }
        monitorbtn.style.backgroundColor=localStorage.getItem('running')=="true"?'red':'greenyellow';

        ev.stopPropagation();
        
    })

    const addressClick = (ev) => {
        // console.log("Click",ev.offsetX,ev.offsetY,ev);
        var data=JSON.parse(localStorage.getItem('data'))
        data.push({
            addr:ev.view.location.href,
            action:"click",
            time:Date.now(),
            x:ev.offsetX,
            y:ev.offsetY,
        })
        localStorage.setItem('data',JSON.stringify(data))
    };
    const onscroll=(ev)=>{
        // console.log("Scroll",ev);        
        var data=JSON.parse(localStorage.getItem('data'))
        data.push({
            addr:ev.target.location.href,
            action:"scroll",
            time:Date.now(),
            timeStamp:ev.timeStamp,            
        })
        localStorage.setItem('data',JSON.stringify(data))
    };
    const buttonClick=(ev)=>{
        // console.log(ev.srcElement.type,ev)
        var data=JSON.parse(localStorage.getItem('data'))
        data.push({
            addr:ev.view.location.href,
            action:"buttonClick",
            type:ev.srcElement.type,
            time:Date.now(),
            timeStamp:ev.timeStamp
        })
        localStorage.setItem('data',JSON.stringify(data))
        ev.stopPropagation();

    }

    const linkClick=(ev)=>{
        // console.log(ev)
        var data=JSON.parse(localStorage.getItem('data'))
        
        data.push({
            addr:ev.view.location.href,
            action:"linkClick",
            time:Date.now(),
            href:ev.srcElement.href
        })
        localStorage.setItem('data',JSON.stringify(data))
        ev.stopPropagation();

    }


    document.addEventListener("click", (ev) => {
        addressClick(ev);
    });
    document.addEventListener('scroll',(ev)=>{
        onscroll(ev);
        // console.log(ev);
    })
    allButtons.forEach(e=>{
        e.addEventListener('click',(ev)=>{
            buttonClick(ev);
        })
    })
    allLinks.forEach(e=>{
        e.addEventListener('click',(ev)=>{
            linkClick(ev);
        })
    })


})();
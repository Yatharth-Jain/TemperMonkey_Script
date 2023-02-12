var allButtons=document.querySelectorAll("button")
var allLinks=document.querySelectorAll("a")
var window=document

var buttonC = document.getElementById("button-c")
var scrollC = document.getElementById("scroll-c")
var clickC = document.getElementById("click-c")
var linkC = document.getElementById("link-c")
var linkC = document.getElementById("link-c")
var timeC = document.getElementById("time-c")
var timeC = document.getElementById("time-c")
var currTime = document.getElementById("currTime")

var clicks=[]
var scrolls=[]
var buttonClicks={}
var linkClicks=[]


const tabTime = Date.now();
currTime.innerHTML=new Date(tabTime).toUTCString();

var ctime=0;
const timer=()=>{
    timeC.innerHTML=ctime/1000+'s';
    setTimeout(()=>{
        ctime=ctime+1000;
        timer();
    },1000)
}
timer()


const addressClick = (ev) => {
    // console.log("Click",ev.offsetX,ev.offsetY);
    clicks.push({
        x:ev.offsetX,
        y:ev.offsetY,
    })
    clickC.innerHTML=JSON.stringify(clicks)
};
const onscroll=(ev)=>{
    // console.log("Scroll",ev.timeStamp);
    scrolls.push({
        timeStamp:ev.timeStamp,
    })
    scrollC.innerHTML=JSON.stringify(scrolls)

};
const buttonClick=(ev)=>{
    // console.log(ev.srcElement.type)
    if(!buttonClicks[ev.srcElement.type]){
        buttonClicks[ev.srcElement.type]=[]
    }
    buttonClicks[ev.srcElement.type].push({
        timeStamp:ev.timeStamp
    })
    buttonC.innerHTML=JSON.stringify(buttonClicks)

}

const linkClick=(ev)=>{
    // console.log(ev)
    linkClicks.push({
        href:ev.srcElement.href
    })
    linkC.innerHTML=JSON.stringify(linkClicks)

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

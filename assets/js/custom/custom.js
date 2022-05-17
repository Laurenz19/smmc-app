/******************************
 * coded by Laurenzio Sambany
 *****************************/
let url = window.location.href.slice(21);
let active = "active";

let active_load = () => {

    let links = document.getElementsByTagName('a');

    for (let i = 0; i < links.length; i++) {
        let href = links[i].href.slice(21);
        if (href == url) {
            let parent = links[i].parentNode.parentNode.parentNode.parentNode
            let parent_li = links[i].parentNode;
            let parent_div = links[i].parentNode.parentNode.parentNode;
            parent.classList.add(active);
            parent_li.classList.add(active);
            parent_div.classList.add("show");
        }
    }
}
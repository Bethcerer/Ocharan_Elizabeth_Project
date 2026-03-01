const btn = document.getElementById("btnUp");

window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
});


btn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

btn.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        btn.click();
    }
});

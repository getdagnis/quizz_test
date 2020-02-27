window.onload = slideOne;

function createSlide(slide) {
    const app = document.querySelector("app");
    let html = 'I am an empty HTML template!';
    slide = typeof(slide) !== "string" ? slide = "one" : slide = slide;

    switch (slide) {
        case "one":
            html = `
                <div class="name-slide hidden-slide">
                    <h3>Welcome to</h3>
                    <h1>Printful Front-End Task</h1>
                    <input type="text" name="name" id="name" placeholder="Type your name">
                    <div class="button inactive name-btn">My name is ...</div>
                </div>
        `; break;
        case "two":
            html = `
                <div class="tests-slide">
                    <h1>Hello, ${name}!</h1>
                    <h4>Choose your test</h4>
                    <div class="tests">
                        <div class="test" style="animation-delay: .1s;"><p class="test-name">Video games</p></div>
                        <div class="test" style="animation-delay: .5s;"><p class="test-name">Numbers</p></div>
                        <div class="test" style="animation-delay: 1.1s;"><p class="test-name">Movies</p></div>
                        <a href="page-3.html"><div class="button inactive test-btn">Start!</div></a>
                    </div>
                </div>
        `; break;
        default: 'Slide not found!'; break;
    }

    app.innerHTML = html;
    showSlide(slide);
}

function showSlide(slide) {

}


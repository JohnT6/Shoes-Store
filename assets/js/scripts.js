const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

// Navbar scroll effect
window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (window.scrollY > 400) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();
            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

// Slider
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slide");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const playPause = document.querySelector(".play-pause");

    if (!slides.length || !prev || !next || !playPause) {
        console.error("Không tìm thấy phần tử cần thiết trong slider.");
        return;
    }

    let index = 0;
    let isPlaying = true;
    let slideTimeout;

    function getVideo(slide) {
        return slide ? slide.querySelector("video") : null;
    }

    function showSlide(i) {
        clearTimeout(slideTimeout);
        slides[index].classList.remove("active");

        index = (i + slides.length) % slides.length;
        slides[index].classList.add("active");

        let video = getVideo(slides[index]);
        if (video) {
            video.currentTime = 0;
            if (isPlaying) video.play();
        }

        slideTimeout = setTimeout(() => showSlide(index + 1), 10000);
    }

    playPause.addEventListener("click", () => {
        let video = getVideo(slides[index]);
        if (video) {
            if (video.paused) {
                video.play();
                playPause.textContent = "❚❚";
                isPlaying = true;
                slideTimeout = setTimeout(() => showSlide(index + 1), 10000);
            } else {
                video.pause();
                playPause.textContent = "▶";
                isPlaying = false;
                clearTimeout(slideTimeout);
            }
        }
    });

    prev.addEventListener("click", () => showSlide(index - 1));
    next.addEventListener("click", () => showSlide(index + 1));

    showSlide(index);
});

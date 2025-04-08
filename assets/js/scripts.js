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

// Header scroll effect
window.addEventListener("scroll", function () {
    const header = document.querySelector("#header-scroll");

    if (window.scrollY > 300) {
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
    const slides = document.querySelectorAll("#slide");
    const prev = document.querySelector("#prev");
    const next = document.querySelector("#next");
    const playPause = document.querySelector("#play-pause");

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

// Products scroll buttons
document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.querySelector("#products-scroll");
    const prevButton = document.querySelector("#products-prev");
    const nextButton = document.querySelector("#products-next");

    if (!productContainer || !prevButton || !nextButton) {
        console.error("Không tìm thấy phần tử cần thiết.");
        return;
    }

    const scrollAmount = 350; // Số pixel cuộn mỗi lần nhấn nút

    // Xử lý nút prev
    prevButton.addEventListener("click", () => {
        productContainer.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
        });
    });

    // Xử lý nút next
    nextButton.addEventListener("click", () => {
        productContainer.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    });
});

// Product hover effect
document.addEventListener("DOMContentLoaded", () => {
    const productImages = document.querySelectorAll("#product__img");

    productImages.forEach((img) => {
        const hoverImg = img.getAttribute("data-hover");
        const defaultImg = img.getAttribute("src");

        img.addEventListener("mouseover", () => {
            if (hoverImg) {
                img.style.opacity = "0"; // Làm mờ hình ảnh hiện tại
                setTimeout(() => {
                    img.setAttribute("src", hoverImg);
                    img.style.opacity = "1"; // Hiển thị hình ảnh mới
                }, 100); // Thời gian đồng bộ với CSS transition
            }
        });

        img.addEventListener("mouseout", () => {
            if (defaultImg) {
                img.style.opacity = "0"; // Làm mờ hình ảnh hiện tại
                setTimeout(() => {
                    img.setAttribute("src", defaultImg);
                    img.style.opacity = "1"; // Hiển thị hình ảnh cũ
                }, 100); // Thời gian đồng bộ với CSS transition
            }
        });
    });
});

// Blog scroll buttons
document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.querySelector("#blog-scroll");
    const prevButton = document.querySelector("#blog-prev");
    const nextButton = document.querySelector("#blog-next");

    if (!blogContainer || !prevButton || !nextButton) {
        console.error("Không tìm thấy phần tử cần thiết.");
        return;
    }

    const scrollAmount = 350; // Số pixel cuộn mỗi lần nhấn nút

    // Xử lý nút prev
    prevButton.addEventListener("click", () => {
        blogContainer.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
        });
    });

    // Xử lý nút next
    nextButton.addEventListener("click", () => {
        blogContainer.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    });
});

// Ngăn hoạt động của button tìm kiếm và button đăng ký
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const emailButton = document.getElementById("email-button");

    if (searchButton) {
        searchButton.addEventListener("click", (e) => {
            e.preventDefault(); // Ngăn chặn hành động mặc định
        });
    }

    if (emailButton) {
        emailButton.addEventListener("click", (e) => {
            e.preventDefault(); // Ngăn chặn hành động mặc định
        });
    }
});

// Thêm active vào filter-wrap để giảm z-index
document.addEventListener("DOMContentLoaded", () => {
    const filterWrap = document.querySelector("#filter-wrap");

    if (filterWrap) {
        filterWrap.addEventListener("click", () => {
            if (window.innerWidth <= 575.98) {
                filterWrap.classList.toggle("active");
            }
        });
    }
});

// Thay đổi giá trị của ô nhập liệu khi kéo slider giá
// Hàm định dạng số thành giá tiền Việt Nam
function formatCurrencyVND(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(value);
}

// Hoặc tự viết hàm định dạng (nếu không muốn dùng `Intl.NumberFormat`)
function formatCurrencyVNDManual(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

// Cập nhật giá trị slider và ô nhập liệu
document.addEventListener("DOMContentLoaded", () => {
    const minSlider = document.getElementById("min-price");
    const maxSlider = document.getElementById("max-price");
    const minInput = document.getElementById("min-price-input");
    const maxInput = document.getElementById("max-price-input");

    // Cập nhật giá trị ô nhập liệu khi kéo slider
    minSlider.addEventListener("input", () => {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);

        if (minValue > maxValue) {
            minSlider.value = maxValue; // Không cho phép nhỏ nhất vượt quá lớn nhất
        }

        minInput.value = formatCurrencyVND(minSlider.value);
    });

    maxSlider.addEventListener("input", () => {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);

        if (maxValue < minValue) {
            maxSlider.value = minValue; // Không cho phép lớn nhất nhỏ hơn nhỏ nhất
        }

        maxInput.value = formatCurrencyVND(maxSlider.value);
    });

    // Cập nhật slider khi thay đổi giá trị ô nhập liệu
    minInput.addEventListener("change", () => {
        const value = parseInt(minInput.value.replace(/\D/g, ""));
        if (value >= parseInt(minSlider.min) && value <= parseInt(maxSlider.value)) {
            minSlider.value = value;
        } else {
            minInput.value = formatCurrencyVND(minSlider.value); // Reset nếu giá trị không hợp lệ
        }
    });

    maxInput.addEventListener("change", () => {
        const value = parseInt(maxInput.value.replace(/\D/g, ""));
        if (value <= parseInt(maxSlider.max) && value >= parseInt(minSlider.value)) {
            maxSlider.value = value;
        } else {
            maxInput.value = formatCurrencyVND(maxSlider.value); // Reset nếu giá trị không hợp lệ
        }
    });
});

// Phần filter kích cỡ
document.getElementById("size-select").addEventListener("change", (event) => {
    console.log("Size selected:", event.target.value);
});

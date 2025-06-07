document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("animateBtn");
  const container = document.querySelector(".container");
  const page1Title = document.getElementById("page1title");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const t1 = gsap.timeline();
  t1.from(".navbar .logo", {
    duration: 0.9,
    y: -50,
    opacity: 0,
    ease: "power2.out",
    delay: 0.5,
  });
  t1.from(".navbar .links li", {
    y: -60,
    stagger: 0.1,
  });

  const text = page1Title.textContent;
  const splitText = text.split("");
  page1Title.textContent = "";
  splitText.forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    if (char === " ") span.innerHTML = "&nbsp;";
    page1Title.appendChild(span);
  });

  // Animate each letter from right to left with stagger
  const letterSpans = page1Title.querySelectorAll("span");
  const letterTween = t1.from(letterSpans, {
    x: 80,
    opacity: 0,
    duration: 0.6,
    ease: "power1.out",
    stagger: 0.07,
    delay: 0.5,
    yoyo: true,
    repeat: -1,
    paused: false,
  });

  // Pause animation on hover, resume on mouseleave
  page1Title.addEventListener("mouseenter", function () {
    // letterTween.pause();
    letterTween.timeScale(0.5);
    letterSpans.forEach((span, index) => {
      gsap.to(span, {
        y: -20,
        opacity: 1,
        scale: 1.1,
        duration: 0.3,
        ease: "power1.inOut",
        delay: index * 0.05,
        letterSpacing: "0.1em",
        color: "#ff6347",
      });
    });
  });
  page1Title.addEventListener("mouseleave", function () {
    // letterTween.resume();
    letterTween.timeScale(1);
    letterSpans.forEach((span, index) => {
      gsap.to(span, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power1.inOut",
        delay: index * 0.05,
        letterSpacing: "normal",
        color: "#ffedd4",
      });
    });
  });

  btn.addEventListener("click", function () {
    // Start jelly effect on button
    let btnJellyTween = gsap.to("#animateBtn", {
      scale: 1.2,
      duration: 0.7,
      ease: "elastic.out(2, 0.3)",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(".box", {
      duration: 2,
      ease: "power1.inOut",
      repeat: 1,
      yoyo: true,
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: 150, y: 80 },
          { x: 300, y: 80 },
          { x: 500, y: -250 },
          { x: -600, y: 0 },
          { x: 0, y: 100 },
        ],
        curviness: 1,
        autoRotate: false,
      },
      scale: 2.5,
      borderRadius: "50%",
      backgroundColor: "#65b267",
      onComplete: function () {
        btn.textContent = "Animation Complete!";
        btn.disabled = true;

        // Stop the jelly effect and smoothly return to normal scale
        btnJellyTween.kill();
        gsap.to("#animateBtn", {
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(2, 0.3)",
        });

        gsap.to(".container", {
          y: 100,
          scale: 0.7,
          skewY: 20, // Tilt in Y axis by 20 degrees
          rotation: 0,
          borderRadius: "15px",
          duration: 1.2,
          ease: "bounce.out",
          onComplete: function () {
            setTimeout(() => {
              gsap.to(btn, {
                duration: 0.8,
                textContent: "Animate Again",
                ease: "power1.inOut",
              });
              btn.disabled = false;
            }, 300);
            gsap.to(".container", {
              y: 0,
              scale: 1,
              skewY: 0,
              rotation: 0,
              borderRadius: "25px",
              duration: 1.2,
              ease: "power1.inOut",
            });

            // Randomly show and animate all 10 boxes
            const boxes = [];
            for (let i = 1; i <= 30; i++) {
              const box = document.querySelector(`.box${i}`);
              if (box) {
                boxes.push(box);
              }
            }
            // Generate 10 unique, well-separated colors
            function generateUniqueColors(count) {
              const colors = [];
              const step = Math.floor(360 / count);
              for (let i = 0; i < count; i++) {
                // Spread hues evenly around the color wheel
                const hue =
                  (i * step + Math.floor(Math.random() * (step / 2))) % 360;
                colors.push(`hsl(${hue}, 70%, 60%)`);
              }
              // Shuffle to randomize order
              for (let i = colors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [colors[i], colors[j]] = [colors[j], colors[i]];
              }
              return colors;
            }
            const uniqueColors = generateUniqueColors(boxes.length);
            // Animate all boxes with stagger and unique, well-separated colors
            gsap.fromTo(
              boxes,
              {
                opacity: 0,
                x: (i) => Math.random() * (window.innerWidth - 100 - 10),
                y: (i) => Math.random() * (window.innerHeight - 100 - 10),
                background: (i) => uniqueColors[i],
                borderRadius: () => `${Math.floor(Math.random() * 51)}%`,
              },
              {
                opacity: 1,
                x: (i) =>
                  Math.max(0, Math.random() * (window.innerWidth - 100 - 10)),
                y: (i) =>
                  Math.max(0, Math.random() * (window.innerHeight - 100 - 10)),
                duration: 1,
                ease: "back.out(2)",
                stagger: 0.15,
                onStart: function () {
                  this.targets().forEach((box, i) => {
                    box.style.display = "block";
                    box.style.position = "fixed";
                    box.style.left = "0.5rem";
                    box.style.right = "0.5rem";
                    box.style.top = "4rem";
                    box.style.bottom = "1rem";
                    box.style.width = "100px";
                    box.style.height = "100px";
                    box.style.borderRadius = "8px";
                    box.style.zIndex = 1000;
                    box.style.background = uniqueColors[i];
                  });
                },
                onComplete: function () {
                  boxes.forEach((box, i) => {
                    box.addEventListener("click", function () {
                      gsap.to(box, {
                        scale: 1.5,
                        duration: 0.3,
                        ease: "power1.inOut",
                        onComplete: function () {
                          gsap.to(box, {
                            scale: 1,
                            duration: 0.3,
                            ease: "power1.inOut",
                            rotation: 360,
                            x: Math.random() * (windowWidth - 100 - 10),
                            y: Math.random() * (windowHeight - 100 - 10),
                          });
                        },
                      });
                    });

                    box.addEventListener("mousemove", function (e) {
                      const react = box.getBoundingClientRect();
                      const boxCenterX = react.left + react.width / 2;
                      const boxCenterY = react.top + react.height / 2;
                      const dist = Math.hypot(
                        e.clientX - boxCenterX,
                        e.clientY - boxCenterY
                      );

                      if (dist < 30) {
                        gsap.to(box, {
                          scale: 1,
                          duration: 0.3,
                          ease: "power1.inOut",
                          rotation: 360,
                          x: Math.random() * (windowWidth - 100 - 10),
                          y: Math.random() * (windowHeight - 100 - 10),
                        });
                      }
                    });
                  });
                },
              }
            );
          },
        });
      },
    });
  });

  // Helper: Hide boxes one by one
  function hideBoxesSequentially() {
    const boxes = [];
    for (let i = 1; i <= 30; i++) {
      const box = document.querySelector(`.box${i}`);
      if (box && box.style.display !== "none") {
        boxes.push(box);
      }
    }
    boxes.forEach((box, idx) => {
      setTimeout(() => {
        gsap.to(box, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            box.style.display = "none";
          },
        });
      }, idx * 150);
    });
  }

  // Detect scroll to page-2 and trigger box hiding
  let page2Triggered = false;
  window.addEventListener("scroll", function () {
    const page2 = document.querySelector(".page-2");
    if (!page2) return;
    const rect = page2.getBoundingClientRect();
    // If top of page-2 is visible in viewport
    if (rect.top < window.innerHeight && !page2Triggered) {
      page2Triggered = true;
      hideBoxesSequentially();
    }
    // Reset trigger if user scrolls back up
    if (rect.top > window.innerHeight) {
      page2Triggered = false;
    }
  });
});

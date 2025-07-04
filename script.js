document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const btn = document.getElementById("animateBtn");
  const container = document.querySelector(".container");
  const page1Title = document.getElementById("page1title");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const body = document.body;
  const image = new Image();
  image.src = "./assets/GSAPman.png";

  body.style.cursor = "none";
  let boxesVisible = false;
  let mousePosition = { x: 0, y: 0 };

  // Hide custom cursor with scale 0 when mouse leaves window
  body.addEventListener("mouseleave", function () {
    gsap.to(customCursor, {
      scale: 0,
      duration: 0.3,
      ease: "power1.inOut",
    });
  });

  // Show custom cursor with scale 1 when mouse enters window
  body.addEventListener("mouseenter", function () {
    gsap.to(customCursor, {
      scale: 1,
      duration: 0.3,
      ease: "power1.inOut",
    });
  });

  // Create and style the custom cursor image
  const customCursor = document.createElement("img");
  customCursor.src = "./assets/GSAPman.png";
  customCursor.style.position = "fixed";
  customCursor.style.width = "48px";
  customCursor.style.height = "48px";
  customCursor.style.pointerEvents = "none";
  customCursor.style.zIndex = 9999;
  customCursor.style.left = "0px";
  customCursor.style.top = "0px";
  customCursor.style.display = "none";
  customCursor.style.transform = "translate(-50%, -50%)";
  body.appendChild(customCursor);

  function createCursorTrail(x, y) {
    const trail = document.createElement("img");
    trail.src = "./assets/GSAPman.png";
    trail.style.position = "fixed";
    trail.style.width = "48px";
    trail.style.height = "48px";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = 9998;
    trail.style.left = x + "px";
    trail.style.top = y + "px";
    trail.style.transform = "translate(-50%, -50%)";
    trail.style.opacity = "0.08";
    body.appendChild(trail);

    gsap.to(trail, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        trail.remove();
      },
    });
  }

  // Single mousemove event listener
  body.addEventListener("mousemove", function (e) {
    mousePosition = { x: e.clientX, y: e.clientY };

    // Handle cursor visibility and positioning
    if (
      mousePosition.x < 0 ||
      mousePosition.y < 0 ||
      mousePosition.x > windowWidth ||
      mousePosition.y > windowHeight
    ) {
      customCursor.style.display = "none";
      return;
    }

    customCursor.style.display = "block";

    setTimeout(() => {
      gsap.to(image, {
        duration: 0.5,
        ease: "power1.inOut",
        x: mousePosition.x - 50,
        y: mousePosition.y - 50,
      });
      customCursor.style.left = mousePosition.x + "px";
      customCursor.style.top = mousePosition.y + "px";

      createCursorTrail(mousePosition.x, mousePosition.y);
    }, 150);

    // Handle box interaction only if boxes are visible
    if (boxesVisible) {
      checkBoxProximity();
    }
  });

  function getPage1Boxes() {
    const page1 = document.querySelector(".page-1");
    if (!page1) return;

    return page1.querySelectorAll(":scope > [class^='box']");
  }
  const page1Boxes = getPage1Boxes();

  // Function to check box proximity and move them
  function checkBoxProximity() {
    page1Boxes.forEach((box) => {
      const rect = box.getBoundingClientRect();
      const boxCenterX = rect.left + rect.width / 2;
      const boxCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(
        mousePosition.x - boxCenterX,
        mousePosition.y - boxCenterY
      );

      if (distance <= 200) {
        // Calculate safe random position within viewport boundaries
        const boxWidth = 100;
        const boxHeight = 100;
        const maxX = windowWidth - boxWidth;
        const maxY = windowHeight - boxHeight;

        const randomX = Math.max(0, Math.min(maxX, Math.random() * maxX));
        const randomY = Math.max(0, Math.min(maxY, Math.random() * maxY));

        gsap.to(box, {
          x: randomX,
          y: randomY,
          rotation: 0,
          scale: 1,
          scrub: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  }

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

  const page1Text = page1Title.textContent;
  page1Title.textContent = "";

  const textSplitter = (text) => {
    const splitText = text.split("");
    let title = [];
    splitText.forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      if (char === " ") span.innerHTML = "&nbsp;";
      title.push(span);
    });

    return title;
  };

  const updatedPage1Title = textSplitter(page1Text);
  updatedPage1Title.forEach((span) => page1Title.appendChild(span));

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
          skewY: 20,
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

            // Show and animate all boxes
            const boxes = [];
            for (let i = 1; i <= 30; i++) {
              const box = document.querySelector(`.box${i}`);
              if (box) {
                boxes.push(box);
              }
            }

            // Generate unique colors
            function generateUniqueColors(count) {
              const colors = [];
              const step = Math.floor(360 / count);
              for (let i = 0; i < count; i++) {
                const hue =
                  (i * step + Math.floor(Math.random() * (step / 2))) % 360;
                colors.push(`hsl(${hue}, 70%, 60%)`);
              }
              // Shuffle colors
              for (let i = colors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [colors[i], colors[j]] = [colors[j], colors[i]];
              }
              return colors;
            }

            const uniqueColors = generateUniqueColors(boxes.length);
            const boxWidth = 100;
            const boxHeight = 100;
            const maxX = windowWidth - boxWidth;
            const maxY = windowHeight - boxHeight;

            // Animate all boxes with proper boundary constraints
            gsap.fromTo(
              boxes,
              {
                opacity: 0,
                x: (i) => Math.max(0, Math.min(maxX, Math.random() * maxX)),
                y: (i) => Math.max(0, Math.min(maxY, Math.random() * maxY)),
                background: (i) => uniqueColors[i],
                borderRadius: () => `${Math.floor(Math.random() * 51)}%`,
              },
              {
                opacity: 1,
                x: (i) => Math.max(0, Math.min(maxX, Math.random() * maxX)),
                y: (i) => Math.max(0, Math.min(maxY, Math.random() * maxY)),
                duration: 1,
                ease: "back.out(2)",
                stagger: 0.15,
                onStart: function () {
                  this.targets().forEach((box, i) => {
                    box.style.display = "block";
                    box.style.position = "fixed";
                    box.style.width = boxWidth + "px";
                    box.style.height = boxHeight + "px";
                    box.style.borderRadius = "8px";
                    box.style.zIndex = 1000;
                    box.style.background = uniqueColors[i];
                  });
                },
                onComplete: function () {
                  boxesVisible = true; // Enable box interaction

                  // Add click handlers to boxes
                  boxes.forEach((box, i) => {
                    box.addEventListener("click", function () {
                      gsap.to(box, {
                        scale: 1.5,
                        duration: 0.3,
                        ease: "power1.inOut",
                        onComplete: function () {
                          const newX = Math.max(
                            0,
                            Math.min(maxX, Math.random() * maxX)
                          );
                          const newY = Math.max(
                            0,
                            Math.min(maxY, Math.random() * maxY)
                          );

                          gsap.to(box, {
                            scale: 1,
                            duration: 0.3,
                            ease: "power1.inOut",
                            rotation: 360,
                            x: newX,
                            y: newY,
                          });
                        },
                      });
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
    boxesVisible = false; // Disable box interaction

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

  document.querySelector(
    ".page-2 .animate-box .scrolling-container"
  ).style.cssText = "display: none; scale: 0";

  const page2Timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".page-1",
      start: "top+=10% top",
      end: "bottom end",
      scrub: 2,
      scroller: ".pages",
      // onEnter: () => {
      //   document.querySelectorAll(".page-2 .animate-box").forEach((box) => {
      //     box.style.display = "block";
      //   });
      // },
      // onLeaveBack: () => {
      //   document.querySelectorAll(".page-2 .animate-box").forEach((box) => {
      //     gsap.set(box, { clearProps: "all" });
      //   });
      //   gsap.set(".page-2", { clearProps: "all" });
      // },
    },
  });

  page2Timeline
    .to(
      ".page-2",
      { backgroundColor: "#070707", duration: 3, ease: "power1.inOut" },
      0
    )
    .to(
      ".page-2 .animate-box",
      {
        scale: 0.2,
        motionPath: {
          path: [
            { x: 0, y: -500 }, // hold x, stay vertical
            { x: 200, y: -400 }, // move right
            { x: 200, y: -350 }, // move down slightly
            { x: -200, y: -350 }, // move left
            { x: -200, y: -300 }, // move down again
            { x: 200, y: -300 }, // move right
            { x: 200, y: -250 }, // move down again
            { x: -200, y: -250 }, // move left
            { x: -200, y: -200 }, // move down again
            { x: 200, y: -200 }, // move right
            { x: 200, y: -150 }, // move down again
            { x: -200, y: -150 }, // move left
            { x: -200, y: -100 }, // move down again
            { x: 200, y: -100 }, // move right
            { x: 200, y: -50 }, // move down again
            { x: -200, y: -50 }, // move left
            { x: -200, y: 0 }, // move down again
            { x: 200, y: 0 }, // move right
            { x: 200, y: 50 }, // move down again
            { x: -100, y: 0 }, // move left
            { x: 0, y: 300 }, // move down again
          ],
          autoRotate: false,
          curviness: 1,
        },
        ease: "power2.inOut",
        duration: 10,
      },
      0
    )
    .to(
      ".page-2 .animate-box",
      {
        scale: 1.1,
        backgroundColor: "rgba(10, 40, 57, 0.86)",
        transform: "translate(-0%, -30%)",
        width: "60%",
        borderRadius: "15px",
        duration: 1,
        ease: "power1.inOut",
        onComplete: () => hideBoxesSequentially(),
      },
      ">"
    )
    .to(
      ".page-2 .animate-box",
      {
        scale: 1,
        backgroundColor: "rgba(10, 40, 57, 0.86)",
        transform: "translate(-0%, 50%)",
        width: "50%",
        height: "50%",
        border: "2px solid rgba(44, 113, 153, 0.86)",
        borderRadius: "15px",
        duration: 1,
        ease: "power1.inOut",
      },
      ">+=1"
    )
    .to(".page-2 .animate-box .scrolling-container", {
      display: "block",
      scale: 1,
      duration: 1,
      ease: "power1.inOut",
    });

  // .to(".page-2 .animate-box h3", {
  //   top: '0%',
  //   left: '100%'
  // }, ">+=1");

  const commonClass = ".page-2 .animate-box .scrolling-container";
  const page2InnerBoxTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".page-2 .animate-box .scrolling-container",
      start: "top top",
      end: "bottom end",
      scrub: 1,
      scroller: ".page-2 .animate-box",
      onComplete: () => {
        // Hide permanently when scroll animation completes
        document.querySelector(commonClass).style.display = "none";
      },
      onReverseComplete: () => {
        // Show again if scrolling back to start
        // document.querySelector(commonClass).style.display = "block";
      },
    },
  });

  page2InnerBoxTimeline
    .to(commonClass, {
      scale: 0.5,
      rotation: -360,
      borderRadius: "2rem",
    })
    .to(commonClass, {
      backgroundColor: "rgba(109, 109, 23, 0.89)",
      borderRadius: "100%",
    });
  // .to(commonClass, { display: "none" });
  // .to(commonClass, {
  //   y: 500,
  // })

  // .fromTo(
  //   ".page-2 .animate-box .scrolling-container h3",
  //   {
  //     display: "block",
  //     y: -50,
  //     x: -50,
  //     FontFace: "Poppins",
  //     opacity: 0.3,
  //   },
  //   {
  //     y: 0,
  //     x: 0,
  //     marginTop: "2rem",
  //     marginLeft: "2rem",
  //     opacity: 1,
  //     duration: 0.5,
  //     ease: "power1.inOut",
  //   }
  // )
  // .to(".page-2 .animate-box .scrolling-container h3", {
  //   marginLeft: "0",
  //   letterSpacing: "0.1em",
  //   color: "rgba(97, 159, 194, 0.86)",
  //   duration: 0.5,
  //   ease: "power1.inOut",
  //   textAlign: "left",
  //   display: "flex",
  //   justifyContent: "start",
  // })
  // .to(".page-2 .animate-box .scrolling-container h3", {
  //   marginLeft: "2rem",
  //   textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  //   fontSize: "1.2rem",
  //   duration: 0.5,
  //   ease: "power1.inOut",
  // })
  // .to(".page-2 .animate-box .scrolling-container h3", {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   margin: 0,
  //   transform: "translate(-50%, -50%)",
  //   duration: 0.5,
  //   ease: "power1.inOut",
  // });
});

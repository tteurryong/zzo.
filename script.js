// =========================
// 살아있는 졸라맨 시뮬레이터
// Part 1
// =========================

const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body,
    Constraint,
    Mouse,
    MouseConstraint
} = Matter;

// 엔진 생성
const engine = Engine.create();
const world = engine.world;
world.gravity.y = 1;

// 캔버스
const canvas = document.getElementById("world");

const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "#bfe7ff"
    }
});

// 실행
Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

// 바닥
const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight - 20,
    window.innerWidth,
    40,
    {
        isStatic: true,
        render: {
            fillStyle: "#5d8f45"
        }
    }
);

// 왼쪽 벽
const leftWall = Bodies.rectangle(
    -20,
    window.innerHeight / 2,
    40,
    window.innerHeight,
    {
        isStatic: true
    }
);

// 오른쪽 벽
const rightWall = Bodies.rectangle(
    window.innerWidth + 20,
    window.innerHeight / 2,
    40,
    window.innerHeight,
    {
        isStatic: true
    }
);

// 천장
const ceiling = Bodies.rectangle(
    window.innerWidth / 2,
    -20,
    window.innerWidth,
    40,
    {
        isStatic: true
    }
);

World.add(world, [
    ground,
    leftWall,
    rightWall,
    ceiling
]);

// =========================
// 졸라맨 생성
// =========================

const {
    Constraint
} = Matter;

const startX = window.innerWidth / 2;
const startY = 180;

// 머리
const head = Bodies.circle(startX, startY, 22, {
    restitution: 0.2,
    friction: 0.5,
    render: {
        fillStyle: "#ffffff",
        strokeStyle: "#000000",
        lineWidth: 2
    }
});

// 몸통
const body = Bodies.rectangle(startX, startY + 55, 18, 60, {
    render: {
        fillStyle: "#222222"
    }
});

// 왼팔
const leftArm = Bodies.rectangle(startX - 28, startY + 45, 40, 10, {
    render: {
        fillStyle: "#222222"
    }
});

// 오른팔
const rightArm = Bodies.rectangle(startX + 28, startY + 45, 40, 10, {
    render: {
        fillStyle: "#222222"
    }
});

// 왼다리
const leftLeg = Bodies.rectangle(startX - 10, startY + 115, 12, 55, {
    render: {
        fillStyle: "#222222"
    }
});

// 오른다리
const rightLeg = Bodies.rectangle(startX + 10, startY + 115, 12, 55, {
    render: {
        fillStyle: "#222222"
    }
});

World.add(world, [
    head,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg
]);

// =========================
// 관절 연결
// =========================

World.add(world, [

    // 머리 ↔ 몸
    Constraint.create({
        bodyA: head,
        bodyB: body,
        pointA: { x: 0, y: 18 },
        pointB: { x: 0, y: -30 },
        stiffness: 0.9
    }),

    // 왼팔
    Constraint.create({
        bodyA: body,
        bodyB: leftArm,
        pointA: { x: -8, y: -20 },
        pointB: { x: 18, y: 0 },
        stiffness: 0.8
    }),

    // 오른팔
    Constraint.create({
        bodyA: body,
        bodyB: rightArm,
        pointA: { x: 8, y: -20 },
        pointB: { x: -18, y: 0 },
        stiffness: 0.8
    }),

    // 왼다리
    Constraint.create({
        bodyA: body,
        bodyB: leftLeg,
        pointA: { x: -5, y: 30 },
        pointB: { x: 0, y: -25 },
        stiffness: 0.9
    }),

    // 오른다리
    Constraint.create({
        bodyA: body,
        bodyB: rightLeg,
        pointA: { x: 5, y: 30 },
        pointB: { x: 0, y: -25 },
        stiffness: 0.9
    })

]);


// =========================
// 마우스로 잡기
// =========================

const {
    Mouse,
    MouseConstraint
} = Matter;

const mouse = Mouse.create(render.canvas);

const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

World.add(world, mouseConstraint);

render.mouse = mouse;

// =========================
// 창 크기 변경 대응
// =========================

window.addEventListener("resize", () => {

    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;

});

// =========================
// 약간 살아있는 듯 흔들리기
// =========================

setInterval(() => {

    Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.002,
        y: 0
    });

}, 1000);


// =========================
// 랜덤하게 걷기
// =========================

let direction = 1;

setInterval(() => {

    // 가끔 방향 바꾸기
    if (Math.random() < 0.3) {
        direction *= -1;
    }

    // 몸통 밀기
    Body.applyForce(body, body.position, {
        x: 0.01 * direction,
        y: 0
    });

    // 다리 움직이기
    Body.applyForce(leftLeg, leftLeg.position, {
        x: 0.002 * direction,
        y: -0.004
    });

    Body.applyForce(rightLeg, rightLeg.position, {
        x: 0.002 * direction,
        y: 0.004
    });

    // 팔도 약간 흔들기
    Body.applyForce(leftArm, leftArm.position, {
        x: -0.001 * direction,
        y: 0
    });

    Body.applyForce(rightArm, rightArm.position, {
        x: 0.001 * direction,
        y: 0
    });

}, 300);

// =========================
// 넘어지면 일어나려고 버둥거리기
// =========================

setInterval(() => {

    if (Math.abs(body.angle) > 0.5) {

        Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.03,
            y: -0.03
        });

    }

}, 500);


// =========================
// 건드리면 움찔하기
// =========================

Matter.Events.on(engine, "collisionStart", function(event) {

    event.pairs.forEach(pair => {

        const parts = [
            head,
            body,
            leftArm,
            rightArm,
            leftLeg,
            rightLeg
        ];

        if (
            parts.includes(pair.bodyA) ||
            parts.includes(pair.bodyB)
        ) {

            // 몸통 움찔
            Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.04,
                y: -0.03
            });

            // 머리 흔들기
            Body.applyForce(head, head.position, {
                x: (Math.random() - 0.5) * 0.02,
                y: -0.02
            });

            // 팔 버둥거리기
            Body.applyForce(leftArm, leftArm.position, {
                x: -0.01,
                y: -0.01
            });

            Body.applyForce(rightArm, rightArm.position, {
                x: 0.01,
                y: -0.01
            });

        }

    });

});


// =========================
// 살아있는 행동 AI
// =========================

let state = "walk";
let nextAction = Date.now() + 2000;

function randomAction() {

    const r = Math.random();

    if (r < 0.55) {
        state = "walk";
    } else if (r < 0.75) {
        state = "idle";
    } else if (r < 0.90) {
        state = "jump";
    } else {
        state = "panic";
    }

    nextAction = Date.now() + 1000 + Math.random() * 3000;
}

Matter.Events.on(engine, "beforeUpdate", function () {

    if (Date.now() > nextAction) {
        randomAction();
    }

    switch (state) {

        case "walk":

            Body.applyForce(body, body.position, {
                x: 0.003 * direction,
                y: 0
            });

            Body.applyForce(leftLeg, leftLeg.position, {
                x: 0.0015 * direction,
                y: -0.001
            });

            Body.applyForce(rightLeg, rightLeg.position, {
                x: 0.0015 * direction,
                y: 0.001
            });

            break;

        case "idle":

            // 가만히 서서 미세하게 흔들림
            Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.0006,
                y: 0
            });

            break;

        case "jump":

            Body.applyForce(body, body.position, {
                x: 0,
                y: -0.05
            });

            state = "walk";

            break;

        case "panic":

            Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.04,
                y: -0.02
            });

            Body.applyForce(leftArm, leftArm.position, {
                x: -0.01,
                y: -0.01
            });

            Body.applyForce(rightArm, rightArm.position, {
                x: 0.01,
                y: -0.01
            });

            break;
    }

});

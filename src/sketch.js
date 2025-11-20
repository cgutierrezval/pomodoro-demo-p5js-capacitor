import { sketch } from './p5-wrapper';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
// p5.sound ya está cargado globalmente desde HTML


let timer = 10;
let running = false;
let paused = false;
let lastTime = 0;
let currentTaskTitle = '';

let cubeSize = 100;
let cubeY = 0;
let angleX = -Math.PI / 6;
let angleY = 0;
let angleZ = 0;
let fadeOut = false;

let soundEffect;
let soundPlayed = false;
let fadeStart = 0;

let orbitronFont;

sketch.preload = function() {
  // loadSound ya disponible globalmente
  //soundEffect = sketch.loadSound('/sounds/short-sound.mp3');
  orbitronFont = sketch.loadFont('/fonts/Orbitron-Regular.ttf');
};

sketch.setup = function() {
  let cnv = sketch.createCanvas(400, 400, sketch.WEBGL);
  cnv.parent('p5-container');

  sketch.textAlign(sketch.CENTER, sketch.CENTER);
  sketch.textSize(48);
  sketch.textFont(orbitronFont);
  sketch.fill(255);

  const startBtn = document.getElementById('startBtn');
  const taskInput = document.getElementById('taskInput');
  const enterBtn = document.getElementById('enterBtn');
  const taskTitleDisplay = document.getElementById('task-title');
  
  if (startBtn) {
startBtn.addEventListener('click', async () => {
  if (!running && !fadeOut && timer === 10) startPomodoro();
  else if (running) {
    paused = !paused;
    startBtn.innerText = paused ? 'Reanudar' : 'Pausa';
  } else if (!running && timer <= 0) resetPomodoro();

  //userStartAudio();
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
    console.log('Haptics ejecutado en botón');
  } catch (e) {
    console.log('Error Haptics:', e);
  }
});
}

  // Función modular para manejar entrada de tarea
  async function handleTaskInput() {
    // Capturar y validar input
    currentTaskTitle = taskInput.value.trim() || 'Pomodoro Session';
    
    // Actualizar display inmediatamente
    taskTitleDisplay.textContent = currentTaskTitle;
    taskTitleDisplay.style.display = 'block';
    
    // Limpiar input y cerrar teclado
    taskInput.value = '';
    taskInput.blur();
    
    // Haptic feedback
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.log('Error Haptics:', e);
    }
    
    console.log('Task title updated:', currentTaskTitle);
  }

  // Handle Enter button click
  if (enterBtn) {
    enterBtn.addEventListener('click', handleTaskInput);
  }

  // Handle Enter key - MISMO comportamiento que botón
  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleTaskInput(); // Misma función, mismo haptic
      }
    });
  }
};

sketch.draw = function() {
  sketch.background(18);
  sketch.ambientLight(80);
  sketch.directionalLight(200, 200, 200, 0, -1, 0);

  if (running && !paused) {
    let currentMillis = sketch.millis();
    if (currentMillis - lastTime >= 1000) {
      timer--;
      lastTime = currentMillis;
    }
  }

  // Cubo
  sketch.push();
  cubeY = (running && !paused) ? sketch.sin(sketch.millis() * 0.002) * 50 : 0;
  sketch.translate(0, cubeY, 0);
  sketch.rotateX(angleX);
  if (running && !paused) angleY += 0.03;
  sketch.rotateY(angleY);
  sketch.rotateZ(angleZ);
  sketch.box(cubeSize);
  sketch.pop();

  // Timer debajo del cubo
  sketch.push();
  sketch.resetMatrix();
  sketch.translate(0, sketch.height / 4, 0);
  sketch.textFont(orbitronFont);
  sketch.textSize(64);
  sketch.fill(255);
  sketch.textAlign(sketch.CENTER, sketch.CENTER);
  sketch.text(timer > 0 ? timer : 0, 0, 0);
  sketch.pop();

  if (timer <= 0 && running && !soundPlayed) {
    // Reproducir sonido + haptics al finalizar
    //if (soundEffect) soundEffect.play();
    
    (async () => {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
        console.log('Reproduciendo sonido + haptics al finalizar pomodoro');
      } catch (e) {
        console.log('Error Haptics at pomodoro end', e);
      }
    })();

    soundPlayed = true;
    running = false;
    fadeOut = true;
    fadeStart = sketch.millis();
    document.getElementById('startBtn').innerText = 'Start';
  }

  if (fadeOut) {
    let elapsed = sketch.millis() - fadeStart;
    if (elapsed < 2000) cubeSize = 100 * sketch.map(elapsed, 0, 2000, 1, 0);
    else cubeSize = 0, fadeOut = false;
  }

  if (!running && !fadeOut && !paused && timer === 10) angleZ += 0.01;
};

sketch.mousePressed = async function() {
  try {
    console.log('Click detectado');
    await Haptics.impact({ style: ImpactStyle.Light }); // espera a que se complete
    console.log('Vibración ejecutada');
  } catch (e) {
    console.log('Error Haptics at mouse pressed', e);
  }
};

// Funciones auxiliares
function startPomodoro() {
  const taskTitleDisplay = document.getElementById('task-title');
  
  // Si no hay título guardado, usar valor del input o default
  if (!currentTaskTitle) {
    const taskInput = document.getElementById('taskInput');
    currentTaskTitle = taskInput.value.trim() || 'Pomodoro Session';
  }
  
  // Siempre mostrar el título guardado
  taskTitleDisplay.textContent = currentTaskTitle;
  taskTitleDisplay.style.display = 'block';
  
  running = true;
  paused = false;
  lastTime = sketch.millis();
  fadeOut = false;
  cubeSize = 100;
  angleY = 0;
  soundPlayed = false;
  document.getElementById('startBtn').innerText = 'Pausa';
  
  console.log('Pomodoro started with task:', currentTaskTitle);
}

function resetPomodoro() {
  // Reset timer and states
  timer = 10;
  running = false;
  paused = false;
  cubeSize = 100;
  angleX = -Math.PI / 6;
  angleY = 0;
  angleZ = 0;
  fadeOut = false;
  soundPlayed = false;
  currentTaskTitle = '';
  
  // Update UI
  const taskInput = document.getElementById('taskInput');
  const taskTitleDisplay = document.getElementById('task-title');
  
  document.getElementById('startBtn').innerText = 'Start';
  taskTitleDisplay.style.display = 'none';
  taskTitleDisplay.textContent = '';
  // Clear input value but keep it visible and focusable
  taskInput.value = '';
}

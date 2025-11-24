import { Haptics, ImpactStyle } from '@capacitor/haptics';


export const sketch = new p5((p) => {

  let timer = 10;
  let running = false;
  let paused = false;
  let lastTime = 0;
  let currentTaskTitle = '';

  // localStorage key for saving last task
  const LAST_TASK_KEY = 'pomodoro_last_task';

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

  p.preload = function() {
    // loadSound ya disponible globalmente
    soundEffect = p.loadSound('/sounds/short-sound.mp3');
    orbitronFont = p.loadFont('/fonts/Orbitron-Regular.ttf');
  };

  p.setup = function() {
    let cnv = p.createCanvas(400, 400, p.WEBGL);
    cnv.parent('p5-container');

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.textFont(orbitronFont);
    p.fill(255);

    const startBtn = document.getElementById('startBtn');
    const taskInput = document.getElementById('taskInput');
    const enterBtn = document.getElementById('enterBtn');
    const taskTitleDisplay = document.getElementById('task-title');
    
    // Load last task from localStorage on app start
    loadLastTask();
    
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

  p.draw = function() {
    p.background(18);
    p.ambientLight(80);
    p.directionalLight(200, 200, 200, 0, -1, 0);

    if (running && !paused) {
      let currentMillis = p.millis();
      if (currentMillis - lastTime >= 1000) {
        timer--;
        lastTime = currentMillis;
      }
    }

    // Cubo
    p.push();
    cubeY = (running && !paused) ? p.sin(p.millis() * 0.002) * 50 : 0;
    p.translate(0, cubeY, 0);
    p.rotateX(angleX);
    if (running && !paused) angleY += 0.03;
    p.rotateY(angleY);
    p.rotateZ(angleZ);
    p.box(cubeSize);
    p.pop();

    // Timer debajo del cubo
    p.push();
    p.resetMatrix();
    p.translate(0, p.height / 4, 0);
    p.textFont(orbitronFont);
    p.textSize(64);
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(timer > 0 ? timer : 0, 0, 0);
    p.pop();

    if (timer <= 0 && running && !soundPlayed) {
      // Reproducir sonido + haptics al finalizar
      if (soundEffect) soundEffect.play();
      
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
      fadeStart = p.millis();
      document.getElementById('startBtn').innerText = 'Start';
    }

    if (fadeOut) {
      let elapsed = p.millis() - fadeStart;
      if (elapsed < 2000) cubeSize = 100 * p.map(elapsed, 0, 2000, 1, 0);
      else cubeSize = 0, fadeOut = false;
    }

    if (!running && !fadeOut && !paused && timer === 10) angleZ += 0.01;
  };

  p.mousePressed = async function() {
    try {
      console.log('Click detectado');
      await Haptics.impact({ style: ImpactStyle.Light }); // espera a que se complete
      console.log('Vibración ejecutada');
    } catch (e) {
      console.log('Error Haptics at mouse pressed', e);
    }
  };

  // Funciones auxiliares para localStorage
  function saveLastTask(taskTitle) {
    try {
      localStorage.setItem(LAST_TASK_KEY, taskTitle);
      console.log('Task saved to localStorage:', taskTitle);
    } catch (e) {
      console.log('Error saving task to localStorage:', e);
    }
  }

  function loadLastTask() {
    try {
      const lastTask = localStorage.getItem(LAST_TASK_KEY);
      if (lastTask) {
        const taskInput = document.getElementById('taskInput');
        const taskTitleDisplay = document.getElementById('task-title');
        
        // Set the saved task as current task and display it in input
        currentTaskTitle = lastTask;
        taskInput.value = lastTask;
        
        // Also show it in the title display if it exists
        taskTitleDisplay.textContent = lastTask;
        taskTitleDisplay.style.display = 'block';
        
        console.log('Last task loaded from localStorage:', lastTask);
      }
    } catch (e) {
      console.log('Error loading task from localStorage:', e);
    }
  }

  function startPomodoro() {
    const taskTitleDisplay = document.getElementById('task-title');
    
    // Si no hay título guardado, usar valor del input o default
    if (!currentTaskTitle) {
      const taskInput = document.getElementById('taskInput');
      currentTaskTitle = taskInput.value.trim() || 'Pomodoro Session';
    }
    
    // Save the current task to localStorage
    saveLastTask(currentTaskTitle);
    
    // Siempre mostrar el título guardado
    taskTitleDisplay.textContent = currentTaskTitle;
    taskTitleDisplay.style.display = 'block';
    
    running = true;
    paused = false;
    lastTime = p.millis();
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


});



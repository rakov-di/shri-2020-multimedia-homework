document.addEventListener('DOMContentLoaded', function () {
  // Vars
  const controlPanel = document.querySelector('.control-panel');
  const allCameras = controlPanel.querySelector('.all-cameras');
  const inputs = controlPanel.querySelectorAll('.input');
  const diagramCol = document.querySelectorAll('.diagram__col');

  let activeVideo = null;

  // Event handlers
  document.querySelectorAll('.video').forEach(function (video) {
    video.addEventListener('click', openFullScreen);
  });

  inputs.forEach(function (input) {
    input.addEventListener('input', changeFilterValue);
  });

  allCameras.addEventListener('click', closeFullScreen);

  document.addEventListener('keydown', function(e) {
    if (e.code === 'Escape') closeFullScreen()
  });

  // Functions
  function openFullScreen(e) {
    const { target } = e;
    if (target === activeVideo) return; // если кликаем по уже открытому видео - ничего не делаем

    activeVideo = target;
    target.classList.add('video_fullscreen');

    target.addEventListener('transitionend', showControls.bind(this, target));
  }

  function showControls(target) {
    target.removeEventListener('transitionend', showControls);

    inputs.forEach(function(input) {
      input.value=activeVideo.dataset[input.id];
    })
    controlPanel.classList.remove('control-panel_hidden');
    activeVideo.controls = true;

    if (target.paused) target.play();
    else target.pause();

    if (!activeVideo.dataset.analyser) showDiagram();
  }

  function closeFullScreen() {
    activeVideo.controls = false;
    activeVideo.muted = true;
    controlPanel.classList.add('control-panel_hidden');

    controlPanel.addEventListener('transitionend', hideControls.bind(this, controlPanel));
  }

  function hideControls(controlPanel) {
    controlPanel.removeEventListener('transitionend', hideControls);

    inputs.forEach(function(input) {
      input.value='';
    })
    activeVideo.classList.remove('video_fullscreen');
    activeVideo = null;
  }

  function changeFilterValue(e) {
    const { target } = e;
    activeVideo.dataset[target.id] = target.value;
    updateVideoFilter();
  }

  function updateVideoFilter() {
    activeVideo.style.filter = `brightness(${activeVideo.dataset.brightness}%) contrast(${activeVideo.dataset.contrast}%)`;
  }

  function showDiagram() {
    activeVideo.dataset.analyser = true;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createMediaElementSource(activeVideo);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 32;
    const processor = ctx.createScriptProcessor(2048, 1, 1);

    source.connect(analyser);
    source.connect(processor);
    analyser.connect(ctx.destination);
    processor.connect(ctx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);

    requestAnimationFrame(animateDiagram)

    function animateDiagram() {
      analyser.getByteFrequencyData(data);
      diagramCol.forEach((col, i) => {
        col.style.height = `${data[i] * 100 / 256}%`;
      });
      requestAnimationFrame(animateDiagram);
    }
  }

})


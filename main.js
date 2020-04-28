document.addEventListener('DOMContentLoaded', function () {
  // Vars
  const controlPanel = document.querySelector('.control-panel');
  const allCameras = controlPanel.querySelector('.all-cameras');
  const inputs = controlPanel.querySelectorAll('.input')
  let activeVideo = null;

  // Event handlers
  document.querySelectorAll('.video').forEach(function (video) {
    video.addEventListener('click', openFullScreen);
  });

  inputs.forEach(function (input) {
    input.addEventListener('input', changeFilterValue);
  });

  allCameras.addEventListener('click', closeFullScreen);



  // Functions
  function openFullScreen(e) {
    const { target } = e;
    activeVideo = target;
    target.classList.add('video_fullscreen');
    controlPanel.classList.remove('control-panel_hidden');
    inputs.forEach(function(input) {
      input.value=activeVideo.dataset[input.id];
    })
  }

  function closeFullScreen() {
    activeVideo.classList.remove('video_fullscreen');
    activeVideo = null;
    controlPanel.classList.add('control-panel_hidden');
    inputs.forEach(function(input) {
      input.value='';
    })
  }

  function changeFilterValue(e) {
    const { target } = e;
    activeVideo.dataset[target.id] = target.value;
    updateVideoFilter();
  }

  function updateVideoFilter() {
    activeVideo.style.filter = `brightness(${activeVideo.dataset.brightness}%) contrast(${activeVideo.dataset.contrast}%)`;
  }
})

